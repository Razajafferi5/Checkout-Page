import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  LayoutDashboard,
  FlaskConical,
  Receipt,
  Webhook,
  ShieldCheck,
  LogOut,
  ChevronRight,
  Menu,
  X,
  CreditCard,
  FileText,
  Activity,
  History,
  Lock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InternalLayoutProps {
  children: React.ReactNode;
  activeConsole?: 'operations' | 'sandbox';
}

export const InternalLayout: React.FC<InternalLayoutProps> = ({ children, activeConsole }) => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sandboxStatus, setSandboxStatus] = useState<{
    environment: string;
    mode: string;
    isSandbox: boolean;
  } | null>(null);

  // Fetch live environment indicator
  useEffect(() => {
    let mounted = true;
    api.sandbox
      .getStatus()
      .then(res => {
        if (mounted) {
          setSandboxStatus({
            environment: res.environment,
            mode: res.mode,
            isSandbox: res.isSandbox,
          });
        }
      })
      .catch(() => {
        if (mounted) {
          setSandboxStatus({
            environment: 'MOCK_SANDBOX',
            mode: 'mock',
            isSandbox: true,
          });
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/internal/login');
  };

  const navItems = [
    {
      label: 'Operations Center',
      path: '/operations',
      icon: LayoutDashboard,
      roles: ['OPERATIONS', 'SANDBOX_ADMIN'],
    },
    {
      label: 'Sandbox Bench',
      path: '/sandbox',
      icon: FlaskConical,
      roles: ['SANDBOX_ADMIN'],
      badge: 'LAB',
    },
    {
      label: 'Live Transactions',
      path: '/operations/transactions',
      icon: Receipt,
      roles: ['OPERATIONS', 'SANDBOX_ADMIN'],
    },
    {
      label: 'Webhook Inspector',
      path: '/operations/webhooks',
      icon: Webhook,
      roles: ['OPERATIONS', 'SANDBOX_ADMIN'],
    },
    {
      label: 'Security Audit Log',
      path: '/operations/audit-logs',
      icon: History,
      roles: ['OPERATIONS', 'SANDBOX_ADMIN'],
    },
  ];

  const filteredNavItems = navItems.filter(item => !item.roles || (role && item.roles.includes(role)));

  return (
    <div className="min-h-screen bg-charcoal dark:bg-charcoal text-ivory flex flex-col md:flex-row antialiased selection:bg-champagne selection:text-charcoal">
      {/* Mobile Top App Bar */}
      <header className="md:hidden flex items-center justify-between p-4 bg-charcoal-surface border-b border-white/10 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-900 border border-champagne/40 flex items-center justify-center font-serif text-champagne text-xs font-bold shadow-subtle">
            PF
          </div>
          <div>
            <span className="font-serif text-base font-bold tracking-wide text-ivory block leading-none">
              PayFlow
            </span>
            <span className="text-[9px] font-mono uppercase tracking-widest text-champagne font-bold">
              Internal Console
            </span>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-white/5 border border-white/10 text-stone-muted hover:text-ivory"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Desktop / Responsive Sidebar */}
      <aside
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:flex md:w-72 flex-col justify-between bg-charcoal-surface border-r border-white/10 shrink-0 z-30 fixed md:sticky top-0 h-screen overflow-y-auto`}
      >
        <div className="p-6 space-y-6">
          {/* Logo & Internal Header */}
          <div className="flex items-center justify-between pb-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-900 border border-champagne/40 flex items-center justify-center font-serif text-champagne text-sm font-bold shadow-subtle">
                PF
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif text-lg font-bold tracking-wide text-ivory">
                    PayFlow
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-emerald-950 text-champagne border border-champagne/30">
                    INT
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-stone-muted">
                  Fintech Operations
                </span>
              </div>
            </div>
          </div>

          {/* Persistent Environment Indicator */}
          <div className="rounded-xl p-3.5 bg-white/5 border border-white/10 space-y-1.5">
            <span className="text-[9px] font-mono uppercase tracking-widest text-stone-muted block">
              Active Environment
            </span>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-champagne animate-pulse" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-ivory">
                  {sandboxStatus?.mode === 'payoneer' ? 'Payoneer Sandbox' : 'Mock Payment Mode'}
                </span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-champagne/20 text-champagne font-bold uppercase">
                TEST
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <span className="text-[9px] font-mono uppercase tracking-widest text-stone-muted/70 block px-3 py-1">
              Modules
            </span>
            {filteredNavItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/operations' && item.path !== '/sandbox' && location.pathname.startsWith(item.path));

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all group ${
                    isActive
                      ? 'bg-emerald-950/80 text-champagne border border-champagne/30 font-bold shadow-xs'
                      : 'text-stone-warm hover:text-ivory hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-champagne' : 'text-stone-muted group-hover:text-champagne'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-champagne text-charcoal font-bold uppercase">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Switcher Helper if user is SANDBOX_ADMIN */}
          {role === 'SANDBOX_ADMIN' && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-champagne/20 space-y-2">
              <span className="text-[9px] font-mono uppercase tracking-widest text-champagne block font-bold">
                Console Switcher
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                <button
                  onClick={() => navigate('/operations')}
                  className={`py-1.5 px-2 rounded text-[11px] text-center transition-colors cursor-pointer border ${
                    location.pathname.startsWith('/operations')
                      ? 'bg-champagne text-charcoal font-bold border-champagne'
                      : 'bg-white/5 text-stone-warm hover:bg-white/10 border-white/10'
                  }`}
                >
                  Operations
                </button>
                <button
                  onClick={() => navigate('/sandbox')}
                  className={`py-1.5 px-2 rounded text-[11px] text-center transition-colors cursor-pointer border ${
                    location.pathname.startsWith('/sandbox')
                      ? 'bg-champagne text-charcoal font-bold border-champagne'
                      : 'bg-white/5 text-stone-warm hover:bg-white/10 border-white/10'
                  }`}
                >
                  Sandbox Lab
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Strip & Logout Button */}
        <div className="p-5 border-t border-white/10 bg-charcoal/60 space-y-3">
          <div className="flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs font-bold text-ivory truncate block">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
              <span className="text-[10px] font-mono text-stone-muted truncate block">
                {user?.email}
              </span>
            </div>
            <span
              className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded shrink-0 border ${
                role === 'SANDBOX_ADMIN'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                  : 'bg-stone-warm/20 text-champagne border-champagne/30'
              }`}
            >
              {role === 'SANDBOX_ADMIN' ? 'SBX ADMIN' : 'OPERATIONS'}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-lg bg-white/5 hover:bg-red-950/40 hover:text-red-400 hover:border-red-500/30 text-stone-muted border border-white/10 font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 min-w-0 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Header Bar */}
        <div className="hidden md:flex items-center justify-between px-8 py-4 bg-charcoal border-b border-white/10 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-3 text-xs font-mono text-stone-muted">
            <span>PayFlow Internal</span>
            <span>/</span>
            <span className="text-champagne font-bold uppercase">
              {location.pathname.startsWith('/sandbox') ? 'Sandbox Testing Laboratory' : 'Operations Center'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-stone-warm text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>TLS 1.3 Certified</span>
            </div>
            <span className="text-stone-muted text-[11px]">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Page Content Body */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
};
