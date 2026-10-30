# CivicAI — 5-Minute Hackathon Demonstration Script
### PromptWars × Astra National Hackathon

This demo script walks judges through a complete, closed-loop civic problem resolution journey: from citizen submission through AI explainable analysis, spatial duplicate detection, geographic hotspot intelligence, authority solution approval, and public progress tracking.

---

## ⏱ MINUTE 1: Citizen Problem Intake (< 60 Seconds)

1. **Open the Homepage**:
   - Point out the clean municipal dashboard design (deep navy, teal accents, restrained status badges).
   - Highlight the **Live Statistics**: Notice that total reports (45+), critical hazards, hotspots, and resolution rates are calculated live from real stored records, never hardcoded numbers.
2. **Click "Report a Problem in 60s"**:
   - In the description box, begin typing:
     > *"A high voltage live electrical wire snapped outside the school gate on 4th Main Road and is sparking violently over the wet sidewalk."*
   - **Show the Real-Time AI Preview**:
     - Notice how CivicAI immediately detects safety keywords (*"high voltage"*, *"live wire"*, *"sparking"*).
     - Notice the suggested category pill changes automatically to **"Electrical hazards"**.
     - Notice the estimated priority rating jumps to **Critical (98.5/100)** with a red warning badge.
3. **Pick Location on Map**:
   - Click the interactive coordinate picker map or select the preset coordinate.
4. **Click "Submit Civic Report"**:
   - The submission registers in less than a second!
   - Show the generated **Secure Tracking Token** (e.g. `CIVIC-ELEC-XXXX`).

---

## ⏱ MINUTE 2: Explainable AI Analysis & Problem-To-Solution Engine

1. **Inspect the AI Analysis Card**:
   - Point out that this is not a black-box LLM hallucination:
     - **Explainable Multi-Factor Scoring**: Shows the breakdown across Safety Risk (35%), Public Impact (25%), Severity (20%), Urgency (10%), and Corroboration (10%).
     - **Safety Override Trigger**: Show the explicit banner: *"AUTOMATIC SAFETY OVERRIDE TRIGGERED: Exposed sparking electrical cable located on pedestrian walkway near school perimeter. Routine algorithmic weighting overridden to classify as Critical to prioritize human life protection."*
2. **Show the Problem-Specific Solution Plan**:
   - Notice the system does not give a generic placeholder answer:
     - Specific Proposed Solution: *"Immediate feeder line isolation and deployment of emergency hazard barricades followed by cable re-stringing."*
     - Step 1: Remotely de-energize Indiranagar Feeder 4A line (15 mins).
     - Step 2: Erect physical perimeter barricade 15 meters around drop zone (30 mins).
     - Step 3: Replace snapped overhead insulated conductor (2 hours).
     - Step 4: Mandatory continuity test & clearance certification before re-energizing.
     - Responsible Department: **Electricity & Public Lighting (ELEC)**.
     - Target Response Window: **3 hours**.

---

## ⏱ MINUTE 3: City Incident Map, Hotspot Radar & Action Briefs

1. **Navigate to "Explore Map"**:
   - Show all 45+ reports color-coded by problem domain.
   - Point out the **Critical Hazard Markers**: Notice the pulsing red ring around the electrical hazard and deep pothole on MG Road.
   - Test the interactive filters: Filter by *"Waterlogging and drainage"* or priority *"Critical"*.
2. **Show the Hotspot Zones**:
   - Point out the blue dashed circular cluster around **Lakeview Sector & 100 Feet Road Underpass**.
   - Hover or click: Notice it aggregates 3 distinct reports within a 280-meter radius.
3. **Navigate to "Solutions & Briefs"**:
   - Open **Action Brief #01**:
     - Area: Lakeview Sector Corridor.
     - Observed Pattern: Multiple recurring waterlogging complaints clustering around the underpass and Emerald residential basements during moderate rain.
     - Public Impact: Arterial road closure, vehicle submersion, basement contamination.
     - Recommended Municipal Action: Deploy trailer-mounted dewatering pumps, clear the bottleneck trash screen at the canal culvert, and inspect downstream stormwater conduit for structural silting.
     - Supporting Evidence: Directly links reports `#002`, `#003`, and `#004`.
     - Honest Limitations Note: Explains that spatial density indicates an issue, but on-site inspection is required to determine whether it is a pump failure or culvert blockage.
4. **Show the Duplicate Detection Radar**:
   - Switch to the **"Duplicate Radar"** tab.
   - Highlight the deliberate duplicate pair on MG Road (Reports `#005` & `#006`):
     - Shows **94% Match Confidence**: within 4 meters, 58% keyword overlap.
     - Allows authority to link candidate duplicate directly to primary incident to consolidate work orders!

---

## ⏱ MINUTE 4: Municipal Authority Portal & Workflow Transitions

1. **Switch Role to "Staff" or "Admin"**:
   - Use the role switcher in the top navigation bar.
2. **Open Report #001 or #010**:
   - Show the clean two-section layout:
     - **SECTION A: THE PROBLEM** (Citizen intake, photo, exact coordinates, mini map, explainable priority factors).
     - **SECTION B: THE SOLUTION & AUTHORITY ACTIONS** (Customizable action plan, department assignment, and workflow transitions).
3. **Approve & Edit the Plan**:
   - Click "Edit Plan" to modify a milestone or target response window, then click "Save & Approve Plan". Notice the approval timestamp and reviewer name are recorded in the audit history!
4. **Advance Workflow State**:
   - Assign the report to **Department of Roads & Transport** and enter officer name *"Engineer Sharma"*.
   - Advance status from *"Under Review"* to *"In Progress"*.
   - Add a public update: *"Crew arrived on site with mobile bucket truck."*
   - Add a private internal note: *"Feeder 4A isolated at 10:15 AM."*
   - Show how the workflow enforces municipal rules:
     - If marking as *"Resolved"*, the system mandates entering a detailed Resolution Summary!
     - If marking as *"Rejected"*, a rejection reason is required!

---

## ⏱ MINUTE 5: Citizen Tracking Portal & Privacy Verification

1. **Open "Track Issue"**:
   - Paste the tracking token or click the sample button **"CIVIC-INFR-5501 (Resolved)"**.
2. **Demonstrate Public Transparency & Privacy Guarantees**:
   - The citizen sees:
     - Original problem and category.
     - Current status badge (Resolved / In Progress).
     - Complete step-by-step engineering solution.
     - Assigned Department: Public Works & Civil Infrastructure.
     - **Verified Resolution Summary**: *"Damaged pre-cast slab removed. Reinforced RCC M30 concrete slab installed and secured with steel rebar cleats. Antiskid surface pattern completed and certified safe."*
     - Public Progress Timeline with timestamps and officer names.
   - **Crucial Security & Privacy Check**:
     - Point out that the citizen view **never leaks private internal notes** or **reporter phone numbers/emails**. All confidential data is sanitized server-side!
3. **Conclude with Hackathon Summary**:
   - CivicAI completes the full closed loop: **Capture → Understand → Reveal → Act**.
   - Built with React, TypeScript, Tailwind CSS, Recharts, Leaflet, and Supabase PostgreSQL with RLS.
