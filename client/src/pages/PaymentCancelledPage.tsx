import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, ShoppingBag } from 'lucide-react';

export const PaymentCancelledPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || '';

  return (
    <div className="max-w-xl mx-auto py-16 px-4 sm:px-6">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-md shadow-amber-500/10">
          <AlertCircle className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
            Session Aborted
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Payment was cancelled</h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You exited the checkout session before completing authorization. Your cart items and order have been preserved.
          </p>
        </div>

        {orderNumber && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 font-mono">
            Order Reference: {orderNumber}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Link
            to="/checkout"
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Checkout</span>
          </Link>

          <Link
            to="/"
            className="w-full sm:flex-1 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
