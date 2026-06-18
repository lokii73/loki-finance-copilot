import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
}

export function formatPercent(num: number, decimals = 2): string {
  if (num === null || num === undefined || isNaN(num)) return '0.00%';
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(decimals)}%`;
}

export function getChangeColor(value: number): string {
  if (value === null || value === undefined || isNaN(value)) return 'text-slate-400';
  if (value > 0) return 'text-emerald-400';
  if (value < 0) return 'text-red-400';
  return 'text-slate-400';
}

export function getChangeBg(value: number): string {
  if (value === null || value === undefined || isNaN(value)) return 'bg-slate-500/10 text-slate-400';
  if (value > 0) return 'bg-emerald-500/10 text-emerald-400';
  if (value < 0) return 'bg-red-500/10 text-red-400';
  return 'bg-slate-500/10 text-slate-400';
}

export function getScoreColor(score: number): string {
  if (score === null || score === undefined || isNaN(score)) return 'text-slate-400';
  if (score >= 75) return 'text-emerald-400';
  if (score >= 50) return 'text-yellow-400';
  return 'text-red-400';
}

export function getVerdictConfig(verdict: string) {
  const configs: Record<string, { color: string; bg: string; icon: string }> = {
    'Buy Candidate': { color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30', icon: '🚀' },
    'Hold': { color: 'text-yellow-400', bg: 'bg-yellow-500/15 border-yellow-500/30', icon: '⏸️' },
    'Review': { color: 'text-orange-400', bg: 'bg-orange-500/15 border-orange-500/30', icon: '🔍' },
    'Avoid': { color: 'text-red-400', bg: 'bg-red-500/15 border-red-500/30', icon: '🚫' },
    'Good for Long-term SIP': { color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30', icon: '✅' },
  };
  return configs[verdict] || { color: 'text-slate-400', bg: 'bg-slate-500/15 border-slate-500/30', icon: '⚪' };
}

export function getRiskConfig(risk: string) {
  const configs: Record<string, { color: string; bg: string }> = {
    'Low': { color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    'Moderate': { color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    'High': { color: 'text-orange-400', bg: 'bg-orange-500/10' },
    'Very High': { color: 'text-red-400', bg: 'bg-red-500/10' },
  };
  return configs[risk] || { color: 'text-slate-400', bg: 'bg-slate-500/10' };
}

export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}
