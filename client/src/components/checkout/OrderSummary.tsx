import React from 'react';
import { useCart } from '../../context/CartContext';
import { Tag, Truck } from 'lucide-react';

export const OrderSummary: React.FC = () => {
  const { items, subtotal, shipping, estimatedTax, total } = useCart();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <h3 className="font-bold text-slate-900 text-base">Order Summary</h3>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
          {items.reduce((acc, i) => acc + i.quantity, 0)} items
        </span>
      </div>

      <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
        {items.map(({ product, quantity }) => (
          <div key={product._id} className="flex items-center gap-3">
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-14 h-14 rounded-xl object-cover border border-slate-200/80 bg-slate-50"
              />
              <span className="absolute -top-1.5 -right-1.5 bg-slate-700 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {quantity}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-slate-900 line-clamp-1">{product.name}</h4>
              <p className="text-[11px] text-slate-600 font-mono">
                {quantity} × ${product.price.toFixed(2)}
              </p>
            </div>

            <span className="text-xs font-bold text-slate-900">
              ${(product.price * quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="pt-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Coupon or gift card"
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 uppercase font-mono"
            />
          </div>
          <button
            type="button"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            Apply
          </button>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal</span>
          <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Shipping (Standard)</span>
          <span className="font-semibold text-slate-900">
            {shipping === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Estimated Sales Tax (8.25%)</span>
          <span className="font-semibold text-slate-900">${estimatedTax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Discount</span>
          <span className="font-semibold text-slate-900">$0.00</span>
        </div>

        <div className="border-t border-slate-200 pt-3 flex justify-between text-sm">
          <div>
            <span className="font-bold text-slate-900 block">Total Due</span>
            <span className="text-[11px] text-slate-600">Includes applicable taxes</span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-slate-600 mr-1">USD</span>
            <span className="font-black text-xl text-slate-900 tracking-tight">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60 flex items-start gap-2 text-[11px] text-slate-600">
        <Truck className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
        <span>Free standard insured shipping applied. Guaranteed delivery in 2–4 business days.</span>
      </div>
    </div>
  );
};
