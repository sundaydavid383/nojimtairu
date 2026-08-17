import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useProperty } from '../context/PropertyContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useProperty();

  return (
    <div 
      id="toast-container" 
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          let Icon = Info;
          let borderClass = 'border-slate-700 bg-slate-900/95 text-slate-100';
          let iconColor = 'text-blue-400';

          if (toast.type === 'success') {
            Icon = CheckCircle2;
            borderClass = 'border-amber-500/40 bg-[#0c1322]/95 text-slate-100';
            iconColor = 'text-amber-400';
          } else if (toast.type === 'error') {
            Icon = AlertCircle;
            borderClass = 'border-rose-500/40 bg-[#1f0f15]/95 text-slate-100';
            iconColor = 'text-rose-400';
          } else if (toast.type === 'warning') {
            Icon = AlertTriangle;
            borderClass = 'border-amber-600/40 bg-[#1f190e]/95 text-slate-100';
            iconColor = 'text-amber-500';
          }

          return (
            <motion.div
              key={toast.id}
              id={`toast-item-${toast.id}`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-md ${borderClass}`}
            >
              <div className={`mt-0.5 shrink-0 ${iconColor}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold tracking-wide text-slate-100">{toast.title}</h4>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
              </div>
              <button
                id={`toast-dismiss-${toast.id}`}
                onClick={() => removeToast(toast.id)}
                className="shrink-0 p-1 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-white/5 transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
