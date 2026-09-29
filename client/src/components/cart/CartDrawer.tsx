import React from 'react';
import { useCart } from '../../context/CartContext';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    subtotal,
    shipping,
    estimatedTax,
    total,
    freeShippingThreshold,
  } = useCart();

  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const freeShippingProgress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const remainingForFreeShipping = Math.max(freeShippingThreshold - subtotal, 0);

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-600" />
              <h2 className="font-bold text-slate-900 text-base">Your Cart</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-slate-50 border-b border-slate-200/60 px-5 py-3">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-700">
                {subtotal >= freeShippingThreshold ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    ✓ You unlocked FREE express shipping!
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-brand-700">${remainingForFreeShipping.toFixed(2)}</strong> more for FREE shipping
                  </span>
                )}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {Math.round(freeShippingProgress)}%
              </span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-brand-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">Your cart is empty</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Explore our curated tech and accessories collection to start checking out.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition-all"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div key={product._id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-[72px] h-[72px] rounded-xl object-cover border border-slate-200/80 bg-slate-50 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{product.name}</h4>
                        <button
                          onClick={() => removeItem(product._id)}
                          className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500">{product.category}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                        <button
                          onClick={() => updateQuantity(product._id, quantity - 1)}
                          className="px-2 py-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-semibold text-slate-800">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product._id, quantity + 1)}
                          className="px-2 py-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-slate-900">
                        ${(product.price * quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="p-5 border-t border-slate-200/80 bg-slate-50/70 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Estimated Tax</span>
                  <span className="font-semibold text-slate-900">${estimatedTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-slate-900">
                    {shipping === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between text-sm">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="font-black text-slate-900">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-slate-900/10 transition-all active:scale-[0.99]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-600 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />
                <span>Encrypted Payoneer Checkout Architecture</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
