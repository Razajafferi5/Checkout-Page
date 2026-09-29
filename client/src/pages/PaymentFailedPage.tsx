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
        className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl p-8 text-center space-y-6"
      >
        <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-subtle">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest">
            Payment Unsuccessful
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Payment couldn't be completed
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            Don't worry — your card has not been charged and your order details remain safe.
          </p>
        </div>

        <div className="bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 rounded-2xl p-4 text-left space-y-1">
          <span className="text-[10px] font-mono font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider block">
            Declined Reason
          </span>
          <p className="text-xs text-rose-900 dark:text-rose-200 leading-relaxed font-sans">{reason}</p>
          {orderNumber && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono pt-1">
              Order Reference: {orderNumber}
            </p>
          )}
        </div>

        <div className="space-y-3 pt-2">
          <Link
            to="/checkout"
            className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-brand-600 dark:hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-glow transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again with Different Method</span>
          </Link>

          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/checkout"
              className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Checkout</span>
            </Link>

            <Link
              to="/"
              className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Back to Store</span>
            </Link>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <HelpCircle className="w-4 h-4" />
          <span>Need help? Ensure 3D Secure verification is enabled on your card.</span>
        </div>
      </motion.div>
    </div>
  );
};
