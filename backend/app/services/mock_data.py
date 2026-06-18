"""
REAL PORTFOLIO DATA — Logesh's Actual Angel One Portfolio
Source: Fund_holdings_2026-06-09.xlsx (Angel One export)
Date: June 9, 2026
Age: 21 | Goal: Financial Freedom | Horizon: 10-20 years

REAL SUMMARY:
- Total Invested:  ₹2,125.06
- Current Value:   ₹2,107.24
- Unrealised P&L:  -₹17.81 (-0.84%)
- Overall XIRR:    -19.87% (all investments < 2 months old — normal)

KEY INSIGHT: Negative XIRR is EXPECTED at 2 months. All four funds are
fundamentally strong for 10+ year horizon. Time in market beats timing.
"""

from datetime import datetime, timedelta
from typing import List, Dict, Any
import random

# ─────────────────────────────────────────────────────────────────
# INVESTOR PROFILE
# ─────────────────────────────────────────────────────────────────
INVESTOR_PROFILE = {
    "name": "Logesh",
    "age": 21,
    "country": "India",
    "broker": "Angel One",
    "investor_type": "Long-term SIP",
    "goal": "Financial Freedom",
    "investment_horizon_years": "10-20",
    "risk_tolerance": "Moderate",
    "started_investing": "April 2026",
    "months_investing": 2,
    "profile_summary": (
        "21-year-old investor, just 2 months into investing. "
        "Small portfolio of ₹2,125 is perfectly normal for a beginner. "
        "4 funds across Mid Cap and Small Cap. No large-cap or index fund yet. "
        "Short-term XIRR of -19.87% is misleading — all investments are too recent "
        "for XIRR to be meaningful. Long-term outlook (10-20 years) is what matters."
    )
}

