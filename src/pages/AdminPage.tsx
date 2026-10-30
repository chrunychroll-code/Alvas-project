import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Database, 
  Map, 
  Cpu, 
  RotateCcw, 
  CheckCircle2, 
  Building2, 
  Layers, 
  Sliders, 
  AlertTriangle,
  Info
} from 'lucide-react';
import { Department, CivicReport } from '../types';
import { storageService } from '../services/storageService';

interface AdminPageProps {
  departments: Department[];
  reports: CivicReport[];
  onRefreshData: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  departments,
  reports,
  onRefreshData
}) => {
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const storageStatus = storageService.getStorageStatus();
  const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const isGoogleMapsConfigured = Boolean(googleApiKey && googleApiKey.trim().length > 10);
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const handleResetData = () => {
    if (window.confirm('Reset all demonstration data to the original 45 synthetic civic reports? Any newly submitted test reports will be replaced.')) {
      storageService.resetToDemoData();
      onRefreshData();
      setResetMessage('Database reset successfully to 45 demonstration records!');
      setTimeout(() => setResetMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-7 h-7 text-slate-900" />
          <span>Municipal Authority & Administration Portal</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Operational controls, database synchronization, department routing, and algorithm parameter inspection.
        </p>
      </div>

      {resetMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{resetMessage}</span>
        </div>
      )}

      {/* System Integration Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Supabase Status */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Database Persistence
            </span>
            <Database className={`w-4 h-4 ${storageStatus.configured ? 'text-emerald-600' : 'text-slate-400'}`} />
          </div>
          <div className="text-lg font-bold text-slate-900">
            {storageStatus.configured ? 'Supabase Cloud Connected' : 'Local Persistent Store'}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            {storageStatus.configured
              ? 'Synchronized with Supabase PostgreSQL and Row-Level Security policies.'
              : 'Active in offline hackathon demo mode with 45+ persistent local records.'}
          </p>
        </div>

        {/* Maps Integration */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Map Engine
            </span>
            <Map className={`w-4 h-4 ${isGoogleMapsConfigured ? 'text-emerald-600' : 'text-amber-500'}`} />
          </div>
          <div className="text-lg font-bold text-slate-900">
            {isGoogleMapsConfigured ? 'Google Maps JS Active' : 'OpenStreetMap Engine'}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            {isGoogleMapsConfigured
              ? 'Google Maps API key detected. Interactive vector tiles active.'
              : 'Interactive OpenStreetMap engine running seamlessly with coordinate picking.'}
          </p>
        </div>

        {/* AI Engine Status */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              AI Intelligence Pipeline
            </span>
            <Cpu className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-lg font-bold text-slate-900">
            Deterministic NLP + Safety Rules
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Explainable priority scoring (0-100), automatic life safety overrides, and domain-specific solution matrices.
          </p>
        </div>

      </div>

      {/* Demo Data Management */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Demonstration Dataset Management
            </h2>
            <p className="text-xs text-slate-600">
              Manage the synthetic demonstration dataset ({reports.length} records currently loaded).
            </p>
          </div>

          <button
            onClick={handleResetData}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
          >
            <RotateCcw className="w-4 h-4 text-teal-400" />
            <span>Reset / Re-Seed 45 Synthetic Reports</span>
          </button>
        </div>

        <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 text-xs text-slate-600 space-y-1">
          <p><strong>Demonstration Coverage:</strong></p>
          <ul className="list-disc list-inside space-y-0.5 text-slate-600 pl-1">
            <li>Critical safety hazard: Dangling sparking high-voltage electrical cable near school (ID #001).</li>
            <li>Chronic waterlogging cluster: 3 correlated flooding complaints at 100ft road underpass (IDs #002, #003, #004).</li>
            <li>Deliberate duplicate pair: Potholes at Metro Pillar 142 MG Road with 94% text and spatial match (IDs #005 & #006).</li>
            <li>Overflowing market garbage dumpster with bio-sanitizer action plan (ID #007).</li>
            <li>Streetlight dark corridor on Ring Road (ID #008).</li>
            <li>Potable water pipeline burst gushing thousands of liters (ID #009).</li>
            <li>Resolved pedestrian concrete slab with completion verification summary (ID #010).</li>
          </ul>
        </div>
      </div>

      {/* Algorithm Weights & Scoring Inspection */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-teal-600" />
          <span>Priority Scoring Weight Matrix (0 - 100)</span>
        </h2>
        <p className="text-xs text-slate-600">
          Transparent, deterministic weights utilized to establish civic attention priority without black-box bias.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Safety Risk</span>
            <span className="text-lg font-extrabold text-rose-600">35%</span>
            <span className="text-[10px] text-slate-500 block">Life safety factor</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Public Impact</span>
            <span className="text-lg font-extrabold text-sky-600">25%</span>
            <span className="text-[10px] text-slate-500 block">Transit disruption</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Severity</span>
            <span className="text-lg font-extrabold text-amber-600">20%</span>
            <span className="text-[10px] text-slate-500 block">Physical damage</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Urgency</span>
            <span className="text-lg font-extrabold text-teal-600">10%</span>
            <span className="text-[10px] text-slate-500 block">Temporal decay</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Corroboration</span>
            <span className="text-lg font-extrabold text-indigo-600">10%</span>
            <span className="text-[10px] text-slate-500 block">Multiple citizen reports</span>
          </div>
        </div>

        <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-3 text-xs text-rose-950 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Explicit Safety Override Protocol:</strong> Immediate physical life hazards (e.g. sparking high-voltage wires, gas leaks, structural cave-ins) immediately override standard weighting to force a minimum priority score of 88.0 (Critical), ensuring immediate emergency dispatch regardless of report volume.
          </div>
        </div>
      </div>

      {/* Municipal Departments Directory */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-teal-600" />
          <span>Configured Municipal Departments ({departments.length})</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {departments.map(dept => (
            <div key={dept.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/40 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{dept.name}</span>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  {dept.code}
                </span>
              </div>
              <p className="text-slate-600 text-[11px]">{dept.description}</p>
              <div className="text-[10px] text-slate-400 pt-1">
                Contact: <span className="font-mono">{dept.contactEmail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
