import React, { useState, useEffect } from 'react';
import { InternalLayout } from '../../components/layout/InternalLayout';
import { api } from '../../services/api';
import { Order, Payment, AdminStats, PaymentStatus, OrderStatus, TimelineEvent } from '../../types';
import {
  TrendingUp,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  Eye,
  X,
  FileText,
  RotateCcw,
  Ban,
  ShieldCheck,
  Send,
  Loader2,
  Calendar,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const OperationsPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Selected Transaction for Drawer Inspection
  const [selectedTx, setSelectedTx] = useState<any | null>(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [selectedPaymentDetails, setSelectedPaymentDetails] = useState<Payment | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);

  // Operational Note input
  const [newNote, setNewNote] = useState('');
  const [noteSubmitting, setNoteSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const [statsData, txData] = await Promise.all([
        api.operations.getStats(),
        api.operations.getTransactions(search || undefined),
      ]);
      setStats(statsData);
      setTransactions(txData.transactions);
    } catch (err) {
      console.error('Failed to load operations data', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const handleOpenDrawer = async (tx: any) => {
    setSelectedTx(tx);
    setDrawerLoading(true);
    setActionMessage(null);
    setNewNote('');

    try {
      const details = await api.operations.getOrderDetails(tx.orderNumber);
      setSelectedOrderDetails(details.order);
      setSelectedPaymentDetails(details.payment);
    } catch (err) {
      console.error('Failed to fetch full order details', err);
    } finally {
      setDrawerLoading(false);
    }
  };

  const handleCloseDrawer = () => {
    setSelectedTx(null);
    setSelectedOrderDetails(null);
    setSelectedPaymentDetails(null);
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedTx) return;

    try {
      setNoteSubmitting(true);
      const updatedOrder = await api.operations.addOrderNote(selectedTx.orderNumber, newNote.trim());
      setSelectedOrderDetails(updatedOrder);
      setNewNote('');
      setActionMessage('Operational note recorded.');
    } catch (err: any) {
      setActionMessage(err?.response?.data?.error?.message || 'Failed to record note.');
    } finally {
      setNoteSubmitting(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!selectedTx || !window.confirm(`Are you sure you want to cancel order ${selectedTx.orderNumber}?`)) return;

    try {
      setDrawerLoading(true);
      const updatedOrder = await api.operations.cancelOrder(selectedTx.orderNumber, 'Operations manual intervention');
      setSelectedOrderDetails(updatedOrder);
      setActionMessage('Order cancelled successfully.');
      fetchData();
    } catch (err: any) {
      setActionMessage(err?.response?.data?.error?.message || 'Failed to cancel order.');
    } finally {
      setDrawerLoading(false);
    }
  };

  const handleRetryPayment = async () => {
    if (!selectedPaymentDetails) return;

    try {
      setDrawerLoading(true);
      const updatedPayment = await api.operations.retryPayment(selectedPaymentDetails.providerPaymentId);
      setSelectedPaymentDetails(updatedPayment);
      setActionMessage('Payment retry queued.');
      fetchData();
    } catch (err: any) {
      setActionMessage(err?.response?.data?.error?.message || 'Failed to retry payment.');
    } finally {
      setDrawerLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    if (statusFilter === 'ALL') return true;
    return tx.paymentStatus === statusFilter;
  });

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold uppercase">
            <CheckCircle2 className="w-3 h-3" />
            Paid
          </span>
        );
      case 'PENDING':
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950/60 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold uppercase">
            <Clock className="w-3 h-3" />
            {status}
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-950/60 text-red-300 border border-red-500/40 text-[10px] font-mono font-bold uppercase">
            <XCircle className="w-3 h-3" />
            Failed
          </span>
        );
      case 'CANCELLED':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 text-stone-muted border border-white/10 text-[10px] font-mono font-bold uppercase">
            {status}
          </span>
        );
    }
  };

  return (
    <InternalLayout activeConsole="operations">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-champagne font-bold block mb-1">
            Internal Oversight & Control
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-ivory">
            Operations Center
          </h1>
          <p className="text-xs font-mono text-stone-muted mt-1">
            Monitor orders, payments and transaction activity in real time.
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-ivory text-xs font-mono font-semibold border border-white/10 transition-colors self-start md:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-champagne ${refreshing ? 'animate-spin' : ''}`} />
          <span>Sync Ledger</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="rounded-2xl bg-charcoal-surface border border-white/10 p-5 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-stone-muted block">
            Total Orders
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-2xl font-extrabold text-ivory">
              {stats?.totalOrders || 0}
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-charcoal-surface border border-white/10 p-5 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 block">
            Successful
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-2xl font-extrabold text-emerald-400">
              {stats?.successfulPayments || 0}
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-charcoal-surface border border-white/10 p-5 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block">
            Pending / In-Flight
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-2xl font-extrabold text-amber-400">
              {stats?.pendingPayments || 0}
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-charcoal-surface border border-white/10 p-5 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 block">
            Failed Payments
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-2xl font-extrabold text-red-400">
              {stats?.failedPayments || 0}
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-charcoal-surface border border-white/10 p-5 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-stone-muted block">
            Cancelled
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-2xl font-extrabold text-stone-muted">
              {stats?.cancelledPayments || 0}
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-emerald-950/40 border border-champagne/30 p-5 space-y-2 col-span-2 lg:col-span-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-champagne block">
            Settled Volume
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-xl sm:text-2xl font-extrabold text-champagne">
              ${stats?.totalRevenue.toFixed(2) || '0.00'}
            </span>
            <span className="text-[10px] font-mono text-stone-muted">USD</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-charcoal-surface p-3.5 rounded-2xl border border-white/10">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 text-stone-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Order ID, reference, or customer email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-charcoal border border-white/10 text-xs font-mono text-ivory placeholder-stone-muted focus:outline-none focus:border-champagne"
          />
        </form>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'PAID', 'PENDING', 'FAILED', 'CANCELLED'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold transition-colors cursor-pointer shrink-0 border ${
                statusFilter === status
                  ? 'bg-champagne text-charcoal border-champagne'
                  : 'bg-white/5 text-stone-muted border-white/10 hover:text-ivory'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="rounded-2xl bg-charcoal-surface border border-white/10 overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold text-ivory">Recent Transactions</h3>
          <span className="text-xs font-mono text-stone-muted">
            {filteredTransactions.length} records loaded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-charcoal text-[10px] uppercase tracking-widest text-stone-muted border-b border-white/10">
              <tr>
                <th className="py-3.5 px-4 font-bold">Order ID</th>
                <th className="py-3.5 px-4 font-bold">Customer</th>
                <th className="py-3.5 px-4 font-bold">Amount</th>
                <th className="py-3.5 px-4 font-bold">Provider</th>
                <th className="py-3.5 px-4 font-bold">Payment Status</th>
                <th className="py-3.5 px-4 font-bold">Order Status</th>
                <th className="py-3.5 px-4 font-bold">Created</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-muted">
                    No transactions matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map(tx => (
                  <tr
                    key={tx.id}
                    className="hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => handleOpenDrawer(tx)}
                  >
                    <td className="py-3.5 px-4 font-bold text-champagne">{tx.orderNumber}</td>
                    <td className="py-3.5 px-4">
                      <div className="text-ivory font-medium">{tx.customerName}</div>
                      <div className="text-[10px] text-stone-muted truncate max-w-[160px]">
                        {tx.customerEmail}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-ivory">
                      ${tx.amount.toFixed(2)} {tx.currency}
                    </td>
                    <td className="py-3.5 px-4 uppercase text-[10px] text-stone-muted font-bold">
                      {tx.provider}
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(tx.paymentStatus)}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] text-stone-muted">{tx.orderStatus}</span>
                    </td>
                    <td className="py-3.5 px-4 text-[11px] text-stone-muted">
                      {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleOpenDrawer(tx);
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 hover:bg-champagne hover:text-charcoal transition-colors border border-white/10 text-[10px] uppercase font-bold cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Details Drawer */}
      <AnimatePresence>
        {selectedTx && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseDrawer}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative w-full max-w-xl bg-charcoal-surface border-l border-white/10 shadow-2xl z-10 flex flex-col h-full overflow-y-auto p-6 sm:p-8 space-y-6"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-champagne font-bold block">
                    Transaction Inspection
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-ivory">
                    {selectedTx.orderNumber}
                  </h3>
                </div>
                <button
                  onClick={handleCloseDrawer}
                  className="p-2 rounded-full bg-white/5 text-stone-muted hover:text-ivory transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {actionMessage && (
                <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-champagne/30 text-champagne text-xs font-mono">
                  {actionMessage}
                </div>
              )}

              {/* Core Details Grid */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-charcoal border border-white/10 text-xs font-mono">
                <div>
                  <span className="text-[10px] uppercase text-stone-muted block">Authorized Total</span>
                  <span className="font-bold text-base text-champagne">
                    ${selectedTx.amount.toFixed(2)} {selectedTx.currency}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-stone-muted block">Payment Status</span>
                  <div className="pt-1">{getStatusBadge(selectedTx.paymentStatus)}</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-stone-muted block">Provider / Engine</span>
                  <span className="font-semibold text-ivory uppercase">{selectedTx.provider}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-stone-muted block">Provider Session Token</span>
                  <span className="font-mono text-[10px] text-stone-muted truncate block">
                    {selectedTx.providerPaymentId || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Customer Shipping & Billing */}
              {selectedOrderDetails && (
                <div className="rounded-xl p-4 bg-charcoal border border-white/10 space-y-3 text-xs font-mono">
                  <span className="text-[10px] uppercase tracking-widest text-champagne block font-bold">
                    Customer Information
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-stone-warm">
                    <div>
                      <span className="text-[10px] text-stone-muted block">Name</span>
                      <span>
                        {selectedOrderDetails.customer.firstName} {selectedOrderDetails.customer.lastName}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-muted block">Email</span>
                      <span className="truncate block">{selectedOrderDetails.customer.email}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[10px] text-stone-muted block">Destination</span>
                      <span>
                        {selectedOrderDetails.customer.shippingAddress.address},{' '}
                        {selectedOrderDetails.customer.shippingAddress.city},{' '}
                        {selectedOrderDetails.customer.shippingAddress.state}{' '}
                        {selectedOrderDetails.customer.shippingAddress.postalCode}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Vertical Animated Timeline */}
              <div className="space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-widest text-champagne block font-bold">
                  Internal Payment Timeline
                </span>

                <div className="space-y-3 pl-2 border-l-2 border-champagne/30">
                  {(selectedOrderDetails?.timeline || selectedTx.timeline || [
                    { title: 'ORDER CREATED', description: 'Order payload accepted', timestamp: selectedTx.createdAt, state: 'success' },
                    { title: 'PAYMENT CREATED', description: 'Session created in memory', timestamp: selectedTx.createdAt, state: 'success' },
                    { title: `PAYMENT ${selectedTx.paymentStatus}`, description: selectedTx.failureReason || 'Status recorded in ledger', timestamp: selectedTx.updatedAt, state: selectedTx.paymentStatus === 'PAID' ? 'success' : 'failure' },
                  ]).map((t: TimelineEvent, idx: number) => {
                    const isSuccess = t.state === 'success';
                    const isFailure = t.state === 'failure';
                    const isProcessing = t.state === 'processing';

                    return (
                      <div key={idx} className="relative pl-4">
                        <div
                          className={`absolute -left-[13px] top-1 w-3 h-3 rounded-full border-2 ${
                            isSuccess
                              ? 'bg-emerald-500 border-emerald-300'
                              : isFailure
                              ? 'bg-red-500 border-red-300'
                              : isProcessing
                              ? 'bg-amber-500 border-amber-300'
                              : 'bg-stone-500 border-stone-300'
                          }`}
                        />
                        <div className="text-xs font-mono font-bold text-ivory uppercase">
                          {t.title}
                        </div>
                        {t.description && (
                          <div className="text-[11px] font-mono text-stone-muted mt-0.5">
                            {t.description}
                          </div>
                        )}
                        <div className="text-[10px] font-mono text-stone-muted/70 mt-0.5">
                          {new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Operational Actions */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-stone-muted block">
                  Operational Controls
                </span>

                <div className="flex gap-2">
                  {selectedTx.paymentStatus !== 'PAID' && (
                    <button
                      onClick={handleRetryPayment}
                      disabled={drawerLoading}
                      className="flex-1 py-2.5 px-3 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-champagne border border-champagne/30 text-xs font-mono uppercase font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retry Handshake</span>
                    </button>
                  )}

                  {selectedTx.paymentStatus !== 'CANCELLED' && selectedTx.paymentStatus !== 'PAID' && (
                    <button
                      onClick={handleCancelOrder}
                      disabled={drawerLoading}
                      className="py-2.5 px-3 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 text-xs font-mono uppercase font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>Cancel Order</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Operational Notes */}
              <div className="pt-2 border-t border-white/10 space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-champagne block font-bold">
                  Operational Notes & Annotations
                </span>

                {selectedOrderDetails?.notes && selectedOrderDetails.notes.length > 0 && (
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {selectedOrderDetails.notes.map((n, i) => (
                      <div key={i} className="p-3 rounded-lg bg-charcoal border border-white/5 text-xs font-mono space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-champagne">
                          <span>{n.author}</span>
                          <span>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-stone-warm">{n.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                    placeholder="Add operational investigation note..."
                    className="flex-1 px-3 py-2 rounded-lg bg-charcoal border border-white/10 text-xs font-mono text-ivory placeholder-stone-muted focus:outline-none focus:border-champagne"
                  />
                  <button
                    type="submit"
                    disabled={noteSubmitting || !newNote.trim()}
                    className="px-3.5 py-2 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-ivory text-xs font-mono font-bold uppercase transition-colors disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                  >
                    {noteSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>Save</span>
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </InternalLayout>
  );
};
