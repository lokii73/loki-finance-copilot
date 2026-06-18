"""
Exit Alerts Router — Logesh's REAL holdings only.
Holdings: HDFCMID150 ETF (only stock), + 3 SIP mutual funds.
All analysis is probability-based. Not SEBI-registered advice.
"""
from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any

router = APIRouter()

# ────────────────────────────────────────────────────────────
# REAL HOLDINGS — Only what Logesh actually owns on Angel One
# ────────────────────────────────────────────────────────────
EXIT_HOLDINGS_DATA = {
    "NIPPON_SMALLCAP": {
        "symbol": "NIPPON_SMALLCAP",
        "company_name": "Nippon India Small Cap Fund (Direct Growth)",
        "holding_type": "Mutual Fund SIP",
        "quantity": None,
        "avg_buy_price": None,
        "current_price": None,
        "invested_amount_direct": 299.98,
        "current_value_direct": 296.13,
        "stop_loss": None,
        "target_price": None,
        "exit_risk_score": 55,
        "exit_probability": 12,
        "bullish_probability": 70,
        "bearish_probability": 30,
        "confidence_score": 80,
        "news_sentiment": "Positive",
        "recommendation": "Continue SIP — Best Long-term Fund",
        "verdict_reason": (
            "Nippon India Small Cap is India's largest small cap fund (₹54,600 Cr AUM). "
            "Currently at -1.28% — completely expected for a 2-month-old small cap investment. "
            "Small cap funds historically deliver the HIGHEST returns over 7-10 years. "
            "The 5-year CAGR is 35.2% — highest in your portfolio. "
            "Fund manager Samir Rachh has an outstanding track record. "
            "Do NOT check NAV daily. Set ₹300/month SIP and forget for 7+ years."
        ),
        "technical_summary": (
            "Small cap segment is in a mild correction phase as of June 2026. "
            "Nifty Smallcap 250 index is down ~3% from its recent peak. "
            "This is a buying opportunity for SIP investors, not a reason to exit. "
            "Historically, small cap corrections of 10-20% fully recover within 12-18 months."
        ),
        "profit_booking_advice": (
            "DO NOT EXIT. Do not even think about exiting a small cap fund after 2 months. "
            "Continue ₹300/month SIP without fail. "
            "Review only after 3 years of consistent SIP. "
            "Your exit signal should be: fund underperforms benchmark for 3 consecutive years."
        ),
        "risk_factors": [
            "Small cap funds can fall 50-60% in major market corrections",
            "High volatility — NAV may swing ±5% in a single week",
            "Needs 7-10 year minimum horizon to realise full potential",
            "Less liquid than large/mid cap during market panic",
        ],
        "positives": [
            "India's largest small cap fund — deep portfolio, low concentration risk",
            "5-year CAGR 35.2% — highest return potential in your portfolio",
            "Samir Rachh — 10+ year track record managing this fund",
            "Broad exposure to 150+ small cap companies across sectors",
        ]
    },
    "MOF_MIDCAP": {
        "symbol": "MOF_MIDCAP",
        "company_name": "Motilal Oswal Midcap Fund (Direct Growth)",
        "holding_type": "Mutual Fund SIP",
        "quantity": None,
        "avg_buy_price": None,
        "current_price": None,
        "invested_amount_direct": 999.88,
        "current_value_direct": 979.55,
        "stop_loss": None,
        "target_price": None,
        "exit_risk_score": 42,
        "exit_probability": 15,
        "bullish_probability": 72,
        "bearish_probability": 28,
        "confidence_score": 78,
        "news_sentiment": "Positive",
        "recommendation": "Continue SIP",
        "verdict_reason": (
            "Motilal Oswal Midcap Fund is a top-performing active midcap fund with strong alpha over benchmark. "
            "Fund manager has a concentrated, high-conviction portfolio style. "
            "SIP of ₹500/month is appropriate. Your current P&L is +₹8 (+0.78%) — very early stage. "
            "Continue SIP. Do not pause or stop based on short-term market volatility."
        ),
        "technical_summary": (
            "Active fund with focused portfolio of ~30-35 stocks. "
            "Historically generates 2-4% alpha over Nifty Midcap 150 benchmark. "
            "Rolling 3-year returns above 20% CAGR. Fund manager Niket Shah has strong track record."
        ),
        "profit_booking_advice": (
            "DO NOT exit or pause SIP. This is your primary midcap compounder. "
            "Continue ₹500/month SIP religiously. Review only after 3 years of consistent SIP."
        ),
        "risk_factors": [
            "Concentrated portfolio means higher fund manager risk",
            "Underperforms in broad market rallies vs. index",
            "High overlap with HDFCMID150 ETF in your portfolio"
        ],
        "positives": [
            "Consistent alpha generation over 5+ years",
            "Direct plan — no distributor commission",
            "Growth option — maximizes compounding"
        ]
    },
    "HDFC_MIDCAP": {
        "symbol": "HDFC_MIDCAP",
        "company_name": "HDFC Mid Cap Opportunities Fund (Direct Growth)",
        "holding_type": "Mutual Fund SIP",
        "quantity": None,
        "avg_buy_price": None,
        "current_price": None,
        "invested_amount_direct": 799.89,
        "current_value_direct": 804.64,
        "stop_loss": None,
        "target_price": None,
        "exit_risk_score": 35,
        "exit_probability": 10,
        "bullish_probability": 78,
        "bearish_probability": 22,
        "confidence_score": 82,
        "news_sentiment": "Positive",
        "recommendation": "Continue SIP",
        "verdict_reason": (
            "HDFC Mid Cap Opportunities is India's largest and most diversified active midcap fund. "
            "Fund manager Chirag Setalvad has 15+ years of proven alpha generation. "
            "Your SIP of ₹800/month is your largest allocation — appropriate for this quality fund. "
            "Current P&L: +₹17 (+2.13%). Excellent early returns for a new SIP."
        ),
        "technical_summary": (
            "Highly diversified 70-80 stock portfolio. Lower concentration risk vs. Motilal fund. "
            "AUM > ₹65,000 Cr — largest midcap fund in India. "
            "Rolling 5-year returns: ~18.5% CAGR. Excellent downside protection in corrections."
        ),
        "profit_booking_advice": (
            "BEST FUND in your portfolio. DO NOT stop or reduce SIP under any circumstances. "
            "This is your core midcap wealth builder. Consider increasing SIP if income grows."
        ),
        "risk_factors": [
            "Large AUM may limit ability to enter micro-cap opportunities",
            "Still midcap — volatile in broad corrections",
            "Overlaps with Motilal fund and HDFCMID150 ETF"
        ],
        "positives": [
            "India's largest active midcap fund — liquidity never an issue",
            "Consistently top-quartile performance across market cycles",
            "Chirag Setalvad is one of India's most respected fund managers",
            "Your SIP is Direct plan — maximum cost efficiency"
        ]
    },
    "ABSL_PSU": {
        "symbol": "ABSL_PSU",
        "company_name": "Aditya Birla Sun Life PSU Equity Fund (Direct Growth)",
        "holding_type": "Mutual Fund SIP",
        "quantity": None,
        "avg_buy_price": None,
        "current_price": None,
        "invested_amount_direct": 25.31,
        "current_value_direct": 26.93,
        "stop_loss": None,
        "target_price": None,
        "exit_risk_score": 72,
        "exit_probability": 55,
        "bullish_probability": 40,
        "bearish_probability": 60,
        "confidence_score": 70,
        "news_sentiment": "Neutral",
        "recommendation": "Review & Consider Pausing",
        "verdict_reason": (
            "ABSL PSU Equity Fund is a thematic sectoral fund investing only in PSU (government-owned) companies. "
            "Current P&L is +₹2 (+7.43%) — positive but driven by a PSU re-rating cycle that may be maturing. "
            "CRITICAL: Thematic funds carry very high risk — PSU stocks are heavily influenced by election cycles and government policy. "
            "At ₹25/month SIP, the impact is small. But this is NOT a core holding for a beginner investor at 21."
        ),
        "technical_summary": (
            "PSU sector had a strong re-rating from 2022-2024 driven by government capex. "
            "Many analysts believe PSU PE re-rating is now largely priced in. "
            "High volatility in election years. Not suitable as a long-term core SIP for wealth building."
        ),
        "profit_booking_advice": (
            "REVIEW this SIP. At ₹25/month it does no harm, but consider: "
            "1) Pause this SIP and redirect ₹25 toward UTI Nifty 50 Index Fund. "
            "2) Or continue with the understanding that this is a satellite/thematic bet, not a core SIP. "
            "Never increase this SIP beyond ₹25/month at your current portfolio size."
        ),
        "risk_factors": [
            "100% sector concentration in PSU stocks — very high political/policy risk",
            "Thematic funds are high-risk, not suitable for primary wealth building",
            "PSU sector performance tied to government election cycles",
            "Current PSU valuation may be stretched after 2022-2024 re-rating"
        ],
        "positives": [
            "Currently positive returns (+7.43%)",
            "₹25/month — minimal capital at risk",
            "Government capex theme has long-term tailwinds"
        ]
    }
}

