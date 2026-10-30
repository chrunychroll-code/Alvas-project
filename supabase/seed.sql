-- ============================================================================
-- CivicAI — Smart City Issue Intelligence
-- Supabase SQL Seed Script: seed.sql (40+ Synthetic Demonstration Reports)
-- ============================================================================

-- Clean existing demo data if re-seeding
TRUNCATE TABLE action_briefs CASCADE;
TRUNCATE TABLE report_evidence CASCADE;
TRUNCATE TABLE report_links CASCADE;
TRUNCATE TABLE report_status_history CASCADE;
TRUNCATE TABLE report_ai_analysis CASCADE;
TRUNCATE TABLE reports CASCADE;
TRUNCATE TABLE departments CASCADE;

-- ----------------------------------------------------------------------------
-- 1. DEPARTMENTS
-- ----------------------------------------------------------------------------
INSERT INTO departments (id, name, code, description, contact_email) VALUES
('d1111111-1111-1111-1111-111111111111', 'Department of Roads & Transport', 'ROADS', 'Road repairs, potholes, sidewalks, and street safety', 'roads@civicai.gov.demo'),
('d2222222-2222-2222-2222-222222222222', 'Water Supply & Sewerage Board', 'WATER', 'Clean water supply, burst pipelines, and drainage clearance', 'water@civicai.gov.demo'),
('d3333333-3333-3333-3333-333333333333', 'Solid Waste Management', 'WASTE', 'Municipal waste collection, litter cleanup, and dumpster logistics', 'waste@civicai.gov.demo'),
('d4444444-4444-4444-4444-444444444444', 'Electricity & Public Lighting', 'ELEC', 'Streetlights, electrical hazards, transformers, and cables', 'electric@civicai.gov.demo'),
('d5555555-5555-5555-5555-555555555555', 'Public Works & Civil Infrastructure', 'INFRA', 'Bridges, public buildings, footpaths, and storm drains', 'pwd@civicai.gov.demo'),
('d6666666-6666-6666-6666-666666666667', 'Municipal Sanitation & Health', 'SAN', 'Public health inspection, sanitation, pest control, and public toilets', 'sanitation@civicai.gov.demo'),
('d7777777-7777-7777-7777-777777777778', 'Traffic Management & Enforcement', 'TRAFFIC', 'Traffic signals, signage, road barricades, and bottleneck mitigation', 'traffic@civicai.gov.demo'),
('d8888888-8888-8888-8888-888888888889', 'Emergency Municipal Response Unit', 'EMERGENCY', 'Immediate public safety threats, flash floods, and fallen trees', 'emergency@civicai.gov.demo');

-- ----------------------------------------------------------------------------
-- 2. SEED CIVIC REPORTS & AI ANALYSIS
-- ----------------------------------------------------------------------------

-- R1: Critical Safety Hazard - Exposed Live Wire
INSERT INTO reports (id, tracking_token_hash, title, description, category, latitude, longitude, address, status, priority_score, priority_band, assigned_department_id, assigned_to, created_at)
VALUES (
  'a1000000-0000-0000-0000-000000000001',
  encode(digest('TRACK-ELEC-01', 'sha256'), 'hex'),
  'Exposed live electrical cable dangling over pedestrian sidewalk',
  'A high voltage electrical cable has snapped from the utility pole outside St. Jude School on 4th Main Road and is hanging 4 feet above the flooded footpath sparking intermittently.',
  'Electrical hazards',
  12.971598, 77.594562,
  'Opposite St. Jude Primary School, 4th Main, Indiranagar',
  'In Progress',
  98.50, 'Critical',
  'd4444444-4444-4444-4444-444444444444',
  'Officer Sharma (Rapid Electrical Crew)',
  NOW() - INTERVAL '2 hours'
);

