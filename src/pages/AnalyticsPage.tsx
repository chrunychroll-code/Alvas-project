import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { CivicReport, ReportCategory } from '../types';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle2, 
  FileText,
  Clock,
  Layers
} from 'lucide-react';

interface AnalyticsPageProps {
  reports: CivicReport[];
  onSelectCategory?: (category: ReportCategory) => void;
}

const PRIORITY_COLORS: Record<string, string> = {
  Critical: '#e11d48',
  High: '#ea580c',
  Medium: '#f59e0b',
  Low: '#10b981'
};

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ reports }) => {
  // Category Breakdown Data
  const categoryData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    reports.forEach(r => {
      counts[r.category] = (counts[r.category] || 0) + 1;
    });

    return Object.entries(counts).map(([name, count]) => ({
      name: name.replace(' and ', ' & '),
      count
    })).sort((a, b) => b.count - a.count);
  }, [reports]);

  // Priority Band Breakdown Data
  const priorityData = React.useMemo(() => {
    const counts: Record<string, number> = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    reports.forEach(r => {
      counts[r.priorityBand] = (counts[r.priorityBand] || 0) + 1;
    });

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value
    }));
  }, [reports]);

  // Status Breakdown Data
  const statusData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    reports.forEach(r => {
      counts[r.status] = (counts[r.status] || 0) + 1;
    });

    return Object.entries(counts).map(([name, count]) => ({
      name,
      count
    }));
  }, [reports]);

  const total = reports.length;
  const critical = reports.filter(r => r.priorityBand === 'Critical').length;
  const resolved = reports.filter(r => r.status === 'Resolved').length;
  const duplicates = reports.filter(r => !!r.duplicateOf).length;

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-teal-600" />
          <span>Municipal Analytics & Health Dashboard</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Real-time metrics, priority distribution, and resolution velocity computed dynamically from database records.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
          <div className="text-slate-500 text-xs font-semibold uppercase flex items-center justify-between">
            <span>Total Intake</span>
            <FileText className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{total}</div>
          <p className="text-[11px] text-slate-400 mt-1">Verified stored civic reports</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
          <div className="text-slate-500 text-xs font-semibold uppercase flex items-center justify-between">
            <span>Critical Hazards</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-extrabold text-rose-600 mt-2">{critical}</div>
          <p className="text-[11px] text-slate-400 mt-1">Requiring rapid containment</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
          <div className="text-slate-500 text-xs font-semibold uppercase flex items-center justify-between">
            <span>Resolved Cases</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 mt-2">{resolved}</div>
          <p className="text-[11px] text-slate-400 mt-1">Certified with completion proof</p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm">
          <div className="text-slate-500 text-xs font-semibold uppercase flex items-center justify-between">
            <span>Duplicate Rate</span>
            <Layers className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-3xl font-extrabold text-sky-600 mt-2">
            {total > 0 ? `${Math.round((duplicates / total) * 100)}%` : '0%'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{duplicates} corroborated duplicates</p>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Breakdown (Bar Chart) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-teal-600" />
            <span>Reports by Problem Domain</span>
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ left: 10, right: 20, top: 10, bottom: 10 }}>
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#0d9488" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Breakdown (Pie / Donut Chart) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-rose-600" />
            <span>Explainable Priority Band Breakdown</span>
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.name] || '#64748b'} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  formatter={(value) => <span className="text-xs text-slate-700 font-medium">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Pipeline Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4 lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-sky-600" />
            <span>Workflow Status Pipeline Distribution</span>
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#0284c7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
