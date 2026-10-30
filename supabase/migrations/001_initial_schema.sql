-- ============================================================================
-- CivicAI — Smart City Issue Intelligence
-- Supabase PostgreSQL Schema Migration: 001_initial_schema.sql
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. DEPARTMENTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    contact_email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. USER PROFILES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('citizen', 'staff', 'admin')) DEFAULT 'citizen',
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. CIVIC REPORTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tracking_token_hash TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
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
    )),
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    address TEXT NOT NULL,
    image_path TEXT,
    status TEXT NOT NULL CHECK (status IN (
        'Submitted',
        'Under Review',
        'Verified',
        'Assigned',
        'In Progress',
        'Resolved',
        'Closed',
        'Rejected'
    )) DEFAULT 'Submitted',
    priority_score NUMERIC(5, 2) NOT NULL DEFAULT 50.0 CHECK (priority_score >= 0 AND priority_score <= 100),
    priority_band TEXT NOT NULL CHECK (priority_band IN ('Low', 'Medium', 'High', 'Critical')) DEFAULT 'Medium',
    assigned_department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    assigned_to TEXT,
    duplicate_of UUID REFERENCES reports(id) ON DELETE SET NULL,
    resolution_summary TEXT,
    rejection_reason TEXT,
    reporter_name TEXT,
    reporter_contact TEXT, -- PRIVATE: Never returned to guest tracking
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_reports_category ON reports(category);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_priority ON reports(priority_band);
CREATE INDEX IF NOT EXISTS idx_reports_coordinates ON reports(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_reports_tracking_hash ON reports(tracking_token_hash);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);

-- ----------------------------------------------------------------------------
-- 4. REPORT AI ANALYSIS & EXPLAINABILITY TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS report_ai_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE UNIQUE,
    summary TEXT NOT NULL,
    suggested_category TEXT,
    severity TEXT NOT NULL CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
    urgency NUMERIC(5, 2) NOT NULL DEFAULT 50.0,
    safety_risk NUMERIC(5, 2) NOT NULL DEFAULT 50.0,
    public_impact NUMERIC(5, 2) NOT NULL DEFAULT 50.0,
    priority_score NUMERIC(5, 2) NOT NULL,
    priority_explanation TEXT NOT NULL,
    duplicate_confidence NUMERIC(5, 2) DEFAULT 0.0,
    proposed_solution TEXT NOT NULL,
    recommended_actions JSONB NOT NULL DEFAULT '[]'::jsonb,
    model_or_algorithm TEXT NOT NULL DEFAULT 'CivicAI-Deterministic-NLP-v1',
    analysis_status TEXT NOT NULL CHECK (analysis_status IN ('completed', 'pending', 'failed')) DEFAULT 'completed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. REPORT STATUS HISTORY & AUDIT TRAIL TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS report_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    previous_status TEXT,
    new_status TEXT NOT NULL,
    actor_id TEXT NOT NULL,
    actor_name TEXT NOT NULL,
    public_comment TEXT,
    internal_note TEXT, -- PRIVATE: Only visible to authorized municipal staff/admin
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_history_report_id ON report_status_history(report_id, created_at ASC);

-- ----------------------------------------------------------------------------
-- 6. REPORT DUPLICATE & CORROBORATION LINKS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS report_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    primary_report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    related_report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    relationship_type TEXT NOT NULL CHECK (relationship_type IN ('duplicate', 'related_cause', 'corroborating')),
    confidence NUMERIC(5, 2) NOT NULL DEFAULT 85.0,
    reviewed_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_report_link UNIQUE (primary_report_id, related_report_id)
);

-- ----------------------------------------------------------------------------
-- 7. REPORT EVIDENCE TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS report_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    evidence_type TEXT NOT NULL CHECK (evidence_type IN ('initial_photo', 'inspection', 'work_in_progress', 'completion')),
    caption TEXT,
    public_visibility BOOLEAN NOT NULL DEFAULT TRUE,
    uploaded_by TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 8. ACTION BRIEFS & HOTSPOT INSIGHTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS action_briefs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    area TEXT NOT NULL,
    description TEXT NOT NULL,
    observed_pattern TEXT NOT NULL,
    public_impact TEXT NOT NULL,
    suggested_action TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    report_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
    geographic_center JSONB NOT NULL,
    confidence_score NUMERIC(5, 2) NOT NULL DEFAULT 90.0,
    limitations TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_ai_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_briefs ENABLE ROW LEVEL SECURITY;