INSERT INTO report_ai_analysis (report_id, summary, suggested_category, severity, urgency, safety_risk, public_impact, priority_score, priority_explanation, proposed_solution, recommended_actions, analysis_status)
VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'Dangling live sparking electric wire over sidewalk near school gate.',
  'Electrical hazards',
  'Critical', 95.0, 100.0, 95.0, 98.50,
  'AUTOMATIC SAFETY OVERRIDE TRIGGERED. Exposed sparking electrical cable located on pedestrian walkway near school perimeter. Severe immediate electrocution hazard.',
  'Immediate feeder line isolation and deployment of emergency hazard barricades followed by cable re-stringing.',
  '[
    {"step": 1, "action": "Remotely de-energize the Indiranagar Feeder 4A line.", "timeframe": "Immediate (15 mins)"},
    {"step": 2, "action": "Deploy rapid response crew to erect physical perimeter barricade 15 meters around drop zone.", "timeframe": "30 mins"},
    {"step": 3, "action": "Verify line grounding and replace snapped overhead insulated conductor.", "timeframe": "2 hours"},
    {"step": 4, "action": "Conduct continuity test and log safety compliance clearance certificate before re-energizing.", "timeframe": "4 hours"}
  ]'::jsonb,
  'completed'
);

INSERT INTO report_status_history (report_id, previous_status, new_status, actor_id, actor_name, public_comment, internal_note)
VALUES
('a1000000-0000-0000-0000-000000000001', 'Submitted', 'Under Review', 'SYSTEM', 'CivicAI Autonomous Dispatch', 'Automated safety scan detected high-voltage hazard near school.', 'Triggered critical priority protocol. Notified electrical control room.'),
('a1000000-0000-0000-0000-000000000001', 'Under Review', 'Assigned', 'auth_disp_01', 'Chief Engineer Patel', 'Assigned with emergency escalation to Rapid Electrical Crew.', 'Feeder 4A isolated at 10:15 AM.'),
('a1000000-0000-0000-0000-000000000001', 'Assigned', 'In Progress', 'crew_lead_02', 'Officer Sharma', 'Crew on-site with bucket truck. Area cordoned off with high-vis caution tape.', 'Replacing damaged insulator bracket.');

-- R2: Severe Waterlogging Cluster - Report A (Lakeview)
INSERT INTO reports (id, tracking_token_hash, title, description, category, latitude, longitude, address, status, priority_score, priority_band, assigned_department_id, assigned_to, created_at)
VALUES (
  'a1000000-0000-0000-0000-000000000002',
  encode(digest('TRACK-WATER-02', 'sha256'), 'hex'),
  'Severe waterlogging knee-deep submerging road and stalling vehicles',
  'Heavy water accumulation at the 100 Feet Road underpass following rain. Two sedans are stalled in 2 feet of stagnant dirty stormwater. Storm drain grates appear clogged with plastic trash.',
  'Waterlogging and drainage',
  12.978200, 77.640800,
  '100 Feet Road Underpass, Lakeview Sector',
  'Assigned',
  82.00, 'Critical',
  'd2222222-2222-2222-2222-222222222222',
  'Drainage Taskforce Unit 3',
  NOW() - INTERVAL '4 hours'
);

INSERT INTO report_ai_analysis (report_id, summary, suggested_category, severity, urgency, safety_risk, public_impact, priority_score, priority_explanation, proposed_solution, recommended_actions, analysis_status)
VALUES (
  'a1000000-0000-0000-0000-000000000002',
  'Knee-deep flooding stalling commuter traffic at underpass due to choked stormwater grates.',
  'Waterlogging and drainage',
  'Critical', 85.0, 75.0, 90.0, 82.00,
  'Critical priority assigned due to severe arterial road paralysis, vehicle submersion risk, and contaminated stormwater backflow.',
  'Deploy mobile dewatering high-volume diesel pumps and mechanically unclog inlet grates.',
  '[
    {"step": 1, "action": "Station traffic marshals to divert light vehicles onto elevated bypass.", "timeframe": "30 mins"},
    {"step": 2, "action": "Deploy two 100 HP trailer-mounted dewatering pumps to discharge water into secondary storm canal.", "timeframe": "1 hour"},
    {"step": 3, "action": "Manual extraction of solid waste and silt from underpass side-inlet gullies.", "timeframe": "3 hours"},
    {"step": 4, "action": "Verify free gravitational flow and reopen underpass.", "timeframe": "5 hours"}
  ]'::jsonb,
  'completed'
);

