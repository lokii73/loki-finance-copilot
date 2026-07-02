'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { stocksAPI } from '@/lib/api';
import { formatCurrency, formatPercent, getChangeColor, getVerdictConfig } from '@/lib/utils';
import { ArrowLeft, AlertTriangle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function StockDetailPage() {
  const params = useParams();
  const symbol = params.symbol as string;
  const [stock, setStock] = useState<{ [key: string]: any } | null>(null);
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
      <div className="flex items-center justify-center py-32">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500 tracking-wide">Retrieving equity statistics...</p>
        </div>
      </div>
    </AppLayout>
  );

  if (!stock) return (
    <AppLayout>
      <div className="text-center py-20 text-slate-500">Stock not found</div>
    </AppLayout>
  );

  const verdictConfig = getVerdictConfig(stock.verdict);
  const isProfitable = stock.pnl >= 0;

  let customBg = 'bg-white border-slate-200 text-slate-900 shadow-sm';
  let customTextColor = 'text-slate-900';
  if (stock.verdict === 'Buy Candidate') {
    customBg = 'bg-emerald-50 border-emerald-200 shadow-sm';
    customTextColor = 'text-emerald-700';
  } else if (stock.verdict === 'Hold') {
    customBg = 'bg-amber-50 border-amber-200 shadow-sm';
    customTextColor = 'text-amber-700';
  } else {
    customBg = 'bg-red-50 border-red-200 shadow-sm';
    customTextColor = 'text-red-700';
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        
        {/* Back + Header */}
        <div>
          <Link href="/stocks" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors mb-4">
            <ArrowLeft size={14} /> Back to Stocks
          </Link>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{stock.symbol}</h1>
              <p className="text-xs text-slate-500 font-semibold uppercase mt-1 tracking-wider">
                {stock.company_name} • {stock.exchange} • {stock.sector}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black font-mono text-slate-900">
                ₹{stock.current_price?.toLocaleString('en-IN')}
              </div>
              <div className={`text-xs font-bold mt-1 ${getChangeColor(stock.day_change_percent || 0)}`}>
                {formatPercent(stock.day_change_percent || 0.62)} Today
              </div>
            </div>
          </div>
        </div>

        {/* AI Verdict Banner */}
        <div className={`p-5 rounded-2xl border ${customBg}`}>
          <div className="flex items-start gap-4">
            <div className="text-2xl mt-0.5">{verdictConfig.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className={`text-sm font-extrabold ${customTextColor}`}>{stock.verdict}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white text-slate-600 font-bold border border-slate-200 shadow-sm">
                  Confidence: {stock.confidence}%
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mt-2">{stock.verdict_reason}</p>
            </div>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Your Position */}
          <div className="section-card">
            <div className="metric-label">Your Position</div>
            <div className="text-base font-extrabold font-mono text-slate-900 mt-1">
              {formatCurrency(stock.current_value)}
            </div>
            <div className={`text-xs font-bold mt-1.5 ${getChangeColor(stock.pnl)}`}>
              {isProfitable ? '+' : ''}{formatCurrency(stock.pnl)} ({formatPercent(stock.pnl_percent)})
            </div>
            <div className="text-[10px] text-slate-500 font-semibold mt-1">
              {stock.quantity} shares @ ₹{stock.avg_buy_price?.toLocaleString('en-IN')} avg
            </div>
          </div>

          {/* Probability */}
          <div className="section-card flex flex-col justify-between">
            <div>
              <div className="metric-label">AI Directional Odds</div>
              <div className="flex gap-4 mt-2">
                <div>
                  <div className="text-xs font-bold text-emerald-600">{stock.bullish_probability}%</div>
                  <div className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">Bullish</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-red-600">{stock.bearish_probability}%</div>
                  <div className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">Bearish</div>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <div className="h-1.5 rounded-full overflow-hidden bg-slate-100">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-red-500 rounded-full"
                  style={{ background: `linear-gradient(to right, #10b981 ${stock.bullish_probability}%, #ef4444 ${stock.bullish_probability}%)` }} />
              </div>
            </div>
          </div>

          {/* 52W Range */}
          <div className="section-card flex flex-col justify-between">
            <div>
              <div className="metric-label">52-Week Range</div>
              <div className="text-[11px] font-bold font-mono text-slate-700 mt-2">
                ₹{stock['52w_low']?.toLocaleString('en-IN')} – ₹{stock['52w_high']?.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="mt-3">
              <div className="h-1.5 rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-blue-500"
                  style={{ width: `${((stock.current_price - stock['52w_low']) / (stock['52w_high'] - stock['52w_low'])) * 100}%` }} />
              </div>
              <div className="flex justify-between text-[9px] text-slate-500 font-semibold mt-1">
                <span>Low</span>
                <span className="text-blue-600">{(((stock.current_price - stock['52w_low']) / (stock['52w_high'] - stock['52w_low'])) * 100).toFixed(0)}% of range</span>
                <span>High</span>
              </div>
            </div>
          </div>

          {/* Score */}
          <div className="section-card flex flex-col justify-between">
            <div>
              <div className="metric-label">Investment Rating</div>
              <div className="text-2xl font-black mt-2 font-mono"
                style={{ color: stock.investment_score >= 70 ? '#10b981' : stock.investment_score >= 50 ? '#f59e0b' : '#ef4444' }}>
                {stock.investment_score}<span className="text-xs font-normal text-slate-400">/100</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="h-1.5 rounded-full bg-slate-100">
                <div className="h-full rounded-full"
                  style={{ width: `${stock.investment_score}%`, background: stock.investment_score >= 70 ? '#10b981' : '#f59e0b' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Price Chart + Fundamentals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Price Chart */}
          <div className="section-card">
            <h2 className="section-title">Price History (30 Days)</h2>
            <div className="h-56 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stock.price_history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false}
                    tickFormatter={(v) => v.slice(5)} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false}
                    domain={['auto', 'auto']} tickFormatter={(v) => `₹${v.toLocaleString('en-IN')}`} width={55} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(v: any) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Price']}
                  />
                  <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Fundamentals */}
          <div className="section-card">
            <h2 className="section-title">Key Fundamentals</h2>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {[
                { label: 'PE Ratio', value: stock.pe_ratio?.toFixed(1) },
                { label: 'ROE', value: `${stock.roe?.toFixed(1)}%` },
                { label: 'Debt/Equity', value: stock.debt_to_equity?.toFixed(2) },
                { label: 'EPS', value: `₹${stock.eps?.toFixed(2)}` },
                { label: 'Revenue Growth', value: `+${stock.revenue_growth_1y?.toFixed(1)}%` },
                { label: 'Profit Growth', value: `+${stock.profit_growth_1y?.toFixed(1)}%` },
                { label: 'Dividend Yield', value: `${stock.dividend_yield?.toFixed(2)}%` },
                { label: 'RSI Indicator', value: stock.rsi?.toFixed(1) },
              ].map((item) => (
                <div key={item.label} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">{item.label}</div>
                  <div className="text-xs font-bold font-mono text-slate-900">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technical Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="section-card">
            <h2 className="section-title">Technical Radar</h2>
            <div className="space-y-3 mt-4">
              {[
                { label: '50-Day MA', value: `₹${stock.moving_avg_50?.toLocaleString('en-IN')}`, good: stock.current_price > stock.moving_avg_50 },
                { label: '200-Day MA', value: `₹${stock.moving_avg_200?.toLocaleString('en-IN')}`, good: stock.current_price > stock.moving_avg_200 },
                { label: 'MACD Signal', value: stock.macd_signal, good: stock.macd_signal === 'Bullish' },
                { label: 'Trend Profile', value: stock.technical_summary?.trend, good: stock.technical_summary?.trend === 'Uptrend' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-none">
                  <span className="text-xs text-slate-600 font-medium">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-slate-900">{item.value}</span>
                    {item.good
                      ? <CheckCircle size={14} className="text-emerald-500" />
                      : <AlertTriangle size={14} className="text-amber-500" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Factors */}
          <div className="section-card">
            <h2 className="section-title">AI Alert Indicators & Risk Factors</h2>
            <div className="space-y-3 mt-4">
              {stock.risk_factors?.map((risk: string, i: number) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-100">
                  <AlertTriangle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-slate-700 leading-relaxed">{risk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-[10px] text-center text-slate-500 max-w-2xl mx-auto leading-relaxed">
          ⚠️ AI analysis is probability-based and NOT financial advice. Past performance ≠ future results. Consult a SEBI-registered advisor for investment decisions.
        </p>
      </div>
    </AppLayout>
  );
}
