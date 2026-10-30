import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Wrench, 
  Building2, 
  User, 
  Clock, 
  Edit3, 
  Save, 
  Link2, 
  Lock, 
  Send,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { CivicReport, ReportStatus, Department, UserRole, ActionStep } from '../types';
import { storageService } from '../services/storageService';
import { CivicMap } from '../components/CivicMap';

interface ReportDetailPageProps {
  reportId: string;
  userRole: UserRole;
  departments: Department[];
  onBack: () => void;
  onRefresh: () => void;
  onNavigateToReport?: (id: string) => void;
}

const ALL_STATUSES: ReportStatus[] = [
  'Submitted',
  'Under Review',
  'Verified',
  'Assigned',
  'In Progress',
  'Resolved',
  'Closed',
  'Rejected'
];

export const ReportDetailPage: React.FC<ReportDetailPageProps> = ({
  reportId,
  userRole,
  departments,
  onBack,
  onRefresh,
  onNavigateToReport
}) => {
  const [report, setReport] = useState<CivicReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Workflow transition form states
  const [selectedNewStatus, setSelectedNewStatus] = useState<ReportStatus>('In Progress');
  const [publicComment, setPublicComment] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [resolutionSummary, setResolutionSummary] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Assignment states
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [assignedOfficer, setAssignedOfficer] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  // Solution editing states
  const [isEditingSolution, setIsEditingSolution] = useState(false);
  const [editableSolutionText, setEditableSolutionText] = useState('');
  const [editableActions, setEditableActions] = useState<ActionStep[]>([]);

  useEffect(() => {
    loadReport();
  }, [reportId]);

  const loadReport = async () => {
    setLoading(true);
    try {
      const rep = await storageService.getReportById(reportId);
      if (rep) {
        setReport(rep);
        setSelectedNewStatus(rep.status);
        if (rep.assignedDepartmentId) {
          setSelectedDeptId(rep.assignedDepartmentId);
        }
        if (rep.assignedTo) {
          setAssignedOfficer(rep.assignedTo);
        }
        if (rep.analysis) {
          setEditableSolutionText(rep.analysis.proposedSolution);
          setEditableActions([...rep.analysis.recommendedActions]);
        }
      } else {
        setError('Report not found');
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Submit Status Change
  const handleStatusTransition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!report) return;

    if (selectedNewStatus === 'Resolved' && !resolutionSummary.trim()) {
      alert('A resolution summary is mandatory when marking a report as Resolved.');
      return;
    }
    if (selectedNewStatus === 'Rejected' && !rejectionReason.trim()) {
      alert('A rejection reason is mandatory when rejecting a report.');
      return;
    }

    setIsUpdatingStatus(true);
    try {
      const updated = await storageService.updateReportStatus({
        reportId: report.id,
        newStatus: selectedNewStatus,
        actorName: userRole === 'admin' ? 'Municipal Administrator' : 'Department Duty Officer',
        actorRole: userRole,
        publicComment: publicComment.trim() || undefined,
        internalNote: internalNote.trim() || undefined,
        resolutionSummary: selectedNewStatus === 'Resolved' ? resolutionSummary.trim() : undefined,
        rejectionReason: selectedNewStatus === 'Rejected' ? rejectionReason.trim() : undefined
      });

      setReport(updated);
      setPublicComment('');
      setInternalNote('');
      onRefresh();
      alert(`Report status successfully updated to "${selectedNewStatus}".`);
    } catch (err: any) {
      alert(err.message || 'Status transition failed.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Submit Department Assignment
  const handleAssignDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!report || !selectedDeptId) return;

    const dept = departments.find(d => d.id === selectedDeptId);
    if (!dept) return;

    setIsAssigning(true);
    try {
      const updated = await storageService.assignReport({
        reportId: report.id,
        departmentId: dept.id,
        departmentName: dept.name,
        assignedTo: assignedOfficer.trim() || undefined,
        actorName: userRole === 'admin' ? 'City Operations Admin' : 'Staff Dispatcher'
      });
      setReport(updated);
      onRefresh();
      alert(`Assigned to ${dept.name}`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsAssigning(false);
    }
  };

  // Save Modified Solution Plan
  const handleSaveSolution = async () => {
    if (!report) return;
    try {
      const updated = await storageService.updateSolution({
        reportId: report.id,
        proposedSolution: editableSolutionText,
        recommendedActions: editableActions,
        actorName: userRole === 'admin' ? 'Chief Engineer (Admin)' : 'Staff Reviewer'
      });
      setReport(updated);
      setIsEditingSolution(false);
      onRefresh();
      alert('Proposed engineering plan updated and approved.');
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold text-slate-500">Loading Report Intelligence...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="py-12 text-center space-y-4">
        <p className="text-sm text-rose-600 font-bold">{error || 'Report not found'}</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
        >
          Return to All Reports
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">
      
      {/* Back Bar & Quick Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Reports List</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200">
            {report.trackingToken || `#${report.id.slice(0, 8)}`}
          </span>

          <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
            report.status === 'Resolved'
              ? 'bg-emerald-100 text-emerald-800'
              : report.status === 'In Progress'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-slate-100 text-slate-700'
          }`}>
            {report.status}
          </span>
        </div>
      </div>

      {/* Main Two-Section Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* =========================================================================
            SECTION A: THE PROBLEM
            ========================================================================= */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-7 space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Section A: The Problem Intake</span>
              </span>

              <span className={`px-2.5 py-0.5 rounded text-[11px] font-extrabold uppercase ${
                report.priorityBand === 'Critical'
                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                  : report.priorityBand === 'High'
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-slate-100 text-slate-700'
              }`}>
                {report.priorityBand} Priority ({report.priorityScore}/100)
              </span>
            </div>

            {/* Title & Description */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">
                {report.title}
              </h2>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed">
                {report.description}
              </div>
            </div>

            {/* Photo / Evidence if uploaded */}
            {report.imagePath && (
              <div>
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
                  Citizen Uploaded Photograph:
                </span>
                <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-56 bg-slate-100">
                  <img
                    src={report.imagePath}
                    alt="Problem Evidence"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Location & Mini Map */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                Recorded Location & Coordinates:
              </span>
              <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                <MapPin className="w-4 h-4 text-teal-600 flex-shrink-0" />
                <span className="font-semibold">{report.address}</span>
                <span className="ml-auto font-mono text-[11px] text-slate-400">
                  {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                </span>
              </div>

              <div className="rounded-2xl overflow-hidden border border-slate-200">
                <CivicMap
                  reports={[report]}
                  selectedReportId={report.id}
                  height="180px"
                />
              </div>
            </div>

            {/* AI Explainable Priority Breakdown */}
            {report.analysis && (
              <div className="p-4 rounded-2xl bg-teal-50/40 border border-teal-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-teal-900">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    <span>Explainable AI Priority Breakdown</span>
                  </div>
                  {report.analysis.isSafetyOverride && (
                    <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded border border-rose-200">
                      ⚠ Life Safety Override
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-bold">Safety (35%)</span>
                    <span className="font-bold text-slate-800">{report.analysis.safetyRisk}%</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-bold">Impact (25%)</span>
                    <span className="font-bold text-slate-800">{report.analysis.publicImpact}%</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-bold">Severity (20%)</span>
                    <span className="font-bold text-slate-800">{report.analysis.severity}</span>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-bold">Urgency (10%)</span>
                    <span className="font-bold text-slate-800">{report.analysis.urgency}%</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 bg-white/70 p-2.5 rounded-xl border border-slate-100">
                  <strong>Algorithm Rationale:</strong> {report.analysis.priorityExplanation}
                </p>
              </div>
            )}

            {/* Duplicate incident link notice if linked */}
            {report.duplicateOf && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-amber-700 flex-shrink-0" />
                  <span>Linked as duplicate of primary incident: <strong>#{report.duplicateOf.slice(0, 8)}</strong></span>
                </div>
                {onNavigateToReport && (
                  <button
                    onClick={() => onNavigateToReport(report.duplicateOf!)}
                    className="font-bold text-amber-800 underline text-[11px]"
                  >
                    View Primary
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Category: <strong>{report.category}</strong></span>
            <span>Created: {new Date(report.createdAt).toLocaleString()}</span>
          </div>
        </div>

        {/* =========================================================================
            SECTION B: THE SOLUTION & AUTHORITY ACTIONS
            ========================================================================= */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-7 space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                <span>Section B: Proposed Solution & Workflow Actions</span>
              </span>

              {report.analysis?.solutionApprovedBy && (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  ✓ Solution Approved
                </span>
              )}
            </div>

            {/* Proposed Solution Plan */}
            <div className="border border-teal-200/80 bg-teal-50/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-teal-700" />
                  <span className="text-xs font-bold text-teal-950 uppercase tracking-wider">
                    Corrective Action Plan
                  </span>
                </div>

                {userRole !== 'citizen' && (
                  <button
                    onClick={() => {
                      if (isEditingSolution) {
                        handleSaveSolution();
                      } else {
                        setIsEditingSolution(true);
                      }
                    }}
                    className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                  >
                    {isEditingSolution ? (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Save & Approve Plan</span>
                      </>
                    ) : (
                      <>
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Plan</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {isEditingSolution ? (
                <textarea
                  rows={3}
                  value={editableSolutionText}
                  onChange={(e) => setEditableSolutionText(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-teal-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              ) : (
                <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed">
                  {report.analysis?.proposedSolution || 'Field assessment and corrective engineering repair.'}
                </p>
              )}

              {/* Step by step action list */}
              {report.analysis?.recommendedActions && (
                <div className="space-y-2 pt-2 border-t border-teal-100">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                    Recommended Execution Milestones:
                  </span>
                  <div className="space-y-1.5">
                    {(isEditingSolution ? editableActions : report.analysis.recommendedActions).map((act, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <span className="w-4 h-4 rounded-full bg-teal-100 text-teal-800 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                          {act.step}
                        </span>
                        <span className="flex-1">{act.action}</span>
                        <span className="text-[11px] text-slate-400 font-mono whitespace-nowrap">
                          {act.timeframe}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-teal-100 text-[11px] text-slate-500">
                <span>Target Response: <strong>~{report.analysis?.targetResponseHours || 24} hours</strong></span>
                <span>Accountable Dept: <strong>{report.analysis?.suggestedDepartmentCode || 'PWD'}</strong></span>
              </div>
            </div>

            {/* Department Assignment Section */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-600" />
                <span>Department Assignment</span>
              </span>

              {userRole !== 'citizen' ? (
                <form onSubmit={handleAssignDepartment} className="space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <select
                      value={selectedDeptId}
                      onChange={(e) => setSelectedDeptId(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Select Responsible Department</option>
                      {departments.map(d => (
                        <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                      ))}
                    </select>

                    <input
                      type="text"
                      value={assignedOfficer}
                      onChange={(e) => setAssignedOfficer(e.target.value)}
                      placeholder="Officer / Crew in charge"
                      className="px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isAssigning || !selectedDeptId}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
                  >
                    {isAssigning ? 'Assigning...' : 'Confirm Assignment'}
                  </button>
                </form>
              ) : (
                <div className="text-xs text-slate-700">
                  Assigned to: <strong>{report.assignedDepartmentName || 'Triage Pending'}</strong>
                  {report.assignedTo && <span className="text-slate-500"> ({report.assignedTo})</span>}
                </div>
              )}
            </div>

            {/* Status Transition Workflow Form (Restricted to Staff/Admin) */}
            {userRole !== 'citizen' ? (
              <form onSubmit={handleStatusTransition} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-teal-600" />
                    <span>Advance Workflow State</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Role: {userRole.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {ALL_STATUSES.map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSelectedNewStatus(st)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-center transition-all ${
                        selectedNewStatus === st
                          ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {/* Conditional Fields based on target status */}
                {selectedNewStatus === 'Resolved' && (
                  <div className="space-y-1 animate-fade-in">
                    <label className="block text-[11px] font-bold text-emerald-800 uppercase">
                      Resolution Summary <span className="text-rose-500">* (Mandatory)</span>
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={resolutionSummary}
                      onChange={(e) => setResolutionSummary(e.target.value)}
                      placeholder="Detail work performed, materials used, and sign-off certification..."
                      className="w-full p-2.5 rounded-xl border border-emerald-300 bg-emerald-50/30 text-xs focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                )}

                {selectedNewStatus === 'Rejected' && (
                  <div className="space-y-1 animate-fade-in">
                    <label className="block text-[11px] font-bold text-rose-800 uppercase">
                      Rejection Reason <span className="text-rose-500">* (Mandatory)</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="e.g. Private property jurisdiction / duplicate incident"
                      className="w-full px-3 py-2 rounded-xl border border-rose-300 bg-rose-50/30 text-xs focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-0.5">
                      Public Update (Visible to Citizen)
                    </label>
                    <input
                      type="text"
                      value={publicComment}
                      onChange={(e) => setPublicComment(e.target.value)}
                      placeholder="e.g. Crew on-site with excavator"
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-rose-600 uppercase mb-0.5 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Internal Note (Private to Staff)</span>
                    </label>
                    <input
                      type="text"
                      value={internalNote}
                      onChange={(e) => setInternalNote(e.target.value)}
                      placeholder="e.g. Sluice valve #4 needs replacement"
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isUpdatingStatus}
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  {isUpdatingStatus ? 'Recording Transition...' : `Record Status Transition to "${selectedNewStatus}"`}
                </button>
              </form>
            ) : (
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs text-slate-600">
                🔒 Authority Workflow Transitions: Switch role to <strong>Staff</strong> or <strong>Admin</strong> in the top header to approve solutions, assign departments, and advance statuses.
              </div>
            )}

            {/* Audit History Timeline */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Workflow Audit History ({report.history?.length || 0} events)
              </span>

              <div className="max-h-56 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {report.history?.map((h, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        {h.previousStatus ? `${h.previousStatus} → ` : ''}{h.newStatus}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(h.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    {h.publicComment && (
                      <p className="text-slate-600">{h.publicComment}</p>
                    )}
                    {h.internalNote && userRole !== 'citizen' && (
                      <p className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-[11px] font-mono">
                        🔒 Internal Note: {h.internalNote}
                      </p>
                    )}
                    <div className="text-[10px] text-slate-400">
                      Actor: <strong>{h.actorName}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Last Updated: {new Date(report.updatedAt).toLocaleString()}</span>
            <span>ID: {report.id}</span>
          </div>
        </div>

      </div>

    </div>
  );
};