-- R3: Waterlogging Cluster - Report B (Corroborating/Hotspot nearby)
INSERT INTO reports (id, tracking_token_hash, title, description, category, latitude, longitude, address, status, priority_score, priority_band, assigned_department_id, created_at)
VALUES (
  'a1000000-0000-0000-0000-000000000003',
  encode(digest('TRACK-WATER-03', 'sha256'), 'hex'),
  'Stormwater backflow flooding residential compounds near Lakeview underpass',
  'Storm drain overflowing into front gardens and basement parkings of Emerald Apartments, exactly 200m from 100ft road underpass.',
  'Waterlogging and drainage',
  12.979100, 77.641500,
  'Emerald Apartments, Lakeview Sector',
  'Verified',
  76.50, 'High',
  'd2222222-2222-2222-2222-222222222222',
  NOW() - INTERVAL '3 hours'
);

INSERT INTO report_ai_analysis (report_id, summary, suggested_category, severity, urgency, safety_risk, public_impact, priority_score, priority_explanation, proposed_solution, recommended_actions, analysis_status)
VALUES (
  'a1000000-0000-0000-0000-000000000003',
  'Drain backflow threatening basement parking and residential yards in Lakeview.',
  'Waterlogging and drainage',
  'High', 75.0, 70.0, 80.0, 76.50,
  'High priority: structural and property risk from basement inundation, shared hydraulic gradient with main underpass hotspot.',
  'Coordinate upstream de-silting and inspect connecting trunk pipeline for collapse or constriction.',
  '[
    {"step": 1, "action": "Erect temporary sandbag berm along apartment ramp to stop basement ingress.", "timeframe": "45 mins"},
    {"step": 2, "action": "Clear trunk stormwater conduit confluence 150m downstream.", "timeframe": "2 hours"}
  ]'::jsonb,
  'completed'
);

-- R4: Waterlogging Cluster - Report C (Hotspot cluster corroboration)
INSERT INTO reports (id, tracking_token_hash, title, description, category, latitude, longitude, address, status, priority_score, priority_band, assigned_department_id, created_at)
VALUES (
  'a1000000-0000-0000-0000-000000000004',
  encode(digest('TRACK-WATER-04', 'sha256'), 'hex'),
  'Clogged open canal culvert overflowing onto street',
  'Trash accumulated at canal grating near Lakeview corner causing water overflow across the road.',
  'Waterlogging and drainage',
  12.977800, 77.639900,
  'Canal Road Junction, Lakeview Sector',
  'Under Review',
  74.00, 'High',
  'd2222222-2222-2222-2222-222222222222',
  NOW() - INTERVAL '2 hours'
);

INSERT INTO report_ai_analysis (report_id, summary, suggested_category, severity, urgency, safety_risk, public_impact, priority_score, priority_explanation, proposed_solution, recommended_actions, analysis_status)
VALUES (
  'a1000000-0000-0000-0000-000000000004',
  'Solid waste choking canal culvert leading to road waterlogging.',
  'Waterlogging and drainage',
  'High', 70.0, 65.0, 75.0, 74.00,
  'Corroborating cluster report within 250m of underpass flooding. Culvert blockage is direct hydraulic trigger.',
  'JCB backhoe deployment to hoist garbage obstruction from canal culvert screen.',
  '[
    {"step": 1, "action": "Deploy hydraulic excavator to desilt trash screen.", "timeframe": "1.5 hours"}
  ]'::jsonb,
  'completed'
);

-- R5: Deliberate Duplicate Pair - Report 5A (Primary)
INSERT INTO reports (id, tracking_token_hash, title, description, category, latitude, longitude, address, status, priority_score, priority_band, assigned_department_id, assigned_to, created_at)
VALUES (
  'a1000000-0000-0000-0000-000000000005',
  encode(digest('TRACK-ROAD-05', 'sha256'), 'hex'),
  'Large crater pothole on MG Road near Metro Pillar 142',
  'A 2-foot deep, 4-foot wide pothole right in the central lane opposite Metro Pillar 142. Several two-wheeler riders have lost balance and broken vehicle rims.',
  'Roads and potholes',
  12.974500, 77.608300,
  'Opposite Metro Pillar 142, MG Road',
  'In Progress',
  84.50, 'Critical',
  'd1111111-1111-1111-1111-111111111111',
  'Road Maintenance Unit North',
  NOW() - INTERVAL '6 hours'
);

