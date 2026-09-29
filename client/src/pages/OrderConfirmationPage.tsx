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

          // Trigger celebratory confetti with luxury emerald & champagne palette
          if (res.order.paymentStatus === 'PAID') {
            confetti({
              particleCount: 90,
              spread: 65,
              origin: { y: 0.6 },
              colors: ['#063B2A', '#075E45', '#C9A86A', '#D8BD82', '#171A18'],
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
        <div className="w-12 h-12 border-2 border-champagne/30 border-t-emerald-800 dark:border-t-champagne rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs font-mono font-medium text-charcoal/70 dark:text-ivory/70 tracking-wider">
          Verifying Payoneer settlement status...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <div className="w-16 h-16 bg-stone-warm/50 dark:bg-white/5 border border-stone-warm dark:border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-charcoal/40 dark:text-ivory/40">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-charcoal dark:text-ivory">Order Record Unavailable</h2>
        <p className="text-xs text-charcoal/60 dark:text-ivory/60 mt-2 font-sans">
          Unable to locate transaction records for reference: {orderNumber || 'None'}.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-800 hover:bg-emerald-700 text-ivory text-xs font-semibold tracking-wider uppercase transition-colors"
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
        className="text-center space-y-4 mb-10"
      >
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 300 }}
          className="w-16 h-16 rounded-full bg-emerald-950 text-champagne border border-champagne/40 flex items-center justify-center mx-auto shadow-elevated"
        >
          <CheckCircle2 className="w-8 h-8" />
        </motion.div>

        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-900/10 dark:bg-emerald-950/60 border border-emerald-900/20 dark:border-champagne/30 text-xs font-mono font-medium text-emerald-900 dark:text-champagne">
          <ShieldCheck className="w-3.5 h-3.5 text-champagne-dark dark:text-champagne" />
          <span>Payment Authorized & Verified</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-charcoal dark:text-ivory">
          Payment Successful
        </h1>
        <p className="text-xs text-charcoal/70 dark:text-ivory/60 max-w-md mx-auto leading-relaxed font-sans">
          Thank you for your order. A verified receipt and fulfillment confirmation has been dispatched to{' '}
          <strong className="text-charcoal dark:text-ivory font-semibold">{order.customer.email}</strong>.
        </p>
      </motion.div>

      {/* Main Order Receipt Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-3xl bg-ivory dark:bg-ivory-dark border border-stone-warm/80 dark:border-white/10 shadow-elevated overflow-hidden divide-y divide-stone-warm/80 dark:divide-white/10"
      >
        {/* Receipt Header Strip */}
        <div className="p-6 bg-stone-warm/30 dark:bg-white/5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono text-charcoal/50 dark:text-ivory/50 block uppercase tracking-wider">
              Order Reference
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-base font-extrabold text-charcoal dark:text-ivory">
                {order.orderNumber}
              </span>
              <button
                onClick={copyOrderNumber}
                className="p-1 rounded-md text-charcoal/40 dark:text-ivory/40 hover:text-emerald-800 dark:hover:text-champagne hover:bg-stone-warm/60 dark:hover:bg-white/10 transition-colors"
                title="Copy Order Number"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-champagne-dark dark:text-champagne" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-mono text-charcoal/50 dark:text-ivory/50 block uppercase tracking-wider">
              Provider Reference
            </span>
            <span className="font-mono text-xs font-semibold text-charcoal/80 dark:text-ivory/80 block mt-0.5">
              {payment?.providerReference || payment?.providerPaymentId || 'PAY-VERIFIED-SETTLED'}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-mono text-charcoal/50 dark:text-ivory/50 block uppercase tracking-wider">
              Status
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-900/10 dark:bg-emerald-950/60 text-emerald-900 dark:text-champagne border border-emerald-900/20 dark:border-champagne/30 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-champagne-dark dark:bg-champagne animate-pulse" />
              {order.paymentStatus}
            </span>
          </div>
        </div>

        {/* Customer & Gateway Info */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div>
            <h4 className="font-bold text-charcoal dark:text-ivory uppercase tracking-wider text-[11px] mb-2 font-mono">
              Shipping Destination
            </h4>
            <p className="font-semibold text-charcoal dark:text-ivory text-sm font-sans">
              {order.customer.firstName} {order.customer.lastName}
            </p>
            <p className="text-charcoal/70 dark:text-ivory/70 mt-1">{order.customer.shippingAddress.address}</p>
            <p className="text-charcoal/70 dark:text-ivory/70">
              {order.customer.shippingAddress.city}, {order.customer.shippingAddress.state}{' '}
              {order.customer.shippingAddress.postalCode}
            </p>
            <p className="text-charcoal/70 dark:text-ivory/70">{order.customer.shippingAddress.country}</p>
            <p className="text-charcoal/50 dark:text-ivory/50 mt-1.5 font-mono">{order.customer.phone}</p>
          </div>

          <div>
            <h4 className="font-bold text-charcoal dark:text-ivory uppercase tracking-wider text-[11px] mb-2 font-mono">
              Payoneer Session Details
            </h4>
            <p className="text-charcoal/70 dark:text-ivory/70">
              Provider Mode:{' '}
              <strong className="text-charcoal dark:text-ivory uppercase font-mono">
                {payment?.provider === 'mock' ? 'Payoneer Sandbox (Mock Mode)' : 'Official Payoneer Hosted'}
              </strong>
            </p>
            <p className="text-charcoal/70 dark:text-ivory/70 mt-1 font-mono">
              Protocol: <span className="text-charcoal dark:text-ivory">Oscato REST LIST Handshake</span>
            </p>
            <p className="text-charcoal/70 dark:text-ivory/70 mt-1 font-mono">
              Authorized At:{' '}
              <span className="text-charcoal dark:text-ivory">
                {new Date(order.createdAt).toLocaleString()}
              </span>
            </p>
            <div className="mt-3.5 inline-flex items-center gap-1.5 text-emerald-900 dark:text-champagne bg-emerald-900/10 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-900/20 dark:border-champagne/30 font-medium font-mono text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-champagne-dark dark:text-champagne" />
              <span>PCI-DSS SAQ A Validated</span>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="p-6 space-y-4">
          <h4 className="font-bold text-charcoal dark:text-ivory uppercase tracking-wider text-[11px] font-mono">
            Purchased Hardware Items
          </h4>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-2.5 border-b border-stone-warm/60 dark:border-white/5 last:border-0">
                <div className="flex items-center gap-3.5">
                  {item.image && (
                    <div className="w-12 h-12 rounded-xl bg-stone-warm/40 dark:bg-white/5 p-1.5 flex items-center justify-center border border-stone-warm dark:border-white/10 shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  )}
                  <div>
                    <span className="font-serif font-bold text-sm text-charcoal dark:text-ivory block">{item.name}</span>
                    <span className="text-charcoal/50 dark:text-ivory/50 text-[11px] font-mono">Qty: {item.quantity}</span>
                  </div>
                </div>
                <span className="font-bold text-charcoal dark:text-ivory font-mono text-sm">
                  ${item.subtotal.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Breakdown */}
          <div className="pt-4 border-t border-stone-warm/80 dark:border-white/10 space-y-2 text-xs">
            <div className="flex justify-between text-charcoal/70 dark:text-ivory/70">
              <span>Subtotal</span>
              <span className="font-semibold text-charcoal dark:text-ivory font-mono">${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-charcoal/70 dark:text-ivory/70">
              <span>Shipping</span>
              <span className="font-semibold text-charcoal dark:text-ivory font-mono">
                {order.shipping === 0 ? 'COMPLIMENTARY' : `$${order.shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-charcoal/70 dark:text-ivory/70">
              <span>Sales Tax (8.25%)</span>
              <span className="font-semibold text-charcoal dark:text-ivory font-mono">${order.tax.toFixed(2)}</span>
            </div>
            <div className="pt-3 border-t border-stone-warm dark:border-white/15 flex justify-between items-baseline text-sm">
              <span className="font-serif font-bold text-charcoal dark:text-ivory text-base">Total Amount Paid</span>
              <span className="font-extrabold text-emerald-900 dark:text-champagne text-2xl font-mono">
                ${order.total.toFixed(2)} <span className="text-xs font-semibold text-charcoal/50 dark:text-ivory/50">{order.currency}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-stone-warm/30 dark:bg-white/5 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 rounded-full border border-stone-muted dark:border-white/20 bg-ivory dark:bg-ivory-elevated hover:bg-stone-warm dark:hover:bg-white/10 text-charcoal dark:text-ivory font-medium text-xs flex items-center gap-2 transition-colors shadow-subtle"
          >
            <Printer className="w-4 h-4 text-charcoal/60 dark:text-ivory/60" />
            <span>Print Verified Receipt</span>
          </button>

          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="px-4 py-2.5 rounded-full border border-stone-warm dark:border-white/10 hover:bg-stone-warm/60 dark:hover:bg-white/10 text-charcoal/80 dark:text-ivory/80 font-medium text-xs transition-colors"
            >
              Operations Ledger
            </Link>
            <Link
              to="/"
              className="px-6 py-2.5 rounded-full bg-emerald-800 hover:bg-emerald-700 text-ivory font-semibold text-xs flex items-center gap-2 shadow-elevated transition-all"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-3.5 h-3.5 text-champagne" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
