import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Menu, X, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const Navbar: React.FC = () => {
  const { itemCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-sky-400 flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                  PayFlow
                </span>
                <span className="text-[10px] tracking-widest font-semibold uppercase text-slate-600 -mt-1">
                  Payoneer Checkout
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-1">
              <Link
                to="/"
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/')
                    ? 'text-brand-700 bg-brand-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                Storefront
              </Link>
              <Link
                to="/checkout"
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/checkout')
                    ? 'text-brand-700 bg-brand-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                Checkout Demo
              </Link>
              <Link
                to="/admin"
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/admin')
                    ? 'text-brand-700 bg-brand-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                Admin Dashboard
              </Link>
              <Link
                to="/admin/payments"
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/admin/payments')
                    ? 'text-brand-700 bg-brand-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                Debug Bench
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300 text-slate-700 transition-all hover:shadow-sm"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-brand-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-in zoom-in-75">
                  {itemCount}
                </span>
              )}
            </button>

            <Link
              to="/checkout"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all hover:shadow"
            >
              <span>Instant Checkout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Storefront
          </Link>
          <Link
            to="/checkout"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Checkout Demo
          </Link>
          <Link
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Admin Dashboard
          </Link>
          <Link
            to="/admin/payments"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Debug Bench
          </Link>
        </div>
      )}
    </header>
  );
};
