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
        className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl p-8 text-center space-y-6"
      >
        <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-subtle">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
            Session Aborted
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Payment was cancelled
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            You exited the Payoneer checkout session before completing authorization. Your cart and selection remain completely intact.
          </p>
        </div>

        {orderNumber && (
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-600 dark:text-slate-300 font-mono">
            Order Reference: {orderNumber}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Link
            to="/checkout"
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-glow transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Checkout</span>
          </Link>

          <Link
            to="/"
            className="w-full sm:flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
