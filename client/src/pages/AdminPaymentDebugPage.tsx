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
        return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'PENDING':
        return 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'FAILED':
        return 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case 'CANCELLED':
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Payment Debug & Simulator Bench
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-brand-600 text-white flex items-center gap-1 shadow-glow">
              <Sparkles className="w-3 h-3" />
              <span>Dev Console</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Inspect raw payment records, provider responses, and test mock status transitions in real time.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/admin"
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-subtle"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Operations Dashboard</span>
          </Link>

          <button
            onClick={loadPayments}
            disabled={refreshing}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-subtle"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Payment Records Table */}
        <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-subtle overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
              Captured Sessions ({payments.length})
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Click a row to inspect</span>
          </div>

          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50/90 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-800 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider sticky top-0 z-10">
                <tr>
                  <th className="py-2.5 px-4">Order #</th>
                  <th className="py-2.5 px-4">Provider</th>
                  <th className="py-2.5 px-4">Amount</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400 font-mono">
                      No payments found. Place an order on the checkout page to generate a record!
                    </td>
                  </tr>
                ) : (
                  payments.map(p => (
                    <tr
                      key={p._id}
                      onClick={() => setSelectedPayment(p)}
                      className={`cursor-pointer transition-colors ${
                        selectedPayment?._id === p._id
                          ? 'bg-brand-50/80 dark:bg-brand-950/40 font-medium text-slate-900 dark:text-white'
                          : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        {p.orderNumber}
                      </td>
                      <td className="py-3 px-4 uppercase text-[10px] font-mono font-semibold text-slate-500">
                        {p.provider}
                      </td>
                      <td className="py-3 px-4 font-extrabold text-slate-900 dark:text-white font-mono">
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
                      <td className="py-3 px-4 text-slate-400 text-[11px] font-mono">
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
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-subtle p-6 space-y-6"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Session Inspector</h3>
                  <span className="text-[11px] font-mono text-slate-400">{selectedPayment._id}</span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${getStatusBadge(
                    selectedPayment.status
                  )}`}
                >
                  {selectedPayment.status}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800">
                  <span className="text-slate-400">Order Number</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{selectedPayment.orderNumber}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800">
                  <span className="text-slate-400">Provider Payment ID</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300 text-[11px]">{selectedPayment.providerPaymentId}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800">
                  <span className="text-slate-400">Provider Reference</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300 text-[11px]">
                    {selectedPayment.providerReference || '---'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800">
                  <span className="text-slate-400">Amount & Currency</span>
                  <span className="font-extrabold text-slate-900 dark:text-white font-mono">
                    ${selectedPayment.amount.toFixed(2)} {selectedPayment.currency}
                  </span>
                </div>
                {selectedPayment.failureReason && (
                  <div className="py-2 px-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl text-rose-800 dark:text-rose-200 text-[11px] border border-rose-200 dark:border-rose-800">
                    <span className="font-bold block">Decline Reason:</span>
                    {selectedPayment.failureReason}
                  </div>
                )}
              </div>

              {/* State Simulation Buttons */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <Sliders className="w-3.5 h-3.5 text-brand-500" />
                  <span>Interactive Status Overrides</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleTriggerAction('PAID')}
                    className="py-2 px-3 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Set PAID</span>
                  </button>

                  <button
                    onClick={() => handleTriggerAction('FAILED')}
                    className="py-2 px-3 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Set FAILED</span>
                  </button>

                  <button
                    onClick={() => handleTriggerAction('CANCELLED')}
                    className="py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-slate-500" />
                    <span>Set CANCELLED</span>
                  </button>

                  <button
                    onClick={() => handleTriggerAction('PENDING')}
                    className="py-2 px-3 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Set PENDING</span>
                  </button>
                </div>
              </div>

              {/* JSON Metadata Payload */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  <Terminal className="w-3.5 h-3.5 text-brand-500" />
                  <span>Raw Provider Payload</span>
                </div>
                <pre className="p-3 bg-slate-900 rounded-xl text-brand-300 font-mono text-[10px] overflow-x-auto max-h-40 border border-slate-800">
                  {JSON.stringify(selectedPayment.metadata || {}, null, 2)}
                </pre>
              </div>
            </motion.div>
          ) : (
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-12 text-center text-slate-400 text-xs font-mono">
              Select a payment record on the left to inspect its details and simulation triggers.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
