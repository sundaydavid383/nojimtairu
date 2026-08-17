import React from 'react';
import {
  X,
  BookOpen,
  Rocket,
  Users,
  ShieldCheck,
  Calendar,
  Wallet,
  FileCheck2,
  Server,
  Database,
  Mail,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { useProperty } from '../context/PropertyContext';
import { useState } from 'react';

interface CopyState {
  [key: string]: boolean;
}

export const ProjectGuidelineModal: React.FC = () => {
  const { isProjectGuidelineOpen, setIsProjectGuidelineOpen } = useProperty();
  const [copied, setCopied] = useState<CopyState>({});

  if (!isProjectGuidelineOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(prev => ({ ...prev, [key]: true }));
    setTimeout(() => setCopied(prev => ({ ...prev, [key]: false })), 1500);
  };

  const CopyButton = ({ text, label }: { text: string; label: string }) => (
    <button
      onClick={() => handleCopy(text, label)}
      className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
      title={`Copy ${label}`}
    >
      {copied[label] ? <><Check className="w-3 h-3 text-emerald-500" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
    </button>
  );

  const SectionTitle = ({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) => (
    <div className="flex items-center gap-2.5 mb-4">
      <div className="w-8 h-8 rounded-lg bg-[#0E1B2E] text-amber-400 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">{children}</h2>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/60 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#0E1726] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 px-6 py-4 bg-white dark:bg-[#0E1726] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0E1B2E] text-amber-400 flex items-center justify-center shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Project Guideline</h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Nojim Tairu & Co. — Setup & Deployment Plan</p>
            </div>
          </div>
          <button
            onClick={() => setIsProjectGuidelineOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Close guidelines"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 overscroll-contain">
          
          {/* Overview */}
          <section>
            <SectionTitle icon={Rocket}>Overview</SectionTitle>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              This project digitizes the law firm&apos;s property and payment records — currently kept on paper — into a secure, role-based web application. It tracks money coming in from clients (payments made to the firm) and money going out (disbursements), replaces manual bookkeeping, and gives partners real-time visibility into every property&apos;s payment status.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60">
                <CheckCircle2 className="w-3 h-3" /> Digital Ledger
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60">
                <CheckCircle2 className="w-3 h-3" /> Role-Based Access
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60">
                <CheckCircle2 className="w-3 h-3" /> Real-Time Dashboard
              </span>
            </div>
          </section>

          {/* Objectives */}
          <section>
            <SectionTitle icon={FileCheck2}>Objectives</SectionTitle>
            <ul className="space-y-2">
              {[
                'Replace the paper ledger with a digital system.',
                'Restrict who can create or edit records based on role.',
                'Give an accurate, searchable, exportable record per property/case.'
              ].map((obj, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  {obj}
                </li>
              ))}
            </ul>
          </section>

          {/* Core Features */}
          <section>
            <SectionTitle icon={ShieldCheck}>Core Features</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: 'Role-Based Access Control', desc: 'Admin, Staff, and Partner roles with granular permissions.' },
                { label: 'Search & Filter', desc: 'Search by case, date range, client, or payee instantly.' },
                { label: 'Audit Trail', desc: 'Every edit logged with who and when for full compliance.' },
                { label: 'Dashboard Summary', desc: 'Total in-flow, out-flow, and balance across all properties.' }
              ].map((feat, i) => (
                <div key={i} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/30">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 mb-1">{feat.label}</h3>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Roles */}
          <section>
            <SectionTitle icon={Users}>User Roles & Permissions</SectionTitle>
            <div className="space-y-3">
              {[
                {
                  role: 'Admin (Managing Partner / IT)',
                  perms: 'Full access: manage users, roles, and all records.',
                  color: 'rose'
                },
                {
                  role: 'Staff / Accountant',
                  perms: 'Can add and edit in-flow / out-flow entries for assigned cases only.',
                  color: 'amber'
                },
                {
                  role: 'Partner / Reviewer',
                  perms: 'Read-only access to all cases; can approve or flag entries.',
                  color: 'blue'
                }
              ].map((r, i) => (
                <div key={i} className={`p-4 rounded-xl border border-${r.color}-200 dark:border-${r.color}-900/50 bg-${r.color}-50/60 dark:bg-${r.color}-950/30`}>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200">{r.role}</h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{r.perms}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Phases */}
          <section>
            <SectionTitle icon={Calendar}>Project Phases & Timeline</SectionTitle>
            <div className="space-y-3">
              {[
                { phase: 'Design (UI/UX + database schema)', time: '4 days', status: 'complete' },
                { phase: 'Backend Development (models, API, auth, roles)', time: '1.5 weeks', status: 'complete' },
                { phase: 'Frontend Development (dashboard, forms, case views)', time: '1.5 weeks', status: 'complete' },
                { phase: 'Integration & Testing (connect frontend/backend, role testing)', time: '4–6 days', status: 'in-progress' },
                { phase: 'Export / Reporting Features (PDF/Excel export, audit trail)', time: '3–4 days', status: 'pending' },
                { phase: 'Deployment & Handover (deploy, set up accounts, training)', time: '3–4 days', status: 'pending' }
              ].map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${p.status === 'complete' ? 'bg-emerald-500' : p.status === 'in-progress' ? 'bg-amber-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-700'}`} />
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{p.phase}</span>
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{p.time}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
              <p className="text-[11px] text-amber-800 dark:text-amber-300 font-medium flex items-center gap-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                Total estimated timeline: 5–6 weeks (solo developer)
              </p>
            </div>
          </section>

          {/* Cost Estimate */}
          <section>
            <SectionTitle icon={Wallet}>Cost Estimate</SectionTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 font-medium uppercase tracking-wider">Monthly Running Costs</p>
            <div className="space-y-2 mb-4">
              {[
                { service: 'Vercel (frontend hosting)', free: 'Free tier is enough', paid: '₦0/month', note: 'Sufficient for production frontend' },
                { service: 'Render (backend hosting)', free: 'Free', paid: '₦9,800/month ($7)', note: 'Always-on service with no sleep delay' },
                { service: 'MongoDB Atlas (database)', free: 'Free up to 512MB', paid: '₦42,000/month ($30)', note: 'More space if needed' },
                { service: 'ImageKit (property photos)', free: 'Free tier', paid: '₦12,600/month ($9)', note: 'Higher usage tier' },
                { service: 'Brevo (email notifications)', free: 'Free up to ~9,000 emails/month', paid: '₦12,600/month ($9)', note: 'Beyond free limit' },
                { service: 'Twilio (SMS reminders)', free: 'No free tier', paid: '₦11.60/SMS + ₦1,400–2,800/month', note: 'Optional — skip at launch' }
              ].map((c, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-200">{c.service}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{c.note}</div>
                  </div>
                  <div className="flex items-center gap-3 sm:text-right">
                    <div className="text-[10px]">
                      <div className="text-emerald-600 dark:text-emerald-400 font-medium">{c.free}</div>
                      <div className="text-slate-400">{c.paid}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1">At Launch (Free Tiers)</div>
                <div className="text-lg font-bold text-emerald-800 dark:text-emerald-300 font-mono-num">₦0 – ₦15,000</div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-500">per month</div>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">When Usage Grows</div>
                <div className="text-lg font-bold text-amber-800 dark:text-amber-300 font-mono-num">₦75,000 – ₦120,000</div>
                <div className="text-[10px] text-amber-600 dark:text-amber-500">per month</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
              <div className="text-xs font-bold text-slate-900 dark:text-slate-200 mb-1">Development Cost</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">₦150,000 for development</div>
              <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">Total startup: ₦150,000 – ₦168,000</div>
            </div>

            <div className="mt-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50">
              <p className="text-[11px] text-amber-800 dark:text-amber-300 font-medium flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span><strong>Recommendation:</strong> Start entirely on free tiers. Skip SMS at first — email notifications (free) can cover the same need at zero cost, and SMS can be added later once the firm decides it&apos;s needed.</span>
              </p>
            </div>
          </section>

          {/* Free Tier Stack */}
          <section>
            <SectionTitle icon={Server}>Recommended Free-Tier Stack</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { name: 'Vercel', purpose: 'Frontend Hosting', icon: Server, status: 'Free' },
                { name: 'Render', purpose: 'Backend API', icon: Database, status: 'Free' },
                { name: 'MongoDB Atlas', purpose: 'Database', icon: Database, status: 'Free 512MB' },
                { name: 'ImageKit', purpose: 'Image & Receipt Uploads', icon: ShieldCheck, status: 'Free' },
                { name: 'Brevo', purpose: 'Transactional Email', icon: Mail, status: 'Free ~9k/mo' },
                { name: 'Twilio', purpose: 'SMS (Optional)', icon: MessageSquare, status: 'Pay-as-you-go' }
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/30 hover:border-amber-300 dark:hover:border-amber-700/60 transition">
                  <div className="flex items-center gap-2 mb-2">
                    <item.icon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-200">{item.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-2">{item.purpose}</div>
                  <span className="inline-block text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Deliverables */}
          <section>
            <SectionTitle icon={FileCheck2}>Deliverables</SectionTitle>
            <div className="space-y-2">
              {[
                'Deployed web application (frontend + backend)',
                'Admin user guide / onboarding document',
                'Source code repository',
                '2 weeks of post-launch bug-fix support'
              ].map((d, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{d}</span>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 z-10 px-6 py-3 bg-slate-50/80 dark:bg-[#0C121E] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Prepared for Nojim Tairu & Co. — Property & Payment Records Management
          </div>
          <button
            onClick={() => setIsProjectGuidelineOpen(false)}
            className="px-4 py-2 rounded-lg bg-[#0E1B2E] text-white text-xs font-semibold hover:bg-[#162a47] transition shadow-sm cursor-pointer"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
};
