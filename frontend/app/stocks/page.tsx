'use client';
import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { stocksAPI } from '@/lib/api';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { Info } from 'lucide-react';
import Link from 'next/link';

export default function StocksPage() {
  const [stocks, setStocks] = useState<{ [key: string]: any }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    stocksAPI.getAll().then((r) => {
      setStocks(r.data);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <AppLayout>
      <div className="flex items-center justify-center py-32">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500 tracking-wide">Scanning equity positions...</p>
        </div>
      </div>
    </AppLayout>
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Stock Holdings</h1>
            <p className="text-xs text-slate-500 mt-0.5">Asset monitoring panel for direct equity stock components</p>
          </div>
        </div>

        {/* Section 1: Stocks Table */}
        <div className="section-card">
          <h3 className="section-title">Direct Equity Positions</h3>
          <div className="table-wrapper mt-4">
            <table>
              <thead>
                <tr>
                  <th>Stock Symbol</th>
                  <th>Company Name</th>
                  <th>Quantity</th>
                  <th>Avg buying cost</th>
                  <th>Current Price</th>
                  <th>Total Invested</th>
                  <th>Current Value</th>
                  <th>Total Gain / Loss</th>
                  <th>AI Score</th>
                  <th>AI Verdict</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock) => {
                  const pnlIsPositive = stock.pnl >= 0;
                  return (
                    <tr key={stock.symbol}>
                      <td>
                        <Link href={`/stocks/${stock.symbol}`} className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-all duration-150">
                          {stock.symbol}
                        </Link>
                      </td>
                      <td className="text-slate-600">{stock.company_name}</td>
                      <td className="font-mono text-slate-700 font-medium">{stock.quantity}</td>
                      <td className="font-mono text-slate-600">₹{stock.avg_buy_price}</td>
                      <td className="font-mono text-slate-900 font-bold">₹{stock.current_price}</td>
                      <td className="font-mono text-slate-600">{formatCurrency(stock.invested_value)}</td>
                      <td className="font-mono text-slate-700">{formatCurrency(stock.current_value)}</td>
                      <td className={`font-mono font-bold ${pnlIsPositive ? 'text-profit' : 'text-loss'}`}>
                        {pnlIsPositive ? '+' : ''}{formatCurrency(stock.pnl)} ({formatPercent(stock.pnl_percent)})
                      </td>
                      <td className="font-extrabold text-amber-600 font-mono">{stock.investment_score}/100</td>
                      <td>
                        <span className={`badge ${
                          stock.verdict === 'Buy Candidate' 
                            ? 'badge-green' 
                            : stock.verdict === 'Hold' 
                            ? 'badge-gold' 
                            : 'badge-red'
                        }`}>
                          {stock.verdict}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex items-start gap-2.5 max-w-3xl">
          <Info size={15} className="text-slate-500 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-slate-500 leading-relaxed">
            ⚠️ Direct equity stock trading is subject to high short-term price volatility. Always consult a qualified SEBI-registered advisor before executing stock placements.
          </p>
        </div>

      </div>
    </AppLayout>
  );
}
