"""
News Intelligence Engine — market news with portfolio impact analysis.
Covers NSE, BSE, RBI, macro events and how they affect Logesh's holdings.
"""
from fastapi import APIRouter
from typing import List, Dict, Any
from datetime import datetime, timedelta
import random

router = APIRouter()

NEWS_FEED = [
    {
        "id": "1",
        "category": "Portfolio Alert",
        "severity": "High",
        "headline": "Nifty Midcap 150 corrects 3.2% on FII outflows — HDFCMID150 ETF impacted",
        "summary": "Foreign institutional investors pulled ₹4,200 Cr from Indian midcap segment in May 2026 amid global risk-off sentiment. Nifty Midcap 150 index fell 3.2% to 22,840 levels.",
        "impact_type": "Negative",
        "your_portfolio_impact": "Direct. Your HDFCMID150 ETF tracks this index. Current NAV ₹22.53 is -5.11% below your buy price of ₹23.74. Monitor support at ₹21.50.",
        "affected_holdings": ["MOF_MIDCAP", "HDFC_MIDCAP", "NIPPON_SMALLCAP"],
        "source": "NSE Market Data",
        "time_ago": "Today, 2:15 PM",
        "action_required": True,
    },
    {
        "id": "2",
        "category": "RBI Policy",
        "severity": "Medium",
        "headline": "RBI holds repo rate at 6.25% — signals potential cut in August 2026",
        "summary": "Reserve Bank of India's MPC voted 5-1 to maintain repo rate at 6.25%. Governor Malhotra signalled flexibility for a 25bps cut if inflation trends below 4.5% by July.",
        "impact_type": "Positive",
        "your_portfolio_impact": "Indirect positive. Rate cuts are historically bullish for midcap and smallcap segments as borrowing costs reduce. Your midcap funds may benefit.",
        "affected_holdings": ["MOF_MIDCAP", "HDFC_MIDCAP"],
        "source": "RBI Monetary Policy Committee",
        "time_ago": "Yesterday, 12:00 PM",
        "action_required": False,
    },
    {
        "id": "3",
        "category": "Sector — PSU",
        "severity": "High",
        "headline": "Government FY27 budget signals 12% cut in PSU capex allocation",
        "summary": "Finance Ministry's mid-year review indicates PSU infrastructure capex may be trimmed by 12% in FY27 to manage fiscal deficit. Analyst consensus is bearish on PSU equities near-term.",
        "impact_type": "Negative",
        "your_portfolio_impact": "Direct impact on your ABSL PSU Equity Fund SIP (₹25/month). PSU sector may face 6-12 month headwinds. Consider pausing SIP and redirecting to index fund.",
        "affected_holdings": ["ABSL_PSU"],
        "source": "Finance Ministry Budget Review",
        "time_ago": "2 days ago",
        "action_required": True,
    },
    {
        "id": "4",
        "category": "Macro — USD/INR",
        "severity": "Medium",
        "headline": "Rupee weakens to ₹84.6/USD — implications for export-heavy midcaps",
        "summary": "INR depreciated 0.8% this week amid dollar strength following strong US jobs data. Analysts expect ₹84-86 range for next quarter.",
        "impact_type": "Mixed",
        "your_portfolio_impact": "Mixed for your portfolio. IT midcap companies in Motilal Oswal fund benefit from weaker INR (higher export revenues). FMCG and auto companies face input cost pressure.",
        "affected_holdings": ["MOF_MIDCAP", "HDFC_MIDCAP"],
        "source": "BSE Currency Data",
        "time_ago": "3 days ago",
        "action_required": False,
    },
    {
        "id": "5",
        "category": "Fund Performance",
        "severity": "Low",
        "headline": "HDFC Mid Cap Opportunities Fund retains 5-star CRISIL rating for Q1 FY27",
        "summary": "CRISIL upgraded HDFC Mid Cap Opportunities Fund to 5-star in its quarterly mutual fund ranking. Fund maintained top-quartile performance with 18.6% 3Y CAGR.",
        "impact_type": "Positive",
        "your_portfolio_impact": "Positive for your ₹800/month SIP. Confirms HDFC Mid Cap as the correct core midcap choice. Continue SIP confidently.",
        "affected_holdings": ["HDFC_MIDCAP"],
        "source": "CRISIL Mutual Fund Ratings",
        "time_ago": "4 days ago",
        "action_required": False,
    },
    {
        "id": "6",
        "category": "Macro — Inflation",
        "severity": "Low",
        "headline": "India CPI inflation eases to 4.1% in April 2026 — below RBI's 4.5% comfort zone",
        "summary": "Consumer Price Index fell to 4.1% YoY in April 2026, driven by food price moderation. This is the lowest reading in 14 months and opens the door for RBI rate cuts.",
        "impact_type": "Positive",
        "your_portfolio_impact": "Broadly positive for equity mutual funds. Lower inflation reduces cost-of-living pressures on companies and supports corporate earnings growth.",
        "affected_holdings": ["MOF_MIDCAP", "HDFC_MIDCAP", "NIPPON_SMALLCAP"],
        "source": "Ministry of Statistics, MOSPI",
        "time_ago": "5 days ago",
        "action_required": False,
    },
    {
        "id": "7",
        "category": "Market Structure",
        "severity": "Medium",
        "headline": "SEBI tightens F&O margin rules — reduces speculative pressure on midcaps",
        "summary": "SEBI's new F&O position limit rules effective June 2026 reduce speculative leverage in the midcap segment. Expected to reduce short-term volatility.",
        "impact_type": "Positive",
        "your_portfolio_impact": "Medium-term positive for your midcap mutual funds. Less speculative activity should reduce extreme NAV swings.",
        "affected_holdings": ["MOF_MIDCAP", "HDFC_MIDCAP", "NIPPON_SMALLCAP"],
        "source": "SEBI Circular SEBI/HO/MRD/2026",
        "time_ago": "1 week ago",
        "action_required": False,
    },
    {
        "id": "8",
        "category": "Portfolio Advice",
        "severity": "High",
        "headline": "⚠️ AI Portfolio Alert: No large-cap allocation detected in your portfolio",
        "summary": "Loki Finance Copilot's automated portfolio scan detected 97% midcap concentration. A Nifty 50 Index Fund SIP should be your immediate next step before any other investment action.",
        "impact_type": "Action Required",
        "your_portfolio_impact": "This is your #1 portfolio risk. If midcap segment corrects 30-40% (which happens every 3-5 years), your entire portfolio declines. A Nifty 50 anchor reduces this drawdown risk significantly.",
        "affected_holdings": ["MOF_MIDCAP", "HDFC_MIDCAP", "NIPPON_SMALLCAP", "ABSL_PSU"],
        "source": "Loki AI Portfolio Engine",
        "time_ago": "Portfolio Analysis",
        "action_required": True,
    },
]

