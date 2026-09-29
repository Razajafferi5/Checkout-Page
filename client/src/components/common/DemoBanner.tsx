import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import { Link } from 'react-router-dom';

export const DemoBanner: React.FC = () => {
  const [paymentMode, setPaymentMode] = useState<string>('mock');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getHealth()
      .then(res => setPaymentMode(res.paymentMode))
      .catch(() => setPaymentMode('mock'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  const isMock = paymentMode === 'mock';

  return (
    <div
      className={`text-xs py-2 px-4 transition-colors ${
        isMock
          ? 'bg-amber-500/10 border-b border-amber-200/60 text-amber-900'
          : 'bg-emerald-500/10 border-b border-emerald-200/60 text-emerald-900'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {isMock ? (
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="font-semibold px-1.5 py-0.5 rounded bg-amber-200/60 text-amber-800 text-[11px] uppercase tracking-wider">
                Demo Sandbox
              </span>
              <span>Running in simulated Payoneer Sandbox mode (Zero credentials required).</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold px-1.5 py-0.5 rounded bg-emerald-200/60 text-emerald-800 text-[11px] uppercase tracking-wider">
                Payoneer Live Sandbox
              </span>
              <span>Connected to Official Payoneer Oscato API Sandbox environment.</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/payments"
            className="font-medium underline hover:text-slate-950 flex items-center gap-1 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Developer Test Bench</span>
          </Link>
          <span className="text-slate-300">|</span>
          <Link
            to="/admin"
            className="font-medium underline hover:text-slate-950 flex items-center gap-1 transition-colors"
          >
            <span>Admin Stats</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
