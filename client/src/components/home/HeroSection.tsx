import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap, Lock, CreditCard, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HeroSection: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget, clientX, clientY } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const scrollToProducts = () => {
    const el = document.getElementById('products-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-brand-500/20 via-sky-400/15 to-transparent blur-[110px] pointer-events-none rounded-full -z-10" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-payoneer-orange/10 blur-[100px] pointer-events-none rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline & Value Prop */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200/80 dark:border-brand-800/60 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-6 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-500 animate-pulse" />
              <span>Next-Gen Payoneer Hosted Checkout Module</span>
              <span className="w-1 h-1 rounded-full bg-brand-400" />
              <span className="font-mono text-[11px] text-brand-600 dark:text-brand-400">SAQ A Certified</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6"
            >
              Checkout, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-sky-500 to-indigo-600 dark:from-brand-400 dark:via-sky-300 dark:to-indigo-300">
                reimagined.
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed mb-8"
            >
              Fast, secure, and beautifully simple payment flow engineered with the official Payoneer Hosted Checkout API. Zero credit card numbers touch your database.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 w-full sm:w-auto"
            >
              <button
                onClick={scrollToProducts}
                className="group relative inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 dark:bg-brand-500 dark:hover:bg-brand-400 text-white font-semibold text-sm shadow-glow hover:shadow-lg transition-all duration-200"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <Link
                to="/checkout"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-semibold text-sm border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-subtle transition-all duration-200"
              >
                <span>View Live Checkout</span>
              </Link>
            </motion.div>

            {/* Security Guarantee Strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-10 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-3 gap-6 w-full max-w-lg"
            >
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Zero Card Storage</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                <Lock className="w-4 h-4 text-brand-500 shrink-0" />
                <span>PCI-DSS SAQ A</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Sub-150ms Speed</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Interactive 3D Fintech Card Preview */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <motion.div
              style={{
                rotateY: mousePos.x * 18,
                rotateX: -mousePos.y * 18,
                transformStyle: 'preserve-3d',
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="relative w-full max-w-sm sm:max-w-md perspective-1000"
            >
              {/* Floating Holographic Payment Card */}
              <div className="relative rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white shadow-2xl border border-slate-700/60 overflow-hidden backdrop-blur-xl">
                {/* Card Pattern Accents */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-payoneer-orange/15 rounded-full blur-2xl -z-10 pointer-events-none" />

                {/* Card Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-500 to-sky-400 flex items-center justify-center font-bold text-white text-xs shadow-md">
                      PF
                    </div>
                    <span className="font-bold text-sm tracking-wide">PayFlow Infinite</span>
                  </div>
                  <div className="px-2.5 py-1 rounded-full bg-white/10 text-[10px] font-mono font-medium tracking-wider uppercase border border-white/10 text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Oscato Ready
                  </div>
                </div>

                {/* EMV Chip & Contactless */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-11 h-8 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-yellow-600 shadow-inner flex items-center justify-center opacity-90">
                    <div className="w-7 h-5 border border-amber-800/40 rounded-sm" />
                  </div>
                  <CreditCard className="w-6 h-6 text-white/50" />
                </div>

                {/* Card Number / Amount Preview */}
                <div className="mb-6">
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-mono mb-1">
                    Verified Total Amount
                  </div>
                  <div className="text-3xl font-extrabold font-mono tracking-tight text-white flex items-baseline gap-2">
                    <span>$172.35</span>
                    <span className="text-xs font-semibold text-brand-400">USD</span>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs">
                  <div>
                    <div className="text-[9px] uppercase tracking-wider text-slate-400 font-mono">Customer</div>
                    <div className="font-semibold text-slate-200">Jane Doe</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] uppercase tracking-wider text-slate-400 font-mono">Secured by</div>
                    <div className="font-bold text-payoneer-orange flex items-center gap-1">
                      <span>Payoneer</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-payoneer-orange" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Status Pill 1: Top Right */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 sm:-right-6 glass-panel rounded-xl px-3.5 py-2 shadow-elevated flex items-center gap-2 border border-slate-200 dark:border-slate-700/80"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div className="text-[11px]">
                  <p className="font-bold text-slate-900 dark:text-white leading-tight">Instant Token</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">HOSTED session init</p>
                </div>
              </motion.div>

              {/* Floating Status Pill 2: Bottom Left */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-4 -left-4 sm:-left-6 glass-panel rounded-xl px-3.5 py-2 shadow-elevated flex items-center gap-2 border border-slate-200 dark:border-slate-700/80"
              >
                <div className="w-6 h-6 rounded-lg bg-brand-100 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <div className="text-[11px]">
                  <p className="font-bold text-slate-900 dark:text-white leading-tight">Server-Side Math</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Zero frontend price trust</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