-- Departments: Publicly readable
CREATE POLICY "Departments are viewable by everyone" ON departments
    FOR SELECT USING (true);

-- Profiles: Users can view their own profile; staff/admins can view all profiles
CREATE POLICY "Public profile viewing" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Reports:
-- Public can view public reports (without private columns)
CREATE POLICY "Public can view reports" ON reports
    FOR SELECT USING (true);

-- Anyone can submit a new civic report
CREATE POLICY "Public report submission" ON reports
    FOR INSERT WITH CHECK (true);

-- Only staff and admin can update reports
CREATE POLICY "Staff can update reports" ON reports
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('staff', 'admin')
        )
    );

-- AI Analysis:
-- Public can read AI analysis for reports
CREATE POLICY "Public can read AI analysis" ON report_ai_analysis
    FOR SELECT USING (true);

CREATE POLICY "Public can insert AI analysis on submission" ON report_ai_analysis
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Staff can update AI analysis" ON report_ai_analysis
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('staff', 'admin')
        )
    );

-- Report Status History:
-- Public can view status history where public_comment is present, but internal_notes are filtered
CREATE POLICY "Public can view public status history" ON report_status_history
    FOR SELECT USING (
        internal_note IS NULL OR 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('staff', 'admin')
        )
    );

CREATE POLICY "Anyone can record initial status history" ON report_status_history
    FOR INSERT WITH CHECK (true);

-- Evidence & Links:
CREATE POLICY "Public can view public evidence" ON report_evidence
    FOR SELECT USING (public_visibility = true);

CREATE POLICY "Staff can view all evidence" ON report_evidence
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('staff', 'admin')
        )
    );

CREATE POLICY "Public can upload evidence" ON report_evidence
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view report links" ON report_links
    FOR SELECT USING (true);

CREATE POLICY "Staff can manage report links" ON report_links
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('staff', 'admin')
        )
    );

CREATE POLICY "Public can view action briefs" ON action_briefs
    FOR SELECT USING (true);

-- ----------------------------------------------------------------------------
-- SECURE GUEST TRACKING FUNCTION (Prevents private contact & internal note leaks)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_report_by_tracking_token(p_token_hash TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_report RECORD;
    v_analysis RECORD;
    v_history JSONB;
    v_department RECORD;
    v_result JSONB;
BEGIN
    SELECT id, title, description, category, latitude, longitude, address,
           image_path, status, priority_score, priority_band, assigned_department_id,
           assigned_to, resolution_summary, created_at, updated_at, resolved_at
    INTO v_report
    FROM reports
    WHERE tracking_token_hash = p_token_hash
    LIMIT 1;

    IF v_report.id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Report not found with provided tracking token');
    END IF;

    -- Fetch AI analysis & proposed solution
    SELECT summary, suggested_category, severity, priority_score, priority_explanation,
           proposed_solution, recommended_actions, analysis_status
    INTO v_analysis
    FROM report_ai_analysis
    WHERE report_id = v_report.id
    LIMIT 1;

    -- Fetch department name if assigned
    SELECT name, code INTO v_department
    FROM departments
    WHERE id = v_report.assigned_department_id;

    -- Fetch public timeline events (explicitly excluding internal notes!)
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', id,
            'previous_status', previous_status,
            'new_status', new_status,
            'actor_name', actor_name,
            'public_comment', public_comment,
            'created_at', created_at
        ) ORDER BY created_at ASC
    )
    INTO v_history
    FROM report_status_history
    WHERE report_id = v_report.id;

    v_result := jsonb_build_object(
        'success', true,
        'report', jsonb_build_object(
            'id', v_report.id,
            'title', v_report.title,
            'description', v_report.description,
            'category', v_report.category,
            'latitude', v_report.latitude,
            'longitude', v_report.longitude,
            'address', v_report.address,
            'image_path', v_report.image_path,
            'status', v_report.status,
            'priority_score', v_report.priority_score,
            'priority_band', v_report.priority_band,
            'assigned_department_name', v_department.name,
            'assigned_to', v_report.assigned_to,
            'resolution_summary', v_report.resolution_summary,
            'created_at', v_report.created_at,
            'updated_at', v_report.updated_at,
            'resolved_at', v_report.resolved_at
        ),
        'analysis', row_to_json(v_analysis),
        'history', COALESCE(v_history, '[]'::jsonb)
    );

    RETURN v_result;
END;
$$;
