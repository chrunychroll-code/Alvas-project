# CivicAI — Smart City Issue Intelligence & Resolution Platform
### PromptWars × Astra National Hackathon Prototype

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](#)
[![React](https://img.shields.io/badge/React-18.3-blue)](#)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple)](#)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-teal)](#)
[![Supabase Ready](https://img.shields.io/badge/Supabase-PostgreSQL%20%2B%20RLS-emerald)](#)
[![Tests](https://img.shields.io/badge/Tests-16%2F16%20Passed-success)](#)

CivicAI is an intelligent, full-stack civic problem management platform designed for the PromptWars × Astra National Hackathon. It connects citizens and municipal authorities through a transparent four-stage closed-loop architecture: **Capture → Understand → Reveal → Act**.

---

## 🏛 The Problem & CivicAI Vision

In modern metropolitan areas, civic problem management suffers from three chronic bottlenecks:
1. **Unstructured & Slow Intake**: Citizens face tedious forms or broken hotlines. Reports lack geographic precision, category standardization, and photographic evidence.
2. **Prioritization Blindness**: Municipal triage queues are flooded with routine complaints while critical life-safety hazards (e.g., exposed sparking high-voltage cables near schools) get lost in the backlog.
3. **No Solution Guidance & Broken Workflows**: Reports are treated as disconnected tickets without engineering action plans, duplicate deduplication, or geographic cluster analysis, leaving citizens in the dark.

**CivicAI solves this** by pairing rapid citizen reporting with explainable AI priority scoring (0-100), automatic life safety overrides, spatial-textual duplicate detection, geographic hotspot radar, domain-specific engineering solution matrices, and an auditable authority workflow.

---

## 🚀 Core Features & Capabilities

### 1. CAPTURE — Rapid Citizen Intake (< 60 Seconds)
- Fast, mobile-responsive intake form requiring minimal effort.
- Real-time AI preview while typing: detects safety keywords and suggests categories dynamically.
- Dual location selection: address landmark entry or interactive map coordinate pin selection.
- Optional photographic evidence upload with client-side image validation.
- Secure, high-entropy tracking token generation (`CIVIC-XXXX-XXXX`) without exposing private citizen data.

### 2. UNDERSTAND — Explainable AI Analysis & Priority Scoring (0 - 100)
- **Deterministic Multi-Factor Scoring**:
  - Immediate Safety Risk (35% weight)
  - Public & Transit Impact (25% weight)
  - Defect Severity (20% weight)
  - Urgency & Temporal Decay (10% weight)
  - Verified Recurrence & Corroboration (10% weight)
- **Automatic Life Safety Override**: Explicit safety triggers (e.g. sparking high-voltage wires, gas leaks, structural cave-ins) immediately override routine algorithmic weights to enforce a minimum priority of 88.0 (Critical) to prioritize life safety.
- **Problem-to-Solution Engine**: Every report automatically receives a tailored, step-by-step engineering corrective action plan, responsible municipal department, and target resolution timeframe.

### 3. REVEAL — Geographic Hotspot Clustering & Duplicate Radar
- **Duplicate Detection**: Combines Sørensen–Dice token similarity with Haversine spherical distance formulas to flag corroborating complaints within proximity (e.g. potholes on MG Road).
- **Spatial Hotspot Clustering**: Groups nearby reports into density clusters, discounting confirmed duplicates so incident metrics aren't falsely inflated.
- **Operational Action Briefs**: Generates concise, executive briefs (Observed Pattern, Public Impact, Recommended Municipal Action, Supporting Incident Evidence, and Limitations).

### 4. ACT — Municipal Authority Workflow & Citizen Tracking
- Two-section report view: **Section A: The Problem Intake** vs. **Section B: The Proposed Solution & Authority Actions**.
- Role-based authorization: **Citizen**, **Staff**, and **Admin** modes with full workflow state transitions (`Submitted → Under Review → Verified → Assigned → In Progress → Resolved → Closed`).
- Enforcement of municipal integrity: Mandatory resolution summary when marking *Resolved*; mandatory rejection reason when marking *Rejected*.
- Citizen tracking portal: Citizens enter their tracking token to view real-time status and public progress, while confidential internal notes and private contact details remain strictly protected.

---

## 🛠 Technology Stack

- **Frontend**: React 18, TypeScript 5.6, Vite 6, Tailwind CSS 3.4, Lucide Icons, Recharts 2.15.
- **Maps**: Dual-engine integration supporting **Google Maps JavaScript API** and an interactive **OpenStreetMap engine** (Leaflet) with category color markers, critical pulse animations, and popup cards.
- **Backend & Persistence**:
  - **Live Supabase PostgreSQL Cloud**: Complete SQL migrations, foreign key constraints, Row Level Security (RLS) policies, and secure RPC tracking functions.
  - **Local Persistent Demo Store**: Seamless client-side persistent storage pre-seeded with 45 realistic synthetic civic records when running offline or without credentials.
- **Testing**: Vitest automated testing suite covering all scoring algorithms, safety overrides, duplicate math, clustering, and security sanitization.

---

## 📂 Project Structure

```
AIET Project/
├── public/
│   └── civic-logo.svg              # Brand vector logo
├── src/
│   ├── components/
│   │   ├── CivicMap.tsx            # Interactive Leaflet / Google Maps component
│   │   └── Navbar.tsx              # Responsive navigation & role switcher
│   ├── data/
│   │   └── seedData.ts             # 45 synthetic demonstration civic reports
│   ├── pages/
│   │   ├── HomePage.tsx            # Public landing page & live database metrics
│   │   ├── ReportSubmissionPage.tsx# Citizen intake with real-time AI preview
│   │   ├── ExploreMapPage.tsx      # Full map explorer with multi-attribute filtering
│   │   ├── AllReportsPage.tsx      # Filterable grid and table reports view
│   │   ├── SolutionsAndActionsPage.tsx # Action Briefs & duplicate radar
│   │   ├── AnalyticsPage.tsx       # Recharts municipal analytics dashboard
│   │   ├── TrackReportPage.tsx     # Citizen public tracking portal
│   │   ├── ReportDetailPage.tsx   # Two-section problem & solution workflow
│   │   └── AdminPage.tsx           # Authority portal & seed data reset
│   ├── services/
│   │   ├── aiEngine.ts             # Explainable priority scoring & solutions
│   │   ├── duplicateEngine.ts      # Haversine distance & token similarity
│   │   ├── hotspotEngine.ts        # Radius clustering & Action Brief generator
│   │   ├── storageService.ts       # Unified Supabase + LocalStore repository
│   │   └── supabaseClient.ts       # Supabase initialization & fallback
│   ├── tests/
│   │   └── civicai.test.ts         # Automated unit & integration test suite
│   ├── types/
│   │   └── index.ts                # TypeScript domain models
│   ├── utils/
│   │   └── security.ts             # Tracking token generator, hashing, sanitization
│   ├── App.tsx                     # Main application router & state controller
│   ├── main.tsx                    # React DOM entry point
│   └── index.css                   # Tailwind directives & custom animations
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql  # PostgreSQL schema, RLS policies & RPC function
│   └── seed.sql                    # SQL seed script with 45 synthetic demonstration reports
├── .env.example                    # Environment configuration template
├── .gitignore                      # Git ignore rules (secrets & node_modules)
├── DEMO_SCRIPT.md                  # 5-minute hackathon judge walkthrough
├── LIMITATIONS.md                  # Technical disclosure & algorithmic boundaries
├── package.json                    # Project dependencies and scripts
├── tailwind.config.js              # Custom civic color tokens
├── tsconfig.json                   # TypeScript configuration
└── vite.config.ts                  # Vite bundler configuration
```

---

## 🚦 Getting Started Locally

### 1. Prerequisites
- Node.js version 18 or higher (tested on Node v24)
- npm version 9 or higher

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/civicai.git
cd civicai

# Install dependencies
npm install
```

### 3. Environment Configuration
Duplicate `.env.example` to `.env`:
```bash
cp .env.example .env
```

```env
# Optional: Supabase credentials (if left blank, Local Persistent Demo Store runs automatically)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional: Google Maps JavaScript API key (if left blank, OpenStreetMap runs automatically)
VITE_GOOGLE_MAPS_API_KEY=

# Optional: Gemini API key for enhanced natural language briefs
VITE_GEMINI_API_KEY=
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Running Automated Tests
```bash
npm run test
```
Executes the Vitest test suite testing scoring logic, safety overrides, duplicate formulas, and security functions.

### 6. Production Bundle Build
```bash
npm run build
```
Compiles TypeScript and creates an optimized production bundle in `/dist`.

---

## 🗄 Supabase Setup Instructions (Optional)

If you wish to connect CivicAI to a live Supabase PostgreSQL project:
1. Create a new project in the [Supabase Dashboard](https://supabase.com).
2. Navigate to **SQL Editor** and run the contents of `supabase/migrations/001_initial_schema.sql`.
3. To seed initial demonstration records, run the contents of `supabase/seed.sql`.
4. Navigate to **Storage** and ensure a public bucket named `report-evidence` exists.
5. In **Project Settings → API**, copy the `Project URL` and `anon public key` into your `.env` file:
   ```env
   VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsIn...
   ```
6. Restart your Vite dev server (`npm run dev`). CivicAI will automatically detect the connection and switch from Local Demo Mode to live Supabase Cloud!

---

## 🗺 Google Maps Setup Instructions (Optional)

1. Open the [Google Cloud Console](https://console.cloud.google.com).
2. Enable the **Maps JavaScript API**.
3. Create an API Key under **APIs & Services → Credentials**.
4. Restrict the key by HTTP referrer (e.g. `http://localhost:5173/*`).
5. Add the key to `.env`:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=AIzaSy...
   ```
*Note: If no Google Maps key is provided, CivicAI operates seamlessly using its built-in interactive OpenStreetMap engine.*

---

## 📤 Git & GitHub Repository Preparation

To commit this project to a new GitHub repository, run the following commands in your shell:

```bash
# 1. Initialize git repository
git init

# 2. Stage all project files (verifying .gitignore protects secrets)
git add .

# 3. Create initial commit
git commit -m "feat: initial CivicAI hackathon prototype with AI issue intelligence and problem-to-solution engine"

# 4. Set default branch to main
git branch -M main

# 5. Add your GitHub remote repository (replace with your repo URL)
git remote add origin https://github.com/your-username/civicai.git

# 6. Push to GitHub
git push -u origin main
```

---

## ⚖️ Hackathon Demonstration & Limitations Note

For the PromptWars × Astra National Hackathon:
- **5-Minute Walkthrough**: Follow [`DEMO_SCRIPT.md`](./DEMO_SCRIPT.md) for a minute-by-minute judge evaluation flow.
- **Honest Technical Disclosure**: See [`LIMITATIONS.md`](./LIMITATIONS.md) detailing implemented algorithmic rules, heuristic boundaries, and production prerequisites.

---

*CivicAI — Built with precision for the PromptWars × Astra National Hackathon.*
#   A l v a s - p r o j e c t  
 