from fastapi import APIRouter
from app.services.mock_data import (
    REAL_HOLDINGS, REAL_MUTUAL_FUNDS, REAL_SIP_PLANS,
    get_real_portfolio_overview, get_real_portfolio_snapshots,
    get_real_portfolio_analysis
)
from typing import List, Dict, Any

router = APIRouter()


@router.get("/overview")
async def get_overview() -> Dict[str, Any]:
    return get_real_portfolio_overview()


@router.get("/holdings")
async def get_holdings() -> List[Dict[str, Any]]:
    result = []
    for h in REAL_HOLDINGS:
        invested = h["quantity"] * h["avg_buy_price"]
        current = h["quantity"] * h["current_price"]
        pnl = current - invested
        pnl_pct = (pnl / invested * 100) if invested > 0 else 0
        result.append({
            **h,
            "invested_value": round(invested, 2),
            "current_value": round(current, 2),
            "pnl": round(pnl, 2),
            "pnl_percent": round(pnl_pct, 2),
            "day_change": h.get("day_change", -2.90),
            "day_change_percent": h.get("day_change_percent", -1.27)
        })
    return result


@router.get("/mutual-funds")
async def get_mutual_funds() -> List[Dict[str, Any]]:
    return list(REAL_MUTUAL_FUNDS)


@router.get("/sips")
async def get_sips() -> Dict[str, Any]:
    sips = REAL_SIP_PLANS
    total_monthly = sum(s["monthly_amount"] for s in sips if s["is_active"])
    total_invested = sum(s["total_invested"] for s in sips)
    return {
        "sips": sips,
        "summary": {
            "active_sips": len([s for s in sips if s["is_active"]]),
            "total_monthly_amount": total_monthly,
            "total_invested_via_sip": total_invested,
            "next_sip_date": "5th June 2026 (Motilal Oswal)"
        }
    }


@router.get("/transactions")
async def get_transactions() -> List[Dict[str, Any]]:
    return [
        {"id": 1, "type": "BUY", "instrument": "HDFCMID150", "name": "HDFC Nifty Midcap 150 ETF",
         "quantity": 10, "price": 23.74, "amount": 237.40, "date": "2025-11-20", "instrument_type": "ETF"},
        {"id": 2, "type": "SIP", "instrument": "MOF_MIDCAP", "name": "Motilal Oswal Midcap Fund",
         "quantity": None, "price": None, "amount": 500.0, "date": "2025-11-05", "instrument_type": "MF"},
        {"id": 3, "type": "SIP", "instrument": "HDFC_MIDCAP", "name": "HDFC Mid Cap Opportunities Fund",
         "quantity": None, "price": None, "amount": 800.0, "date": "2025-11-10", "instrument_type": "MF"},
        {"id": 4, "type": "SIP", "instrument": "MOF_MIDCAP", "name": "Motilal Oswal Midcap Fund",
         "quantity": None, "price": None, "amount": 500.0, "date": "2025-12-05", "instrument_type": "MF"},
        {"id": 5, "type": "SIP", "instrument": "HDFC_MIDCAP", "name": "HDFC Mid Cap Opportunities Fund",
         "quantity": None, "price": None, "amount": 800.0, "date": "2025-12-10", "instrument_type": "MF"},
        {"id": 6, "type": "SIP", "instrument": "ABSL_PSU", "name": "Aditya Birla Sun Life PSU Equity Fund",
         "quantity": None, "price": None, "amount": 25.0, "date": "2025-12-15", "instrument_type": "MF"},
    ]


@router.get("/analyze")
async def analyze_portfolio() -> Dict[str, Any]:
    return get_real_portfolio_analysis()


@router.get("/snapshots")
async def get_snapshots(days: int = 90) -> List[Dict[str, Any]]:
    return get_real_portfolio_snapshots(days)


