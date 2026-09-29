import React from 'react';
import { ShieldCheck, Lock, CreditCard, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface PayoneerPaymentSectionProps {
  onPay?: () => void;
  loading?: boolean;
  disabled?: boolean;
  total?: number;
  showPayButton?: boolean;
}

export const PayoneerPaymentSection: React.FC<PayoneerPaymentSectionProps> = ({
  onPay,
  loading = false,
  disabled = false,
  total = 0,
  showPayButton = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl bg-ivory-light dark:bg-ivory-elevated border border-stone-warm dark:border-white/10 shadow-subtle p-7 space-y-6 h-auto"
    >
      <div className="flex items-center justify-between pb-4 border-b border-stone-warm dark:border-white/10">
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-emerald-900 text-champagne font-mono text-xs font-bold flex items-center justify-center border border-champagne/30">
            03
          </span>
          <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-charcoal dark:text-ivory">
            Payoneer Payment Gateway
          </h3>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 dark:text-champagne bg-stone-warm/50 dark:bg-ivory-dark px-2.5 py-1 rounded border border-stone-warm dark:border-white/10 flex items-center gap-1.5 font-bold">
          <Lock className="w-3 h-3 text-champagne" />
          256-Bit TLS
        </span>
      </div>

      {/* Luxury Emerald Payoneer Module */}
      <div className="rounded-2xl border border-champagne/40 bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-ivory p-6 space-y-5 relative overflow-hidden shadow-emerald">
        {/* Subtle Gold Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-champagne to-transparent opacity-80" />

        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold tracking-wide text-ivory">
                Payoneer Checkout
              </span>
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold rounded bg-champagne text-charcoal tracking-widest uppercase">
                Official
              </span>
            </div>
            <p className="text-xs text-stone-warm leading-relaxed">
              Certified enterprise payment handshake powered by Payoneer Oscato API
            </p>
          </div>

          <div className="w-10 h-10 rounded-xl bg-emerald-900/80 border border-champagne/40 flex items-center justify-center text-champagne shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Accepted Payment Schemes */}
        <div className="pt-3 border-t border-white/10">
          <span className="text-[9px] font-mono uppercase tracking-widest text-stone-muted block mb-2">
            Accepted Payment Channels
          </span>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-semibold">
            <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-stone-warm flex items-center gap-1.5 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-champagne" />
              Visa
            </span>
            <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-stone-warm flex items-center gap-1.5 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-champagne-light" />
              Mastercard
            </span>
            <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-stone-warm flex items-center gap-1.5 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-champagne-pale" />
              American Express
            </span>
            <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-stone-warm flex items-center gap-1.5 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-champagne" />
              JCB / Discover
            </span>
          </div>
        </div>

        {/* Zero Trust Explanation */}
        <div className="bg-emerald-900/60 rounded-xl p-3.5 border border-champagne/20 text-[11px] text-stone-warm space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-champagne">
            <Lock className="w-3.5 h-3.5" />
            <span>PCI DSS Level 1 SAQ-A Compliant</span>
          </div>
          <p className="leading-relaxed opacity-90">
            When clicking <strong>Pay Securely</strong>, an authenticated Payoneer payment token is generated, and you will proceed to the official gateway to complete transaction authorization. Raw card numbers never touch or persist in our database.
          </p>
        </div>
      </div>

      {/* Optional Pay CTA Button if explicitly requested */}
      {showPayButton && onPay && (
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: disabled || loading ? 1 : 1.01 }}
            whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
            onClick={onPay}
            disabled={disabled || loading || total <= 0}
            className="w-full py-4 px-6 rounded-lg bg-emerald-900 hover:bg-emerald-800 dark:bg-emerald-800 dark:hover:bg-emerald-700 text-ivory font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 shadow-emerald transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-700/50 group"
          >
            {loading ? (
              <div className="flex items-center gap-2.5">
                <Loader2 className="w-4 h-4 animate-spin text-champagne" />
                <span>Processing Handshake...</span>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-champagne" />
                  <span>Pay Securely</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-champagne">${total.toFixed(2)} USD</span>
                  <ArrowRight className="w-4 h-4 text-champagne group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            )}
          </motion.button>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-charcoal-muted dark:text-stone-muted">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-champagne" />
              Zero Surcharges
            </span>
            <span className="opacity-40">•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-800 dark:text-champagne" />
              Payoneer Settlement Guarantee
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};
