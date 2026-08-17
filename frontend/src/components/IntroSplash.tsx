import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Scale, Shield, ArrowRight } from 'lucide-react';

interface IntroSplashProps {
  onComplete: () => void;
}

export const IntroSplash: React.FC<IntroSplashProps> = ({ onComplete }) => {
  useEffect(() => {
    // Auto-advance after 3.2 seconds if user doesn't click
    const timer = setTimeout(() => {
      onComplete();
    }, 3600);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      id="intro-splash-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07090E] text-slate-100 overflow-hidden px-6 selection:bg-amber-500/20"
    >
      {/* Background Subtle Gradient & Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/15 via-[#090D15] to-[#05070B] pointer-events-none" />
      
      {/* Delicate grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#d4af37 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="relative z-10 flex flex-col items-center max-w-xl text-center">
        {/* Animated Firm Emblem */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0, rotateY: -90 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-8"
        >
          <div className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-b from-[#1E2536] to-[#0F1420] border border-amber-500/40 shadow-[0_0_50px_-10px_rgba(212,175,55,0.25)]">
            <div className="absolute inset-1 rounded-xl border border-amber-400/20" />
            <Scale className="w-12 h-12 sm:w-14 sm:h-14 text-amber-400 drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]" />
            
            {/* Corner brass accents */}
            <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-amber-300" />
            <div className="absolute top-1 right-1 w-2 h-2 border-t border-r border-amber-300" />
            <div className="absolute bottom-1 left-1 w-2 h-2 border-b border-l border-amber-300" />
            <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-amber-300" />
          </div>
        </motion.div>

        {/* Firm Title & Typography */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.9 }}
          className="space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-widest uppercase mb-1">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            Est. 1998 &bull; Legal Chambers
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-legal-heading font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400">
            NOJIM TAIRU &amp; CO.
          </h1>

          <p className="text-xs sm:text-sm font-medium tracking-[0.25em] uppercase text-slate-400">
            Barristers &bull; Solicitors &bull; Legal Consultants
          </p>

          <div className="w-24 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent mx-auto my-4" />

          <p className="text-sm sm:text-base text-slate-300 max-w-md font-light leading-relaxed">
            Property &amp; Payment Records Management System
          </p>
        </motion.div>

        {/* Action Button & Loader */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-10 flex flex-col items-center gap-4"
        >
          <button
            id="btn-intro-continue"
            onClick={onComplete}
            className="group flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-semibold text-sm shadow-lg shadow-amber-950/40 hover:shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Enter Internal Portal</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>Loading verified legal registers...</span>
          </div>
        </motion.div>
      </div>

      {/* Footer reference */}
      <div className="absolute bottom-6 text-center text-slate-600 text-xs tracking-wider">
        Confidential Internal Law Firm Portal &bull; All Rights Reserved &copy; {new Date().getFullYear()} Nojim Tairu &amp; Co.
      </div>
    </motion.div>
  );
};
