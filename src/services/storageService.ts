import { CivicReport, Department, ActionBrief, ReportStatus, ActionStep } from '../types';
import { SEED_DEPARTMENTS, SEED_ACTION_BRIEFS, generateSyntheticReportsList } from '../data/seedData';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { generateTrackingToken, hashTrackingToken, sanitizeReportForCitizen } from '../utils/security';
import { analyzeCivicReport } from './aiEngine';

const STORAGE_KEY_REPORTS = 'civicai_reports_v1';
const STORAGE_KEY_BRIEFS = 'civicai_briefs_v1';

/**
 * Storage Service - Unified persistence abstraction supporting both
 * live Supabase Cloud PostgreSQL and Local Persistent Demo Store.
 */
class StorageService {
  private reportsCache: CivicReport[] = [];
  private briefsCache: ActionBrief[] = [];
  private initialized: boolean = false;

  constructor() {
    this.initLocalStore();
  }

  private initLocalStore() {
    if (typeof window === 'undefined') return;

    try {
      const storedReports = localStorage.getItem(STORAGE_KEY_REPORTS);
      if (storedReports) {
        this.reportsCache = JSON.parse(storedReports);
      } else {
        this.reportsCache = generateSyntheticReportsList();
        this.saveReportsLocally();
      }

      const storedBriefs = localStorage.getItem(STORAGE_KEY_BRIEFS);
      if (storedBriefs) {
        this.briefsCache = JSON.parse(storedBriefs);
      } else {
        this.briefsCache = [...SEED_ACTION_BRIEFS];
        this.saveBriefsLocally();
      }

      this.initialized = true;
    } catch (err) {
      console.warn('LocalStorage access warning, using in-memory state:', err);
      this.reportsCache = generateSyntheticReportsList();
      this.briefsCache = [...SEED_ACTION_BRIEFS];
    }
  }

