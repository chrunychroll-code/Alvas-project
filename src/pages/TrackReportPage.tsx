import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Building2, 
  Wrench, 
  FileText,
  User,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { CivicReport } from '../types';
import { storageService } from '../services/storageService';

interface TrackReportPageProps {
  initialToken?: string;
  onNavigate: (tab: string, reportId?: string) => void;
}

export const TrackReportPage: React.FC<TrackReportPageProps> = ({
  initialToken,
  onNavigate
}) => {
  const [tokenInput, setTokenInput] = useState(initialToken || '');
  const [report, setReport] = useState<CivicReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (tokenToSearch?: string) => {
    const term = (tokenToSearch || tokenInput).trim();
    if (!term) {
      setError('Please enter a valid Tracking Token or Report ID.');
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const result = await storageService.getReportByTrackingToken(term);
      if (result) {
        setReport(result);
      } else {
        setReport(null);
        setError('No civic report found matching that tracking token. Please double check the ID.');
      }
    } catch (err: any) {
      setError(err.message || 'Error looking up report.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialToken) {
      setTokenInput(initialToken);
      handleSearch(initialToken);
    }
  }, [initialToken]);

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-8 pb-16">
      
      {/* Search Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Track Your Civic Issue
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          Enter your unique tracking code to view real-time department assignment, proposed solutions, and public progress updates.
        </p>

        {/* Input Form */}
        <div className="max-w-xl mx-auto pt-4">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3" />
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Enter Tracking Token (e.g. CIVIC-ELEC-4491)"
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-300 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Track Status</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Token Links */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-500">
            <span>Try sample tokens:</span>
            <button
              type="button"
              onClick={() => {
                setTokenInput('CIVIC-ELEC-4491');
                handleSearch('CIVIC-ELEC-4491');
              }}
              className="text-teal-700 font-bold hover:underline bg-teal-50 px-2 py-0.5 rounded border border-teal-200"
            >
              CIVIC-ELEC-4491 (In Progress)
            </button>
            <button
              type="button"
              onClick={() => {
                setTokenInput('CIVIC-INFR-5501');
                handleSearch('CIVIC-INFR-5501');
              }}
              className="text-teal-700 font-bold hover:underline bg-teal-50 px-2 py-0.5 rounded border border-teal-200"
            >
              CIVIC-INFR-5501 (Resolved)
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-4 text-xs text-center flex items-center justify-center gap-2 max-w-lg mx-auto">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Report Public Tracking View */}
      {report && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-lg p-6 sm:p-8 space-y-8 animate-fade-in">
          
          {/* Status Header Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                  Tracking Code:
                </span>
                <span className="text-base font-mono font-extrabold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                  {report.trackingToken || `#${report.id.slice(0, 8)}`}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {report.title}
              </h2>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-1">
              <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                report.status === 'Resolved'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : report.status === 'In Progress'
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}>
                ● Current Status: {report.status}
              </span>
              <span className="text-[11px] text-slate-400">
                Reported on {new Date(report.createdAt).toLocaleDateString()} at {new Date(report.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* Details & Location Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Category
              </span>
              <span className="text-sm font-bold text-slate-900">{report.category}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Assigned Authority
              </span>
              <span className="text-sm font-bold text-teal-800">
                {report.assignedDepartmentName || 'Department Triage Pending'}
              </span>
              {report.assignedTo && (
                <span className="block text-xs text-slate-500 mt-0.5">({report.assignedTo})</span>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Location
              </span>
              <div className="text-xs font-medium text-slate-800 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="truncate">{report.address}</span>
              </div>
            </div>
          </div>

          {/* Resolved Certification Card */}
          {report.status === 'Resolved' && report.resolutionSummary && (
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Verified Resolution & Completion Summary</span>
              </div>
              <p className="text-xs text-emerald-950 leading-relaxed font-medium">
                {report.resolutionSummary}
              </p>
              {report.resolvedAt && (
                <span className="block text-[11px] text-emerald-700">
                  Certified resolved at: {new Date(report.resolvedAt).toLocaleString()}
                </span>
              )}
            </div>
          )}

          {/* Citizen Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Citizen Description
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 bg-slate-50/60 p-4 rounded-2xl border border-slate-200/80 leading-relaxed">
              {report.description}
            </p>
          </div>

          {/* AI Proposed Engineering Solution Plan */}
          {report.analysis && (
            <div className="bg-teal-50/50 border border-teal-200/80 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-teal-700" />
                  <span className="text-xs font-bold text-teal-900 uppercase tracking-wider">
                    Corrective Action Plan
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  Target Response Window: <strong>~{report.analysis.targetResponseHours}h</strong>
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-900 font-semibold leading-relaxed">
                {report.analysis.proposedSolution}
              </p>

              {report.analysis.recommendedActions && (
                <div className="space-y-2 pt-2 border-t border-teal-200/60">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                    Execution Steps:
                  </span>
                  <div className="space-y-1.5">
                    {report.analysis.recommendedActions.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <span className="w-4 h-4 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {step.step}
                        </span>
                        <span>{step.action}</span>
                        <span className="text-[11px] text-slate-400 ml-auto whitespace-nowrap">
                          {step.timeframe}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Public Progress History Timeline */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>Public Progress Timeline</span>
            </h3>

            {(!report.history || report.history.length === 0) ? (
              <p className="text-xs text-slate-400">No public progress updates posted yet.</p>
            ) : (
              <div className="space-y-4 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-200">
                {report.history.map((item, idx) => (
                  <div key={idx} className="relative flex items-start gap-4 pl-8">
                    <div className="absolute left-1.5 top-1 w-3.5 h-3.5 rounded-full bg-teal-500 border-2 border-white shadow-xs" />
                    <div className="flex-1 bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">
                          {item.newStatus}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(item.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-slate-600">
                        {item.publicComment || `Status changed to ${item.newStatus}.`}
                      </p>
                      <div className="text-[10px] text-slate-400 pt-1">
                        Updated by: <strong>{item.actorName}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
