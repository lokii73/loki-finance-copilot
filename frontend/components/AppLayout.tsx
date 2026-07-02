'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LogOut, LayoutDashboard, ShieldAlert,
  BookOpen, Star, Target, PiggyBank, Newspaper,
  MessageSquare, Menu, X, BarChart2, BrainCircuit, Sparkles
} from 'lucide-react';

const mainMenuItems = [
  { href: '/dashboard',           label: 'Dashboard',          icon: LayoutDashboard },
  { href: '/portfolio',           label: 'Portfolio Radar',    icon: BrainCircuit },
  { href: '/exit-alerts',         label: 'Exit Alerts',        icon: ShieldAlert },
  { href: '/mutual-funds',        label: 'Mutual Funds',       icon: BookOpen },
  { href: '/recommendations',     label: 'Top Picks',          icon: Star },
  { href: '/stock-suggestions',   label: 'Stock Ideas',        icon: Sparkles },
];

const preferencesItems = [
  { href: '/goal-planner',        label: 'Goal Planner',       icon: Target },
  { href: '/retirement-planner',  label: 'Retirement Plan',    icon: PiggyBank },
  { href: '/news-alerts',         label: 'News Alerts',        icon: Newspaper },
  { href: '/chat',                label: 'AI Advisor',         icon: MessageSquare },
];

