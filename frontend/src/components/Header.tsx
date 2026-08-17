import React, { useState, useRef, useEffect } from 'react';
import { 
  Scale, 
  Search, 
  Plus, 
  CreditCard, 
  HelpCircle, 
  ChevronDown, 
  LogOut, 
  ShieldCheck, 
  RotateCcw,
  Menu,
  Sun,
  Moon,
  Briefcase,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProperty } from '../context/PropertyContext';
import { config } from '../config';

interface HeaderProps {
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onToggleSidebar,
  onToggleMobileSidebar
}) => {
  const { currentUser, switchRole, logout, hasPermission } = useAuth();
  const { 
    currentView,
    searchQuery, 
    setSearchQuery, 
    setCurrentView, 
    setIsAddModalOpen, 
    setEditingProperty,
    openPaymentModal,
    properties,
    setIsGuideOpen,
    openSectionGuide,
    setIsLeadershipPitchOpen,
    resetDemoData,
    theme,
    toggleTheme,
    enableForecasting
  } = useProperty();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const roleRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenAddProperty = () => {
    setEditingProperty(null);
    setIsAddModalOpen(true);
  };

  const handleQuickPayment = () => {
    const target = properties.find(p => p.balanceAmount > 0) || properties[0];
    if (target) {
      openPaymentModal(target);
    }
  };

  return (
    <header 
      id="main-app-header" 
      className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-[#0E1726]/95 border-b border-slate-200/90 dark:border-slate-800/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-3 select-none text-slate-800 dark:text-slate-100 transition-colors shadow-xs"
    >
      {/* Left: Mobile Toggle & Firm Logo */}
      <div className="flex items-center gap-3 sm:gap-4">
        {onToggleMobileSidebar && (
          <button
            id="btn-sidebar-toggle"
            type="button"
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setCurrentView('dashboard')}
          id="header-brand-logo"
        >
          <div className="w-9 h-9 rounded-xl bg-[#0E1B2E] border border-amber-600/50 flex items-center justify-center shadow-sm text-amber-400 group-hover:scale-105 transition-all">
            <Scale className="w-5 h-5" />
          </div>
          <div className="hidden sm:block">
            <h1 className="font-serif font-bold text-sm tracking-wider text-slate-900 dark:text-slate-100 leading-tight group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
              NOJIM TAIRU &amp; CO.
            </h1>
            <p className="text-[10px] font-semibold tracking-wider text-amber-700 dark:text-amber-400/90 uppercase">
              Property &amp; Conveyancing Records
            </p>
          </div>
        </div>
      </div>

      {/* Middle: Universal Search Bar */}
      <div className="flex-1 max-w-md mx-2 hidden md:block">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="global-property-search"
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            placeholder="Search properties, C of O numbers, clients, files..."
            className="w-full pl-9 pr-8 py-1.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 focus:border-amber-600 dark:focus:border-amber-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-1 focus:ring-amber-500 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Right Controls: Executive Pitch, Quick Actions, Theme, Role Switcher, & User Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        
        {/* Executive Pitch Button (Leadership Briefing) */}
        <button
          id="btn-header-leadership-pitch"
          onClick={() => setIsLeadershipPitchOpen(true)}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-300 dark:border-amber-700/60 text-amber-900 dark:text-amber-300 font-semibold text-xs transition-colors shadow-xs cursor-pointer"
          title="Open Executive Leadership Overview & ROI Briefing"
        >
          <Briefcase className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
          <span>Overview for Leadership</span>
        </button>

        {/* Quick Action: Record Payment (Gated) */}
        {hasPermission('canRecordPayment') && (
          <button
            id="btn-quick-record-payment"
            onClick={handleQuickPayment}
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors shadow-xs cursor-pointer"
            title="Log new transaction against client asset"
          >
            <CreditCard className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Record Payment</span>
          </button>
        )}

        {/* Quick Action: Add Property (Gated) */}
        {hasPermission('canAddProperty') && (
          <button
            id="btn-quick-add-property"
            onClick={handleOpenAddProperty}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0E1B2E] hover:bg-[#162a47] dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-bold text-xs shadow-sm transition-all cursor-pointer"
            title="Open new legal conveyancing file"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden xs:inline">Add Property</span>
          </button>
        )}

        {/* Theme Toggle Button (Light/Dark) */}
        <button
          id="btn-toggle-theme"
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title={`Switch to ${theme === 'light' ? 'Dark luxury' : 'Light classic chambers'} theme`}
          aria-label="Toggle visual theme"
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4 text-slate-600" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </button>

        {/* In-App Contextual Section Guide Button */}
        <button
          id="btn-open-section-guide"
          onClick={() => openSectionGuide(currentView)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-800 dark:text-amber-300 font-semibold text-xs transition cursor-pointer shadow-xs"
          title="Open How-To Guide for this screen (?)"
        >
          <HelpCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>Guide</span>
        </button>

        {/* ROLE SWITCHER DROPDOWN (DEMO FEATURE) */}
        <div className="relative" ref={roleRef}>
          <button
            id="role-switcher-dropdown-btn"
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              currentUser.role === 'admin'
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300'
                : currentUser.role === 'staff'
                ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-300'
                : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-300'
            }`}
            title="Switch User Role to test permissions"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="capitalize">{currentUser.role === 'admin' ? 'Partner/Admin' : currentUser.role === 'staff' ? 'Staff' : 'Viewer'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isRoleDropdownOpen && (
            <div 
              id="role-switcher-menu"
              className="absolute right-0 mt-2 w-64 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
            >
              <div className="px-2.5 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Demo Role Switcher
              </div>
              <div className="py-1 space-y-1">
                <button
                  id="switch-to-admin"
                  onClick={() => {
                    switchRole('admin');
                    setIsRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-start gap-2 transition-colors ${
                    currentUser.role === 'admin' 
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 font-semibold' 
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="w-2 h-2 rounded-full bg-amber-600 dark:bg-amber-400 mt-1.5 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-amber-300">Admin / Partner</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">Full access: add, edit, delete records, manage staff</div>
                  </div>
                </button>

                <button
                  id="switch-to-staff"
                  onClick={() => {
                    switchRole('staff');
                    setIsRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-start gap-2 transition-colors ${
                    currentUser.role === 'staff' 
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-semibold' 
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 mt-1.5 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-blue-300">Staff / Associate</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">View &amp; record payments, add files; no deletion</div>
                  </div>
                </button>

                <button
                  id="switch-to-viewer"
                  onClick={() => {
                    switchRole('viewer');
                    setIsRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-start gap-2 transition-colors ${
                    currentUser.role === 'viewer' 
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold' 
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="w-2 h-2 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-300">Viewer / Auditor</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">Read-only view for audit; cannot edit or add data</div>
                  </div>
                </button>
              </div>

              <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800">
                <button
                  id="btn-reset-demo-defaults"
                  onClick={() => {
                    resetDemoData();
                    setIsRoleDropdownOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] text-slate-500 dark:text-slate-400 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Demo Data Defaults</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar Menu */}
        <div className="relative" ref={userRef}>
          <button
            id="user-profile-menu-btn"
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-300 dark:ring-amber-500/40"
            />
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {isUserDropdownOpen && (
            <div 
              id="user-profile-menu"
              className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 shadow-xl p-2 z-50"
            >
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{currentUser.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{currentUser.email}</p>
                <div className="mt-1 inline-flex items-center px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-[10px] font-semibold border border-amber-200 dark:border-amber-900/50">
                  {currentUser.title}
                </div>
              </div>

              <div className="py-1">
                <button
                  id="btn-user-menu-logout"
                  onClick={() => {
                    setIsUserDropdownOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs text-red-600 dark:text-rose-400 hover:bg-red-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out Session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
