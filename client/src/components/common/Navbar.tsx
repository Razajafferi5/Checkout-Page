import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Sun, Moon, Shield, Menu, X, ArrowUpRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Store', path: '/' },
    { label: 'Checkout', path: '/checkout' },
    { label: 'Operations', path: '/admin' },
    { label: 'Sandbox Bench', path: '/admin/payments' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'editorial-glass shadow-subtle py-3 border-b border-stone-warm dark:border-white/10'
          : 'bg-transparent py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo with Stylized P+F Monogram in Emerald & Champagne */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-9 h-9 rounded-lg bg-emerald-900 dark:bg-emerald-800 flex items-center justify-center text-champagne shadow-sm border border-champagne/30"
            >
              {/* Stylized P+F Monogram SVG */}
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                {/* P curve */}
                <path d="M7 20V5h6a4 4 0 0 1 0 8H7" className="text-champagne" />
                {/* F crossbar */}
                <path d="M11 9h5" className="text-champagne-light opacity-90" />
              </svg>
            </motion.div>

            <div className="flex flex-col">
              <span className="font-serif text-xl tracking-tight text-charcoal dark:text-ivory font-bold">
                PAY<span className="text-emerald-800 dark:text-champagne font-sans font-extrabold text-lg tracking-wider">FLOW</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest font-mono text-charcoal-muted dark:text-stone-muted -mt-1 hidden sm:block">
                Payoneer Orchestration
              </span>
            </div>
          </Link>

          {/* Navigation Links - Editorial Minimal Style */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative text-xs uppercase tracking-wider font-semibold py-1 transition-colors duration-200 ${
                    isActive
                      ? 'text-emerald-800 dark:text-champagne'
                      : 'text-charcoal-muted dark:text-stone-muted hover:text-charcoal dark:hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-champagne"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions: Theme Toggle + Cart Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-lg text-charcoal-muted dark:text-stone-muted hover:text-charcoal dark:hover:text-white hover:bg-stone-warm/50 dark:hover:bg-ivory-dark transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-champagne" /> : <Moon className="w-4 h-4 text-emerald-900" />}
            </motion.button>

            {/* Cart Trigger */}
            <motion.button
              whileTap={{ scale: 0.94 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2.5 px-4 py-2 rounded-lg bg-emerald-900 hover:bg-emerald-800 dark:bg-emerald-800 dark:hover:bg-emerald-700 text-ivory text-xs font-semibold shadow-emerald transition-all duration-200 border border-emerald-700/40"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-champagne" />
              <span className="uppercase tracking-wider text-[11px] font-mono">Bag</span>

              <AnimatePresence mode="wait">
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="flex items-center justify-center min-w-[17px] h-[17px] px-1 text-[10px] font-mono font-bold rounded-full bg-champagne text-charcoal"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-charcoal dark:text-white md:hidden hover:bg-stone-warm dark:hover:bg-ivory-dark"
              aria-label="Open Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden mt-3 pt-3 border-t border-stone-warm dark:border-white/10"
            >
              <div className="flex flex-col gap-1 pb-3">
                {navLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold ${
                      location.pathname === link.path
                        ? 'bg-emerald-900 text-champagne'
                        : 'text-charcoal dark:text-ivory hover:bg-stone-warm dark:hover:bg-ivory-dark'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