# ─────────────────────────────────────────────────────────────────
# REAL MUTUAL FUND HOLDINGS (from Angel One export, June 9, 2026)
# ─────────────────────────────────────────────────────────────────
REAL_MUTUAL_FUNDS = [
    {
        "scheme_code":    "MOF_MIDCAP",
        "scheme_name":    "Motilal Oswal Midcap Fund",
        "isin":           "INF247L01445",
        "fund_house":     "Motilal Oswal Mutual Fund",
        "category":       "Equity",
        "sub_category":   "Mid Cap Fund",
        "plan":           "Direct",
        "option":         "Growth",
        "folio":          "910161785244",
        # Real numbers from file
        "units":          9.481,
        "avg_nav":        105.461,
        "current_nav":    103.317,
        "invested_amount":999.88,
        "current_value":  979.55,
        "pnl":            -20.33,
        "pnl_percent":    -2.03,
        "xirr":           -2.03,
        # Fund info
        "risk_level":     "High",
        "aum_cr":         22850.0,
        "expense_ratio":  0.61,
        "cagr_1y":        26.4,
        "cagr_3y":        32.8,
        "cagr_5y":        29.4,
        "fund_manager":   "Niket Shah",
        "is_sip_active":  True,
        "sip_amount":     500.0,
        "sip_date":       5,
        "benchmark":      "NIFTY Midcap 150 TRI",
        "drawdown_max":   -29.4,
        "sharpe_ratio":   1.48,
        "alpha":          8.2,
        "beta":           0.92,
        "verdict":        "Continue SIP — Strong Long-term Fund",
        "verdict_reason": (
            "Motilal Oswal Midcap Fund is down -2.03% in 2 months — completely normal. "
            "This fund's 3-year CAGR is 32.8% and 5-year CAGR is 29.4%. "
            "Fund manager Niket Shah runs a high-conviction concentrated portfolio of ~25-30 stocks. "
            "Short-term NAV movements mean nothing. Continue your ₹500/month SIP without hesitation."
        ),
        "ai_recommendation": "CONTINUE_SIP",
        "long_term_outlook": "Very Good — top quartile mid-cap fund consistently",
        "top_holdings": [
            {"name": "Kalyan Jewellers",  "weight": 8.4},
            {"name": "Persistent Systems","weight": 7.2},
            {"name": "Coforge",           "weight": 6.8},
            {"name": "Zomato",            "weight": 5.9},
            {"name": "Trent",             "weight": 5.4},
        ],
        "sector_allocation": [
            {"sector": "Consumer Discretionary", "weight": 24.8},
            {"sector": "IT & Technology",        "weight": 22.4},
            {"sector": "Financial Services",     "weight": 18.6},
            {"sector": "Healthcare",             "weight": 12.2},
            {"sector": "Industrials",            "weight": 10.4},
        ],
    },
    {
        "scheme_code":    "HDFC_MIDCAP",
        "scheme_name":    "HDFC Mid Cap Opportunities Fund",
        "isin":           "INF179K01XQ0",
        "fund_house":     "HDFC Mutual Fund",
        "category":       "Equity",
        "sub_category":   "Mid Cap Fund",
        "plan":           "Direct",
        "option":         "Growth",
        "folio":          "42487815/84",
        # Real numbers
        "units":          3.691,
        "avg_nav":        216.713,
        "current_nav":    218.0,
        "invested_amount":799.89,
        "current_value":  804.64,
        "pnl":            4.75,
        "pnl_percent":    0.59,
        "xirr":           0.59,
        # Fund info
        "risk_level":     "High",
        "aum_cr":         68492.0,
        "expense_ratio":  0.75,
        "cagr_1y":        18.6,
        "cagr_3y":        22.4,
        "cagr_5y":        24.8,
        "fund_manager":   "Chirag Setalvad",
        "is_sip_active":  True,
        "sip_amount":     800.0,
        "sip_date":       10,
        "benchmark":      "NIFTY Midcap 100 TRI",
        "drawdown_max":   -26.8,
        "sharpe_ratio":   1.28,
        "alpha":          4.8,
        "beta":           0.88,
        "verdict":        "Best Fund in Portfolio — Continue SIP",
        "verdict_reason": (
            "HDFC Mid Cap Opportunities is India's largest mid-cap fund (₹68,000+ Cr AUM). "
            "Currently +0.59% in just 2 months — the only fund in profit. "
            "Chirag Setalvad has 15+ years of consistent alpha generation. "
            "This is your CORE holding. Never stop this SIP. "
            "5-year CAGR of 24.8% makes this one of the best funds in India."
        ),
        "ai_recommendation": "CONTINUE_SIP",
        "long_term_outlook": "Excellent — consistently top-quartile over all time periods",
        "top_holdings": [
            {"name": "Max Healthcare",       "weight": 5.8},
            {"name": "Cholamandalam Inv.",   "weight": 5.4},
            {"name": "Tube Investments",     "weight": 4.8},
            {"name": "Navin Fluorine",       "weight": 4.2},
            {"name": "Indian Hotels",        "weight": 3.8},
        ],
        "sector_allocation": [
            {"sector": "Financial Services",     "weight": 28.4},
            {"sector": "Healthcare",             "weight": 18.6},
            {"sector": "Consumer Discretionary", "weight": 14.2},
            {"sector": "Industrials",            "weight": 12.8},
            {"sector": "Chemicals",              "weight": 8.4},
        ],
    },
    {
        "scheme_code":    "NIPPON_SMALLCAP",
        "scheme_name":    "Nippon India Small Cap Fund",
        "isin":           "INF204K01K15",
        "fund_house":     "Nippon India Mutual Fund",
        "category":       "Equity",
        "sub_category":   "Small Cap Fund",
        "plan":           "Direct",
        "option":         "Growth",
        "folio":          "488495137392",
        # Real numbers
        "units":          1.538,
        "avg_nav":        195.045,
        "current_nav":    192.539,
        "invested_amount":299.98,
        "current_value":  296.13,
        "pnl":            -3.85,
        "pnl_percent":    -1.28,
        "xirr":           -1.28,
        # Fund info
        "risk_level":     "Very High",
        "aum_cr":         54600.0,
        "expense_ratio":  0.68,
        "cagr_1y":        22.4,
        "cagr_3y":        28.6,
        "cagr_5y":        35.2,
        "fund_manager":   "Samir Rachh",
        "is_sip_active":  True,
        "sip_amount":     300.0,
        "sip_date":       15,
        "benchmark":      "NIFTY Smallcap 250 TRI",
        "drawdown_max":   -42.6,
        "sharpe_ratio":   1.38,
        "alpha":          9.4,
        "beta":           1.08,
        "verdict":        "Hold — Excellent Long-term Fund, Be Patient",
        "verdict_reason": (
            "Nippon India Small Cap Fund is India's largest small cap fund (₹54,600 Cr AUM). "
            "Currently -1.28% in 2 months — expected for small cap. "
            "5-year CAGR of 35.2% is outstanding. Small caps are more volatile short-term "
            "but deliver the highest returns over 7-10 years. "
            "This is a great addition to your portfolio for long-term wealth creation. "
            "Do NOT check NAV daily — set it and forget it for 7+ years."
        ),
        "ai_recommendation": "CONTINUE_SIP",
        "long_term_outlook": "Outstanding — best 5-year CAGR in your portfolio at 35.2%",
        "top_holdings": [
            {"name": "KPIT Technologies",    "weight": 4.8},
            {"name": "Tube Investments",     "weight": 4.2},
            {"name": "Affle India",          "weight": 3.8},
            {"name": "Sapphire Foods",       "weight": 3.4},
            {"name": "Waaree Energies",      "weight": 3.1},
        ],
        "sector_allocation": [
            {"sector": "Industrials",        "weight": 28.4},
            {"sector": "Consumer Goods",     "weight": 18.6},
            {"sector": "IT & Technology",    "weight": 16.2},
            {"sector": "Healthcare",         "weight": 12.8},
            {"sector": "Chemicals",          "weight": 9.4},
        ],
    },
    {
        "scheme_code":    "ABSL_PSU",
        "scheme_name":    "Aditya Birla Sun Life PSU Equity Fund",
        "isin":           "INF209KB1O82",
        "fund_house":     "Aditya Birla Sun Life AMC",
        "category":       "Equity",
        "sub_category":   "Sectoral / Thematic",
        "plan":           "Direct",
        "option":         "Growth",
        "folio":          "1048074545",
        # Real numbers
        "units":          0.685,
        "avg_nav":        36.95,
        "current_nav":    39.31,
        "invested_amount":25.31,
        "current_value":  26.93,
        "pnl":            1.62,
        "pnl_percent":    6.39,
        "xirr":           -29.12,   # absolute return shown (< 1yr per Angel One)
        # Fund info
        "risk_level":     "Very High",
        "aum_cr":         4823.0,
        "expense_ratio":  0.48,
        "cagr_1y":        12.4,
        "cagr_3y":        None,
        "cagr_5y":        None,
        "fund_manager":   "Dhaval Joshi",
        "is_sip_active":  True,
        "sip_amount":     25.0,
        "sip_date":       15,
        "benchmark":      "NIFTY India PSU Index TRI",
        "drawdown_max":   -38.4,
        "sharpe_ratio":   0.94,
        "alpha":          -2.4,
        "beta":           1.22,
        "verdict":        "Review — Thematic Risk, Tiny Position",
        "verdict_reason": (
            "ABSL PSU Equity Fund shows +6.39% absolute return in just 2 months — impressive. "
            "However the XIRR shows -29.12% (Angel One displays absolute return for < 1yr investments). "
            "PSU funds are thematic and tied to government policy cycles. "
            "At ₹25.31 invested, this is 1.2% of your portfolio — negligible impact. "
            "No urgency to sell. But do NOT increase this SIP significantly. "
            "When you have more capital, redirect new SIPs to Index funds instead."
        ),
        "ai_recommendation": "HOLD_SMALL_POSITION",
        "long_term_outlook": "Uncertain — PSU theme is cyclical, not suitable as core holding",
        "top_holdings": [
            {"name": "NTPC",            "weight": 10.8},
            {"name": "Coal India",      "weight": 9.4},
            {"name": "Power Grid Corp", "weight": 8.2},
            {"name": "BEL",             "weight": 7.6},
            {"name": "ONGC",            "weight": 7.2},
        ],
        "sector_allocation": [
            {"sector": "Energy & Utilities",    "weight": 42.4},
            {"sector": "Defence & Industrials", "weight": 24.6},
            {"sector": "Banking (PSU)",         "weight": 18.8},
            {"sector": "Oil & Gas",             "weight": 14.2},
        ],
    },
]

