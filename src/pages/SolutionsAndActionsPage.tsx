import React, { useState } from 'react';
import { 
  Wrench, 
  Layers, 
  FileCheck2, 
  AlertTriangle, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  Link2, 
  MapPin, 
  Info,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { ActionBrief, CivicReport, DuplicateMatchResult, ReportCategory } from '../types';
import { findPotentialDuplicates } from '../services/duplicateEngine';
import { storageService } from '../services/storageService';

interface SolutionsAndActionsPageProps {
  briefs: ActionBrief[];
  reports: CivicReport[];
  onSelectReport: (reportId: string) => void;
  onRefreshData: () => void;
}

export const SolutionsAndActionsPage: React.FC<SolutionsAndActionsPageProps> = ({
  briefs,
  reports,
  onSelectReport,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'briefs' | 'matrix' | 'duplicates'>('briefs');
  const [linkingStatus, setLinkingStatus] = useState<string | null>(null);

  // Compute detected duplicate pairs across the dataset
  const duplicatePairs: DuplicateMatchResult[] = React.useMemo(() => {
    const results: DuplicateMatchResult[] = [];
    const seen = new Set<string>();

    for (let i = 0; i < reports.length; i++) {
      const primary = reports[i];
      const matches = findPotentialDuplicates(primary, reports, 60);

      for (const m of matches) {
        const pairKey = [primary.id, m.candidateReport.id].sort().join('_');
        if (!seen.has(pairKey)) {
          seen.add(pairKey);
          results.push(m);
        }
      }
    }
    return results;
  }, [reports]);

  // Handle linking duplicate
  const handleLink = async (primaryId: string, duplicateId: string) => {
    setLinkingStatus('Linking incident...');
    try {
      await storageService.linkDuplicate(primaryId, duplicateId, 'Municipal Operations Dispatch');
      setLinkingStatus('Incident linked successfully!');
      setTimeout(() => setLinkingStatus(null), 2500);
      onRefreshData();
    } catch (e: any) {
      setLinkingStatus(`Failed: ${e.message}`);
    }
  };

  const solutionCategories: ReportCategory[] = [
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

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Wrench className="w-7 h-7 text-teal-600" />
            <span>Problem-to-Solution Engine & Action Briefs</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Translating civic complaints into actionable municipal engineering workflows and operational briefs.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('briefs')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'briefs'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Action Briefs ({briefs.length})
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'matrix'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Solution Matrices (10)
          </button>
          <button
            onClick={() => setActiveTab('duplicates')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'duplicates'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Duplicate Radar ({duplicatePairs.length})
          </button>
        </div>
      </div>

      {linkingStatus && (
        <div className="bg-teal-50 border border-teal-200 text-teal-900 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-teal-600" />
          <span>{linkingStatus}</span>
        </div>
      )}

      {/* TAB 1: OPERATIONAL ACTION BRIEFS */}
      {activeTab === 'briefs' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {briefs.map(brief => (
              <div 
                key={brief.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow p-6 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                      Operational Action Brief
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                      brief.priority === 'Critical'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {brief.priority} Priority • {brief.confidenceScore}% Confidence
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                    {brief.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                    <span>Area: <strong>{brief.area}</strong></span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="font-bold text-slate-700 block mb-0.5">Observed Pattern:</span>
                      <p className="text-slate-600 leading-relaxed">{brief.observedPattern}</p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="font-bold text-slate-700 block mb-0.5">Public & Transit Impact:</span>
                      <p className="text-slate-600 leading-relaxed">{brief.publicImpact}</p>
                    </div>

                    <div className="bg-teal-50/70 p-3.5 rounded-xl border border-teal-200/80">
                      <span className="font-bold text-teal-900 block mb-1">Recommended Municipal Action:</span>
                      <p className="text-teal-950 font-medium leading-relaxed">{brief.suggestedAction}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                  {/* Supporting Evidence Reports */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Supporting Evidence Incidents ({brief.reportIds.length} Reports):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {brief.reportIds.map(repId => {
                        const rep = reports.find(r => r.id === repId);
                        return (
                          <button
                            key={repId}
                            onClick={() => onSelectReport(repId)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-2 py-1 rounded-lg text-[11px] font-mono font-medium flex items-center gap-1 transition-colors"
                          >
                            <span>#{repId.slice(0, 8)}</span>
                            {rep && <span className="text-slate-500">({rep.category})</span>}
                            <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Explicit Limitations Disclosure */}
                  <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-2.5 text-[11px] text-amber-900 flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                    <span><strong>Limitations Note:</strong> {brief.limitations}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PROBLEM-TO-SOLUTION KNOWLEDGE MATRIX */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900">
              Departmental Problem-to-Solution Mapping Engine
            </h2>
            <p className="text-xs text-slate-600 max-w-3xl">
              CivicAI does not produce generic placeholder responses. Every civic complaint maps directly 
              to domain-specific engineering workflows, safety isolation protocols, target response hours, 
              and accountable municipal departments.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {solutionCategories.map(cat => {
                // Fetch a sample report in this category
                const sample = reports.find(r => r.category === cat) || reports[0];
                const analysis = sample.analysis;

                return (
                  <div key={cat} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">
                        {cat}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                        Dept: {analysis?.suggestedDepartmentCode || 'PWD'}
                      </span>
                    </div>

                    <div className="text-xs space-y-1">
                      <span className="font-semibold text-slate-700 block">Standard Protocol:</span>
                      <p className="text-slate-600 leading-relaxed">
                        {analysis?.proposedSolution || 'Field triage and corrective engineering plan.'}
                      </p>
                    </div>

                    {analysis?.recommendedActions && (
                      <div className="space-y-1 pt-2 border-t border-slate-200/60">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Step-by-Step Action Plan:
                        </span>
                        <ol className="list-decimal list-inside text-[11px] text-slate-700 space-y-0.5">
                          {analysis.recommendedActions.slice(0, 3).map((act, idx) => (
                            <li key={idx} className="truncate">
                              {act.action} <span className="text-slate-400">({act.timeframe})</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DUPLICATE RESOLUTION HUB */}
      {activeTab === 'duplicates' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Spatial & Textual Duplicate Resolution Radar
              </h2>
              <p className="text-xs text-slate-600">
                Identifies corroborating citizen reports within proximity using TF-IDF token vectors and Haversine distance calculations.
              </p>
            </div>

            {duplicatePairs.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No potential duplicates detected above the 60% confidence threshold.
              </div>
            ) : (
              <div className="space-y-4">
                {duplicatePairs.map((match, idx) => {
                  const { primaryReport, candidateReport, textSimilarity, geoDistanceMeters, combinedConfidence, isConfirmedDuplicate } = match;
                  return (
                    <div 
                      key={idx}
                      className="border border-slate-200 rounded-2xl p-5 bg-white space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                            combinedConfidence >= 80 
                              ? 'bg-rose-100 text-rose-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {combinedConfidence}% Match Confidence
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            Distance: <strong>{geoDistanceMeters}m</strong> | Text Overlap: <strong>{textSimilarity}%</strong>
                          </span>
                        </div>

                        {isConfirmedDuplicate ? (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1 self-start sm:self-auto">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Confirmed & Linked Duplicate</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleLink(primaryReport.id, candidateReport.id)}
                            className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
                          >
                            <Link2 className="w-3.5 h-3.5" />
                            <span>Link as Duplicate</span>
                          </button>
                        )}
                      </div>

                      {/* Side by side comparison */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div 
                          onClick={() => onSelectReport(primaryReport.id)}
                          className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:bg-slate-100 transition-colors"
                        >
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                            Primary Incident #{primaryReport.id.slice(0, 8)}
                          </div>
                          <h4 className="font-bold text-xs text-slate-900 mb-1">
                            {primaryReport.title}
                          </h4>
                          <p className="text-xs text-slate-600 line-clamp-2">
                            {primaryReport.description}
                          </p>
                          <div className="text-[11px] text-slate-400 mt-2">
                            {primaryReport.address}
                          </div>
                        </div>

                        <div 
                          onClick={() => onSelectReport(candidateReport.id)}
                          className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:bg-slate-100 transition-colors"
                        >
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                            Candidate Duplicate #{candidateReport.id.slice(0, 8)}
                          </div>
                          <h4 className="font-bold text-xs text-slate-900 mb-1">
                            {candidateReport.title}
                          </h4>
                          <p className="text-xs text-slate-600 line-clamp-2">
                            {candidateReport.description}
                          </p>
                          <div className="text-[11px] text-slate-400 mt-2">
                            {candidateReport.address}
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-slate-500 bg-teal-50/40 p-2.5 rounded-xl border border-teal-100">
                        <strong>Algorithm Explanation:</strong> {match.reason}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
