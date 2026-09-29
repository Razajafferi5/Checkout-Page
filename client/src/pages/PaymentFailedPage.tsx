import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { XCircle, ArrowLeft, RefreshCw, ShoppingBag, HelpCircle } from 'lucide-react';

export const PaymentFailedPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || '';
  const reason = searchParams.get('reason') || 'The transaction was declined by the cardholder bank or verification timed out.';

  return (
    <div className="max-w-xl mx-auto py-16 px-4 sm:px-6">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-md shadow-rose-500/10">
          <XCircle className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">
            Payment Unsuccessful
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Payment could not be completed
          </h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Your card has not been charged. You may review your payment method and attempt the checkout again.
          </p>
        </div>

        <div className="bg-rose-50/70 border border-rose-200/70 rounded-2xl p-4 text-left space-y-1">
          <span className="text-[11px] font-bold text-rose-900 uppercase tracking-wider block">
            Reason Provided
          </span>
          <p className="text-xs text-rose-800 leading-relaxed">{reason}</p>
          {orderNumber && (
            <p className="text-[11px] text-slate-500 font-mono pt-1">
              Order Reference: {orderNumber}
            </p>
          )}
        </div>

        <div className="space-y-3 pt-2">
          <Link
            to="/checkout"
            className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again with Different Method</span>
          </Link>

          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/checkout"
              className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Checkout</span>
            </Link>

            <Link
              to="/"
              className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Back to Store</span>
            </Link>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-500">
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span>Need help? Contact support or check your bank credentials.</span>
        </div>
      </div>
    </div>
  );
};
