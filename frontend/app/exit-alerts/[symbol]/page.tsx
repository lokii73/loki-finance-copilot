'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { exitAlertsAPI } from '@/lib/api';
import { formatCurrency, formatPercent } from '@/lib/utils';
import {
  ArrowLeft, Info, CheckCircle2, XCircle, RefreshCw, WifiOff,
  TrendingUp, ShieldCheck, AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

function StatBox({ label, value, sub, color = 'text-white' }: {
  label: string; value: string; sub?: string; color?: string;
}) {
  return (
    <div className="section-card p-4 text-center flex flex-col justify-center">
      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-base font-extrabold font-mono ${color}`}>{value}</p>
      {sub && <p className="text-[10px] text-slate-400 font-semibold mt-1">{sub}</p>}
    </div>
  );
}

function ProbabilityMeter({ value, color, label }: { value: number; color: string; label: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-bold">
        <span className="text-slate-400">{label}</span>
        <span className="font-mono" style={{ color }}>{value}%</span>
      </div>
      <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden border border-white/[0.02]">
        <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color, transition: 'width 0.8s ease', boxShadow: `0 0 6px ${color}` }} />
      </div>
    </div>
  );
}

export default function HoldingAuditPage() {
  const params = useParams();
  const symbol = params.symbol as string;
  const [holding, setHolding] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = useCallback(() => {
    if (!symbol) return;
    setLoading(true); setError(false);
    exitAlertsAPI.getDetail(symbol)
      .then(r => setHolding(r.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [symbol]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadData(); }, [loadData]);

  if (loading) return (
    <AppLayout>
      <div className="flex items-center justify-center py-32">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-400 tracking-wide">Retrieving asset telemetry...</p>
        </div>
      </div>
    </AppLayout>
  );

  if (error || !holding) return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center py-24 gap-5">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <WifiOff size={24} className="text-red-400 animate-pulse" />
        </div>
        <p className="font-bold text-white text-base">Holding Not Found / System Offline</p>
        <Link href="/exit-alerts" className="btn-flat text-xs flex items-center gap-1.5">
          <ArrowLeft size={13} /> <span>Back to Exit Alerts</span>
        </Link>
      </div>
    </AppLayout>
  );

  const pnlPositive = holding.pnl >= 0;

  return (
    <AppLayout>
      <div className="space-y-6">

        {/* Back */}
        <Link href="/exit-alerts" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={13} /> Back to Exit Alerts
        </Link>

        {/* Header */}
        <div className="border-b border-white/[0.06] pb-4">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-xl font-extrabold tracking-tight text-white">{holding.company_name}</h1>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/[0.04] text-slate-400 border border-white/[0.06] uppercase tracking-wider">{holding.holding_type}</span>
          </div>
          <p className="text-xs text-slate-450 uppercase tracking-wider font-semibold">Asset Exit Audit — AI telemetry breakdown</p>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatBox label="Invested Capital" value={formatCurrency(holding.invested_amount)} />
          <StatBox
            label="Current Valuation"
            value={formatCurrency(holding.current_value)}
            color="text-white"
          />
          <StatBox
            label="Holding Returns"
            value={`${pnlPositive ? '+' : ''}${formatCurrency(holding.pnl)}`}
            sub={formatPercent(holding.pnl_percent)}
            color={pnlPositive ? 'text-profit' : 'text-loss'}
          />
          <StatBox
            label="Scan Confidence"
            value={`${holding.confidence_score}%`}
            sub="Model Accuracy Rate"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left: Exit Strategy */}
          <div className="section-card space-y-5">
            <h3 className="section-title">Exit Strategy Engine</h3>

            {/* Probability Meters */}
            <div className="space-y-4">
              <ProbabilityMeter value={holding.bullish_probability} color="#10b981" label="Bullish Odds" />
              <ProbabilityMeter value={holding.bearish_probability} color="#ef4444" label="Bearish Odds" />
              <ProbabilityMeter value={holding.exit_probability} color="#f59e0b" label="AI Recommended Exit Odds" />
            </div>

            {/* Verdict */}
            <div className="p-4 rounded-xl border border-blue-500/15 bg-blue-500/[0.02]">
              <p className="text-[9px] font-bold text-blue-400 uppercase tracking-wider mb-1">AI Verdict</p>
              <p className="text-xs font-bold text-white">{holding.recommendation}</p>
            </div>

            {/* Verdict Reason */}
            <div>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-2">Technical Rationale</p>
              <p className="text-xs text-slate-300 leading-relaxed bg-white/[0.01] p-3 rounded-xl border border-white/[0.04]">
                {holding.verdict_reason}
              </p>
            </div>

            {/* ETF-specific: Stop Loss & Target */}
            {holding.stop_loss && (
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/[0.04]">
                <div>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Technical Stop-Loss</p>
                  <p className="text-sm font-bold font-mono text-loss">₹{holding.stop_loss}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Technical Target Price</p>
                  <p className="text-sm font-bold font-mono text-profit">₹{holding.target_price}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Profit Booking + Risk/Positives */}
          <div className="space-y-4">

            {/* Profit Booking Advice */}
            <div className="section-card">
              <h3 className="section-title flex items-center gap-2">
                <ShieldCheck size={15} className="text-blue-400" />
                <span>AI Compound & Exit Strategy Advice</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed bg-white/[0.01] p-3.5 rounded-xl border border-white/[0.04] mt-2">
                {holding.profit_booking_advice}
              </p>
            </div>

            {/* Technical Summary */}
            {holding.technical_summary && (
              <div className="section-card">
                <h3 className="section-title">Technical Overlap Summary</h3>
                <p className="text-xs text-slate-300 leading-relaxed mt-2">{holding.technical_summary}</p>
              </div>
            )}
          </div>
        </div>

        {/* Risk Factors + Positives */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {holding.risk_factors?.length > 0 && (
            <div className="section-card">
              <h3 className="section-title flex items-center gap-2">
                <AlertTriangle size={14} className="text-red-400" />
                <span>Risk Vectors</span>
              </h3>
              <div className="space-y-2 mt-4">
                {holding.risk_factors.map((r: string, i: number) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <XCircle size={13} className="text-red-400 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-slate-300 leading-normal">{r}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {holding.positives?.length > 0 && (
            <div className="section-card">
              <h3 className="section-title flex items-center gap-2">
                <TrendingUp size={14} className="text-emerald-400" />
                <span>Bullish Anchors</span>
              </h3>
              <div className="space-y-2 mt-4">
                {holding.positives.map((p: string, i: number) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 size={13} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-slate-300 leading-normal">{p}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.01] flex items-start gap-2.5 max-w-3xl">
          <Info size={15} className="text-slate-400 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-slate-450 leading-relaxed">
            ⚠️ Not SEBI-registered financial advice. Exit probabilities are AI-generated estimates for decision support only.
            Market investments are volatile. Final decisions belong strictly to you.
          </p>
        </div>

      </div>
    </AppLayout>
  );
}
