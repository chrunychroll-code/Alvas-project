// CivicAI Core TypeScript Definitions

export type ReportCategory =
  | 'Roads and potholes'
  | 'Waterlogging and drainage'
  | 'Waste management'
  | 'Streetlights'
  | 'Water supply and leakage'
  | 'Electrical hazards'
  | 'Public infrastructure'
  | 'Sanitation'
  | 'Traffic and road safety'
  | 'Other';

export type ReportStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Verified'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Closed'
  | 'Rejected';

export type PriorityBand = 'Low' | 'Medium' | 'High' | 'Critical';

export type UserRole = 'citizen' | 'staff' | 'admin';

export interface ActionStep {
  step: number;
  action: string;
  timeframe: string;
  completed?: boolean;
}

export interface AIAnalysis {
  id?: string;
  reportId: string;
  summary: string;
  suggestedCategory: ReportCategory;
  severity: PriorityBand;
  urgency: number; // 0 - 100
  safetyRisk: number; // 0 - 100
  publicImpact: number; // 0 - 100
  priorityScore: number; // 0 - 100
  priorityBand: PriorityBand;
  priorityExplanation: string;
  isSafetyOverride?: boolean;
  duplicateConfidence?: number;
  proposedSolution: string;
  recommendedActions: ActionStep[];
  targetResponseHours: number;
  suggestedDepartmentCode: string;
  modelOrAlgorithm: string;
  analysisStatus: 'completed' | 'pending' | 'failed';
  solutionApprovedBy?: string;
  solutionApprovedAt?: string;
  createdAt: string;
}

export interface StatusHistoryItem {
  id: string;
  reportId: string;
  previousStatus?: ReportStatus | null;
  newStatus: ReportStatus;
  actorId: string;
  actorName: string;
  publicComment?: string;
  internalNote?: string; // PRIVATE to staff/admin
  createdAt: string;
}

export interface ReportEvidence {
  id: string;
  reportId: string;
  storagePath: string;
  evidenceType: 'initial_photo' | 'inspection' | 'work_in_progress' | 'completion';
  caption?: string;
  publicVisibility: boolean;
  uploadedBy: string;
  createdAt: string;
}

export interface CivicReport {
  id: string;
  trackingToken?: string; // shown once to citizen
  trackingTokenHash: string;
  title: string;
  description: string;
  category: ReportCategory;
  latitude: number;
  longitude: number;
  address: string;
  imagePath?: string;
  status: ReportStatus;
  priorityScore: number;
  priorityBand: PriorityBand;
  assignedDepartmentId?: string;
  assignedDepartmentName?: string;
  assignedTo?: string;
  duplicateOf?: string;
  resolutionSummary?: string;
  rejectionReason?: string;
  reporterName?: string;
  reporterContact?: string; // PRIVATE
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  // Embedded relations
  analysis?: AIAnalysis;
  history?: StatusHistoryItem[];
  evidence?: ReportEvidence[];
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  contactEmail: string;
}

export interface ActionBrief {
  id: string;
  title: string;
  area: string;
  description: string;
  observedPattern: string;
  publicImpact: string;
  suggestedAction: string;
  priority: PriorityBand;
  reportIds: string[];
  geographicCenter: {
    latitude: number;
    longitude: number;
    radiusMeters: number;
  };
  confidenceScore: number;
  limitations: string;
  createdAt: string;
}

export interface DuplicateMatchResult {
  primaryReport: CivicReport;
  candidateReport: CivicReport;
  textSimilarity: number; // 0 - 100
  geoDistanceMeters: number;
  combinedConfidence: number; // 0 - 100
  reason: string;
  isConfirmedDuplicate: boolean;
}

export interface HotspotCluster {
  id: string;
  name: string;
  areaDescription: string;
  centerLat: number;
  centerLng: number;
  radiusMeters: number;
  reportCount: number;
  distinctIncidents: number;
  criticalCount: number;
  highCount: number;
  categories: { category: ReportCategory; count: number }[];
  reports: CivicReport[];
  recommendedAction: string;
  suggestedDepartment: string;
  confidence: number;
}
