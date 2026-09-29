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
} from 'lucide-react';
import { Link } from 'react-router-dom';

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
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'PENDING':
      case 'PENDING_PAYMENT':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'FAILED':
      case 'PAYMENT_FAILED':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'CANCELLED':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Operations & Transactions
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white">
              Executive View
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time analytics for orders, Payoneer checkout settlements, and system state.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSeed}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
            title="Seed sample products into database"
          >
            <Database className="w-3.5 h-3.5 text-slate-500" />
            <span>Seed DB</span>
          </button>

          <button
            onClick={loadData}
            disabled={refreshing}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <Link
            to="/admin/payments"
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <span>Debug Bench</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Orders
            </span>
            <span className="text-2xl font-black text-slate-900">
              {loading ? '...' : stats?.totalOrders || 0}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Paid / Captured
            </span>
            <span className="text-2xl font-black text-emerald-600">
              {loading ? '...' : stats?.successfulPayments || 0}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Pending
            </span>
            <span className="text-2xl font-black text-amber-600">
              {loading ? '...' : stats?.pendingPayments || 0}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Failed / Declined
            </span>
            <span className="text-2xl font-black text-rose-600">
              {loading ? '...' : stats?.failedPayments || 0}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-brand-400 flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Gross Revenue
            </span>
            <span className="text-2xl font-black text-slate-900">
              ${loading ? '...' : (stats?.totalRevenue || 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-xs font-semibold text-slate-500 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </span>
          {['ALL', 'PAID', 'PENDING', 'FAILED', 'CANCELLED'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search order #, customer email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </form>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
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
            <tbody className="divide-y divide-slate-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              ) : (
                orders.map(o => (
                  <tr key={o._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-5 font-mono font-bold text-slate-900">
                      {o.orderNumber}
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-slate-800">
                        {o.customer.firstName} {o.customer.lastName}
                      </div>
                      <div className="text-[11px] text-slate-400">{o.customer.email}</div>
                    </td>
                    <td className="py-3.5 px-5 font-black text-slate-900">
                      ${o.total.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-5 font-mono text-slate-600">{o.currency}</td>
                    <td className="py-3.5 px-5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadge(
                          o.paymentStatus
                        )}`}
                      >
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 font-medium text-slate-700">{o.status}</td>
                    <td className="py-3.5 px-5 text-slate-400">
                      {new Date(o.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <Link
                        to={`/checkout/confirmation?orderNumber=${o.orderNumber}`}
                        className="text-brand-600 hover:text-brand-800 font-semibold"
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
