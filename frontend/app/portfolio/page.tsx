'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
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
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(0, 0, 0, 0.05)" strokeWidth={8} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={8}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1s ease' }} />
        <text x={size/2} y={size/2+1} textAnchor="middle" dominantBaseline="middle"
          style={{ transform:`rotate(90deg)`,transformOrigin:`${size/2}px ${size/2}px`,
            fill:'#0f172a',fontSize:20,fontWeight:800,fontFamily:'JetBrains Mono,monospace' }}>
          {score}
        </text>
      </svg>
      <div className="text-center">
        <p className="text-xs font-bold text-slate-700">{label}</p>
        <p className="text-[10px] text-slate-500 mt-0.5">{sublabel}</p>
      </div>
    </div>
  );
}

function ScoreBar({ label, score, note, status }: { label:string;score:number;note:string;status:string }) {
  const color = status==='excellent'?'#10b981':status==='good'?'#3b82f6':status==='warning'?'#f59e0b':'#ef4444';
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-slate-700">{label}</span>
        <span className="text-xs font-bold font-mono" style={{color}}>{score}/100</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
        <div className="h-full rounded-full" style={{width:`${score}%`,backgroundColor:color,transition:'width 0.7s ease'}} />
      </div>
      <p className="text-[11px] text-slate-500 leading-relaxed">{note}</p>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string,string> = {
    Critical:'bg-red-50 text-red-600 border-red-200',
    High:'bg-orange-50 text-orange-600 border-orange-200',
    Medium:'bg-amber-50 text-amber-600 border-amber-200',
    Low:'bg-blue-50 text-blue-600 border-blue-200',
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider ${styles[priority]||styles.Low}`}>{priority}</span>;
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

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(()=>{ loadData(); },[]);

  if (loading) return (
    <AppLayout>
      <div className="flex items-center justify-center py-32">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500 tracking-wide">Executing portfolio analytics engine...</p>
        </div>
      </div>
    </AppLayout>
  );

  if (error) return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center py-24 gap-5">
        <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center shadow-sm">
          <WifiOff size={24} className="text-red-500 animate-pulse" />
        </div>
        <p className="font-bold text-slate-900 text-base">Backend Connection Failure</p>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
          Ensure FastAPI is running: <span className="font-mono text-blue-600">uvicorn app.main:app --reload</span>
        </p>
        <button onClick={loadData} className="btn-flat flex items-center gap-2"><RefreshCw size={13}/><span>Retry</span></button>
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
    {id:'overview',label:'Portfolio Quality'},
    {id:'risk',label:'Risk Analysis'},
    {id:'diversity',label:'Diversification'},
    {id:'wealth',label:'Wealth Potential'},
  ];

  return (
    <AppLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Intelligence Radar</h1>
            <p className="text-xs text-slate-500 mt-0.5">AI analysis of {investor.broker} portfolio assets</p>
          </div>
          <button onClick={loadData} className="btn-flat-secondary flex items-center gap-1.5 py-2 text-xs">
            <RefreshCw size={13}/><span className="hidden sm:inline">Reload Scan</span>
          </button>
        </div>

        {/* 4 Score Rings */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {label:'Portfolio Score',sublabel:'Quality Index',score:scores.portfolio_score,
              color:scores.portfolio_score>=70?'#10b981':scores.portfolio_score>=40?'#f59e0b':'#ef4444'},
            {label:'Risk Score',sublabel:'Volatility Rating',score:scores.risk_score,
              color:scores.risk_score>=75?'#ef4444':scores.risk_score>=50?'#f59e0b':'#10b981'},
            {label:'Diversification',sublabel:'Alloc Spread',score:scores.diversification_score,
              color:scores.diversification_score>=70?'#10b981':scores.diversification_score>=40?'#f59e0b':'#ef4444'},
            {label:'Wealth Score',sublabel:'Growth Potential',score:scores.wealth_score,
              color:scores.wealth_score>=70?'#10b981':scores.wealth_score>=40?'#f59e0b':'#ef4444'},
          ].map(s=>(
            <div key={s.label} className="section-card flex flex-col items-center py-5">
              <ScoreRing {...s}/>
            </div>
          ))}
        </div>

        {/* Radar + Strengths/Weaknesses */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 section-card">
            <h3 className="section-title">Portfolio Radar Topology</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(0, 0, 0, 0.05)"/>
                  <PolarAngleAxis dataKey="metric" tick={{fontSize:10,fill:'#64748b'}}/>
                  <Radar name="Portfolio Score" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2.5}/>
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 11, color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-3 section-card">
            <h3 className="section-title">Anomalies & Strengths Check</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
              <div>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-3">✅ Active Strengths</p>
                <div className="space-y-3">
                  {summary.strengths.map((s:string,i:number)=>(
                    <div key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 size={13} className="text-emerald-500 mt-0.5 flex-shrink-0"/>
                      <span className="text-xs text-slate-600 leading-normal">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider mb-3">⚠️ Critical Weaknesses</p>
                <div className="space-y-3">
                  {summary.weaknesses.map((w:string,i:number)=>(
                    <div key={i} className="flex items-start gap-2.5">
                      <XCircle size={13} className="text-red-500 mt-0.5 flex-shrink-0"/>
                      <span className="text-xs text-slate-600 leading-normal">{w}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deep Dive Tabs */}
        <div className="section-card">
          <div className="flex gap-2 border-b border-slate-200 mb-5 -mx-6 px-6 overflow-x-auto hide-scrollbar">
            {tabs.map(tab=>(
              <button key={tab.id} onClick={()=>setActiveTab(tab.id)}
                className={`flex-shrink-0 px-4 py-3 text-xs font-bold border-b-2 transition-all duration-150 whitespace-nowrap ${
                  activeTab===tab.id?'border-blue-600 text-blue-600':'border-transparent text-slate-500 hover:text-slate-900'
                }`}>
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab==='overview' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
              {portfolio_score_breakdown.map((item:any)=><ScoreBar key={item.label} {...item}/>)}
            </div>
          )}

          {activeTab==='risk' && (
            <div className="space-y-6">
              <div className="flex items-start gap-2.5 p-4 rounded-xl bg-red-50 border border-red-100">
                <AlertTriangle size={15} className="text-red-500 flex-shrink-0 mt-0.5"/>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your risk score is <strong className="text-slate-900">{scores.risk_score}/100</strong>. This exceeds the ideal threshold (40-65) for balanced investors. Reallocating part of midcap funds to low-beta index assets is recommended to stabilize variance.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                {risk_score_breakdown.map((item:any)=><ScoreBar key={item.label} {...item}/>)}
              </div>
            </div>
          )}

          {activeTab==='diversity' && (
            <div className="space-y-6">
              <div>
                <p className="metric-label mb-3">Asset & Sector Classes Coverage</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.entries(diversification_breakdown.category_coverage).map(([cat,covered])=>(
                    <div key={cat} className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-bold transition-all duration-150 ${
                      covered ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}>
                      {covered ? <CheckCircle2 size={13} className="text-emerald-500"/> : <XCircle size={13} className="text-slate-400"/>}
                      <span>{cat.replace(/_/g,' ').replace(/\b\w/g,l=>l.toUpperCase())}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 pt-2">
                {diversification_breakdown.score_by_dimension.map((item:any)=>(
                  <ScoreBar key={item.dimension} label={item.dimension} score={item.score}
                    note={item.note} status={item.score>=70?'good':item.score>=40?'warning':'danger'}/>
                ))}
              </div>
            </div>
          )}

          {activeTab==='wealth' && (
            <div className="space-y-6">
              <div className="flex items-start gap-2.5 p-4 rounded-xl bg-blue-50 border border-blue-100">
                <Zap size={15} className="text-blue-500 flex-shrink-0 mt-0.5"/>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your long-term wealth scoring benefits highly from early Direct-plan compounding. A small initial amount like <strong className="text-slate-900">₹1,325/month</strong> growing at an standard 14% rate yields significant growth milestones. Keep SIP schedules running consistently.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
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
            <Target size={16} className="text-blue-600"/>
            <span>Priority Action Checklist</span>
          </h3>
          <div className="space-y-3 mt-4">
            {priority_actions.map((action:any)=>(
              <div key={action.rank} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 transition-colors shadow-sm">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center text-xs font-extrabold flex-shrink-0 mt-0.5 shadow-md shadow-blue-500/20">
                  {action.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-900">{action.action}</span>
                    <PriorityBadge priority={action.priority}/>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-2">{action.impact}</p>
                  <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold">
                    <span className="text-blue-600 font-mono">{action.amount}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500">{action.fund}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-amber-600 font-mono">{action.timeline}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center py-3 px-4 bg-white border border-slate-200 rounded-xl text-[10px] text-slate-500 max-w-3xl mx-auto shadow-sm">
          ⚠️ Not SEBI-registered advice. All scores are AI-generated probability assessments for decision support only.
        </div>
      </div>
    </AppLayout>
  );
}