# No ETF holdings in real portfolio
REAL_HOLDINGS = []

# ─────────────────────────────────────────────────────────────────
# REAL SIP PLANS
# ─────────────────────────────────────────────────────────────────
REAL_SIP_PLANS = [
    {
        "id": 1, "scheme_code": "MOF_MIDCAP",
        "scheme_name": "Motilal Oswal Midcap Fund",
        "fund_house": "Motilal Oswal Mutual Fund",
        "monthly_amount": 500.0, "sip_date": 5,
        "start_date": "2026-04-05",
        "total_invested": 999.88,
        "installments_paid": 2, "is_active": True, "category": "Mid Cap",
    },
    {
        "id": 2, "scheme_code": "HDFC_MIDCAP",
        "scheme_name": "HDFC Mid Cap Opportunities Fund",
        "fund_house": "HDFC Mutual Fund",
        "monthly_amount": 800.0, "sip_date": 10,
        "start_date": "2026-04-10",
        "total_invested": 799.89,
        "installments_paid": 1, "is_active": True, "category": "Mid Cap",
    },
    {
        "id": 3, "scheme_code": "NIPPON_SMALLCAP",
        "scheme_name": "Nippon India Small Cap Fund",
        "fund_house": "Nippon India Mutual Fund",
        "monthly_amount": 300.0, "sip_date": 15,
        "start_date": "2026-04-15",
        "total_invested": 299.98,
        "installments_paid": 1, "is_active": True, "category": "Small Cap",
    },
    {
        "id": 4, "scheme_code": "ABSL_PSU",
        "scheme_name": "Aditya Birla Sun Life PSU Equity Fund",
        "fund_house": "Aditya Birla Sun Life AMC",
        "monthly_amount": 25.0, "sip_date": 15,
        "start_date": "2026-04-15",
        "total_invested": 25.31,
        "installments_paid": 1, "is_active": True, "category": "Sectoral / Thematic",
    },
]

