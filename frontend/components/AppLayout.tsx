'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LogOut, LayoutDashboard, ShieldAlert,
  BookOpen, Star, Target, PiggyBank, Newspaper,
  MessageSquare, Menu, X, BarChart2, BrainCircuit
} from 'lucide-react';

const navItems = [
  { href: '/dashboard',           label: 'Dashboard',          icon: LayoutDashboard },
  { href: '/portfolio',           label: 'Intelligence',       icon: BrainCircuit },
  { href: '/exit-alerts',         label: 'Exit Alerts',        icon: ShieldAlert },
  { href: '/mutual-funds',        label: 'Mutual Funds',       icon: BookOpen },
  { href: '/recommendations',     label: 'Picks',              icon: Star },
  { href: '/goal-planner',        label: 'Goals',              icon: Target },
  { href: '/retirement-planner',  label: 'Retirement',         icon: PiggyBank },
  { href: '/news-alerts',         label: 'News',               icon: Newspaper },
  { href: '/chat',                label: 'AI Advisor',         icon: MessageSquare },
];

// Bottom tab bar — 5 most-used pages on mobile
const mobileTabItems = [
  { href: '/dashboard',   label: 'Home',         icon: LayoutDashboard },
  { href: '/portfolio',   label: 'Intelligence', icon: BrainCircuit },
  { href: '/exit-alerts', label: 'Alerts',       icon: ShieldAlert },
  { href: '/mutual-funds',label: 'Funds',        icon: BarChart2 },
  { href: '/chat',        label: 'AI',           icon: MessageSquare },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState('Logesh');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('stockgpt_token');
    if (!token) { router.push('/login'); return; }
    try {
      const user = localStorage.getItem('stockgpt_user');
      if (user) setUserName(JSON.parse(user).name || 'Logesh');
    } catch {}
  }, [router]);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('stockgpt_token');
    localStorage.removeItem('stockgpt_user');
    router.push('/login');
  };

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-page)' }}>

      {/* ── Desktop / Tablet Top Nav ── */}
      <header className="top-nav">
        <div className="top-nav-inner">

          {/* Brand */}
          <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center font-bold text-white text-sm">L</div>
            <span className="font-semibold text-[15px] tracking-tight text-slate-800 hidden sm:block">
              Loki Finance Copilot
            </span>
          </Link>

          {/* Desktop nav links (hidden on mobile) */}
          <nav className="nav-links desktop-nav">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link-item ${isActive(item.href) ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 hidden lg:block">
              {userName}
            </span>
            <button
              onClick={handleLogout}
              className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1 cursor-pointer bg-transparent border-none hidden md:flex"
            >
              <LogOut size={12} />
              <span>Exit</span>
            </button>

            {/* Hamburger (mobile only) */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* ── Mobile Slide-Down Menu ── */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="py-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`mobile-menu-item ${isActive(item.href) ? 'mobile-menu-item-active' : ''}`}
                  >
                    <Icon size={16} className="flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <div className="px-4 pt-2 pb-3 border-t border-slate-100 mt-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-500 text-sm font-medium w-full"
                >
                  <LogOut size={14} />
                  <span>Logout ({userName})</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ── Main Content ── */}
      {/* Extra bottom padding on mobile so content isn't hidden behind bottom tab bar */}
      <main className="flex-1 app-container py-6 pb-24 md:pb-8">
        {children}
      </main>

      {/* ── Desktop Footer ── */}
      <footer className="hidden md:block border-t border-slate-200 bg-slate-50 py-5 text-center text-xs text-slate-500">
        <div className="app-container">
          <p className="font-medium mb-1 text-slate-600">Loki Finance Copilot — Personal AI Wealth Manager</p>
          <p className="max-w-2xl mx-auto leading-normal">
            ⚠️ Not SEBI-registered advice. Market investments carry volatile risks. Final decisions belong strictly to you.
          </p>
        </div>
      </footer>

      {/* ── Mobile Bottom Tab Bar ── */}
      <nav className="md:hidden mobile-tab-bar">
        {mobileTabItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mobile-tab-item ${active ? 'mobile-tab-item-active' : ''}`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

    </div>
  );
}
