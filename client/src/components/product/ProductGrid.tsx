import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { QuickViewModal } from './QuickViewModal';
import { Sparkles, SlidersHorizontal } from 'lucide-react';

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
    <section id="products-grid" className="py-12">
      {/* Section Header & Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Hardware Catalog</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Available Products
          </h2>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isSelected
                    ? 'text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="categoryPill"
                    className="absolute inset-0 bg-brand-600 dark:bg-brand-500 rounded-lg -z-10 shadow-sm"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Skeletons when loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 overflow-hidden shadow-subtle flex flex-col justify-between h-[360px]"
            >
              <div className="shimmer-card rounded-xl aspect-[4/3] mb-4" />
              <div className="space-y-2">
                <div className="shimmer-card h-4 rounded w-3/4" />
                <div className="shimmer-card h-3 rounded w-1/2" />
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="shimmer-card h-6 rounded w-16" />
                <div className="shimmer-card h-8 rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Cards Grid with Framer Motion Stagger */}
      {!loading && (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence>
            {filteredProducts.map(product => (
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
