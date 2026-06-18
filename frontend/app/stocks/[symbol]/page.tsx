'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { stocksAPI } from '@/lib/api';
import { formatCurrency, formatPercent, getChangeColor, getVerdictConfig } from '@/lib/utils';
import { ArrowLeft, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadialBarChart, RadialBar
} from 'recharts';

export default function StockDetailPage() {
  const params = useParams();
  const symbol = params.symbol as string;
  const [stock, setStock] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (symbol) {
      stocksAPI.getDetail(symbol.toUpperCase()).then((r) => {
        setStock(r.data);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [symbol]);

  if (loading) return (
    <AppLayout>
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    </AppLayout>
  );

  if (!stock) return (
    <AppLayout>
      <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>Stock not found</div>
    </AppLayout>
  );

  const verdictConfig = getVerdictConfig(stock.verdict);
  const isProfitable = stock.pnl >= 0;

  return (
    <AppLayout>
      <div className="space-y-5 fade-in-up">
        {/* Back + Header */}
        <div>
          <Link href="/stocks" className="flex items-center gap-2 text-sm mb-4 hover:text-blue-400 transition-colors"
            style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft size={16} /> Back to Stocks
          </Link>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{stock.symbol}</h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{stock.company_name} • {stock.exchange} • {stock.sector}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
                ₹{stock.current_price?.toLocaleString('en-IN')}
              </div>
              <div className={`text-sm font-semibold ${getChangeColor(stock.day_change_percent || 0)}`}>
                {formatPercent(stock.day_change_percent || 0.62)} Today
              </div>
            </div>
          </div>
        </div>

        {/* AI Verdict Banner */}
        <div className={`p-5 rounded-2xl border ${verdictConfig.bg}`}>
          <div className="flex items-start gap-4">
            <div className="text-3xl">{verdictConfig.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-lg font-bold ${verdictConfig.color}`}>{stock.verdict}</span>
                <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)' }}>
                  Confidence: {stock.confidence}%
                </span>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{stock.verdict_reason}</p>
            </div>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Your Position */}
          <div className="glass-card p-4">
            <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Your Position</div>
            <div className="text-lg font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
              {formatCurrency(stock.current_value)}
            </div>
            <div className={`text-sm font-semibold mt-1 ${getChangeColor(stock.pnl)}`}>
              {isProfitable ? '+' : ''}{formatCurrency(stock.pnl)} ({formatPercent(stock.pnl_percent)})
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              {stock.quantity} shares @ ₹{stock.avg_buy_price?.toLocaleString('en-IN')} avg
            </div>
          </div>

          {/* Probability */}
          <div className="glass-card p-4">
            <div className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>AI Probability</div>
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-emerald-400">{stock.bullish_probability}%</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Bullish</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-red-400">{stock.bearish_probability}%</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Bearish</div>
              </div>
            </div>
            <div className="mt-3">
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full bg-gradient-to-r from-emerald-500 to-red-500 rounded-full"
                  style={{ background: `linear-gradient(to right, #10b981 ${stock.bullish_probability}%, #ef4444 ${stock.bullish_probability}%)` }} />
              </div>
            </div>
          </div>

          {/* 52W Range */}
          <div className="glass-card p-4">
            <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>52-Week Range</div>
            <div className="text-sm font-mono mt-1" style={{ color: 'var(--text-primary)' }}>
              ₹{stock['52w_low']?.toLocaleString('en-IN')} – ₹{stock['52w_high']?.toLocaleString('en-IN')}
            </div>
            <div className="mt-2">
              <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full bg-blue-400"
                  style={{ width: `${((stock.current_price - stock['52w_low']) / (stock['52w_high'] - stock['52w_low'])) * 100}%` }} />
              </div>
              <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                <span>Low</span>
                <span className="text-blue-400">{(((stock.current_price - stock['52w_low']) / (stock['52w_high'] - stock['52w_low'])) * 100).toFixed(0)}% of range</span>
                <span>High</span>
              </div>
            </div>
          </div>

          {/* Score */}
          <div className="glass-card p-4">
            <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Investment Score</div>
            <div className="text-3xl font-bold"
              style={{ color: stock.investment_score >= 70 ? '#10b981' : stock.investment_score >= 50 ? '#f59e0b' : '#ef4444' }}>
              {stock.investment_score}<span className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>/100</span>
            </div>
            <div className="mt-2">
              <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full"
                  style={{ width: `${stock.investment_score}%`, background: stock.investment_score >= 70 ? '#10b981' : '#f59e0b' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Price Chart + Fundamentals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Price Chart */}
          <div className="glass-card p-5">
            <h2 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Price History (30 Days)</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stock.price_history}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 10 }} tickLine={false}
                  tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fill: '#475569', fontSize: 10 }} tickLine={false}
                  domain={['auto', 'auto']} tickFormatter={(v) => `₹${v.toLocaleString('en-IN')}`} />
                <Tooltip
                  contentStyle={{ background: '#111927', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#f1f5f9' }}
                  formatter={(v: any) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Price']}
                />
                <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Fundamentals */}
          <div className="glass-card p-5">
            <h2 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Fundamentals</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'PE Ratio', value: stock.pe_ratio?.toFixed(1) },
                { label: 'ROE', value: `${stock.roe?.toFixed(1)}%` },
                { label: 'Debt/Equity', value: stock.debt_to_equity?.toFixed(2) },
                { label: 'EPS', value: `₹${stock.eps?.toFixed(2)}` },
                { label: 'Revenue Growth', value: `+${stock.revenue_growth_1y?.toFixed(1)}%` },
                { label: 'Profit Growth', value: `+${stock.profit_growth_1y?.toFixed(1)}%` },
                { label: 'Dividend Yield', value: `${stock.dividend_yield?.toFixed(2)}%` },
                { label: 'RSI', value: stock.rsi?.toFixed(1) },
              ].map((item) => (
                <div key={item.label} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{item.label}</div>
                  <div className="text-sm font-semibold font-mono" style={{ color: 'var(--text-primary)' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technical Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass-card p-5">
            <h2 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Technical Summary</h2>
            <div className="space-y-3">
              {[
                { label: '50-Day MA', value: `₹${stock.moving_avg_50?.toLocaleString('en-IN')}`, good: stock.current_price > stock.moving_avg_50 },
                { label: '200-Day MA', value: `₹${stock.moving_avg_200?.toLocaleString('en-IN')}`, good: stock.current_price > stock.moving_avg_200 },
                { label: 'MACD Signal', value: stock.macd_signal, good: stock.macd_signal === 'Bullish' },
                { label: 'Trend', value: stock.technical_summary?.trend, good: stock.technical_summary?.trend === 'Uptrend' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold font-mono" style={{ color: 'var(--text-primary)' }}>{item.value}</span>
                    {item.good
                      ? <CheckCircle size={14} className="text-emerald-400" />
                      : <AlertTriangle size={14} className="text-amber-400" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Factors */}
          <div className="glass-card p-5">
            <h2 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Risk Factors</h2>
            <div className="space-y-3">
              {stock.risk_factors?.map((risk: string, i: number) => (
                <div key={i} className="flex items-start gap-2 p-3 rounded-xl"
                  style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                  <AlertTriangle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{risk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
          ⚠️ AI analysis is probability-based and NOT financial advice. Past performance ≠ future results. Consult a SEBI-registered advisor for investment decisions.
        </p>
      </div>
    </AppLayout>
  );
}
