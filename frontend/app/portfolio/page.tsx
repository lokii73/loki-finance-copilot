'use client';
import { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { portfolioIntelligenceAPI } from '@/lib/api';
import {
  AlertTriangle, RefreshCw, CheckCircle2, XCircle, Target, WifiOff, Zap
} from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

function ScoreRing({ score, label, sublabel, color, size = 96 }: {
  score: number; label: string; sublabel: string; color: string; size?: number;
}) {
  const r = (size / 2) - 8;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={8} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s ease' }} />
        <text x={size/2} y={size/2+1} textAnchor="middle" dominantBaseline="middle"
          style={{ transform:`rotate(90deg)`,transformOrigin:`${size/2}px ${size/2}px`,
            fill:'#1e293b',fontSize:22,fontWeight:700,fontFamily:'JetBrains Mono,monospace' }}>
          {score}
        </text>
      </svg>
      <div className="text-center">
        <p className="text-xs font-bold text-slate-700">{label}</p>
        <p className="text-[10px] text-slate-400 mt-0.5">{sublabel}</p>
      </div>
    </div>
  );
}

function ScoreBar({ label, score, note, status }: { label:string;score:number;note:string;status:string }) {
  const color = status==='excellent'?'#00b074':status==='good'?'#2563eb':status==='warning'?'#f59e0b':'#df514c';
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-slate-700">{label}</span>
        <span className="text-xs font-bold font-mono" style={{color}}>{score}/100</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{width:`${score}%`,backgroundColor:color,transition:'width 0.7s ease'}} />
      </div>
      <p className="text-[11px] text-slate-400 leading-normal">{note}</p>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string,string> = {
    Critical:'bg-red-50 text-red-600 border-red-200',
    High:'bg-orange-50 text-orange-600 border-orange-200',
    Medium:'bg-amber-50 text-amber-700 border-amber-200',
    Low:'bg-blue-50 text-blue-600 border-blue-200',
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wide ${styles[priority]||styles.Low}`}>{priority}</span>;
}

type TabId = 'overview'|'risk'|'diversity'|'wealth';

export default function PortfolioIntelligencePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const loadData = async () => {
    setLoading(true); setError(false);
    try {
      const res = await portfolioIntelligenceAPI.getIntelligence();
      setData(res.data);
    } catch { setError(true); }
    finally { setLoading(false); }
  };

  useEffect(()=>{ loadData(); },[]);

  if (loading) return (
    <AppLayout>
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Analysing portfolio intelligence...</p>
        </div>
      </div>
    </AppLayout>
  );

  if (error) return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <WifiOff size={32} className="text-slate-300" />
        <p className="font-semibold text-slate-700">Backend offline</p>
        <p className="text-xs text-slate-500">Start FastAPI: <span className="font-mono">uvicorn app.main:app --reload</span></p>
        <button onClick={loadData} className="btn-flat flex items-center gap-2"><RefreshCw size={13}/>Retry</button>
      </div>
    </AppLayout>
  );

  const { scores, investor, portfolio_score_breakdown, risk_score_breakdown,
    diversification_breakdown, wealth_score_breakdown, priority_actions, summary } = data;

  const radarData = [
    { metric: 'Portfolio Quality', value: scores.portfolio_score },
    { metric: 'Wealth Potential', value: scores.wealth_score },
    { metric: 'Diversification', value: scores.diversification_score },
    { metric: 'Safety', value: 100 - scores.risk_score },
    { metric: 'SIP Habit', value: 88 },
    { metric: 'Cost Efficiency', value: 78 },
  ];

  const tabs: {id:TabId;label:string}[] = [
    {id:'overview',label:'Portfolio Score'},
    {id:'risk',label:'Risk Analysis'},
    {id:'diversity',label:'Diversification'},
    {id:'wealth',label:'Wealth Score'},
  ];

  return (
    <AppLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex justify-between items-end border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Portfolio Intelligence Engine</h1>
            <p className="text-xs text-slate-500 mt-0.5">AI analysis of your Angel One portfolio — {investor.broker}</p>
          </div>
          <button onClick={loadData} className="btn-flat-secondary flex items-center gap-1.5 py-2 text-xs">
            <RefreshCw size={13}/><span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* 4 Score Rings */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {label:'Portfolio Score',sublabel:'Overall quality',score:scores.portfolio_score,
              color:scores.portfolio_score>=70?'#00b074':scores.portfolio_score>=40?'#f59e0b':'#df514c'},
            {label:'Risk Score',sublabel:'Lower is safer',score:scores.risk_score,
              color:scores.risk_score>=75?'#df514c':scores.risk_score>=50?'#f59e0b':'#00b074'},
            {label:'Diversification',sublabel:'Category spread',score:scores.diversification_score,
              color:scores.diversification_score>=70?'#00b074':scores.diversification_score>=40?'#f59e0b':'#df514c'},
            {label:'Wealth Score',sublabel:'Growth potential',score:scores.wealth_score,
              color:scores.wealth_score>=70?'#00b074':scores.wealth_score>=40?'#f59e0b':'#df514c'},
          ].map(s=>(
            <div key={s.label} className="section-card flex flex-col items-center py-5">
              <ScoreRing {...s}/>
            </div>
          ))}
        </div>

        {/* Radar + Strengths/Weaknesses */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 section-card">
            <h3 className="section-title">Portfolio Radar</h3>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#f1f5f9"/>
                  <PolarAngleAxis dataKey="metric" tick={{fontSize:10,fill:'#64748b'}}/>
                  <Radar name="Your Portfolio" dataKey="value" stroke="#2563eb" fill="#2563eb" fillOpacity={0.12} strokeWidth={2}/>
                  <Tooltip contentStyle={{fontSize:12}}/>
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-3 section-card">
            <h3 className="section-title">Strengths & Weaknesses</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wide mb-2">✅ What You&apos;re Doing Right</p>
                <div className="space-y-2">
                  {summary.strengths.map((s:string,i:number)=>(
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 size={13} className="text-profit mt-0.5 flex-shrink-0"/>
                      <span className="text-xs text-slate-600">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-red-500 uppercase tracking-wide mb-2">⚠️ What Needs Fixing</p>
                <div className="space-y-2">
                  {summary.weaknesses.map((w:string,i:number)=>(
                    <div key={i} className="flex items-start gap-2">
                      <XCircle size={13} className="text-loss mt-0.5 flex-shrink-0"/>
                      <span className="text-xs text-slate-600">{w}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deep Dive Tabs */}
        <div className="section-card">
          <div className="flex gap-0 border-b border-slate-100 mb-5 -mx-6 px-6 overflow-x-auto">
            {tabs.map(tab=>(
              <button key={tab.id} onClick={()=>setActiveTab(tab.id)}
                className={`flex-shrink-0 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  activeTab===tab.id?'border-blue-600 text-blue-600':'border-transparent text-slate-500 hover:text-slate-700'
                }`}>
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab==='overview' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
              {portfolio_score_breakdown.map((item:any)=><ScoreBar key={item.label} {...item}/>)}
            </div>
          )}

          {activeTab==='risk' && (
            <div className="space-y-5">
              <div className="flex items-start gap-2 p-3 rounded bg-red-50 border border-red-200">
                <AlertTriangle size={14} className="text-red-500 flex-shrink-0 mt-0.5"/>
                <p className="text-xs text-red-700">Your risk score is <strong>{scores.risk_score}/100</strong> — above ideal range (40-65) for a moderate-risk investor. Diversification into large-cap/index funds will reduce this.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
                {risk_score_breakdown.map((item:any)=><ScoreBar key={item.label} {...item}/>)}
              </div>
            </div>
          )}

          {activeTab==='diversity' && (
            <div className="space-y-5">
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-3">Category Coverage</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.entries(diversification_breakdown.category_coverage).map(([cat,covered])=>(
                    <div key={cat} className={`flex items-center gap-2 p-2.5 rounded border text-xs font-medium ${
                      covered?'bg-emerald-50 border-emerald-200 text-emerald-700':'bg-slate-50 border-slate-200 text-slate-400'
                    }`}>
                      {covered?<CheckCircle2 size={12}/>:<XCircle size={12}/>}
                      {cat.replace(/_/g,' ').replace(/\b\w/g,l=>l.toUpperCase())}
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
                {diversification_breakdown.score_by_dimension.map((item:any)=>(
                  <ScoreBar key={item.dimension} label={item.dimension} score={item.score}
                    note={item.note} status={item.score>=70?'good':item.score>=40?'warning':'danger'}/>
                ))}
              </div>
            </div>
          )}

          {activeTab==='wealth' && (
            <div className="space-y-5">
              <div className="flex items-start gap-2 p-3 rounded bg-blue-50 border border-blue-200">
                <Zap size={14} className="text-blue-600 flex-shrink-0 mt-0.5"/>
                <p className="text-xs text-blue-700">At age 21 with a 20-year horizon, your biggest asset is <strong>time</strong>. Even ₹1,325/month compounding at 14% CAGR becomes ₹1.8 Crore in 20 years.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
                {wealth_score_breakdown.map((item:any)=>(
                  <ScoreBar key={item.label} label={item.label} score={item.score} note={item.note}
                    status={item.score>=70?'excellent':item.score>=50?'good':item.score>=30?'warning':'danger'}/>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Priority Action Plan */}
        <div className="section-card">
          <h3 className="section-title flex items-center gap-2">
            <Target size={16} className="text-blue-600"/>Priority Action Plan
          </h3>
          <div className="space-y-3">
            {priority_actions.map((action:any)=>(
              <div key={action.rank} className="flex items-start gap-4 p-4 rounded border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {action.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-slate-800">{action.action}</span>
                    <PriorityBadge priority={action.priority}/>
                  </div>
                  <p className="text-xs text-slate-500 mb-1.5">{action.impact}</p>
                  <div className="flex flex-wrap gap-3 text-[11px]">
                    <span className="text-blue-600 font-semibold">{action.amount}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500">{action.fund}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-amber-600 font-semibold">{action.timeline}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center py-3 px-4 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-400">
          ⚠️ Not SEBI-registered advice. All scores are AI-generated probability assessments for decision support only.
        </div>
      </div>
    </AppLayout>
  );
}
