import React from 'react';
import { ShieldCheck, Lock, CreditCard, ArrowRight, Loader2, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface PayoneerPaymentSectionProps {
  onPay: () => void;
  loading: boolean;
  disabled?: boolean;
  total: number;
}

export const PayoneerPaymentSection: React.FC<PayoneerPaymentSectionProps> = ({
  onPay,
  loading,
  disabled = false,
  total,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-subtle p-6 space-y-6"
    >
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-mono text-xs font-bold flex items-center justify-center">
            04
          </span>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider font-sans">
            Payment Method
          </h3>
        </div>
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-1">
          <Lock className="w-2.5 h-2.5" />
          256-Bit TLS
        </span>
      </div>

      {/* Payoneer Official Module Card */}
      <div className="rounded-2xl border-2 border-brand-500/40 dark:border-brand-500/30 bg-gradient-to-br from-brand-50/70 via-white to-slate-50/60 dark:from-slate-800/60 dark:via-slate-900 dark:to-slate-950 p-5 space-y-4 relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight font-sans">
                Payoneer Checkout
              </span>
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded-full bg-slate-900 dark:bg-brand-500 text-white tracking-widest uppercase">
                Official
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Enterprise hosted payment session powered by Payoneer Oscato API
            </p>
          </div>

          <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center text-brand-600 dark:text-brand-400">
            <ShieldCheck className="w-5 h-5 text-brand-500" />
          </div>
        </div>

        {/* Accepted Payment Methods */}
        <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Accepted via Secure Payoneer Portal
          </span>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-xs flex items-center gap-1.5 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              Visa
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-xs flex items-center gap-1.5 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Mastercard
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-xs flex items-center gap-1.5 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              American Express
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-xs flex items-center gap-1.5 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              JCB / Discover
            </span>
          </div>
        </div>

        {/* Zero Trust Explanation Box */}
        <div className="bg-white/90 dark:bg-slate-800/80 rounded-xl p-3 border border-slate-200/80 dark:border-slate-700/80 text-[11px] text-slate-600 dark:text-slate-400 space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            <span>PCI DSS Level 1 SAQ-A Certified</span>
          </div>
          <p className="leading-relaxed">
            Upon clicking <strong>Pay Securely</strong>, an authenticated Payoneer payment token will be generated, and you will proceed to the official gateway to complete transaction authorization. Our application database never touches or records sensitive card numbers.
          </p>
        </div>
      </div>

      {/* Main Pay CTA Button */}
      <motion.button
        whileHover={{ scale: disabled || loading ? 1 : 1.01 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        onClick={onPay}
        disabled={disabled || loading || total <= 0}
        className="w-full py-4 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-brand-600 dark:hover:bg-brand-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-elevated hover:shadow-glow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        {loading ? (
          <div className="flex items-center gap-2.5">
            <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
            <span>Initializing Secure Payoneer Session...</span>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Pay Securely with Payoneer</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-extrabold">${total.toFixed(2)} USD</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        )}
      </motion.button>

      {/* Trust Guarantees */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          Zero Hidden Surcharges
        </span>
        <span className="opacity-40">•</span>
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />
          Payoneer Buyer Protection
        </span>
      </div>
    </motion.div>
  );
};