INSERT INTO report_ai_analysis (report_id, summary, suggested_category, severity, urgency, safety_risk, public_impact, priority_score, priority_explanation, proposed_solution, recommended_actions, analysis_status)
VALUES (
  'a1000000-0000-0000-0000-000000000005',
  'Deep dangerous crater pothole in central lane causing two-wheeler accidents on major arterial road.',
  'Roads and potholes',
  'Critical', 88.0, 92.0, 85.0, 84.50,
  'Immediate physical injury risk to motorcyclists on high-speed arterial corridor. Urgent cold/hot mix asphalt patch required.',
  'Emergency barricading and mastic asphalt cold-patch compaction.',
  '[
    {"step": 1, "action": "Place retroreflective traffic cones and flashing hazard sign 20m ahead.", "timeframe": "30 mins"},
    {"step": 2, "action": "Excavate fractured asphalt edges to square geometry and clear debris.", "timeframe": "1.5 hours"},
    {"step": 3, "action": "Apply tack coat and compact dense bituminous concrete in 50mm lifts.", "timeframe": "3 hours"},
    {"step": 4, "action": "Level flush with road surface and reopen lane.", "timeframe": "4 hours"}
  ]'::jsonb,
  'completed'
);

-- R6: Deliberate Duplicate Pair - Report 5B (Duplicate of R5)
INSERT INTO reports (id, tracking_token_hash, title, description, category, latitude, longitude, address, status, priority_score, priority_band, assigned_department_id, duplicate_of, created_at)
VALUES (
  'a1000000-0000-0000-0000-000000000006',
  encode(digest('TRACK-ROAD-06', 'sha256'), 'hex'),
  'Huge pothole near pillar 142 on MG Road damaging cars',
  'Very bad crater near metro pillar 142 MG Road. Vehicles swerving sharply to avoid it, causing near misses.',
  'Roads and potholes',
  12.974520, 77.608330,
  'Near MG Road Metro Pillar 142',
  'Verified',
  83.00, 'Critical',
  'd1111111-1111-1111-1111-111111111111',
  'a1000000-0000-0000-0000-000000000005',
  NOW() - INTERVAL '5 hours'
);

INSERT INTO report_ai_analysis (report_id, summary, suggested_category, severity, urgency, safety_risk, public_impact, priority_score, priority_explanation, duplicate_confidence, proposed_solution, recommended_actions, analysis_status)
VALUES (
  'a1000000-0000-0000-0000-000000000006',
  'Duplicate report: Deep pothole at Pillar 142 MG Road.',
  'Roads and potholes',
  'Critical', 85.0, 90.0, 85.0, 83.00,
  'HIGH CONFIDENCE DUPLICATE (94% confidence). Within 4 meters of primary report #001.',
  94.50,
  'Linked to Primary Report #001. Actions consolidated under primary ticket.',
  '[
    {"step": 1, "action": "Consolidate into primary work order for Road Maintenance Unit North.", "timeframe": "Done"}
  ]'::jsonb,
  'completed'
);

-- Establish link in report_links
INSERT INTO report_links (primary_report_id, related_report_id, relationship_type, confidence, reviewed_by)
VALUES (
  'a1000000-0000-0000-0000-000000000005',
  'a1000000-0000-0000-0000-000000000006',
  'duplicate',
  94.50,
  'CivicAI Duplicate Engine'
);

