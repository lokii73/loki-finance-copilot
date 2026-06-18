'use client';
import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { mutualFundsAPI, portfolioAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import {
  Sparkles, Info, ShieldCheck, AlertTriangle,
  Coins, RefreshCw, WifiOff, CheckCircle2, XCircle,
  TrendingUp, ChevronDown, ChevronUp
} from 'lucide-react';

// ── Verdict badge ────────────────────────────────────────────────
function VerdictBadge({ verdict }: { verdict: string }) {
  const map: Record<string, string> = {
    'Strong SIP Candidate': 'badge-green',
    'Continue SIP':         'badge-green',
    'Good for Long Term':   'badge-green',
    'Hold':                 'badge-gold',
    'Review':               'badge-gold',
    'Avoid':                'badge-red',
    'Avoid Fresh Buy':      'badge-red',
    'Pause SIP':            'badge-red',
  };
  const cls = Object.entries(map).find(([k]) => verdict.includes(k))?.[1] || 'badge-indigo';
  return <span className={`badge ${cls} whitespace-nowrap`}>{verdict}</span>;
}

// ── Fund detail expandable card ────────────────────────────────
function FundCard({ fund, sips }: { fund: any; sips: any }) {
  const [expanded, setExpanded] = useState(false);
  const sipDetail = sips?.sips?.find((s: any) => s.scheme_code === fund.scheme_code);
  const pnl = (fund.current_value || 0) - (fund.invested_amount || 0);
  const pnlPct = fund.invested_amount > 0 ? (pnl / fund.invested_amount) * 100 : 0;
  const positive = pnl >= 0;

  const riskColor = fund.risk_level === 'High' ? 'text-red-500'
    : fund.risk_level === 'Medium' ? 'text-amber-500' : 'text-emerald-500';

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden hover:border-slate-300 transition-colors">
      {/* Main Row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 bg-white hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h4 className="text-sm font-bold text-slate-800">{fund.scheme_name}</h4>
              <VerdictBadge verdict={fund.verdict} />
            </div>
            <div className="flex flex-wrap gap-3 text-[11px] text-slate-500">
              <span className="font-semibold">{fund.sub_category}</span>
              <span>•</span>
              <span>Expense: <span className="font-mono text-slate-700">{fund.expense_ratio}%</span></span>
              <span>•</span>
              <span className={`font-semibold ${riskColor}`}>{fund.risk_level} Risk</span>
              {fund.aum_cr && <><span>•</span><span>AUM ₹{fund.aum_cr.toLocaleString('en-IN')} Cr</span></>}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className={`text-sm font-bold font-mono ${positive ? 'text-profit' : 'text-loss'}`}>
              {positive ? '+' : ''}{pnl.toFixed(2) !== 'NaN' ? `₹${pnl.toFixed(2)}` : '—'}
            </p>
            <p className={`text-[10px] font-semibold ${positive ? 'text-profit' : 'text-loss'}`}>
              {positive ? '+' : ''}{pnlPct.toFixed(2)}%
            </p>
            {expanded ? <ChevronUp size={14} className="text-slate-400 mt-1 ml-auto" />
              : <ChevronDown size={14} className="text-slate-400 mt-1 ml-auto" />}
          </div>
        </div>
      </button>

      {/* Expanded Detail */}
      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50/30 p-4 space-y-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Invested', value: `₹${formatCurrency(fund.invested_amount)}` },
              { label: 'Current NAV', value: `₹${fund.current_nav}`, mono: true },
              { label: '3Y CAGR', value: `+${fund.cagr_3y}%`, color: 'text-profit' },
              { label: 'Monthly SIP', value: sipDetail ? `₹${sipDetail.monthly_amount}/mo` : 'No SIP' },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded border border-slate-100 p-3 text-center">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide mb-0.5">{stat.label}</p>
                <p className={`text-sm font-bold font-mono ${stat.color || 'text-slate-800'}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Fund Manager + AUM row */}
          <div className="flex flex-wrap gap-4 text-xs text-slate-600 py-2 border-y border-slate-100">
            {fund.fund_manager && (
              <span>👤 <strong>Fund Manager:</strong> {fund.fund_manager}</span>
            )}
            {fund.aum_cr && (
              <span>📦 <strong>AUM:</strong> ₹{fund.aum_cr.toLocaleString('en-IN')} Cr</span>
            )}
            {fund.max_drawdown && (
              <span>📉 <strong>Max Drawdown:</strong> {fund.max_drawdown}%</span>
            )}
          </div>

          {/* AI Verdict Reason */}
          {fund.verdict_reason && (
            <div className="flex items-start gap-2 p-3 rounded bg-blue-50/50 border border-blue-100">
              <Sparkles size={13} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-slate-700 leading-relaxed">{fund.verdict_reason}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MutualFundsPage() {
  const [funds, setFunds] = useState<any[]>([]);
  const [sips, setSips] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadData = () => {
    setLoading(true); setError(false);
    Promise.all([mutualFundsAPI.getAll(), portfolioAPI.getSIPs()])
      .then(([f, s]) => { setFunds(f.data); setSips(s.data); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const recommendedBuyList = [
    {
      name: 'UTI Nifty 50 Index Fund (Direct Growth)',
      category: 'Index / Large Cap',
      cagr: '12.2%',
      expense: '0.21%',
      aum: '₹19,800 Cr',
      action: 'Strong Buy',
      badge: 'badge-green',
      why: 'Your #1 missing piece. Zero large-cap anchor in current portfolio. Low-cost passive compounder. Start ₹500/month SIP immediately.',
      forYou: true,
    },
    {
      name: 'Parag Parikh Flexi Cap Fund (Direct Growth)',
      category: 'Flexi Cap',
      cagr: '15.8%',
      expense: '0.58%',
      aum: '₹76,400 Cr',
      action: 'Strong Buy',
      badge: 'badge-green',
      why: 'Built-in international diversification (20% in Google, Amazon, etc.). Sole flexi-cap fund covering all market caps. Ideal 2nd SIP after Nifty 50.',
      forYou: true,
    },
    {
      name: 'Nippon India Small Cap Fund (Direct Growth)',
      category: 'Small Cap',
      cagr: '22.4%',
      expense: '0.68%',
      aum: '₹54,600 Cr',
      action: 'Tactical SIP',
      badge: 'badge-indigo',
      why: 'Highest growth potential. Add only after establishing large-cap and flexi-cap base. Start ₹200/month as a long-term satellite holding.',
      forYou: false,
    },
    {
      name: 'Mirae Asset Emerging Bluechip Fund (Direct Growth)',
      category: 'Large & Mid Cap',
      cagr: '19.1%',
      expense: '0.62%',
      aum: '₹35,600 Cr',
      action: 'Consider After 6 Months',
      badge: 'badge-gold',
      why: 'Balanced large+mid cap exposure. Good bridge fund once Nifty 50 SIP is established. Not urgent — build fundamentals first.',
      forYou: false,
    },
    {
      name: 'Aditya Birla Sun Life PSU Equity Fund',
      category: 'Thematic — PSU',
      cagr: '12.4%',
      expense: '0.48%',
      aum: '₹4,800 Cr',
      action: 'Avoid Fresh Buy',
      badge: 'badge-red',
      why: 'You already hold this at ₹25/month. Do not increase. PSU sector re-rating cycle may be maturing. Thematic fund not suitable as core holding.',
      forYou: false,
    },
  ];

  const riskTemplates = [
    {
      title: 'Conservative',
      allocation: '60% Index + 30% Liquid + 10% Gold',
      color: 'border-emerald-200 bg-emerald-50/30',
      labelColor: 'text-emerald-700',
      description: 'Capital preservation focus. For timelines under 3 years.',
    },
    {
      title: 'Balanced (Recommended for You)',
      allocation: '40% Index + 30% Flexi Cap + 20% Mid Cap + 10% Gold',
      color: 'border-blue-200 bg-blue-50/30',
      labelColor: 'text-blue-700',
      description: 'Best fit for Logesh — 20-year horizon + moderate risk tolerance.',
    },
    {
      title: 'Aggressive',
      allocation: '30% Flexi Cap + 35% Mid Cap + 25% Small Cap + 10% Index',
      color: 'border-orange-200 bg-orange-50/30',
      labelColor: 'text-orange-700',
      description: 'Maximum compounding. Very high volatility. Only for 15+ year view.',
    },
  ];

  if (loading) return (
    <AppLayout>
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Loading fund analysis...</p>
        </div>
      </div>
    </AppLayout>
  );

  if (error) return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <WifiOff size={32} className="text-slate-300" />
        <p className="font-semibold text-slate-700">Backend offline</p>
        <button onClick={loadData} className="btn-flat flex items-center gap-2">
          <RefreshCw size={13} /> Retry
        </button>
      </div>
    </AppLayout>
  );

  return (
    <AppLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex justify-between items-end border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Mutual Fund Analyzer</h1>
            <p className="text-xs text-slate-500 mt-0.5">Your holdings + recommended funds + overlap audit</p>
          </div>
          <button onClick={loadData} className="btn-flat-secondary flex items-center gap-1.5 py-2 text-xs">
            <RefreshCw size={13} /><span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* 🔴 Overlap Alert Banner */}
        <div className="flex items-start gap-3 p-4 rounded-lg border border-amber-200 bg-amber-50/50">
          <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-slate-800 mb-1">⚠️ Overlap Alert — Triple Midcap Concentration Detected</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              You hold <strong>Motilal Oswal Midcap</strong> + <strong>HDFC Mid Cap</strong> (both active mid-cap) — overlapping the same segment. This spreads capital without reducing risk.
              <strong> Prescription:</strong> Both are good funds. Your real gap is zero large-cap exposure. Add UTI Nifty 50 Index Fund ₹500/month as priority #1.
            </p>
          </div>
        </div>

        {/* Your Portfolio Funds */}
        <div className="section-card">
          <h3 className="section-title flex items-center gap-2">
            <TrendingUp size={15} className="text-blue-600" />
            Your Active Fund Holdings
            <span className="text-[11px] font-normal text-slate-400 ml-1">(tap to expand full analysis)</span>
          </h3>
          <div className="space-y-2">
            {funds.length > 0
              ? funds.map(f => <FundCard key={f.scheme_code} fund={f} sips={sips} />)
              : <p className="text-xs text-slate-400 py-4 text-center">No funds loaded from backend.</p>
            }
          </div>
        </div>

        {/* Recommended Buy List */}
        <div className="section-card">
          <h3 className="section-title flex items-center gap-2">
            <Sparkles size={15} className="text-blue-600" />
            AI Recommended Funds — What to Add Next
          </h3>
          <div className="space-y-3">
            {recommendedBuyList.map((rec) => (
              <div key={rec.name}
                className={`p-4 rounded-lg border ${rec.forYou ? 'border-blue-200 bg-blue-50/30' : 'border-slate-100 bg-slate-50/30'}`}>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <h4 className="text-xs font-bold text-slate-800">{rec.name}</h4>
                      {rec.forYou && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white">For You</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">{rec.category} • Exp {rec.expense} • AUM {rec.aum}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-bold font-mono text-profit">{rec.cagr} CAGR</span>
                    <span className={`badge ${rec.badge}`}>{rec.action}</span>
                  </div>
                </div>
                <p className="text-[11.5px] text-slate-600 leading-relaxed">{rec.why}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Model Portfolios + Overlap Audit side-by-side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Model Allocation Templates */}
          <div className="section-card">
            <h3 className="section-title flex items-center gap-2">
              <Coins size={15} className="text-blue-600" />
              Model Portfolio Templates
            </h3>
            <div className="space-y-3">
              {riskTemplates.map(t => (
                <div key={t.title} className={`p-4 rounded-lg border ${t.color}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className={`text-xs font-bold ${t.labelColor}`}>{t.title}</p>
                  </div>
                  <p className="text-[10px] font-mono text-slate-600 font-semibold mb-1.5">{t.allocation}</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{t.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Category Coverage */}
          <div className="section-card">
            <h3 className="section-title flex items-center gap-2">
              <ShieldCheck size={15} className="text-blue-600" />
              Category Coverage Audit
            </h3>
            <div className="space-y-2">
              {[
                { cat: 'Large Cap / Index Fund', covered: false, urgency: 'Critical gap — add now' },
                { cat: 'Flexi Cap', covered: false, urgency: 'High priority — add within 3 months' },
                { cat: 'Mid Cap (Active)', covered: true, urgency: 'Covered — HDFC Mid Cap + Motilal (84.8% of portfolio)' },
                { cat: 'Small Cap', covered: true, urgency: 'Covered — Nippon India Small Cap (14.1% of portfolio)' },
                { cat: 'Large Cap / Index Fund', covered: false, urgency: '🔴 Critical gap — start UTI Nifty 50 SIP this month' },
                { cat: 'Thematic / Sectoral', covered: true, urgency: 'Covered — ABSL PSU (review)' },
                { cat: 'Debt / Liquid Fund', covered: false, urgency: 'Emergency fund — needed before SIP increase' },
                { cat: 'International', covered: false, urgency: 'Add via PPFAS Flexi Cap indirectly' },
                { cat: 'Gold Fund', covered: false, urgency: 'Long-term — consider 5-10% allocation after ₹50K portfolio' },
              ].map(item => (
                <div key={item.cat} className="flex items-start gap-2.5 py-2 border-b border-slate-50 last:border-none">
                  {item.covered
                    ? <CheckCircle2 size={13} className="text-profit mt-0.5 flex-shrink-0" />
                    : <XCircle size={13} className="text-slate-300 mt-0.5 flex-shrink-0" />}
                  <div>
                    <p className={`text-xs font-semibold ${item.covered ? 'text-slate-700' : 'text-slate-500'}`}>{item.cat}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.urgency}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-4 rounded border border-slate-200 bg-slate-50 flex items-start gap-2.5">
          <Info size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
          <p className="text-[11.5px] text-slate-500 leading-normal">
            ⚠️ Not SEBI-registered advice. CAGR figures are historical — past performance does not guarantee future returns. Final investment decisions are yours.
          </p>
        </div>

      </div>
    </AppLayout>
  );
}
