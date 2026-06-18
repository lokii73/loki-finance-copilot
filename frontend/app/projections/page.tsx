'use client';
import { useEffect, useState, useCallback } from 'react';
import AppLayout from '@/components/AppLayout';
import { projectionsAPI, portfolioAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Target, TrendingUp, AlertTriangle, RefreshCw, WifiOff, Zap } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine
} from 'recharts';

const SCENARIOS = [
  { key: 'conservative', label: 'Conservative (8%)',  color: '#f59e0b', dash: '5 3' },
  { key: 'base',         label: 'Base Case (12%)',    color: '#2563eb', dash: ''    },
  { key: 'optimistic',   label: 'Optimistic (15%)',   color: '#00b074', dash: '5 3' },
];

function AgeMilestone({ age, value, label }: { age: number; value: number; label: string }) {
  return (
    <div className="section-card p-4 text-center hover:shadow-sm transition-shadow">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Age {age}</p>
      <p className="text-lg font-bold font-mono text-blue-600">{formatCurrency(value)}</p>
      <p className="text-[10px] text-slate-400 mt-0.5">{label}</p>
    </div>
  );
}

export default function ProjectionsPage() {
  const [projections, setProjections] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [monthlySip, setMonthlySip]     = useState(1325);
  const [annualReturn, setAnnualReturn] = useState(12);
  const [currentValue, setCurrentValue] = useState(2076);
  const [currentAge]                    = useState(21);

  const loadProjections = useCallback(async (sip = monthlySip, val = currentValue, ret = annualReturn) => {
    setLoading(true); setError(false);
    try {
      const res = await projectionsAPI.getWealth(sip, val, ret);
      setProjections(res.data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // On mount: try to get real portfolio value, else use defaults
  useEffect(() => {
    portfolioAPI.getOverview()
      .then(r => {
        const val = r.data.total_value   || 2076;
        const sip = r.data.sip_monthly_amount || 1325;
        setCurrentValue(val);
        setMonthlySip(sip);
        loadProjections(sip, val, 12);
      })
      .catch(() => loadProjections(1325, 2076, 12));
  }, []);

  // Debounced recalculate on slider changes
  useEffect(() => {
    const t = setTimeout(() => loadProjections(monthlySip, currentValue, annualReturn), 600);
    return () => clearTimeout(t);
  }, [monthlySip, currentValue, annualReturn]);

  // Build chart data — base case rows with all three scenarios merged
  const chartData = projections
    ? Object.values(projections.base_case).map((p: any) => ({
        age:          currentAge + p.years,
        year:         `Yr ${p.years}`,
        invested:     Math.round(p.total_invested),
        base:         Math.round(p.estimated_value),
        conservative: Math.round(projections.conservative?.[String(p.years)]?.estimated_value || 0),
        optimistic:   Math.round(projections.optimistic?.[String(p.years)]?.estimated_value || 0),
      }))
    : [];

  const tableRows = projections
    ? Object.values(projections.base_case).map((p: any) => ({
        years:        p.years,
        age:          currentAge + p.years,
        invested:     p.total_invested,
        conservative: projections.conservative?.[String(p.years)]?.estimated_value || 0,
        base:         p.estimated_value,
        optimistic:   projections.optimistic?.[String(p.years)]?.estimated_value || 0,
        multiple:     p.returns_multiple,
      }))
    : [];

  // Key age milestones for base case
  const milestones = [25, 30, 35, 40, 50]
    .map(age => {
      const yrs = age - currentAge;
      const row = projections?.base_case?.[String(yrs)];
      return row ? { age, value: Math.round(row.estimated_value), label: `${yrs}yr SIP` } : null;
    })
    .filter(Boolean) as { age: number; value: number; label: string }[];

  return (
    <AppLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex justify-between items-end border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Wealth Projection</h1>
            <p className="text-xs text-slate-500 mt-0.5">See where ₹{monthlySip.toLocaleString('en-IN')}/month takes you over 20 years</p>
          </div>
          <button onClick={() => loadProjections()} className="btn-flat-secondary flex items-center gap-1.5 py-2 text-xs">
            <RefreshCw size={13} /><span className="hidden sm:inline">Recalculate</span>
          </button>
        </div>

        {/* ₹1 Crore Target Banner */}
        {projections?.crore_target && (
          <div className="flex items-start gap-3 p-4 rounded-lg border border-amber-200 bg-amber-50/40">
            <Target size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-800 mb-2">₹1 Crore Target — How Long Will It Take?</p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Conservative (8%)', years: projections.crore_target.years_conservative, color: 'text-amber-600' },
                  { label: 'Base Case (12%)',   years: projections.crore_target.years_base,         color: 'text-blue-600'  },
                  { label: 'Optimistic (15%)',  years: projections.crore_target.years_optimistic,   color: 'text-profit'    },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <p className="text-[10px] text-slate-400 font-semibold mb-0.5">{s.label}</p>
                    <p className={`text-xl font-bold font-mono ${s.color}`}>{s.years} yrs</p>
                    <p className="text-[10px] text-slate-400">Age {currentAge + s.years}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="section-card">
          <h3 className="section-title flex items-center gap-2">
            <Zap size={14} className="text-blue-600" />Customise Projection
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: 'Monthly SIP', value: monthlySip, set: setMonthlySip, min: 500, max: 100000, step: 500, fmt: (v: number) => `₹${v.toLocaleString('en-IN')}` },
              { label: 'Current Portfolio Value', value: currentValue, set: setCurrentValue, min: 0, max: 10000000, step: 1000, fmt: (v: number) => `₹${v.toLocaleString('en-IN')}` },
              { label: 'Expected Annual Return', value: annualReturn, set: setAnnualReturn, min: 6, max: 20, step: 0.5, fmt: (v: number) => `${v}%` },
            ].map(ctrl => (
              <div key={ctrl.label}>
                <div className="flex justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-500">{ctrl.label}</label>
                  <span className="text-xs font-bold text-slate-800 font-mono">{ctrl.fmt(ctrl.value)}</span>
                </div>
                <input type="range" min={ctrl.min} max={ctrl.max} step={ctrl.step}
                  value={ctrl.value} onChange={e => ctrl.set(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer" />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>{ctrl.fmt(ctrl.min)}</span>
                  <span>{ctrl.fmt(ctrl.max)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-7 h-7 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <WifiOff size={28} className="text-slate-300" />
            <p className="text-sm text-slate-600 font-semibold">Backend offline</p>
            <button onClick={() => loadProjections()} className="btn-flat text-xs flex items-center gap-1.5">
              <RefreshCw size={12} />Retry
            </button>
          </div>
        )}

        {!loading && !error && projections && (
          <>
            {/* Age Milestones */}
            {milestones.length > 0 && (
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Base Case Milestones (12% CAGR)</p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {milestones.map(m => <AgeMilestone key={m.age} {...m} />)}
                </div>
              </div>
            )}

            {/* Chart */}
            <div className="section-card">
              <h3 className="section-title">Wealth Growth Scenarios</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ right: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} width={60}
                      tickFormatter={v => v >= 10000000 ? `₹${(v/10000000).toFixed(1)}Cr` : `₹${(v/100000).toFixed(0)}L`} />
                    <Tooltip
                      contentStyle={{ fontSize: 12, border: '1px solid #e2e8f0', borderRadius: 6 }}
                      formatter={(v: any) => [formatCurrency(v), '']}
                      labelFormatter={l => `${l} (Age ${chartData.find(d=>d.year===l)?.age})`}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <ReferenceLine y={10000000} stroke="#e2e8f0" strokeDasharray="4 4"
                      label={{ value: '₹1 Cr', position: 'right', fontSize: 10, fill: '#94a3b8' }} />
                    {SCENARIOS.map(s => (
                      <Line key={s.key} type="monotone" dataKey={s.key} stroke={s.color}
                        strokeWidth={s.key === 'base' ? 2.5 : 1.5} dot={false}
                        strokeDasharray={s.dash} name={s.label} />
                    ))}
                    <Line type="monotone" dataKey="invested" stroke="#cbd5e1"
                      strokeWidth={1.5} dot={false} strokeDasharray="3 3" name="Amount Invested" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Projection Table */}
            <div className="section-card">
              <h3 className="section-title">Year-by-Year Projection Table</h3>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Year</th>
                      <th>Age</th>
                      <th>Total Invested</th>
                      <th className="text-amber-600">Conservative (8%)</th>
                      <th className="text-blue-600">Base Case (12%)</th>
                      <th className="text-profit">Optimistic (15%)</th>
                      <th>Return Multiple</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map(row => (
                      <tr key={row.years} className={row.years % 5 === 0 ? 'bg-blue-50/30 font-semibold' : ''}>
                        <td className="font-semibold text-slate-700">{row.years}Y</td>
                        <td className="font-mono text-slate-600">{row.age}</td>
                        <td className="font-mono text-slate-600">{formatCurrency(row.invested)}</td>
                        <td className="font-mono text-amber-600">{formatCurrency(row.conservative)}</td>
                        <td className="font-mono text-blue-600 font-bold">{formatCurrency(row.base)}</td>
                        <td className="font-mono text-profit">{formatCurrency(row.optimistic)}</td>
                        <td className="font-mono text-slate-500">{row.multiple}x</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SIP increase roadmap */}
            <div className="section-card">
              <h3 className="section-title flex items-center gap-2">
                <TrendingUp size={14} className="text-blue-600" />SIP Increase Roadmap for Logesh
              </h3>
              <div className="space-y-2">
                {[
                  { period: 'Now (Age 21)', sip: '₹1,325/month', note: 'Current — keep consistent, don\'t stop' },
                  { period: 'After MCA (Age 23)', sip: '₹5,000–8,000/month', note: 'Entry-level salary target — add Nifty 50 SIP first' },
                  { period: 'Mid-career (Age 26)', sip: '₹15,000–25,000/month', note: 'Step up with every increment via SIP top-up' },
                  { period: 'Senior level (Age 30)', sip: '₹40,000–60,000/month', note: 'At ₹50K/month at 12% for 20 years → ₹4.9 Crore' },
                ].map((r, i) => (
                  <div key={i} className="flex items-start gap-3 py-2.5 border-b border-slate-100 last:border-none">
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">{i+1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap justify-between gap-1">
                        <span className="text-xs font-bold text-slate-700">{r.period}</span>
                        <span className="text-xs font-bold font-mono text-blue-600">{r.sip}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{r.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Disclaimer */}
        <div className="p-4 rounded border border-slate-200 bg-slate-50 flex items-start gap-2.5">
          <AlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-[11.5px] text-slate-500 leading-normal">
            ⚠️ Projections assume constant annual returns — real markets do not work this way.
            A 12% CAGR is the historical average for Indian midcap/large-cap mutual funds but is NOT guaranteed.
            Not SEBI-registered advice. Final decisions are yours.
          </p>
        </div>

      </div>
    </AppLayout>
  );
}