MARKET_IMPACT_SCENARIOS = [
    {
        "event": "Crude Oil Price +15%",
        "likely_negative": ["Aviation (IndiGo, Air India)", "Logistics & Transport", "Paints (Asian Paints)", "Tyre companies", "FMCG (higher packaging costs)"],
        "likely_positive": ["Oil producers (ONGC, Oil India)", "Shipping companies"],
        "your_exposure": "Moderate — HDFC Mid Cap holds some FMCG & logistics positions. Motilal's concentrated bets may include paint stocks.",
    },
    {
        "event": "USD/INR weakens to ₹88",
        "likely_negative": ["Oil importers", "Gold importers", "Companies with USD debt"],
        "likely_positive": ["IT exports (Infosys, TCS mid-caps)", "Pharma exporters", "Textile exporters"],
        "your_exposure": "Low-medium — Motilal Oswal holds IT mid-cap stocks which benefit from INR weakness.",
    },
    {
        "event": "RBI Rate Cut 25bps",
        "likely_negative": ["Bank NIM compression (short-term)", "Fixed deposit returns"],
        "likely_positive": ["Real estate stocks", "NBFCs", "Auto companies (lower loan EMIs)", "Midcap growth stocks (lower discount rate)"],
        "your_exposure": "Positive — all your midcap funds benefit from rate cuts as growth stocks re-rate higher.",
    },
    {
        "event": "Indian Elections / Political Uncertainty",
        "likely_negative": ["PSU stocks (policy uncertainty)", "Infrastructure plays", "Capex-heavy sectors"],
        "likely_positive": ["Defensive FMCG", "Healthcare", "IT exports"],
        "your_exposure": "High risk — your ABSL PSU Fund is directly exposed. Midcap funds also see volatility in election periods.",
    },
]


@router.get("/")
async def get_news() -> List[Dict[str, Any]]:
    return NEWS_FEED


@router.get("/market-impact")
async def get_market_impact() -> List[Dict[str, Any]]:
    return MARKET_IMPACT_SCENARIOS


@router.get("/summary")
async def get_news_summary() -> Dict[str, Any]:
    action_required = [n for n in NEWS_FEED if n["action_required"]]
    positive = [n for n in NEWS_FEED if n["impact_type"] == "Positive"]
    negative = [n for n in NEWS_FEED if n["impact_type"] == "Negative"]
    return {
        "total_alerts": len(NEWS_FEED),
        "action_required": len(action_required),
        "positive_signals": len(positive),
        "negative_signals": len(negative),
        "market_sentiment": "Cautiously Positive",
        "sentiment_score": 58,
    }
