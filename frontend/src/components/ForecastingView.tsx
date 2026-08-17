import React, { useState } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  HelpCircle, 
  Layers, 
  ArrowUpRight,
  Filter,
  Sparkles,
  Lock
} from 'lucide-react';
import { useProperty } from '../context/PropertyContext';
import { generateForecastingData, formatNaira } from '../services/api';

export const ForecastingView: React.FC = () => {
  const { properties, enableForecasting, setEnableForecasting } = useProperty();
  const [selectedConfidence, setSelectedConfidence] = useState<'all' | 'high' | 'medium'>('all');

  const forecastData = generateForecastingData(properties);

  const filteredMilestones = forecastData.upcomingMilestones.filter((m) => {
    if (selectedConfidence === 'high') return m.confidenceScore.startsWith('High');
    if (selectedConfidence === 'medium') return m.confidenceScore.startsWith('Medium');
    return true;
  });

  const maxRevenueMonth = Math.max(...forecastData.monthlyProjections.map((m) => m.projectedRevenue + m.confirmedRevenue));

  return (
    <div className="space-y-6 pb-12 animate-fade-in text-slate-900 dark:text-slate-100">
      
      {/* Top Header & Feature Flag Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded border border-amber-200 dark:border-amber-900/50">
              Predictive Conveyancing Intelligence
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/40">
              Feature Flag Gated
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 dark:text-white mt-1">
            Cashflow & Inflow Forecasting
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Algorithmic projection of upcoming legal retainers and property consideration based on title perfection milestones.
          </p>
        </div>

        {/* Feature Flag Toggle Pill for Demo Testing */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs">
          <span className="text-slate-600 dark:text-slate-300 font-medium">
            Flag: <code className="font-mono font-bold text-slate-800 dark:text-slate-200">ENABLE_FORECASTING</code>
          </span>
          <button
            onClick={() => setEnableForecasting(!enableForecasting)}
            className={`px-2.5 py-1 rounded-md font-semibold text-xs transition ${
              enableForecasting 
                ? 'bg-emerald-600 text-white' 
                : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            {enableForecasting ? 'ACTIVE (ON)' : 'DISABLED (OFF)'}
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Projected Inflow</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono-num text-slate-900 dark:text-white">
            {formatNaira(forecastData.totalProjectedInflow)}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Pending tranche installments across active matters
          </p>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">High Confidence (&gt;90%)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono-num text-emerald-600 dark:text-emerald-400">
            {formatNaira(forecastData.highConfidenceTotal)}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Consent & execution milestones close to closure
          </p>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg. Settlement Cycle</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono-num text-slate-900 dark:text-white">
            {forecastData.averageCollectionCycleDays} Days
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            From file deposit to final receipt issuance
          </p>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Overdue Risk Exposure</span>
            <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono-num text-red-600 dark:text-red-400">
            ₦0.00
          </div>
          <p className="text-[11px] text-emerald-600 font-medium">
            100% of accounts within standard grace periods
          </p>
        </div>

      </div>

      {/* Visual Chart: 6-Month Inflow Trajectory */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              6-Month Cashflow Realization Schedule (August 2024 – January 2025)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Projected installments mapped against conveyancing registry lodgements.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#0E1B2E] dark:bg-amber-400 inline-block" />
              <span className="text-slate-600 dark:text-slate-300">Projected Inflow</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
              <span className="text-slate-600 dark:text-slate-300">Historical Realized</span>
            </div>
          </div>
        </div>

        {/* Bar Visualizer */}
        <div className="space-y-4">
          {forecastData.monthlyProjections.map((item, idx) => {
            const projectedPct = maxRevenueMonth > 0 ? (item.projectedRevenue / maxRevenueMonth) * 100 : 0;
            const confirmedPct = maxRevenueMonth > 0 ? (item.confirmedRevenue / maxRevenueMonth) * 100 : 0;

            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-800 dark:text-slate-200 font-bold w-24">{item.month}</span>
                  <div className="flex items-center gap-3 font-mono-num text-[11px]">
                    {item.confirmedRevenue > 0 && (
                      <span className="text-emerald-600 dark:text-emerald-400">
                        Realized: {formatNaira(item.confirmedRevenue, true)}
                      </span>
                    )}
                    <span className="text-slate-900 dark:text-amber-300 font-bold">
                      Projected: {formatNaira(item.projectedRevenue, true)}
                    </span>
                  </div>
                </div>

                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex gap-0.5">
                  {confirmedPct > 0 && (
                    <div 
                      className="bg-emerald-500 h-full rounded-l-full transition-all duration-500"
                      style={{ width: `${confirmedPct}%` }}
                      title={`Realized: ${formatNaira(item.confirmedRevenue)}`}
                    />
                  )}
                  {projectedPct > 0 && (
                    <div 
                      className="bg-[#0E1B2E] dark:bg-amber-400 h-full rounded-r-full transition-all duration-500"
                      style={{ width: `${projectedPct}%` }}
                      title={`Projected: ${formatNaira(item.projectedRevenue)}`}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Title Trigger Milestones */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Upcoming Collection Triggers by Conveyancing Milestone
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Specific legal events that unlock client balance payments.
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSelectedConfidence('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                selectedConfidence === 'all' 
                  ? 'bg-[#0E1B2E] text-white dark:bg-amber-400 dark:text-slate-900' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              All Milestones
            </button>
            <button
              onClick={() => setSelectedConfidence('high')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                selectedConfidence === 'high' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              High Confidence (90%)
            </button>
          </div>
        </div>

        {/* Milestone List */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredMilestones.map((m, i) => (
            <div key={i} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 p-2 rounded-lg transition">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {m.propertyName}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    m.confidenceScore.startsWith('High') 
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                  }`}>
                    {m.confidenceScore}
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Client: <strong className="text-slate-700 dark:text-slate-300">{m.clientName}</strong> • Trigger: <span className="text-amber-700 dark:text-amber-400 font-medium">{m.triggerEvent}</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-sm font-bold font-mono-num text-slate-900 dark:text-white">
                  {formatNaira(m.expectedAmount)}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  Expected by: {m.expectedDate}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
