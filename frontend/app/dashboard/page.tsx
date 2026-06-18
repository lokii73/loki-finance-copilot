'use client';
import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { portfolioAPI, marketAPI } from '@/lib/api';
import { formatCurrency, formatPercent } from '@/lib/utils';
import {
  TrendingUp, TrendingDown, Info, AlertTriangle,
  CheckCircle2, ArrowRight, RefreshCw, WifiOff
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import Link from 'next/link';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444'];

export default function DashboardPage() {
  const [overview, setOverview] = useState<any>(null);
  const [snapshots, setSnapshots] = useState<any[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [indices, setIndices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    setError(false);
    try {
      const [ov, snap, an, idx] = await Promise.all([
        portfolioAPI.getOverview(),
        portfolioAPI.getSnapshots(60),
        portfolioAPI.analyze(),
        marketAPI.getIndices(),
      ]);
      setOverview(ov.data);
      setSnapshots(snap.data);
      setAnalysis(an.data);
      setIndices(idx.data);
    } catch (e) {
      console.error(e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <AppLayout>
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="text-xs font-medium text-slate-500">Loading portfolio...</p>
        </div>
      </div>
    </AppLayout>
  );

  if (error) return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <WifiOff size={32} className="text-slate-300" />
        <div className="text-center">
          <p className="font-semibold text-slate-700">Backend is offline</p>
          <p className="text-xs text-slate-500 mt-1">Make sure the FastAPI server is running on port 8000</p>
          <p className="text-xs text-slate-400 mt-1 font-mono">cd backend && uvicorn app.main:app --reload</p>
        </div>
        <button onClick={loadData} className="btn-flat flex items-center gap-2 mt-2">
          <RefreshCw size={14} />
          Try Again
        </button>
      </div>
    </AppLayout>
  );

  const isProfit = (overview?.total_pnl || 0) >= 0;

  const allocationData = analysis ? [
    { name: 'Mutual Funds', value: analysis.asset_allocation?.mutual_funds_percent || 89 },
    { name: 'ETF / Stocks', value: analysis.asset_allocation?.stocks_percent || 11 },
  ] : [];

  return (
    <AppLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex justify-between items-end border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-xs text-slate-500 mt-0.5">Your Angel One portfolio — live snapshot</p>
          </div>
          <button onClick={loadData} className="btn-flat-secondary flex items-center gap-1.5 py-2 text-xs">
            <RefreshCw size={13} />
            <span className="hidden sm:inline">Sync Portfolio</span>
          </button>
        </div>

        {/* Market Indices ticker */}
        {indices.length > 0 && (
          <div className="flex gap-4 overflow-x-auto pb-1">
            {indices.slice(0, 4).map((idx: any) => (
              <div key={idx.name} className="flex-shrink-0 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded px-3 py-2">
                <span className="text-xs font-semibold text-slate-700">{idx.name}</span>
                <span className="font-mono text-xs font-bold text-slate-800">{idx.value?.toLocaleString('en-IN')}</span>
                <span className={`text-xs font-semibold ${idx.change_percent >= 0 ? 'text-profit' : 'text-loss'}`}>
                  {idx.change_percent >= 0 ? '+' : ''}{idx.change_percent?.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        )}

        {/* KPI Metrics */}
        <div className="metric-row">
          <div className="metric-block">
            <div className="metric-label">Total Portfolio Value</div>
            <div className="metric-value mono font-semibold text-slate-800">
              {formatCurrency(overview?.total_value || 0)}
            </div>
          </div>
          <div className="metric-block border-l border-slate-200 pl-8">
            <div className="metric-label">Total Invested</div>
            <div className="metric-value mono text-slate-600">
              {formatCurrency(overview?.total_invested || 0)}
            </div>
          </div>
          <div className="metric-block border-l border-slate-200 pl-8">
            <div className="metric-label">Overall P&amp;L</div>
            <div className={`metric-value mono font-semibold ${isProfit ? 'text-profit' : 'text-loss'}`}>
              {isProfit ? '+' : ''}{formatCurrency(overview?.total_pnl || 0)}
              <span className="text-sm font-medium ml-2">
                ({formatPercent(overview?.total_pnl_percent || 0)})
              </span>
            </div>
          </div>
          <div className="metric-block border-l border-slate-200 pl-8">
            <div className="metric-label">Today&apos;s Change</div>
            <div className={`metric-value mono font-semibold ${(overview?.today_change || 0) >= 0 ? 'text-profit' : 'text-loss'}`}>
              {(overview?.today_change || 0) >= 0 ? '+' : ''}{formatCurrency(overview?.today_change || 0)}
              <span className="text-sm font-medium ml-2">
                ({formatPercent(overview?.today_change_percent || 0)})
              </span>
            </div>
          </div>
        </div>

        {/* Chart + Allocation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 section-card">
            <h3 className="section-title">Portfolio Growth Chart (60 days)</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={snapshots}>
                  <defs>
                    <linearGradient id="chartBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.08} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.00} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false}
                    tickFormatter={(v) => v?.slice(5)} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false}
                    tickFormatter={(v) => `₹${v}`} width={50} />
                  <Tooltip formatter={(v: any) => [`₹${v}`, 'Portfolio Value']}
                    contentStyle={{ fontSize: 12, border: '1px solid #e2e8f0' }} />
                  <Area type="monotone" dataKey="total_value" stroke="#2563eb"
                    fill="url(#chartBlue)" strokeWidth={2} name="Portfolio Value" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="section-card">
            <h3 className="section-title">Asset Allocation</h3>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={allocationData} cx="50%" cy="50%" innerRadius={32} outerRadius={58}
                    dataKey="value" paddingAngle={3}>
                    {allocationData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`${v}%`, '']}
                    contentStyle={{ fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Mutual Funds</span>
                <span className="font-semibold font-mono text-slate-700">{formatCurrency(overview?.mf_value || 1852)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ETF (HDFCMID150)</span>
                <span className="font-semibold font-mono text-slate-700">{formatCurrency(overview?.stocks_value || 225)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Insights + Positions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="section-card">
            <h3 className="section-title">AI Portfolio Insights</h3>
            <div className="space-y-3">
              <div className="p-3.5 rounded border border-red-200 bg-red-50/50 flex items-start gap-3">
                <AlertTriangle size={15} className="text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-slate-800">⚠️ Midcap Concentration Risk</h4>
                  <p className="text-[11.5px] text-slate-500 leading-normal mt-0.5">
                    84.8% of your portfolio is in mid+small cap assets. Add a Nifty 50 Index Fund SIP (₹500/month) — your #1 missing piece.
                  </p>
                </div>
              </div>
              <div className="p-3.5 rounded border border-amber-200 bg-amber-50/40 flex items-start gap-3">
                <Info size={15} className="text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-slate-800">Review ABSL PSU SIP</h4>
                  <p className="text-[11.5px] text-slate-500 leading-normal mt-0.5">
                    Thematic PSU fund carries election-cycle risk. At ₹25/month, impact is small — but avoid increasing this SIP.
                  </p>
                </div>
              </div>
              <div className="p-3.5 rounded border border-emerald-200 bg-emerald-50/50 flex items-start gap-3">
                <CheckCircle2 size={15} className="text-profit mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-slate-800">✅ Great SIP Discipline</h4>
                  <p className="text-[11.5px] text-slate-500 leading-normal mt-0.5">
                    Investing via Direct plans at 21 is excellent. Time is your biggest asset — stay consistent.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="section-card">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
              <h3 className="section-title" style={{ marginBottom: 0, borderBottom: 'none', paddingBottom: 0 }}>Active Positions</h3>
              <Link href="/exit-alerts" className="text-xs text-blue-600 font-medium flex items-center gap-1">
                View Analysis <ArrowRight size={12} />
              </Link>
            </div>
            <div className="space-y-3">
              {[
                { name: 'Motilal Oswal Midcap Fund',    type: 'SIP ₹500/month',  pnl: '-₹20.33 (-2.03%)', positive: false },
                { name: 'HDFC Mid-Cap Opportunities', type: 'SIP ₹800/month',  pnl: '+₹4.75 (+0.59%)',  positive: true  },
                { name: 'Nippon India Small Cap',     type: 'SIP ₹300/month',  pnl: '-₹3.85 (-1.28%)',  positive: false },
                { name: 'ABSL PSU Equity Fund',       type: 'SIP ₹25/month',   pnl: '+₹1.62 (+6.39%)',  positive: true  },
              ].map((pos, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-none">
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{pos.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{pos.type}</p>
                  </div>
                  <span className={`text-xs font-bold font-mono ${pos.positive ? 'text-profit' : 'text-loss'}`}>
                    {pos.pnl}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SEBI Disclaimer */}
        <div className="text-center py-3 px-4 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-400">
          ⚠️ Not SEBI-registered financial advice. Market investments carry volatile risks. Final decisions belong strictly to you.
        </div>

      </div>
    </AppLayout>
  );
}
