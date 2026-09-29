import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { QuickViewModal } from './QuickViewModal';

interface ProductGridProps {
  products: Product[];
  loading: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, loading }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <section id="editorial-store" className="py-12 sm:py-16">
      {/* Editorial Section Header & Text Filter Navigation */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-stone-warm dark:border-white/10">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-800 dark:text-champagne font-bold block mb-1">
            Curated Hardware Collection
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-charcoal dark:text-ivory">
            The Catalog
          </h2>
        </div>

        {/* Category Text Filters with Animated Gold Underline */}
        <div className="flex flex-wrap items-center gap-6 sm:gap-8">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`relative pb-1.5 text-xs font-mono uppercase tracking-wider font-semibold transition-colors duration-200 ${
                  isSelected
                    ? 'text-emerald-900 dark:text-champagne'
                    : 'text-charcoal-muted dark:text-stone-muted hover:text-charcoal dark:hover:text-white'
                }`}
              >
                {cat}
                {isSelected && (
                  <motion.div
                    layoutId="categoryGoldUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-champagne"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Editorial Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl editorial-glass p-6 min-h-[320px] flex flex-col justify-between">
              <div className="editorial-shimmer rounded-xl aspect-[4/3] mb-4" />
              <div className="space-y-2">
                <div className="editorial-shimmer h-5 rounded w-2/3" />
                <div className="editorial-shimmer h-3.5 rounded w-1/2" />
              </div>
              <div className="pt-4 border-t border-stone-warm/80 dark:border-white/10 flex items-center justify-between">
                <div className="editorial-shimmer h-5 rounded w-16" />
                <div className="editorial-shimmer h-8 rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Symmetrical Balanced Product Grid */}
      {!loading && (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onQuickView={p => setQuickViewProduct(p)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </section>
  );
};
