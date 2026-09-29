import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ShieldCheck, Check, Truck } from 'lucide-react';
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
    showNotification('success', `${product.name} added to bag`, `$${(product.price * quantity).toFixed(2)} USD`);

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
          className="fixed inset-0 bg-charcoal/70 dark:bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-2xl bg-ivory-light dark:bg-ivory-elevated rounded-3xl shadow-2xl border border-stone-warm dark:border-white/10 overflow-hidden z-10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 p-2 rounded-full bg-stone-warm/50 dark:bg-white/5 text-charcoal dark:text-ivory hover:text-emerald-800 dark:hover:text-champagne transition-colors z-20"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Product Image Area */}
            <div className="relative bg-stone-warm/30 dark:bg-ivory-dark/40 p-8 flex items-center justify-center min-h-[260px] md:min-h-full">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-60 object-contain drop-shadow-xl"
              />
              <span className="absolute top-4 left-4 px-2.5 py-1 rounded text-[9px] font-mono font-bold uppercase tracking-widest bg-ivory dark:bg-emerald-950 text-charcoal dark:text-champagne border border-stone-warm dark:border-white/10">
                {product.category}
              </span>
            </div>

            {/* Product Details */}
            <div className="p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-800 dark:text-champagne block mb-1">
                  Verified In Stock ({product.stock} units)
                </span>

                <h3 className="font-serif text-2xl font-bold text-charcoal dark:text-ivory mb-3 leading-snug">
                  {product.name}
                </h3>

                <p className="text-xs text-charcoal-muted dark:text-stone-muted mb-6 leading-relaxed">
                  {product.description}
                </p>

                {/* Price Display */}
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="font-mono text-3xl font-extrabold text-charcoal dark:text-ivory">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-xs font-mono text-charcoal-muted dark:text-stone-muted">
                    {product.currency}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 py-3 border-y border-stone-warm dark:border-white/10 text-xs text-charcoal-muted dark:text-stone-muted mb-6">
                  <div className="flex items-center gap-1.5 font-mono text-[11px]">
                    <Truck className="w-3.5 h-3.5 text-emerald-800 dark:text-champagne" />
                    <span>Free ship $150+</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-champagne" />
                    <span>Payoneer Verified</span>
                  </div>
                </div>
              </div>

              {/* Quantity Picker & Add CTA */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-charcoal dark:text-ivory font-semibold">
                    Quantity:
                  </span>
                  <div className="flex items-center border border-stone-warm dark:border-white/10 rounded-lg overflow-hidden bg-ivory dark:bg-ivory-dark">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="px-3 py-1 text-charcoal dark:text-ivory hover:bg-stone-warm dark:hover:bg-ivory-elevated text-xs font-mono font-bold transition-colors"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-3.5 py-1 text-xs font-mono font-bold text-charcoal dark:text-ivory">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                      className="px-3 py-1 text-charcoal dark:text-ivory hover:bg-stone-warm dark:hover:bg-ivory-elevated text-xs font-mono font-bold transition-colors"
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
                  className={`w-full py-3.5 px-6 rounded-lg font-mono text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 shadow-emerald transition-all duration-200 ${
                    isAdded
                      ? 'bg-emerald-800 text-ivory'
                      : 'bg-emerald-900 hover:bg-emerald-800 dark:bg-emerald-800 dark:hover:bg-emerald-700 text-ivory border border-emerald-700/40'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 text-champagne" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-champagne" />
                      <span>Add to Bag • ${(product.price * quantity).toFixed(2)}</span>
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
