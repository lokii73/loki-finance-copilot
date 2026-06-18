'use client';
import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { plannersAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Info, Target, Plus, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

export default function GoalPlannerPage() {
  const [goalName, setGoalName] = useState('Financial Freedom');
  const [goalAmount, setGoalAmount] = useState(10000000);
  const [timelineYears, setTimelineYears] = useState(20);
  const [currentSavings, setCurrentSavings] = useState(2076);
  const [monthlyInvestment, setMonthlyInvestment] = useState(1325);
  const [expectedReturn, setExpectedReturn] = useState(14);

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const calculate = async () => {
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
  };

  // Debounce: wait 500ms after last slider change before calling API
  useEffect(() => {
    const timer = setTimeout(() => {
      calculate();
    }, 500);
    return () => clearTimeout(timer);
  }, [goalName, goalAmount, timelineYears, currentSavings, monthlyInvestment, expectedReturn]);

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
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-xl font-bold text-slate-800">Goal Planner</h1>
          <p className="text-xs text-slate-500 mt-0.5">Track your financial goals — from Financial Freedom to your first car</p>
        </div>

        {/* Preset Selectors */}
        <div className="flex flex-wrap gap-2">
          {presetGoals.map((p) => (
            <button
              key={p.name}
              onClick={() => selectPreset(p)}
              className="text-xs px-3 py-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 font-medium text-slate-700 cursor-pointer transition-all"
            >
              {p.name} (₹{(p.amount / 100000).toFixed(1)}L)
            </button>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Column: Form Inputs */}
          <div className="md:col-span-5 space-y-4">
            <div className="section-card">
              <h3 className="section-title">Configure Wealth Goal</h3>
              
              <div className="space-y-4">
                {/* Goal Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Goal Name</label>
                  <input
                    type="text"
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded focus:outline-none focus:border-blue-500 text-slate-800"
                  />
                </div>

                {/* Target Amount */}
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-500">Goal Target Amount</label>
                    <span className="text-xs font-bold text-slate-700">₹{formatCurrency(goalAmount)}</span>
                  </div>
                  <input
                    type="range"
                    min={50000}
                    max={50000000}
                    step={50000}
                    value={goalAmount}
                    onChange={(e) => setGoalAmount(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>₹50K</span>
                    <span>₹5 Cr</span>
                  </div>
                </div>

                {/* Timeline in Years */}
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-500">Timeline (Years)</label>
                    <span className="text-xs font-bold text-slate-700">{timelineYears} Year{timelineYears > 1 ? 's' : ''}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={40}
                    step={1}
                    value={timelineYears}
                    onChange={(e) => setTimelineYears(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>1 Yr</span>
                    <span>40 Yrs</span>
                  </div>
                </div>

                {/* Current Savings */}
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-500">Current Savings</label>
                    <span className="text-xs font-bold text-slate-700">₹{formatCurrency(currentSavings)}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={20000000}
                    step={25000}
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>₹0</span>
                    <span>₹2 Cr</span>
                  </div>
                </div>

                {/* Monthly Investment Capacity */}
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-500">Monthly SIP Capacity</label>
                    <span className="text-xs font-bold text-slate-700">₹{formatCurrency(monthlyInvestment)} / mo</span>
                  </div>
                  <input
                    type="range"
                    min={500}
                    max={500000}
                    step={500}
                    value={monthlyInvestment}
                    onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>₹500</span>
                    <span>₹5L</span>
                  </div>
                </div>

                {/* Expected Return Rate */}
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-500">Expected Annual Returns</label>
                    <span className="text-xs font-bold text-slate-700">{expectedReturn}%</span>
                  </div>
                  <input
                    type="range"
                    min={4}
                    max={30}
                    step={0.5}
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>4% (Debt)</span>
                    <span>30% (Aggressive Midcap)</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right Column: Goal Outputs */}
          <div className="md:col-span-7 space-y-4">
            {result ? (
              <div className="space-y-4">
                
                {/* Visual Readiness Progress */}
                <div className="section-card">
                  <h3 className="section-title">Goal Readiness Score</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-slate-700">Projected Goal Coverage</span>
                      <span className="text-lg font-bold text-blue-600">{result.progress_percent}%</span>
                    </div>

                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${result.progress_percent}%` }}
                      ></div>
                    </div>

                    {result.is_on_track ? (
                      <div className="flex items-center gap-1.5 text-xs text-profit font-semibold">
                        <CheckCircle size={14} />
                        <span>On Track! Your planned SIP is sufficient to hit this goal in {timelineYears} years.</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-loss font-semibold">
                        <AlertCircle size={14} />
                        <span>Shortfall Warning: You need higher SIP or higher return asset allocation to reach this goal.</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Primary Metrics Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="section-card py-4 px-5">
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block mb-1">Required Monthly SIP</span>
                    <span className="text-xl font-bold font-mono text-slate-800">₹{formatCurrency(result.required_monthly_sip)}</span>
                  </div>

                  <div className="section-card py-4 px-5">
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block mb-1">Projected Final Corpus</span>
                    <span className="text-xl font-bold font-mono text-slate-800 font-semibold text-blue-600">₹{formatCurrency(result.projected_corpus)}</span>
                  </div>
                </div>

                {/* Secondary details */}
                <div className="section-card">
                  <h3 className="section-title">Status Audit</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between py-1 border-b border-slate-100 text-sm">
                      <span className="text-slate-500">Current Monthly SIP Allocation</span>
                      <span className="font-mono text-slate-700 font-semibold">₹{formatCurrency(monthlyInvestment)}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-100 text-sm">
                      <span className="text-slate-500">Surplus / (Shortfall)</span>
                      <span className={`font-mono font-bold ${result.shortfall_or_surplus >= 0 ? 'text-profit' : 'text-loss'}`}>
                        {result.shortfall_or_surplus >= 0 ? '+' : ''}₹{formatCurrency(result.shortfall_or_surplus)}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-100 text-sm">
                      <span className="text-slate-500">Goal Target Amount</span>
                      <span className="font-mono text-slate-700">₹{formatCurrency(goalAmount)}</span>
                    </div>

                    <div className="flex justify-between py-1 text-sm">
                      <span className="text-slate-500">Estimated Horizon Growth</span>
                      <span className="font-mono text-slate-600">({timelineYears} Years at {expectedReturn}% CAGR)</span>
                    </div>
                  </div>
                </div>

                {/* AI Advisor Context recommendation block */}
                <div className="p-4 rounded border border-blue-100 bg-blue-50/50 flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-blue-800 font-bold">
                    <Target size={14} className="text-blue-600" />
                    <span>Loki Wealth Coach Recommendation</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {result.is_on_track 
                      ? `Fantastic job! With your current investment capacity of ₹${formatCurrency(monthlyInvestment)}/mo and ₹${formatCurrency(currentSavings)} in base savings, you will surpass your ₹${formatCurrency(goalAmount)} target by ₹${formatCurrency(result.shortfall_or_surplus)}. You can maintain this allocation or slightly lower your risk exposure to high-equity mutual funds if you want a safer journey.`
                      : `You have a shortfall of ₹${formatCurrency(Math.abs(result.shortfall_or_surplus))} for this goal. To bridge this, increase your monthly investment capacity from ₹${formatCurrency(monthlyInvestment)} to ₹${formatCurrency(result.required_monthly_sip)}/mo, or re-allocate your existing mutual funds to Parag Parikh Flexi Cap Fund or Motilal Oswal Midcap Fund to aim for ${expectedReturn}%+ returns.`
                    }
                  </p>
                </div>

              </div>
            ) : (
              <div className="section-card py-12 text-center text-slate-400">
                <p>Generating projections...</p>
              </div>
            )}
          </div>

        </div>

        {/* Disclaimer */}
        <div className="p-4 rounded border border-slate-200 bg-slate-50 flex items-start gap-2.5">
          <Info size={14} className="text-slate-500 mt-0.5 flex-shrink-0" />
          <p className="text-[11.5px] text-slate-500 leading-normal">
            ⚠️ <strong>Safety warning: </strong>Loki Finance Copilot does not guarantee wealth milestones, target returns, or specific portfolio values. Market investments are highly subject to fluctuations. Projections use standardized compound formulas assuming constant returns; real CAGR varies year by year.
          </p>
        </div>

      </div>
    </AppLayout>
  );
}
