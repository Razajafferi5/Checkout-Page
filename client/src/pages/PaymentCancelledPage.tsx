import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export const PaymentCancelledPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || '';

  return (
    <div className="max-w-xl mx-auto py-16 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl bg-ivory dark:bg-ivory-dark border border-stone-warm/80 dark:border-white/10 shadow-elevated p-8 text-center space-y-6"
      >
        <div className="w-16 h-16 rounded-full bg-champagne-pale dark:bg-champagne/10 border border-champagne/30 text-champagne-dark dark:text-champagne flex items-center justify-center mx-auto shadow-subtle">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-champagne-dark dark:text-champagne uppercase tracking-widest">
            Session Concluded
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal dark:text-ivory tracking-tight">
            Checkout Suspended
          </h1>
          <p className="text-xs text-charcoal/70 dark:text-ivory/60 max-w-sm mx-auto leading-relaxed font-sans">
            You exited the Payoneer checkout session before completing authorization. Your bag and selections remain preserved.
          </p>
        </div>

        {orderNumber && (
          <div className="bg-stone-warm/40 dark:bg-white/5 border border-stone-warm dark:border-white/10 rounded-xl p-3 text-xs text-charcoal/70 dark:text-ivory/70 font-mono">
            Preserved Order Reference: {orderNumber}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Link
            to="/checkout"
            className="w-full sm:flex-1 py-3 px-5 rounded-full bg-emerald-800 hover:bg-emerald-700 text-ivory font-semibold text-xs flex items-center justify-center gap-2 shadow-elevated transition-all tracking-wider uppercase"
          >
            <ArrowLeft className="w-4 h-4 text-champagne" />
            <span>Return to Checkout</span>
          </Link>

          <Link
            to="/"
            className="w-full sm:flex-1 py-3 px-5 rounded-full border border-stone-muted dark:border-white/20 hover:bg-stone-warm dark:hover:bg-white/10 text-charcoal dark:text-ivory font-medium text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Storefront</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