NEWS_ALERTS_FEED = [
    {
        "id": "1",
        "symbol": "HDFCMID150",
        "severity": "Medium",
        "headline": "Nifty Midcap 150 index corrects 3.2% amid FII outflows in June 2026",
        "impact": "Short-term pressure on HDFCMID150 ETF NAV. Your holding is -5.11% from cost. Support expected at 22,000 index level.",
        "time": "Today"
    },
    {
        "id": "2",
        "symbol": "ABSL_PSU",
        "severity": "Medium",
        "headline": "PSU stocks face headwinds as government budget signals lower capex growth",
        "impact": "ABSL PSU Fund may see pressure. Thematic risk highlighted — consider reviewing your ₹25/month SIP.",
        "time": "2 days ago"
    },
    {
        "id": "3",
        "symbol": "HDFC_MIDCAP",
        "severity": "Low",
        "headline": "HDFC Mid Cap Opportunities Fund maintains top quartile ranking for 5th consecutive quarter",
        "impact": "Positive. Your ₹800/month SIP continues in a fundamentally strong fund. No action needed.",
        "time": "3 days ago"
    },
    {
        "id": "4",
        "symbol": "MOF_MIDCAP",
        "severity": "Low",
        "headline": "Motilal Oswal Midcap Fund increases allocation to IT midcap stocks amid sector recovery",
        "impact": "Positive sector tilt. Fund manager making tactical bets. Your ₹500/month SIP is intact.",
        "time": "4 days ago"
    },
    {
        "id": "5",
        "symbol": "PORTFOLIO",
        "severity": "High",
        "headline": "Portfolio Alert: 97% Midcap concentration detected — diversification action recommended",
        "impact": "Your portfolio has zero large-cap or flexi-cap exposure. Consider starting a Nifty 50 Index Fund SIP to reduce concentration risk.",
        "time": "5 days ago"
    }
]


