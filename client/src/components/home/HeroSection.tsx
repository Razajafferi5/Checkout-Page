import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Lock, Sparkles, RefreshCw, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HeroSection: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isFlipped, setIsFlipped] = useState(false);

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
    const el = document.getElementById('editorial-store');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToArchitecture = () => {
    const el = document.getElementById('editorial-architecture');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 bg-grain"
    >
      {/* Editorial Soft Forest Radial Gradient (No Blue/Purple Blobs) */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-900/5 dark:bg-emerald-700/10 blur-[120px] pointer-events-none rounded-full -z-10" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[300px] bg-champagne/10 blur-[100px] pointer-events-none rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Value Prop */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Minimal Editorial Pill */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-warm/80 dark:bg-ivory-elevated border border-stone-muted/40 dark:border-white/10 text-charcoal dark:text-champagne-light text-xs font-mono tracking-widest uppercase mb-6 shadow-xs"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-800 dark:bg-champagne animate-pulse" />
              <span>Payment, Refined.</span>
            </motion.div>

            {/* Editorial Heading with Serif Accent */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-sans font-bold tracking-tight text-charcoal dark:text-ivory leading-[1.08] mb-6"
            >
              Checkout, <br />
              <span className="font-serif italic font-normal text-emerald-800 dark:text-champagne">
                reimagined.
              </span>
            </motion.h1>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="text-base sm:text-lg text-charcoal-muted dark:text-stone-muted max-w-xl leading-relaxed mb-8"
            >
              An effortless payment experience designed for modern commerce. Engineered with official Payoneer Hosted Checkout orchestration and zero-trust mathematical integrity.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 w-full sm:w-auto"
            >
              <button
                onClick={scrollToProducts}
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 dark:bg-emerald-800 dark:hover:bg-emerald-700 text-ivory font-semibold text-xs uppercase tracking-wider shadow-emerald transition-all duration-200 border border-emerald-700/40"
              >
                <span>Explore Store</span>
                <ArrowRight className="w-3.5 h-3.5 text-champagne group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={scrollToArchitecture}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-transparent text-charcoal dark:text-ivory font-semibold text-xs uppercase tracking-wider border border-stone-warm dark:border-white/15 hover:border-champagne dark:hover:border-champagne transition-all duration-200"
              >
                <span>How It Works</span>
              </button>
            </motion.div>

            {/* Subtle Editorial Metrics Strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-12 pt-6 border-t border-stone-warm dark:border-white/10 grid grid-cols-3 gap-6 w-full max-w-lg"
            >
              <div>
                <p className="font-serif text-2xl font-bold text-charcoal dark:text-ivory">0%</p>
                <p className="text-[11px] font-mono uppercase tracking-wider text-charcoal-muted dark:text-stone-muted mt-0.5">
                  PAN Ingestion
                </p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-charcoal dark:text-ivory">8.25%</p>
                <p className="text-[11px] font-mono uppercase tracking-wider text-charcoal-muted dark:text-stone-muted mt-0.5">
                  Server Tax Logic
                </p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-charcoal dark:text-ivory">SAQ-A</p>
                <p className="text-[11px] font-mono uppercase tracking-wider text-charcoal-muted dark:text-stone-muted mt-0.5">
                  PCI Compliant
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Luxury Interactive 3D Flip Card */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <motion.div
              style={{
                rotateY: mousePos.x * 14,
                rotateX: -mousePos.y * 14,
                transformStyle: 'preserve-3d',
              }}
              transition={{ type: 'spring', stiffness: 220, damping: 25 }}
              className="relative w-full max-w-sm sm:max-w-md perspective-1000 cursor-pointer select-none"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              {/* Card Container with 3D Flip */}
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                style={{ transformStyle: 'preserve-3d' }}
                className="relative rounded-2xl p-7 sm:p-8 bg-emerald-950 text-ivory shadow-2xl border border-champagne/30 overflow-hidden min-h-[250px]"
              >
                {/* Subtle Luxury Card Accents */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-champagne/5 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-emerald-800/20 rounded-full blur-2xl pointer-events-none" />

                {/* FRONT FACE */}
                <div style={{ backfaceVisibility: 'hidden' }} className={isFlipped ? 'opacity-0' : 'opacity-100'}>
                  {/* Top Monogram & Issuer */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-md bg-emerald-900 border border-champagne/40 flex items-center justify-center font-serif text-champagne text-xs font-bold">
                        PF
                      </div>
                      <span className="font-serif tracking-wider text-sm font-semibold text-ivory">
                        PayFlow Reserve
                      </span>
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-champagne border border-champagne/30 px-2 py-0.5 rounded">
                      Secured
                    </span>
                  </div>

                  {/* EMV Chip & Contactless */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-10 h-7 rounded bg-gradient-to-br from-champagne-light via-champagne to-champagne-dark border border-champagne-dark/40 shadow-inner flex items-center justify-center">
                      <div className="w-6 h-4 border border-charcoal/20 rounded-xs" />
                    </div>
                    <span className="text-[10px] font-mono text-stone-muted uppercase tracking-wider">
                      Click to Flip
                    </span>
                  </div>

                  {/* Amount / Balance */}
                  <div className="mb-6">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-stone-muted block mb-1">
                      Authorized Total
                    </span>
                    <div className="font-mono text-3xl font-extrabold text-ivory tracking-tight flex items-baseline gap-2">
                      <span>$249.99</span>
                      <span className="text-xs font-semibold text-champagne">USD</span>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs">
                    <div>
                      <span className="text-[9px] font-mono uppercase tracking-widest text-stone-muted block">
                        Customer
                      </span>
                      <span className="font-medium text-ivory">Jane Doe</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-stone-muted block">
                        Network
                      </span>
                      <span className="font-mono font-bold text-champagne text-[11px]">
                        PAYONEER HOSTED
                      </span>
                    </div>
                  </div>
                </div>

                {/* BACK FACE (Shows on Flip) */}
                <div
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                  className={`absolute inset-0 p-7 sm:p-8 flex flex-col justify-between ${
                    isFlipped ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="w-full h-8 bg-charcoal -mx-8 mt-2 opacity-80" />
                  <div className="space-y-2 py-4">
                    <div className="flex justify-between items-center text-[10px] font-mono text-champagne">
                      <span>CVV / TOKEN: ENCRYPTED</span>
                      <span>SAQ-A</span>
                    </div>
                    <div className="p-3 bg-emerald-900/60 rounded-lg border border-champagne/20 text-xs font-mono text-stone-warm">
                      <p className="text-[11px] leading-relaxed">
                        Hosted API Protocol: Oscato REST LIST session with Basic Auth handshake.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-muted border-t border-white/10 pt-3">
                    <span>Click again to return</span>
                    <span className="text-champagne font-bold">256-BIT TLS</span>
                  </div>
                </div>
              </motion.div>

              {/* Floating Parallax Badges (Emerald & Champagne Style) */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-3 -right-3 sm:-right-4 editorial-glass rounded-xl px-3.5 py-1.5 shadow-subtle border border-stone-warm dark:border-white/15 flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-800 dark:bg-champagne" />
                <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-charcoal dark:text-ivory">
                  Protected
                </span>
              </motion.div>

              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-3 -left-3 sm:-left-4 editorial-glass rounded-xl px-3.5 py-1.5 shadow-subtle border border-stone-warm dark:border-white/15 flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-champagne" />
                <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-charcoal dark:text-ivory">
                  Sub-150ms
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
