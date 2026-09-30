import React from 'react';
import { ShieldCheck, Lock, CreditCard, Award, Terminal, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B0F0D] text-ivory/60 text-sm border-t border-white/10 mt-24">
      {/* Security Highlights Banner */}
      <div className="border-b border-white/10 py-10 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-champagne shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-ivory font-serif font-bold text-xs tracking-wider uppercase">256-Bit TLS Encryption</h4>
                <p className="text-[11px] text-ivory/50 mt-0.5 font-sans">End-to-end transport layer security</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-ivory font-serif font-bold text-xs tracking-wider uppercase">PCI-DSS SAQ A</h4>
                <p className="text-[11px] text-ivory/50 mt-0.5 font-sans">Zero cardholder data stored on premises</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-champagne shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-ivory font-serif font-bold text-xs tracking-wider uppercase">Payoneer Hosted</h4>
                <p className="text-[11px] text-ivory/50 mt-0.5 font-sans">Global checkout orchestration</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-champagne-light shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-ivory font-serif font-bold text-xs tracking-wider uppercase">Dual Verification</h4>
                <p className="text-[11px] text-ivory/50 mt-0.5 font-sans">Inquiry handshake & webhook pipeline</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-900 to-emerald-950 border border-champagne/40 flex items-center justify-center text-champagne font-serif font-bold text-sm shadow-subtle">
                P
              </div>
              <span className="text-ivory font-serif font-bold text-lg tracking-tight">PayFlow</span>
            </div>
            <p className="text-xs text-ivory/60 leading-relaxed font-sans">
              Luxury commerce and enterprise payment gateway architecture demonstrating the official Payoneer Hosted Checkout API,
              abstracted provider design, and zero-trust mathematical pricing.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-serif font-bold text-ivory uppercase tracking-wider mb-4">Store & Platform</h4>
            <ul className="space-y-2.5 text-xs font-sans">
              <li>
                <Link to="/" className="text-ivory/70 hover:text-champagne transition-colors">Curated Catalog</Link>
              </li>
              <li>
                <Link to="/checkout" className="text-ivory/70 hover:text-champagne transition-colors">Checkout Concierge</Link>
              </li>
              <li>
                <Link to="/internal/login" className="text-ivory/70 hover:text-champagne transition-colors">Staff Portal (Login)</Link>
              </li>
              <li>
                <Link to="/operations" className="text-ivory/70 hover:text-champagne transition-colors">Operations Console</Link>
              </li>
              <li>
                <Link to="/sandbox" className="text-ivory/70 hover:text-champagne transition-colors">Sandbox Testing Lab</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-serif font-bold text-ivory uppercase tracking-wider mb-4">Architecture</h4>
            <ul className="space-y-2.5 text-xs text-ivory/70 font-sans">
              <li>Provider Pattern Abstraction</li>
              <li>Idempotent Webhook Engine</li>
              <li>Oscato REST LIST Handshake</li>
              <li>MERN + TypeScript Stack</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-serif font-bold text-ivory uppercase tracking-wider mb-4">Documentation</h4>
            <p className="text-xs text-ivory/60 mb-3 font-sans">
              Explore complete technical specifications and sandbox credentials guide:
            </p>
            <div className="bg-white/5 rounded-xl p-3 font-mono text-[11px] text-champagne border border-white/10 flex items-center justify-between">
              <span>docs/PAYONEER-INTEGRATION.md</span>
              <Terminal className="w-3.5 h-3.5 text-ivory/40" />
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ivory/40">
          <p>© {new Date().getFullYear()} PayFlow Commerce Architecture. Built for Enterprise Demonstration.</p>
          <div className="flex items-center space-x-6 font-mono text-[11px]">
            <span>PCI-DSS Level 1 SAQ A Eligible</span>
            <span>•</span>
            <span>Payoneer Oscato v1</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
