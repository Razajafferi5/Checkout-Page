import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ShieldCheck, Check, Truck, Zap } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { showNotification } = useNotification();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    setQuantity(1);
    setIsAdded(false);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const handleAdd = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    showNotification('success', `${product.name} added to cart`, `$${(product.price * quantity).toFixed(2)} USD`);

    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Product Image Area */}
            <div className="relative bg-slate-100 dark:bg-slate-800/50 p-8 flex items-center justify-center min-h-[260px] md:min-h-full">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-64 object-contain drop-shadow-xl transform hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 border border-slate-200 dark:border-slate-700">
                {product.category}
              </span>
            </div>

            {/* Product Details */}
            <div className="p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    In Stock ({product.stock} units)
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                  {product.name}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  {product.description}
                </p>

                {/* Price Display */}
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono">
                    {product.currency}
                  </span>
                </div>

                {/* Micro guarantees */}
                <div className="grid grid-cols-2 gap-2 py-3 border-y border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 mb-6">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-brand-500" />
                    <span>Free shipping $150+</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Payoneer Verified</span>
                  </div>
                </div>
              </div>

              {/* Quantity Picker & Add CTA */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Quantity:</span>
                  <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="px-3 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-bold transition-colors"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-4 py-1 text-xs font-mono font-bold text-slate-900 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                      className="px-3 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-sm font-bold transition-colors"
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleAdd}
                  disabled={isAdded || product.stock === 0}
                  className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-all duration-200 ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-brand-600 hover:bg-brand-500 dark:bg-brand-500 dark:hover:bg-brand-400 text-white shadow-glow'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart • ${(product.price * quantity).toFixed(2)}</span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
