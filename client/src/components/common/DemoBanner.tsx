import React, { useState, useEffect } from 'react';
import { Sparkles, Terminal, CheckCircle2, ChevronRight } from 'lucide-react';
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
      className={`text-xs py-1.5 px-4 transition-colors z-40 border-b ${
        isMock
          ? 'bg-amber-500/10 dark:bg-amber-500/5 border-amber-300/40 dark:border-amber-500/20 text-amber-900 dark:text-amber-300'
          : 'bg-emerald-500/10 dark:bg-emerald-500/5 border-emerald-300/40 dark:border-emerald-500/20 text-emerald-900 dark:text-emerald-300'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {isMock ? (
            <span className="flex items-center gap-2 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="font-semibold px-2 py-0.5 rounded-full bg-amber-200/80 dark:bg-amber-500/20 text-amber-900 dark:text-amber-200 text-[10px] tracking-wider uppercase font-mono">
                Mock Sandbox
              </span>
              <span className="text-[12px] opacity-90 hidden sm:inline">
                Simulated Payoneer checkout pipeline active (instant offline testing).
              </span>
            </span>
          ) : (
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold px-2 py-0.5 rounded-full bg-emerald-200/80 dark:bg-emerald-500/20 text-emerald-900 dark:text-emerald-200 text-[10px] tracking-wider uppercase font-mono">
                Payoneer Sandbox
              </span>
              <span className="text-[12px] opacity-90 hidden sm:inline">
                Connected to official Payoneer Hosted Checkout API.
              </span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-[11px] font-medium">
          <Link
            to="/admin/payments"
            className="flex items-center gap-1 hover:opacity-80 transition-opacity"
          >
            <Terminal className="w-3 h-3" />
            <span>Developer Bench</span>
            <ChevronRight className="w-3 h-3 opacity-60" />
          </Link>
          <span className="opacity-30">|</span>
          <Link
            to="/admin"
            className="flex items-center gap-1 hover:opacity-80 transition-opacity"
          >
            <Sparkles className="w-3 h-3" />
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
