import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, RefreshCw, ShoppingBag, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const PaymentFailedPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || '';
  const reason = searchParams.get('reason') || 'The transaction was declined by the cardholder bank or verification timed out.';

  return (
    <div className="max-w-xl mx-auto py-16 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1, x: [0, -6, 6, -4, 4, 0] }}
        transition={{ duration: 0.5 }}
        className="rounded-3xl bg-ivory dark:bg-ivory-dark border border-stone-warm/80 dark:border-white/10 shadow-elevated p-8 text-center space-y-6"
      >
        <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 flex items-center justify-center mx-auto shadow-subtle">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-rose-700 dark:text-rose-400 uppercase tracking-widest">
            Payment Unsuccessful
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal dark:text-ivory tracking-tight">
            Transaction Declined
          </h1>
          <p className="text-xs text-charcoal/70 dark:text-ivory/60 max-w-sm mx-auto leading-relaxed font-sans">
            Your card has not been debited. The issuing authority returned a non-authorized response.
          </p>
        </div>

        <div className="bg-stone-warm/40 dark:bg-white/5 border border-stone-warm dark:border-white/10 rounded-2xl p-4 text-left space-y-1">
          <span className="text-[10px] font-mono font-bold text-charcoal/60 dark:text-ivory/60 uppercase tracking-wider block">
            Declined Reason
          </span>
          <p className="text-xs text-charcoal dark:text-ivory leading-relaxed font-sans">{reason}</p>
          {orderNumber && (
            <p className="text-[11px] text-charcoal/50 dark:text-ivory/50 font-mono pt-1">
              Order Reference: {orderNumber}
            </p>
          )}
        </div>

        <div className="space-y-3 pt-2">
          <Link
            to="/checkout"
            className="w-full py-3.5 px-4 rounded-full bg-emerald-800 hover:bg-emerald-700 text-ivory font-semibold text-xs flex items-center justify-center gap-2 shadow-elevated transition-all tracking-wider uppercase"
          >
            <RefreshCw className="w-4 h-4 text-champagne" />
            <span>Try Again with Alternative Method</span>
          </Link>

          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/checkout"
              className="py-2.5 px-3 rounded-full border border-stone-muted dark:border-white/20 hover:bg-stone-warm dark:hover:bg-white/10 text-charcoal dark:text-ivory font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Checkout</span>
            </Link>

            <Link
              to="/"
              className="py-2.5 px-3 rounded-full border border-stone-muted dark:border-white/20 hover:bg-stone-warm dark:hover:bg-white/10 text-charcoal dark:text-ivory font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Storefront</span>
            </Link>
          </div>
        </div>

        <div className="pt-4 border-t border-stone-warm/80 dark:border-white/10 flex items-center justify-center gap-1.5 text-xs text-charcoal/50 dark:text-ivory/50">
          <HelpCircle className="w-4 h-4 text-champagne-dark dark:text-champagne" />
          <span>Tip: Verify 3D-Secure 2.0 authentication status with your issuing bank.</span>
        </div>
      </motion.div>
    </div>
  );
};
