import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Scale, Lock, Mail, KeyRound, ShieldCheck, ArrowRight, UserCheck, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const LoginView: React.FC = () => {
  const { login, availableStaff } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [email, setEmail] = useState<string>('nojim.tairu@ntlaw.ng');
  const [password, setPassword] = useState<string>('password123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    const matched = availableStaff.find(s => s.role === role);
    if (matched) {
      setEmail(matched.email);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await login(email, password);
    if (!success) {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = async (role: UserRole) => {
    setSelectedRole(role);
    const matched = availableStaff.find(s => s.role === role);
    if (matched) {
      setEmail(matched.email);
      setPassword('password123');
    }
    setIsSubmitting(true);
    const success = await login(matched?.email || email, 'password123');
    if (!success) {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="login-screen" className="min-h-screen w-full flex flex-col justify-center items-center bg-slate-100 dark:bg-[#070A0F] text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 relative overflow-hidden transition-colors duration-200">
      {/* Background ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-amber-500/10 via-amber-700/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-900/10 dark:bg-blue-950/20 blur-3xl pointer-events-none" />

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-4xl relative z-10 grid grid-cols-1 lg:grid-cols-12 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-[#0B0F19]/90 shadow-2xl backdrop-blur-xl overflow-hidden"
      >
        {/* Left Side: Law Firm Branding & Role Quick Pick */}
        <div className="lg:col-span-5 p-6 sm:p-8 bg-slate-50 dark:bg-gradient-to-b dark:from-[#0F1422] dark:to-[#0B0F19] border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-slate-900 dark:bg-gradient-to-br dark:from-[#263148] dark:to-[#121927] border border-amber-500/40 flex items-center justify-center shadow-md shadow-amber-950/20">
                <Scale className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h2 className="font-legal-heading font-bold text-lg tracking-wide text-slate-900 dark:text-slate-100 leading-tight">
                  NOJIM TAIRU &amp; CO.
                </h2>
                <p className="text-[11px] font-medium tracking-wider text-amber-700 dark:text-amber-400/90 uppercase">
                  Legal Property &amp; Records
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-2">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Select Persona for Live Demo
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Click any role to test system permissions instantly:
              </p>
            </div>

            {/* Quick Role Pickers */}
            <div className="mt-4 space-y-2.5">
              {availableStaff.map((staff) => {
                const isSelected = selectedRole === staff.role;
                return (
                  <button
                    key={staff.id}
                    id={`quick-login-${staff.role}`}
                    type="button"
                    onClick={() => handleRoleSelect(staff.role)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 text-amber-900 dark:text-amber-100 shadow-xs'
                        : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/80'
                    }`}
                  >
                    <img
                      src={staff.avatar}
                      alt={staff.name}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-lg object-cover ring-1 ring-slate-300 dark:ring-slate-700 mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-200 truncate">{staff.name}</span>
                        <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full ${
                          staff.role === 'admin' 
                            ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                            : staff.role === 'staff'
                            ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30'
                            : 'bg-slate-200 dark:bg-slate-700/40 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600/40'
                        }`}>
                          {staff.role === 'admin' ? 'Partner/Admin' : staff.role === 'staff' ? 'Staff' : 'Viewer'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{staff.title}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Encrypted internal law firm gateway &bull; 256-bit SSL</span>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 sm:py-10 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full space-y-6">
            <div>
              <h3 className="text-xl font-bold font-legal-heading text-slate-900 dark:text-slate-100">
                Staff Authentication
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter your credentials to access client property dockets and payment registers.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="login-email">
                  Staff Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/80 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none transition-all"
                    placeholder="name@ntlaw.ng"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300" htmlFor="login-password">
                    Password
                  </label>
                  <span className="text-[11px] text-amber-600 dark:text-amber-400/90 hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/80 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none transition-all font-mono"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Role Indicator Banner */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-slate-600 dark:text-slate-300">Active Role Mode:</span>
                </div>
                <span className="font-semibold text-amber-700 dark:text-amber-300 capitalize">
                  {selectedRole === 'admin' ? 'Admin / Managing Partner' : selectedRole === 'staff' ? 'Legal Staff / Associate' : 'Read-Only Viewer'}
                </span>
              </div>

              <button
                id="btn-login-submit"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-950/40 hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span>Authenticating Firm Credentials...</span>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              <span className="flex-shrink mx-3 text-[11px] text-slate-500 uppercase tracking-widest font-semibold">Or One-Click Demo</span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                id="btn-demo-partner"
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="px-2.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-center text-xs transition-colors cursor-pointer"
              >
                <div className="font-semibold text-amber-700 dark:text-amber-300 text-[11px]">Partner</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Full Admin</div>
              </button>
              <button
                id="btn-demo-staff"
                type="button"
                onClick={() => handleQuickLogin('staff')}
                className="px-2.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-center text-xs transition-colors cursor-pointer"
              >
                <div className="font-semibold text-blue-700 dark:text-blue-300 text-[11px]">Staff</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Add &amp; Pay</div>
              </button>
              <button
                id="btn-demo-viewer"
                type="button"
                onClick={() => handleQuickLogin('viewer')}
                className="px-2.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-center text-xs transition-colors cursor-pointer"
              >
                <div className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">Viewer</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Read Only</div>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
