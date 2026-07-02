'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { portfolioAPI, marketAPI } from '@/lib/api';
import { formatCurrency, formatPercent } from '@/lib/utils';
import {
  Info, AlertTriangle,
  ArrowRight, RefreshCw, WifiOff, MessageSquare
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
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

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadData(); }, []);

  if (loading) return (
    <AppLayout>
      <div className="flex items-center justify-center py-32">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-blue-500/20 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500 tracking-wide">Retrieving portfolio telemetry...</p>
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
        <div className="text-center">
          <p className="font-bold text-slate-900 text-base">Local Core Service Offline</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
            Ensure your Loki FastAPI backend is operating on port 8000.
          </p>
          <div className="mt-3 p-2 rounded-lg bg-slate-100 border border-slate-200 font-mono text-[10px] text-blue-600">
            cd backend && uvicorn app.main:app --reload
          </div>
        </div>
        <button onClick={loadData} className="btn-flat flex items-center gap-2 mt-2">
          <RefreshCw size={13} />
          <span>Retry Sync</span>
        </button>
      </div>
    </AppLayout>
  );

  const isProfit = (overview?.total_pnl || 0) >= 0;

  const allocationData = analysis ? [
    { name: 'Mutual Funds', value: parseFloat((analysis.asset_allocation?.mutual_funds_percent || 89).toFixed(1)) },
    { name: 'ETF / Stocks', value: parseFloat((analysis.asset_allocation?.stocks_percent || 11).toFixed(1)) },
  ] : [];

  return (
    <AppLayout>
      <div className="space-y-6">

        {/* Indices Ticker Header Row */}
        {indices.length > 0 && (
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar">
            {indices.slice(0, 4).map((idx: any) => {
              const changeIsPositive = idx.change_percent >= 0;
              return (
                <div key={idx.name} className="flex-shrink-0 flex items-center gap-2 bg-white border border-slate-200 shadow-sm rounded-xl px-3 py-2">
                  <span className="text-[11px] font-bold text-slate-500">{idx.name}</span>
                  <span className="font-mono text-xs font-bold text-slate-900">{idx.value?.toLocaleString('en-IN')}</span>
                  <span className={`text-[11px] font-bold ${changeIsPositive ? 'text-profit' : 'text-loss'}`}>
                    {changeIsPositive ? '+' : ''}{idx.change_percent?.toFixed(2)}%
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Main Grid: Inspired directly by the layout/sizing in the Demo Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Portfolio Value + Assets Allocation */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Portfolio Value Card (mimics Deposit/Withdraw layout from demo) */}
            <div className="section-card flex flex-col justify-between h-48">
              <div>
                <p className="metric-label">Portfolio Value</p>
                <div className="flex items-baseline gap-2.5 mt-2">
                  <span className="text-3xl font-extrabold font-mono text-slate-900 tracking-tight">
                    {formatCurrency(overview?.total_value || 0)}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    +3.2% Today
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button onClick={loadData} className="btn-flat-secondary text-xs flex items-center justify-center gap-1.5 py-2.5">
                  <RefreshCw size={13} />
                  <span>Sync Core</span>
                </button>
                <Link href="/chat" className="btn-flat text-xs flex items-center justify-center gap-1.5 py-2.5">
                  <MessageSquare size={13} />
                  <span>AI Advisor</span>
                </Link>
              </div>
            </div>

            {/* Assets Allocation Card (mimics allocation pie chart layout from demo) */}
            <div className="section-card flex flex-col justify-between h-56">
              <h3 className="metric-label">Assets Allocation</h3>
              <div className="flex items-center justify-between gap-4 mt-2">
                <div className="w-1/2 h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={allocationData} 
                        cx="50%" 
                        cy="50%" 
                        innerRadius={28} 
                        outerRadius={44}
                        dataKey="value" 
                        paddingAngle={3}
                      >
                        {allocationData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(v: any) => [`${v}%`, '']}
                        contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 11, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="w-1/2 space-y-2 text-xs">
                  {allocationData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                        <span className="text-slate-600 font-semibold">{item.name}</span>
                      </div>
                      <span className="font-bold font-mono text-slate-900">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Portfolio Performance (mimics Portfolio Performance card in demo) */}
          <div className="lg:col-span-7">
            <div className="section-card h-[432px] flex flex-col justify-between">
              <div>
                <h3 className="metric-label">Portfolio Performance</h3>
                <p className="text-[11px] text-slate-500 mt-1">Stay updated on your portfolio trajectory</p>
              </div>
              
              <div className="h-72 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={snapshots}>
                    <defs>
                      <linearGradient id="chartBlue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0.00} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: '#64748b', fontSize: 10 }} 
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => v?.slice(5)} 
                    />
                    <YAxis 
                      tick={{ fill: '#64748b', fontSize: 10 }} 
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v) => `₹${v}`} 
                      width={55} 
                    />
                    <Tooltip 
                      formatter={(v: any) => [`₹${v}`, 'Portfolio Value']}
                      contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="total_value" 
                      stroke="#2563eb"
                      fill="url(#chartBlue)" 
                      strokeWidth={2} 
                      name="Portfolio Value" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>

        {/* Summary metric banner details under the main layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-white border border-slate-100 rounded-2xl p-5 mt-4 shadow-sm">
          <div className="space-y-1">
            <div className="metric-label">Invested Capital</div>
            <div className="text-xl font-bold font-mono text-slate-700">
              {formatCurrency(overview?.total_invested || 0)}
            </div>
          </div>

          <div className="space-y-1 sm:border-l border-slate-100 sm:pl-6">
            <div className="metric-label">All-time returns (P&amp;L)</div>
            <div className={`text-xl font-bold font-mono flex items-baseline gap-1.5 ${isProfit ? 'text-profit' : 'text-loss'}`}>
              <span>{isProfit ? '+' : ''}{formatCurrency(overview?.total_pnl || 0)}</span>
              <span className="text-xs font-semibold">
                ({formatPercent(overview?.total_pnl_percent || 0)})
              </span>
            </div>
          </div>

          <div className="space-y-1 lg:border-l border-slate-100 lg:pl-6">
            <div className="metric-label">Intraday Delta</div>
            <div className={`text-xl font-bold font-mono flex items-baseline gap-1.5 ${(overview?.today_change || 0) >= 0 ? 'text-profit' : 'text-loss'}`}>
              <span>{(overview?.today_change || 0) >= 0 ? '+' : ''}{formatCurrency(overview?.today_change || 0)}</span>
              <span className="text-xs font-semibold">
                ({formatPercent(overview?.today_change_percent || 0)})
              </span>
            </div>
          </div>
        </div>

        {/* Insights + Positions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          {/* AI Insights */}
          <div className="section-card">
            <h3 className="section-title">AI Portfolio Insights</h3>
            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-red-100 bg-red-50 flex items-start gap-3">
                <AlertTriangle size={15} className="text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">⚠️ Midcap Concentration Risk</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed mt-1">
                    84.8% of your portfolio is concentrated in mid/small cap assets. Consider diversifying into a Nifty 50 Index Fund.
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-amber-100 bg-amber-50 flex items-start gap-3">
                <Info size={15} className="text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Review ABSL PSU SIP</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed mt-1">
                    Thematic PSU fund carries political & election-cycle volatility. Ensure capital exposure remains constrained.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Positions */}
          <div className="section-card">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
              <h3 className="section-title" style={{ marginBottom: 0, borderBottom: 'none', paddingBottom: 0 }}>Active Core Positions</h3>
              <Link href="/exit-alerts" className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1">
                <span>Detailed Exit Rules</span> 
                <ArrowRight size={12} />
              </Link>
            </div>
            <div className="space-y-2 mt-2">
              {[
                { name: 'Motilal Oswal Midcap Fund',    type: 'SIP ₹500/month',  pnl: '-₹20.33 (-2.03%)', positive: false },
                { name: 'HDFC Mid-Cap Opportunities', type: 'SIP ₹800/month',  pnl: '+₹4.75 (+0.59%)',  positive: true  },
                { name: 'Nippon India Small Cap',     type: 'SIP ₹300/month',  pnl: '-₹3.85 (-1.28%)',  positive: false },
                { name: 'ABSL PSU Equity Fund',       type: 'SIP ₹25/month',   pnl: '+₹1.62 (+6.39%)',  positive: true  },
              ].map((pos, idx) => (
                <div key={idx} className="flex justify-between items-center py-2.5 border-b border-slate-100 last:border-none hover:bg-slate-50 transition-colors rounded-lg px-2 -mx-2">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{pos.name}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{pos.type}</p>
                  </div>
                  <span className={`text-xs font-bold font-mono ${pos.positive ? 'text-profit' : 'text-loss'}`}>
                    {pos.pnl}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-center py-3 px-4 bg-white border border-slate-200 rounded-xl text-[10px] text-slate-500 max-w-3xl mx-auto shadow-sm">
          ⚠️ Not SEBI-registered financial advice. Market investments carry volatile risks. Final decisions belong strictly to you.
        </div>

      </div>
    </AppLayout>
  );
}
