import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { ShieldCheck, Lock, CreditCard, CheckCircle2, XCircle, ArrowLeft, Loader2, Sparkles, Terminal } from 'lucide-react';
import { Order, Payment } from '../types';
import { motion } from 'framer-motion';

export const MockGatewayPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const paymentId = searchParams.get('paymentId') || '';
  const orderNumber = searchParams.get('orderNumber') || '';

  const [order, setOrder] = useState<Order | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [processing, setProcessing] = useState(false);
  const [actionNotice, setActionNotice] = useState<string>('');

  useEffect(() => {
    if (orderNumber) {
      api
        .getOrderByNumber(orderNumber)
        .then(res => {
          setOrder(res.order);
          setPayment(res.payment);
        })
        .catch(err => console.error('Failed to load order for mock portal', err));
    }
  }, [orderNumber]);

  const handleSimulate = async (action: 'PAID' | 'FAILED' | 'CANCELLED') => {
    try {
      setProcessing(true);
      if (action === 'PAID') {
        setActionNotice('Simulating Payoneer 3D Secure 2.0 authorization & ledger settlement...');
      } else if (action === 'FAILED') {
        setActionNotice('Simulating card authorization decline by issuing bank (Code 51)...');
      } else {
        setActionNotice('Simulating customer cancellation in hosted session...');
      }

      await new Promise(r => setTimeout(r, 1100));

      const targetPaymentId = payment?._id || paymentId;
      await api.simulateMockAction(
        targetPaymentId,
        action,
        action === 'FAILED' ? 'Card authorization declined by issuing bank (Simulated 51)' : undefined
      );

      if (action === 'PAID') {
        clearCart();
        navigate(`/checkout/confirmation?orderNumber=${orderNumber}`);
      } else if (action === 'FAILED') {
        navigate(`/checkout/failed?orderNumber=${orderNumber}&reason=${encodeURIComponent('Card authorization declined by issuing bank (Simulated 51).')}`);
      } else {
        navigate(`/checkout/cancelled?orderNumber=${orderNumber}`);
      }
    } catch (err) {
      console.error('Simulation error', err);
      setActionNotice('Simulation error: ' + (err as Error).message);
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-xl w-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl overflow-hidden"
      >
        {/* Terminal Header */}
        <div className="bg-slate-900 dark:bg-slate-950 text-white p-6 relative border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white shadow-glow">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-base tracking-tight font-sans">
                  Payoneer Hosted Sandbox Gateway
                </h2>
                <span className="text-[10px] text-brand-300 font-mono tracking-wider uppercase">
                  Oscato REST Simulation Terminal
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-mono font-bold tracking-wider uppercase">
              Interactive Test Mode
            </span>
          </div>
        </div>

        {/* Transaction Summary Strip */}
        <div className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200/80 dark:border-slate-800 p-5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Order Reference
            </span>
            <span className="text-sm font-mono font-extrabold text-slate-900 dark:text-white">
              {orderNumber || 'PF-2026-DEMO'}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Amount to Authorize
            </span>
            <span className="text-xl font-extrabold text-brand-600 dark:text-brand-400 font-mono">
              ${order ? order.total.toFixed(2) : '---'} <span className="text-xs font-semibold text-slate-400">USD</span>
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Virtual Test Card */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden border border-slate-700/80">
            <div className="absolute top-0 right-0 -mt-6 -mr-6 w-24 h-24 bg-brand-500/10 rounded-full blur-xl" />
            <div className="flex justify-between items-start mb-6">
              <CreditCard className="w-7 h-7 text-brand-400" />
              <span className="font-mono text-[10px] text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full bg-emerald-500/10">
                SANDBOX TEST CARD
              </span>
            </div>
            <div className="font-mono tracking-widest text-base mb-4 font-bold">
              •••• •••• •••• 4242
            </div>
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>{order?.customer.firstName || 'TEST'} {order?.customer.lastName || 'CUSTOMER'}</span>
              <span>12/28</span>
            </div>
          </div>

          {/* Processing notice */}
          {processing && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 flex items-center gap-3 text-xs text-brand-900 dark:text-brand-200 font-medium"
            >
              <Loader2 className="w-5 h-5 text-brand-600 dark:text-brand-400 animate-spin shrink-0" />
              <span>{actionNotice}</span>
            </motion.div>
          )}

          {/* Simulator Actions */}
          <div className="space-y-3 pt-1">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSimulate('PAID')}
              disabled={processing}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-elevated transition-all disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simulate Successful Payment (Authorize & Capture)</span>
            </motion.button>

            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSimulate('FAILED')}
                disabled={processing}
                className="py-3 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>Simulate Decline</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSimulate('CANCELLED')}
                disabled={processing}
                className="py-3 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4 text-slate-500" />
                <span>Simulate Abort</span>
              </motion.button>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200/80 dark:border-slate-800 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5 font-mono">
          <Terminal className="w-3.5 h-3.5" />
          <span>Payoneer Oscato API Handshake Protocol Simulator</span>
        </div>
      </motion.div>
    </div>
  );
};
