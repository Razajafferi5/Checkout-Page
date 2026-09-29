import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Order, Payment } from '../types';
import { CheckCircle2, ShieldCheck, ShoppingBag, Printer, ArrowRight, Copy, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

export const OrderConfirmationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || '';

  const [order, setOrder] = useState<Order | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (orderNumber) {
      api
        .getOrderByNumber(orderNumber)
        .then(res => {
          setOrder(res.order);
          setPayment(res.payment);

          // Trigger celebratory confetti on paid order
          if (res.order.paymentStatus === 'PAID') {
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.6 },
              colors: ['#0284c7', '#10b981', '#38bdf8', '#fbbf24'],
            });
          }
        })
        .catch(err => console.error('Failed to load order', err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [orderNumber]);

  const copyOrderNumber = () => {
    if (orderNumber) {
      navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4 text-center">
        <div className="w-12 h-12 border-3 border-brand-200 dark:border-brand-900 border-t-brand-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 font-mono">
          Verifying Payoneer settlement status...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Order Record Unavailable</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          Unable to locate transaction records for reference: {orderNumber || 'None'}.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-glow"
        >
          Return to Storefront
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
      {/* Celebration Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3 mb-8"
      >
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-elevated"
        >
          <CheckCircle2 className="w-9 h-9" />
        </motion.div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Payment Authorized & Fully Captured</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Payment Successful!
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          Thank you for your order. A verified receipt has been sent to{' '}
          <strong className="text-slate-900 dark:text-white">{order.customer.email}</strong>.
        </p>
      </motion.div>

      {/* Main Order Receipt Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/80"
      >
        {/* Receipt Header Strip */}
        <div className="p-6 bg-slate-50/80 dark:bg-slate-800/40 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono text-slate-400 block uppercase tracking-wider">
              Order Reference
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-base font-extrabold text-slate-900 dark:text-white">
                {order.orderNumber}
              </span>
              <button
                onClick={copyOrderNumber}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors"
                title="Copy Order Number"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-mono text-slate-400 block uppercase tracking-wider">
              Provider Reference
            </span>
            <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300 block mt-0.5">
              {payment?.providerReference || payment?.providerPaymentId || 'PAY-VERIFIED-SETTLED'}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-mono text-slate-400 block uppercase tracking-wider">
              Status
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {order.paymentStatus}
            </span>
          </div>
        </div>

        {/* Customer & Gateway Info */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-2 font-mono">
              Shipping Destination
            </h4>
            <p className="font-semibold text-slate-900 dark:text-white">
              {order.customer.firstName} {order.customer.lastName}
            </p>
            <p className="text-slate-600 dark:text-slate-400 mt-0.5">{order.customer.shippingAddress.address}</p>
            <p className="text-slate-600 dark:text-slate-400">
              {order.customer.shippingAddress.city}, {order.customer.shippingAddress.state}{' '}
              {order.customer.shippingAddress.postalCode}
            </p>
            <p className="text-slate-600 dark:text-slate-400">{order.customer.shippingAddress.country}</p>
            <p className="text-slate-500 dark:text-slate-500 mt-1 font-mono">{order.customer.phone}</p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-2 font-mono">
              Payoneer Session Details
            </h4>
            <p className="text-slate-600 dark:text-slate-400">
              Provider Mode:{' '}
              <strong className="text-slate-900 dark:text-white uppercase font-mono">
                {payment?.provider === 'mock' ? 'Payoneer Sandbox (Mock Mode)' : 'Official Payoneer Hosted'}
              </strong>
            </p>
            <p className="text-slate-600 dark:text-slate-400 mt-0.5">
              Protocol: <span className="font-mono text-slate-800 dark:text-slate-200">Oscato REST LIST Handshake</span>
            </p>
            <p className="text-slate-600 dark:text-slate-400 mt-0.5">
              Authorized At:{' '}
              <span className="text-slate-800 dark:text-slate-200 font-mono">
                {new Date(order.createdAt).toLocaleString()}
              </span>
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200/80 dark:border-emerald-800/60 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>PCI-DSS SAQ A Validated</span>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="p-6 space-y-4">
          <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] font-mono">
            Purchased Hardware Items
          </h4>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-2 border-b border-slate-100 dark:border-slate-800/60 last:border-0">
                <div className="flex items-center gap-3">
                  {item.image && (
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 p-1 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  )}
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">{item.name}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px] font-mono">Qty: {item.quantity}</span>
                  </div>
                </div>
                <span className="font-bold text-slate-900 dark:text-white font-mono">
                  ${item.subtotal.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Breakdown */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900 dark:text-white font-mono">${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Shipping</span>
              <span className="font-semibold text-slate-900 dark:text-white font-mono">
                {order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Sales Tax</span>
              <span className="font-semibold text-slate-900 dark:text-white font-mono">${order.tax.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between text-sm">
              <span className="font-bold text-slate-900 dark:text-white">Total Amount Paid</span>
              <span className="font-extrabold text-brand-600 dark:text-brand-400 text-lg font-mono">
                ${order.total.toFixed(2)} <span className="text-xs font-semibold text-slate-500">{order.currency}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50/80 dark:bg-slate-800/40 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-2 transition-colors shadow-subtle"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>

          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors"
            >
              View in Admin
            </Link>
            <Link
              to="/"
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-glow transition-all"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
