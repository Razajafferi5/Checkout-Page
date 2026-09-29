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
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 350 }}
              className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                      Your Cart
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {totalItems} {totalItems === 1 ? 'item' : 'items'} selected
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Progress Bar */}
              <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                  <span className="text-slate-600 dark:text-slate-300">
                    {remainingForFreeShipping > 0 ? (
                      <>Add <span className="font-bold text-brand-600 dark:text-brand-400 font-mono">${remainingForFreeShipping.toFixed(2)}</span> more for Free Shipping</>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        Unlocked Free Express Shipping!
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-[11px] text-slate-400 font-bold">
                    {Math.round(progressPercent)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-brand-500 to-sky-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>

              {/* Items List / Empty State */}
              <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-slate-100 dark:divide-slate-800/80">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4"
                    >
                      <ShoppingBag className="w-8 h-8 opacity-60" />
                    </motion.div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                      Your cart is waiting
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mb-6">
                      Discover our high-performance hardware catalog and test our smooth checkout experience.
                    </p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-glow transition-all"
                    >
                      Explore Products
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
                        <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 p-2 shrink-0 flex items-center justify-center border border-slate-200/80 dark:border-slate-700/80">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>

                        {/* Info & Quantity */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-2">
                            ${item.product.price.toFixed(2)} USD
                          </p>

                          <div className="flex items-center gap-3">
                            <div className="inline-flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800">
                              <button
                                onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                className="px-2 py-0.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                              >
                                -
                              </button>
                              <span className="px-2.5 py-0.5 text-xs font-mono font-bold text-slate-900 dark:text-white">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                className="px-2 py-0.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                                disabled={item.quantity >= item.product.stock}
                              >
                                +
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.product._id)}
                              className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">
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
                <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="space-y-2 mb-4 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-mono font-semibold text-slate-900 dark:text-white">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Shipping</span>
                      <span className="font-mono font-semibold text-slate-900 dark:text-white">
                        {subtotal >= 150 ? 'FREE' : '$9.99'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Tax (8.25%)</span>
                      <span className="font-mono font-semibold text-slate-900 dark:text-white">
                        ${(subtotal * 0.0825).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                      <span>Estimated Total</span>
                      <span className="font-mono text-base text-brand-600 dark:text-brand-400">
                        ${(subtotal + (subtotal >= 150 ? 0 : 9.99) + subtotal * 0.0825).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Link
                    to="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="w-full py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-glow hover:shadow-lg transition-all"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Secure Payoneer Hosted Checkout</span>
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
