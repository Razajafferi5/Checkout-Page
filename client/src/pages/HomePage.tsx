import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { api } from '../services/api';
import { HeroSection } from '../components/home/HeroSection';
import { ProductGrid } from '../components/product/ProductGrid';
import { ShieldCheck, Zap, Globe, Lock, ArrowRight, CheckCircle2, Award, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
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
      {/* Interactive Fintech Hero */}
      <HeroSection />

      {/* Featured Architecture Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ y: -4 }}
          className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-subtle flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
              Zero PAN / CVV Storage
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Customers complete card payments directly within Payoneer's PCI-DSS Level 1 certified hosted environment. Zero sensitive cardholder data is stored on our servers.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[11px] font-semibold text-brand-600 dark:text-brand-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>SAQ A Compliance Eligible</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-subtle flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
              Zero-Trust Mathematical Engine
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Product prices, taxes (8.25%), discounts, and shipping tiers are validated and computed strictly on the backend. Frontend prices are never trusted.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Tamper-Proof Calculations</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-subtle flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
              Provider Pattern & Mock Mode
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Instantly toggle between isolated Mock Sandbox simulation and official Payoneer Hosted Checkout via a single environment variable (`PAYMENT_MODE`).
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Offline Demo Ready</span>
          </div>
        </motion.div>
      </section>

      {/* Main Catalog Section */}
      <ProductGrid products={products} loading={loading} />
    </div>
  );
};
