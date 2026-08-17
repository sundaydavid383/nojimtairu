import React, { useState } from 'react';
import { 
  X, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  Award, 
  ChevronRight, 
  ChevronLeft,
  Scale, 
  FileCheck2, 
  Coins, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useProperty } from '../context/PropertyContext';
import { formatNaira } from '../services/api';

export const LeadershipPitchModal: React.FC = () => {
  const { isLeadershipPitchOpen, setIsLeadershipPitchOpen, stats, setCurrentView } = useProperty();
  const [activeSlide, setActiveSlide] = useState<number>(0);

  if (!isLeadershipPitchOpen) return null;

  const slides = [
    {
      id: 'exec-summary',
      category: 'Strategic Transformation',
      title: 'Executive Briefing: Modernizing Legal Conveyancing & Asset Custody',
      subtitle: 'Prepared for the Managing Partner & Chambers Leadership',
      description: 'Transitioning from legacy physical register ledgers to an integrated, tamper-evident digital records vault.',
      keyPillars: [
        {
          icon: TrendingUp,
          label: 'Scale Without Overhead',
          summary: 'Handle 5x more conveyancing briefs without hiring additional clerk staff.'
        },
        {
          icon: ShieldCheck,
          label: '100% Audit Protection',
          summary: 'Instant Land Registry cross-references and immutable audit logging.'
        },
        {
          icon: Clock,
          label: '5+ Hours/Week Saved',
          summary: 'Zero manual ledger balancing per associate with automatic calculations.'
        },
        {
          icon: Award,
          label: 'High-Net-Worth Prestige',
          summary: 'Branded stamped legal receipts delivered instantly via digital channels.'
        }
      ]
    },
    {
      id: 'growth-scale',
      category: '1. Business Growth & Capacity',
      title: 'Scale Case Load Without Proportional Admin Burden',
      badge: 'Operational Scalability',
      icon: TrendingUp,
      statNumber: '10x',
      statLabel: 'Capacity multiplier on active property files',
      points: [
        'Centralized custody of multi-billion Naira real estate portfolios with zero data fragmentation.',
        'Associate handovers occur instantly — no physical folder hunting or missing file jackets.',
        'Unified docket tracking across Commercial, Residential, Probate, and Industrial matters.'
      ],
      financialMetric: {
        title: 'Firm Portfolio Under Management',
        value: formatNaira(stats.totalValuation),
        detail: `${stats.totalProperties} active property files currently indexed and monitored`
      }
    },
    {
      id: 'risk-audit',
      category: '2. Risk Mitigation & Compliance',
      title: 'Eliminate Lost Records, Caveat Oversights & Payment Disputes',
      badge: 'Chambers Protection',
      icon: ShieldCheck,
      statNumber: '100%',
      statLabel: 'Searchable title deeds & payment trails in <2 seconds',
      points: [
        'Every installment deposit is timestamped, sealed, and tied to specific Land Registry C of O / Gazette numbers.',
        'Immutable activity logs record who logged each tranche, preventing un-reconciled client escrow disputes.',
        'Role-gated security ensures legal associates cannot alter finalized audit figures without Partner sign-off.'
      ],
      financialMetric: {
        title: 'Dispute & Leakage Risk',
        value: 'Zero Unaccounted Balances',
        detail: 'Automatic reconciliation between agreed consideration, 5% fee, and disbursements'
      }
    },
    {
      id: 'roi-bottom-line',
      category: '3. Bottom-Line ROI & Time Savings',
      title: 'Measurable Financial Return & Immediate Hours Reclaimed',
      badge: 'Direct Financial Impact',
      icon: Clock,
      statNumber: '5+ Hrs',
      statLabel: 'Saved weekly per fee-earner on manual ledger reconciliation',
      points: [
        'Automated 5% statutory legal retainer calculations eliminate manual arithmetic errors.',
        'One-click balance settlement tracking prevents forgotten final tranche payments upon title perfection.',
        'Instant CSV and ledger export ready for external auditors and tax clearance filings in seconds.'
      ],
      financialMetric: {
        title: 'Immediate Pending Collections',
        value: formatNaira(stats.totalPendingBalance),
        detail: `${stats.partialCount + stats.pendingCount} properties with structured payment milestones ready for collection`
      }
    },
    {
      id: 'client-prestige',
      category: '4. Competitive Advantage & Client Trust',
      title: 'Institutional Prestige for High-Net-Worth & Corporate Clients',
      badge: 'Client Experience',
      icon: Award,
      statNumber: '< 30s',
      statLabel: 'Turnaround to generate verified, sealed legal receipts',
      points: [
        'Clients receive dignified, officially stamped Nojim Tairu & Co. receipts with unique serial dockets.',
        'Instant client statement generation during executive boardroom meetings or phone inquiries.',
        'Modern, trustworthy legal tech posture that reinforces the firm\'s market leadership.'
      ],
      financialMetric: {
        title: 'Collection Settlement Rate',
        value: `${stats.collectionRatePercentage.toFixed(1)}%`,
        detail: `${formatNaira(stats.totalCollected)} successfully realized into chambers accounts`
      }
    }
  ];

  const currentSlide = slides[activeSlide];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#0E1726] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-all text-slate-900 dark:text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/80 dark:bg-[#111C2E] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0E1B2E] text-amber-400 flex items-center justify-center font-bold text-sm shadow-sm">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Executive Leadership Briefing
              </div>
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Nojim Tairu & Co. — Modern Records Platform
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-medium px-2 py-1 rounded bg-slate-200/60 dark:bg-slate-800">
              Slide {activeSlide + 1} of {slides.length}
            </span>
            <button
              onClick={() => setIsLeadershipPitchOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 transition"
              aria-label="Close pitch presentation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Slide Body */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-6">
          {activeSlide === 0 ? (
            /* Slide 0: Executive 4-Pillar Matrix */
            <div className="space-y-6">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="inline-block text-xs font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-900/60">
                  {currentSlide.category}
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white leading-tight">
                  {currentSlide.title}
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {currentSlide.description}
                </p>
              </div>

              {/* 4 Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {currentSlide.keyPillars?.map((pillar, idx) => {
                  const Icon = pillar.icon;
                  return (
                    <div 
                      key={idx}
                      onClick={() => setActiveSlide(idx + 1)}
                      className="cursor-pointer group p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-800/80 hover:border-amber-300 dark:hover:border-amber-700/60 hover:shadow-md transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-10 h-10 rounded-lg bg-[#0E1B2E] text-amber-400 flex items-center justify-center">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs text-amber-700 dark:text-amber-400 font-medium group-hover:translate-x-1 transition flex items-center gap-1">
                          View details <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition">
                          {pillar.label}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                          {pillar.summary}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Live Portfolio Snapshot Bar */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#0E1B2E] to-[#1A2C4B] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <div>
                  <div className="text-xs text-amber-300 font-medium uppercase tracking-wider">Live Chambers Portfolio Under Management</div>
                  <div className="text-2xl font-bold font-mono-num">{formatNaira(stats.totalValuation)}</div>
                </div>
                <div className="flex items-center gap-6 text-center sm:text-right">
                  <div>
                    <div className="text-xs text-slate-300">Total Collected</div>
                    <div className="text-sm font-bold text-emerald-400 font-mono-num">{formatNaira(stats.totalCollected)}</div>
                  </div>
                  <div className="border-l border-slate-700 pl-6">
                    <div className="text-xs text-slate-300">Pending Balances</div>
                    <div className="text-sm font-bold text-amber-300 font-mono-num">{formatNaira(stats.totalPendingBalance)}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Detailed Pillar Slides (1 to 4) */
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    {currentSlide.category}
                  </span>
                  <h1 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white">
                    {currentSlide.title}
                  </h1>
                </div>
                <span className="hidden sm:inline-flex text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {currentSlide.badge}
                </span>
              </div>

              {/* Metric Hero Block + Key Insights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                
                {/* Metric Callout Card */}
                <div className="p-6 rounded-2xl bg-[#0E1B2E] text-white space-y-4 shadow-lg text-center md:text-left flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center mb-4 mx-auto md:mx-0">
                      {currentSlide.icon && <currentSlide.icon className="w-6 h-6" />}
                    </div>
                    <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono-num tracking-tight">
                      {currentSlide.statNumber}
                    </div>
                    <p className="text-xs text-slate-300 mt-2 font-medium leading-relaxed">
                      {currentSlide.statLabel}
                    </p>
                  </div>

                  {currentSlide.financialMetric && (
                    <div className="pt-4 mt-4 border-t border-slate-800 text-left bg-slate-900/60 p-3 rounded-lg">
                      <div className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider">
                        {currentSlide.financialMetric.title}
                      </div>
                      <div className="text-base font-bold text-white font-mono-num mt-0.5">
                        {currentSlide.financialMetric.value}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {currentSlide.financialMetric.detail}
                      </div>
                    </div>
                  )}
                </div>

                {/* Evidence & Value Points */}
                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Why This Matters for Nojim Tairu & Co.
                  </h3>
                  <div className="space-y-3">
                    {currentSlide.points?.map((pt, i) => (
                      <div 
                        key={i}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/30 flex items-start gap-3.5"
                      >
                        <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                          {i + 1}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                          {pt}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Comparative takeaway */}
                  <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-3">
                    <FileCheck2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
                      Immediate deployment readiness — fully configured for standard chambers workflows.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Bar */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-[#111C2E] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`h-2 rounded-full transition-all ${
                  activeSlide === i 
                    ? 'w-8 bg-amber-600 dark:bg-amber-400' 
                    : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            {activeSlide > 0 && (
              <button
                onClick={() => setActiveSlide(activeSlide - 1)}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
            )}

            {activeSlide < slides.length - 1 ? (
              <button
                onClick={() => setActiveSlide(activeSlide + 1)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#0E1B2E] text-white hover:bg-[#162a47] transition flex items-center gap-1.5 shadow-sm"
              >
                Next Pillar <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsLeadershipPitchOpen(false);
                  setCurrentView('properties');
                }}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition flex items-center gap-1.5 shadow-sm"
              >
                Explore Active Registry <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