-- R7: Overflowing Garbage Bin Hotspot - Central Market
INSERT INTO reports (id, tracking_token_hash, title, description, category, latitude, longitude, address, status, priority_score, priority_band, assigned_department_id, created_at)
VALUES (
  'a1000000-0000-0000-0000-000000000007',
  encode(digest('TRACK-WASTE-07', 'sha256'), 'hex'),
  'Massive garbage dump overflowing across vegetable market entrance',
  'Commercial dumpsters have not been emptied for 4 days. Rotting vegetable waste and wet garbage has spilled 20 meters across the lane attracting strays and generating foul stench.',
  'Waste management',
  12.966200, 77.585500,
  'Gate 2, Central Vegetable Market, City Core',
  'Assigned',
  68.00, 'High',
  'd3333333-3333-3333-3333-333333333333',
  NOW() - INTERVAL '8 hours'
);

INSERT INTO report_ai_analysis (report_id, summary, suggested_category, severity, urgency, safety_risk, public_impact, priority_score, priority_explanation, proposed_solution, recommended_actions, analysis_status)
VALUES (
  'a1000000-0000-0000-0000-000000000007',
  '4-day accumulation of decomposing market waste spilling into public pedestrian thoroughfare.',
  'Waste management',
  'High', 70.0, 60.0, 75.0, 68.00,
  'High public health and sanitation impact in densely populated marketplace. Risk of vector-borne contamination.',
  'Dispatch municipal compactor truck, sanitize perimeter with lime powder, and review market collection roster.',
  '[
    {"step": 1, "action": "Dispatch 10-ton hydraulic compactor truck with 4 loaders.", "timeframe": "1.5 hours"},
    {"step": 2, "action": "Spray eco-friendly disinfectant and spread bleaching powder.", "timeframe": "2.5 hours"},
    {"step": 3, "action": "Replace bent dumpster lids to prevent stray dog access.", "timeframe": "Next day"}
  ]'::jsonb,
  'completed'
);

-- R8: Broken Streetlights Cluster - Dark Stretch
INSERT INTO reports (id, tracking_token_hash, title, description, category, latitude, longitude, address, status, priority_score, priority_band, assigned_department_id, created_at)
VALUES (
  'a1000000-0000-0000-0000-000000000008',
  encode(digest('TRACK-LIGHT-08', 'sha256'), 'hex'),
  'Continuous series of 6 LED streetlights non-functional on Ring Road',
  'Complete blackout on a 400m stretch of Outer Ring Road between 14th Cross and 18th Cross. Pedestrians cannot see oncoming traffic at night.',
  'Streetlights',
  12.935200, 77.624400,
  'Ring Road stretch between 14th & 18th Cross, Koramangala',
  'Under Review',
  62.00, 'High',
  'd4444444-4444-4444-4444-444444444444',
  NOW() - INTERVAL '12 hours'
);

INSERT INTO report_ai_analysis (report_id, summary, suggested_category, severity, urgency, safety_risk, public_impact, priority_score, priority_explanation, proposed_solution, recommended_actions, analysis_status)
VALUES (
  'a1000000-0000-0000-0000-000000000008',
  '400-meter street lighting outage on arterial ring road elevating pedestrian hazard and crime vulnerability.',
  'Streetlights',
  'High', 65.0, 70.0, 60.0, 62.00,
  'Multiple consecutive lamp outages suggest phase cable trip or blown timer relay in feeder pillar box.',
  'Inspect feeder distribution box MCB and replace burned out LED driver modules.',
  '[
    {"step": 1, "action": "Inspect feeder pillar FP-12 timer contactor switch.", "timeframe": "4 hours"},
    {"step": 2, "action": "Check underground phase continuity between pole #14 and #15.", "timeframe": "6 hours"},
    {"step": 3, "action": "Perform night-time luminescence audit.", "timeframe": "24 hours"}
  ]'::jsonb,
  'completed'
);

-- R9: Water Supply Pipeline Burst
INSERT INTO reports (id, tracking_token_hash, title, description, category, latitude, longitude, address, status, priority_score, priority_band, assigned_department_id, created_at)
VALUES (
  'a1000000-0000-0000-0000-000000000009',
  encode(digest('TRACK-PIPE-09', 'sha256'), 'hex'),
  'Major potable water pipeline fractured gushing thousands of liters',
  'A 12-inch potable feeder pipe has ruptured under the sidewalk, shooting water 6 feet in the air and washing away subsoil gravel.',
  'Water supply and leakage',
  12.982000, 77.599000,
  'Corner of Queens Road and Thimmaiah Road',
  'In Progress',
  86.00, 'Critical',
  'd2222222-2222-2222-2222-222222222222',
  NOW() - INTERVAL '1 hour'
);

