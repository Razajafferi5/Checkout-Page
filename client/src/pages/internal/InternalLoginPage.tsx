import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2, AlertCircle, KeyRound, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

export const InternalLoginPage: React.FC = () => {
  const { login, isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated, redirect to appropriate console
  React.useEffect(() => {
    if (isAuthenticated && role) {
      const redirectParam = new URLSearchParams(location.search).get('redirect');
      if (redirectParam) {
        navigate(redirectParam);
      } else {
        navigate(role === 'OPERATIONS' ? '/operations' : '/sandbox');
      }
    }
  }, [isAuthenticated, role, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please provide internal email and access password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await login(email.trim(), password);

      if (!res.success) {
        setError(res.error || 'Authentication rejected. Verify credentials.');
      }
    } catch (err: any) {
      setError('Internal server communication error.');
    } finally {
      setLoading(false);
    }
  };

  // Quick preset helper for development/testing
  const fillPreset = (presetEmail: string, presetPass: string) => {
    setEmail(presetEmail);
    setPassword(presetPass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-charcoal dark:bg-charcoal flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden text-ivory">
      {/* Background Subtle Forest Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-emerald-950/40 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md space-y-6"
      >
        {/* Header Monogram & Badges */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-champagne/30 text-champagne text-[10px] font-mono uppercase tracking-widest mb-2 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-champagne animate-pulse" />
            <span>Internal Security Perimeter</span>
          </div>

          <div className="flex items-center justify-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-900 border border-champagne/40 flex items-center justify-center font-serif text-champagne text-base font-bold shadow-subtle">
              PF
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide text-ivory">
              PayFlow Internal
            </h1>
          </div>

          <p className="text-xs font-mono text-stone-muted uppercase tracking-wider">
            Operations Center & Sandbox Bench Access
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl bg-ivory-elevated dark:bg-ivory-elevated border border-white/10 p-7 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
          {/* Subtle Gold Edge Accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-champagne to-transparent opacity-70" />

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-mono flex items-start gap-2.5 leading-relaxed"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-stone-muted block mb-1.5">
                Internal Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@payflow.internal"
                  required
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-charcoal dark:bg-charcoal border border-white/10 text-ivory placeholder-stone-muted/50 text-xs font-mono focus:outline-none focus:border-champagne transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-stone-muted block mb-1.5">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-charcoal dark:bg-charcoal border border-white/10 text-ivory placeholder-stone-muted/50 text-xs font-mono focus:outline-none focus:border-champagne transition-colors"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-ivory font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 shadow-emerald transition-all border border-emerald-700/50 disabled:opacity-50 mt-6 cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-champagne" />
                  <span>Validating Key Handshake...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <KeyRound className="w-4 h-4 text-champagne" />
                  <span>Authenticate Session</span>
                  <ArrowRight className="w-4 h-4 text-champagne" />
                </div>
              )}
            </motion.button>
          </form>

          {/* Quick Preset Selector for Evaluators & Testing */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-stone-muted block text-center">
              Quick Role Provisioning (Development / Test)
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => fillPreset('ops@payflow.internal', 'PayFlowOps2026!')}
                className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors group cursor-pointer"
              >
                <div className="flex items-center justify-between text-[11px] font-bold text-champagne mb-0.5">
                  <span>Operations</span>
                  <span className="text-[9px] px-1 rounded bg-champagne/20 text-champagne font-mono">OPS</span>
                </div>
                <span className="text-[10px] text-stone-muted block truncate">ops@payflow.internal</span>
              </button>

              <button
                type="button"
                onClick={() => fillPreset('sandbox@payflow.internal', 'PayFlowSandbox2026!')}
                className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors group cursor-pointer"
              >
                <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400 mb-0.5">
                  <span>Sandbox Admin</span>
                  <span className="text-[9px] px-1 rounded bg-emerald-500/20 text-emerald-300 font-mono">SBX</span>
                </div>
                <span className="text-[10px] text-stone-muted block truncate">sandbox@payflow.internal</span>
              </button>
            </div>
          </div>
        </div>

        {/* Security Notice Footer */}
        <div className="text-center space-y-1 text-[11px] font-mono text-stone-muted">
          <p>Restricted area. All access requests, sessions, and actions are auditable.</p>
          <p className="text-[10px] opacity-60">PayFlow Fintech Operating System v1.0.0</p>
        </div>
      </motion.div>
    </div>
  );
};
