import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Order, Payment } from '../types';
import { CheckCircle2, ShieldCheck, ShoppingBag, Printer, ArrowRight, Copy, Check } from 'lucide-react';

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
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-semibold text-slate-700">Verifying payment status...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Order Information Unavailable</h2>
        <p className="text-xs text-slate-500 mt-2">
          Unable to locate transaction records for reference: {orderNumber || 'None'}.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-semibold shadow-sm hover:bg-brand-700"
        >
          Return to Storefront
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center space-y-3 mb-8">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10 animate-in zoom-in-75">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Payment Authorized & Captured</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Thank you for your order!</h1>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          A confirmation receipt has been sent to{' '}
          <strong className="text-slate-800">{order.customer.email}</strong>.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden divide-y divide-slate-100">
        <div className="p-6 bg-slate-50/70 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-500 block">Order Number</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-base font-bold text-slate-900">{order.orderNumber}</span>
              <button
                onClick={copyOrderNumber}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                title="Copy Order Number"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <span className="text-xs text-slate-500 block">Payment Reference</span>
            <span className="font-mono text-xs font-semibold text-slate-700 block mt-0.5">
              {payment?.providerReference || payment?.providerPaymentId || 'PAY-OFFICIAL-VERIFIED'}
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-500 block">Status</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              {order.paymentStatus}
            </span>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
              Shipping Destination
            </h4>
            <p className="font-semibold text-slate-800">
              {order.customer.firstName} {order.customer.lastName}
            </p>
            <p className="text-slate-600 mt-0.5">{order.customer.shippingAddress.address}</p>
            <p className="text-slate-600">
              {order.customer.shippingAddress.city}, {order.customer.shippingAddress.state}{' '}
              {order.customer.shippingAddress.postalCode}
            </p>
            <p className="text-slate-600">{order.customer.shippingAddress.country}</p>
            <p className="text-slate-500 mt-1">{order.customer.phone}</p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2">
              Payment Gateway Details
            </h4>
            <p className="text-slate-600">
              Provider:{' '}
              <strong className="text-slate-900 uppercase">
                {payment?.provider === 'mock' ? 'Payoneer Sandbox (Mock Mode)' : 'Official Payoneer Checkout'}
              </strong>
            </p>
            <p className="text-slate-600 mt-0.5">
              Processing Gateway:{' '}
              <span className="font-mono text-slate-800">Payoneer Oscato Engine</span>
            </p>
            <p className="text-slate-600 mt-0.5">
              Date & Time:{' '}
              <span className="text-slate-800">{new Date(order.createdAt).toLocaleString()}</span>
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/80 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Full Settlement Guaranteed</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
            Purchased Line Items
          </h4>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-2 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-3">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                    />
                  )}
                  <div>
                    <span className="font-semibold text-slate-800 block">{item.name}</span>
                    <span className="text-slate-500 text-[11px]">Qty: {item.quantity}</span>
                  </div>
                </div>
                <span className="font-bold text-slate-900">${item.subtotal.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span className="font-semibold text-slate-900">
                {order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax</span>
              <span className="font-semibold text-slate-900">${order.tax.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between text-sm">
              <span className="font-bold text-slate-900">Amount Paid</span>
              <span className="font-black text-slate-900 text-lg">
                ${order.total.toFixed(2)} <span className="text-xs font-semibold text-slate-500">{order.currency}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50/70 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>

          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition-colors"
            >
              View in Admin
            </Link>
            <Link
              to="/"
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
