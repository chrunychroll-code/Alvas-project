# CivicAI — Limitations, Assumptions & Technical Disclosure

This document provides a transparent and honest overview of the algorithms, architectural assumptions, mocked components, and real-world boundaries of the **CivicAI** prototype developed for the PromptWars × Astra National Hackathon.

---

## 1. AI & Algorithmic Capabilities

### What is Actually Implemented
- **Deterministic NLP & Category Suggestion**: Tokenization, stop-word removal, and domain-specific keyword weighting across all 10 official civic categories.
- **Explainable Priority Scoring (0 - 100)**: A deterministic, fully auditable multi-factor formula:
  - Immediate Safety Risk (35% weight)
  - Public & Transit Impact (25% weight)
  - Defect Severity (20% weight)
  - Urgency & Temporal Decay (10% weight)
  - Recurrence / Citizen Corroboration (10% weight)
- **Automatic Life Safety Override**: Explicit rule-based safety triggers (e.g. sparking high-voltage wires, gas leaks, structural cave-ins) immediately override routine algorithmic weights to enforce a minimum priority of 88.0 (Critical), ensuring immediate emergency response regardless of report volume.
- **Problem-to-Solution Engine**: Every reported problem category is deterministically mapped to a tailored, multi-step engineering corrective action plan, responsible municipal department, and target resolution timeframe.

### Deterministic Rules vs. Large Language Models (LLM)
- The core intelligence pipeline runs **client-side and deterministically**. This guarantees 100% availability, zero token latency, offline functionality, and full algorithmic explainability without opaque hallucination.
- An optional Google Gemini API integration hook (`VITE_GEMINI_API_KEY`) is wired into the architecture for generative natural-language action summaries, but the application is designed to function completely and reliably without external LLM dependencies.

### Text-Based Duplicate Detection Boundaries
- Duplicate detection uses **Sørensen–Dice token similarity** combined with **Haversine geographic distance**.
- **Limitations**:
  - Two distinct potholes located 10 meters apart on the same avenue may be falsely flagged as a duplicate (false positive).
  - Vaguely worded complaints ("Road broken here" vs "Bad crater near bus stop") may yield low text similarity despite describing the exact same physical hole (false negative).
  - Consequently, the system **never merges records automatically**; potential duplicates are flagged with a confidence percentage for human authority verification and linking.

### Geographic Hotspot Detection Boundaries
- Hotspot detection groups reports within a configurable spatial radius (default: 400 meters).
- **Limitations**:
  - A high density of reports in one neighborhood indicates elevated citizen reporting activity, but **does not prove a shared physical cause** (e.g. three clogged drains on the same block may stem from independent trash blockages rather than a collapsed main sewer line).
  - Hotspot Action Briefs explicitly frame observed patterns as hypotheses requiring physical field inspection.

---

## 2. Priority Scoring & Human Judgment

- **Priority Scores Are Heuristics, Not Municipal Policy**: The weights (35% safety, 25% impact, 20% severity, etc.) reflect standard civil engineering best practices, but have not been formally calibrated against official municipal statutory service-level agreements (SLAs).
- **Human Verification Required**: Critical classifications and proposed solutions require review and approval by an authorized municipal officer before field execution.

---

## 3. Proposed Solutions vs. Executed Work

- **Proposed Solution ≠ Completed Work**: CivicAI generates an actionable engineering plan upon citizen submission. This plan is an operational proposal and is clearly distinguished in the UI from assigned, in-progress, or verified work.
- **Resolution Verification**: A report cannot be marked as "Resolved" without entering a mandatory completion summary and recording the authorized inspector who certified the work.

---

## 4. Maps & Geolocation Configuration

- **Dual-Engine Architecture**:
  - If a valid `VITE_GOOGLE_MAPS_API_KEY` is provided in `.env`, the Google Maps JavaScript API can be enabled.
  - If no Google Maps key is configured, CivicAI operates seamlessly using its **interactive OpenStreetMap engine** powered by Leaflet. All marker filtering, coordinate clicking, and popup inspections remain 100% functional.
- **Privacy First**: The application never accesses user GPS coordinates without explicit user permission.

---

## 5. Storage & Persistence Modes

- **Dual-Persistence Engine**:
  - When `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are provided, CivicAI synchronizes directly with Supabase Cloud PostgreSQL, Row Level Security (RLS) tables, and Supabase Storage.
  - If Supabase credentials are not provided, CivicAI activates its **Local Persistent Demo Store** (powered by browser localStorage). This store is pre-seeded with 45 realistic synthetic records, deliberate duplicates, critical safety hazards, and hotspots, ensuring zero setup friction during hackathon evaluation.
- The UI contains a prominent storage badge at all times indicating whether live Supabase or the Local Demo Store is active.

---

## 6. Real-World Production Deployment Requirements

To deploy CivicAI in a real-world metropolitan municipal corporation, the following additional integrations would be required:
1. **Municipal Active Directory / SSO**: SAML / OAuth integration with official municipal employee directories.
2. **SMS & WhatsApp Gateway**: Direct integration with telecom gateways (e.g. Twilio, Gupshup) for citizen status notifications.
3. **Enterprise GIS & SCADA**: Integration with municipal GIS servers (ESRI ArcGIS / PostGIS) and water/power SCADA telemetry sensors.
4. **Contractor Work-Order ERP**: Direct API connectors to municipal public works procurement systems (e.g. SAP / Oracle).
