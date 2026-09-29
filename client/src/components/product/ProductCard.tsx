import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, Eye, ShieldCheck, Zap } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const { showNotification } = useNotification();
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdding(true);
    showNotification('success', `${product.name} added to cart`, `$${product.price.toFixed(2)} USD`);

    setTimeout(() => {
      setIsAdding(false);
    }, 700);
  };

  const isLowStock = product.stock <= 35;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      onClick={() => onQuickView(product)}
      className="group relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-subtle hover:shadow-elevated transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      {/* Top Media Area */}
      <div className="relative aspect-[4/3] bg-gradient-to-b from-slate-50 to-slate-100/70 dark:from-slate-800/40 dark:to-slate-900 p-6 flex items-center justify-center overflow-hidden">
        {/* Subtle Category Pill */}
        <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-white/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700/70 backdrop-blur-sm z-10">
          {product.category}
        </span>

        {/* Stock warning pill if low stock */}
        {isLowStock && (
          <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 z-10 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />
            Only {product.stock} left
          </span>
        )}

        {/* Product Image */}
        <motion.img
          src={product.image}
          alt={product.name}
          className="max-h-40 max-w-full object-contain drop-shadow-md group-hover:scale-108 transition-transform duration-500 ease-out"
        />

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-semibold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-200">
            <Eye className="w-3.5 h-3.5 text-brand-500" />
            Quick View
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1.5 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
            {product.description}
          </p>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Price
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-extrabold text-slate-900 dark:text-white font-mono">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-[10px] font-semibold text-slate-400">USD</span>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleAdd}
            disabled={isAdding || product.stock === 0}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              isAdding
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-brand-600 dark:bg-slate-800 dark:hover:bg-brand-500 text-white shadow-sm hover:shadow-glow'
            }`}
          >
            {isAdding ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
