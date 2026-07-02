'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { newsAPI } from '@/lib/api';
import {
  AlertOctagon, AlertTriangle, AlertCircle, Info,
  RefreshCw, WifiOff, TrendingDown, TrendingUp, Minus,
  CheckCircle2, XCircle, Zap
} from 'lucide-react';

type SeverityStyle = { border: string; badge: string; bg: string; };

function getSeverityStyle(severity: string): SeverityStyle {
  const map: Record<string, SeverityStyle> = {
    High:   { border: 'border-l-orange-500', badge: 'bg-orange-50 text-orange-600 border-orange-200', bg: 'bg-orange-50/50' },
    Medium: { border: 'border-l-amber-500',  badge: 'bg-amber-50 text-amber-600 border-amber-200',   bg: 'bg-amber-50/50' },
    Low:    { border: 'border-l-blue-500',   badge: 'bg-blue-50 text-blue-600 border-blue-200',      bg: 'bg-blue-50/50' },
    'Action Required': { border: 'border-l-red-500', badge: 'bg-red-50 text-red-600 border-red-200', bg: 'bg-red-50/50' },
  };
  return map[severity] || map.Low;
}

function ImpactIcon({ type }: { type: string }) {
  if (type === 'Positive')        return <TrendingUp size={12} className="text-profit" />;
  if (type === 'Negative')        return <TrendingDown size={12} className="text-loss" />;
  if (type === 'Action Required') return <AlertTriangle size={12} className="text-red-500" />;
  return <Minus size={12} className="text-amber-500" />;
}

function ImpactBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    Positive:         'bg-emerald-50 text-emerald-600 border-emerald-200',
    Negative:         'bg-red-50 text-red-600 border-red-200',
    Mixed:            'bg-amber-50 text-amber-600 border-amber-200',
    'Action Required':'bg-red-100 text-red-700 border-red-300',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider ${map[type] || map.Mixed}`}>
      <ImpactIcon type={type} />
      {type}
    </span>
  );
}

export default function NewsAlertsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [impact, setImpact] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState<'All' | 'Action Required' | 'Positive' | 'Negative'>('All');
  const [expandedImpact, setExpandedImpact] = useState<string | null>(null);

  const loadData = () => {
    setLoading(true); setError(false);
    Promise.all([newsAPI.getAll(), newsAPI.getImpact(), newsAPI.getSummary()])
      .then(([n, i, s]) => { setNews(n.data); setImpact(i.data); setSummary(s.data); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadData(); }, []);

  if (loading) return (
    <AppLayout>
      <div className="flex items-center justify-center py-32">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500 tracking-wide">Executing macro news analysis...</p>
        </div>
      </div>
    </AppLayout>
  );

  if (error) return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center py-24 gap-5">
        <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center shadow-sm">
          <WifiOff size={24} className="text-red-500 animate-pulse" />
        </div>
        <p className="font-bold text-slate-900 text-base">Backend offline</p>
        <button onClick={loadData} className="btn-flat flex items-center gap-2">
          <RefreshCw size={13} /> <span>Retry Sync</span>
        </button>
      </div>
    </AppLayout>
  );

  const filtered = filter === 'All' ? news
    : filter === 'Action Required' ? news.filter(n => n.action_required)
    : news.filter(n => n.impact_type === filter);

  const actionCount = news.filter(n => n.action_required).length;

  return (
    <AppLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">News Intelligence Engine</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Market events filtered by impact on your portfolio — NSE, BSE, RBI, Macro
            </p>
          </div>
          <button onClick={loadData} className="btn-flat-secondary flex items-center gap-1.5 py-2 text-xs">
            <RefreshCw size={13} /><span className="hidden sm:inline">Refresh Signals</span>
          </button>
        </div>

        {/* Summary KPIs */}
        {summary && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            {[
              { label: 'Total Alerts', value: summary.total_alerts, color: 'text-slate-900' },
              { label: 'Action Required', value: summary.action_required, color: 'text-red-500' },
              { label: 'Positive Signals', value: summary.positive_signals, color: 'text-profit' },
              { label: 'Negative Signals', value: summary.negative_signals, color: 'text-loss' },
            ].map((s, i) => (
              <div key={s.label} className={`space-y-1 ${i > 0 ? 'sm:border-l border-slate-100 sm:pl-6' : ''}`}>
                <div className="metric-label">{s.label}</div>
                <div className={`text-2xl font-extrabold font-mono tracking-tight ${s.color}`}>{s.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Action Required Banner */}
        {actionCount > 0 && (
          <div className="flex items-start gap-3 p-4 rounded-xl border border-red-200 bg-red-50 shadow-sm">
            <AlertTriangle size={15} className="text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-900 mb-0.5">{actionCount} alert{actionCount > 1 ? 's' : ''} require your response</p>
              <p className="text-[11px] text-slate-700">Filter by &quot;Action Required&quot; below to review active exposures.</p>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b border-slate-200 pb-0 -mb-1 overflow-x-auto">
          {(['All', 'Action Required', 'Positive', 'Negative'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`flex-shrink-0 px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                filter === f ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}>
              {f}
              {f === 'Action Required' && actionCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-bold">{actionCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* News Feed */}
        <div className="space-y-3">
          {filtered.map(item => {
            const style = getSeverityStyle(item.action_required ? 'Action Required' : item.severity);
            return (
              <div key={item.id}
                className={`border-l-4 ${style.border} rounded-r-2xl border border-slate-200 ${style.bg} p-4 shadow-sm`}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider ${style.badge}`}>
                      {item.category}
                    </span>
                    <ImpactBadge type={item.impact_type} />
                    {item.action_required && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-600 text-white text-[9px] font-bold uppercase tracking-wider">
                        <Zap size={9} /> Action Required
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold">{item.time_ago}</span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 mb-1.5 leading-relaxed">{item.headline}</h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">{item.summary}</p>

                {/* Portfolio Impact */}
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Your Portfolio Impact</p>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">{item.your_portfolio_impact}</p>
                </div>

                {/* Affected Holdings Chips */}
                {item.affected_holdings?.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 mt-3">
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Exposed:</span>
                    {item.affected_holdings.map((h: string) => (
                      <span key={h} className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {h}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-[9px] text-slate-500 font-semibold uppercase mt-2">Source: {item.source}</p>
              </div>
            );
          })}
        </div>

        {/* Market Impact Scenarios */}
        <div className="section-card">
          <h3 className="section-title flex items-center gap-2">
            <Zap size={15} className="text-amber-500" />
            <span>Market Simulation Models</span>
          </h3>
          <div className="space-y-3 mt-4">
            {impact.map((scenario) => (
              <div key={scenario.event}
                className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <button
                  onClick={() => setExpandedImpact(expandedImpact === scenario.event ? null : scenario.event)}
                  className="w-full text-left p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{scenario.event}</p>
                    <p className="text-[10px] text-blue-600 font-bold uppercase mt-1 tracking-wider">{scenario.your_exposure}</p>
                  </div>
                  <span className="text-slate-500 text-xs">{expandedImpact === scenario.event ? '▲' : '▼'}</span>
                </button>
                {expandedImpact === scenario.event && (
                  <div className="border-t border-slate-100 p-4 bg-slate-50 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] font-bold text-red-500 uppercase tracking-wider mb-3.5 flex items-center gap-1">
                        <TrendingDown size={11} /> Bearish Probability
                      </p>
                      <div className="space-y-2">
                        {scenario.likely_negative.map((s: string) => (
                          <div key={s} className="flex items-start gap-2">
                            <XCircle size={12} className="text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-slate-700 leading-normal">{s}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider mb-3.5 flex items-center gap-1">
                        <TrendingUp size={11} /> Bullish Probability
                      </p>
                      <div className="space-y-2">
                        {scenario.likely_positive.map((s: string) => (
                          <div key={s} className="flex items-start gap-2">
                            <CheckCircle2 size={12} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-slate-700 leading-normal">{s}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex items-start gap-2.5 max-w-3xl">
          <Info size={15} className="text-slate-500 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-slate-500 leading-relaxed">
            ⚠️ Not SEBI-registered advice. News analysis is AI-generated for awareness only. Market impacts are probabilistic. Final investment decisions are yours.
          </p>
        </div>

      </div>
    </AppLayout>
  );
}
