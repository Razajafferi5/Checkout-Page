import React from 'react';
import { ShieldCheck, Lock, CreditCard, Award, Terminal, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-sm border-t border-slate-800 mt-20">
      {/* Security Highlights Banner */}
      <div className="border-b border-slate-800/80 py-8 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-brand-400 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-xs tracking-wider uppercase font-mono">256-Bit TLS Encryption</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">End-to-end transport layer security</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-xs tracking-wider uppercase font-mono">PCI-DSS SAQ A</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Zero sensitive card data on premises</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-payoneer-orange shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-xs tracking-wider uppercase font-mono">Powered by Payoneer</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Global checkout orchestration</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-sky-400 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-xs tracking-wider uppercase font-mono">Dual Verification</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">REST inquiry & webhook pipeline</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-xs">
                PF
              </div>
              <span className="text-white font-extrabold text-base tracking-tight">PayFlow</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enterprise payment gateway demonstration architecture showcasing the official Payoneer Hosted Checkout API,
              abstracted provider pattern, and zero-trust backend total computation.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 font-mono">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Storefront Products</Link>
              </li>
              <li>
                <Link to="/checkout" className="hover:text-white transition-colors">Checkout Portal</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors">Admin Dashboard</Link>
              </li>
              <li>
                <Link to="/admin/payments" className="hover:text-white transition-colors">Developer Debug Bench</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 font-mono">Architecture</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-slate-400">Payment Provider Abstraction</span>
              </li>
              <li>
                <span className="text-slate-400">Idempotent Webhook Engine</span>
              </li>
              <li>
                <span className="text-slate-400">Oscato API Integration</span>
              </li>
              <li>
                <span className="text-slate-400">MERN + TypeScript Stack</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 font-mono">Technical Specs</h4>
            <p className="text-xs text-slate-400 mb-2">
              Review full technical integration specs in the docs directory:
            </p>
            <div className="bg-slate-900 rounded-xl p-3 font-mono text-[11px] text-brand-300 border border-slate-800 flex items-center justify-between">
              <span>docs/PAYONEER-INTEGRATION.md</span>
              <Terminal className="w-3.5 h-3.5 text-slate-500" />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PayFlow Commerce Architecture. Built for Enterprise Demonstration.</p>
          <div className="flex items-center space-x-6">
            <span>PCI-DSS Level 1 SAQ A Compliant</span>
            <span>•</span>
            <span>Official Oscato API Spec</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
