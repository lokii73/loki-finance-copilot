'use client';
import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { plannersAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Info, ShieldAlert, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function RetirementPlannerPage() {
  const [currentAge, setCurrentAge] = useState(21);
  const [retirementAge, setRetirementAge] = useState(50);
  const [desiredMonthlyExpense, setDesiredMonthlyExpense] = useState(75000);
  const [inflationRate, setInflationRate] = useState(6);
  const [existingInvestments, setExistingInvestments] = useState(2076);
  const [preReturn, setPreReturn] = useState(12);
  const [postReturn, setPostReturn] = useState(8);

  const [result, setResult] = useState<{ [key: string]: any } | null>(null);
  const [loading, setLoading] = useState(false);

  const calculate = async () => {
    setLoading(true);
    try {
      const res = await plannersAPI.calculateRetirement({
        current_age: currentAge,
        retirement_age: retirementAge,
        desired_monthly_expense: desiredMonthlyExpense,
        inflation_rate: inflationRate,
        existing_investments: existingInvestments,
        pre_return: preReturn,
        post_return: postReturn,
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => calculate(), 500);
    return () => clearTimeout(t);
  }, [currentAge, retirementAge, desiredMonthlyExpense, inflationRate, existingInvestments, preReturn, postReturn]);

  return (
    <AppLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Retirement Target Planner</h1>
            <p className="text-xs text-slate-500 mt-0.5">Calculate your required retirement nest egg and inflation-adjusted monthly savings requirements</p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Form Inputs */}
          <div className="lg:col-span-5 space-y-4">
            <div className="section-card">
              <h3 className="section-title">Configure Retirement Goals</h3>
              
              <div className="space-y-4 mt-4">
                {/* Age settings */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Current Age</label>
                    <input
                      type="number"
                      min={18}
                      max={79}
                      value={currentAge}
                      onChange={(e) => setCurrentAge(Math.min(Number(e.target.value), retirementAge - 1))}
                      className="input-premium py-2 text-xs font-mono font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Retirement Age</label>
                    <input
                      type="number"
                      min={currentAge + 1}
                      max={85}
                      value={retirementAge}
                      onChange={(e) => setRetirementAge(Math.max(Number(e.target.value), currentAge + 1))}
                      className="input-premium py-2 text-xs font-mono font-bold text-slate-900"
                    />
                  </div>
                </div>

                {/* Desired Monthly Expense */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Desired Expense (Today's Value)</label>
                    <span className="text-xs font-bold text-slate-900 font-mono">₹{formatCurrency(desiredMonthlyExpense)} / mo</span>
                  </div>
                  <input
                    type="range"
                    min={10000}
                    max={1000000}
                    step={10000}
                    value={desiredMonthlyExpense}
                    onChange={(e) => setDesiredMonthlyExpense(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer bg-slate-200 h-1 rounded-full appearance-none"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase mt-1 tracking-wider">
                    <span>₹10K</span>
                    <span>₹10L</span>
                  </div>
                </div>

                {/* Inflation Rate */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Assumed Inflation Rate</label>
                    <span className="text-xs font-bold text-slate-900 font-mono">{inflationRate}%</span>
                  </div>
                  <input
                    type="range"
                    min={4}
                    max={12}
                    step={0.5}
                    value={inflationRate}
                    onChange={(e) => setInflationRate(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer bg-slate-200 h-1 rounded-full appearance-none"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase mt-1 tracking-wider">
                    <span>4% (Low)</span>
                    <span>12% (Extreme)</span>
                  </div>
                </div>

                {/* Existing Investments */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Existing Nest Egg</label>
                    <span className="text-xs font-bold text-slate-900 font-mono">₹{formatCurrency(existingInvestments)}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={50000000}
                    step={100000}
                    value={existingInvestments}
                    onChange={(e) => setExistingInvestments(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer bg-slate-200 h-1 rounded-full appearance-none"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase mt-1 tracking-wider">
                    <span>₹0</span>
                    <span>₹5 Cr</span>
                  </div>
                </div>

                {/* Pre retirement return rate */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Expected Pre-Retirement Returns</label>
                    <span className="text-xs font-bold text-slate-900 font-mono">{preReturn}%</span>
                  </div>
                  <input
                    type="range"
                    min={6}
                    max={25}
                    step={0.5}
                    value={preReturn}
                    onChange={(e) => setPreReturn(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer bg-slate-200 h-1 rounded-full appearance-none"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase mt-1 tracking-wider">
                    <span>6% (Conservative)</span>
                    <span>25% (High Growth Equity)</span>
                  </div>
                </div>

                {/* Post retirement return rate */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Expected Post-Retirement Returns</label>
                    <span className="text-xs font-bold text-slate-900 font-mono">{postReturn}%</span>
                  </div>
                  <input
                    type="range"
                    min={4}
                    max={15}
                    step={0.5}
                    value={postReturn}
                    onChange={(e) => setPostReturn(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer bg-slate-200 h-1 rounded-full appearance-none"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500 font-bold uppercase mt-1 tracking-wider">
                    <span>4% (PF/FDR Only)</span>
                    <span>15% (Hybrid Growth)</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right Column: Goal Outputs */}
          <div className="lg:col-span-7 space-y-4">
            {result ? (
              <div className="space-y-4">
                
                {/* Visual Progress card */}
                <div className="section-card">
                  <h3 className="section-title">Retirement Readiness Target</h3>
                  
                  <div className="space-y-3 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500">Existing Coverage of Target Corpus</span>
                      <span className="text-base font-extrabold text-blue-600 font-mono">{result.retirement_readiness_score}%</span>
                    </div>

                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-305"
                        style={{ width: `${Math.min(result.retirement_readiness_score, 100)}%` }}
                      ></div>
                    </div>

                    {result.retirement_readiness_score >= 80 ? (
                      <div className="flex items-center gap-1.5 text-xs text-profit font-bold">
                        <ShieldCheck size={14} className="text-emerald-500" />
                        <span>NEST EGG ON TRACK: Current portfolio assets compound exceptionally well.</span>
                      </div>
                    ) : result.retirement_readiness_score >= 40 ? (
                      <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold">
                        <Info size={14} className="text-amber-500" />
                        <span>MODERATE TARGET: Consistent pre-retirement SIP is recommended to secure deficit targets.</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-loss font-bold">
                        <AlertTriangle size={14} className="text-red-500" />
                        <span>CORPUS SHORTFALL: Expand savings immediately to reach retirement target before age {retirementAge}.</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Primary Metrics Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="section-card py-4 px-5">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Required Monthly SIP</span>
                    <span className="text-lg font-extrabold font-mono text-slate-900">₹{formatCurrency(result.required_pre_retirement_sip)}</span>
                  </div>

                  <div className="section-card py-4 px-5">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Retirement Nest Egg Needed</span>
                    <span className="text-lg font-extrabold font-mono text-blue-600">₹{formatCurrency(result.retirement_corpus_needed)}</span>
                  </div>
                </div>

                {/* Secondary details */}
                <div className="section-card">
                  <h3 className="section-title">Nest Egg Structure</h3>
                  
                  <div className="space-y-3 mt-4">
                    <div className="flex justify-between py-1.5 border-b border-slate-100 text-xs">
                      <span className="text-slate-600">Inflation-adjusted Expense at retirement</span>
                      <span className="font-mono text-slate-900 font-bold">₹{formatCurrency(result.inflated_monthly_expense)} / mo</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-100 text-xs">
                      <span className="text-slate-600">Future value of existing nest egg</span>
                      <span className="font-mono text-slate-700">₹{formatCurrency(result.future_value_existing)}</span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-100 text-xs">
                      <span className="text-slate-600">Net Nest Egg Deficit</span>
                      <span className="font-mono text-loss font-bold">
                        ₹{formatCurrency(Math.max(result.retirement_corpus_needed - result.future_value_existing, 0))}
                      </span>
                    </div>

                    <div className="flex justify-between py-1.5 text-xs">
                      <span className="text-slate-600">Accumulation Window</span>
                      <span className="font-mono text-slate-500 font-semibold">{retirementAge - currentAge} Years remaining</span>
                    </div>
                  </div>
                </div>

                {/* AI Advice Context recommendation block */}
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50 shadow-sm flex flex-col gap-2.5">
                  <div className="flex items-center gap-1.5 text-xs text-blue-600 font-bold uppercase tracking-wider">
                    <Sparkles size={14} className="text-blue-600" />
                    <span>Loki AI Coach Nest Egg Forecast</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    Due to {inflationRate}% inflation, your current desired lifestyle of ₹{formatCurrency(desiredMonthlyExpense)}/mo will escalate to ₹{formatCurrency(result.inflated_monthly_expense)}/mo by the time you retire at {retirementAge}. To sustain this for 25 years without running out of money, you must accumulate a total nest egg of ₹{formatCurrency(result.retirement_corpus_needed)}.  
                    {result.required_pre_retirement_sip > 0 
                      ? ` Set up a monthly SIP of ₹${formatCurrency(result.required_pre_retirement_sip)} divided between a high-growth equity mutual fund like Parag Parikh Flexi Cap Fund (expected 12% Pre-Retirement return) to comfortably meet the shortfall.` 
                      : ` Your existing assets will compound to ₹${formatCurrency(result.future_value_existing)}, perfectly exceeding your target corpus. You do not have any mandatory retirement SIP shortfall!`
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
            ⚠️ <strong>Safety Warning:</strong> Loki Finance Copilot does not guarantee specific retirement nest eggs, annuity payouts, or returns. Market investments are highly subject to fluctuations. Projections assume constant returns; real inflation rates and CAGR vary year by year.
          </p>
        </div>

      </div>
    </AppLayout>
  );
}
