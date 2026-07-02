'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
import { Lock, Mail, Eye, EyeOff, TrendingUp, IndianRupee, BarChart3, Shield } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('logesh@stockgpt.in');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await authAPI.login(email, password);
      const { access_token, user_name, user_email } = res.data;
      localStorage.setItem('stockgpt_token', access_token);
      localStorage.setItem('stockgpt_user', JSON.stringify({ name: user_name, email: user_email }));
      router.push('/dashboard');
    } catch (error) {
      const err = error as { response?: { data?: { detail?: string } } };
      setError(err.response?.data?.detail || 'Login failed. Try email: logesh@stockgpt.in / password: demo123');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: TrendingUp, text: 'AI Stock Analysis with Probability Scores' },
    { icon: BarChart3, text: 'Mutual Fund & SIP Tracker' },
    { icon: IndianRupee, text: 'Indian Market Intelligence' },
    { icon: Shield, text: 'Risk-based Portfolio Insights' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col w-1/2 p-12 justify-between relative overflow-hidden border-r border-slate-200 bg-slate-50/50">
        {/* Background gradient */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.05) 0%, rgba(99,102,241,0.03) 50%, rgba(16,185,129,0.02) 100%)' }} />
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20">
              <IndianRupee size={22} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-xl font-extrabold tracking-tight text-slate-900">Loki Finance Copilot</div>
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">AI Financial OS</div>
            </div>
          </div>

          <h1 className="text-4xl font-extrabold mb-6 text-slate-900 leading-tight">
            Your Premium<br />
            <span className="text-blue-600 font-black">Wealth Dashboard</span><br />
            for India
          </h1>
          <p className="text-sm text-slate-500 mb-10 leading-relaxed max-w-md">
            Data-driven insights built for direct mutual fund and stock investors. Zero guarantees, full transparency, beautifully designed.
          </p>

          <div className="space-y-4">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-white border border-slate-200 shadow-sm">
                  <f.icon size={16} className="text-blue-600" />
                </div>
                <span className="text-xs font-semibold text-slate-700">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-[10px] text-slate-400 leading-normal max-w-md border-t border-slate-200 pt-4">
            ⚠️ Loki Finance Copilot provides AI-generated insights for educational purposes only. 
            Not SEBI registered. Always consult a qualified financial advisor before investing.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative bg-white">
        <div className="w-full max-w-md relative z-10">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-md shadow-blue-500/20">
              <IndianRupee size={18} color="white" />
            </div>
            <div className="text-lg font-bold text-slate-900">Loki Finance</div>
          </div>

          <h2 className="text-2xl font-bold mb-2 text-slate-900">Welcome Back</h2>
          <p className="text-xs mb-8 text-slate-500">
            Sign in to view your portfolio insights and wealth tracker
          </p>

          {/* Demo credentials hint */}
          <div className="p-3.5 rounded-xl mb-6 text-xs bg-blue-50 border border-blue-100 text-slate-600 shadow-sm">
            <span className="text-blue-600 font-bold">Demo credentials pre-filled:</span>
            <span className="text-slate-500 ml-2">Email + Password (demo123)</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-premium pl-10"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-premium pl-10 pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl text-xs text-red-600 bg-red-50 border border-red-100 shadow-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Access Dashboard</span>
              )}
            </button>
          </form>

          <p className="text-center text-[10px] mt-6 text-slate-400 leading-normal">
            This is a personal finance tool for educational purposes.<br />
            Not financial advice. Invest responsibly.
          </p>
        </div>
      </div>
    </div>
  );
}
