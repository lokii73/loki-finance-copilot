'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, TrendingUp, PieChart, BarChart3, Globe,
  MessageSquare, Calculator, Lightbulb, LogOut, Mic, Sparkles,
  ChevronRight, Compass, IndianRupee, ShieldAlert
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Overview Command', icon: LayoutDashboard },
  { href: '/portfolio', label: 'Health Radar', icon: PieChart },
  { href: '/stocks', label: 'Broad Equity', icon: TrendingUp },
  { href: '/mutual-funds', label: 'Managed Assets', icon: BarChart3 },
  { href: '/market', label: 'Intel Feed', icon: Globe },
  { href: '/chat', label: 'AI Copilot Chat', icon: MessageSquare },
  { href: '/projections', label: 'Wealth Pathing', icon: Calculator },
  { href: '/recommendations', label: 'Optimal Plan', icon: Lightbulb },
];

interface SidebarProps {
  userName?: string;
}

export default function Sidebar({ userName = 'Logesh' }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [micActive, setMicActive] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('stockgpt_token');
    localStorage.removeItem('stockgpt_user');
    router.push('/login');
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 flex-shrink-0"
      style={{ background: 'var(--bg-sidebar)', borderRight: '1px solid var(--border-dim)' }}>
      
      {/* Brand Header */}
      <div className="p-6 border-b border-[var(--border-dim)] flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #00df89, #0072f5)' }}>
            <Sparkles size={16} color="white" />
          </div>
          <div>
            <div className="font-extrabold text-[13.5px] tracking-tight text-white group-hover:text-gray-300">
              StockGPT India
            </div>
            <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
              AI Financial OS
            </div>
          </div>
        </Link>
      </div>

      {/* Dynamic Status / Interactive Orbs */}
      <div className="px-4 py-4 space-y-2">
        <div className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-[var(--border-dim)]"
          style={{ background: 'rgba(255,255,255,0.01)' }}>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10.5px] font-bold text-gray-400 uppercase tracking-wider">AI Copilot Core</span>
          </div>
          <span className="text-[9px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20">
            ACTIVE
          </span>
        </div>

        {/* Mic Activation Center */}
        <button 
          onClick={() => setMicActive(!micActive)}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all ${
            micActive 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
              : 'bg-transparent border-[var(--border-dim)] text-gray-400 hover:text-white hover:bg-white/[0.02]'
          }`}
        >
          <div className="flex items-center gap-2">
            <Mic size={13} className={micActive ? 'animate-bounce' : ''} />
            <span className="text-[11px] font-semibold">Voice Commands</span>
          </div>
          <span className="text-[9px] font-bold opacity-60">
            {micActive ? 'LISTENING...' : 'TAP'}
          </span>
        </button>
      </div>

      {/* Copilot Navigation System */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="text-[9px] font-bold text-gray-600 uppercase tracking-widest px-3 mb-2">
          OPERATING SHELLS
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[12.5px] font-medium transition-all ${
                isActive 
                  ? 'bg-white/[0.04] text-white border border-[var(--border-normal)] shadow-inner' 
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.02] border border-transparent'
              }`}
            >
              <Icon size={15} className={isActive ? 'text-emerald-400' : 'text-gray-500'} />
              <span>{item.label}</span>
              {isActive && <ChevronRight size={12} className="ml-auto text-emerald-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Elegant Apple Wallet-Style Profile Card & Sign Out */}
      <div className="p-4 border-t border-[var(--border-dim)] space-y-2">
        <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border-dim)]"
          style={{ background: 'rgba(255,255,255,0.01)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-inner"
            style={{ background: 'linear-gradient(135deg, #7928ca, #0072f5)' }}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-bold text-white truncate">{userName}</div>
            <div className="text-[9px] text-gray-500 font-medium uppercase tracking-wider">Premium OS Client</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-[11px] font-bold text-red-400/80 hover:text-red-400 hover:bg-red-500/5 transition-all border border-transparent hover:border-red-500/10"
        >
          <LogOut size={13} />
          <span>SHUTDOWN SHELL</span>
        </button>
      </div>
    </aside>
  );
}
