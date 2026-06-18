"""
Portfolio Analyzer Service
Computes portfolio scores, risk levels, diversification metrics.
"""
from typing import Dict, Any, List
from app.services.mock_data import MOCK_HOLDINGS, MOCK_MUTUAL_FUNDS


def compute_portfolio_score(holdings: List[Dict], mf_holdings: List[Dict]) -> Dict[str, Any]:
    """Compute comprehensive portfolio scores"""

    # Asset allocation
    stocks_value = sum(h["quantity"] * h["current_price"] for h in holdings)
    mf_value = sum(mf["units"] * mf["current_nav"] for mf in mf_holdings)
    total_value = stocks_value + mf_value

    stocks_pct = (stocks_value / total_value * 100) if total_value > 0 else 0
    mf_pct = (mf_value / total_value * 100) if total_value > 0 else 0

    # Market cap breakdown (stocks)
    cap_breakdown = {"Large": 0, "Mid": 0, "Small": 0}
    for h in holdings:
        cap = h.get("market_cap_category", "Large")
        cap_breakdown[cap] = cap_breakdown.get(cap, 0) + (h["quantity"] * h["current_price"])

    # MF category breakdown
    mf_categories = {}
    for mf in mf_holdings:
        cat = mf.get("sub_category", "Other")
        mf_categories[cat] = mf_categories.get(cat, 0) + (mf["units"] * mf["current_nav"])

    # Sector breakdown
    sector_breakdown = {}
    for h in holdings:
        sector = h.get("sector", "Other")
        val = h["quantity"] * h["current_price"]
        sector_breakdown[sector] = sector_breakdown.get(sector, 0) + val

    # Calculate scores
    # Portfolio Score: based on diversification, profitability, risk balance
    diversification_score = min(100, len(set(h.get("sector", "") for h in holdings)) * 10)
    large_cap_ratio = cap_breakdown.get("Large", 0) / stocks_value if stocks_value > 0 else 0
    stability_score = min(100, large_cap_ratio * 100 + 30)  # Large cap = stability

    profitable_holdings = sum(1 for h in holdings if h["current_price"] > h["avg_buy_price"])
    profitability_score = (profitable_holdings / len(holdings) * 100) if holdings else 50

    portfolio_score = round((diversification_score * 0.3 + stability_score * 0.4 + profitability_score * 0.3), 1)
    portfolio_score = min(100, max(0, portfolio_score))

    # Risk Score: higher = more risky
    small_mid_exposure = (cap_breakdown.get("Small", 0) + cap_breakdown.get("Mid", 0)) / total_value if total_value > 0 else 0
    equity_exposure = (stocks_value + mf_value) / total_value if total_value > 0 else 1
    concentration_risk = max(sector_breakdown.values()) / total_value if sector_breakdown and total_value > 0 else 0

    risk_score = round(
        (small_mid_exposure * 40) +
        (equity_exposure * 30) +
        (concentration_risk * 30),
        1
    )
    risk_score = min(100, max(0, risk_score))

    # Wealth Score: overall financial health
    total_invested = (
        sum(h["quantity"] * h["avg_buy_price"] for h in holdings) +
        sum(mf["invested_amount"] for mf in mf_holdings)
    )
    overall_return = ((total_value - total_invested) / total_invested * 100) if total_invested > 0 else 0
    wealth_score = min(100, max(0, round(50 + (overall_return * 1.5), 1)))

    # Convert to percentages for chart
    cap_pct = {k: round(v / stocks_value * 100, 1) if stocks_value > 0 else 0 for k, v in cap_breakdown.items()}
    sector_pct = {k: round(v / total_value * 100, 1) for k, v in sector_breakdown.items()}

    return {
        "portfolio_score": portfolio_score,
        "risk_score": risk_score,
        "wealth_score": wealth_score,
        "asset_allocation": {
            "stocks_percent": round(stocks_pct, 1),
            "mutual_funds_percent": round(mf_pct, 1),
            "debt_percent": 0,
            "gold_percent": 0,
            "cash_percent": 0
        },
        "market_cap_breakdown": cap_pct,
        "sector_breakdown": {k: v for k, v in sorted(sector_pct.items(), key=lambda x: -x[1])},
        "mf_categories": {
            k: round(v / mf_value * 100, 1) if mf_value > 0 else 0
            for k, v in mf_categories.items()
        },
        "diversification_level": "Good" if len(sector_breakdown) >= 6 else "Moderate",
        "key_risks": [
            "High equity concentration (92%) – consider adding debt",
            "Small/mid cap exposure elevated – higher volatility expected",
            "No international diversification beyond MFs"
        ] if risk_score > 50 else ["Well-balanced portfolio", "Good diversification across sectors"],
        "strengths": [
            "Strong large-cap anchor stocks",
            "Consistent SIP discipline",
            "Quality fund selection (PPFAS, Mirae)",
            f"Portfolio beating benchmark with {overall_return:.1f}% overall returns"
        ]
    }
