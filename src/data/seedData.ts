import { CivicReport, Department, ActionBrief } from '../types';

export const SEED_DEPARTMENTS: Department[] = [
  {
    id: 'd1111111-1111-1111-1111-111111111111',
    name: 'Department of Roads & Transport',
    code: 'ROADS',
    description: 'Road repairs, potholes, sidewalks, and street safety',
    contactEmail: 'roads@civicai.gov.demo'
  },
  {
    id: 'd2222222-2222-2222-2222-222222222222',
    name: 'Water Supply & Sewerage Board',
    code: 'WATER',
    description: 'Clean water supply, burst pipelines, and drainage clearance',
    contactEmail: 'water@civicai.gov.demo'
  },
  {
    id: 'd3333333-3333-3333-3333-333333333333',
    name: 'Solid Waste Management',
    code: 'WASTE',
    description: 'Municipal waste collection, litter cleanup, and dumpster logistics',
    contactEmail: 'waste@civicai.gov.demo'
  },
  {
    id: 'd4444444-4444-4444-4444-444444444444',
    name: 'Electricity & Public Lighting',
    code: 'ELEC',
    description: 'Streetlights, electrical hazards, transformers, and cables',
    contactEmail: 'electric@civicai.gov.demo'
  },
  {
    id: 'd5555555-5555-5555-5555-555555555555',
    name: 'Public Works & Civil Infrastructure',
    code: 'INFRA',
    description: 'Bridges, public buildings, footpaths, and storm drains',
    contactEmail: 'pwd@civicai.gov.demo'
  },
  {
    id: 'd6666666-6666-6666-6666-666666666667',
    name: 'Municipal Sanitation & Health',
    code: 'SAN',
    description: 'Public health inspection, sanitation, pest control, and public toilets',
    contactEmail: 'sanitation@civicai.gov.demo'
  },
  {
    id: 'd7777777-7777-7777-7777-777777777778',
    name: 'Traffic Management & Enforcement',
    code: 'TRAFFIC',
    description: 'Traffic signals, signage, road barricades, and bottleneck mitigation',
    contactEmail: 'traffic@civicai.gov.demo'
  },
  {
    id: 'd8888888-8888-8888-8888-888888888889',
    name: 'Emergency Municipal Response Unit',
    code: 'EMERGENCY',
    description: 'Immediate public safety threats, flash floods, and fallen trees',
    contactEmail: 'emergency@civicai.gov.demo'
  }
];

