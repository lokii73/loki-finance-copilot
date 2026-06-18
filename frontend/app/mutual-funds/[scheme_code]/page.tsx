'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { mutualFundsAPI } from '@/lib/api';
import { formatCurrency, formatPercent, getChangeColor, getVerdictConfig } from '@/lib/utils';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function MFDetailPage() {
  const params = useParams();
  const schemeCode = params.scheme_code as string;
  const [fund, setFund] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (schemeCode) {
      mutualFundsAPI.getDetail(schemeCode).then((r) => {
        setFund(r.data);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [schemeCode]);

  if (loading) return (
    <AppLayout>
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    </AppLayout>
  );

  if (!fund) return (
    <AppLayout>
      <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>Fund not found</div>
    </AppLayout>
  );

  const verdictConfig = getVerdictConfig(fund.verdict);
  const perfData = [
    { period: '1Y', fund: fund.cagr_1y, category: fund.performance_vs_category?.category_avg_1y },
    { period: '3Y', fund: fund.cagr_3y, category: fund.performance_vs_category?.category_avg_3y },
    { period: '5Y', fund: fund.cagr_5y, category: fund.performance_vs_category?.category_avg_5y },
  ];

  return (
    <AppLayout>
      <div className="space-y-5 fade-in-up">
        <div>
          <Link href="/mutual-funds" className="flex items-center gap-2 text-sm mb-4 hover:text-blue-400 transition-colors"
            style={{ color: 'var(--text-muted)' }}>
            <ArrowLeft size={16} /> Back to Mutual Funds
          </Link>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{fund.scheme_name}</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {fund.fund_house} • {fund.sub_category} • Fund Manager: {fund.fund_manager}
          </p>
        </div>

        {/* Verdict */}
        <div className={`p-5 rounded-2xl border ${verdictConfig.bg}`}>
          <div className="flex items-start gap-4">
            <div className="text-3xl">{verdictConfig.icon}</div>
            <div>
              <div className={`text-lg font-bold mb-2 ${verdictConfig.color}`}>{fund.verdict}</div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{fund.verdict_reason}</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Current Value', value: formatCurrency(fund.current_value) },
            { label: 'P&L', value: `${fund.pnl >= 0 ? '+' : ''}${formatCurrency(fund.pnl)}`, color: getChangeColor(fund.pnl) },
            { label: 'Units', value: fund.units?.toFixed(3) },
            { label: 'Current NAV', value: `₹${fund.current_nav?.toFixed(4)}` },
            { label: 'AUM', value: `₹${(fund.aum_cr / 1000).toFixed(1)}K Cr` },
            { label: 'Expense Ratio', value: `${fund.expense_ratio}%` },
            { label: 'Max Drawdown', value: `${fund.drawdown_max?.toFixed(1)}%`, color: 'text-red-400' },
            { label: 'Sharpe Ratio', value: fund.sharpe_ratio?.toFixed(2) },
          ].map((item) => (
            <div key={item.label} className="glass-card p-4">
              <div className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{item.label}</div>
              <div className={`text-base font-bold font-mono ${(item as any).color || ''}`}
                style={{ color: (item as any).color ? undefined : 'var(--text-primary)' }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* NAV Chart + Performance vs Category */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass-card p-5">
            <h2 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>NAV History (90 Days)</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={fund.nav_history}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 10 }} tickLine={false}
                  tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fill: '#475569', fontSize: 10 }} tickLine={false} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ background: '#111927', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#f1f5f9' }}
                  formatter={(v: any) => [`₹${Number(v).toFixed(4)}`, 'NAV']}
                />
                <Line type="monotone" dataKey="nav" stroke="#8b5cf6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-5">
            <h2 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Fund vs Category CAGR</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={perfData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="period" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 10 }} tickLine={false}
                  tickFormatter={(v) => `${v}%`} />
                <Tooltip
                  contentStyle={{ background: '#111927', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#f1f5f9' }}
                  formatter={(v: any) => [`${Number(v).toFixed(1)}%`, '']}
                />
                <Bar dataKey="fund" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="This Fund" />
                <Bar dataKey="category" fill="rgba(139,92,246,0.3)" radius={[4, 4, 0, 0]} name="Category Avg" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Holdings + Sector Allocation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {fund.top_holdings && (
            <div className="glass-card p-5">
              <h2 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Top Holdings</h2>
              <div className="space-y-3">
                {fund.top_holdings.map((h: any) => (
                  <div key={h.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: 'var(--text-secondary)' }}>{h.name}</span>
                      <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{h.weight}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${h.weight * 3}%`, background: '#8b5cf6' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {fund.sector_allocation && (
            <div className="glass-card p-5">
              <h2 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Sector Allocation</h2>
              <div className="space-y-3">
                {fund.sector_allocation.map((s: any, i: number) => (
                  <div key={s.sector}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: 'var(--text-secondary)' }}>{s.sector}</span>
                      <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{s.weight}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill"
                        style={{ width: `${s.weight * 2}%`, background: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'][i] }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
          ⚠️ Mutual fund investments are subject to market risks. Past performance is not indicative of future results.
        </p>
      </div>
    </AppLayout>
  );
}
