import { ReportCategory, PriorityBand, ActionStep, AIAnalysis } from '../types';

/**
 * Text normalization utility for NLP analysis
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Safety keyword triggers that signify potential immediate danger to human life
 */
const SAFETY_HAZARD_KEYWORDS = [
  'exposed wire',
  'live wire',
  'sparking',
  'sparks',
  'high voltage',
  'electrocution',
  'electric shock',
  'open manhole',
  'sinkhole',
  'collapsed bridge',
  'collapsed wall',
  'building collapse',
  'gas leak',
  'gas explosion',
  'drowning',
  'high tension',
  'hanging cable'
];

const VULNERABLE_CONTEXT_KEYWORDS = [
  'school',
  'children',
  'kindergarten',
  'hospital',
  'clinic',
  'elderly',
  'submerged',
  'knee deep',
  'trapped',
  'wheelchair'
];

/**
 * Keyword dictionaries for category detection
 */
const CATEGORY_KEYWORDS: Record<ReportCategory, string[]> = {
  'Roads and potholes': ['pothole', 'potholes', 'crater', 'asphalt', 'tar', 'road broken', 'uneven road', 'tarmac', 'speed breaker', 'caving'],
  'Waterlogging and drainage': ['waterlogging', 'flooding', 'water accumulated', 'stagnant water', 'drain choked', 'stormwater', 'culvert', 'underpass flooded', 'gutter overflow', 'submerged'],
  'Waste management': ['garbage', 'trash', 'dump', 'waste', 'litter', 'dustbin', 'dumpster', 'smell', 'rotting', 'debris', 'solid waste'],
  'Streetlights': ['streetlight', 'street light', 'lamp', 'dark', 'blackout', 'pole light', 'flickering', 'no lighting', 'dark road'],
  'Water supply and leakage': ['water leak', 'pipe burst', 'drinking water', 'pipeline', 'water gushing', 'low pressure', 'contaminated water', 'tap broken'],
  'Electrical hazards': ['wire', 'sparking', 'electric', 'transformer', 'shock', 'short circuit', 'current', 'cable dangling', 'live wire', 'pole fallen'],
  'Public infrastructure': ['footpath', 'sidewalk', 'slab', 'pavement', 'railing', 'bench', 'bus stop', 'park', 'flyover', 'bridge crack', 'wall crack'],
  'Sanitation': ['sanitation', 'public toilet', 'sewage', 'manhole overflowing', 'foul odor', 'urinal', 'hygiene', 'stagnant sewage'],
  'Traffic and road safety': ['traffic signal', 'signal not working', 'stop sign', 'blind spot', 'traffic jam', 'speeding', 'zebra crossing', 'barrier broken'],
  'Other': ['general', 'civic', 'encroachment', 'noise', 'tree fallen', 'illegal board']
};

/**
 * Detects or suggests a category based on report content
 */
export function suggestCategory(title: string, description: string): ReportCategory {
  const fullText = normalizeText(`${title} ${description}`);
  
  // Electrical hazards check first for safety
  for (const kw of CATEGORY_KEYWORDS['Electrical hazards']) {
    if (fullText.includes(kw)) return 'Electrical hazards';
  }

  let bestCategory: ReportCategory = 'Other';
  let highestScore = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS) as [ReportCategory, string[]][]) {
    let score = 0;
    for (const kw of keywords) {
      if (fullText.includes(kw)) {
        score += kw.length > 5 ? 2 : 1;
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestCategory = category;
    }
  }

  return highestScore > 0 ? bestCategory : 'Other';
}

/**
 * Generates an executive municipal summary of the problem
 */
export function generateSummary(title: string, description: string, category: ReportCategory): string {
  const cleanTitle = title.trim();
  const cleanDesc = description.trim();
  
  if (cleanDesc.length <= 100) {
    return cleanDesc;
  }
  
  // Extract key clauses
  const sentences = cleanDesc.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length > 0 && sentences[0].length >= 25) {
    return `${sentences[0].trim()} [Category: ${category}].`;
  }

  return `${cleanTitle} — ${category} issue reported requiring municipal inspection and remediation.`;
}

/**
 * Explainable Priority Scoring Algorithm (0 - 100)
 * 
 * Configurable weights:
 * - Immediate Safety Risk: 35%
 * - Public Impact: 25%
 * - Issue Severity: 20%
 * - Urgency: 10%
 * - Recurrence / Corroboration: 10%
 */
