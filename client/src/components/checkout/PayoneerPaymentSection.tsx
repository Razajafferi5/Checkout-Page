import React from 'react';
import { ShieldCheck, Lock, CreditCard, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

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
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-brand-600" />
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
            4. Payment Gateway
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          256-Bit Encrypted
        </span>
      </div>

      <div className="rounded-2xl border-2 border-brand-500/30 bg-gradient-to-br from-brand-50/60 via-white to-slate-50 p-5 space-y-4 relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-base tracking-tight">
                Payoneer Checkout
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-900 text-white tracking-widest uppercase">
                Official
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Secure enterprise payment session powered by Payoneer
            </p>
          </div>

          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-brand-600 font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200/60">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
            Accepted via Payoneer Portal
          </span>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700">
            <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              Visa
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Mastercard
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              American Express
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              JCB / Discover
            </span>
          </div>
        </div>

        <div className="bg-white/80 rounded-xl p-3 border border-slate-200/80 text-[11px] text-slate-600 space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>PCI DSS Level 1 Hosted Checkout Architecture</span>
          </div>
          <p className="leading-relaxed">
            Upon clicking <strong>Pay Securely</strong>, you will be redirected to Payoneer’s secure hosted
            gateway to enter card details safely. Our servers never receive or store raw card numbers.
          </p>
        </div>
      </div>

      <button
        onClick={onPay}
        disabled={disabled || loading || total <= 0}
        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-brand-900 hover:from-slate-800 hover:to-brand-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-slate-900/15 transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>Connecting to Payoneer Gateway...</span>
          </>
        ) : (
          <>
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Pay ${total.toFixed(2)} Securely with Payoneer</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-4 text-[11px] text-slate-600">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Zero Hidden Fees
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
          Buyer Protection Guarantee
        </span>
      </div>
    </div>
  );
};
