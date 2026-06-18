'use client';
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
    <div className="space-y-1 min-w-[100px]">
      <div className="flex justify-between text-[10px] font-semibold">
        <span className="text-profit">▲ {bullish}%</span>
        <span className="text-loss">▼ {bearish}%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden bg-red-100">
        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${bullish}%` }} />
      </div>
    </div>
  );
}

function RiskBadge({ score }: { score: number }) {
  const cfg = score >= 70
    ? { label: 'High Risk', cls: 'bg-red-50 text-red-600 border-red-200' }
    : score >= 40
    ? { label: 'Medium Risk', cls: 'bg-amber-50 text-amber-700 border-amber-200' }
    : { label: 'Low Risk', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-bold ${cfg.cls}`}>
      {cfg.label} · {score}/100
    </span>
  );
}

function SentimentIcon({ sentiment }: { sentiment: string }) {
  if (sentiment === 'Positive') return <TrendingUp size={14} className="text-profit" />;
  if (sentiment === 'Negative') return <TrendingDown size={14} className="text-loss" />;
  return <Minus size={14} className="text-amber-500" />;
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

  const loadData = () => {
    setLoading(true); setError(false);
    Promise.all([exitAlertsAPI.getAll(), exitAlertsAPI.getNews()])
      .then(([a, n]) => {
        setAlerts(a.data);
        setNews(n.data);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  if (loading) return (
    <AppLayout>
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Loading exit analysis...</p>
        </div>
      </div>
    </AppLayout>
  );

  if (error) return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <WifiOff size={32} className="text-slate-300" />
        <p className="font-semibold text-slate-700">Backend offline</p>
        <p className="text-xs text-slate-500 font-mono">uvicorn app.main:app --reload</p>
        <button onClick={loadData} className="btn-flat flex items-center gap-2">
          <RefreshCw size={13} /> Retry
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
        <div className="flex justify-between items-end border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Exit Alert Dashboard</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Your real holdings — exit probability, risk scores & AI verdicts
            </p>
          </div>
          <button onClick={loadData} className="btn-flat-secondary flex items-center gap-1.5 py-2 text-xs">
            <RefreshCw size={13} /><span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* KPI Row */}
        <div className="metric-row">
          <div className="metric-block">
            <div className="metric-label">Total Holdings Value</div>
            <div className="metric-value mono text-slate-800">{formatCurrency(totalCurrent)}</div>
          </div>
          <div className="metric-block border-l border-slate-200 pl-8">
            <div className="metric-label">Total Invested</div>
            <div className="metric-value mono text-slate-600">{formatCurrency(totalInvested)}</div>
          </div>
          <div className="metric-block border-l border-slate-200 pl-8">
            <div className="metric-label">Overall P&amp;L</div>
            <div className={`metric-value mono font-semibold ${totalPnl >= 0 ? 'text-profit' : 'text-loss'}`}>
              {totalPnl >= 0 ? '+' : ''}{formatCurrency(totalPnl)}
            </div>
          </div>
          <div className="metric-block border-l border-slate-200 pl-8">
            <div className="metric-label">Holdings Needing Attention</div>
            <div className={`metric-value mono font-semibold ${criticalAlerts > 0 ? 'text-amber-600' : 'text-profit'}`}>
              {criticalAlerts} / {alerts.length}
            </div>
          </div>
        </div>

        {/* Holdings Cards — mobile-friendly card layout */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <ShieldAlert size={16} className="text-blue-600" />
            Your Holdings — Exit Analysis
          </h3>

          {alerts.map((holding) => (
            <div key={holding.symbol} className="section-card hover:shadow-sm transition-shadow">
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className="text-sm font-bold text-slate-800">{holding.company_name}</h4>
                    <span className="badge-indigo">{holding.holding_type}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{holding.symbol}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <RiskBadge score={holding.exit_risk_score} />
                  <SentimentIcon sentiment={holding.news_sentiment} />
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 py-4 border-y border-slate-100">
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide mb-0.5">Invested</p>
                  <p className="text-sm font-bold font-mono text-slate-700">{formatCurrency(holding.invested_amount)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide mb-0.5">Current Value</p>
                  <p className="text-sm font-bold font-mono text-slate-800">{formatCurrency(holding.current_value)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide mb-0.5">P&amp;L</p>
                  <p className={`text-sm font-bold font-mono ${holding.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                    {holding.pnl >= 0 ? '+' : ''}{formatCurrency(holding.pnl)}
                    <span className="text-xs ml-1">({formatPercent(holding.pnl_percent)})</span>
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide mb-0.5">Confidence</p>
                  <p className="text-sm font-bold font-mono text-slate-700">{holding.confidence_score}%</p>
                </div>
              </div>

              {/* Probability Bar + Verdict + Link */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 max-w-xs">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide mb-1.5">Exit Probability</p>
                  <ProbabilityBar bullish={holding.bullish_probability} bearish={holding.bearish_probability} />
                </div>
                <div className="flex items-center gap-3">
                  <VerdictBadge rec={holding.recommendation} />
                  <Link
                    href={`/exit-alerts/${holding.symbol}`}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Full Audit <ArrowRight size={12} />
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
              Portfolio News &amp; Risk Alerts
            </h3>
            <div className="space-y-3">
              {news.map((item) => {
                const severityStyle = item.severity === 'High'
                  ? 'border-l-orange-500 bg-orange-50/30'
                  : item.severity === 'Medium'
                  ? 'border-l-amber-400 bg-amber-50/20'
                  : 'border-l-blue-400 bg-blue-50/20';
                return (
                  <div key={item.id} className={`border-l-4 pl-4 py-3 rounded-r border border-slate-100 ${severityStyle}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{item.symbol}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            item.severity === 'High' ? 'bg-orange-100 text-orange-700'
                            : item.severity === 'Medium' ? 'bg-amber-100 text-amber-700'
                            : 'bg-blue-100 text-blue-700'
                          }`}>{item.severity}</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-800 mb-1">{item.headline}</p>
                        <p className="text-[11px] text-slate-500 leading-normal">{item.impact}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 flex-shrink-0 whitespace-nowrap">{item.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="p-4 rounded border border-slate-200 bg-slate-50 flex items-start gap-2.5">
          <Info size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
          <p className="text-[11.5px] text-slate-500 leading-normal">
            ⚠️ Not SEBI-registered advice. Exit probabilities are AI-generated estimates for decision support only.
            Market investments are volatile. Final exit decisions belong strictly to you.
          </p>
        </div>

      </div>
    </AppLayout>
  );
}