export function calculatePriorityScore(
  category: ReportCategory,
  title: string,
  description: string,
  recurrenceCount: number = 0
): {
  score: number;
  band: PriorityBand;
  safetyRisk: number;
  publicImpact: number;
  severity: number;
  urgency: number;
  isSafetyOverride: boolean;
  explanation: string;
} {
  const fullText = normalizeText(`${title} ${description}`);

  // 1. Detect critical immediate safety hazard
  let hasSafetyHazard = false;
  let detectedHazard = '';
  for (const kw of SAFETY_HAZARD_KEYWORDS) {
    if (fullText.includes(kw)) {
      hasSafetyHazard = true;
      detectedHazard = kw;
      break;
    }
  }

  // Check vulnerable context
  let hasVulnerableContext = false;
  for (const vkw of VULNERABLE_CONTEXT_KEYWORDS) {
    if (fullText.includes(vkw)) {
      hasVulnerableContext = true;
      break;
    }
  }

  // Base factor evaluations (0 - 100)
  let safetyRisk = 30;
  let publicImpact = 45;
  let severity = 40;
  let urgency = 40;

  // Category specific baselines
  switch (category) {
    case 'Electrical hazards':
      safetyRisk = 90;
      severity = 85;
      urgency = 95;
      publicImpact = 70;
      break;
    case 'Water supply and leakage':
      severity = 70;
      publicImpact = 75;
      urgency = 70;
      safetyRisk = 50;
      break;
    case 'Waterlogging and drainage':
      severity = 75;
      publicImpact = 85;
      urgency = 75;
      safetyRisk = 60;
      break;
    case 'Roads and potholes':
      severity = 65;
      publicImpact = 70;
      urgency = 60;
      safetyRisk = 65; // Two-wheeler accident risk
      break;
    case 'Public infrastructure':
      severity = 60;
      publicImpact = 65;
      urgency = 55;
      safetyRisk = 55;
      break;
    case 'Traffic and road safety':
      severity = 65;
      publicImpact = 80;
      urgency = 70;
      safetyRisk = 70;
      break;
    case 'Streetlights':
      severity = 50;
      publicImpact = 60;
      urgency = 50;
      safetyRisk = 55; // Crime & pedestrian risk
      break;
    case 'Waste management':
      severity = 50;
      publicImpact = 65;
      urgency = 45;
      safetyRisk = 40;
      break;
    case 'Sanitation':
      severity = 55;
      publicImpact = 65;
      urgency = 50;
      safetyRisk = 50;
      break;
    default:
      safetyRisk = 30;
      publicImpact = 40;
      severity = 40;
      urgency = 35;
  }

  if (hasVulnerableContext) {
    safetyRisk = Math.min(100, safetyRisk + 15);
    publicImpact = Math.min(100, publicImpact + 15);
    urgency = Math.min(100, urgency + 15);
  }

  // Recurrence factor
  const recurrenceFactor = Math.min(100, recurrenceCount * 25);

  // Standard weighted calculation
  const weightedScore =
    (safetyRisk * 0.35) +
    (publicImpact * 0.25) +
    (severity * 0.20) +
    (urgency * 0.10) +
    (recurrenceFactor * 0.10);

  let finalScore = Number(weightedScore.toFixed(1));
  let isSafetyOverride = false;
  let explanation = '';

  // AUTOMATIC CRITICAL SAFETY OVERRIDE
  if (hasSafetyHazard || (category === 'Electrical hazards' && safetyRisk >= 85)) {
    isSafetyOverride = true;
    finalScore = Math.max(88.0, finalScore);
    explanation = `AUTOMATIC SAFETY OVERRIDE TRIGGERED: Immediate physical safety hazard detected (${detectedHazard || 'high voltage / structural failure'}). Routine algorithmic weighting overridden to classify as Critical to prioritize urgent human life protection.`;
  } else {
    explanation = `Priority score calculated using deterministic municipal factors: Safety Risk: ${safetyRisk}% (35% wt), Public Impact: ${publicImpact}% (25% wt), Severity: ${severity}% (20% wt), Urgency: ${urgency}% (10% wt), Corroboration: ${recurrenceFactor}% (10% wt).`;
  }

  // Priority Band determination
  let band: PriorityBand = 'Medium';
  if (finalScore >= 80) band = 'Critical';
  else if (finalScore >= 60) band = 'High';
  else if (finalScore >= 35) band = 'Medium';
  else band = 'Low';

  return {
    score: Math.min(100, Math.max(5, finalScore)),
    band,
    safetyRisk,
    publicImpact,
    severity,
    urgency,
    isSafetyOverride,
    explanation
  };
}

