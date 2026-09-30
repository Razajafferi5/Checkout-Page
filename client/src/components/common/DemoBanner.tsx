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
      className={`text-xs py-2 px-4 transition-colors z-40 border-b ${
        isMock
          ? 'bg-champagne-pale/60 dark:bg-champagne/10 border-champagne/30 text-charcoal dark:text-champagne font-sans'
          : 'bg-emerald-900/10 dark:bg-emerald-950/60 border-emerald-900/20 dark:border-champagne/30 text-emerald-900 dark:text-champagne font-sans'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {isMock ? (
            <span className="flex items-center gap-2 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-champagne-dark opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-champagne-dark"></span>
              </span>
              <span className="font-semibold px-2.5 py-0.5 rounded-full bg-champagne/20 dark:bg-champagne/20 text-charcoal dark:text-champagne text-[10px] tracking-wider uppercase font-mono border border-champagne/30">
                Mock Sandbox
              </span>
              <span className="text-[12px] opacity-90 hidden sm:inline">
                Simulated Payoneer checkout pipeline active (instant offline sandbox).
              </span>
            </span>
          ) : (
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-champagne-dark dark:text-champagne" />
              <span className="font-semibold px-2.5 py-0.5 rounded-full bg-emerald-900/10 dark:bg-emerald-950/60 text-emerald-900 dark:text-champagne text-[10px] tracking-wider uppercase font-mono border border-emerald-900/20 dark:border-champagne/30">
                Payoneer Live Sandbox
              </span>
              <span className="text-[12px] opacity-90 hidden sm:inline">
                Connected to official Payoneer Hosted Checkout API.
              </span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-[11px] font-medium font-mono">
          <Link
            to="/internal/login"
            className="flex items-center gap-1 hover:text-emerald-800 dark:hover:text-champagne transition-colors"
          >
            <Terminal className="w-3 h-3" />
            <span>Internal Portal</span>
            <ChevronRight className="w-3 h-3 opacity-60" />
          </Link>
        </div>
      </div>
    </div>
  );
};