const mobileTabItems = [
  { href: '/dashboard',   label: 'Home',         icon: LayoutDashboard },
  { href: '/portfolio',   label: 'Radar',        icon: BrainCircuit },
  { href: '/exit-alerts', label: 'Alerts',       icon: ShieldAlert },
  { href: '/mutual-funds',label: 'Funds',        icon: BarChart2 },
  { href: '/chat',        label: 'AI Chat',      icon: MessageSquare },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState('Logesh');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('stockgpt_token');
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      const user = localStorage.getItem('stockgpt_user');
      if (user) {
        const userData = JSON.parse(user);
        setUserName(userData.name || 'Logesh');
      }
    } catch {}
  }, [router]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('stockgpt_token');
    localStorage.removeItem('stockgpt_user');
    router.push('/login');
  };

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="min-h-screen flex">
      
      {/* ── Left Sidebar (Desktop Navigation inspired by Demo Image) ── */}
      <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 flex-shrink-0 border-r border-slate-200 bg-white shadow-sm z-10">
        {/* Brand Logo Header */}
        <div className="p-6 border-b border-slate-100">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20">
              <Sparkles size={16} />
            </div>
            <div>
              <div className="font-extrabold text-[15px] tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                Loki Finance
              </div>
              <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                AI Wealth Copilot
              </div>
            </div>
          </Link>
        </div>

        {/* Sidebar Menu Sections */}
        <div className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
          {/* Main Menu Group */}
          <div>
            <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3 mb-2">
              MAIN MENU
            </div>
            <nav className="space-y-1">
              {mainMenuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150 ${
                      active
                        ? 'bg-blue-50/80 text-blue-600'
                        : 'text-slate-500 hover:text-blue-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={15} className={active ? 'text-blue-600' : 'text-slate-400'} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Preferences Group */}
          <div>
            <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3 mb-2">
              PREFERENCES
            </div>
            <nav className="space-y-1">
              {preferencesItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150 ${
                      active
                        ? 'bg-blue-50/80 text-blue-600'
                        : 'text-slate-500 hover:text-blue-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={15} className={active ? 'text-blue-600' : 'text-slate-400'} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Watchlists Group (Inspired directly by the Demo Image Sidebar) */}
          <div>
            <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3 mb-2">
              WATCHLISTS
            </div>
            <div className="space-y-2 px-3 pt-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">NVDA</span>
                <span className="text-emerald-500 font-bold font-mono">+5.9%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">TSLA</span>
                <span className="text-emerald-500 font-bold font-mono">+8.2%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700">COIN</span>
                <span className="text-emerald-500 font-bold font-mono">+4.7%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Card & Logout bottom element */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-100 bg-slate-50">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-tr from-blue-500 to-indigo-500">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-bold text-slate-800 truncate">{userName}</div>
              <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">PREMIUM ACCOUNT</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-[11px] font-bold text-red-500 hover:text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
          >
            <LogOut size={13} />
            <span>SHUTDOWN SHELL</span>
          </button>
        </div>
      </aside>

      {/* ── Main Layout Wrapper ── */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <header className="lg:hidden flex items-center justify-between h-16 px-4 bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs shadow-md shadow-blue-500/20">
              L
            </div>
            <span className="font-extrabold text-sm tracking-tight text-slate-900">
              Loki Finance
            </span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded text-slate-500 hover:text-blue-600"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        {/* Mobile Slide-Down Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-200 bg-white sticky top-16 z-40 max-h-[calc(100vh-120px)] overflow-y-auto shadow-sm">
            <div className="py-3">
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-4 mb-2">
                MAIN MENU
              </div>
              {mainMenuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 ${
                      active ? 'bg-blue-50/50 text-blue-600 border-l-2 border-blue-600' : ''
                    }`}
                  >
                    <Icon size={16} className={active ? 'text-blue-600' : 'text-slate-400'} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-4 mt-4 mb-2">
                PREFERENCES
              </div>
              {preferencesItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 ${
                      active ? 'bg-blue-50/50 text-blue-600 border-l-2 border-blue-600' : ''
                    }`}
                  >
                    <Icon size={16} className={active ? 'text-blue-600' : 'text-slate-400'} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <div className="px-4 py-3 border-t border-slate-100 mt-3 flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-600">{userName}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-red-500 hover:text-red-600 text-xs font-bold"
                >
                  <LogOut size={13} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 app-container py-8 pb-24 lg:pb-8 space-y-6">
          
          {/* Welcome Dashboard Greeting + Holdings horizontal row */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Good morning, {userName}!
                </h1>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  Don&apos;t forget to take a look at the holdings today 📈
                </p>
              </div>
            </div>

            {/* Top Holdings horizontal row ticker */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap self-center mr-1">Top Holdings:</span>
              <div className="ticker-pill flex-shrink-0">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span className="font-bold text-slate-700">TSLA</span>
                <span className="font-mono text-slate-900 font-bold">₹24,050</span>
                <span className="text-profit font-bold font-mono">+8.2%</span>
              </div>
              <div className="ticker-pill flex-shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="font-bold text-slate-700">NVDA</span>
                <span className="font-mono text-slate-900 font-bold">₹52,030</span>
                <span className="text-profit font-bold font-mono">+5.9%</span>
              </div>
              <div className="ticker-pill flex-shrink-0">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span className="font-bold text-slate-700">COIN</span>
                <span className="font-mono text-slate-900 font-bold">₹9,510</span>
                <span className="text-profit font-bold font-mono">+4.7%</span>
              </div>
            </div>
          </div>

          {/* Children Pages */}
          <div className="pt-2">
            {children}
          </div>
        </main>

        {/* Desktop Footer (Hidden on Mobile) */}
        <footer className="hidden lg:block py-6 text-center text-[11px] text-slate-400">
          <div className="app-container">
            <p className="font-bold mb-1 text-slate-500">Loki Finance Copilot — Premium Finance Dashboard</p>
            <p className="max-w-2xl mx-auto leading-normal">
              ⚠️ Not SEBI-registered advisory services. Equity and Mutual Fund investments are subject to volatile market risks. Final decisions belong strictly to your portfolio execution.
            </p>
          </div>
        </footer>

        {/* Mobile Bottom Navigation Bar (Hidden on Desktop) */}
        <nav className="lg:hidden mobile-tab-bar">
          {mobileTabItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`mobile-tab-item ${active ? 'mobile-tab-item-active' : ''}`}
              >
                <Icon size={18} />
                <span className="text-[9px] mt-0.5">{item.label}</span>
              </Link>
            );
          })}
        </nav>

      </div>
    </div>
  );
}