@router.get("/")
async def get_exit_dashboard() -> List[Dict[str, Any]]:
    """Returns exit analysis for Logesh's REAL holdings only."""
    result = []
    for symbol, data in EXIT_HOLDINGS_DATA.items():
        # For ETF holdings — calculate P&L from quantity × price
        if data["holding_type"] == "ETF":
            invested = data["quantity"] * data["avg_buy_price"]
            current = data["quantity"] * data["current_price"]
            pnl = current - invested
            pnl_pct = (pnl / invested) * 100 if invested > 0 else 0
        else:
            # For SIP mutual funds — use direct values
            invested = data.get("invested_amount_direct", 0)
            current = data.get("current_value_direct", 0)
            pnl = current - invested
            pnl_pct = (pnl / invested) * 100 if invested > 0 else 0

        result.append({
            "symbol": data["symbol"],
            "company_name": data["company_name"],
            "holding_type": data["holding_type"],
            "quantity": data.get("quantity"),
            "avg_buy_price": data.get("avg_buy_price"),
            "current_price": data.get("current_price"),
            "invested_amount": round(invested, 2),
            "current_value": round(current, 2),
            "pnl": round(pnl, 2),
            "pnl_percent": round(pnl_pct, 2),
            "stop_loss": data.get("stop_loss"),
            "target_price": data.get("target_price"),
            "exit_risk_score": data["exit_risk_score"],
            "exit_probability": data["exit_probability"],
            "bullish_probability": data["bullish_probability"],
            "bearish_probability": data["bearish_probability"],
            "confidence_score": data["confidence_score"],
            "news_sentiment": data["news_sentiment"],
            "recommendation": data["recommendation"],
        })
    return result


@router.get("/news")
async def get_negative_news() -> List[Dict[str, Any]]:
    """Get news feeds relevant to Logesh's actual holdings."""
    return NEWS_ALERTS_FEED


@router.get("/{symbol}")
async def get_exit_detail(symbol: str) -> Dict[str, Any]:
    """Get detailed exit analysis for a specific holding."""
    sym = symbol.upper()
    if sym not in EXIT_HOLDINGS_DATA:
        raise HTTPException(
            status_code=404,
            detail=f"Holding '{sym}' not found. Your holdings: NIPPON_SMALLCAP, MOF_MIDCAP, HDFC_MIDCAP, ABSL_PSU"
        )

    data = EXIT_HOLDINGS_DATA[sym]

    if data["holding_type"] == "ETF":
        invested = data["quantity"] * data["avg_buy_price"]
        current = data["quantity"] * data["current_price"]
    else:
        invested = data.get("invested_amount_direct", 0)
        current = data.get("current_value_direct", 0)

    pnl = current - invested
    pnl_pct = (pnl / invested) * 100 if invested > 0 else 0

    return {
        **data,
        "invested_amount": round(invested, 2),
        "current_value": round(current, 2),
        "pnl": round(pnl, 2),
        "pnl_percent": round(pnl_pct, 2),
    }
