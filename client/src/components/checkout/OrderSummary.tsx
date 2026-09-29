import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Tag, Truck, ShieldCheck, Check, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductImage } from '../common/ProductImage';

interface OrderSummaryProps {
  onPay?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  onPay,
  loading = false,
  disabled = false,
}) => {
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
    if (couponCode.trim().length > 0) {
      setAppliedCoupon(`${couponCode.trim().toUpperCase()} (-$15.00)`);
    }
  };

  return (
    <div className="relative rounded-2xl bg-ivory-light dark:bg-ivory-elevated border border-stone-warm dark:border-white/10 shadow-subtle p-7 space-y-6 h-auto">
      {/* Luxury Receipt Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-warm dark:border-white/10">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-800 dark:text-champagne font-bold block mb-0.5">
            Verified Receipt
          </span>
          <h3 className="font-serif text-2xl font-bold text-charcoal dark:text-ivory">
            Order Summary
          </h3>
        </div>
        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-stone-warm/60 dark:bg-ivory-dark text-charcoal dark:text-champagne border border-stone-warm dark:border-white/10">
          {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Itemized Line Items */}
      <div className="space-y-4 max-h-60 overflow-y-auto pr-1 divide-y divide-stone-warm/60 dark:divide-white/5">
        {cart.map(({ product, quantity }) => (
          <div key={product._id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-lg bg-stone-warm/30 dark:bg-ivory-dark p-1 flex items-center justify-center border border-stone-warm dark:border-white/10 shrink-0 overflow-hidden">
                <ProductImage
                  src={product.image}
                  alt={product.name}
                  category={product.category}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <h4 className="font-serif text-xs font-bold text-charcoal dark:text-ivory truncate">
                  {product.name}
                </h4>
                <p className="text-[11px] font-mono text-charcoal-muted dark:text-stone-muted">
                  {quantity} × ${product.price.toFixed(2)}
                </p>
              </div>
            </div>

            <span className="font-mono text-xs font-bold text-charcoal dark:text-ivory shrink-0">
              ${(product.price * quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Promo Code Input */}
      <div>
        <form onSubmit={handleApplyCoupon} className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="w-3.5 h-3.5 text-stone-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={couponCode}
              onChange={e => setCouponCode(e.target.value)}
              placeholder="PROMO CODE"
              className="w-full pl-8 pr-3 py-2 rounded-lg border border-stone-warm dark:border-white/10 text-xs text-charcoal dark:text-ivory bg-ivory dark:bg-ivory-dark placeholder-stone-muted focus:outline-none focus:border-champagne font-mono uppercase"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 dark:bg-emerald-800 text-ivory rounded-lg text-xs font-mono uppercase tracking-wider font-semibold transition-colors border border-emerald-700/40"
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
              className="mt-2 flex items-center justify-between text-[11px] font-mono text-emerald-800 dark:text-champagne bg-stone-warm/50 dark:bg-ivory-dark px-2.5 py-1 rounded border border-stone-warm dark:border-white/10"
            >
              <span className="flex items-center gap-1">
                <Check className="w-3 h-3 text-champagne" />
                Applied: {appliedCoupon}
              </span>
              <button
                type="button"
                onClick={() => setAppliedCoupon(null)}
                className="text-stone-muted hover:text-charcoal dark:hover:text-white"
              >
                Remove
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Numerical Breakdown */}
      <div className="pt-4 border-t border-stone-warm dark:border-white/10 space-y-2 text-xs">
        <div className="flex justify-between text-charcoal-muted dark:text-stone-muted">
          <span className="font-mono uppercase text-[10px] tracking-wider">Subtotal</span>
          <span className="font-mono font-semibold text-charcoal dark:text-ivory">
            ${subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between text-charcoal-muted dark:text-stone-muted">
          <span className="font-mono uppercase text-[10px] tracking-wider">Delivery</span>
          <span className="font-mono font-semibold text-charcoal dark:text-ivory">
            {shipping === 0 ? (
              <span className="text-emerald-800 dark:text-champagne font-bold">COMPLIMENTARY</span>
            ) : (
              `$${shipping.toFixed(2)}`
            )}
          </span>
        </div>

        <div className="flex justify-between text-charcoal-muted dark:text-stone-muted">
          <span className="font-mono uppercase text-[10px] tracking-wider">Sales Tax (8.25%)</span>
          <span className="font-mono font-semibold text-charcoal dark:text-ivory">
            ${estimatedTax.toFixed(2)}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-emerald-800 dark:text-champagne font-medium">
            <span className="font-mono uppercase text-[10px] tracking-wider">Promo Discount</span>
            <span className="font-mono font-bold">-${discount.toFixed(2)}</span>
          </div>
        )}

        {/* Total Highlight */}
        <div className="border-t border-stone-warm dark:border-white/15 pt-4 flex justify-between items-baseline">
          <div>
            <span className="font-serif text-lg font-bold text-charcoal dark:text-ivory block">
              Total Amount
            </span>
            <span className="text-[10px] font-mono text-charcoal-muted dark:text-stone-muted">
              Includes applicable taxes & delivery
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono uppercase text-champagne mr-1.5 font-bold">
              USD
            </span>
            <motion.span
              key={total}
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              className="font-mono text-2xl font-extrabold text-emerald-900 dark:text-champagne tracking-tight"
            >
              ${total.toFixed(2)}
            </motion.span>
          </div>
        </div>
      </div>

      {/* Trust Guarantee Box */}
      <div className="rounded-xl p-3.5 bg-stone-warm/30 dark:bg-ivory-dark/60 border border-stone-warm dark:border-white/10 flex items-start gap-2.5 text-[11px] text-charcoal-muted dark:text-stone-muted leading-relaxed">
        <Truck className="w-4 h-4 text-champagne shrink-0 mt-0.5" />
        <span>Complimentary insured shipping on all orders over $150. Protected by Payoneer buyer settlement guarantee.</span>
      </div>

      {/* Pay Securely Button */}
      {onPay && (
        <div className="pt-2 space-y-3">
          <motion.button
            whileHover={{ scale: disabled || loading ? 1 : 1.01 }}
            whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
            onClick={onPay}
            disabled={disabled || loading || total <= 0}
            className="w-full py-4 px-6 rounded-lg bg-emerald-900 hover:bg-emerald-800 dark:bg-emerald-800 dark:hover:bg-emerald-700 text-ivory font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 shadow-emerald transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-700/50 group cursor-pointer"
          >
            {loading ? (
              <div className="flex items-center gap-2.5">
                <Loader2 className="w-4 h-4 animate-spin text-champagne" />
                <span>Processing Handshake...</span>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-champagne" />
                  <span>Pay Securely</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-champagne">${total.toFixed(2)} USD</span>
                  <ArrowRight className="w-4 h-4 text-champagne group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            )}
          </motion.button>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-charcoal-muted dark:text-stone-muted">
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-champagne" />
              Zero Surcharges
            </span>
            <span className="opacity-40">•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-800 dark:text-champagne" />
              Payoneer Settlement Guarantee
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
