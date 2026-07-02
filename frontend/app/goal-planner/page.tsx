'use client';
import { useState, useEffect, useCallback } from 'react';
import AppLayout from '@/components/AppLayout';
import { plannersAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Info, Target, AlertCircle, CheckCircle } from 'lucide-react';

export default function GoalPlannerPage() {
  const [goalName, setGoalName] = useState('Financial Freedom');
  const [goalAmount, setGoalAmount] = useState(10000000);
  const [timelineYears, setTimelineYears] = useState(20);
  const [currentSavings, setCurrentSavings] = useState(2076);
  const [monthlyInvestment, setMonthlyInvestment] = useState(1325);
  const [expectedReturn, setExpectedReturn] = useState(14);

  type GoalResult = {
    progress_percent: number;
    is_on_track: boolean;
    required_monthly_sip: number;
    projected_corpus: number;
    shortfall_or_surplus: number;
  };

  const [result, setResult] = useState<GoalResult | null>(null);
  const [, setLoading] = useState(false);

  const calculate = useCallback(async () => {
    setLoading(true);
    try {
      const res = await plannersAPI.calculateGoal({
        goal_name: goalName,
        goal_amount: goalAmount,
        timeline_years: timelineYears,
        current_savings: currentSavings,
        monthly_investment: monthlyInvestment,
        expected_return: expectedReturn,
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [goalName, goalAmount, timelineYears, currentSavings, monthlyInvestment, expectedReturn]);

  // Debounce: wait 500ms after last slider change before calling API
  useEffect(() => {
    const timer = setTimeout(() => {
      calculate();
    }, 500);
    return () => clearTimeout(timer);
  }, [calculate]);

  const presetGoals = [
    { name: 'Financial Freedom', amount: 10000000, years: 20, returnRate: 14 },
    { name: 'Buy a Car', amount: 800000, years: 4, returnRate: 10 },
    { name: 'Home Downpayment', amount: 2000000, years: 7, returnRate: 12 },
    { name: 'Marriage Fund', amount: 1500000, years: 5, returnRate: 11 },
    { name: 'Emergency Reserve', amount: 240000, years: 1, returnRate: 7 },
    { name: '₹1 Crore Corpus', amount: 10000000, years: 15, returnRate: 14 },
  ];

  const selectPreset = (preset: typeof presetGoals[0]) => {
    setGoalName(preset.name);
    setGoalAmount(preset.amount);
    setTimelineYears(preset.years);
    setExpectedReturn(preset.returnRate);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Goal Planner</h1>
            <p className="text-xs text-slate-500 mt-0.5">Track your financial milestones — from buying a car to financial freedom</p>
          </div>
        </div>

        {/* Preset Selectors */}
        <div className="flex flex-wrap gap-2">
          {presetGoals.map((p) => (
            <button
              key={p.name}
              onClick={() => selectPreset(p)}
              className="text-xs px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 font-bold text-slate-600 cursor-pointer transition-all shadow-sm"
            >
              {p.name} (₹{(p.amount / 100000).toFixed(1)}L)
            </button>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Form Inputs */}
          <div className="lg:col-span-5 space-y-4">
            <div className="section-card">
              <h3 className="section-title">Configure Wealth Goal</h3>
              
              <div className="space-y-4 mt-4">
                {/* Goal Name */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Goal Name</label>
                  <input
                    type="text"
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                    className="input-premium py-2.5 text-xs font-semibold"
                  />
                </div>

                {/* Target Amount */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Goal Target Amount</label>
                    <span className="text-xs font-bold text-slate-900 font-mono">₹{formatCurrency(goalAmount)}</span>
                  </div>
                  <input
                    type="range"
                    min={50000}
                    max={50000000}
                    step={50000}
                    value={goalAmount}
                    onChange={(e) => setGoalAmount(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer bg-slate-200 h-1 rounded-full appearance-none"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase mt-1 tracking-wider">
                    <span>₹50K</span>
                    <span>₹5 Cr</span>
                  </div>
                </div>

                {/* Timeline in Years */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Timeline</label>
                    <span className="text-xs font-bold text-slate-900 font-mono">{timelineYears} Year{timelineYears > 1 ? 's' : ''}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={40}
                    step={1}
                    value={timelineYears}
                    onChange={(e) => setTimelineYears(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer bg-slate-200 h-1 rounded-full appearance-none"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase mt-1 tracking-wider">
                    <span>1 Yr</span>
                    <span>40 Yrs</span>
                  </div>
                </div>

                {/* Current Savings */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Current Savings</label>
                    <span className="text-xs font-bold text-slate-900 font-mono">₹{formatCurrency(currentSavings)}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={20000000}
                    step={25000}
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer bg-slate-200 h-1 rounded-full appearance-none"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase mt-1 tracking-wider">
                    <span>₹0</span>
                    <span>₹2 Cr</span>
                  </div>
                </div>

                {/* Monthly Investment Capacity */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Monthly SIP Capacity</label>
                    <span className="text-xs font-bold text-slate-900 font-mono">₹{formatCurrency(monthlyInvestment)} / mo</span>
                  </div>
                  <input
                    type="range"
                    min={500}
                    max={500000}
                    step={500}
                    value={monthlyInvestment}
                    onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer bg-slate-200 h-1 rounded-full appearance-none"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase mt-1 tracking-wider">
                    <span>₹500</span>
                    <span>₹5L</span>
                  </div>
                </div>

                {/* Expected Return Rate */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Expected Returns</label>
                    <span className="text-xs font-bold text-slate-900 font-mono">{expectedReturn}%</span>
                  </div>
                  <input
                    type="range"
                    min={4}
                    max={30}
                    step={0.5}
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer bg-slate-200 h-1 rounded-full appearance-none"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase mt-1 tracking-wider">
                    <span>4% (Debt)</span>
                    <span>30% (Aggressive Midcap)</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right Column: Goal Outputs */}
          <div className="lg:col-span-7 space-y-4">
            {result ? (
              <div className="space-y-4">
                
                {/* Visual Readiness Progress */}
                <div className="section-card">
                  <h3 className="section-title">Goal Readiness Status</h3>
                  
                  <div className="space-y-3 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500">Projected Goal Coverage</span>
                      <span className="text-base font-extrabold text-blue-600 font-mono">{result.progress_percent}%</span>
                    </div>

                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(result.progress_percent, 100)}%` }}
                      ></div>
                    </div>

                    {result.is_on_track ? (
                      <div className="flex items-center gap-1.5 text-xs text-profit font-bold">
                        <CheckCircle size={14} className="text-emerald-500" />
                        <span>ON TRACK: SIP capacity is fully optimized to secure this target.</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-loss font-bold">
                        <AlertCircle size={14} className="text-red-500" />
                        <span>GAP DETECTED: Consider increasing monthly SIP to prevent shortfalls.</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Primary Metrics Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="section-card py-4 px-5">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Required Monthly SIP</span>
                    <span className="text-lg font-extrabold font-mono text-slate-900">₹{formatCurrency(result.required_monthly_sip)}</span>
                  </div>

                  <div className="section-card py-4 px-5">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Projected Final Corpus</span>
                    <span className="text-lg font-extrabold font-mono text-blue-600">₹{formatCurrency(result.projected_corpus)}</span>
                  </div>
                </div>

                {/* Secondary details */}
                <div className="section-card">
                  <h3 className="section-title">Status Audit</h3>
                  
                  <div className="space-y-3 mt-4">
                    <div className="flex justify-between py-1.5 border-b border-slate-100 text-xs">
                      <span className="text-slate-600">Current Monthly SIP Allocation</span>
                      <span className="font-mono text-slate-900 font-bold">₹{formatCurrency(monthlyInvestment)}</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-100 text-xs">
                      <span className="text-slate-600">Target Deficit / Surplus</span>
                      <span className={`font-mono font-bold ${result.shortfall_or_surplus >= 0 ? 'text-profit' : 'text-loss'}`}>
                        {result.shortfall_or_surplus >= 0 ? '+' : ''}₹{formatCurrency(result.shortfall_or_surplus)}
                      </span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-100 text-xs">
                      <span className="text-slate-600">Goal Target Corpus</span>
                      <span className="font-mono text-slate-900 font-bold">₹{formatCurrency(goalAmount)}</span>
                    </div>

                    <div className="flex justify-between py-1.5 text-xs">
                      <span className="text-slate-600">Projected Performance</span>
                      <span className="font-mono text-slate-500 font-semibold">({timelineYears} Years at {expectedReturn}% CAGR)</span>
                    </div>
                  </div>
                </div>

                {/* AI Advisor Context recommendation block */}
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50 flex flex-col gap-2.5 shadow-sm">
                  <div className="flex items-center gap-1.5 text-xs text-blue-600 font-bold uppercase tracking-wider">
                    <Target size={14} className="text-blue-600" />
                    <span>Loki Strategic Target Prescription</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {result.is_on_track 
                      ? `Excellent projections! With your planned ₹${formatCurrency(monthlyInvestment)}/mo SIP and ₹${formatCurrency(currentSavings)} starting amount, you will exceed your ₹${formatCurrency(goalAmount)} goal by ₹${formatCurrency(result.shortfall_or_surplus)}. You can maintain current schedules or reallocate slightly to more conservative assets if you wish.`
                      : `Your configuration indicates a shortfall of ₹${formatCurrency(Math.abs(result.shortfall_or_surplus))}. To bridge this, increase your monthly SIP to ₹${formatCurrency(result.required_monthly_sip)}/mo, or re-allocate your existing direct mutual funds to Parag Parikh Flexi Cap or Motilal Oswal Midcap to boost returns.`
                    }
                  </p>
                </div>

              </div>
            ) : (
              <div className="section-card py-20 text-center text-slate-500">
                <p className="text-xs font-semibold uppercase tracking-wider">Compiling projection tables...</p>
              </div>
            )}
          </div>

        </div>

        {/* Disclaimer */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex items-start gap-2.5 max-w-3xl">
          <Info size={15} className="text-slate-500 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-slate-500 leading-relaxed">
            ⚠️ <strong>Safety Warning:</strong> Loki Finance Copilot does not guarantee target returns or specific portfolio valuations. Market investments are highly subject to fluctuations. Projections assume constant returns; real CAGR varies year by year.
          </p>
        </div>

      </div>
    </AppLayout>
  );
}
