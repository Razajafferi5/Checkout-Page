import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ArrowRight, ShoppingBag, ShieldCheck, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();

  const freeShippingThreshold = 150.0;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-charcoal/60 dark:bg-black/80 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 350 }}
              className="w-screen max-w-md bg-ivory dark:bg-ivory-dark border-l border-stone-warm dark:border-white/10 shadow-2xl flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-stone-warm dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-900 text-champagne flex items-center justify-center border border-champagne/30">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-mono uppercase tracking-widest font-bold text-charcoal dark:text-ivory leading-tight">
                      Your Bag
                    </h2>
                    <p className="text-[11px] font-mono text-charcoal-muted dark:text-stone-muted">
                      {totalItems} {totalItems === 1 ? 'selection' : 'selections'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-lg text-charcoal-muted hover:text-charcoal dark:text-stone-muted dark:hover:text-white transition-colors"
                  aria-label="Close bag"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Free Shipping Tier Banner */}
              <div className="px-6 py-3 bg-stone-warm/40 dark:bg-ivory-elevated/40 border-b border-stone-warm dark:border-white/10">
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className="text-charcoal-muted dark:text-stone-muted text-[11px]">
                    {remainingForFreeShipping > 0 ? (
                      <>Add <span className="font-bold text-emerald-800 dark:text-champagne font-mono">${remainingForFreeShipping.toFixed(2)}</span> for Complimentary Delivery</>
                    ) : (
                      <span className="text-emerald-800 dark:text-champagne font-bold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        Unlocked Complimentary Insured Shipping
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] text-charcoal-muted dark:text-stone-muted font-bold">
                    {Math.round(progressPercent)}%
                  </span>
                </div>
                <div className="w-full h-1 bg-stone-warm dark:bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-champagne rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>

              {/* Items List or Minimalist Empty State */}
              <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-stone-warm/80 dark:divide-white/10">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-16 h-16 rounded-2xl bg-stone-warm/50 dark:bg-ivory-elevated flex items-center justify-center text-charcoal-muted dark:text-champagne mb-4 border border-stone-warm dark:border-white/10"
                    >
                      <ShoppingBag className="w-8 h-8 opacity-70" />
                    </motion.div>
                    <h3 className="font-serif text-xl font-bold text-charcoal dark:text-ivory mb-1">
                      Nothing here yet.
                    </h3>
                    <p className="text-xs text-charcoal-muted dark:text-stone-muted max-w-xs mb-6 leading-relaxed">
                      Let's find something worth checking out from our collection.
                    </p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="px-6 py-3 rounded-lg bg-emerald-900 hover:bg-emerald-800 dark:bg-emerald-800 text-ivory text-xs font-mono uppercase tracking-wider font-semibold shadow-emerald transition-all border border-emerald-700/40"
                    >
                      Explore Store →
                    </button>
                  </div>
                ) : (
                  <AnimatePresence>
                    {cart.map(item => (
                      <motion.div
                        key={item.product._id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="py-4 flex gap-4 items-center"
                      >
                        {/* Thumbnail */}
                        <div className="w-16 h-16 rounded-xl bg-stone-warm/40 dark:bg-ivory-elevated p-2 shrink-0 flex items-center justify-center border border-stone-warm dark:border-white/10">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>

                        {/* Info & Quantity */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif text-xs font-bold text-charcoal dark:text-ivory truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-[11px] font-mono text-charcoal-muted dark:text-stone-muted mb-2">
                            ${item.product.price.toFixed(2)} USD
                          </p>

                          <div className="flex items-center gap-3">
                            <div className="inline-flex items-center border border-stone-warm dark:border-white/10 rounded-md overflow-hidden bg-ivory-light dark:bg-ivory-dark">
                              <button
                                onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                className="px-2 py-0.5 text-xs text-charcoal dark:text-ivory hover:bg-stone-warm dark:hover:bg-ivory-elevated font-mono"
                              >
                                -
                              </button>
                              <span className="px-2.5 py-0.5 text-xs font-mono font-bold text-charcoal dark:text-ivory">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                className="px-2 py-0.5 text-xs text-charcoal dark:text-ivory hover:bg-stone-warm dark:hover:bg-ivory-elevated font-mono"
                                disabled={item.quantity >= item.product.stock}
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.product._id)}
                              className="text-charcoal-muted hover:text-rose-600 transition-colors p-1"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Total */}
                        <div className="text-right">
                          <span className="text-xs font-bold font-mono text-charcoal dark:text-ivory">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Drawer Footer with Calculations */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-stone-warm dark:border-white/10 bg-ivory-light dark:bg-ivory-dark">
                  <div className="space-y-2 mb-5 text-xs text-charcoal-muted dark:text-stone-muted">
                    <div className="flex justify-between">
                      <span className="font-mono uppercase text-[10px] tracking-wider">Subtotal</span>
                      <span className="font-mono font-semibold text-charcoal dark:text-ivory">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono uppercase text-[10px] tracking-wider">Delivery</span>
                      <span className="font-mono font-semibold text-charcoal dark:text-ivory">
                        {subtotal >= 150 ? 'COMPLIMENTARY' : '$9.99'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-mono uppercase text-[10px] tracking-wider">Sales Tax (8.25%)</span>
                      <span className="font-mono font-semibold text-charcoal dark:text-ivory">
                        ${(subtotal * 0.0825).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-charcoal dark:text-ivory pt-2 border-t border-stone-warm dark:border-white/10">
                      <span className="font-serif">Estimated Total</span>
                      <span className="font-mono text-base text-emerald-800 dark:text-champagne font-extrabold">
                        ${(subtotal + (subtotal >= 150 ? 0 : 9.99) + subtotal * 0.0825).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Link
                    to="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full py-3.5 px-4 rounded-lg bg-emerald-900 hover:bg-emerald-800 dark:bg-emerald-800 dark:hover:bg-emerald-700 text-ivory font-mono text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 shadow-emerald transition-all border border-emerald-700/40"
                  >
                    <span>Continue to Checkout</span>
                    <ArrowRight className="w-3.5 h-3.5 text-champagne" />
                  </Link>

                  <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] font-mono text-charcoal-muted dark:text-stone-muted">
                    <ShieldCheck className="w-3.5 h-3.5 text-champagne" />
                    <span>Payoneer Hosted Security</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
