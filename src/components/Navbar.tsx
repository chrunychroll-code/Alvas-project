import React from 'react';
import { 
  Home, 
  PlusCircle, 
  Map, 
  ListFilter, 
  Wrench, 
  BarChart3, 
  Search, 
  ShieldCheck, 
  Database,
  Menu,
  X
} from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  storageStatus: { mode: string; configured: boolean; storageName: string };
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  storageStatus
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'home', label: 'Overview', icon: Home },
    { id: 'report', label: 'Report Issue', icon: PlusCircle, highlight: true },
    { id: 'map', label: 'Explore Map', icon: Map },
    { id: 'reports', label: 'All Reports', icon: ListFilter },
    { id: 'solutions', label: 'Solutions & Briefs', icon: Wrench },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'track', label: 'Track Issue', icon: Search },
    { id: 'admin', label: 'Authority Portal', icon: ShieldCheck, authorityOnly: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('home')} 
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-teal-500/40 p-1.5 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" className="w-full h-full">
                <circle cx="50" cy="50" r="38" stroke="#0D9488" strokeWidth="6" strokeDasharray="4 6" opacity="0.6"/>
                <path d="M50 20 L76 35 L76 65 L50 80 L24 65 L24 35 Z" stroke="#38BDF8" strokeWidth="8" strokeLinejoin="round" fill="none"/>
                <circle cx="50" cy="50" r="14" fill="#0D9488"/>
                <path d="M50 36 L50 64 M36 50 L64 50" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">CivicAI</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200/60 px-1.5 py-0.5 rounded">
                  Hackathon
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Smart City Issue Intelligence
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              if (item.highlight) {
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className="ml-2 mr-2 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm shadow-teal-600/30 transition-all hover:shadow"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Role Switcher & Database Status */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Storage Mode Badge */}
            <div 
              title={storageStatus.storageName}
              className={`text-[11px] font-medium px-2 py-1 rounded-md border flex items-center gap-1.5 ${
                storageStatus.configured 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <Database className={`w-3 h-3 ${storageStatus.configured ? 'text-emerald-600' : 'text-slate-500'}`} />
              <span className="hidden xl:inline">
                {storageStatus.configured ? 'Supabase' : 'Demo Store'}
              </span>
            </div>

            {/* Role Selector */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              <button
                onClick={() => setUserRole('citizen')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  userRole === 'citizen'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Citizen
              </button>
              <button
                onClick={() => setUserRole('staff')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  userRole === 'staff'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Staff
              </button>
              <button
                onClick={() => setUserRole('admin')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  userRole === 'admin'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setActiveTab('report')}
              className="px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-semibold flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Report</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 animate-fade-in">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2.5 ${
                  isActive
                    ? 'bg-teal-50 text-teal-800 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active View Role:</span>
            <div className="flex gap-1">
              {(['citizen', 'staff', 'admin'] as UserRole[]).map(role => (
                <button
                  key={role}
                  onClick={() => setUserRole(role)}
                  className={`px-2 py-1 rounded text-xs capitalize font-semibold ${
                    userRole === role ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
