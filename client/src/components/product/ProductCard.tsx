import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, Eye } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';
import { ProductImage } from '../common/ProductImage';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  featured?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView, featured = false }) => {
  const { addToCart } = useCart();
  const { showNotification } = useNotification();
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdding(true);
    showNotification('success', `${product.name} added to bag`, `$${product.price.toFixed(2)} USD`);

    setTimeout(() => {
      setIsAdding(false);
    }, 700);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      onClick={() => onQuickView(product)}
      className={`group relative rounded-2xl bg-ivory-light dark:bg-ivory-elevated border border-stone-warm dark:border-white/10 hover:border-champagne/80 dark:hover:border-champagne/80 overflow-hidden shadow-subtle hover:shadow-elevated transition-all duration-300 flex flex-col justify-between cursor-pointer ${
        featured ? 'md:col-span-2 md:row-span-2' : ''
      }`}
    >
      {/* Product Image Area */}
      <div className={`relative bg-stone-warm/30 dark:bg-ivory-dark/40 p-6 flex items-center justify-center overflow-hidden ${
        featured ? 'min-h-[280px] md:min-h-[380px]' : 'aspect-[4/3]'
      }`}>
        {/* Category Pill */}
        <span className="absolute top-4 left-4 px-2.5 py-1 rounded text-[9px] font-mono font-bold uppercase tracking-widest bg-ivory dark:bg-emerald-950 text-charcoal-muted dark:text-stone-muted border border-stone-warm dark:border-white/10 z-10">
          {product.category}
        </span>

        {/* Product Image */}
        <ProductImage
          src={product.image}
          alt={product.name}
          category={product.category}
          className={`object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-500 ease-out ${
            featured ? 'max-h-64 md:max-h-80' : 'max-h-40'
          }`}
          loading="eager"
        />

        {/* Editorial Quick View Overlay */}
        <div className="absolute inset-0 bg-charcoal/20 dark:bg-black/30 backdrop-blur-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-ivory dark:bg-ivory-elevated text-charcoal dark:text-ivory text-xs font-mono uppercase tracking-wider font-semibold shadow-subtle transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200 border border-stone-warm dark:border-white/10">
            <Eye className="w-3.5 h-3.5 text-champagne" />
            Quick View
          </span>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className={`font-serif font-bold text-charcoal dark:text-ivory group-hover:text-emerald-800 dark:group-hover:text-champagne transition-colors ${
              featured ? 'text-xl sm:text-2xl' : 'text-base'
            }`}>
              {product.name}
            </h3>
          </div>
          <p className="text-xs text-charcoal-muted dark:text-stone-muted line-clamp-2 leading-relaxed mb-4">
            {product.description}
          </p>
        </div>

        {/* Price & Add Action */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-warm/80 dark:border-white/10">
          <div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-charcoal-muted dark:text-stone-muted block">
              Price
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-mono text-lg sm:text-xl font-bold text-charcoal dark:text-ivory">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-[10px] font-mono text-charcoal-muted dark:text-stone-muted">USD</span>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={handleAdd}
            disabled={isAdding || product.stock === 0}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold transition-all duration-200 border ${
              isAdding
                ? 'bg-emerald-800 text-ivory border-emerald-700'
                : 'bg-emerald-900 dark:bg-emerald-800 text-ivory hover:bg-emerald-800 dark:hover:bg-emerald-700 border-emerald-700/40 shadow-xs'
            }`}
          >
            {isAdding ? (
              <>
                <Check className="w-3.5 h-3.5 text-champagne" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 text-champagne" />
                <span>Add</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
