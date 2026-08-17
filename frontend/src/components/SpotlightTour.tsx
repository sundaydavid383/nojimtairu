import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronRight,
  ChevronLeft,
  X,
  Check,
  Sparkles,
  HelpCircle,
  Eye,
  Info,
  Compass
} from 'lucide-react';
import { useProperty } from '../context/PropertyContext';

export interface TourStep {
  targetId: string;
  fallbackTargetId?: string;
  title: string;
  description: string;
  badge?: string;
  preferredPosition?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  tip?: string;
}

// Ordered sequences of steps for each page / section of Nojim Tairu & Co.
export const PAGE_TOURS: Record<string, { pageTitle: string; steps: TourStep[] }> = {
  dashboard: {
    pageTitle: 'Executive Dashboard',
    steps: [
      {
        targetId: 'stat-card-total-valuation',
        title: 'Portfolio Valuation Gauge',
        badge: 'Portfolio Metric',
        description: 'Displays the live aggregate consideration value of all client property portfolios and land conveyancing briefs.',
        tip: 'Recalculates automatically as new property dockets are added or updated.',
        preferredPosition: 'bottom'
      },
      {
        targetId: 'dashboard-add-prop-btn',
        fallbackTargetId: 'btn-quick-add-property',
        title: 'Open Property File (+)',
        badge: 'File Creation',
        description: 'Click here to register a new client land matter, upload survey beacon sheets, and calculate the 5% statutory legal retainer.',
        tip: 'Generates a formal chambers docket number (e.g. NTC/PROP/2024/009).',
        preferredPosition: 'bottom'
      },
      {
        targetId: 'dashboard-leadership-btn',
        fallbackTargetId: 'btn-header-leadership-pitch',
        title: 'Overview for Leadership',
        badge: 'Executive Briefing',
        description: 'Opens the full strategic presentation deck detailing efficiency gains, zero record loss, and chambers operational ROI.',
        tip: 'Perfect for demonstrations to senior partners and managing partners.',
        preferredPosition: 'bottom'
      },
      {
        targetId: 'stat-card-pending-balance',
        title: 'Pending Receivables Tracker',
        badge: 'Trust Accounts',
        description: 'Monitors total outstanding balances across active client installment schedules awaiting trust account settlement.',
        tip: 'Click this card anytime to instantly filter files with pending balances.',
        preferredPosition: 'bottom'
      },
      {
        targetId: 'role-switcher-dropdown-btn',
        title: 'Role Switcher & Access Control',
        badge: 'Access Management',
        description: 'Toggle between Managing Partner (Admin), Legal Associate (Staff), and Auditor (Viewer) to preview permissions in real time.',
        tip: 'Admins have full governance, Staff can log payments, and Viewers have read-only audit access.',
        preferredPosition: 'bottom'
      }
    ]
  },
  properties: {
    pageTitle: 'Property & Conveyancing Registers',
    steps: [
      {
        targetId: 'global-property-search',
        title: 'Universal Registry Search',
        badge: 'Registry Lookup',
        description: 'Instantly search across client names, Certificate of Occupancy numbers, Governor’s Consent references, and street addresses.',
        tip: 'Type any keyword or phone number to filter files instantly.',
        preferredPosition: 'bottom'
      },
      {
        targetId: 'filter-tab-all',
        title: 'Settlement Status Filters',
        badge: 'Ledger Filters',
        description: 'Filter your portfolio by payment status: Fully Paid (settled), Partial (active installment plans), or Pending.',
        tip: 'Each tab shows the exact live count of files in that category.',
        preferredPosition: 'bottom'
      },
      {
        targetId: 'btn-view-mode-grid',
        title: 'Grid vs. Table Switcher',
        badge: 'Display Toggle',
        description: 'Switch between visual property cards featuring site photos and an accounting spreadsheet table view.',
        tip: 'Table view is optimized for rapid multi-record audits.',
        preferredPosition: 'bottom'
      },
      {
        targetId: 'btn-export-properties-csv',
        title: 'Audited Ledger CSV Export',
        badge: 'Compliance & Export',
        description: 'Download the entire chambers property register as a formatted CSV spreadsheet for partners, tax reporting, or offline archive.',
        tip: 'Exports all client contact information, balances, and title references.',
        preferredPosition: 'bottom'
      },
      {
        targetId: 'btn-add-property-top',
        fallbackTargetId: 'btn-quick-add-property',
        title: 'Docket New Property Brief',
        badge: 'Conveyancing',
        description: 'Open a new conveyancing brief, enter vendor/purchaser terms, agreed consideration, and upload title deed documents.',
        tip: 'Supports multiple site photo uploads and title deed attachments.',
        preferredPosition: 'bottom'
      }
    ]
  },
  detail: {
    pageTitle: 'Property Dossier & Custody File',
    steps: [
      {
        targetId: 'property-detail-header-card',
        title: 'Master Land Title & Photo Dossier',
        badge: 'Title Custody',
        description: 'Inspect the primary conveyancing matter, title registration reference (C of O / Deed of Assignment), and site inspection photos.',
        tip: 'Click any thumbnail to switch the main high-resolution photo.',
        preferredPosition: 'bottom'
      },
      {
        targetId: 'property-client-card',
        title: 'Client & Retainer Contact Details',
        badge: 'Client Information',
        description: 'Access verified purchaser contact information, phone numbers, mailing addresses, and National ID / TIN credentials.',
        tip: 'Phone numbers and email links allow direct 1-click communication.',
        preferredPosition: 'top'
      },
      {
        targetId: 'property-valuation-card',
        title: 'Valuation & 5% Legal Retainer',
        badge: 'Financial Terms',
        description: 'Detailed financial ledger breaking down Agreed Property Price, statutory 5% chambers legal retainer fee, total paid, and outstanding balance.',
        tip: 'The statutory 5% drafting retainer is calculated automatically.',
        preferredPosition: 'top'
      },
      {
        targetId: 'btn-record-payment-detail',
        fallbackTargetId: 'btn-ledger-record-payment',
        title: 'Record Client Payment',
        badge: 'Trust Accounts',
        description: 'Log incoming client payments via Bank Transfer, Bank Draft, or Escrow. Immediately recalculates balance and updates milestone status.',
        tip: 'Generates a sequential official chambers receipt reference.',
        preferredPosition: 'bottom'
      },
      {
        targetId: 'property-ledger-table-card',
        title: 'Payment Transactions & Sealed Receipts',
        badge: 'Receipt Audit',
        description: 'Examine complete installment payment history. Click "View Stamped Receipt" on any row to print the official circular-sealed receipt.',
        tip: 'All receipts feature Nojim Tairu & Co. letterhead and authorized signature stamps.',
        preferredPosition: 'top'
      }
    ]
  },
  staff: {
    pageTitle: 'Staff & Governance Matrix',
    steps: [
      {
        targetId: 'staff-role-tiers-card',
        title: 'Role Governance Tiers',
        badge: 'Access Levels',
        description: 'Overview of user tiers: Admin / Managing Partner (full control), Associate Counsel (operational), and External Auditor (read-only).',
        tip: 'Provides clear audit trails of all actions taken across the chambers.',
        preferredPosition: 'bottom'
      },
      {
        targetId: 'btn-add-staff-member',
        title: 'Add Staff / Associate',
        badge: 'User Provisioning',
        description: 'Invite new chambers associates, assign departmental titles, and grant specific conveyancing and ledger permissions.',
        tip: 'New members immediately appear in the active roster.',
        preferredPosition: 'bottom'
      },
      {
        targetId: 'staff-members-table-card',
        title: 'Live Permissions Matrix',
        badge: 'Access Control',
        description: 'Toggle individual capabilities (add properties, record payments, delete files) per staff member with instant real-time synchronization.',
        tip: 'You can test any role instantly using the quick role switch buttons.',
        preferredPosition: 'top'
      }
    ]
  },
  forecasting: {
    pageTitle: 'Cashflow & Retainer Forecast',
    steps: [
      {
        targetId: 'stat-card-total-valuation',
        title: 'Projected Retainer Horizon',
        badge: 'Financial Forecasting',
        description: 'Analyzes expected revenue from pending client title perfection milestones across the next 30, 60, and 90 days.',
        tip: 'Helps managing partners forecast chambers cashflow and associate distributions.',
        preferredPosition: 'bottom'
      },
      {
        targetId: 'stat-card-pending-balance',
        title: 'Receivables Recovery Velocity',
        badge: 'Collection Rate',
        description: 'Tracks follow-up urgency and upcoming installment due dates to prevent overdue settlements.',
        tip: 'Automated milestone notifications alert counsel before due dates.',
        preferredPosition: 'bottom'
      }
    ]
  }
};

