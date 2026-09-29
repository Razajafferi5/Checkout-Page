import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Payment, PaymentStatus } from '../types';
import { useNotification } from '../context/NotificationContext';
import {
  Sparkles,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ArrowLeft,
  Sliders,
  Terminal,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const AdminPaymentDebugPage: React.FC = () => {
  const { showNotification } = useNotification();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const loadPayments = async () => {
    try {
      setRefreshing(true);
      const res = await api.getAdminPayments();
      setPayments(res.payments);
      if (res.payments.length > 0 && !selectedPayment) {
        setSelectedPayment(res.payments[0]);
      }
    } catch (err) {
      console.error('Failed to load payments', err);
      showNotification('error', 'Failed to load payments');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const handleTriggerAction = async (action: PaymentStatus) => {
    if (!selectedPayment) return;
    try {
      const updated = await api.simulateMockAction(
        selectedPayment._id,
        action,
        action === 'FAILED' ? 'Simulated decline via developer debug bench' : undefined
      );
      setSelectedPayment(updated);
      showNotification('success', `Payment simulated to ${action}`);
      loadPayments();
    } catch (err) {
      showNotification('error', (err as Error).message);
    }
  };

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'PAID':
        return 'bg-emerald-900/10 dark:bg-emerald-950/60 text-emerald-900 dark:text-champagne border-emerald-900/20 dark:border-champagne/30';
      case 'PENDING':
        return 'bg-champagne-pale dark:bg-champagne/10 text-champagne-dark dark:text-champagne border-champagne/30';
      case 'FAILED':
        return 'bg-rose-500/10 text-rose-800 dark:text-rose-400 border-rose-500/20';
      case 'CANCELLED':
        return 'bg-stone-warm/50 dark:bg-white/5 text-charcoal/70 dark:text-ivory/70 border-stone-muted dark:border-white/10';
      default:
        return 'bg-stone-warm/50 dark:bg-white/5 text-charcoal/70 dark:text-ivory/70 border-stone-muted dark:border-white/10';
    }
  };

  return (
    <div className="py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-warm/80 dark:border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-charcoal dark:text-ivory">
              Payment Debug & Simulator Bench
            </h1>
            <span className="px-3 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-champagne-pale dark:bg-champagne/10 text-champagne-dark dark:text-champagne border border-champagne/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-champagne-dark dark:text-champagne" />
              <span>Dev Console</span>
            </span>
          </div>
          <p className="text-xs text-charcoal/60 dark:text-ivory/60 mt-1 font-sans">
            Inspect raw Payoneer Oscato session handshakes, gateway callbacks, and test mock status transitions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/admin"
            className="px-4 py-2 rounded-full border border-stone-muted dark:border-white/20 bg-ivory dark:bg-ivory-elevated hover:bg-stone-warm dark:hover:bg-white/10 text-charcoal dark:text-ivory font-medium text-xs flex items-center gap-1.5 transition-colors shadow-subtle"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Treasury Ledger</span>
          </Link>

          <button
            onClick={loadPayments}
            disabled={refreshing}
            className="px-4 py-2 rounded-full border border-stone-muted dark:border-white/20 bg-ivory dark:bg-ivory-elevated hover:bg-stone-warm dark:hover:bg-white/10 text-charcoal dark:text-ivory font-medium text-xs flex items-center gap-1.5 transition-colors shadow-subtle"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Payment Records Table */}
        <div className="lg:col-span-7 rounded-3xl bg-ivory dark:bg-ivory-dark border border-stone-warm/80 dark:border-white/10 shadow-subtle overflow-hidden">
          <div className="p-4 border-b border-stone-warm/80 dark:border-white/10 bg-stone-warm/30 dark:bg-white/5 flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal dark:text-ivory uppercase tracking-wider font-mono">
              Captured Sessions ({payments.length})
            </span>
            <span className="text-[11px] text-charcoal/50 dark:text-ivory/50 font-mono">Click a row to inspect</span>
          </div>

          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-left text-xs text-charcoal/80 dark:text-ivory/80">
              <thead className="bg-stone-warm/40 dark:bg-white/10 border-b border-stone-warm/80 dark:border-white/10 text-[10px] font-mono font-bold text-charcoal/50 dark:text-ivory/50 uppercase tracking-wider sticky top-0 z-10">
                <tr>
                  <th className="py-2.5 px-4">Order #</th>
                  <th className="py-2.5 px-4">Provider</th>
                  <th className="py-2.5 px-4">Amount</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-warm/60 dark:divide-white/5">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-charcoal/40 dark:text-ivory/40 font-mono">
                      No payments found. Place an order on checkout to generate a ledger record.
                    </td>
                  </tr>
                ) : (
                  payments.map(p => (
                    <tr
                      key={p._id}
                      onClick={() => setSelectedPayment(p)}
                      className={`cursor-pointer transition-colors ${
                        selectedPayment?._id === p._id
                          ? 'bg-champagne-pale/70 dark:bg-champagne/10 font-medium text-charcoal dark:text-ivory'
                          : 'hover:bg-stone-warm/30 dark:hover:bg-white/5'
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-charcoal dark:text-ivory">
                        {p.orderNumber}
                      </td>
                      <td className="py-3 px-4 uppercase text-[10px] font-mono font-semibold text-charcoal/60 dark:text-ivory/60">
                        {p.provider}
                      </td>
                      <td className="py-3 px-4 font-extrabold text-charcoal dark:text-ivory font-mono">
                        ${p.amount.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${getStatusBadge(
                            p.status
                          )}`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-charcoal/50 dark:text-ivory/50 text-[11px] font-mono">
                        {new Date(p.createdAt).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Inspector Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          {selectedPayment ? (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-3xl bg-ivory dark:bg-ivory-dark border border-stone-warm/80 dark:border-white/10 shadow-subtle p-6 space-y-6"
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-warm/80 dark:border-white/10">
                <div>
                  <h3 className="font-serif font-bold text-charcoal dark:text-ivory text-base">Session Inspector</h3>
                  <span className="text-[11px] font-mono text-charcoal/50 dark:text-ivory/50">{selectedPayment._id}</span>
                </div>
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-mono font-bold border ${getStatusBadge(
                    selectedPayment.status
                  )}`}
                >
                  {selectedPayment.status}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-stone-warm/60 dark:border-white/5">
                  <span className="text-charcoal/50 dark:text-ivory/50">Order Number</span>
                  <span className="font-mono font-bold text-charcoal dark:text-ivory">{selectedPayment.orderNumber}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-stone-warm/60 dark:border-white/5">
                  <span className="text-charcoal/50 dark:text-ivory/50">Provider Payment ID</span>
                  <span className="font-mono text-charcoal/80 dark:text-ivory/80 text-[11px]">{selectedPayment.providerPaymentId}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-stone-warm/60 dark:border-white/5">
                  <span className="text-charcoal/50 dark:text-ivory/50">Provider Reference</span>
                  <span className="font-mono text-charcoal/80 dark:text-ivory/80 text-[11px]">
                    {selectedPayment.providerReference || '---'}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-stone-warm/60 dark:border-white/5">
                  <span className="text-charcoal/50 dark:text-ivory/50">Amount & Currency</span>
                  <span className="font-extrabold text-charcoal dark:text-ivory font-mono">
                    ${selectedPayment.amount.toFixed(2)} {selectedPayment.currency}
                  </span>
                </div>
                {selectedPayment.failureReason && (
                  <div className="py-2.5 px-3 bg-rose-500/10 rounded-xl text-rose-800 dark:text-rose-300 text-[11px] border border-rose-500/20">
                    <span className="font-bold block">Decline Reason:</span>
                    {selectedPayment.failureReason}
                  </div>
                )}
              </div>

              {/* State Simulation Buttons */}
              <div className="pt-2 border-t border-stone-warm/80 dark:border-white/10 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-charcoal dark:text-ivory font-mono">
                  <Sliders className="w-3.5 h-3.5 text-champagne-dark dark:text-champagne" />
                  <span>State Simulation Overrides</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleTriggerAction('PAID')}
                    className="py-2.5 px-3 bg-emerald-900/10 dark:bg-emerald-950/60 hover:bg-emerald-900/20 text-emerald-900 dark:text-champagne border border-emerald-900/20 dark:border-champagne/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors font-mono"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-champagne-dark dark:text-champagne" />
                    <span>Set PAID</span>
                  </button>

                  <button
                    onClick={() => handleTriggerAction('FAILED')}
                    className="py-2.5 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-800 dark:text-rose-300 border border-rose-500/20 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors font-mono"
                  >
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Set FAILED</span>
                  </button>

                  <button
                    onClick={() => handleTriggerAction('CANCELLED')}
                    className="py-2.5 px-3 bg-stone-warm/50 dark:bg-white/5 hover:bg-stone-warm dark:hover:bg-white/10 text-charcoal/80 dark:text-ivory/80 border border-stone-muted dark:border-white/20 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors font-mono"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-charcoal/50 dark:text-ivory/50" />
                    <span>Set CANCELLED</span>
                  </button>

                  <button
                    onClick={() => handleTriggerAction('PENDING')}
                    className="py-2.5 px-3 bg-champagne-pale dark:bg-champagne/10 hover:bg-champagne-pale/80 text-champagne-dark dark:text-champagne border border-champagne/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors font-mono"
                  >
                    <Clock className="w-3.5 h-3.5 text-champagne-dark dark:text-champagne" />
                    <span>Set PENDING</span>
                  </button>
                </div>
              </div>

              {/* JSON Metadata Payload */}
              <div className="pt-2 border-t border-stone-warm/80 dark:border-white/10 space-y-2">
                <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-charcoal/50 dark:text-ivory/50 uppercase tracking-wider">
                  <Terminal className="w-3.5 h-3.5 text-champagne-dark dark:text-champagne" />
                  <span>Raw Provider Payload</span>
                </div>
                <pre className="p-3 bg-charcoal dark:bg-[#0B0F0D] rounded-xl text-champagne font-mono text-[10px] overflow-x-auto max-h-40 border border-stone-warm/20 dark:border-white/10">
                  {JSON.stringify(selectedPayment.metadata || {}, null, 2)}
                </pre>
              </div>
            </motion.div>
          ) : (
            <div className="rounded-3xl bg-ivory dark:bg-ivory-dark border border-stone-warm/80 dark:border-white/10 p-12 text-center text-charcoal/40 dark:text-ivory/40 text-xs font-mono">
              Select a payment record on the left to inspect its details and simulation triggers.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
