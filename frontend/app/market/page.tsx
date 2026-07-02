'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { marketAPI } from '@/lib/api';
import { Globe, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function MarketPage() {
  const [overview, setOverview] = useState<any>(null);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const [ov, n] = await Promise.all([
      marketAPI.getOverview(),
      marketAPI.getNews(),
    ]);
    setOverview(ov.data);
    setNews(n.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const sentimentColors: Record<string, string> = {
    Positive: 'text-emerald-600',
    Negative: 'text-red-600',
    Neutral: 'text-amber-600',
  };

  if (loading) return (
    <AppLayout>
      <div className="flex items-center justify-center py-32">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500 tracking-wide">Fetching market indicators...</p>
        </div>
      </div>
    </AppLayout>
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Market Overview</h1>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-1">
              Indian markets • {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <button onClick={loadData} className="btn-flat-secondary flex items-center gap-1.5 py-2 text-xs">
            <RefreshCw size={13} className="text-slate-500" />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>
        </div>

        {/* Indices Grid */}
        <div>
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Core Indices</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {overview?.indices?.map((idx: any) => {
              const pnlIsPositive = idx.change_pct >= 0;
              return (
                <div key={idx.name} className="section-card">
                  <div className="flex items-start justify-between mb-2.5">
                    <div className="text-xs font-bold text-slate-600">{idx.name}</div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      pnlIsPositive ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'
                    }`}>
                      {pnlIsPositive ? '+' : ''}{idx.change_pct?.toFixed(2)}%
                    </span>
                  </div>
                  <div className="text-2xl font-black font-mono text-slate-900">
                    {idx.value?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-[9px] mt-2 text-slate-500 font-semibold uppercase tracking-wider">
                    H: {idx.high?.toLocaleString('en-IN')} | L: {idx.low?.toLocaleString('en-IN')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Commodities + Forex */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Commodities</h2>
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
              {overview?.commodities?.map((c: any, i: number) => {
                const isPositive = c.change_pct >
                return (
                  <div key={c.name} className="flex items-center justify-between px-5 py-4 border-b border-slate-100 last:border-none hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{c.name}</div>
                      <div className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">{c.unit}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold font-mono text-slate-900">
                        {c.value?.toLocaleString('en-IN')}
                      </div>
                      <div className={`text-[10px] font-bold font-mono mt-0.5 ${isPositive ? 'text-profit' : 'text-loss'}`}>
                        {isPositive ? '+' : ''}{c.change_pct?.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Forex Exchange</h2>
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
              {overview?.forex?.map((f: any) => {
                const isPositive = f.change_pct >= 0;
                return (
                  <div key={f.name} className="flex items-center justify-between px-5 py-4 border-b border-slate-100 last:border-none hover:bg-slate-50 transition-colors">
                    <div className="text-xs font-bold text-slate-900">{f.name}</div>
                    <div className="text-right">
                      <div className="text-xs font-bold font-mono text-slate-900">
                        ₹{f.value?.toFixed(2)}
                      </div>
                      <div className={`text-[10px] font-bold font-mono mt-0.5 ${isPositive ? 'text-profit' : 'text-loss'}`}>
                        {isPositive ? '+' : ''}{f.change_pct?.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* AI Market Summary */}
        {overview?.market_summary && (
          <div className="section-card">
            <div className="flex items-center gap-2 mb-4">
              <Globe size={16} className="text-blue-600" />
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">AI Market Rationale</h2>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200 uppercase tracking-wider ml-auto">AI OS Generated</span>
            </div>
            <div className="text-xs text-slate-700 leading-relaxed font-medium">
              <ReactMarkdown>{overview.market_summary}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* News */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Newspaper size={15} className="text-slate-500" />
            <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Market Intelligence Feed</h2>
          </div>
          <div className="space-y-4">
            {news.map((item) => (
              <div key={item.id} className="section-card">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="text-xs font-bold text-slate-900 mb-2.5">
                      {item.headline}
                    </h3>
                    <div className="flex items-center gap-3 flex-wrap text-[10px] font-semibold tracking-wide text-slate-500 uppercase">
                      <span>{item.source}</span>
                      <span>•</span>
                      <span>{item.time}</span>
                      <span>•</span>
                      <span className={sentimentColors[item.sentiment] || 'text-slate-500'}>
                        {item.sentiment} Sentiment
                      </span>
                    </div>
                    <div className="mt-3 text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 leading-relaxed">
                      💡 {item.impact}
                    </div>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex-shrink-0 uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
