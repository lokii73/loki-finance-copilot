'use client';
import { useRouter } from 'next/navigation';
import { TrendingUp, ArrowRight, ShieldCheck, BarChart3, Calculator } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  const handleLaunchDashboard = () => {
    localStorage.setItem('stockgpt_token', 'mock_token_key_9837482');
    localStorage.setItem('stockgpt_user', JSON.stringify({ name: 'Logesh', email: 'logesh@stockgpt.in' }));
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans flex flex-col justify-between">
      
      {/* Top Simple Header */}
      <header className="border-b border-slate-200 py-4 bg-white">
        <div className="max-w-5xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
              L
            </div>
            <span className="font-semibold text-base text-slate-800">Loki Finance Copilot</span>
          </div>
          <button 
            onClick={handleLaunchDashboard} 
            className="btn-flat text-xs font-semibold px-4 py-2"
          >
            Launch Dashboard
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center space-y-6">
        <div className="inline-block px-3 py-1 rounded bg-slate-100 text-xs font-semibold text-slate-600">
          Personal AI Wealth & Exit Copilot V1.0
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Clean, Minimalist Exit Alerts <br />
          <span className="text-blue-600">& Goal Planning for India</span>
        </h1>
        <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
          Avoid delayed stock exits, analyze negative promoter pledging or moving average breakdowns, and compounding plans in a simple, data-first terminal.
        </p>

        <div className="pt-4 flex justify-center">
          <button 
            onClick={handleLaunchDashboard}
            className="btn-flat px-8 py-3.5 text-sm font-semibold flex items-center gap-2 shadow"
          >
            <span>Access Portfolio Dashboard</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* Flat Notion-Style Feature Matrix */}
      <section className="max-w-5xl mx-auto px-6 py-12 border-t border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded border border-slate-200 bg-slate-50/50 space-y-3">
            <ShieldCheck size={20} className="text-blue-600" />
            <h3 className="text-sm font-semibold text-slate-800">Stock Exit Dashboards</h3>
            <p className="text-xs text-slate-500 leading-normal">
              Track real-time stop-loss levels, moving average crossovers, and promoter pledges.
            </p>
          </div>
          <div className="p-6 rounded border border-slate-200 bg-slate-50/50 space-y-3">
            <BarChart3 size={20} className="text-[var(--profit-green)]" />
            <h3 className="text-sm font-semibold text-slate-800">Exit Strategy Engine</h3>
            <p className="text-xs text-slate-500 leading-normal">
              Get probability-based recommendations like Continue Holding, Partial Booking, or Exit.
            </p>
          </div>
          <div className="p-6 rounded border border-slate-200 bg-slate-50/50 space-y-3">
            <Calculator size={20} className="text-slate-700" />
            <h3 className="text-sm font-semibold text-slate-800">Milestone Goal Calculators</h3>
            <p className="text-xs text-slate-500 leading-normal">
              Simulate base, optimistic, and inflation-adjusted retirement timelines instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimers & Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-10 text-center text-xs text-slate-500 space-y-2">
        <p className="font-semibold text-slate-700">Loki Finance Copilot is a simple probability wealth track engine.</p>
        <p className="max-w-2xl mx-auto leading-normal">
          ⚠️ Mutual Fund and Equity investments are subject to market risks. We provide probability-based insights for educational and tracking support. We are not a SEBI-registered advisor.
        </p>
        <p className="pt-2">© 2026 Loki Finance Copilot. All Rights Reserved.</p>
      </footer>

    </div>
  );
}