export const INITIAL_SEED_REPORTS: CivicReport[] = [
  // 1. Critical Electrical Safety Hazard
  {
    id: 'a1000000-0000-0000-0000-000000000001',
    trackingToken: 'CIVIC-ELEC-4491',
    trackingTokenHash: 'hash_elec_01',
    title: 'Exposed live electrical cable dangling over pedestrian sidewalk',
    description: 'A high voltage electrical cable has snapped from the utility pole outside St. Jude Primary School on 4th Main Road and is hanging 4 feet above the flooded footpath sparking intermittently.',
    category: 'Electrical hazards',
    latitude: 12.971598,
    longitude: 77.594562,
    address: 'Opposite St. Jude Primary School, 4th Main Road, Indiranagar',
    status: 'In Progress',
    priorityScore: 98.5,
    priorityBand: 'Critical',
    assignedDepartmentId: 'd4444444-4444-4444-4444-444444444444',
    assignedDepartmentName: 'Electricity & Public Lighting',
    assignedTo: 'Officer Sharma (Rapid Electrical Crew)',
    reporterName: 'Anil Kumar',
    reporterContact: 'anil.k@example.com',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    analysis: {
      reportId: 'a1000000-0000-0000-0000-000000000001',
      summary: 'Dangling live sparking electric wire over sidewalk near school gate.',
      suggestedCategory: 'Electrical hazards',
      severity: 'Critical',
      urgency: 95,
      safetyRisk: 100,
      publicImpact: 95,
      priorityScore: 98.5,
      priorityBand: 'Critical',
      priorityExplanation: 'AUTOMATIC SAFETY OVERRIDE TRIGGERED: Exposed sparking electrical cable located on pedestrian walkway near school perimeter. Severe immediate electrocution hazard.',
      isSafetyOverride: true,
      proposedSolution: 'Immediate feeder line isolation and deployment of emergency hazard barricades followed by cable re-stringing.',
      recommendedActions: [
        { step: 1, action: 'Remotely de-energize the Indiranagar Feeder 4A line.', timeframe: 'Immediate (15 mins)' },
        { step: 2, action: 'Deploy rapid response crew to erect physical perimeter barricade 15 meters around drop zone.', timeframe: '30 mins' },
        { step: 3, action: 'Verify line grounding and replace snapped overhead insulated conductor.', timeframe: '2 hours' },
        { step: 4, action: 'Conduct continuity test and log safety compliance clearance certificate before re-energizing.', timeframe: '4 hours' }
      ],
      targetResponseHours: 3,
      suggestedDepartmentCode: 'ELEC',
      modelOrAlgorithm: 'CivicAI-Deterministic-NLP-v1 (Safety Override Engine)',
      analysisStatus: 'completed',
      solutionApprovedBy: 'Chief Engineer Patel',
      solutionApprovedAt: new Date(Date.now() - 1.5 * 3600 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
    },
    history: [
      {
        id: 'h1',
        reportId: 'a1000000-0000-0000-0000-000000000001',
        previousStatus: null,
        newStatus: 'Submitted',
        actorId: 'CITIZEN',
        actorName: 'Citizen Portal',
        publicComment: 'Report registered via emergency hotline and assigned tracking token CIVIC-ELEC-4491.',
        createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
      },
      {
        id: 'h2',
        reportId: 'a1000000-0000-0000-0000-000000000001',
        previousStatus: 'Submitted',
        newStatus: 'Under Review',
        actorId: 'SYSTEM',
        actorName: 'CivicAI Autonomous Dispatch',
        publicComment: 'Automated safety scan detected high-voltage hazard near school. Priority escalated to Critical.',
        internalNote: 'Triggered critical priority protocol. Notified electrical control room.',
        createdAt: new Date(Date.now() - 1.8 * 3600 * 1000).toISOString()
      },
      {
        id: 'h3',
        reportId: 'a1000000-0000-0000-0000-000000000001',
        previousStatus: 'Under Review',
        newStatus: 'Assigned',
        actorId: 'auth_disp_01',
        actorName: 'Chief Engineer Patel',
        publicComment: 'Assigned to Rapid Electrical Crew (Officer Sharma) with emergency priority.',
        internalNote: 'Feeder 4A isolated at 10:15 AM.',
        createdAt: new Date(Date.now() - 1.5 * 3600 * 1000).toISOString()
      },
      {
        id: 'h4',
        reportId: 'a1000000-0000-0000-0000-000000000001',
        previousStatus: 'Assigned',
        newStatus: 'In Progress',
        actorId: 'crew_02',
        actorName: 'Officer Sharma',
        publicComment: 'Crew on-site with bucket truck. Area cordoned off with high-vis caution tape. Commencing cable replacement.',
        internalNote: 'Replacing damaged insulator bracket.',
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      }
    ]
  },

  // 2. Waterlogging Hotspot - Report A
  {
    id: 'a1000000-0000-0000-0000-000000000002',
    trackingToken: 'CIVIC-WATR-8821',
    trackingTokenHash: 'hash_water_02',
    title: 'Severe waterlogging knee-deep submerging road and stalling vehicles',
    description: 'Heavy water accumulation at the 100 Feet Road underpass following rain. Two sedans are stalled in 2 feet of stagnant dirty stormwater. Storm drain grates appear clogged with plastic trash.',
    category: 'Waterlogging and drainage',
    latitude: 12.978200,
    longitude: 77.640800,
    address: '100 Feet Road Underpass, Lakeview Sector',
    status: 'Assigned',
    priorityScore: 82.0,
    priorityBand: 'Critical',
    assignedDepartmentId: 'd2222222-2222-2222-2222-222222222222',
    assignedDepartmentName: 'Water Supply & Sewerage Board',
    assignedTo: 'Drainage Taskforce Unit 3',
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    analysis: {
      reportId: 'a1000000-0000-0000-0000-000000000002',
      summary: 'Knee-deep flooding stalling commuter traffic at underpass due to choked stormwater grates.',
      suggestedCategory: 'Waterlogging and drainage',
      severity: 'Critical',
      urgency: 85,
      safetyRisk: 75,
      publicImpact: 90,
      priorityScore: 82.0,
      priorityBand: 'Critical',
      priorityExplanation: 'Critical priority assigned due to severe arterial road paralysis, vehicle submersion risk, and contaminated stormwater backflow.',
      isSafetyOverride: false,
      proposedSolution: 'Deploy mobile dewatering high-volume diesel pumps and mechanically unclog inlet grates.',
      recommendedActions: [
        { step: 1, action: 'Station traffic marshals to divert light vehicles onto elevated bypass.', timeframe: '30 mins' },
        { step: 2, action: 'Deploy two 100 HP trailer-mounted dewatering pumps to discharge water into secondary storm canal.', timeframe: '1 hour' },
        { step: 3, action: 'Manual extraction of solid waste and silt from underpass side-inlet gullies.', timeframe: '3 hours' },
        { step: 4, action: 'Verify free gravitational flow and reopen underpass.', timeframe: '5 hours' }
      ],
      targetResponseHours: 4,
      suggestedDepartmentCode: 'WATER',
      modelOrAlgorithm: 'CivicAI-Deterministic-NLP-v1',
      analysisStatus: 'completed',
      createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
    },
    history: [
      {
        id: 'h21',
        reportId: 'a1000000-0000-0000-0000-000000000002',
        previousStatus: null,
        newStatus: 'Submitted',
        actorId: 'CITIZEN',
        actorName: 'Citizen Portal',
        publicComment: 'Report filed by resident.',
        createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
      },
      {
        id: 'h22',
        reportId: 'a1000000-0000-0000-0000-000000000002',
        previousStatus: 'Submitted',
        newStatus: 'Assigned',
        actorId: 'STAFF',
        actorName: 'Executive Officer Rao',
        publicComment: 'Dispatched Drainage Taskforce Unit 3 with suction truck.',
        createdAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString()
      }
    ]
  },

  // 3. Waterlogging Hotspot - Report B
  {
    id: 'a1000000-0000-0000-0000-000000000003',
    trackingToken: 'CIVIC-WATR-8822',
    trackingTokenHash: 'hash_water_03',
    title: 'Stormwater backflow flooding residential compounds near Lakeview underpass',
    description: 'Storm drain overflowing into front gardens and basement parkings of Emerald Apartments, exactly 200m from 100ft road underpass.',
    category: 'Waterlogging and drainage',
    latitude: 12.979100,
    longitude: 77.641500,
    address: 'Emerald Apartments, Lakeview Sector',
    status: 'Verified',
    priorityScore: 76.5,
    priorityBand: 'High',
    assignedDepartmentId: 'd2222222-2222-2222-2222-222222222222',
    assignedDepartmentName: 'Water Supply & Sewerage Board',
    createdAt: new Date(Date.now() - 3.5 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    analysis: {
      reportId: 'a1000000-0000-0000-0000-000000000003',
      summary: 'Drain backflow threatening basement parking and residential yards in Lakeview.',
      suggestedCategory: 'Waterlogging and drainage',
      severity: 'High',
      urgency: 75,
      safetyRisk: 70,
      publicImpact: 80,
      priorityScore: 76.5,
      priorityBand: 'High',
      priorityExplanation: 'High priority: structural and property risk from basement inundation, shared hydraulic gradient with main underpass hotspot.',
      proposedSolution: 'Coordinate upstream de-silting and inspect connecting trunk pipeline for collapse or constriction.',
      recommendedActions: [
        { step: 1, action: 'Erect temporary sandbag berm along apartment ramp to stop basement ingress.', timeframe: '45 mins' },
        { step: 2, action: 'Clear trunk stormwater conduit confluence 150m downstream.', timeframe: '2 hours' }
      ],
      targetResponseHours: 12,
      suggestedDepartmentCode: 'WATER',
      modelOrAlgorithm: 'CivicAI-Deterministic-NLP-v1',
      analysisStatus: 'completed',
      createdAt: new Date(Date.now() - 3.5 * 3600 * 1000).toISOString()
    }
  },

  // 4. Waterlogging Hotspot - Report C
  {
    id: 'a1000000-0000-0000-0000-000000000004',
    trackingToken: 'CIVIC-WATR-8823',
    trackingTokenHash: 'hash_water_04',
    title: 'Clogged open canal culvert overflowing onto street',
    description: 'Trash accumulated at canal grating near Lakeview corner causing water overflow across the road.',
    category: 'Waterlogging and drainage',
    latitude: 12.977800,
    longitude: 77.639900,
    address: 'Canal Road Junction, Lakeview Sector',
    status: 'Under Review',
    priorityScore: 74.0,
    priorityBand: 'High',
    assignedDepartmentId: 'd2222222-2222-2222-2222-222222222222',
    assignedDepartmentName: 'Water Supply & Sewerage Board',
    createdAt: new Date(Date.now() - 2.5 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    analysis: {
      reportId: 'a1000000-0000-0000-0000-000000000004',
      summary: 'Solid waste choking canal culvert leading to road waterlogging.',
      suggestedCategory: 'Waterlogging and drainage',
      severity: 'High',
      urgency: 70,
      safetyRisk: 65,
      publicImpact: 75,
      priorityScore: 74.0,
      priorityBand: 'High',
      priorityExplanation: 'Corroborating cluster report within 250m of underpass flooding. Culvert blockage is direct hydraulic trigger.',
      proposedSolution: 'JCB backhoe deployment to hoist garbage obstruction from canal culvert screen.',
      recommendedActions: [
        { step: 1, action: 'Deploy hydraulic excavator to desilt trash screen.', timeframe: '1.5 hours' }
      ],
      targetResponseHours: 12,
      suggestedDepartmentCode: 'WATER',
      modelOrAlgorithm: 'CivicAI-Deterministic-NLP-v1',
      analysisStatus: 'completed',
      createdAt: new Date(Date.now() - 2.5 * 3600 * 1000).toISOString()
    }
  },

  // 5. Deliberate Duplicate Pair - Report 5A (Primary)
  {
    id: 'a1000000-0000-0000-0000-000000000005',
    trackingToken: 'CIVIC-ROAD-1191',
    trackingTokenHash: 'hash_road_05',
    title: 'Large crater pothole on MG Road near Metro Pillar 142',
    description: 'A 2-foot deep, 4-foot wide pothole right in the central lane opposite Metro Pillar 142. Several two-wheeler riders have lost balance and broken vehicle rims.',
    category: 'Roads and potholes',
    latitude: 12.974500,
    longitude: 77.608300,
    address: 'Opposite Metro Pillar 142, MG Road',
    status: 'In Progress',
    priorityScore: 84.5,
    priorityBand: 'Critical',
    assignedDepartmentId: 'd1111111-1111-1111-1111-111111111111',
    assignedDepartmentName: 'Department of Roads & Transport',
    assignedTo: 'Road Maintenance Unit North',
    createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    analysis: {
      reportId: 'a1000000-0000-0000-0000-000000000005',
      summary: 'Deep dangerous crater pothole in central lane causing two-wheeler accidents on major arterial road.',
      suggestedCategory: 'Roads and potholes',
      severity: 'Critical',
      urgency: 88,
      safetyRisk: 92,
      publicImpact: 85,
      priorityScore: 84.5,
      priorityBand: 'Critical',
      priorityExplanation: 'Immediate physical injury risk to motorcyclists on high-speed arterial corridor. Urgent cold/hot mix asphalt patch required.',
      proposedSolution: 'Emergency barricading and mastic asphalt cold-patch compaction.',
      recommendedActions: [
        { step: 1, action: 'Place retroreflective traffic cones and flashing hazard sign 20m ahead.', timeframe: '30 mins' },
        { step: 2, action: 'Excavate fractured asphalt edges to square geometry and clear debris.', timeframe: '1.5 hours' },
        { step: 3, action: 'Apply tack coat and compact dense bituminous concrete in 50mm lifts.', timeframe: '3 hours' },
        { step: 4, action: 'Level flush with road surface and reopen lane.', timeframe: '4 hours' }
      ],
      targetResponseHours: 24,
      suggestedDepartmentCode: 'ROADS',
      modelOrAlgorithm: 'CivicAI-Deterministic-NLP-v1',
      analysisStatus: 'completed',
      createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString()
    }
  },

  // 6. Deliberate Duplicate Pair - Report 5B (Duplicate of 5A)
  {
    id: 'a1000000-0000-0000-0000-000000000006',
    trackingToken: 'CIVIC-ROAD-1192',
    trackingTokenHash: 'hash_road_06',
    title: 'Huge pothole near pillar 142 on MG Road damaging cars',
    description: 'Very bad crater near metro pillar 142 MG Road. Vehicles swerving sharply to avoid it, causing near misses.',
    category: 'Roads and potholes',
    latitude: 12.974520,
    longitude: 77.608330,
    address: 'Near MG Road Metro Pillar 142',
    status: 'Verified',
    priorityScore: 83.0,
    priorityBand: 'Critical',
    assignedDepartmentId: 'd1111111-1111-1111-1111-111111111111',
    assignedDepartmentName: 'Department of Roads & Transport',
    duplicateOf: 'a1000000-0000-0000-0000-000000000005',
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    analysis: {
      reportId: 'a1000000-0000-0000-0000-000000000006',
      summary: 'Duplicate report: Deep pothole at Pillar 142 MG Road.',
      suggestedCategory: 'Roads and potholes',
      severity: 'Critical',
      urgency: 85,
      safetyRisk: 90,
      publicImpact: 85,
      priorityScore: 83.0,
      priorityBand: 'Critical',
      priorityExplanation: 'HIGH CONFIDENCE DUPLICATE (94% confidence). Within 4 meters of primary report a100...005.',
      duplicateConfidence: 94.5,
      proposedSolution: 'Linked to Primary Report #005. Corrective actions consolidated under primary work order.',
      recommendedActions: [
        { step: 1, action: 'Consolidate into primary work order for Road Maintenance Unit North.', timeframe: 'Done' }
      ],
      targetResponseHours: 24,
      suggestedDepartmentCode: 'ROADS',
      modelOrAlgorithm: 'CivicAI-Deterministic-NLP-v1 (Duplicate Corroboration)',
      analysisStatus: 'completed',
      createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString()
    }
  },

  // 7. Waste Management
  {
    id: 'a1000000-0000-0000-0000-000000000007',
    trackingToken: 'CIVIC-WAST-3301',
    trackingTokenHash: 'hash_waste_07',
    title: 'Massive garbage dump overflowing across vegetable market entrance',
    description: 'Commercial dumpsters have not been emptied for 4 days. Rotting vegetable waste and wet garbage has spilled 20 meters across the lane attracting strays and generating foul stench.',
    category: 'Waste management',
    latitude: 12.966200,
    longitude: 77.585500,
    address: 'Gate 2, Central Vegetable Market, City Core',
    status: 'Assigned',
    priorityScore: 68.0,
    priorityBand: 'High',
    assignedDepartmentId: 'd3333333-3333-3333-3333-333333333333',
    assignedDepartmentName: 'Solid Waste Management',
    createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    analysis: {
      reportId: 'a1000000-0000-0000-0000-000000000007',
      summary: '4-day accumulation of decomposing market waste spilling into public pedestrian thoroughfare.',
      suggestedCategory: 'Waste management',
      severity: 'High',
      urgency: 70,
      safetyRisk: 60,
      publicImpact: 75,
      priorityScore: 68.0,
      priorityBand: 'High',
      priorityExplanation: 'High public health and sanitation impact in densely populated marketplace. Risk of vector-borne contamination.',
      proposedSolution: 'Dispatch municipal compactor truck, sanitize perimeter with lime powder, and review market collection roster.',
      recommendedActions: [
        { step: 1, action: 'Dispatch 10-ton hydraulic compactor truck with 4 loaders.', timeframe: '1.5 hours' },
        { step: 2, action: 'Spray eco-friendly disinfectant and spread bleaching powder.', timeframe: '2.5 hours' },
        { step: 3, action: 'Replace bent dumpster lids to prevent stray dog access.', timeframe: 'Next day' }
      ],
      targetResponseHours: 12,
      suggestedDepartmentCode: 'WASTE',
      modelOrAlgorithm: 'CivicAI-Deterministic-NLP-v1',
      analysisStatus: 'completed',
      createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString()
    }
  },

  // 8. Broken Streetlights
  {
    id: 'a1000000-0000-0000-0000-000000000008',
    trackingToken: 'CIVIC-LGHT-7701',
    trackingTokenHash: 'hash_light_08',
    title: 'Continuous series of 6 LED streetlights non-functional on Ring Road',
    description: 'Complete blackout on a 400m stretch of Outer Ring Road between 14th Cross and 18th Cross. Pedestrians cannot see oncoming traffic at night.',
    category: 'Streetlights',
    latitude: 12.935200,
    longitude: 77.624400,
    address: 'Ring Road stretch between 14th & 18th Cross, Koramangala',
    status: 'Under Review',
    priorityScore: 62.0,
    priorityBand: 'High',
    assignedDepartmentId: 'd4444444-4444-4444-4444-444444444444',
    assignedDepartmentName: 'Electricity & Public Lighting',
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    analysis: {
      reportId: 'a1000000-0000-0000-0000-000000000008',
      summary: '400-meter street lighting outage on arterial ring road elevating pedestrian hazard and crime vulnerability.',
      suggestedCategory: 'Streetlights',
      severity: 'High',
      urgency: 65,
      safetyRisk: 70,
      publicImpact: 60,
      priorityScore: 62.0,
      priorityBand: 'High',
      priorityExplanation: 'Multiple consecutive lamp outages suggest phase cable trip or blown timer relay in feeder pillar box.',
      proposedSolution: 'Inspect feeder distribution box MCB and replace burned out LED driver modules.',
      recommendedActions: [
        { step: 1, action: 'Inspect feeder pillar FP-12 timer contactor switch.', timeframe: '4 hours' },
        { step: 2, action: 'Check underground phase continuity between pole #14 and #15.', timeframe: '6 hours' },
        { step: 3, action: 'Perform night-time luminescence audit.', timeframe: '24 hours' }
      ],
      targetResponseHours: 24,
      suggestedDepartmentCode: 'ELEC',
      modelOrAlgorithm: 'CivicAI-Deterministic-NLP-v1',
      analysisStatus: 'completed',
      createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString()
    }
  },

  // 9. Water Pipe Rupture
  {
    id: 'a1000000-0000-0000-0000-000000000009',
    trackingToken: 'CIVIC-WATR-9901',
    trackingTokenHash: 'hash_water_09',
    title: 'Major potable water pipeline fractured gushing thousands of liters',
    description: 'A 12-inch potable feeder pipe has ruptured under the sidewalk, shooting water 6 feet in the air and washing away subsoil gravel.',
    category: 'Water supply and leakage',
    latitude: 12.982000,
    longitude: 77.599000,
    address: 'Corner of Queens Road and Thimmaiah Road',
    status: 'In Progress',
    priorityScore: 86.0,
    priorityBand: 'Critical',
    assignedDepartmentId: 'd2222222-2222-2222-2222-222222222222',
    assignedDepartmentName: 'Water Supply & Sewerage Board',
    createdAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    analysis: {
      reportId: 'a1000000-0000-0000-0000-000000000009',
      summary: 'High-pressure main water pipe fracture causing massive potable water loss and road foundation erosion.',
      suggestedCategory: 'Water supply and leakage',
      severity: 'Critical',
      urgency: 92,
      safetyRisk: 75,
      publicImpact: 90,
      priorityScore: 86.0,
      priorityBand: 'Critical',
      priorityExplanation: 'High severity water resource loss and imminent risk of pavement collapse due to underground soil washout.',
      proposedSolution: 'Isolate section control gate valve and weld ductile iron split repair sleeve.',
      recommendedActions: [
        { step: 1, action: 'Shut off Sector S-4 gate valve at Queens junction.', timeframe: '15 mins' },
        { step: 2, action: 'Excavate around rupture site using hydro-vac to protect fiber cables.', timeframe: '1.5 hours' },
        { step: 3, action: 'Install 300mm mechanical repair clamp.', timeframe: '3.5 hours' },
        { step: 4, action: 'Pressure test pipeline at 6 bar before backfilling.', timeframe: '5 hours' }
      ],
      targetResponseHours: 6,
      suggestedDepartmentCode: 'WATER',
      modelOrAlgorithm: 'CivicAI-Deterministic-NLP-v1',
      analysisStatus: 'completed',
      createdAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString()
    }
  },

  // 10. Fully Resolved Report with Verified Completion Evidence
  {
    id: 'a1000000-0000-0000-0000-000000000010',
    trackingToken: 'CIVIC-INFR-5501',
    trackingTokenHash: 'hash_infra_10',
    title: 'Broken concrete slab on pedestrian footpath creating 3-meter deep trench',
    description: 'Pedestrian slab collapsed into storm canal near Victoria Hospital bus stop. Huge fall risk for elderly patients.',
    category: 'Public infrastructure',
    latitude: 12.961100,
    longitude: 77.574200,
    address: 'Victoria Hospital Bus Stop, Fort Road',
    status: 'Resolved',
    priorityScore: 78.0,
    priorityBand: 'High',
    assignedDepartmentId: 'd5555555-5555-5555-5555-555555555555',
    assignedDepartmentName: 'Public Works & Civil Infrastructure',
    assignedTo: 'Engineer David Rao',
    resolutionSummary: 'Damaged pre-cast slab removed. Reinforced RCC M30 concrete slab installed and secured with steel rebar cleats. Antiskid surface pattern completed and certified safe.',
    resolvedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    analysis: {
      reportId: 'a1000000-0000-0000-0000-000000000010',
      summary: 'Collapsed footpath slab over deep canal beside hospital bus stop.',
      suggestedCategory: 'Public infrastructure',
      severity: 'High',
      urgency: 80,
      safetyRisk: 85,
      publicImpact: 75,
      priorityScore: 78.0,
      priorityBand: 'High',
      priorityExplanation: 'High safety hazard for pedestrian hospital visitors. Direct fall risk into deep storm drain.',
      proposedSolution: 'Replace collapsed slab with heavy-duty reinforced precast concrete panel.',
      recommendedActions: [
        { step: 1, action: 'Erect barricades around footfall drop.', timeframe: 'Completed' },
        { step: 2, action: 'Craned placement of 100mm RCC slab.', timeframe: 'Completed' },
        { step: 3, action: 'Quality assurance and deflection load testing.', timeframe: 'Completed' }
      ],
      targetResponseHours: 48,
      suggestedDepartmentCode: 'INFRA',
      modelOrAlgorithm: 'CivicAI-Deterministic-NLP-v1',
      analysisStatus: 'completed',
      solutionApprovedBy: 'Director PWD',
      solutionApprovedAt: new Date(Date.now() - 60 * 3600 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString()
    },
    history: [
      {
        id: 'h101',
        reportId: 'a1000000-0000-0000-0000-000000000010',
        previousStatus: null,
        newStatus: 'Submitted',
        actorId: 'CITIZEN',
        actorName: 'Hospital Visitor',
        publicComment: 'Submitted with photo of open trench.',
        createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString()
      },
      {
        id: 'h102',
        reportId: 'a1000000-0000-0000-0000-000000000010',
        previousStatus: 'Submitted',
        newStatus: 'Assigned',
        actorId: 'admin_01',
        actorName: 'Admin Staff',
        publicComment: 'Assigned to Engineer David Rao (PWD South Zone).',
        internalNote: 'Hospital corridor requires immediate triage.',
        createdAt: new Date(Date.now() - 60 * 3600 * 1000).toISOString()
      },
      {
        id: 'h103',
        reportId: 'a1000000-0000-0000-0000-000000000010',
        previousStatus: 'Assigned',
        newStatus: 'In Progress',
        actorId: 'eng_rao',
        actorName: 'Engineer David Rao',
        publicComment: 'Barricades placed. Replacement slab ordered from casting yard.',
        createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
      },
      {
        id: 'h104',
        reportId: 'a1000000-0000-0000-0000-000000000010',
        previousStatus: 'In Progress',
        newStatus: 'Resolved',
        actorId: 'eng_rao',
        actorName: 'Engineer David Rao',
        publicComment: 'New RCC slab installed, grouted, and inspected. Safe for pedestrian transit.',
        internalNote: 'Work verified and signed off by PWD Inspector Khan.',
        createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
      }
    ]
  }
];

// Helper to generate reports 11 through 45 dynamically for the synthetic dataset
export function generateSyntheticReportsList(): CivicReport[] {
  const reports: CivicReport[] = [...INITIAL_SEED_REPORTS];
  
  const categories: CivicReport['category'][] = [
    'Roads and potholes',
    'Waterlogging and drainage',
    'Waste management',
    'Streetlights',
    'Water supply and leakage',
    'Electrical hazards',
    'Public infrastructure',
    'Sanitation',
    'Traffic and road safety',
    'Other'
  ];

  const statuses: CivicReport['status'][] = [
    'Submitted',
    'Under Review',
    'Verified',
    'Assigned',
    'In Progress',
    'Resolved'
  ];

  const departments = SEED_DEPARTMENTS;

  for (let i = 11; i <= 45; i++) {
    const id = `a1000000-0000-0000-0000-${String(i).padStart(12, '0')}`;
    const category = categories[i % categories.length];
    const status = statuses[i % statuses.length];
    const dept = departments[i % departments.length];
    
    // Spread coordinates around metropolitan area
    const lat = 12.935000 + ((i * 19) % 650) * 0.00018;
    const lng = 77.565000 + ((i * 27) % 750) * 0.00017;
    
    // Calculate priority
    const priority = 32 + ((i * 17) % 64);
    let band: CivicReport['priorityBand'] = 'Medium';
    if (priority >= 80) band = 'Critical';
    else if (priority >= 60) band = 'High';
    else if (priority >= 35) band = 'Medium';
    else band = 'Low';

    const hoursAgo = (i * 2.8);
    const createdAt = new Date(Date.now() - hoursAgo * 3600 * 1000).toISOString();
    const isResolved = status === 'Resolved';

    reports.push({
      id,
      trackingToken: `CIVIC-${dept.code.slice(0, 4)}-${1000 + i}`,
      trackingTokenHash: `hash_demo_${i}`,
      title: `${category} issue near Sector ${((i % 14) + 1)} Cross`,
      description: `Civic problem observed regarding ${category.toLowerCase()} causing disruption to residents and commuters near Block ${i}.`,
      category,
      latitude: Number(lat.toFixed(6)),
      longitude: Number(lng.toFixed(6)),
      address: `Sector ${((i % 14) + 1)} Main, Ward ${((i % 8) + 1)}`,
      status,
      priorityScore: priority,
      priorityBand: band,
      assignedDepartmentId: dept.id,
      assignedDepartmentName: dept.name,
      assignedTo: status !== 'Submitted' ? `Field Officer ${['Sharma', 'Iyer', 'Patel', 'Naidu', 'Rao'][i % 5]}` : undefined,
      resolutionSummary: isResolved ? 'Remediation completed by municipal field team following standard operating procedure.' : undefined,
      resolvedAt: isResolved ? new Date(Date.now() - 6 * 3600 * 1000).toISOString() : undefined,
      createdAt,
      updatedAt: new Date(Date.now() - (hoursAgo / 2) * 3600 * 1000).toISOString(),
      analysis: {
        reportId: id,
        summary: `Automated analysis for ${category.toLowerCase()} report at Sector ${((i % 14) + 1)}.`,
        suggestedCategory: category,
        severity: band,
        urgency: Math.round(priority * 0.9),
        safetyRisk: Math.round(priority * 0.85),
        publicImpact: Math.round(priority * 0.95),
        priorityScore: priority,
        priorityBand: band,
        priorityExplanation: `Calculated from municipal criteria: Safety Risk: ${Math.round(priority * 0.85)}%, Public Impact: ${Math.round(priority * 0.95)}%, Severity: ${band}.`,
        proposedSolution: `Standard departmental resolution workflow for ${category}.`,
        recommendedActions: [
          { step: 1, action: 'Field assessment and initial containment', timeframe: 'Within 24h' },
          { step: 2, action: 'Execute corrective engineering or sanitation repair', timeframe: 'Within 48h' },
          { step: 3, action: 'Inspect and log completion evidence', timeframe: 'Upon completion' }
        ],
        targetResponseHours: band === 'Critical' ? 6 : band === 'High' ? 24 : 48,
        suggestedDepartmentCode: dept.code,
        modelOrAlgorithm: 'CivicAI-Deterministic-NLP-v1',
        analysisStatus: 'completed',
        createdAt
      },
      history: [
        {
          id: `h-init-${i}`,
          reportId: id,
          previousStatus: null,
          newStatus: 'Submitted',
          actorId: 'CITIZEN',
          actorName: 'Citizen Portal',
          publicComment: 'Report registered successfully.',
          createdAt
        }
      ]
    });
  }

  return reports;
}

export const SEED_ACTION_BRIEFS: ActionBrief[] = [
  {
    id: 'brief-01',
    title: 'Action Brief: Chronic Drainage Backflow & Underpass Flooding',
    area: 'Lakeview Sector & 100 Feet Road Corridor',
    description: 'Three separate waterlogging and overflow incidents detected within a 280-meter radius over a 4-hour window.',
    observedPattern: 'Multiple high-severity water accumulation reports clustering around 100ft road underpass and adjacent Emerald residential basements during moderate rainfall.',
    publicImpact: 'Stalled motor vehicles, road closure of key arterial corridor, risk of basement flooding and health hazards from sewer overflow.',
    suggestedAction: 'Deploy two high-capacity dewatering pump units to clear underpass immediately. Clear the bottleneck trash screen at the canal culvert confluence. Conduct hydraulic drone inspection of the downstream stormwater conduit to detect structural silting.',
    priority: 'Critical',
    reportIds: ['a1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000004'],
    geographicCenter: {
      latitude: 12.978366,
      longitude: 77.640733,
      radiusMeters: 280
    },
    confidenceScore: 94.0,
    limitations: 'Confidence is high based on spatial and temporal proximity. Physical cause (culvert choke vs pump failure) requires on-site confirmation.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'brief-02',
    title: 'Action Brief: Pothole & Road Surface Deterioration Corridor',
    area: 'MG Road Metro Corridor (Pillars 130-150)',
    description: 'Repeated citizen reports of deep craters in central and right lanes causing vehicular damage.',
    observedPattern: 'Clusters of pothole complaints aligned with Metro construction zone drainage runoff.',
    publicImpact: 'Severe accident risk for two-wheelers, wheel alignment damage to buses and private cars, traffic congestion averaging 25-minute delays.',
    suggestedAction: 'Deploy Road Maintenance Unit North with hot-mix bituminous compound. Install temporary barricading and warning lights during night repair window (11 PM - 5 AM).',
    priority: 'High',
    reportIds: ['a1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000006'],
    geographicCenter: {
      latitude: 12.974510,
      longitude: 77.608315,
      radiusMeters: 50
    },
    confidenceScore: 98.0,
    limitations: 'Confirmed duplicate and proximity corroboration. Requires traffic police coordination for night lane closure.',
    createdAt: new Date().toISOString()
  }
];
