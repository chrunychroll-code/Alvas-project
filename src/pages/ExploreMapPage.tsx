import React, { useState, useMemo } from 'react';
import { CivicReport, HotspotCluster, ReportCategory, PriorityBand, ReportStatus } from '../types';
import { CivicMap } from '../components/CivicMap';
import { 
  Filter, 
  MapPin, 
  AlertCircle, 
  ShieldAlert, 
  CheckCircle2, 
  Layers, 
  Eye, 
  Search,
  ExternalLink
} from 'lucide-react';

interface ExploreMapPageProps {
  reports: CivicReport[];
  hotspots: HotspotCluster[];
  onSelectReport: (reportId: string) => void;
}

const CATEGORIES: ('All' | ReportCategory)[] = [
  'All',
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

const PRIORITIES: ('All' | PriorityBand)[] = ['All', 'Critical', 'High', 'Medium', 'Low'];
const STATUSES: ('All' | ReportStatus)[] = ['All', 'Submitted', 'Under Review', 'Verified', 'Assigned', 'In Progress', 'Resolved'];

export const ExploreMapPage: React.FC<ExploreMapPageProps> = ({
  reports,
  hotspots,
  onSelectReport
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | ReportCategory>('All');
  const [selectedPriority, setSelectedPriority] = useState<'All' | PriorityBand>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | ReportStatus>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showHotspots, setShowHotspots] = useState(true);
  const [activeReportId, setActiveReportId] = useState<string | undefined>(undefined);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      if (selectedCategory !== 'All' && r.category !== selectedCategory) return false;
      if (selectedPriority !== 'All' && r.priorityBand !== selectedPriority) return false;
      if (selectedStatus !== 'All' && r.status !== selectedStatus) return false;
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        return (
          r.title.toLowerCase().includes(term) ||
          r.description.toLowerCase().includes(term) ||
          r.address.toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [reports, selectedCategory, selectedPriority, selectedStatus, searchTerm]);

  return (
    <div className="space-y-4 pb-12">
      
      {/* Header and Filter Controls */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-4 sm:p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <MapPin className="w-6 h-6 text-teal-600" />
              <span>City Incident Map & Hotspot Radar</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Filter by municipal domain, priority band, or inspect detected geographic clusters.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search address, landmark..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          {/* Category Dropdown */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-teal-500"
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Priority Dropdown */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Priority
            </label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value as any)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-teal-500"
            >
              {PRIORITIES.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Workflow Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-teal-500"
            >
              {STATUSES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Hotspots Toggle */}
          <div className="flex items-end">
            <button
              onClick={() => setShowHotspots(!showHotspots)}
              className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                showHotspots
                  ? 'bg-teal-50 text-teal-800 border-teal-300'
                  : 'bg-slate-100 text-slate-600 border-slate-300'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-teal-600" />
              <span>{showHotspots ? 'Hotspots Active' : 'Show Hotspot Zones'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Map & Side Feed Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Map Canvas (3 Cols) */}
        <div className="lg:col-span-3">
          <CivicMap
            reports={filteredReports}
            hotspots={hotspots}
            showHotspots={showHotspots}
            selectedReportId={activeReportId}
            onSelectReport={(report) => {
              setActiveReportId(report.id);
            }}
            height="620px"
          />
        </div>

        {/* Side Incident Queue (1 Col) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-4 flex flex-col h-[620px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Filtered Queue
            </span>
            <span className="text-xs font-extrabold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
              {filteredReports.length}
            </span>
          </div>

          <div className="overflow-y-auto space-y-2.5 flex-1 pr-1 custom-scrollbar">
            {filteredReports.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No incidents match current filter parameters.
              </div>
            ) : (
              filteredReports.map(report => {
                const isSelected = report.id === activeReportId;
                return (
                  <div
                    key={report.id}
                    onClick={() => setActiveReportId(report.id)}
                    className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-teal-50/70 border-teal-400 shadow-xs'
                        : 'bg-white border-slate-200/80 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        report.priorityBand === 'Critical'
                          ? 'bg-rose-100 text-rose-800'
                          : report.priorityBand === 'High'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {report.priorityBand}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {report.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 line-clamp-1 mb-1">
                      {report.title}
                    </h4>
                    
                    <p className="text-[11px] text-slate-500 truncate mb-2">
                      {report.address}
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100/60">
                      <span className="text-[10px] text-teal-700 font-semibold truncate max-w-[120px]">
                        {report.category}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectReport(report.id);
                        }}
                        className="text-[10px] font-bold text-slate-700 hover:text-teal-700 flex items-center gap-0.5"
                      >
                        <span>Details</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