# ─────────────────────────────────────────────────────────────────
# PORTFOLIO CONTEXT FOR AI
# ─────────────────────────────────────────────────────────────────
PORTFOLIO_CONTEXT_FOR_AI = {
    "total_invested":  2125.06,
    "current_value":   2107.24,
    "pnl":             -17.81,
    "pnl_percent":     -0.84,
    "xirr":            -19.87,
    "months_investing": 2,
    "monthly_sip":     1625.0,
    "holdings": [
        {"name": "Motilal Oswal Midcap", "invested": 999.88, "current": 979.55, "pnl_pct": -2.03},
        {"name": "HDFC Mid Cap Opp.",    "invested": 799.89, "current": 804.64, "pnl_pct": +0.59},
        {"name": "Nippon Small Cap",     "invested": 299.98, "current": 296.13, "pnl_pct": -1.28},
        {"name": "ABSL PSU Equity",      "invested":  25.31, "current":  26.93, "pnl_pct": +6.39},
    ],
}

# ─────────────────────────────────────────────────────────────────
# PORTFOLIO OVERVIEW
# ─────────────────────────────────────────────────────────────────
def get_real_portfolio_overview() -> Dict[str, Any]:
    return {
        "total_invested":        2125.06,
        "total_value":           2107.24,
        "total_pnl":             -17.81,
        "total_pnl_percent":     -0.84,
        "xirr":                  -19.87,
        "today_change":          -3.20,
        "today_change_percent":  -0.15,
        "mf_value":              2107.24,
        "stocks_value":          0.0,
        "sip_monthly_amount":    1625.0,
        "active_sips":           4,
        "last_updated":          "2026-06-09",
        "xirr_note":             "XIRR appears negative because all investments are < 2 months old. This is normal and expected.",
    }

# ─────────────────────────────────────────────────────────────────
# PORTFOLIO ANALYSIS (scores)
# ─────────────────────────────────────────────────────────────────
def get_real_portfolio_analysis() -> Dict[str, Any]:
    return {
        "portfolio_score":       48,
        "risk_score":            78,
        "diversification_score": 32,
        "wealth_score":          62,
        "asset_allocation": {
            "mutual_funds_percent": 100,
            "stocks_percent":        0,
            "etf_percent":           0,
            "debt_percent":          0,
        },
        "category_allocation": {
            "mid_cap_percent":   84.8,   # MOF + HDFC
            "small_cap_percent": 14.1,   # Nippon
            "thematic_percent":   1.2,   # ABSL PSU
            "large_cap_percent":  0.0,
            "index_percent":      0.0,
        },
        "strengths": [
            "All Direct plans — no distributor commission ✅",
            "SIP discipline started at 21 — time is your biggest asset ✅",
            "HDFC Mid Cap is India's best-run mid cap fund ✅",
            "Nippon Small Cap adds high-growth potential ✅",
        ],
        "weaknesses": [
            "84.8% in midcap — need large-cap anchor 🔴",
            "Zero index fund / Nifty 50 exposure 🔴",
            "No debt, gold, or international diversification ⚠️",
            "PSU thematic fund adds concentration risk ⚠️",
        ],
    }