INSERT INTO report_ai_analysis (report_id, summary, suggested_category, severity, urgency, safety_risk, public_impact, priority_score, priority_explanation, proposed_solution, recommended_actions, analysis_status)
VALUES (
  'a1000000-0000-0000-0000-000000000009',
  'High-pressure main water pipe fracture causing massive potable water loss and road foundation erosion.',
  'Water supply and leakage',
  'Critical', 92.0, 75.0, 90.0, 86.00,
  'High severity water resource loss and imminent risk of pavement collapse due to underground soil washout.',
  'Isolate section control gate valve and weld ductile iron split repair sleeve.',
  '[
    {"step": 1, "action": "Shut off Sector S-4 gate valve at Queens junction.", "timeframe": "15 mins"},
    {"step": 2, "action": "Excavate around rupture site using hydro-vac to protect fiber cables.", "timeframe": "1.5 hours"},
    {"step": 3, "action": "Install 300mm mechanical repair clamp.", "timeframe": "3.5 hours"},
    {"step": 4, "action": "Pressure test pipeline at 6 bar before backfilling.", "timeframe": "5 hours"}
  ]'::jsonb,
  'completed'
);

-- R10: Resolved Report with Full Evidence and Public Verification
INSERT INTO reports (id, tracking_token_hash, title, description, category, latitude, longitude, address, status, priority_score, priority_band, assigned_department_id, assigned_to, resolution_summary, resolved_at, created_at)
VALUES (
  'a1000000-0000-0000-0000-000000000010',
  encode(digest('TRACK-RESOLVED-10', 'sha256'), 'hex'),
  'Broken concrete slab on pedestrian footpath creating 3-meter deep trench',
  'Pedestrian slab collapsed into storm canal near Victoria Hospital bus stop. Huge fall risk for elderly patients.',
  'Public infrastructure',
  12.961100, 77.574200,
  'Victoria Hospital Bus Stop, Fort Road',
  'Resolved',
  78.00, 'High',
  'd5555555-5555-5555-5555-555555555555',
  'Engineer David Rao',
  'Damaged pre-cast slab removed. Reinforced RCC M30 concrete slab installed and secured with steel rebar cleats. Antiskid surface pattern completed.',
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '3 days'
);

INSERT INTO report_ai_analysis (report_id, summary, suggested_category, severity, urgency, safety_risk, public_impact, priority_score, priority_explanation, proposed_solution, recommended_actions, analysis_status)
VALUES (
  'a1000000-0000-0000-0000-000000000010',
  'Collapsed footpath slab over deep canal beside hospital bus stop.',
  'Public infrastructure',
  'High', 80.0, 85.0, 75.0, 78.00,
  'High safety hazard for pedestrian hospital visitors. Direct fall risk into deep storm drain.',
  'Replace collapsed slab with heavy-duty reinforced precast concrete panel.',
  '[
    {"step": 1, "action": "Erect barricades around footfall drop.", "timeframe": "Completed"},
    {"step": 2, "action": "Craned placement of 100mm RCC slab.", "timeframe": "Completed"},
    {"step": 3, "action": "Quality assurance and deflection load testing.", "timeframe": "Completed"}
  ]'::jsonb,
  'completed'
);

INSERT INTO report_status_history (report_id, previous_status, new_status, actor_id, actor_name, public_comment, internal_note)
VALUES
('a1000000-0000-0000-0000-000000000010', 'Submitted', 'Assigned', 'admin_01', 'Admin Staff', 'Dispatched to PWD South Zone.', 'Hospital zone priority.'),
('a1000000-0000-0000-0000-000000000010', 'Assigned', 'In Progress', 'eng_rao', 'Engineer David Rao', 'Barricades placed. Replacement slab ordered from casting yard.', 'Casting invoice #PWD-892.'),
('a1000000-0000-0000-0000-000000000010', 'In Progress', 'Resolved', 'eng_rao', 'Engineer David Rao', 'New RCC slab installed, grouted, and inspected. Safe for pedestrian transit.', 'Work verified by PWD Inspector Khan.');

