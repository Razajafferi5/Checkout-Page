import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { api } from '../services/api';
import { ProductGrid } from '../components/product/ProductGrid';
import { ShieldCheck, Zap, Globe, Lock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    <div className="space-y-16 py-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-brand-950 text-white p-8 md:p-14 shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-brand-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Enterprise Payoneer Checkout Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Next-Gen Fintech Store & <br />
            <span className="bg-gradient-to-r from-brand-300 via-sky-300 to-white bg-clip-text text-transparent">
              Payoneer Sandbox Checkout
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            Experience a frictionless, PCI-DSS Level 1 compliant checkout built with MERN stack,
            server-side financial calculations, and official Payoneer Hosted Payment orchestration.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/checkout"
              className="px-6 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-lg shadow-brand-500/25 transition-all flex items-center gap-2"
            >
              <span>Test Checkout Flow</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/admin"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/10 backdrop-blur-md transition-all"
            >
              <span>View Admin Dashboard</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-white/10">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">Instant Session</p>
              <p className="text-[11px] text-slate-400">REST LIST Handshake</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-sky-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">Multi-Currency</p>
              <p className="text-[11px] text-slate-400">Global settlement ready</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">Zero PAN Storage</p>
              <p className="text-[11px] text-slate-400">Full hosted compliance</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-brand-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">Dual Verification</p>
              <p className="text-[11px] text-slate-400">GET status & webhooks</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">Featured Products</h2>
            <p className="text-xs text-slate-500 mt-1">
              Select items below and test the complete Payoneer checkout pipeline.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Showing {products.length} catalog items
          </span>
        </div>

        <ProductGrid products={products} loading={loading} />
      </section>
    </div>
  );
};
