import React from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  CheckCircle2, 
  Clock, 
  Coins, 
  CreditCard, 
  ArrowUpRight, 
  FileText, 
  Scale, 
  Plus, 
  ArrowRight,
  TrendingUp,
  Receipt,
  Briefcase,
  Sparkles,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';
import { useProperty } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';
import { formatNaira } from '../services/api';

export const DashboardView: React.FC = () => {
  const { 
    stats, 
    properties, 
    activities, 
    isLoading,
    error,
    retryLoad,
    selectProperty, 
    openPaymentModal, 
    setCurrentView, 
    setIsAddModalOpen,
    setEditingProperty,
    setStatusFilter,
    setIsLeadershipPitchOpen,
    openSectionGuide
  } = useProperty();
  const { currentUser, hasPermission } = useAuth();

  // Pending and partial properties requiring follow-up
  const pendingProperties = properties
    .filter(p => p.balanceAmount > 0)
    .sort((a, b) => b.balanceAmount - a.balanceAmount)
    .slice(0, 4);

  const handleFilterToPending = () => {
    setStatusFilter('partial');
    setCurrentView('properties');
  };

  const handleFilterToPaid = () => {
    setStatusFilter('paid');
    setCurrentView('properties');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading chambers dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-center max-w-md">
          <p className="text-sm text-red-800 dark:text-red-300 font-medium">Failed to load dashboard data</p>
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</p>
          <button
            onClick={retryLoad}
            className="mt-3 px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      id="dashboard-container"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-6 max-w-7xl mx-auto text-slate-900 dark:text-slate-100"
    >
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0E1B2E] via-[#162A47] to-[#1E385E] text-white border border-amber-500/30 p-6 sm:p-7 shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Scale className="w-3.5 h-3.5" />
              <span>Chambers of Nojim Tairu &amp; Co.</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
              Internal Property &amp; Conveyancing Ledger &bull; Real-time settlement audit and legal asset registry.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Contextual Guide Button */}
            <button
              id="dashboard-section-guide-btn"
              onClick={() => openSectionGuide('dashboard')}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 border border-amber-300/40 text-amber-200 font-semibold text-xs transition cursor-pointer"
              title="How this Dashboard works (?)"
            >
              <HelpCircle className="w-4 h-4 text-amber-300" />
              <span>Section Guide</span>
            </button>

            {/* Leadership Overview Trigger Button */}
            <button
              id="dashboard-leadership-btn"
              onClick={() => setIsLeadershipPitchOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5"
              title="View strategic presentation for senior leadership"
            >
              <Briefcase className="w-4 h-4 text-slate-950" />
              <span>Overview for Leadership</span>
            </button>

            {hasPermission('canAddProperty') && (
              <button
                id="dashboard-add-prop-btn"
                onClick={() => {
                  setEditingProperty(null);
                  setIsAddModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Open Property File</span>
              </button>
            )}

            <button
              id="dashboard-view-all-btn"
              onClick={() => {
                setStatusFilter('all');
                setCurrentView('properties');
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900/80 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <span>Explore All Records</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Leadership Quick Pitch Strip (4 High-Impact Value Cards) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-700 dark:text-amber-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Why Digital Custody Matters &bull; Executive Highlights
            </h2>
          </div>
          <button
            onClick={() => setIsLeadershipPitchOpen(true)}
            className="text-xs text-amber-700 dark:text-amber-400 hover:underline font-semibold flex items-center gap-1"
          >
            <span>Read full 4-pillar briefing</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          <div 
            onClick={() => setIsLeadershipPitchOpen(true)}
            className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 hover:border-amber-400/50 cursor-pointer transition space-y-1"
          >
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Scale File Volume</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
              Manage 5x more briefs without proportional admin clerk overhead.
            </p>
          </div>

          <div 
            onClick={() => setIsLeadershipPitchOpen(true)}
            className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 hover:border-amber-400/50 cursor-pointer transition space-y-1"
          >
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Zero Lost Records</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
              Instant search across titles, C of O, and historical payment dockets.
            </p>
          </div>

          <div 
            onClick={() => setIsLeadershipPitchOpen(true)}
            className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 hover:border-amber-400/50 cursor-pointer transition space-y-1"
          >
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>5+ Hours/Wk Saved</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
              Automated 5% legal retainer calculations eliminate manual math.
            </p>
          </div>

          <div 
            onClick={() => setIsLeadershipPitchOpen(true)}
            className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 hover:border-amber-400/50 cursor-pointer transition space-y-1"
          >
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Client Prestige</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
              Official sealed digital receipts ready for high-net-worth clients.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Primary Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Portfolio Valuation */}
        <div 
          id="stat-card-total-valuation"
          className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Asset Portfolio Value</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold font-mono-num text-slate-900 dark:text-white">
              {formatNaira(stats.totalValuation)}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Across {stats.totalProperties} active legal matters</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Total Revenue Collected */}
        <div 
          id="stat-card-fully-paid"
          onClick={handleFilterToPaid}
          className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Fully Paid Assets</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold font-mono-num text-emerald-700 dark:text-emerald-400">
              {stats.fullyPaidCount} <span className="text-sm font-normal text-slate-500">/ {stats.totalProperties}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
              <span>{formatNaira(stats.totalCollected)} cleared</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* Metric 3: Pending Balances */}
        <div 
          id="stat-card-pending-balance"
          onClick={handleFilterToPending}
          className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Pending Receivables</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold font-mono-num text-amber-700 dark:text-amber-300">
              {formatNaira(stats.totalPendingBalance)}
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
              <span>{stats.partialCount + stats.pendingCount} properties with balance</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* Metric 4: Total Properties Managed */}
        <div 
          id="stat-card-total-props"
          onClick={() => {
            setStatusFilter('all');
            setCurrentView('properties');
          }}
          className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Property Files</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold font-mono-num text-slate-900 dark:text-white">
              {stats.totalProperties} <span className="text-xs font-normal text-slate-500">Files</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
              <span>{stats.collectionRatePercentage.toFixed(1)}% recovery rate</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-blue-600 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Priority Pending Balances & Recent Audit Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Pending Properties with Photos & Quick Record Payment */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                Pending &amp; Outstanding Balances
              </h2>
            </div>
            <button
              onClick={() => {
                setStatusFilter('partial');
                setCurrentView('properties');
              }}
              className="text-xs text-amber-700 dark:text-amber-400 hover:underline font-semibold flex items-center gap-1"
            >
              <span>View All Pending</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {pendingProperties.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
                All client conveyancing files are currently 100% settled.
              </div>
            ) : (
              pendingProperties.map((prop) => {
                const paidPct = prop.totalAmount > 0 ? (prop.paidAmount / prop.totalAmount) * 100 : 0;

                return (
                  <div
                    key={prop.id}
                    id={`dash-prop-${prop.id}`}
                    className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                  >
                    {/* Thumbnail Image */}
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      {prop.coverImage ? (
                        <img
                          src={prop.coverImage}
                          alt={prop.name}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer hover:opacity-90 transition"
                          onClick={() => selectProperty(prop.id)}
                        />
                      ) : (
                        <div 
                          onClick={() => selectProperty(prop.id)}
                          className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-slate-400 cursor-pointer"
                        >
                          <Building2 className="w-6 h-6" />
                        </div>
                      )}

                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-mono-num font-bold text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900/50">
                            {prop.fileNumber}
                          </span>
                          <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full ${
                            prop.paymentStatus === 'paid'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : prop.paymentStatus === 'partial'
                              ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                          }`}>
                            {prop.paymentStatus}
                          </span>
                          <span className="text-[11px] text-slate-500 truncate">
                            &bull; {prop.propertyType}
                          </span>
                        </div>

                        <h3 
                          onClick={() => selectProperty(prop.id)}
                          className="text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-amber-700 dark:hover:text-amber-300 cursor-pointer truncate transition-colors"
                        >
                          {prop.name}
                        </h3>

                        <p className="text-xs text-slate-500 truncate">
                          Client: <span className="text-slate-700 dark:text-slate-300 font-medium">{prop.clientName}</span>
                        </p>

                        {/* Mini balance progress */}
                        <div className="pt-1 max-w-sm space-y-1">
                          <div className="flex justify-between text-[11px] text-slate-500">
                            <span>Paid: {formatNaira(prop.paidAmount, true)} ({paidPct.toFixed(0)}%)</span>
                            <span className="text-amber-700 dark:text-amber-400 font-bold">Bal: {formatNaira(prop.balanceAmount, true)}</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-amber-600 to-emerald-600 rounded-full"
                              style={{ width: `${paidPct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                      <div className="text-right hidden sm:block">
                        <div className="text-xs text-slate-500">Outstanding</div>
                        <div className="text-sm font-bold font-mono-num text-amber-700 dark:text-amber-300">
                          {formatNaira(prop.balanceAmount)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {hasPermission('canRecordPayment') && (
                          <button
                            id={`btn-dash-pay-${prop.id}`}
                            onClick={() => openPaymentModal(prop)}
                            className="px-3 py-1.5 rounded-lg bg-[#0E1B2E] hover:bg-[#162a47] text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <CreditCard className="w-3 h-3" />
                            <span>Pay</span>
                          </button>
                        )}
                        <button
                          id={`btn-dash-view-${prop.id}`}
                          onClick={() => selectProperty(prop.id)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Recent Legal Activity Ledger */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                Recent Chambers Activity
              </h2>
            </div>
            <span className="text-xs text-slate-500">Live Audit Trail</span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 shadow-sm">
            {activities.slice(0, 6).map((activity) => {
              let badgeColor = 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-900/40';
              let ActionIcon = FileText;

              if (activity.actionType === 'payment_recorded') {
                badgeColor = 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-900/40';
                ActionIcon = CreditCard;
              } else if (activity.actionType === 'receipt_verified') {
                badgeColor = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/40';
                ActionIcon = CheckCircle2;
              }

              return (
                <div key={activity.id} className="py-3 first:pt-0 last:pb-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className={`p-1 rounded-md border ${badgeColor}`}>
                        <ActionIcon className="w-3 h-3" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {activity.userName}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono-num whitespace-nowrap">
                      {activity.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
                    {activity.description}
                  </p>

                  {activity.propertyId && (
                    <div className="pl-6 pt-0.5">
                      <button
                        onClick={() => selectProperty(activity.propertyId!)}
                        className="text-[11px] text-amber-700 dark:text-amber-400 hover:underline font-semibold inline-flex items-center gap-1"
                      >
                        <span>Inspect dossier</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
