import React, { useState, useMemo } from 'react';
import { CivicReport, ReportCategory, PriorityBand, ReportStatus } from '../types';
import { 
  Search, 
  Filter, 
  MapPin, 
  ShieldAlert, 
  ArrowRight, 
  LayoutGrid, 
  Table as TableIcon,
  Link2,
  Calendar,
  CheckCircle2
} from 'lucide-react';

interface AllReportsPageProps {
  reports: CivicReport[];
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

export const AllReportsPage: React.FC<AllReportsPageProps> = ({
  reports,
  onSelectReport
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | ReportCategory>('All');
  const [selectedPriority, setSelectedPriority] = useState<'All' | PriorityBand>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | ReportStatus>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

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
          r.address.toLowerCase().includes(term) ||
          (r.trackingToken && r.trackingToken.toLowerCase().includes(term))
        );
      }
      return true;
    });
  }, [reports, selectedCategory, selectedPriority, selectedStatus, searchTerm]);

  return (
    <div className="space-y-6 pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            All Civic Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Comprehensive municipal queue showing all {reports.length} stored civic records.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Grid</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TableIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Table</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-4 sm:p-5 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by keywords, address, or Tracking ID (e.g. CIVIC-ELEC-4491)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-teal-500"
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-teal-500"
            >
              {PRIORITIES.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-teal-500"
            >
              {STATUSES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>Showing <strong>{filteredReports.length}</strong> of <strong>{reports.length}</strong> reports</span>
          {(selectedCategory !== 'All' || selectedPriority !== 'All' || selectedStatus !== 'All' || searchTerm) && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedPriority('All');
                setSelectedStatus('All');
                setSearchTerm('');
              }}
              className="text-teal-700 font-semibold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map(report => (
            <div
              key={report.id}
              onClick={() => onSelectReport(report.id)}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-teal-300 transition-all p-5 flex flex-col justify-between cursor-pointer group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {report.trackingToken || `#${report.id.slice(0, 8)}`}
                  </span>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    report.priorityBand === 'Critical'
                      ? 'bg-rose-100 text-rose-800'
                      : report.priorityBand === 'High'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {report.priorityBand} • {report.priorityScore}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2">
                    {report.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                    {report.description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{report.address}</span>
                </div>

                {report.duplicateOf && (
                  <div className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-[10px] font-semibold">
                    <Link2 className="w-3 h-3 text-amber-700" />
                    <span>Linked Duplicate Incident</span>
                  </div>
                )}

                {report.analysis && (
                  <div className="bg-teal-50/50 border border-teal-100 rounded-xl p-2.5 text-xs">
                    <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block mb-0.5">
                      Proposed Solution
                    </span>
                    <p className="text-teal-950 line-clamp-2">
                      {report.analysis.proposedSolution}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  report.status === 'Resolved'
                    ? 'bg-emerald-100 text-emerald-800'
                    : report.status === 'In Progress'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {report.status}
                </span>

                <button className="text-xs font-semibold text-teal-700 group-hover:text-teal-900 flex items-center gap-1">
                  <span>Inspect Plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Tracking ID</th>
                  <th className="py-3 px-4">Problem & Location</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Target Hours</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.map(report => (
                  <tr 
                    key={report.id}
                    onClick={() => onSelectReport(report.id)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">
                      {report.trackingToken || `#${report.id.slice(0, 8)}`}
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-slate-900 truncate">{report.title}</div>
                      <div className="text-[11px] text-slate-500 truncate">{report.address}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700 whitespace-nowrap">
                      {report.category}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        report.priorityBand === 'Critical'
                          ? 'bg-rose-100 text-rose-800'
                          : report.priorityBand === 'High'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {report.priorityBand} ({report.priorityScore})
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        report.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : report.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {report.analysis?.targetResponseHours ? `~${report.analysis.targetResponseHours}h` : '—'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="text-teal-700 font-bold hover:underline">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
