'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { exitAlertsAPI } from '@/lib/api';
import { formatCurrency, formatPercent } from '@/lib/utils';
import {
  ArrowLeft, Info, CheckCircle2, XCircle, RefreshCw, WifiOff,
  TrendingUp, TrendingDown, ShieldCheck, AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

function StatBox({ label, value, sub, color = 'text-slate-800' }: {
  label: string; value: string; sub?: string; color?: string;
}) {
  return (
    <div className="section-card p-4 text-center">
      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-base font-bold font-mono ${color}`}>{value}</p>
      {sub && <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function ProbabilityMeter({ value, color, label }: { value: number; color: string; label: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-slate-500 font-medium">{label}</span>
        <span className="font-bold font-mono" style={{ color }}>{value}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color, transition: 'width 0.8s ease' }} />
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

  const loadData = () => {
    if (!symbol) return;
    setLoading(true); setError(false);
    exitAlertsAPI.getDetail(symbol)
      .then(r => setHolding(r.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, [symbol]);

  if (loading) return (
    <AppLayout>
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
      </div>
    </AppLayout>
  );

  if (error || !holding) return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <WifiOff size={32} className="text-slate-300" />
        <p className="font-semibold text-slate-700">Holding not found or backend offline</p>
        <Link href="/exit-alerts" className="btn-flat text-sm flex items-center gap-2">
          <ArrowLeft size={13} /> Back to Exit Alerts
        </Link>
      </div>
    </AppLayout>
  );

  const pnlPositive = holding.pnl >= 0;

  return (
    <AppLayout>
      <div className="space-y-6">

        {/* Back */}
        <Link href="/exit-alerts" className="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold hover:text-blue-700">
          <ArrowLeft size={13} /> Back to Exit Alerts
        </Link>

        {/* Header */}
        <div className="border-b border-slate-200 pb-4">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-slate-800">{holding.company_name}</h1>
            <span className="badge-indigo">{holding.holding_type}</span>
          </div>
          <p className="text-xs text-slate-500">Full holding audit — AI-powered exit analysis</p>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatBox label="Invested" value={formatCurrency(holding.invested_amount)} />
          <StatBox
            label="Current Value"
            value={formatCurrency(holding.current_value)}
            color="text-slate-800"
          />
          <StatBox
            label="Unrealised P&L"
            value={`${pnlPositive ? '+' : ''}${formatCurrency(holding.pnl)}`}
            sub={formatPercent(holding.pnl_percent)}
            color={pnlPositive ? 'text-profit' : 'text-loss'}
          />
          <StatBox
            label="Confidence"
            value={`${holding.confidence_score}%`}
            sub="AI model confidence"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left: Exit Strategy */}
          <div className="section-card space-y-5">
            <h3 className="section-title">Exit Strategy Engine</h3>

            {/* Probability Meters */}
            <div className="space-y-3">
              <ProbabilityMeter value={holding.bullish_probability} color="#00b074" label="Bullish Probability" />
              <ProbabilityMeter value={holding.bearish_probability} color="#df514c" label="Bearish Probability" />
              <ProbabilityMeter value={holding.exit_probability} color="#f59e0b" label="Exit Probability" />
            </div>

            {/* Verdict */}
            <div className="p-3.5 rounded border border-blue-100 bg-blue-50/40">
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">AI Verdict</p>
              <p className="text-sm font-bold text-slate-800">{holding.recommendation}</p>
            </div>

            {/* Verdict Reason */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Analysis</p>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded border border-slate-100">
                {holding.verdict_reason}
              </p>
            </div>

            {/* ETF-specific: Stop Loss & Target */}
            {holding.stop_loss && (
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Stop-Loss</p>
                  <p className="text-sm font-bold font-mono text-loss">₹{holding.stop_loss}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Target Price</p>
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
                <ShieldCheck size={15} className="text-blue-600" />
                Profit Booking Advice
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded border border-slate-100">
                {holding.profit_booking_advice}
              </p>
            </div>

            {/* Technical Summary */}
            {holding.technical_summary && (
              <div className="section-card">
                <h3 className="section-title">Technical Summary</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{holding.technical_summary}</p>
              </div>
            )}
          </div>
        </div>

        {/* Risk Factors + Positives */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {holding.risk_factors?.length > 0 && (
            <div className="section-card">
              <h3 className="section-title flex items-center gap-2">
                <AlertTriangle size={14} className="text-red-500" />
                Risk Factors
              </h3>
              <div className="space-y-2">
                {holding.risk_factors.map((r: string, i: number) => (
                  <div key={i} className="flex items-start gap-2">
                    <XCircle size={13} className="text-loss mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-slate-600">{r}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {holding.positives?.length > 0 && (
            <div className="section-card">
              <h3 className="section-title flex items-center gap-2">
                <TrendingUp size={14} className="text-profit" />
                Positives
              </h3>
              <div className="space-y-2">
                {holding.positives.map((p: string, i: number) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-profit mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-slate-600">{p}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="p-4 rounded border border-slate-200 bg-slate-50 flex items-start gap-2.5">
          <Info size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
          <p className="text-[11.5px] text-slate-500 leading-normal">
            ⚠️ Not SEBI-registered financial advice. Exit probabilities are AI-generated estimates for decision support only.
            Market investments are volatile. Final decisions belong strictly to you.
          </p>
        </div>

      </div>
    </AppLayout>
  );
}
