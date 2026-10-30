import React, { useState, useEffect } from 'react';
import { CivicReport, Department, ActionBrief, HotspotCluster, UserRole } from './types';
import { storageService } from './services/storageService';
import { detectGeographicHotspots } from './services/hotspotEngine';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { ReportSubmissionPage } from './pages/ReportSubmissionPage';
import { ExploreMapPage } from './pages/ExploreMapPage';
import { AllReportsPage } from './pages/AllReportsPage';
import { SolutionsAndActionsPage } from './pages/SolutionsAndActionsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { TrackReportPage } from './pages/TrackReportPage';
import { ReportDetailPage } from './pages/ReportDetailPage';
import { AdminPage } from './pages/AdminPage';
import { ShieldCheck, Heart, Sparkles, Database, Layers } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [userRole, setUserRole] = useState<UserRole>('citizen');
  const [reports, setReports] = useState<CivicReport[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [briefs, setBriefs] = useState<ActionBrief[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [trackingTokenParam, setTrackingTokenParam] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const reps = await storageService.getReports();
      const depts = await storageService.getDepartments();
      const actBriefs = await storageService.getActionBriefs();
      setReports(reps);
      setDepartments(depts);
      setBriefs(actBriefs);
    } catch (e) {
      console.error('Failed to load civic data:', e);
    } finally {
      setLoading(false);
    }
  };

  // Compute live hotspots dynamically from stored reports
  const dynamicHotspots: HotspotCluster[] = React.useMemo(() => {
    return detectGeographicHotspots(reports, 400, 2);
  }, [reports]);

  const storageStatus = storageService.getStorageStatus();

  // Navigation handler
  const handleNavigate = (tab: string, param?: string) => {
    if (tab === 'report-detail' && param) {
      setSelectedReportId(param);
      setActiveTab('report-detail');
    } else if (tab === 'track') {
      setTrackingTokenParam(param);
      setActiveTab('track');
    } else {
      setActiveTab(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => handleNavigate(tab)}
        userRole={userRole}
        setUserRole={setUserRole}
        storageStatus={storageStatus}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-bold text-slate-700">Initializing CivicAI Intelligence Engine...</p>
            <p className="text-xs text-slate-400 mt-1">Connecting to storage and compiling geospatial indexes</p>
          </div>
        ) : (
          <>
            {activeTab === 'home' && (
              <HomePage
                reports={reports}
                hotspots={dynamicHotspots}
                onNavigate={handleNavigate}
              />
            )}

            {activeTab === 'report' && (
              <ReportSubmissionPage
                onReportCreated={(newRep, token) => {
                  loadData();
                  setTrackingTokenParam(token);
                }}
                onNavigate={handleNavigate}
              />
            )}

            {activeTab === 'map' && (
              <ExploreMapPage
                reports={reports}
                hotspots={dynamicHotspots}
                onSelectReport={(id) => handleNavigate('report-detail', id)}
              />
            )}

            {activeTab === 'reports' && (
              <AllReportsPage
                reports={reports}
                onSelectReport={(id) => handleNavigate('report-detail', id)}
              />
            )}

            {activeTab === 'solutions' && (
              <SolutionsAndActionsPage
                briefs={briefs}
                reports={reports}
                onSelectReport={(id) => handleNavigate('report-detail', id)}
                onRefreshData={loadData}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsPage
                reports={reports}
              />
            )}

            {activeTab === 'track' && (
              <TrackReportPage
                initialToken={trackingTokenParam}
                onNavigate={handleNavigate}
              />
            )}

            {activeTab === 'report-detail' && selectedReportId && (
              <ReportDetailPage
                reportId={selectedReportId}
                userRole={userRole}
                departments={departments}
                onBack={() => setActiveTab('reports')}
                onRefresh={loadData}
                onNavigateToReport={(id) => handleNavigate('report-detail', id)}
              />
            )}

            {activeTab === 'admin' && (
              <AdminPage
                departments={departments}
                reports={reports}
                onRefreshData={loadData}
              />
            )}
          </>
        )}
      </main>

      {/* Municipal Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900 tracking-tight">CivicAI</span>
            <span>—</span>
            <span>Smart City Issue Intelligence & Resolution Platform</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-slate-600">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              PromptWars × Astra National Hackathon
            </span>
            <span>•</span>
            <span className="font-mono text-slate-500">
              {storageStatus.configured ? 'Supabase PostgreSQL' : 'Local Persistent Demo Mode'}
            </span>
          </div>

          <div className="text-[11px] text-slate-400">
            Open Civic Technology Initiative
          </div>
        </div>
      </footer>

    </div>
  );
};
