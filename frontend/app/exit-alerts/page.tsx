'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { exitAlertsAPI } from '@/lib/api';
import { formatCurrency, formatPercent } from '@/lib/utils';
import {
  ShieldAlert, Info, AlertTriangle, ArrowRight,
  RefreshCw, WifiOff, TrendingUp, TrendingDown, Minus
} from 'lucide-react';
import Link from 'next/link';

function ProbabilityBar({ bullish, bearish }: { bullish: number; bearish: number }) {
  return (
    <div className="space-y-1.5 min-w-[120px]">
      <div className="flex justify-between text-[10px] font-bold">
        <span className="text-profit">▲ {bullish}%</span>
        <span className="text-loss">▼ {bearish}%</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${bullish}%` }} />
      </div>
    </div>
  );
}

function RiskBadge({ score }: { score: number }) {
  const cfg = score >= 60
    ? { label: 'High Risk', cls: 'bg-red-50 text-red-600 border-red-200' }
    : score >= 40
    ? { label: 'Medium Risk', cls: 'bg-amber-50 text-amber-600 border-amber-200' }
    : { label: 'Low Risk', cls: 'bg-emerald-50 text-emerald-600 border-emerald-200' };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider ${cfg.cls}`}>
      {cfg.label} · {score}/100
    </span>
  );
}

function SentimentIcon({ sentiment }: { sentiment: string }) {
  if (sentiment === 'Positive') return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-200 uppercase tracking-wider flex items-center gap-1"><TrendingUp size={11} /> Bullish</span>;
  if (sentiment === 'Negative') return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-600 border border-red-200 uppercase tracking-wider flex items-center gap-1"><TrendingDown size={11} /> Bearish</span>;
  return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider flex items-center gap-1"><Minus size={11} /> Neutral</span>;
}

function VerdictBadge({ rec }: { rec: string }) {
  const map: Record<string, string> = {
    'Continue SIP': 'badge-green',
    'Watch Closely': 'badge-gold',
    'Review & Consider Pausing': 'badge-red',
    'Hold – Continue SIP': 'badge-green',
  };
  const cls = map[rec] || 'badge-indigo';
  return <span className={`badge ${cls} whitespace-nowrap`}>{rec}</span>;
}

