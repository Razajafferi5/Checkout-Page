import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { ShieldAlert, ArrowLeft, Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading, role } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal dark:bg-charcoal flex flex-col items-center justify-center p-6 text-ivory">
        <Loader2 className="w-8 h-8 animate-spin text-champagne mb-4" />
        <span className="font-mono text-xs uppercase tracking-widest text-stone-muted">
          Authenticating Internal Session...
        </span>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    // Redirect to internal login preserving intended destination
    return <Navigate to={`/internal/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Check role authorization
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    const fallbackPath = role === 'OPERATIONS' ? '/operations' : '/sandbox';

    return (
      <div className="min-h-screen bg-charcoal-dark dark:bg-charcoal-dark flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-2xl bg-charcoal dark:bg-charcoal-surface border border-red-500/30 p-8 shadow-2xl text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto shadow-subtle">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-bold block">
              403 • Unauthorized Access
            </span>
            <h2 className="font-serif text-2xl font-bold text-ivory">Access Restricted</h2>
            <p className="text-xs font-mono text-stone-muted leading-relaxed">
              Your role <strong className="text-champagne font-bold">{role}</strong> does not have authorization to access this internal console.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to={fallbackPath}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-ivory font-mono text-xs uppercase tracking-wider font-semibold transition-colors border border-emerald-700/40 shadow-emerald"
            >
              <ArrowLeft className="w-4 h-4 text-champagne" />
              <span>Go to {role === 'OPERATIONS' ? 'Operations Center' : 'Sandbox Bench'}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
