import React, { useState, useEffect } from 'react';
import { InternalLayout } from '../../components/layout/InternalLayout';
import { api } from '../../services/api';
import { AuditLogRecord } from '../../types';
import { History, ShieldCheck, CheckCircle2, XCircle, Search, RefreshCw } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.operations.getAuditLogs(100);
      setLogs(res.logs);
    } catch (err) {
      console.error('Failed to load audit logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(l => {
    if (!search.trim()) return true;
    const s = search.toLowerCase();
    return (
      l.userEmail.toLowerCase().includes(s) ||
      l.action.toLowerCase().includes(s) ||
      (l.resource && l.resource.toLowerCase().includes(s))
    );
  });

  return (
    <InternalLayout>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-champagne font-bold block mb-1">
            Zero-Trust Security & Compliance
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-ivory">
            Security Audit Trail
          </h1>
          <p className="text-xs font-mono text-stone-muted mt-1">
            Immutable log of all internal logins, operations interventions, and sandbox test scenarios.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-ivory text-xs font-mono font-semibold border border-white/10 transition-colors cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-champagne" />
          <span>Refresh Audit Logs</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="p-3.5 rounded-2xl bg-charcoal-surface border border-white/10">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Filter by user email, action (e.g. LOGIN, RUN_PAYMENT_SCENARIO), or resource..."
          className="w-full px-4 py-2.5 rounded-xl bg-charcoal border border-white/10 text-xs font-mono text-ivory placeholder-stone-muted focus:outline-none focus:border-champagne"
        />
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl bg-charcoal-surface border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-charcoal text-[10px] uppercase tracking-widest text-stone-muted border-b border-white/10">
              <tr>
                <th className="py-3 px-4 font-bold">Timestamp</th>
                <th className="py-3 px-4 font-bold">User</th>
                <th className="py-3 px-4 font-bold">Role</th>
                <th className="py-3 px-4 font-bold">Action</th>
                <th className="py-3 px-4 font-bold">Resource</th>
                <th className="py-3 px-4 font-bold">IP Address</th>
                <th className="py-3 px-4 font-bold">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-muted">
                    No security audit logs recorded yet.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(l => (
                  <tr key={l._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-stone-muted whitespace-nowrap">
                      {new Date(l.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-4 font-bold text-ivory">{l.userEmail}</td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-champagne border border-white/10 uppercase">
                        {l.userRole}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-champagne">{l.action}</td>
                    <td className="py-3 px-4 text-stone-muted truncate max-w-[160px]">
                      {l.resource || '—'}
                    </td>
                    <td className="py-3 px-4 text-[11px] text-stone-muted">{l.ip || '127.0.0.1'}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase ${
                          l.result === 'SUCCESS' ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {l.result === 'SUCCESS' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {l.result}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </InternalLayout>
  );
};
