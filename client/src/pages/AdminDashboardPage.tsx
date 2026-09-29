import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AdminStats, Order } from '../types';
import { useNotification } from '../context/NotificationContext';
import {
  DollarSign,
  ShoppingBag,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Filter,
  RefreshCw,
  Database,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const AdminDashboardPage: React.FC = () => {
  const { showNotification } = useNotification();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');

  const loadData = async () => {
    try {
      setRefreshing(true);
      const [statsData, ordersData] = await Promise.all([
        api.getAdminStats(),
        api.getAdminOrders(filterStatus, search),
      ]);
      setStats(statsData);
      setOrders(ordersData.orders);
    } catch (err) {
      console.error('Failed to load admin data', err);
      showNotification('error', 'Failed to fetch admin stats');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filterStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleSeed = async () => {
    try {
      await api.triggerSeed();
      showNotification('success', 'Sample product catalog seeded into MongoDB!');
      loadData();
    } catch {
      showNotification('error', 'Seeding failed');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
      case 'COMPLETED':
      case 'PROCESSING':
        return 'bg-emerald-900/10 dark:bg-emerald-950/60 text-emerald-900 dark:text-champagne border-emerald-900/20 dark:border-champagne/30';
      case 'PENDING':
      case 'PENDING_PAYMENT':
        return 'bg-champagne-pale dark:bg-champagne/10 text-champagne-dark dark:text-champagne border-champagne/30';
      case 'FAILED':
      case 'PAYMENT_FAILED':
        return 'bg-rose-500/10 text-rose-800 dark:text-rose-400 border-rose-500/20';
      case 'CANCELLED':
        return 'bg-stone-warm/50 dark:bg-white/5 text-charcoal/70 dark:text-ivory/70 border-stone-muted dark:border-white/10';
      default:
        return 'bg-stone-warm/50 dark:bg-white/5 text-charcoal/70 dark:text-ivory/70 border-stone-muted dark:border-white/10';
    }
  };

  return (
    <div className="py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-warm/80 dark:border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-charcoal dark:text-ivory">
              Treasury & Operations
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-900/10 dark:bg-emerald-950/60 text-emerald-900 dark:text-champagne border border-emerald-900/20 dark:border-champagne/30">
              Live Ledger
            </span>
          </div>
          <p className="text-xs text-charcoal/60 dark:text-ivory/60 mt-1 font-sans">
            Real-time analytics for order flow, Payoneer checkout settlements, and liquidity.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSeed}
            className="px-4 py-2 rounded-full border border-stone-muted dark:border-white/20 bg-ivory dark:bg-ivory-elevated hover:bg-stone-warm dark:hover:bg-white/10 text-charcoal dark:text-ivory font-medium text-xs flex items-center gap-1.5 transition-colors shadow-subtle"
            title="Seed sample products into database"
          >
            <Database className="w-3.5 h-3.5 text-charcoal/50 dark:text-ivory/50" />
            <span>Seed DB</span>
          </button>

          <button
            onClick={loadData}
            disabled={refreshing}
            className="px-4 py-2 rounded-full border border-stone-muted dark:border-white/20 bg-ivory dark:bg-ivory-elevated hover:bg-stone-warm dark:hover:bg-white/10 text-charcoal dark:text-ivory font-medium text-xs flex items-center gap-1.5 transition-colors shadow-subtle"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <Link
            to="/admin/payments"
            className="px-5 py-2 rounded-full bg-emerald-800 hover:bg-emerald-700 text-ivory font-semibold text-xs flex items-center gap-1.5 shadow-elevated transition-all"
          >
            <span>Debug Bench</span>
            <ExternalLink className="w-3.5 h-3.5 text-champagne" />
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="rounded-2xl bg-ivory dark:bg-ivory-dark border border-stone-warm/80 dark:border-white/10 p-5 shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-stone-warm/60 dark:bg-white/5 text-charcoal dark:text-ivory flex items-center justify-center shrink-0 border border-stone-muted dark:border-white/10">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-charcoal/50 dark:text-ivory/50 uppercase tracking-wider block">
              Total Orders
            </span>
            <span className="text-2xl font-black text-charcoal dark:text-ivory font-mono">
              {loading ? '...' : stats?.totalOrders || 0}
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-ivory dark:bg-ivory-dark border border-stone-warm/80 dark:border-white/10 p-5 shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-900/10 dark:bg-emerald-950/60 text-emerald-900 dark:text-champagne flex items-center justify-center shrink-0 border border-emerald-900/20 dark:border-champagne/30">
            <CheckCircle2 className="w-6 h-6 text-champagne-dark dark:text-champagne" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-charcoal/50 dark:text-ivory/50 uppercase tracking-wider block">
              Settled / Captured
            </span>
            <span className="text-2xl font-black text-emerald-900 dark:text-champagne font-mono">
              {loading ? '...' : stats?.successfulPayments || 0}
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-ivory dark:bg-ivory-dark border border-stone-warm/80 dark:border-white/10 p-5 shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-champagne-pale dark:bg-champagne/10 text-champagne-dark dark:text-champagne flex items-center justify-center shrink-0 border border-champagne/30">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-charcoal/50 dark:text-ivory/50 uppercase tracking-wider block">
              Pending Session
            </span>
            <span className="text-2xl font-black text-champagne-dark dark:text-champagne font-mono">
              {loading ? '...' : stats?.pendingPayments || 0}
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-ivory dark:bg-ivory-dark border border-stone-warm/80 dark:border-white/10 p-5 shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-700 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/20">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-charcoal/50 dark:text-ivory/50 uppercase tracking-wider block">
              Declined
            </span>
            <span className="text-2xl font-black text-rose-700 dark:text-rose-400 font-mono">
              {loading ? '...' : stats?.failedPayments || 0}
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-ivory dark:bg-ivory-dark border border-stone-warm/80 dark:border-white/10 p-5 shadow-subtle flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-950 text-champagne flex items-center justify-center shrink-0 border border-champagne/40">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-charcoal/50 dark:text-ivory/50 uppercase tracking-wider block">
              Gross Volume
            </span>
            <span className="text-2xl font-black text-charcoal dark:text-ivory font-mono">
              ${loading ? '...' : (stats?.totalRevenue || 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl bg-ivory dark:bg-ivory-dark border border-stone-warm/80 dark:border-white/10 shadow-subtle p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-xs font-semibold text-charcoal/50 dark:text-ivory/50 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </span>
          {['ALL', 'PAID', 'PENDING', 'FAILED', 'CANCELLED'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filterStatus === st
                  ? 'bg-emerald-800 text-ivory shadow-xs'
                  : 'bg-stone-warm/50 dark:bg-white/5 text-charcoal/70 dark:text-ivory/70 hover:text-charcoal dark:hover:text-ivory'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-charcoal/40 dark:text-ivory/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search order #, customer email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-full border border-stone-muted dark:border-white/20 bg-stone-warm/30 dark:bg-white/5 text-xs text-charcoal dark:text-ivory placeholder-charcoal/40 dark:placeholder-ivory/40 focus:outline-none focus:ring-1 focus:ring-champagne focus:border-champagne"
          />
        </form>
      </div>

      {/* Transactions Table */}
      <div className="rounded-3xl bg-ivory dark:bg-ivory-dark border border-stone-warm/80 dark:border-white/10 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-charcoal/80 dark:text-ivory/80">
            <thead className="bg-stone-warm/30 dark:bg-white/5 border-b border-stone-warm/80 dark:border-white/10 text-[10px] font-mono font-bold text-charcoal/50 dark:text-ivory/50 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Order ID</th>
                <th className="py-3.5 px-5">Customer</th>
                <th className="py-3.5 px-5">Amount</th>
                <th className="py-3.5 px-5">Currency</th>
                <th className="py-3.5 px-5">Payment Status</th>
                <th className="py-3.5 px-5">Order Status</th>
                <th className="py-3.5 px-5">Timestamp</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-warm/60 dark:divide-white/5">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-charcoal/40 dark:text-ivory/40 font-mono">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              ) : (
                orders.map(o => (
                  <tr key={o._id} className="hover:bg-stone-warm/30 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-5 font-mono font-bold text-charcoal dark:text-ivory">
                      {o.orderNumber}
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-charcoal dark:text-ivory">
                        {o.customer.firstName} {o.customer.lastName}
                      </div>
                      <div className="text-[11px] text-charcoal/50 dark:text-ivory/50">{o.customer.email}</div>
                    </td>
                    <td className="py-3.5 px-5 font-extrabold text-charcoal dark:text-ivory font-mono">
                      ${o.total.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-5 font-mono text-charcoal/50 dark:text-ivory/50">{o.currency}</td>
                    <td className="py-3.5 px-5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${getStatusBadge(
                          o.paymentStatus
                        )}`}
                      >
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 font-medium text-charcoal/80 dark:text-ivory/80">{o.status}</td>
                    <td className="py-3.5 px-5 text-charcoal/50 dark:text-ivory/50 font-mono text-[11px]">
                      {new Date(o.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <Link
                        to={`/checkout/confirmation?orderNumber=${o.orderNumber}`}
                        className="text-emerald-900 dark:text-champagne hover:underline font-semibold font-mono text-[11px]"
                      >
                        View Receipt
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