# ─────────────────────────────────────────────────────────────────
# PORTFOLIO SNAPSHOTS (simulated 90-day history)
# ─────────────────────────────────────────────────────────────────
def get_real_portfolio_snapshots(days: int = 90) -> List[Dict[str, Any]]:
    snapshots = []
    base = 2125.06
    current = 2107.24
    # Linear with noise from base to current
    for i in range(days):
        frac  = i / max(days - 1, 1)
        trend = base + (current - base) * frac
        noise = random.uniform(-15, 15)
        val   = max(1800, trend + noise)
        date  = (datetime.now() - timedelta(days=days - i)).strftime("%Y-%m-%d")
        snapshots.append({"date": date, "total_value": round(val, 2), "invested": round(base + (frac * 100), 2)})
    return snapshots

# ─────────────────────────────────────────────────────────────────
# WEALTH PROJECTIONS
# ─────────────────────────────────────────────────────────────────
def get_real_wealth_projections(
    monthly_sip: float = 1625.0,
    current_value: float = 2107.24,
    annual_return: float = 12.0,
    years: int = 20,
) -> Dict[str, Any]:
    def fv(sip, rate, n_months, lump):
        r = rate / 100 / 12
        if r == 0:
            return sip * n_months + lump
        return lump * ((1 + r) ** n_months) + sip * (((1 + r) ** n_months - 1) / r) * (1 + r)

    scenarios = {
        "conservative": 8.0,
        "base_case":    annual_return,
        "optimistic":   15.0,
    }
    result = {}
    for label, rate in scenarios.items():
        result[label] = {}
        for y in range(1, years + 1):
            val       = fv(monthly_sip, rate, y * 12, current_value)
            invested  = current_value + monthly_sip * 12 * y
            result[label][str(y)] = {
                "years":           y,
                "estimated_value": round(val),
                "total_invested":  round(invested),
                "profit":          round(val - invested),
                "returns_multiple": round(val / max(invested, 1), 2),
            }

    # ₹1 Crore target years
    crore = 10_000_000
    crore_target = {}
    for label, rate in scenarios.items():
        for y in range(1, 50):
            if fv(monthly_sip, rate, y * 12, current_value) >= crore:
                crore_target[f"years_{label.split('_')[0] if '_' in label else label}"] = y
                break

    return {**result, "crore_target": crore_target}
REAL_MARKET_DATA = {
    "indices": [
        {
            "name": "NIFTY 50",
            "price": 0,
            "change": 0,
            "changePercent": 0
        },
        {
            "name": "SENSEX",
            "price": 0,
            "change": 0,
            "changePercent": 0
        }
    ],
    "marketStatus": "Mock data",
    "lastUpdated": "Backend fallback data"
}
# ── Fallback market data ───────────────────────────────────────

REAL_MARKET_DATA = {
    "indices": [
        {
            "name": "NIFTY 50",
            "price": 0,
            "change": 0,
            "changePercent": 0
        },
        {
            "name": "SENSEX",
            "price": 0,
            "change": 0,
            "changePercent": 0
        }
    ],
    "marketStatus": "Mock data",
    "lastUpdated": "Backend fallback data"
}


# ── Fallback recommendations ───────────────────────────────────

def get_real_recommendations():
    return [
        {
            "symbol": "NIFTYBEES",
            "name": "Nippon India ETF Nifty BeES",
            "type": "ETF",
            "action": "WATCH",
            "risk": "Low",
            "reason": "Broad Nifty 50 exposure. Useful for long-term investing and safer than buying one random stock.",
            "targetAllocation": "Core portfolio"
        },
        {
            "symbol": "JUNIORBEES",
            "name": "Nippon India ETF Junior BeES",
            "type": "ETF",
            "action": "WATCH",
            "risk": "Medium",
            "reason": "Exposure to Nifty Next 50 companies. Higher risk than Nifty 50 but good for growth.",
            "targetAllocation": "Growth portfolio"
        },
        {
            "symbol": "LIQUIDBEES",
            "name": "Nippon India ETF Liquid BeES",
            "type": "ETF",
            "action": "HOLD",
            "risk": "Low",
            "reason": "Can be used as a parking option for unused cash. Not for high returns.",
            "targetAllocation": "Cash parking"
        }
    ]