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
        className="max-w-xl w-full rounded-3xl bg-ivory dark:bg-ivory-dark border border-stone-warm/80 dark:border-white/10 shadow-elevated overflow-hidden"
      >
        {/* Terminal Header */}
        <div className="bg-emerald-950 dark:bg-charcoal text-ivory p-6 relative border-b border-champagne/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-champagne text-emerald-950 flex items-center justify-center shadow-subtle">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-base tracking-tight text-ivory">
                  Payoneer Hosted Sandbox
                </h2>
                <span className="text-[10px] text-champagne font-mono tracking-wider uppercase">
                  Oscato REST Simulation Terminal
                </span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-champagne/20 text-champagne border border-champagne/30 text-[10px] font-mono font-bold tracking-wider uppercase">
              Interactive Test Mode
            </span>
          </div>
        </div>

        {/* Transaction Summary Strip */}
        <div className="bg-stone-warm/30 dark:bg-white/5 border-b border-stone-warm/80 dark:border-white/10 p-5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono text-charcoal/50 dark:text-ivory/50 uppercase tracking-wider block">
              Order Reference
            </span>
            <span className="text-sm font-mono font-extrabold text-charcoal dark:text-ivory">
              {orderNumber || 'PF-2026-DEMO'}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-mono text-charcoal/50 dark:text-ivory/50 uppercase tracking-wider block">
              Amount to Authorize
            </span>
            <span className="text-2xl font-extrabold text-emerald-900 dark:text-champagne font-mono">
              ${order ? order.total.toFixed(2) : '---'} <span className="text-xs font-semibold text-charcoal/50 dark:text-ivory/50">USD</span>
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Virtual Luxury Test Card */}
          <div className="bg-gradient-to-br from-[#063B2A] via-[#08291F] to-[#0B0F0D] rounded-2xl p-6 text-ivory shadow-elevated relative overflow-hidden border border-champagne/30">
            <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-champagne/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-10 h-7 rounded bg-champagne/30 border border-champagne/50 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-champagne" />
                </div>
                <span className="font-serif font-bold text-xs tracking-wider text-champagne">PAYFLOW RESERVE</span>
              </div>
              <span className="font-mono text-[10px] text-champagne border border-champagne/40 px-2.5 py-0.5 rounded-full bg-champagne/10">
                SANDBOX TEST CARD
              </span>
            </div>
            <div className="font-mono tracking-widest text-lg mb-5 font-bold text-ivory/90">
              •••• •••• •••• 4242
            </div>
            <div className="flex justify-between text-xs font-mono text-ivory/70 relative z-10">
              <span className="uppercase">{order?.customer.firstName || 'TEST'} {order?.customer.lastName || 'CLIENT'}</span>
              <span>12/28</span>
            </div>
          </div>

          {/* Processing notice */}
          {processing && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-champagne-pale dark:bg-champagne/10 border border-champagne/30 flex items-center gap-3 text-xs text-charcoal dark:text-ivory font-medium font-mono"
            >
              <Loader2 className="w-4 h-4 text-champagne-dark dark:text-champagne animate-spin shrink-0" />
              <span>{actionNotice}</span>
            </motion.div>
          )}

          {/* Simulator Actions */}
          <div className="space-y-3 pt-1">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSimulate('PAID')}
              disabled={processing}
              className="w-full py-3.5 px-4 rounded-full bg-emerald-800 hover:bg-emerald-700 text-ivory font-semibold text-xs flex items-center justify-center gap-2 shadow-elevated transition-all tracking-wider uppercase disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4 text-champagne" />
              <span>Simulate Successful Authorization & Capture</span>
            </motion.button>

            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSimulate('FAILED')}
                disabled={processing}
                className="py-3 px-3 rounded-full bg-stone-warm/50 dark:bg-white/5 hover:bg-rose-500/10 text-charcoal/80 dark:text-ivory/80 hover:text-rose-700 dark:hover:text-rose-400 border border-stone-muted dark:border-white/20 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>Simulate Decline</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSimulate('CANCELLED')}
                disabled={processing}
                className="py-3 px-3 rounded-full bg-stone-warm/50 dark:bg-white/5 hover:bg-stone-warm dark:hover:bg-white/10 text-charcoal/80 dark:text-ivory/80 border border-stone-muted dark:border-white/20 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4 text-charcoal/50 dark:text-ivory/50" />
                <span>Simulate Abort</span>
              </motion.button>
            </div>
          </div>
        </div>

        <div className="p-4 bg-stone-warm/30 dark:bg-white/5 border-t border-stone-warm/80 dark:border-white/10 text-center text-[11px] text-charcoal/50 dark:text-ivory/50 flex items-center justify-center gap-1.5 font-mono">
          <Terminal className="w-3.5 h-3.5 text-champagne-dark dark:text-champagne" />
          <span>Payoneer Oscato API Handshake Protocol Simulator</span>
        </div>
      </motion.div>
    </div>
  );
};
