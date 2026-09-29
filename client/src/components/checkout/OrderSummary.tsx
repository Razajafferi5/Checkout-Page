import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Tag, Truck, ShieldCheck, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const OrderSummary: React.FC = () => {
  const { cart, subtotal } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const shipping = subtotal >= 150 ? 0.0 : 9.99;
  const estimatedTax = Number((subtotal * 0.0825).toFixed(2));
  const discount = appliedCoupon ? 15.0 : 0.0;
  const total = Number(Math.max(0, subtotal - discount + estimatedTax + shipping).toFixed(2));

  const totalItemsCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'PAYFLOW15') {
      setAppliedCoupon('PAYFLOW15 (-$15.00)');
    } else if (couponCode.trim().length > 0) {
      // Demo simulated promo
      setAppliedCoupon(`${couponCode.trim().toUpperCase()} (-$15.00)`);
    }
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-subtle p-6 space-y-6 sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Order Summary</h3>
          <p className="text-[11px] text-slate-400">Server verified calculations</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
          {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Item thumbnails */}
      <div className="space-y-3.5 max-h-64 overflow-y-auto pr-1 divide-y divide-slate-100 dark:divide-slate-800/60">
        {cart.map(({ product, quantity }) => (
          <div key={product._id} className="pt-3 first:pt-0 flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 p-1.5 flex items-center justify-center border border-slate-200/80 dark:border-slate-700/80">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <span className="absolute -top-1.5 -right-1.5 bg-slate-900 dark:bg-slate-700 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {quantity}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {product.name}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                {quantity} × ${product.price.toFixed(2)}
              </p>
            </div>

            <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
              ${(product.price * quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Promo Code Input */}
      <div>
        <form onSubmit={handleApplyCoupon} className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={couponCode}
              onChange={e => setCouponCode(e.target.value)}
              placeholder="Promo code (e.g. PAYFLOW15)"
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white bg-slate-50/50 dark:bg-slate-800/50 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 uppercase font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Apply
          </button>
        </form>

        <AnimatePresence>
          {appliedCoupon && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/60"
            >
              <span className="flex items-center gap-1">
                <Check className="w-3 h-3" />
                Coupon Applied: {appliedCoupon}
              </span>
              <button
                type="button"
                onClick={() => setAppliedCoupon(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                Remove
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Numerical Breakdown */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Subtotal</span>
          <span className="font-semibold text-slate-900 dark:text-white font-mono">
            ${subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Insured Shipping</span>
          <span className="font-semibold text-slate-900 dark:text-white font-mono">
            {shipping === 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">FREE</span>
            ) : (
              `$${shipping.toFixed(2)}`
            )}
          </span>
        </div>

        <div className="flex justify-between text-slate-600 dark:text-slate-400">
          <span>Sales Tax (8.25%)</span>
          <span className="font-semibold text-slate-900 dark:text-white font-mono">
            ${estimatedTax.toFixed(2)}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
            <span>Special Discount</span>
            <span className="font-mono font-bold">-${discount.toFixed(2)}</span>
          </div>
        )}

        {/* Total Highlight */}
        <div className="border-t border-slate-200 dark:border-slate-700/80 pt-3 flex justify-between items-baseline">
          <div>
            <span className="font-bold text-slate-900 dark:text-white block text-sm">
              Total Amount
            </span>
            <span className="text-[10px] text-slate-400">Tax & Shipping included</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono font-bold text-slate-400 mr-1.5 uppercase">
              USD
            </span>
            <motion.span
              key={total}
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              className="font-extrabold text-2xl text-slate-900 dark:text-white tracking-tight font-mono"
            >
              ${total.toFixed(2)}
            </motion.span>
          </div>
        </div>
      </div>

      {/* Trust Guarantee Box */}
      <div className="rounded-xl p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex items-start gap-2.5 text-[11px] text-slate-600 dark:text-slate-400">
        <Truck className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
        <span>Free insured express shipping on orders over $150. Protected by Payoneer buyer guarantee.</span>
      </div>
    </div>
  );
};