/**
 * Problem-To-Solution Engine
 * Returns distinct, domain-specific engineering corrective action plans
 */
export function generateSolutionPlan(
  category: ReportCategory,
  title: string,
  description: string,
  band: PriorityBand
): {
  proposedSolution: string;
  recommendedActions: ActionStep[];
  suggestedDepartmentCode: string;
  targetResponseHours: number;
} {
  const fullText = normalizeText(`${title} ${description}`);

  switch (category) {
    case 'Roads and potholes': {
      const isSevere = band === 'Critical' || band === 'High';
      return {
        proposedSolution: 'Emergency pavement isolation, fractured asphalt saw-cutting, sub-base compaction, and dense bituminous asphalt concrete restoration.',
        recommendedActions: [
          { step: 1, action: 'Place retroreflective traffic cones and warning hazard signs 25m upstream of road defect.', timeframe: isSevere ? 'Within 1 hour' : 'Within 4 hours' },
          { step: 2, action: 'Field engineer inspection to measure surface area, depth, and check for underlying pipe failure or subgrade moisture.', timeframe: 'Within 8 hours' },
          { step: 3, action: 'Excavate edges to clean rectangular geometry, clean loose aggregates, and apply cationic bituminous tack coat.', timeframe: 'Within 24 hours' },
          { step: 4, action: 'Fill and mechanically tamp hot/cold mix asphalt in uniform 50mm compacted layers flush with road grade.', timeframe: 'Within 36 hours' },
          { step: 5, action: 'Post-repair compaction inspection and reopen lane to vehicular traffic.', timeframe: 'Upon completion' }
        ],
        suggestedDepartmentCode: 'ROADS',
        targetResponseHours: isSevere ? 24 : 48
      };
    }

    case 'Waterlogging and drainage': {
      return {
        proposedSolution: 'Immediate deployment of trailer-mounted diesel dewatering pumps, manual desilting of inlet culverts, and hydraulic inspection of downstream trunk conduit.',
        recommendedActions: [
          { step: 1, action: 'Deploy emergency dewatering taskforce and set up high-output suction pumps discharging to adjacent canal.', timeframe: 'Immediate (1-2 hours)' },
          { step: 2, action: 'Deploy sanitation crew to mechanically clear plastic debris and silt from choked surface grates and gully pits.', timeframe: 'Within 3 hours' },
          { step: 3, action: 'Station road safety marshals to guide vehicles away from deep inundation zones.', timeframe: 'Immediate' },
          { step: 4, action: 'Conduct CCTV sewer crawler camera inspection to verify structural integrity of connecting stormwater conduit.', timeframe: 'Within 48 hours' }
        ],
        suggestedDepartmentCode: 'WATER',
        targetResponseHours: band === 'Critical' ? 4 : 12
      };
    }

    case 'Waste management': {
      return {
        proposedSolution: 'Dispatch 10-ton hydraulic compactor refuse vehicle, manual perimeter cleanup, bio-sanitizer application, and dumpster capacity review.',
        recommendedActions: [
          { step: 1, action: 'Dispatch specialized municipal compactor crew with heavy loading gear to collect all overflow garbage.', timeframe: 'Within 4 hours' },
          { step: 2, action: 'Wash surrounding pedestrian walkway and apply eco-friendly disinfectant and bleaching powder to neutralize odors and disease vectors.', timeframe: 'Within 6 hours' },
          { step: 3, action: 'Inspect existing bins for structural cracks, wheel damage, or missing lids; replace defective bins.', timeframe: 'Within 24 hours' },
          { step: 4, action: 'Adjust ward collection schedule from bi-weekly to daily morning pickup during peak market activity.', timeframe: 'Next planning cycle' }
        ],
        suggestedDepartmentCode: 'WASTE',
        targetResponseHours: 12
      };
    }

    case 'Streetlights': {
      return {
        proposedSolution: 'Feeder pillar distribution panel inspection, circuit breaker triage, underground cable continuity test, and LED fixture replacement.',
        recommendedActions: [
          { step: 1, action: 'Electrical technician inspection of the localized feeder pillar box for tripped MCB or burnt timer contactors.', timeframe: 'Within 8 hours' },
          { step: 2, action: 'Megger insulation testing on underground cables between adjacent poles to detect phase leakage or severed conductor.', timeframe: 'Within 16 hours' },
          { step: 3, action: 'Replace non-operational LED luminaires, photo-sensors, and surge protection devices using cherry-picker bucket truck.', timeframe: 'Within 24 hours' },
          { step: 4, action: 'Perform nighttime street lux measurement audit to confirm minimum 20-lux uniform illumination along pedestrian corridor.', timeframe: 'Next evening' }
        ],
        suggestedDepartmentCode: 'ELEC',
        targetResponseHours: 24
      };
    }

    case 'Water supply and leakage': {
      const isBurst = fullText.includes('burst') || fullText.includes('gushing') || band === 'Critical';
      return {
        proposedSolution: 'Rapid sector gate-valve isolation to stop potable water wastage, localized hydro-vacuum trenching, and installation of ductile iron split-repair sleeve.',
        recommendedActions: [
          { step: 1, action: 'Immediately dispatch valve operator to isolate nearest upstream sluice gate and control water loss.', timeframe: isBurst ? 'Within 30 mins' : 'Within 2 hours' },
          { step: 2, action: 'Identify underground telecom and electricity lines before hydro-vacuum excavation around fractured pipe segment.', timeframe: 'Within 4 hours' },
          { step: 3, action: 'Fit heavy-duty stainless steel mechanical pipe clamp or weld replacement ductile iron pipe spool.', timeframe: 'Within 8 hours' },
          { step: 4, action: 'Slowly recharge pipeline to 5 bar, inspect joint for pressure leaks, and chlorinate repaired section.', timeframe: 'Within 14 hours' },
          { step: 5, action: 'Backfill trench with compacted gravel and restore footpath surface.', timeframe: 'Within 24 hours' }
        ],
        suggestedDepartmentCode: 'WATER',
        targetResponseHours: isBurst ? 6 : 24
      };
    }

    case 'Electrical hazards': {
      return {
        proposedSolution: 'CRITICAL LIFE SAFETY PROTOCOL: Emergency sub-station feeder isolation, physical exclusion perimeter barricading, and licensed high-voltage line repair.',
        recommendedActions: [
          { step: 1, action: 'Remotely trip feeder line at local electricity sub-station and verify zero-voltage using rated field detector.', timeframe: 'Immediate (15-30 mins)' },
          { step: 2, action: 'Erect high-visibility caution barricades and station municipal marshal 15 meters around danger zone.', timeframe: 'Immediate (30 mins)' },
          { step: 3, action: 'High-voltage line crew de-energizes, grounds conductor, and restrings snapped cable or replaces damaged insulator cross-arm.', timeframe: 'Within 3 hours' },
          { step: 4, action: 'Conduct continuity and phase balance testing. Issue formal safety clearance certificate before line re-energization.', timeframe: 'Mandatory verification before resolution' }
        ],
        suggestedDepartmentCode: 'ELEC',
        targetResponseHours: 3
      };
    }

    case 'Public infrastructure': {
      return {
        proposedSolution: 'Site structural integrity assessment, public access restriction, heavy-duty precast component fabrication, and engineering load verification.',
        recommendedActions: [
          { step: 1, action: 'Inspect damaged structure and assess risk of immediate collapse or pedestrian fall injury.', timeframe: 'Within 4 hours' },
          { step: 2, action: 'Install sturdy physical barriers or detour signage around hazardous section.', timeframe: 'Within 6 hours' },
          { step: 3, action: 'Procure or fabricate replacement structural component (e.g. reinforced concrete slab, steel railing, curb stone).', timeframe: 'Within 24 hours' },
          { step: 4, action: 'Install and secure replacement element with anti-tamper anchors and mortar bedding.', timeframe: 'Within 48 hours' },
          { step: 5, action: 'Civil engineer load inspection and photographic evidence upload before signing off.', timeframe: 'Upon completion' }
        ],
        suggestedDepartmentCode: 'INFRA',
        targetResponseHours: 48
      };
    }

    case 'Sanitation': {
      return {
        proposedSolution: 'Drain jetting, biological disinfectant application, open drain desilting, and municipal public health hygiene audit.',
        recommendedActions: [
          { step: 1, action: 'Deploy high-pressure water jetting unit to clear sewer pipe obstruction.', timeframe: 'Within 6 hours' },
          { step: 2, action: 'Manual removal and bagging of sludge with protective equipment.', timeframe: 'Within 12 hours' },
          { step: 3, action: 'Spray biological larvicide and odor neutralizer across affected ground surface.', timeframe: 'Within 18 hours' },
          { step: 4, action: 'Inspect connecting sewer inspection chambers for root intrusion or illegal connections.', timeframe: 'Within 36 hours' }
        ],
        suggestedDepartmentCode: 'SAN',
        targetResponseHours: 24
      };
    }

    case 'Traffic and road safety': {
      return {
        proposedSolution: 'Traffic hazard safety assessment, traffic police coordination, signal/signage restoration, and lane demarcation.',
        recommendedActions: [
          { step: 1, action: 'Assess immediate traffic conflict point and station traffic warden if signal is dark.', timeframe: 'Within 1 hour' },
          { step: 2, action: 'Deploy traffic signals maintenance technician to service controller board or replace LED optics.', timeframe: 'Within 6 hours' },
          { step: 3, action: 'Install temporary high-intensity reflective warning signs or rubber speed cushions if required.', timeframe: 'Within 24 hours' },
          { step: 4, action: 'Log resolution with Joint Commissioner of Traffic and verify vehicular clearance.', timeframe: 'Within 48 hours' }
        ],
        suggestedDepartmentCode: 'TRAFFIC',
        targetResponseHours: 12
      };
    }

    case 'Other':
    default: {
      return {
        proposedSolution: 'Municipal field supervisor site survey, cross-department triage, and customized corrective action plan formulation.',
        recommendedActions: [
          { step: 1, action: 'Municipal field officer site visit to inspect civic observation and identify responsible agency.', timeframe: 'Within 24 hours' },
          { step: 2, action: 'Formulate specific repair/remediation plan with assigned departmental supervisor.', timeframe: 'Within 48 hours' },
          { step: 3, action: 'Carry out corrective action and record completion photographic evidence.', timeframe: 'Within 72 hours' },
          { step: 4, action: 'Contact citizen or verify field status before closing ticket.', timeframe: 'Upon completion' }
        ],
        suggestedDepartmentCode: 'INFRA',
        targetResponseHours: 72
      };
    }
  }
}

