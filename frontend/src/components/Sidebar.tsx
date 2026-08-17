import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  HelpCircle, 
  ShieldCheck, 
  Lock, 
  TrendingUp,
  Briefcase,
  Sparkles,
  LineChart,
  BookOpen
} from 'lucide-react';
import { useProperty } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';
import { formatNaira } from '../services/api';

interface SidebarProps {
  collapsed?: boolean;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, mobileOpen, onCloseMobile }) => {
  const { 
    currentView, 
    setCurrentView, 
    stats, 
    selectProperty, 
    setIsGuideOpen,
    openSectionGuide,
    setIsLeadershipPitchOpen,
    setIsProjectGuidelineOpen,
    enableForecasting 
  } = useProperty();
  const { currentUser } = useAuth();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Executive Dashboard',
      icon: LayoutDashboard,
      view: 'dashboard' as const,
      badge: undefined,
    },
    {
      id: 'properties',
      label: 'Property Portfolio',
      icon: Building2,
      view: 'properties' as const,
      badge: stats.totalProperties.toString(),
    },
    ...(enableForecasting ? [{
      id: 'forecasting',
      label: 'Cashflow Forecasting',
      icon: LineChart,
      view: 'forecasting' as const,
      badge: 'AI Beta',
      adminOnly: false,
    }] : []),
    {
      id: 'staff',
      label: 'Staff & Roles',
      icon: Users,
      view: 'staff' as const,
      badge: currentUser.role === 'admin' ? 'Admin' : 'Restricted',
      adminOnly: true,
    },
    {
      id: 'guide',
      label: 'System Guide & Tour',
      icon: HelpCircle,
      view: 'guide' as const,
      badge: 'Help',
    }
  ];

  const handleNavClick = (view: 'dashboard' | 'properties' | 'staff' | 'guide' | 'forecasting') => {
    if (view === 'guide') {
      openSectionGuide(currentView === 'guide' ? 'dashboard' : currentView);
    } else {
      selectProperty(null);
      setCurrentView(view);
    }
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={onCloseMobile}
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed top-16 bottom-0 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-[#0A0E18] border-r border-slate-200 dark:border-slate-800/80 flex flex-col justify-between transition-all duration-300 lg:static lg:h-full lg:shrink-0 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'lg:w-20' : 'lg:w-64'} text-slate-800 dark:text-slate-100 shadow-xs select-none`}
      >
        <div className="p-4 space-y-5 flex-1 overflow-y-auto overscroll-contain">
          
          {/* Overview for Leadership Quick Callout Banner */}
          {!collapsed && (
            <button
              onClick={() => setIsLeadershipPitchOpen(true)}
              className="w-full text-left p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                  Leadership Briefing
                </span>
                <Briefcase className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 group-hover:scale-110 transition" />
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">
                Overview for Leadership
              </div>
              <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5 leading-tight">
                4 key ROI pillars: scaling, risk mitigation, audit trails &amp; time savings.
              </p>
            </button>
          )}

          {/* Project Guideline Quick Access */}
          {!collapsed && (
            <button
              onClick={() => setIsProjectGuidelineOpen(true)}
              className="w-full text-left p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800/60 hover:border-amber-300 dark:hover:border-amber-700/60 transition group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Setup &amp; Deployment
                </span>
                <BookOpen className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400 group-hover:scale-110 transition" />
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">
                Project Guideline
              </div>
              <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5 leading-tight">
                Free-tier stack, timeline, cost estimate &amp; deliverables.
              </p>
            </button>
          )}

          {/* Navigation Links */}
          <div className="space-y-1">
            {!collapsed && (
              <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Main Registry
              </div>
            )}

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.view;
              const isLocked = item.adminOnly && currentUser.role !== 'admin';

              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleNavClick(item.view)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center ${collapsed ? 'justify-center px-2' : 'justify-between px-3'} py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-[#0E1B2E] text-white dark:bg-amber-500/15 dark:border-amber-500/40 dark:text-amber-300 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/80 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-colors shrink-0 ${
                      isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'
                    }`} />
                    {!collapsed && <span>{item.label}</span>}
                  </div>

                  {!collapsed && item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      isActive 
                        ? 'bg-white/20 text-white dark:bg-amber-500/30 dark:text-amber-200' 
                        : isLocked
                        ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {isLocked ? <Lock className="w-2.5 h-2.5 inline mr-0.5" /> : null}
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Portfolio Health Card */}
          {!collapsed && (
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Firm Portfolio</span>
                </div>
                <span className="text-[10px] font-bold text-amber-800 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-300 dark:border-amber-500/20">
                  {stats.collectionRatePercentage.toFixed(0)}% Settled
                </span>
              </div>

              <div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Total Asset Valuation</div>
                <div className="text-base font-bold font-mono-num text-slate-900 dark:text-slate-100 mt-0.5">
                  {formatNaira(stats.totalValuation, true)}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-600 to-emerald-600 dark:from-amber-500 dark:to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(5, stats.collectionRatePercentage))}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono-num">
                  <span>Paid: {formatNaira(stats.totalCollected, true)}</span>
                  <span className="text-amber-700 dark:text-amber-400 font-semibold">Due: {formatNaira(stats.totalPendingBalance, true)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Law Firm Footer Stamp */}
        <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#080B14]">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
            <div className="w-7 h-7 rounded-lg bg-[#0E1B2E] text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-200 truncate">Nojim Tairu &amp; Co.</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Bar Register &bull; Lagos &amp; Abuja</div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
