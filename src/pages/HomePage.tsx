import React from 'react';
import { 
  ArrowRight, 
  PlusCircle, 
  Map, 
  ShieldAlert, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  Sparkles, 
  Clock, 
  FileText,
  AlertTriangle,
  Building2,
  Wrench
} from 'lucide-react';
import { CivicReport, HotspotCluster } from '../types';
import { CivicMap } from '../components/CivicMap';

interface HomePageProps {
  reports: CivicReport[];
  hotspots: HotspotCluster[];
  onNavigate: (tab: string, reportId?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  reports,
  hotspots,
  onNavigate
}) => {
  // Live statistics derived from stored dataset (NEVER hardcoded fake numbers)
  const totalReports = reports.length;
  const criticalReports = reports.filter(r => r.priorityBand === 'Critical').length;
  const openReports = reports.filter(r => r.status !== 'Resolved' && r.status !== 'Closed').length;
  const resolvedReports = reports.filter(r => r.status === 'Resolved').length;

  const resolutionRate = totalReports > 0 
    ? Math.round((resolvedReports / totalReports) * 100) 
    : 0;

  const recentReports = reports.slice(0, 5);

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white p-8 sm:p-12 border border-slate-800 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-950/80 border border-teal-500/30 text-teal-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>PromptWars × Astra National Hackathon Prototype</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            AI-Powered Smart City <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-sky-300 to-blue-400">
              Issue Intelligence & Resolution
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            CivicAI bridges citizens and municipal authorities through intelligent problem reporting, 
            explainable AI priority scoring, automatic duplicate detection, geographic hotspot clustering, 
            and tailored engineering solutions for every civic complaint.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('report')}
              className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-teal-500/25 transition-all hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report a Problem in 60s</span>
            </button>

            <button
              onClick={() => onNavigate('map')}
              className="px-6 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-white border border-slate-700 font-semibold text-sm flex items-center gap-2 transition-all hover:border-slate-500"
            >
              <Map className="w-4 h-4 text-sky-400" />
              <span>Explore Live City Map</span>
            </button>

            <button
              onClick={() => onNavigate('track')}
              className="px-4 py-3 rounded-xl text-slate-300 hover:text-white font-medium text-sm flex items-center gap-1.5 transition-colors"
            >
              <span>Track Existing Report</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Metrics Grid Derived from Real Database */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-slate-800/80">
          <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/50">
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {totalReports}
            </div>
            <div className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-teal-400" />
              <span>Total Stored Reports</span>
            </div>
          </div>

          <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/50">
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-400">
              {criticalReports}
            </div>
            <div className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Critical Hazards</span>
            </div>
          </div>

          <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/50">
            <div className="text-2xl sm:text-3xl font-extrabold text-sky-400">
              {hotspots.length}
            </div>
            <div className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-400" />
              <span>Detected Hotspots</span>
            </div>
          </div>

          <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/50">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
              {resolutionRate}%
            </div>
            <div className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Resolved</span>
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Stages Architecture Overview */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How CivicAI Works
          </h2>
          <p className="text-sm text-slate-600">
            An end-to-end intelligent closed loop connecting citizens, algorithms, and municipal departments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Stage 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold text-sm mb-4">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              1. CAPTURE
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Citizens submit public issues in under 60 seconds with photographic evidence, auto or manual categorization, and precision map coordinates.
            </p>
          </div>

          {/* Stage 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-sm mb-4">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              2. UNDERSTAND
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Deterministic NLP parses reports, scores explainable priority (0-100), applies automatic safety overrides for immediate hazards, and generates tailored engineering solutions.
            </p>
          </div>

          {/* Stage 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold text-sm mb-4">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              3. REVEAL
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Calculates Haversine distances and text vectors to flag duplicates, clusters nearby incidents into geographic hotspots, and produces operational Action Briefs.
            </p>
          </div>

          {/* Stage 4 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold text-sm mb-4">
              04
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              4. ACT
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Authorities review proposed action plans, assign responsible field teams, advance structured workflow states, and upload completion proof.
            </p>
          </div>
        </div>
      </section>

      {/* Map Preview & Hotspots Showcase */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Live City Incident & Hotspot Map
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Interactive geographic intelligence showing real reports, category markers, and spatial clusters.
            </p>
          </div>
          <button
            onClick={() => onNavigate('map')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 self-start sm:self-center"
          >
            <span>Open Full Interactive Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <CivicMap
          reports={reports}
          hotspots={hotspots}
          height="450px"
          onSelectReport={(report) => onNavigate('report-detail', report.id)}
        />
      </section>

      {/* Recently Reported Problems */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Recently Reported Civic Issues
            </h2>
            <p className="text-xs text-slate-600">
              Transparent live municipal queue showing latest citizen reports and AI solutions.
            </p>
          </div>
          <button
            onClick={() => onNavigate('reports')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
          >
            <span>View All ({reports.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentReports.map(report => (
            <div
              key={report.id}
              onClick={() => onNavigate('report-detail', report.id)}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    report.priorityBand === 'Critical'
                      ? 'bg-rose-100 text-rose-800'
                      : report.priorityBand === 'High'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {report.priorityBand} • {report.priorityScore}
                  </span>

                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    report.status === 'Resolved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : report.status === 'In Progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {report.status}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2">
                  {report.title}
                </h4>

                <p className="text-xs text-slate-600 line-clamp-2">
                  {report.description}
                </p>

                {report.analysis && (
                  <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-2.5 text-xs">
                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-0.5">
                      Proposed Solution:
                    </span>
                    <p className="text-slate-800 line-clamp-2">
                      {report.analysis.proposedSolution}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>{report.category}</span>
                <span>{new Date(report.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