/**
 * Full AI processing pipeline for a civic report
 */
export async function analyzeCivicReport(
  title: string,
  description: string,
  userSelectedCategory?: ReportCategory,
  recurrenceCount: number = 0
): Promise<AIAnalysis> {
  // Step 1: Detect suggested category
  const suggestedCategory = suggestCategory(title, description);
  const effectiveCategory = userSelectedCategory || suggestedCategory;

  // Step 2: Generate concise executive summary
  const summary = generateSummary(title, description, effectiveCategory);

  // Step 3: Priority scoring & explainability
  const priorityResult = calculatePriorityScore(effectiveCategory, title, description, recurrenceCount);

  // Step 4: Problem-to-solution generation
  const solutionResult = generateSolutionPlan(effectiveCategory, title, description, priorityResult.band);

  return {
    reportId: '',
    summary,
    suggestedCategory,
    severity: priorityResult.band,
    urgency: priorityResult.urgency,
    safetyRisk: priorityResult.safetyRisk,
    publicImpact: priorityResult.publicImpact,
    priorityScore: priorityResult.score,
    priorityBand: priorityResult.band,
    priorityExplanation: priorityResult.explanation,
    isSafetyOverride: priorityResult.isSafetyOverride,
    proposedSolution: solutionResult.proposedSolution,
    recommendedActions: solutionResult.recommendedActions,
    targetResponseHours: solutionResult.targetResponseHours,
    suggestedDepartmentCode: solutionResult.suggestedDepartmentCode,
    modelOrAlgorithm: 'CivicAI-Deterministic-NLP-v1 (Explainable Municipal Matrix)',
    analysisStatus: 'completed',
    createdAt: new Date().toISOString()
  };
}