interface TargetRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const SpotlightTour: React.FC = () => {
  const {
    activeSectionGuide,
    closeSectionGuide,
    currentView,
    markSectionGuideSeen,
    isGuideOpen,
    setIsGuideOpen
  } = useProperty();

  // Determine active tour key
  const activeTourKey = activeSectionGuide || (isGuideOpen ? currentView : null);
  const tourConfig = activeTourKey ? PAGE_TOURS[activeTourKey] || PAGE_TOURS['dashboard'] : null;

  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number; arrowPos: 'top' | 'bottom' | 'left' | 'right' }>({
    top: 0,
    left: 0,
    arrowPos: 'top'
  });
  const [targetFound, setTargetFound] = useState(true);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const steps = tourConfig?.steps || [];
  const currentStep = steps[stepIndex] || null;
  const isLastStep = stepIndex === steps.length - 1;
  const isFirstStep = stepIndex === 0;

  // Reset step index whenever the active tour changes
  useEffect(() => {
    setStepIndex(0);
  }, [activeTourKey]);

  // Measure and position the spotlight cutout & tooltip
  const updatePosition = useCallback(() => {
    if (!currentStep) return;

    let el = document.getElementById(currentStep.targetId);
    if (!el && currentStep.fallbackTargetId) {
      el = document.getElementById(currentStep.fallbackTargetId);
    }
    if (!el) {
      // Try selector
      try {
        el = document.querySelector(currentStep.targetId) as HTMLElement;
      } catch (e) {
        // ignore
      }
    }

    if (el) {
      setTargetFound(true);
      const rect = el.getBoundingClientRect();

      // Check if element is completely or partially outside viewport; if so, scroll into view smoothly
      const isOffscreen =
        rect.top < 70 ||
        rect.bottom > window.innerHeight - 50 ||
        rect.left < 20 ||
        rect.right > window.innerWidth - 20;

      if (isOffscreen) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      }

      const padding = 8;
      const spotRect: TargetRect = {
        x: Math.max(4, rect.left - padding),
        y: Math.max(4, rect.top - padding),
        width: rect.width + padding * 2,
        height: rect.height + padding * 2
      };

      setTargetRect(spotRect);

      // Tooltip position calculation
      const tooltipWidth = 360;
      const estimatedHeight = 220;
      const margin = 16;

      let top = 0;
      let left = 0;
      let arrowPos: 'top' | 'bottom' | 'left' | 'right' = 'top';

      const spaceBelow = window.innerHeight - (spotRect.y + spotRect.height);
      const spaceAbove = spotRect.y;

      if (currentStep.preferredPosition === 'top' || (spaceBelow < estimatedHeight + 20 && spaceAbove > estimatedHeight + 20)) {
        // Place above
        top = Math.max(margin, spotRect.y - estimatedHeight - 14);
        arrowPos = 'bottom';
      } else {
        // Place below
        top = Math.min(window.innerHeight - estimatedHeight - margin, spotRect.y + spotRect.height + 14);
        arrowPos = 'top';
      }

      // Center horizontally relative to target
      left = spotRect.x + spotRect.width / 2 - tooltipWidth / 2;
      // Clamp within screen boundaries
      left = Math.max(margin, Math.min(left, window.innerWidth - tooltipWidth - margin));

      setTooltipPos({ top, left, arrowPos });
    } else {
      // Fallback: If element is not found on screen (e.g., hidden by permissions or responsive collapse)
      setTargetFound(false);
      setTargetRect({
        x: window.innerWidth / 2 - 150,
        y: window.innerHeight / 2 - 80,
        width: 300,
        height: 160
      });
      setTooltipPos({
        top: window.innerHeight / 2 - 110,
        left: Math.max(16, window.innerWidth / 2 - 180),
        arrowPos: 'top'
      });
    }
  }, [currentStep]);

  // Run update on step changes, resize, and scroll
  useEffect(() => {
    if (!activeTourKey) return;

    // Small delay to allow any view transitions to finish
    const timer = setTimeout(() => {
      updatePosition();
    }, 80);

    const handleResize = () => updatePosition();
    const handleScroll = () => updatePosition();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [activeTourKey, stepIndex, updatePosition]);

  // Keyboard navigation: Left, Right, Escape
  useEffect(() => {
    if (!activeTourKey) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        handleNext();
      } else if (e.key === 'ArrowLeft' && stepIndex > 0) {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTourKey, stepIndex, isLastStep]);

  if (!activeTourKey || !tourConfig || !currentStep) {
    return null;
  }

  const handleClose = () => {
    if (activeTourKey) {
      markSectionGuideSeen(activeTourKey, true);
    }
    closeSectionGuide();
    setIsGuideOpen(false);
  };

  const handleNext = () => {
    if (isLastStep) {
      handleClose();
    } else {
      setStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) {
      setStepIndex((prev) => prev - 1);
    }
  };

  return (
    <div
      id="spotlight-tour-overlay"
      className="fixed inset-0 z-50 overflow-hidden pointer-events-auto"
      style={{ touchAction: 'none' }}
    >
      {/* 1. SVG Cutout Spotlight Overlay */}
      <svg className="w-full h-full absolute inset-0 pointer-events-auto" onClick={handleClose}>
        <defs>
          <mask id="spotlight-mask">
            {/* White covers the entire canvas (opaque dark overlay) */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {/* Black cutout creates the transparent hole where the element shines through */}
            {targetRect && (
              <rect
                x={targetRect.x}
                y={targetRect.y}
                width={targetRect.width}
                height={targetRect.height}
                rx="14"
                ry="14"
                fill="black"
              />
            )}
          </mask>
        </defs>

        {/* Semi-transparent dark dimmed background with cutout mask */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(6, 10, 18, 0.78)"
          mask="url(#spotlight-mask)"
        />
      </svg>

      {/* 2. Spotlight Glowing Highlight Ring */}
      {targetRect && (
        <motion.div
          id="spotlight-highlight-ring"
          initial={false}
          animate={{
            x: targetRect.x,
            y: targetRect.y,
            width: targetRect.width,
            height: targetRect.height
          }}
          transition={{
            type: 'spring',
            stiffness: 350,
            damping: 30
          }}
          className="absolute top-0 left-0 rounded-2xl border-2 border-amber-400 dark:border-amber-400 pointer-events-none shadow-[0_0_25px_rgba(245,158,11,0.6)] ring-4 ring-amber-400/25"
        />
      )}

      {/* 3. Positioned Callout Tooltip Card */}
      <motion.div
        id="spotlight-tooltip-card"
        ref={tooltipRef}
        initial={{ opacity: 0, scale: 0.92, y: 10 }}
        animate={{
          opacity: 1,
          scale: 1,
          x: tooltipPos.left,
          y: tooltipPos.top
        }}
        transition={{
          type: 'spring',
          stiffness: 380,
          damping: 32
        }}
        onClick={(e) => e.stopPropagation()}
        className="absolute top-0 left-0 w-[360px] max-w-[calc(100vw-32px)] rounded-2xl bg-white dark:bg-[#0C121E] border border-amber-500/40 shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-slate-100 z-50 pointer-events-auto"
      >
        {/* Header Bar with Badge & Step Indicator */}
        <div className="px-5 py-3.5 bg-slate-50 dark:bg-[#101726] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              {tourConfig.pageTitle} &bull; Step {stepIndex + 1} of {steps.length}
            </span>
          </div>

          <button
            id="btn-close-spotlight-tour"
            onClick={handleClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Exit Tour (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tooltip Content Body */}
        <div className="p-5 space-y-3.5">
          {/* Badge & Title */}
          <div className="space-y-1">
            {currentStep.badge && (
              <span className="inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                {currentStep.badge}
              </span>
            )}
            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
              {currentStep.title}
            </h3>
          </div>

          {/* Short, crisp 1-2 sentence explanation */}
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {currentStep.description}
          </p>

          {/* Optional Action Tip */}
          {currentStep.tip && (
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 flex items-start gap-2 text-[11px] text-amber-900 dark:text-amber-300 leading-normal">
              <Info className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <span>{currentStep.tip}</span>
            </div>
          )}

          {/* Step Progress Dots */}
          <div className="flex items-center justify-center gap-1.5 pt-1">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setStepIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === stepIndex
                    ? 'w-6 bg-amber-500 dark:bg-amber-400 shadow-xs'
                    : 'w-1.5 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                }`}
                title={`Go to step ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Footer Navigation Controls */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-[#0A0F19] border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
          <button
            id="btn-skip-spotlight-tour"
            onClick={handleClose}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition-colors cursor-pointer"
          >
            Skip Tour
          </button>

          <div className="flex items-center gap-2">
            {!isFirstStep && (
              <button
                id="btn-prev-spotlight-step"
                onClick={handlePrev}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>
            )}

            <button
              id="btn-next-spotlight-step"
              onClick={handleNext}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-950/20 transition-all flex items-center gap-1.5 cursor-pointer transform hover:scale-[1.02]"
            >
              <span>{isLastStep ? 'Finish (Got It)' : 'Next'}</span>
              {isLastStep ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
