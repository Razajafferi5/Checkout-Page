import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { ShieldCheck, Lock, CreditCard, CheckCircle2, XCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { Order, Payment } from '../types';

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
        setActionNotice('Simulating Payoneer 3D Secure 2.0 verification & card capture...');
      } else if (action === 'FAILED') {
        setActionNotice('Simulating card authorization decline by issuing bank...');
      } else {
        setActionNotice('Simulating customer cancellation...');
      }

      await new Promise(r => setTimeout(r, 1200));

      const targetPaymentId = payment?._id || paymentId;
      await api.simulateMockAction(
        targetPaymentId,
        action,
        action === 'FAILED' ? 'Card authorization declined by issuer (Simulated 51)' : undefined
      );

      if (action === 'PAID') {
        clearCart();
        navigate(`/checkout/confirmation?orderNumber=${orderNumber}`);
      } else if (action === 'FAILED') {
        navigate(`/checkout/failed?orderNumber=${orderNumber}&reason=${encodeURIComponent('Card authorization declined by issuing bank (Simulated Test).')}`);
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
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden">
        <div className="bg-slate-900 text-white p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-base tracking-tight">Payoneer Hosted Checkout</h2>
                <span className="text-[10px] text-brand-300 font-mono tracking-wider uppercase">
                  Sandbox Simulation Environment
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold tracking-wider uppercase">
              Developer Test Mode
            </span>
          </div>
        </div>

        <div className="bg-slate-50 border-b border-slate-200/80 p-5 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 block">Merchant Reference</span>
            <span className="text-xs font-mono font-bold text-slate-800">{orderNumber || 'PF-2026-DEMO'}</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-500 block">Amount to Pay</span>
            <span className="text-lg font-black text-slate-900">
              ${order ? order.total.toFixed(2) : '---'} <span className="text-xs font-medium text-slate-500">USD</span>
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-brand-50/60 rounded-2xl p-4 border border-brand-200/60 text-xs text-brand-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <Lock className="w-3.5 h-3.5 text-brand-600" />
              <span>Demonstration Testing Controls</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              This mock interface demonstrates how the official Payoneer Hosted Payment Page behaves once redirected.
              Select any outcome below to test the complete server synchronization, order updates, and UX states.
            </p>
          </div>

          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-6 -mr-6 w-24 h-24 bg-white/5 rounded-full" />
            <div className="flex justify-between items-start mb-6">
              <CreditCard className="w-7 h-7 text-brand-400" />
              <span className="font-mono text-xs text-slate-400">TEST ENVIRONMENT</span>
            </div>
            <div className="font-mono tracking-widest text-sm mb-4">
              •••• •••• •••• 4242
            </div>
            <div className="flex justify-between text-[11px] font-mono text-slate-300">
              <span>{order?.customer.firstName || 'TEST'} {order?.customer.lastName || 'CUSTOMER'}</span>
              <span>12/28</span>
            </div>
          </div>

          {processing && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-3 animate-in fade-in">
              <Loader2 className="w-5 h-5 text-brand-600 animate-spin flex-shrink-0" />
              <span className="text-xs font-semibold text-slate-800">{actionNotice}</span>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <button
              onClick={() => handleSimulate('PAID')}
              disabled={processing}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99] disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simulate Successful Payment (Approve)</span>
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSimulate('FAILED')}
                disabled={processing}
                className="py-3 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Simulate Decline</span>
              </button>

              <button
                onClick={() => handleSimulate('CANCELLED')}
                disabled={processing}
                className="py-3 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4 text-slate-600" />
                <span>Simulate Abort</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200/80 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
          <span>Payoneer Oscato API Architecture Simulator</span>
        </div>
      </div>
    </div>
  );
};