  private saveReportsLocally() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(this.reportsCache));
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
      }
    }
  }

  private saveBriefsLocally() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_BRIEFS, JSON.stringify(this.briefsCache));
      } catch (e) {
        console.error('Failed to save briefs to localStorage:', e);
      }
    }
  }

  /**
   * Returns current persistence mode and status
   */
  public getStorageStatus() {
    return {
      mode: isSupabaseConfigured ? 'supabase' : 'demo_local',
      configured: isSupabaseConfigured,
      reportCount: this.reportsCache.length,
      storageName: isSupabaseConfigured ? 'Supabase PostgreSQL Cloud' : 'Browser Persistent Local Store (45+ Synthetic Records)'
    };
  }

  /**
   * Resets local persistent store back to fresh synthetic demo data
   */
  public resetToDemoData(): void {
    this.reportsCache = generateSyntheticReportsList();
    this.briefsCache = [...SEED_ACTION_BRIEFS];
    this.saveReportsLocally();
    this.saveBriefsLocally();
  }

  /**
   * Fetch all municipal departments
   */
  public async getDepartments(): Promise<Department[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('departments').select('*');
        if (!error && data && data.length > 0) {
          return data as Department[];
        }
      } catch (e) {
        console.warn('Falling back to local departments:', e);
      }
    }
    return SEED_DEPARTMENTS;
  }

  /**
   * Fetch all reports with optional filters
   */
  public async getReports(filters?: {
    category?: string;
    status?: string;
    priority?: string;
    search?: string;
  }): Promise<CivicReport[]> {
    let list: CivicReport[] = [];

    if (isSupabaseConfigured && supabase) {
      try {
        let query = supabase
          .from('reports')
          .select('*, analysis:report_ai_analysis(*), history:report_status_history(*)')
          .order('created_at', { ascending: false });

        if (filters?.category && filters.category !== 'All') {
          query = query.eq('category', filters.category);
        }
        if (filters?.status && filters.status !== 'All') {
          query = query.eq('status', filters.status);
        }
        if (filters?.priority && filters.priority !== 'All') {
          query = query.eq('priority_band', filters.priority);
        }

        const { data, error } = await query;
        if (!error && data) {
          list = data as CivicReport[];
        } else {
          list = this.reportsCache;
        }
      } catch (e) {
        console.warn('Supabase fetch failed, falling back to local cache:', e);
        list = this.reportsCache;
      }
    } else {
      list = [...this.reportsCache];
    }

    // Apply local filters if in demo mode
    if (filters) {
      if (filters.category && filters.category !== 'All') {
        list = list.filter(r => r.category === filters.category);
      }
      if (filters.status && filters.status !== 'All') {
        list = list.filter(r => r.status === filters.status);
      }
      if (filters.priority && filters.priority !== 'All') {
        list = list.filter(r => r.priorityBand === filters.priority);
      }
      if (filters.search && filters.search.trim()) {
        const term = filters.search.toLowerCase();
        list = list.filter(r =>
          r.title.toLowerCase().includes(term) ||
          r.description.toLowerCase().includes(term) ||
          r.address.toLowerCase().includes(term) ||
          (r.trackingToken && r.trackingToken.toLowerCase().includes(term))
        );
      }
    }

    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Fetch a single report by ID
   */
  public async getReportById(id: string): Promise<CivicReport | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('reports')
          .select('*, analysis:report_ai_analysis(*), history:report_status_history(*)')
          .eq('id', id)
          .single();

        if (!error && data) return data as CivicReport;
      } catch (e) {
        console.warn('Supabase fetch report by id error, checking local:', e);
      }
    }

    const found = this.reportsCache.find(r => r.id === id);
    return found ? { ...found } : null;
  }

  /**
   * Fetch report for citizen tracking by Token or ID
   * Strips confidential data (internal notes, private contact)
   */
  public async getReportByTrackingToken(tokenOrId: string): Promise<CivicReport | null> {
    const clean = tokenOrId.trim();
    if (!clean) return null;

    if (isSupabaseConfigured && supabase) {
      try {
        const hash = await hashTrackingToken(clean);
        // Call secure RPC function get_report_by_tracking_token
        const { data, error } = await supabase.rpc('get_report_by_tracking_token', {
          p_token_hash: hash
        });

        if (!error && data && data.success) {
          return data.report as CivicReport;
        }
      } catch (e) {
        console.warn('RPC tracking failed, falling back to local lookup:', e);
      }
    }

    // Local persistent search (supports token, token hash, or report id)
    const normalizedInput = clean.toUpperCase();
    const found = this.reportsCache.find(r =>
      (r.trackingToken && r.trackingToken.toUpperCase() === normalizedInput) ||
      r.id.toLowerCase() === clean.toLowerCase() ||
      r.trackingTokenHash === clean.toLowerCase()
    );

    if (found) {
      return sanitizeReportForCitizen(found);
    }

    return null;
  }

  /**
   * Submit a new citizen civic report
   */
  public async submitReport(params: {
    title?: string;
    description: string;
    category?: CivicReport['category'];
    latitude: number;
    longitude: number;
    address: string;
    imageFile?: File;
    reporterName?: string;
    reporterContact?: string;
  }): Promise<{ report: CivicReport; trackingToken: string }> {
    const trackingToken = generateTrackingToken();
    const trackingTokenHash = await hashTrackingToken(trackingToken);

    const title = params.title?.trim()
      ? params.title.trim()
      : params.description.slice(0, 50).trim() + '...';

    // Run AI Analysis Pipeline
    const analysis = await analyzeCivicReport(
      title,
      params.description,
      params.category
    );

    const reportId = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `rep-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    analysis.reportId = reportId;

    let imagePath: string | undefined = undefined;
    if (params.imageFile) {
      if (isSupabaseConfigured && supabase) {
        try {
          const ext = params.imageFile.name.split('.').pop() || 'jpg';
          const fileName = `${reportId}.${ext}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('report-evidence')
            .upload(fileName, params.imageFile);

          if (!uploadError && uploadData) {
            imagePath = uploadData.path;
          }
        } catch (e) {
          console.warn('Supabase storage upload failed:', e);
        }
      }
      if (!imagePath) {
        // Create local object URL for preview
        imagePath = URL.createObjectURL(params.imageFile);
      }
    }

    const now = new Date().toISOString();
    const newReport: CivicReport = {
      id: reportId,
      trackingToken,
      trackingTokenHash,
      title,
      description: params.description.trim(),
      category: params.category || analysis.suggestedCategory,
      latitude: params.latitude,
      longitude: params.longitude,
      address: params.address.trim(),
      imagePath,
      status: 'Submitted',
      priorityScore: analysis.priorityScore,
      priorityBand: analysis.priorityBand,
      reporterName: params.reporterName,
      reporterContact: params.reporterContact,
      createdAt: now,
      updatedAt: now,
      analysis,
      history: [
        {
          id: `h-${Date.now()}`,
          reportId,
          previousStatus: null,
          newStatus: 'Submitted',
          actorId: 'CITIZEN',
          actorName: params.reporterName || 'Citizen Guest',
          publicComment: `Report filed successfully and assigned Tracking Token ${trackingToken}.`,
          createdAt: now
        }
      ]
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('reports').insert({
          id: newReport.id,
          tracking_token_hash: newReport.trackingTokenHash,
          title: newReport.title,
          description: newReport.description,
          category: newReport.category,
          latitude: newReport.latitude,
          longitude: newReport.longitude,
          address: newReport.address,
          image_path: newReport.imagePath,
          status: newReport.status,
          priority_score: newReport.priorityScore,
          priority_band: newReport.priorityBand,
          reporter_name: newReport.reporterName,
          reporter_contact: newReport.reporterContact,
          created_at: now
        });

        await supabase.from('report_ai_analysis').insert({
          report_id: reportId,
          summary: analysis.summary,
          suggested_category: analysis.suggestedCategory,
          severity: analysis.severity,
          urgency: analysis.urgency,
          safety_risk: analysis.safetyRisk,
          public_impact: analysis.publicImpact,
          priority_score: analysis.priorityScore,
          priority_explanation: analysis.priorityExplanation,
          proposed_solution: analysis.proposedSolution,
          recommended_actions: analysis.recommendedActions,
          model_or_algorithm: analysis.modelOrAlgorithm,
          analysis_status: 'completed',
          created_at: now
        });
      } catch (err) {
        console.warn('Supabase insert failed, saving to local state:', err);
      }
    }

    // Save to local cache
    this.reportsCache.unshift(newReport);
    this.saveReportsLocally();

    return { report: newReport, trackingToken };
  }

  /**
   * Transition Report Status with workflow validation and history recording
   */
  public async updateReportStatus(params: {
    reportId: string;
    newStatus: ReportStatus;
    actorName: string;
    actorRole: string;
    publicComment?: string;
    internalNote?: string;
    resolutionSummary?: string;
    rejectionReason?: string;
  }): Promise<CivicReport> {
    const report = this.reportsCache.find(r => r.id === params.reportId);
    if (!report) {
      throw new Error(`Report not found with ID ${params.reportId}`);
    }

    // Workflow validations
    if (params.newStatus === 'Resolved' && (!params.resolutionSummary || !params.resolutionSummary.trim())) {
      throw new Error('A resolution summary is mandatory when marking a report as Resolved.');
    }
    if (params.newStatus === 'Rejected' && (!params.rejectionReason || !params.rejectionReason.trim())) {
      throw new Error('A rejection reason is mandatory when rejecting a report.');
    }

    const prevStatus = report.status;
    const now = new Date().toISOString();

    report.status = params.newStatus;
    report.updatedAt = now;

    if (params.newStatus === 'Resolved') {
      report.resolutionSummary = params.resolutionSummary?.trim();
      report.resolvedAt = now;
    }
    if (params.newStatus === 'Rejected') {
      report.rejectionReason = params.rejectionReason?.trim();
    }

    const historyItem = {
      id: `h-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      reportId: report.id,
      previousStatus: prevStatus,
      newStatus: params.newStatus,
      actorId: params.actorRole,
      actorName: params.actorName,
      publicComment: params.publicComment?.trim() || `Status updated from ${prevStatus} to ${params.newStatus}.`,
      internalNote: params.internalNote?.trim(),
      createdAt: now
    };

    if (!report.history) report.history = [];
    report.history.push(historyItem);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('reports')
          .update({
            status: report.status,
            resolution_summary: report.resolutionSummary,
            rejection_reason: report.rejectionReason,
            resolved_at: report.resolvedAt,
            updated_at: now
          })
          .eq('id', report.id);

        await supabase.from('report_status_history').insert({
          report_id: report.id,
          previous_status: prevStatus,
          new_status: params.newStatus,
          actor_id: params.actorRole,
          actor_name: params.actorName,
          public_comment: historyItem.publicComment,
          internal_note: historyItem.internalNote,
          created_at: now
        });
      } catch (err) {
        console.warn('Supabase status update error:', err);
      }
    }

    this.saveReportsLocally();
    return { ...report };
  }

  /**
   * Approve or customize proposed solution
   */
  public async updateSolution(params: {
    reportId: string;
    proposedSolution: string;
    recommendedActions: ActionStep[];
    actorName: string;
  }): Promise<CivicReport> {
    const report = this.reportsCache.find(r => r.id === params.reportId);
    if (!report) throw new Error('Report not found');

    const now = new Date().toISOString();
    if (report.analysis) {
      report.analysis.proposedSolution = params.proposedSolution;
      report.analysis.recommendedActions = params.recommendedActions;
      report.analysis.solutionApprovedBy = params.actorName;
      report.analysis.solutionApprovedAt = now;
    }
    report.updatedAt = now;

    if (!report.history) report.history = [];
    report.history.push({
      id: `h-${Date.now()}`,
      reportId: report.id,
      previousStatus: report.status,
      newStatus: report.status,
      actorId: 'STAFF',
      actorName: params.actorName,
      publicComment: 'Proposed engineering solution plan reviewed and approved.',
      internalNote: `Solution plan approved by ${params.actorName}`,
      createdAt: now
    });

    this.saveReportsLocally();
    return { ...report };
  }

  /**
   * Assign report to department and officer
   */
  public async assignReport(params: {
    reportId: string;
    departmentId: string;
    departmentName: string;
    assignedTo?: string;
    actorName: string;
  }): Promise<CivicReport> {
    const report = this.reportsCache.find(r => r.id === params.reportId);
    if (!report) throw new Error('Report not found');

    const now = new Date().toISOString();
    report.assignedDepartmentId = params.departmentId;
    report.assignedDepartmentName = params.departmentName;
    report.assignedTo = params.assignedTo || 'Department Duty Team';
    if (report.status === 'Submitted' || report.status === 'Under Review' || report.status === 'Verified') {
      report.status = 'Assigned';
    }
    report.updatedAt = now;

    if (!report.history) report.history = [];
    report.history.push({
      id: `h-${Date.now()}`,
      reportId: report.id,
      previousStatus: report.status,
      newStatus: 'Assigned',
      actorId: 'STAFF',
      actorName: params.actorName,
      publicComment: `Report assigned to ${params.departmentName}${params.assignedTo ? ` (${params.assignedTo})` : ''}.`,
      internalNote: `Assigned by ${params.actorName}`,
      createdAt: now
    });

    this.saveReportsLocally();
    return { ...report };
  }

  /**
   * Link duplicate reports
   */
  public async linkDuplicate(primaryId: string, duplicateId: string, actorName: string): Promise<void> {
    const primary = this.reportsCache.find(r => r.id === primaryId);
    const duplicate = this.reportsCache.find(r => r.id === duplicateId);
    if (!primary || !duplicate) throw new Error('Reports not found');

    duplicate.duplicateOf = primary.id;
    if (duplicate.status === 'Submitted' || duplicate.status === 'Under Review') {
      duplicate.status = 'Verified';
    }
    const now = new Date().toISOString();
    duplicate.updatedAt = now;

    if (!duplicate.history) duplicate.history = [];
    duplicate.history.push({
      id: `h-${Date.now()}`,
      reportId: duplicate.id,
      previousStatus: duplicate.status,
      newStatus: duplicate.status,
      actorId: 'STAFF',
      actorName,
      publicComment: `Linked as duplicate of primary report #${primary.id.slice(0, 8)}. Corrective actions merged.`,
      internalNote: `Confirmed duplicate by ${actorName}`,
      createdAt: now
    });

    this.saveReportsLocally();
  }

  /**
   * Fetch action briefs
   */
  public async getActionBriefs(): Promise<ActionBrief[]> {
    return [...this.briefsCache];
  }
}

export const storageService = new StorageService();
