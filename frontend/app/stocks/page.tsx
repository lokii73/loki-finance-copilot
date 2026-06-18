'use client';
import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { stocksAPI } from '@/lib/api';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { Info } from 'lucide-react';

export default function StocksPage() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    stocksAPI.getAll().then((r) => {
      setStocks(r.data);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <AppLayout>
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
      </div>
    </AppLayout>
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-xl font-bold text-slate-800">Stock Holdings</h1>
          <p className="text-xs text-slate-500 mt-0.5">Asset monitoring panel for direct equity stock components</p>
        </div>

        {/* Section 1: Stocks Table */}
        <div className="section-card">
          <h3 className="section-title">Direct Equity Positions</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Stock Symbol</th>
                  <th>Company Name</th>
                  <th>Quantity</th>
                  <th>Avg Buying Cost</th>
                  <th>Current Valuation Price</th>
                  <th>Total Invested</th>
                  <th>Current Asset Value</th>
                  <th>Total Gain / Loss</th>
                  <th>AI Score</th>
                  <th>AI Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock) => (
                  <tr key={stock.symbol}>
                    <td className="font-semibold text-blue-600">{stock.symbol}</td>
                    <td className="text-slate-500">{stock.company_name}</td>
                    <td className="font-mono text-slate-700">{stock.quantity}</td>
                    <td className="font-mono text-slate-700">₹{stock.avg_buy_price}</td>
                    <td className="font-mono text-slate-800 font-semibold">₹{stock.current_price}</td>
                    <td className="font-mono text-slate-700">{formatCurrency(stock.invested_value)}</td>
                    <td className="font-mono text-slate-800">{formatCurrency(stock.current_value)}</td>
                    <td className={`font-mono font-semibold ${stock.pnl >= 0 ? 'text-profit' : 'text-loss'}`}>
                      {stock.pnl >= 0 ? '+' : ''}{formatCurrency(stock.pnl)} ({formatPercent(stock.pnl_percent)})
                    </td>
                    <td className="font-semibold text-amber-500">{stock.investment_score}/100</td>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-4 rounded border border-slate-200 bg-slate-50 flex items-start gap-2.5">
          <Info size={14} className="text-slate-500 mt-0.5 flex-shrink-0" />
          <p className="text-[11.5px] text-slate-500 leading-normal">
            ⚠️ Direct equity stock trading is subject to high short-term price volatility. Always consult a qualified SEBI-registered advisor before executing stock placements.
          </p>
        </div>

      </div>
    </AppLayout>
  );
}