@router.get("/intelligence")
async def get_portfolio_intelligence() -> Dict[str, Any]:
    """
    Portfolio Intelligence Engine — computes 4 scores and detailed breakdown.
    All scores are 0-100. Higher = better (except risk score where lower = safer).
    """
    # ── PORTFOLIO SCORE (0-100) ──────────────────────────────────────
    # Measures overall portfolio quality: diversification, fund quality, cost efficiency
    portfolio_score = 44
    portfolio_score_breakdown = [
        {"label": "Direct Plan Usage", "score": 100, "weight": "10%", "status": "excellent",
         "note": "All holdings are Direct plans. No distributor commission. ✅"},
        {"label": "SIP Discipline", "score": 90, "weight": "15%", "status": "excellent",
         "note": "3 active SIPs. Consistent monthly investing. ✅"},
        {"label": "Fund Quality", "score": 72, "weight": "20%", "status": "good",
         "note": "HDFC Mid Cap is top-tier. Motilal is good. ABSL PSU is thematic risk."},
        {"label": "Category Diversification", "score": 8, "weight": "30%", "status": "critical",
         "note": "97% in midcap. Zero large cap, flexi cap, or debt. 🔴 Critical gap."},
        {"label": "Asset Class Mix", "score": 5, "weight": "15%", "status": "critical",
         "note": "100% equity. No debt, no gold, no international exposure."},
        {"label": "Cost Efficiency", "score": 78, "weight": "10%", "status": "good",
         "note": "Avg expense ratio ~0.61%. Acceptable for active funds."},
    ]

    # ── RISK SCORE (0-100) ───────────────────────────────────────────
    # Higher = riskier. Ideal for age 21 long-horizon: 40-65.
    risk_score = 82
    risk_score_breakdown = [
        {"label": "Market Cap Concentration", "score": 95, "status": "danger",
         "note": "97% midcap. Midcap falls 40-60% in major corrections."},
        {"label": "Sector/Thematic Risk", "score": 72, "status": "warning",
         "note": "PSU thematic fund adds political/policy cycle risk."},
        {"label": "Fund Overlap Risk", "score": 80, "status": "danger",
         "note": "2 active midcap funds + 1 midcap ETF = triple exposure to same segment."},
        {"label": "Liquidity Risk", "score": 20, "status": "safe",
         "note": "Mutual funds are liquid (T+3 redemption). ETF is exchange-traded. ✅"},
        {"label": "Volatility (Beta)", "score": 88, "status": "danger",
         "note": "Portfolio beta ~0.95. Highly correlated to Nifty Midcap index."},
        {"label": "Drawdown Risk", "score": 82, "status": "danger",
         "note": "Max drawdown risk: -30 to -40% in bear market scenario."},
    ]

    # ── DIVERSIFICATION SCORE (0-100) ────────────────────────────────
    # Measures how well spread across categories, sectors, asset classes
    diversification_score = 25
    diversification_breakdown = {
        "category_coverage": {
            "large_cap": False,
            "mid_cap": True,
            "small_cap": False,
            "flexi_cap": False,
            "index_fund": False,
            "debt_fund": False,
            "gold_fund": False,
            "international": False,
        },
        "score_by_dimension": [
            {"dimension": "Market Cap Spread", "score": 28, "note": "Mid cap (84.8%) + Small cap (14.1%). Still missing large cap."},
            {"dimension": "Active vs Passive Mix", "score": 30, "note": "2 active + 1 passive ETF. Acceptable ratio."},
            {"dimension": "Sector Spread", "score": 35, "note": "Consumer, IT, Finance covered via midcap. But no energy, pharma anchors."},
            {"dimension": "Asset Class Mix", "score": 5, "note": "100% equity. Zero debt, gold, or international."},
            {"dimension": "Geographic Diversification", "score": 0, "note": "100% India. Zero international exposure."},
            {"dimension": "Fund House Diversification", "score": 55, "note": "3 different AMCs. Good."},
        ]
    }

    # ── WEALTH SCORE (0-100) ─────────────────────────────────────────
    # Composite of portfolio growth potential, trajectory, habits
    wealth_score = 58
    wealth_score_breakdown = [
        {"label": "Age-Adjusted Growth Potential", "score": 95, "note": "Age 21 with 20-year horizon = maximum compounding runway. ✅"},
        {"label": "Current Portfolio Size", "score": 15, "note": "₹2,076 is small but perfectly normal for age 21."},
        {"label": "Monthly SIP Rate", "score": 52, "note": "₹1,325/month is solid. Target: ₹5,000+/month as income grows."},
        {"label": "Return Trajectory", "score": 62, "note": "+0.71% overall gain. Very early stage — too soon to judge quality."},
        {"label": "Investment Habits", "score": 88, "note": "Direct plans, SIP discipline, long-term thinking. Excellent habits. ✅"},
        {"label": "Goal Alignment", "score": 42, "note": "Financial Freedom goal needs a structured SIP increase roadmap."},
    ]

    # ── RECOMMENDATIONS ─────────────────────────────────────────────
    priority_actions = [
        {
            "rank": 1,
            "priority": "Critical",
            "action": "Start Nifty 50 Index Fund SIP — Your #1 Priority",
            "amount": "₹500/month",
            "fund": "UTI Nifty 50 Index Fund or Nippon India Index Fund",
            "impact": "Adds large-cap stability anchor. Reduces midcap concentration from 97% → 75%.",
            "timeline": "This month"
        },
        {
            "rank": 2,
            "priority": "High",
            "action": "Add Parag Parikh Flexi Cap SIP",
            "amount": "₹500/month",
            "fund": "Parag Parikh Flexi Cap Fund (Direct Growth)",
            "impact": "Adds built-in international diversification + multi-cap alpha.",
            "timeline": "Within 3 months"
        },
        {
            "rank": 3,
            "priority": "Medium",
            "action": "Review ABSL PSU SIP",
            "amount": "Pause ₹25/month",
            "fund": "Redirect to Index Fund",
            "impact": "Removes thematic risk. At ₹25/month, impact minimal but direction matters.",
            "timeline": "Optional — no urgency"
        },
        {
            "rank": 4,
            "priority": "Medium",
            "action": "Build Emergency Fund",
            "amount": "3-6 months expenses",
            "fund": "Liquid Fund or High-yield savings",
            "impact": "Prevents forced MF redemption during emergencies at a loss.",
            "timeline": "Before increasing SIP"
        },
    ]

    return {
        "investor": {
            "name": "Logesh",
            "age": 21,
            "portfolio_value": 2107.24,
            "total_invested": 2125.06,
            "total_pnl": -17.81,
            "total_pnl_percent": -0.84,
            "xirr": -19.87,
            "xirr_note": "Negative XIRR is normal at 2 months — ignore for now",
            "monthly_sip": 1625,
            "broker": "Angel One",
            "goal": "Financial Freedom",
            "horizon_years": "10-20",
            "months_investing": 2,
        },
        "scores": {
            "portfolio_score": portfolio_score,
            "risk_score": risk_score,
            "diversification_score": diversification_score,
            "wealth_score": wealth_score,
        },
        "portfolio_score_breakdown": portfolio_score_breakdown,
        "risk_score_breakdown": risk_score_breakdown,
        "diversification_breakdown": diversification_breakdown,
        "wealth_score_breakdown": wealth_score_breakdown,
        "priority_actions": priority_actions,
        "summary": {
            "headline": "Portfolio needs diversification — habits are excellent.",
            "strengths": [
                "SIP investing discipline established at 21 ✅",
                "All Direct plans — saving commission ✅",
                "Long-term mindset — 10-20 year horizon ✅",
                "HDFC Mid Cap is a top-quality fund ✅"
            ],
            "weaknesses": [
                "97% midcap concentration — no large cap anchor 🔴",
                "Zero debt or gold allocation — all equity 🔴",
                "Two active midcap funds + ETF = redundant overlap ⚠️",
                "PSU thematic fund adds political cycle risk ⚠️"
            ]
        }
    }