-- Insert remaining synthetic records across city sectors to reach 40+ reports
DO $$
DECLARE
  v_categories TEXT[] := ARRAY[
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
  v_departments UUID[] := ARRAY[
    'd1111111-1111-1111-1111-111111111111'::UUID,
    'd2222222-2222-2222-2222-222222222222'::UUID,
    'd3333333-3333-3333-3333-333333333333'::UUID,
    'd4444444-4444-4444-4444-444444444444'::UUID,
    'd5555555-5555-5555-5555-555555555555'::UUID,
    'd6666666-6666-6666-6666-666666666667'::UUID,
    'd7777777-7777-7777-7777-777777777778'::UUID,
    'd8888888-8888-8888-8888-888888888889'::UUID
  ];
  v_statuses TEXT[] := ARRAY['Submitted', 'Under Review', 'Verified', 'Assigned', 'In Progress', 'Resolved'];
  v_lat NUMERIC;
  v_lng NUMERIC;
  v_cat TEXT;
  v_stat TEXT;
  v_pri NUMERIC;
  v_band TEXT;
  v_id UUID;
  v_idx INT;
BEGIN
  FOR v_idx IN 11..45 LOOP
    v_id := ('a1000000-0000-0000-0000-' || LPAD(v_idx::text, 12, '0'))::UUID;
    v_cat := v_categories[1 + (v_idx % array_length(v_categories, 1))];
    v_stat := v_statuses[1 + (v_idx % array_length(v_statuses, 1))];
    
    -- Distribute in central metropolitan cluster with some spread
    v_lat := 12.940000 + ((v_idx * 17) % 600) * 0.00018;
    v_lng := 77.570000 + ((v_idx * 23) % 700) * 0.00016;
    
    -- Priority calculation
    v_pri := 30.0 + ((v_idx * 13) % 65);
    IF v_pri >= 80 THEN v_band := 'Critical';
    ELSIF v_pri >= 60 THEN v_band := 'High';
    ELSIF v_pri >= 35 THEN v_band := 'Medium';
    ELSE v_band := 'Low';
    END IF;

    INSERT INTO reports (
      id, tracking_token_hash, title, description, category, latitude, longitude,
      address, status, priority_score, priority_band, assigned_department_id,
      resolution_summary, resolved_at, created_at
    ) VALUES (
      v_id,
      encode(digest(('TRACK-DEMO-' || v_idx), 'sha256'), 'hex'),
      v_cat || ' report near Sector ' || (v_idx % 12 + 1) || ' Junction',
      'Civic observation regarding ' || LOWER(v_cat) || ' causing localized disruption near residential block ' || v_idx || '.',
      v_cat,
      v_lat,
      v_lng,
      'Sector ' || (v_idx % 12 + 1) || ', Urban District ' || (v_idx % 4 + 1),
      v_stat,
      v_pri,
      v_band,
      v_departments[1 + (v_idx % array_length(v_departments, 1))],
      CASE WHEN v_stat = 'Resolved' THEN 'Resolved by municipal response team after field inspection and structural repair.' ELSE NULL END,
      CASE WHEN v_stat = 'Resolved' THEN NOW() - INTERVAL '12 hours' ELSE NULL END,
      NOW() - ((v_idx * 3) || ' hours')::INTERVAL
    );

    INSERT INTO report_ai_analysis (
      report_id, summary, suggested_category, severity, urgency, safety_risk,
      public_impact, priority_score, priority_explanation, proposed_solution,
      recommended_actions, analysis_status
    ) VALUES (
      v_id,
      'Automated analysis of ' || LOWER(v_cat) || ' issue at Sector ' || (v_idx % 12 + 1) || '.',
      v_cat,
      v_band,
      v_pri * 0.9,
      v_pri * 0.85,
      v_pri * 0.95,
      v_pri,
      'Calculated based on standard municipal scoring weights: safety (' || ROUND(v_pri*0.35, 1) || '), impact (' || ROUND(v_pri*0.25, 1) || ').',
      'Standard protocol corrective action for ' || v_cat,
      jsonb_build_array(
        jsonb_build_object('step', 1, 'action', 'Initial field assessment by sector supervisor', 'timeframe', 'Within 24h'),
        jsonb_build_object('step', 2, 'action', 'Execute corrective repair or sanitation work', 'timeframe', 'Within 48h'),
        jsonb_build_object('step', 3, 'action', 'Verify resolution and photograph evidence', 'timeframe', 'Upon completion')
      ),
      'completed'
    );

    INSERT INTO report_status_history (report_id, previous_status, new_status, actor_id, actor_name, public_comment)
    VALUES (
      v_id,
      NULL,
      'Submitted',
      'CITIZEN_GUEST',
      'Citizen Portal',
      'Report registered and assigned tracking token.'
    );

    IF v_stat != 'Submitted' THEN
      INSERT INTO report_status_history (report_id, previous_status, new_status, actor_id, actor_name, public_comment)
      VALUES (
        v_id,
        'Submitted',
        v_stat,
        'STAFF_DISPATCH',
        'Municipal Operations',
        'Status transitioned to ' || v_stat || ' according to department protocol.'
      );
    END IF;
  END LOOP;
END $$;

-- ----------------------------------------------------------------------------
-- 3. HOTSPOT ACTION BRIEFS (Derived from real cluster data)
-- ----------------------------------------------------------------------------
INSERT INTO action_briefs (
  id, title, area, description, observed_pattern, public_impact, suggested_action,
  priority, report_ids, geographic_center, confidence_score, limitations
) VALUES (
  'b1111111-1111-1111-1111-111111111111',
  'Action Brief: Chronic Drainage Backflow & Underpass Flooding',
  'Lakeview Sector & 100 Feet Road Corridor',
  'Three separate waterlogging and overflow incidents detected within a 280-meter radius over a 4-hour window.',
  'Multiple high-severity water accumulation reports clustering around 100ft road underpass and adjacent Emerald residential basements during moderate rainfall.',
  'Stalled motor vehicles, road closure of key arterial corridor, risk of basement flooding and health hazards from sewer overflow.',
  'Deploy two high-capacity dewatering pump units to clear underpass immediately. Clear the bottleneck trash screen at the canal culvert confluence. Conduct hydraulic drone inspection of the downstream stormwater conduit to detect structural silting.',
  'Critical',
  '["a1000000-0000-0000-0000-000000000002", "a1000000-0000-0000-0000-000000000003", "a1000000-0000-0000-0000-000000000004"]'::jsonb,
  '{"latitude": 12.978366, "longitude": 77.640733, "radius_meters": 280}'::jsonb,
  94.0,
  'Confidence is high based on spatial and temporal proximity. Physical cause (culvert choke vs pump failure) requires on-site confirmation.'
),
(
  'b2222222-2222-2222-2222-222222222222',
  'Action Brief: Pothole & Road Surface Deterioration Corridor',
  'MG Road Metro Corridor (Pillars 130-150)',
  'Repeated citizen reports of deep craters in central and right lanes causing vehicular damage.',
  'Clusters of pothole complaints aligned with Metro construction zone drainage runoff.',
  'Severe accident risk for two-wheelers, wheel alignment damage to buses and private cars, traffic congestion averaging 25-minute delays.',
  'Deploy Road Maintenance Unit North with hot-mix bituminous compound. Install temporary barricading and warning lights during night repair window (11 PM - 5 AM).',
  'High',
  '["a1000000-0000-0000-0000-000000000005", "a1000000-0000-0000-0000-000000000006"]'::jsonb,
  '{"latitude": 12.974510, "longitude": 77.608315, "radius_meters": 50}'::jsonb,
  98.0,
  'Confirmed duplicate and proximity corroboration. Requires traffic police coordination for night lane closure.'
);