export default function ExitDashboardPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = useCallback(() => {
    setLoading(true); setError(false);
    Promise.all([exitAlertsAPI.getAll(), exitAlertsAPI.getNews()])
      .then(([a, n]) => {
        setAlerts(a.data);
        setNews(n.data);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadData(); }, [loadData]);

  if (loading) return (
    <AppLayout>
      <div className="flex items-center justify-center py-32">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500 tracking-wide">Evaluating portfolio exit indicators...</p>
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
        <p className="font-bold text-slate-900 text-base">Backend Connection Failure</p>
        <button onClick={loadData} className="btn-flat flex items-center gap-2">
          <RefreshCw size={13} /> <span>Retry Sync</span>
        </button>
      </div>
    </AppLayout>
  );

  // Summary stats
  const totalInvested = alerts.reduce((sum, a) => sum + (a.invested_amount || 0), 0);
  const totalCurrent = alerts.reduce((sum, a) => sum + (a.current_value || 0), 0);
  const totalPnl = totalCurrent - totalInvested;
  const criticalAlerts = alerts.filter(a => a.exit_risk_score >= 60).length;

  return (
    <AppLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Exit Alerts & Audit</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Risk analysis, stops, and compound protection for your live holdings
            </p>
          </div>
          <button onClick={loadData} className="btn-flat-secondary flex items-center gap-1.5 py-2 text-xs">
            <RefreshCw size={13} /><span className="hidden sm:inline">Reload Scan</span>
          </button>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="space-y-1">
            <div className="metric-label">Valuation</div>
            <div className="text-2xl font-extrabold font-mono tracking-tight text-slate-900">{formatCurrency(totalCurrent)}</div>
          </div>
          <div className="space-y-1 sm:border-l border-slate-100 sm:pl-6">
            <div className="metric-label">Invested Principal</div>
            <div className="text-2xl font-extrabold font-mono tracking-tight text-slate-700">{formatCurrency(totalInvested)}</div>
          </div>
          <div className="space-y-1 lg:border-l border-slate-100 lg:pl-6">
            <div className="metric-label">Unrealised P&amp;L</div>
            <div className={`text-2xl font-extrabold font-mono tracking-tight ${totalPnl >= 0 ? 'text-profit' : 'text-loss'}`}>
              {totalPnl >= 0 ? '+' : ''}{formatCurrency(totalPnl)}
            </div>
          </div>
          <div className="space-y-1 sm:border-l border-slate-100 sm:pl-6">
            <div className="metric-label">Anomalies Detected</div>
            <div className={`text-2xl font-extrabold font-mono tracking-tight ${criticalAlerts > 0 ? 'text-amber-500' : 'text-profit'}`}>
              {criticalAlerts} / {alerts.length}
            </div>
          </div>
        </div>

        {/* Holdings Cards */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert size={15} className="text-blue-600" />
            <span>Active Position Risk Telemetry</span>
          </h3>

          {alerts.map((holding) => (
            <div key={holding.symbol} className="section-card">
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className="text-xs font-bold text-slate-900">{holding.company_name}</h4>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">{holding.holding_type}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono">{holding.symbol}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <RiskBadge score={holding.exit_risk_score} />
                  <SentimentIcon sentiment={holding.news_sentiment} />
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 py-4 border-y border-slate-100">
                <div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Invested Value</p>
                  <p className="text-xs font-bold font-mono text-slate-700">{formatCurrency(holding.invested_amount)}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Current Value</p>
                  <p className="text-xs font-bold font-mono text-slate-900">{formatCurrency(holding.current_value)}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Gain / Loss</p>
                  <p className={`text-xs font-bold font-mono ${holding.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                    {holding.pnl >= 0 ? '+' : ''}{formatCurrency(holding.pnl)}
                    <span className="text-[10px] ml-1">({formatPercent(holding.pnl_percent)})</span>
                  </p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Audit Confidence</p>
                  <p className="text-xs font-bold font-mono text-slate-900">{holding.confidence_score}%</p>
                </div>
              </div>

              {/* Probability Bar + Verdict + Link */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 max-w-xs">
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">AI Exit Odds</p>
                  <ProbabilityBar bullish={holding.bullish_probability} bearish={holding.bearish_probability} />
                </div>
                <div className="flex items-center gap-3">
                  <VerdictBadge rec={holding.recommendation} />
                  <Link
                    href={`/exit-alerts/${holding.symbol}`}
                    className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-wider"
                  >
                    <span>Full Audit</span> 
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* News Feed */}
        {news.length > 0 && (
          <div className="section-card">
            <h3 className="section-title flex items-center gap-2">
              <AlertTriangle size={15} className="text-amber-500" />
              <span>Risk Sentinel Alerts</span>
            </h3>
            <div className="space-y-3 mt-4">
              {news.map((item) => {
                const severityStyle = item.severity === 'High'
                  ? 'border-l-orange-500 bg-orange-50/50'
                  : item.severity === 'Medium'
                  ? 'border-l-amber-500 bg-amber-50/50'
                  : 'border-l-blue-500 bg-blue-50/50';
                return (
                  <div key={item.id} className={`border-l-4 pl-4 py-3 rounded-r-xl border border-slate-100 shadow-sm bg-white ${severityStyle}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-mono">{item.symbol}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            item.severity === 'High' ? 'bg-orange-50 text-orange-600'
                            : item.severity === 'Medium' ? 'bg-amber-50 text-amber-600'
                            : 'bg-blue-50 text-blue-600'
                          }`}>{item.severity} Risk</span>
                        </div>
                        <p className="text-xs font-bold text-slate-900 mb-1">{item.headline}</p>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{item.impact}</p>
                      </div>
                      <span className="text-[10px] text-slate-500 font-semibold flex-shrink-0 whitespace-nowrap">{item.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex items-start gap-2.5 max-w-3xl">
          <Info size={15} className="text-slate-500 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-slate-500 leading-relaxed">
            ⚠️ Not SEBI-registered advice. Exit probabilities are AI-generated estimates for decision support only.
            Market investments are volatile. Final exit decisions belong strictly to you.
          </p>
        </div>

      </div>
    </AppLayout>
  );
}
