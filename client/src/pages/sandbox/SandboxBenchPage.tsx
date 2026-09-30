import React, { useState, useEffect } from 'react';
import { InternalLayout } from '../../components/layout/InternalLayout';
import { api } from '../../services/api';
import { SandboxStatus, SandboxTransaction, WebhookEventRecord, TimelineEvent, Product } from '../../types';
import {
  FlaskConical,
  Play,
  Webhook,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Ban,
  ShieldCheck,
  Terminal,
  Activity,
  Layers,
  ArrowRight,
  Loader2,
  Check,
  AlertTriangle,
  Code2,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SandboxBenchPage: React.FC = () => {
  const [status, setStatus] = useState<SandboxStatus | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<SandboxTransaction[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookEventRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'scenarios' | 'webhooks' | 'transactions'>('scenarios');
  const [loading, setLoading] = useState(true);

  // Scenario Lab State
  const [selectedScenario, setSelectedScenario] = useState<'SUCCESS' | 'FAILED' | 'PENDING' | 'CANCELLED' | 'EXPIRED'>('SUCCESS');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<string>('149.99');
  const [failureReason, setFailureReason] = useState<string>('Card declined by issuing bank (insufficient funds)');
  const [scenarioRunning, setScenarioRunning] = useState(false);
  const [scenarioResult, setScenarioResult] = useState<any | null>(null);

  // Webhook Lab State
  const [selectedWebhookType, setSelectedWebhookType] = useState<string>('payment.completed');
  const [webhookSubmitting, setWebhookSubmitting] = useState(false);
  const [webhookResult, setWebhookResult] = useState<any | null>(null);

  // Replay State
  const [replayingEventId, setReplayingEventId] = useState<string | null>(null);
  const [replayResult, setReplayResult] = useState<any | null>(null);

  const fetchStatusAndData = async () => {
    try {
      const [sbxStatus, prods, txs, whs] = await Promise.all([
        api.sandbox.getStatus(),
        api.getProducts(),
        api.sandbox.getTransactions(),
        api.operations.getWebhooks(),
      ]);

      setStatus(sbxStatus);
      setProducts(prods);
      if (prods.length > 0 && !selectedProductId) {
        setSelectedProductId(prods[0]._id);
      }
      setTransactions(txs.transactions);
      setWebhooks(whs.events);
    } catch (err) {
      console.error('Failed to load sandbox bench data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatusAndData();
  }, []);

  const handleRunScenario = async (e: React.FormEvent) => {
    e.preventDefault();
    setScenarioRunning(true);
    setScenarioResult(null);

    try {
      const res = await api.sandbox.runScenario({
        scenario: selectedScenario,
        productId: selectedProductId,
        amount: parseFloat(customAmount) || undefined,
        failureReason: selectedScenario === 'FAILED' ? failureReason : undefined,
      });

      setScenarioResult(res);
      fetchStatusAndData();
    } catch (err: any) {
      console.error('Scenario execution failed', err);
      setScenarioResult({
        error: err?.response?.data?.error?.message || 'Scenario execution failed.',
      });
    } finally {
      setScenarioRunning(false);
    }
  };

  const handleTriggerWebhook = async () => {
    setWebhookSubmitting(true);
    setWebhookResult(null);

    try {
      const res = await api.sandbox.triggerWebhook({
        eventType: selectedWebhookType,
      });
      setWebhookResult(res);
      fetchStatusAndData();
    } catch (err: any) {
      setWebhookResult({
        error: err?.response?.data?.error?.message || 'Failed to trigger test webhook.',
      });
    } finally {
      setWebhookSubmitting(false);
    }
  };

  const handleReplayEvent = async (eventId: string) => {
    setReplayingEventId(eventId);
    setReplayResult(null);

    try {
      const res = await api.sandbox.replayWebhook(eventId);
      setReplayResult(res);
      fetchStatusAndData();
    } catch (err: any) {
      setReplayResult({
        error: err?.response?.data?.error?.message || 'Failed to replay event.',
      });
    } finally {
      setReplayingEventId(null);
    }
  };

  return (
    <InternalLayout activeConsole="sandbox">
      {/* Header & Badges */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-champagne animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-champagne font-bold">
              {status?.environment === 'PAYONEER_SANDBOX'
                ? '🟢 Payoneer Official Sandbox'
                : '🟡 Mock Payment Mode Active'}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-ivory">
            Sandbox Bench
          </h1>
          <p className="text-xs font-mono text-stone-muted mt-1">
            Payment integration testing environment • Scenario orchestration & webhook idempotency lab.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-950 border border-champagne/40 text-champagne text-xs font-mono font-bold uppercase">
            Protocol: Oscato REST
          </span>
          <button
            onClick={fetchStatusAndData}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-stone-muted hover:text-ivory border border-white/10 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-champagne" />
          </button>
        </div>
      </div>

      {/* Top Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-charcoal-surface border border-white/10 p-5 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-stone-muted block">
            Payment Provider
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-serif text-xl font-bold text-ivory">
              {status?.provider || 'Payoneer Oscato'}
            </span>
          </div>
          <span className="text-[10px] font-mono text-champagne block">
            Mode: {status?.mode?.toUpperCase()}
          </span>
        </div>

        <div className="rounded-2xl bg-charcoal-surface border border-white/10 p-5 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 block">
            Successful Tests
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-2xl font-extrabold text-emerald-400">
              {status?.successfulTests || 0}
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-[10px] font-mono text-stone-muted block">Settled Transactions</span>
        </div>

        <div className="rounded-2xl bg-charcoal-surface border border-white/10 p-5 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 block">
            Failed Tests
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-2xl font-extrabold text-red-400">
              {status?.failedTests || 0}
            </span>
            <XCircle className="w-4 h-4 text-red-400" />
          </div>
          <span className="text-[10px] font-mono text-stone-muted block">Decline Scenarios</span>
        </div>

        <div className="rounded-2xl bg-charcoal-surface border border-white/10 p-5 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block">
            Pending / In-Flight
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-2xl font-extrabold text-amber-400">
              {status?.pendingTests || 0}
            </span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-[10px] font-mono text-stone-muted block">Handshakes in Progress</span>
        </div>
      </div>

      {/* Bench Tabs Header */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('scenarios')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0 border ${
            activeTab === 'scenarios'
              ? 'bg-champagne text-charcoal border-champagne shadow-sm'
              : 'bg-white/5 text-stone-muted border-white/10 hover:text-ivory'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>Payment Scenario Lab</span>
        </button>

        <button
          onClick={() => setActiveTab('webhooks')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0 border ${
            activeTab === 'webhooks'
              ? 'bg-champagne text-charcoal border-champagne shadow-sm'
              : 'bg-white/5 text-stone-muted border-white/10 hover:text-ivory'
          }`}
        >
          <Webhook className="w-4 h-4" />
          <span>Webhook Lab & Idempotency</span>
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0 border ${
            activeTab === 'transactions'
              ? 'bg-champagne text-charcoal border-champagne shadow-sm'
              : 'bg-white/5 text-stone-muted border-white/10 hover:text-ivory'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Sandbox Ledger ({transactions.length})</span>
        </button>
      </div>

      {/* TAB 1: PAYMENT SCENARIO LAB */}
      {activeTab === 'scenarios' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Scenario Control Panel */}
          <div className="lg:col-span-6 rounded-3xl bg-charcoal-surface border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-champagne font-bold block">
                Scenario Configuration
              </span>
              <h3 className="font-serif text-2xl font-bold text-ivory">Run Payment Simulation</h3>
              <p className="text-xs font-mono text-stone-muted leading-relaxed">
                Executes an end-to-end payment lifecycle through the payment abstraction layer.
              </p>
            </div>

            <form onSubmit={handleRunScenario} className="space-y-5">
              {/* Scenario Selector */}
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-stone-muted block mb-2">
                  Select Target Outcome
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                  {[
                    { key: 'SUCCESS', label: 'Success (Paid)', icon: CheckCircle2, color: 'text-emerald-400' },
                    { key: 'FAILED', label: 'Failed (Decline)', icon: XCircle, color: 'text-red-400' },
                    { key: 'PENDING', label: 'Pending (Hold)', icon: Clock, color: 'text-amber-400' },
                    { key: 'CANCELLED', label: 'Cancelled', icon: Ban, color: 'text-stone-400' },
                    { key: 'EXPIRED', label: 'Expired (Timeout)', icon: Clock, color: 'text-stone-400' },
                  ].map(s => {
                    const Icon = s.icon;
                    const isSelected = selectedScenario === s.key;
                    return (
                      <button
                        type="button"
                        key={s.key}
                        onClick={() => setSelectedScenario(s.key as any)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-emerald-950/80 border-champagne text-ivory shadow-subtle'
                            : 'bg-charcoal border-white/10 text-stone-muted hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Icon className={`w-4 h-4 ${s.color}`} />
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-champagne" />}
                        </div>
                        <span className="font-bold text-[11px] block">{s.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Product / Base Amount */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-stone-muted block mb-1.5">
                    Test Item
                  </label>
                  <select
                    value={selectedProductId}
                    onChange={e => {
                      setSelectedProductId(e.target.value);
                      const p = products.find(prod => prod._id === e.target.value);
                      if (p) setCustomAmount(p.price.toString());
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-charcoal border border-white/10 text-xs font-mono text-ivory focus:outline-none focus:border-champagne"
                  >
                    {products.map(p => (
                      <option key={p._id} value={p._id}>
                        {p.name} (${p.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-stone-muted block mb-1.5">
                    Authorized Amount (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={customAmount}
                    onChange={e => setCustomAmount(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-charcoal border border-white/10 text-xs font-mono text-ivory focus:outline-none focus:border-champagne"
                  />
                </div>
              </div>

              {/* Conditional Failure Reason */}
              {selectedScenario === 'FAILED' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-red-400 block mb-1.5">
                    Decline Simulation Reason
                  </label>
                  <input
                    type="text"
                    value={failureReason}
                    onChange={e => setFailureReason(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-charcoal border border-red-500/30 text-xs font-mono text-ivory focus:outline-none focus:border-red-400"
                  />
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: scenarioRunning ? 1 : 1.01 }}
                whileTap={{ scale: scenarioRunning ? 1 : 0.98 }}
                type="submit"
                disabled={scenarioRunning}
                className="w-full py-4 px-6 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-ivory font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 shadow-emerald transition-all border border-emerald-700/50 cursor-pointer disabled:opacity-50"
              >
                {scenarioRunning ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-champagne" />
                    <span>Executing Handshake & Simulating Outcome...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-champagne fill-champagne" />
                    <span>Run Scenario: {selectedScenario}</span>
                  </div>
                )}
              </motion.button>
            </form>
          </div>

          {/* Right Column: Scenario Execution & Timeline Inspector */}
          <div className="lg:col-span-6 rounded-3xl bg-charcoal-surface border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-champagne font-bold block">
                Execution Inspector
              </span>
              <h3 className="font-serif text-2xl font-bold text-ivory">Scenario Result & Timeline</h3>
              <p className="text-xs font-mono text-stone-muted leading-relaxed">
                Live lifecycle inspection showing order sync, provider response, and timestamped state.
              </p>
            </div>

            {!scenarioResult ? (
              <div className="py-20 text-center border-2 border-dashed border-white/10 rounded-2xl p-6 text-stone-muted space-y-3">
                <Terminal className="w-10 h-10 mx-auto text-champagne opacity-60" />
                <p className="text-xs font-mono">
                  Select an outcome on the left and click <strong>Run Scenario</strong> to inspect the live transaction stream.
                </p>
              </div>
            ) : scenarioResult.error ? (
              <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-mono space-y-2">
                <div className="font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span>Execution Failure</span>
                </div>
                <p>{scenarioResult.error}</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Result Summary Strip */}
                <div className="p-4 rounded-xl bg-charcoal border border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-[9px] uppercase text-stone-muted block">Order ID</span>
                    <span className="font-bold text-champagne">{scenarioResult.order.orderNumber}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase text-stone-muted block">Payment State</span>
                    <span className="font-bold text-ivory">{scenarioResult.payment.status}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase text-stone-muted block">Order Status</span>
                    <span className="font-bold text-ivory">{scenarioResult.order.status}</span>
                  </div>
                </div>

                {/* Animated Vertical Timeline */}
                <div className="space-y-3 pl-3 border-l-2 border-champagne/40">
                  {scenarioResult.timeline.map((event: TimelineEvent, idx: number) => {
                    const isSuccess = event.state === 'success';
                    const isFailure = event.state === 'failure';
                    const isProcessing = event.state === 'processing';

                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.12 }}
                        className="relative pl-5"
                      >
                        <div
                          className={`absolute -left-[18px] top-1 w-3.5 h-3.5 rounded-full border-2 ${
                            isSuccess
                              ? 'bg-emerald-500 border-emerald-300 shadow-emerald'
                              : isFailure
                              ? 'bg-red-500 border-red-300'
                              : isProcessing
                              ? 'bg-amber-500 border-amber-300'
                              : 'bg-stone-500 border-stone-300'
                          }`}
                        />
                        <div className="font-mono text-xs font-bold text-ivory tracking-wide">
                          {event.title}
                        </div>
                        {event.description && (
                          <div className="text-[11px] font-mono text-stone-warm mt-0.5 leading-relaxed">
                            {event.description}
                          </div>
                        )}
                        <div className="text-[10px] font-mono text-stone-muted/70 mt-0.5">
                          {new Date(event.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="p-3 rounded-lg bg-emerald-950/40 border border-champagne/20 text-[11px] font-mono text-stone-warm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-champagne shrink-0" />
                  <span>{scenarioResult.message}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: WEBHOOK LAB & IDEMPOTENCY */}
      {activeTab === 'webhooks' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Trigger Webhook Form */}
            <div className="lg:col-span-5 rounded-3xl bg-charcoal-surface border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-champagne font-bold block">
                  Webhook Dispatcher
                </span>
                <h3 className="font-serif text-2xl font-bold text-ivory">Trigger Test Webhook</h3>
                <p className="text-xs font-mono text-stone-muted leading-relaxed">
                  Synthesizes Payoneer notification payloads routed through core webhook ingress.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-stone-muted block mb-2">
                    Event Type
                  </label>
                  <select
                    value={selectedWebhookType}
                    onChange={e => setSelectedWebhookType(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl bg-charcoal border border-white/10 text-xs font-mono text-ivory focus:outline-none focus:border-champagne"
                  >
                    <option value="payment.completed">payment.completed (Settled)</option>
                    <option value="payment.failed">payment.failed (Decline)</option>
                    <option value="payment.pending">payment.pending (Hold)</option>
                    <option value="payment.processing">payment.processing (Gateway In-Flight)</option>
                    <option value="payment.cancelled">payment.cancelled (Customer Abort)</option>
                  </select>
                </div>

                <motion.button
                  whileHover={{ scale: webhookSubmitting ? 1 : 1.01 }}
                  whileTap={{ scale: webhookSubmitting ? 1 : 0.98 }}
                  onClick={handleTriggerWebhook}
                  disabled={webhookSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-emerald-900 hover:bg-emerald-800 text-ivory font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 shadow-emerald transition-all border border-emerald-700/50 cursor-pointer disabled:opacity-50"
                >
                  {webhookSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-champagne" />
                      <span>Dispatching Webhook...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Webhook className="w-4 h-4 text-champagne" />
                      <span>Send Webhook Event</span>
                    </div>
                  )}
                </motion.button>

                {webhookResult && (
                  <div className="p-3.5 rounded-xl bg-charcoal border border-white/10 text-xs font-mono space-y-1">
                    <span className="text-[10px] uppercase text-champagne font-bold block">
                      Dispatch Response
                    </span>
                    <p className="text-stone-warm">{webhookResult.message || webhookResult.error}</p>
                    {webhookResult.eventId && (
                      <span className="text-[10px] text-stone-muted block">
                        Event ID: {webhookResult.eventId}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Idempotency Demonstration Panel */}
            <div className="lg:col-span-7 rounded-3xl bg-charcoal-surface border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-champagne font-bold block">
                  Idempotency Verification
                </span>
                <h3 className="font-serif text-2xl font-bold text-ivory">Replay Protection Test</h3>
                <p className="text-xs font-mono text-stone-muted leading-relaxed">
                  Demonstrates payment engineering resilience: replay an already processed webhook event to verify that duplicates are safely ignored.
                </p>
              </div>

              {replayResult && (
                <div
                  className={`p-4 rounded-xl border text-xs font-mono space-y-1.5 ${
                    replayResult.duplicate
                      ? 'bg-emerald-950/60 border-champagne/40 text-champagne'
                      : 'bg-red-950/60 border-red-500/40 text-red-300'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-champagne" />
                    <span>Idempotency Verified</span>
                  </div>
                  <p>{replayResult.message}</p>
                  <span className="text-[10px] text-stone-muted block">
                    Event ID: {replayResult.eventId} (Duplicate Flag: {String(replayResult.duplicate)})
                  </span>
                </div>
              )}

              {/* Webhook History Table with Replay Buttons */}
              <div className="overflow-x-auto rounded-xl border border-white/10 bg-charcoal">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="text-[10px] uppercase text-stone-muted border-b border-white/10 bg-white/5">
                    <tr>
                      <th className="py-2.5 px-3 font-bold">Event ID</th>
                      <th className="py-2.5 px-3 font-bold">Type</th>
                      <th className="py-2.5 px-3 font-bold">Processed</th>
                      <th className="py-2.5 px-3 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {webhooks.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-stone-muted">
                          No webhook events recorded yet. Trigger one on the left.
                        </td>
                      </tr>
                    ) : (
                      webhooks.slice(0, 6).map(ev => (
                        <tr key={ev._id} className="hover:bg-white/5 transition-colors">
                          <td className="py-2.5 px-3 font-bold text-champagne">{ev.eventId}</td>
                          <td className="py-2.5 px-3 text-ivory">{ev.eventType}</td>
                          <td className="py-2.5 px-3">
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold uppercase">
                              <Check className="w-3 h-3" />
                              True
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => handleReplayEvent(ev.eventId)}
                              disabled={replayingEventId === ev.eventId}
                              className="px-2.5 py-1 rounded bg-white/5 hover:bg-champagne hover:text-charcoal text-stone-warm text-[10px] font-bold uppercase transition-colors border border-white/10 cursor-pointer disabled:opacity-50 inline-flex items-center gap-1"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Replay</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SANDBOX LEDGER */}
      {activeTab === 'transactions' && (
        <div className="rounded-2xl bg-charcoal-surface border border-white/10 overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-ivory">Sandbox Test Transactions</h3>
            <span className="text-xs font-mono text-stone-muted">
              {transactions.length} total test records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-charcoal text-[10px] uppercase tracking-widest text-stone-muted border-b border-white/10">
                <tr>
                  <th className="py-3 px-4 font-bold">Order Number</th>
                  <th className="py-3 px-4 font-bold">Customer</th>
                  <th className="py-3 px-4 font-bold">Amount</th>
                  <th className="py-3 px-4 font-bold">Provider Token</th>
                  <th className="py-3 px-4 font-bold">Payment Status</th>
                  <th className="py-3 px-4 font-bold">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-stone-muted">
                      No sandbox test transactions yet. Run a scenario above.
                    </td>
                  </tr>
                ) : (
                  transactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-bold text-champagne">{tx.orderNumber}</td>
                      <td className="py-3 px-4 text-ivory">{tx.customerName}</td>
                      <td className="py-3 px-4 font-bold text-ivory">
                        ${tx.amount.toFixed(2)} {tx.currency}
                      </td>
                      <td className="py-3 px-4 text-[10px] text-stone-muted truncate max-w-[150px]">
                        {tx.providerPaymentId}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            tx.status === 'PAID'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                              : tx.status === 'FAILED'
                              ? 'bg-red-950 text-red-300 border border-red-500/30'
                              : 'bg-white/5 text-stone-muted border border-white/10'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-stone-muted">
                        {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </InternalLayout>
  );
};
