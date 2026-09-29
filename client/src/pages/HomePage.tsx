import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { api } from '../services/api';
import { HeroSection } from '../components/home/HeroSection';
import { ProductGrid } from '../components/product/ProductGrid';
import { ShieldCheck, Zap, Lock, RefreshCw, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getProducts()
      .then(data => setProducts(data))
      .catch(err => console.error('Failed to load products', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-12 pb-16">
      {/* Interactive Editorial Fintech Hero */}
      <HeroSection />

      {/* Featured Architecture Cards */}
      <section id="editorial-architecture" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ y: -4 }}
          className="rounded-2xl p-7 bg-ivory dark:bg-ivory-dark border border-stone-warm/80 dark:border-white/10 shadow-subtle flex flex-col justify-between transition-shadow hover:shadow-elevated"
        >
          <div>
            <div className="w-11 h-11 rounded-xl bg-emerald-900/10 dark:bg-emerald-950/60 text-emerald-800 dark:text-champagne flex items-center justify-center mb-5 border border-emerald-900/15 dark:border-champagne/20">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-charcoal dark:text-ivory mb-2">
              Zero PAN / CVV Storage
            </h3>
            <p className="text-xs text-charcoal/70 dark:text-ivory/60 leading-relaxed font-sans">
              Card transactions resolve directly within Payoneer's PCI-DSS Level 1 certified hosted vault. No sensitive cardholder numbers ever touch our servers.
            </p>
          </div>
          <div className="pt-4 mt-5 border-t border-stone-warm/80 dark:border-white/10 flex items-center gap-2 text-[11px] font-semibold text-emerald-800 dark:text-champagne font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-champagne-dark dark:text-champagne" />
            <span>SAQ A Compliance Eligible</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="rounded-2xl p-7 bg-ivory dark:bg-ivory-dark border border-stone-warm/80 dark:border-white/10 shadow-subtle flex flex-col justify-between transition-shadow hover:shadow-elevated"
        >
          <div>
            <div className="w-11 h-11 rounded-xl bg-champagne-pale dark:bg-champagne/10 text-champagne-dark dark:text-champagne flex items-center justify-center mb-5 border border-champagne/30">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-charcoal dark:text-ivory mb-2">
              Zero-Trust Pricing Engine
            </h3>
            <p className="text-xs text-charcoal/70 dark:text-ivory/60 leading-relaxed font-sans">
              Unit prices, sales tax calculations (8.25%), tiered shipping rates, and discounts are computed strictly in verified server memory.
            </p>
          </div>
          <div className="pt-4 mt-5 border-t border-stone-warm/80 dark:border-white/10 flex items-center gap-2 text-[11px] font-semibold text-emerald-800 dark:text-champagne font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-champagne-dark dark:text-champagne" />
            <span>Tamper-Proof Ledger</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="rounded-2xl p-7 bg-ivory dark:bg-ivory-dark border border-stone-warm/80 dark:border-white/10 shadow-subtle flex flex-col justify-between transition-shadow hover:shadow-elevated"
        >
          <div>
            <div className="w-11 h-11 rounded-xl bg-stone-warm/60 dark:bg-white/5 text-charcoal dark:text-ivory flex items-center justify-center mb-5 border border-stone-muted dark:border-white/10">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-charcoal dark:text-ivory mb-2">
              Provider Abstraction
            </h3>
            <p className="text-xs text-charcoal/70 dark:text-ivory/60 leading-relaxed font-sans">
              Instantly toggle between isolated Mock Sandbox simulation and official Payoneer Hosted Checkout via environment configuration.
            </p>
          </div>
          <div className="pt-4 mt-5 border-t border-stone-warm/80 dark:border-white/10 flex items-center gap-2 text-[11px] font-semibold text-emerald-800 dark:text-champagne font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-champagne-dark dark:text-champagne" />
            <span>Instant Sandbox Mode</span>
          </div>
        </motion.div>
      </section>

      {/* Main Catalog Section */}
      <ProductGrid products={products} loading={loading} />
    </div>
  );
};
