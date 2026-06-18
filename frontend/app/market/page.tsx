'use client';
import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { marketAPI } from '@/lib/api';
import { formatPercent, getChangeColor, getChangeBg } from '@/lib/utils';
import { TrendingUp, TrendingDown, Newspaper, Globe, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function MarketPage() {
  const [overview, setOverview] = useState<any>(null);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

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

  const sentimentColors: Record<string, string> = {
    Positive: 'text-emerald-400',
    Negative: 'text-red-400',
    Neutral: 'text-yellow-400',
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Market Overview</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Indian markets • {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <button onClick={loadData} className="btn-ghost flex items-center gap-2">
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>

        {/* Indices Grid */}
        <div>
          <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>INDICES</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {overview?.indices?.map((idx: any) => (
              <div key={idx.name} className="glass-card p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{idx.name}</div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getChangeBg(idx.change_pct)}`}>
                    {formatPercent(idx.change_pct)}
                  </span>
                </div>
                <div className="text-xl font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
                  {idx.value?.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  H: {idx.high?.toLocaleString('en-IN')} | L: {idx.low?.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Commodities + Forex */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>COMMODITIES</h2>
            <div className="glass-card overflow-hidden">
              {overview?.commodities?.map((c: any, i: number) => (
                <div key={c.name} className="flex items-center justify-between px-4 py-3"
                  style={{ borderBottom: i < (overview.commodities.length - 1) ? '1px solid var(--border)' : 'none' }}>
                  <div>
                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{c.name}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.unit}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
                      {c.value?.toLocaleString('en-IN')}
                    </div>
                    <div className={`text-xs font-semibold ${getChangeColor(c.change_pct)}`}>
                      {formatPercent(c.change_pct)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>FOREX</h2>
            <div className="glass-card overflow-hidden">
              {overview?.forex?.map((f: any, i: number) => (
                <div key={f.name} className="flex items-center justify-between px-4 py-3"
                  style={{ borderBottom: i < (overview.forex.length - 1) ? '1px solid var(--border)' : 'none' }}>
                  <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{f.name}</div>
                  <div className="text-right">
                    <div className="text-sm font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
                      ₹{f.value?.toFixed(2)}
                    </div>
                    <div className={`text-xs font-semibold ${getChangeColor(f.change_pct)}`}>
                      {formatPercent(f.change_pct)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Market Summary */}
        {overview?.market_summary && (
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Globe size={18} className="text-blue-400" />
              <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>AI Market Summary</h2>
              <span className="text-xs px-2 py-0.5 rounded-full ml-auto"
                style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa' }}>AI Generated</span>
            </div>
            <div className="prose prose-invert prose-sm max-w-none" style={{ color: 'var(--text-secondary)' }}>
              <ReactMarkdown>{overview.market_summary}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* News */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Newspaper size={16} style={{ color: 'var(--text-muted)' }} />
            <h2 className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>MARKET NEWS</h2>
          </div>
          <div className="space-y-3">
            {news.map((item) => (
              <div key={item.id} className="glass-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                      {item.headline}
                    </h3>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.source}</span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>• {item.time}</span>
                      <span className={`text-xs font-semibold ${sentimentColors[item.sentiment] || 'text-slate-400'}`}>
                        {item.sentiment}
                      </span>
                    </div>
                    <div className="mt-2 text-xs p-2 rounded-lg"
                      style={{ background: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)' }}>
                      💡 {item.impact}
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>
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
