'use client';
import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { recommendationsAPI } from '@/lib/api';
import { CheckCircle2, Info, ShieldCheck, Sparkles } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function RecommendationsPage() {
  const [recs, setRecs] = useState<{ priority: string; [key: string]: any }[]>([]);
  const [actionPlan, setActionPlan] = useState<{ [key: string]: any } | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    Promise.all([
      recommendationsAPI.getAll(),
      recommendationsAPI.getActionPlan(),
    ]).then(([r, a]) => {
      setRecs(r.data);
      setActionPlan(a.data);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "Critical": return "bg-red-50 text-red-600 border-red-200";
      case "High": return "bg-orange-50 text-orange-600 border-orange-200";
      case "Medium": return "bg-amber-50 text-amber-600 border-amber-200";
      default: return "bg-blue-50 text-blue-600 border-blue-200";
    }
  };

  const buyAssetList = [
    {
      name: "Parag Parikh Flexi Cap Fund",
      type: "Mutual Fund",
      buyRange: "SIP Any Value",
      target: "₹85 (NAV)",
      stopLoss: "₹65 (NAV)",
      priority: "Critical",
      rationale: "Rank #1: Core Multi-cap compounding with built-in international diversification. Exceptional downside protection."
    },
    {
      name: "UTI Nifty 50 Index Fund",
      type: "Mutual Fund",
      buyRange: "SIP Any Value",
      target: "₹185 (NAV)",
      stopLoss: "₹140 (NAV)",
      priority: "Critical",
      rationale: "Rank #2: Ultimate large-cap index anchor. Tracks India's top 50 blue chips with industry-low tracking error."
    },
    {
      name: "Reliance Industries Ltd (RELIANCE)",
      type: "Stock",
      buyRange: "₹2,880 - ₹2,980",
      target: "₹3,250",
      stopLoss: "₹2,720",
      priority: "High",
      rationale: "Rank #3: Strong FMCG/Retail expansion and upcoming Jio telecom tariff hikes drive reliable free cash flow."
    },
    {
      name: "Tata Consultancy Services (TCS)",
      type: "Stock",
      buyRange: "₹3,820 - ₹3,920",
      target: "₹4,250",
      stopLoss: "₹3,680",
      priority: "High",
      rationale: "Rank #4: Industry-leading IT margins, highly predictable enterprise contract book, and exceptional dividend payouts."
    },
    {
      name: "HDFC Bank Ltd (HDFCBANK)",
      type: "Stock",
      buyRange: "₹1,480 - ₹1,520",
      target: "₹1,800",
      stopLoss: "₹1,410",
      priority: "High",
      rationale: "Rank #5: Merger integration pain is priced in. Trading at historical low valuation boundaries relative to book value."
    },
    {
      name: "Infosys Ltd (INFY)",
      type: "Stock",
      buyRange: "₹1,480 - ₹1,530",
      target: "₹1,750",
      stopLoss: "₹1,390",
      priority: "Medium",
      rationale: "Rank #6: Robust digital transformation pipelines. Solid margin recovery supported by strong large cloud deals."
    },
    {
      name: "ITC Ltd (ITC)",
      type: "Stock",
      buyRange: "₹415 - ₹435",
      target: "₹490",
      stopLoss: "₹395",
      priority: "Medium",
      rationale: "Rank #7: Defensive FMCG heavyweight. Hotel spin-off unlocks structural value; low downside market beta."
    },
    {
      name: "Tata Motors Ltd (TATA MOTORS)",
      type: "Stock",
      buyRange: "₹920 - ₹960",
      target: "₹1,120",
      stopLoss: "₹880",
      priority: "Medium",
      rationale: "Rank #8: Leader in Indian EV passenger vehicles. JLR global premium portfolio margins continue to expand."
    },
    {
      name: "Quant Active Fund (Direct Growth)",
      type: "Mutual Fund",
      buyRange: "SIP Only",
      target: "₹580 (NAV)",
      stopLoss: "₹460 (NAV)",
      priority: "Low",
      rationale: "Rank #9: Highly dynamic momentum play utilizing VLRT framework. Delivers exceptional category-beating active alphas."
    },
    {
      name: "Nippon India Small Cap Fund",
      type: "Mutual Fund",
      buyRange: "SIP Only",
      target: "₹190 (NAV)",
      stopLoss: "₹145 (NAV)",
      priority: "Low",
      rationale: "Rank #10: Premier small-cap compounding alpha generator. Stretched index levels require disciplined SIPs."
    }
  ];

  const filteredRecs = filter === 'All' 
    ? recs 
    : recs.filter(r => r.priority === filter);

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
          <h1 className="text-xl font-bold text-slate-800">AI Recommendations</h1>
          <p className="text-xs text-slate-500 mt-0.5">Prioritized strategic action plans, target buy ranges, and asset redirection indicators</p>
        </div>

        {/* Action Priority Summaries */}
        {actionPlan && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="section-card py-4 px-5 text-center">
              <span className="text-3xl font-extrabold text-red-500 font-mono block mb-0.5">
                {buyAssetList.filter(b => b.priority === 'Critical').length}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Critical Actions</span>
            </div>
            <div className="section-card py-4 px-5 text-center">
              <span className="text-3xl font-extrabold text-orange-500 font-mono block mb-0.5">
                {buyAssetList.filter(b => b.priority === 'High').length}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">High Priority</span>
            </div>
            <div className="section-card py-4 px-5 text-center">
              <span className="text-3xl font-extrabold text-amber-500 font-mono block mb-0.5">
                {buyAssetList.filter(b => b.priority === 'Medium').length}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Medium Items</span>
            </div>
            <div className="section-card py-4 px-5 text-center">
              <span className="text-3xl font-extrabold text-blue-600 font-mono block mb-0.5">
                {recs.filter(r => r.priority === 'Medium' || r.priority === 'Low').length}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Nice To Have</span>
            </div>
          </div>
        )}

        {/* Section 1: Buy List and Targets Table */}
        <div className="section-card">
          <h3 className="section-title">Loki AI Tactical Buy List (Stocks & Mutual Funds)</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Recommended Asset</th>
                  <th>Asset Type</th>
                  <th>Ideal Buy Range</th>
                  <th>Target Price</th>
                  <th>Stop Loss</th>
                  <th>Priority</th>
                  <th>Tactical AI Rationale & Audits</th>
                </tr>
              </thead>
              <tbody>
                {buyAssetList.map((asset, index) => (
                  <tr key={asset.name} className="hover:bg-slate-50/50">
                    <td className="font-bold text-slate-400 font-mono text-xs">#{index + 1}</td>
                    <td className="font-semibold text-slate-800 text-sm">{asset.name}</td>
                    <td className="text-xs text-slate-500 font-semibold">{asset.type}</td>
                    <td className="font-mono text-slate-700 text-xs font-bold">{asset.buyRange}</td>
                    <td className="font-mono text-profit font-semibold text-xs">{asset.target}</td>
                    <td className="font-mono text-loss font-semibold text-xs">{asset.stopLoss}</td>
                    <td>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getPriorityBadge(asset.priority)}`}>
                        {asset.priority}
                      </span>
                    </td>
                    <td className="text-xs text-slate-600 leading-relaxed font-normal max-w-sm">
                      {asset.rationale}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Core Strategic Rebalancing Rationale Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          <div className="md:col-span-7 space-y-4">
            <div className="section-card h-full">
              <h3 className="section-title flex items-center gap-2">
                <Sparkles className="text-blue-600" size={18} />
                <span>AI Portfolio Optimization Blueprint</span>
              </h3>
              
              <div className="space-y-4 text-sm font-normal text-slate-600 leading-relaxed">
                <p>
                  Logesh, at **21 years old**, your absolute biggest compounding superpower is **TIME**. However, your current actual portfolio has an extreme risk structural flaw: **96.5% concentration in Midcaps**. 
                </p>
                <p>
                  To optimize your wealth trajectory toward your **Financial Freedom** goal, we recommend executing these two core steps:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded border border-slate-200 bg-slate-50/50 space-y-1">
                    <span className="text-xs font-bold text-slate-800 block">Step 1: Anchor the Core</span>
                    <span className="text-xs text-slate-500 leading-relaxed block">
                      Direct **₹8,000/month** of your planned increase into **UTI Nifty 50 Index Fund** to build a strong Large Cap shield.
                    </span>
                  </div>
                  <div className="p-3 rounded border border-slate-200 bg-slate-50/50 space-y-1">
                    <span className="text-xs font-bold text-slate-800 block">Step 2: Diversify Dynamic Alpha</span>
                    <span className="text-xs text-slate-500 leading-relaxed block">
                      Direct **₹6,000/month** into **Parag Parikh Flexi Cap Fund** for exposure to global US giants and diversified midcaps.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 space-y-4">
            <div className="section-card h-full">
              <h3 className="section-title flex items-center gap-2">
                <ShieldCheck className="text-emerald-500" size={18} />
                <span>Urgent Action Plan Checklist</span>
              </h3>
              
              <div className="space-y-3.5">
                <div className="flex gap-2.5 items-start">
                  <CheckCircle2 size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-slate-600 leading-snug font-normal">
                    <strong>UTI Nifty 50 Index:</strong> Add SIP of ₹500 - ₹1,000 to offset overall midcap volatility index spikes.
                  </span>
                </div>

                <div className="flex gap-2.5 items-start">
                  <CheckCircle2 size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-slate-600 leading-snug font-normal">
                    <strong>Parag Parikh Flexi Cap:</strong> Initiate ₹500 SIP allocation for currency protection and global stock exposure.
                  </span>
                </div>

                <div className="flex gap-2.5 items-start">
                  <CheckCircle2 size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-slate-600 leading-snug font-normal">
                    <strong>ABSL PSU Equity Fund:</strong> Stop active ₹25 SIP and redirect that flow to index components.
                  </span>
                </div>

                <div className="flex gap-2.5 items-start">
                  <CheckCircle2 size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-slate-600 leading-snug font-normal">
                    <strong>TCS & INFY:</strong> Continue holding core IT shares as standard defensive dividend-yielding anchors.
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Disclaimer */}
        <div className="p-4 rounded border border-slate-200 bg-slate-50 flex items-start gap-2.5">
          <Info size={14} className="text-slate-500 mt-0.5 flex-shrink-0" />
          <p className="text-[11.5px] text-slate-500 leading-normal font-normal">
            ⚠️ <strong>Safety warning: </strong>Loki Finance Copilot buy lists and targets are decision-support insights generated proportionally using historical indices. They do not constitute SEBI registered investment advisories. Market investments are highly subject to fluctuations. The final choice and execution completely belong to you.
          </p>
        </div>

      </div>
    </AppLayout>
  );
}
