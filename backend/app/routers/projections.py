from fastapi import APIRouter
from app.services.mock_data import get_real_wealth_projections, REAL_SIP_PLANS, INVESTOR_PROFILE
from typing import Dict, Any

router = APIRouter()


@router.get("/wealth")
async def get_wealth_projections_endpoint(
    monthly_sip: float = 1025,
    current_value: float = 2076,
    annual_return: float = 12
) -> Dict[str, Any]:
    """Get personalized wealth projections for Logesh"""
    base = get_real_wealth_projections(monthly_sip, current_value, annual_return)
    optimistic = get_real_wealth_projections(monthly_sip, current_value, 15)
    conservative = get_real_wealth_projections(monthly_sip, current_value, 8)

    # Calculate when ₹1 crore is reached
    crore_target = 10_000_000
    crore_years_base = next(
        (y for y in [5, 10, 15, 20, 25, 30] if base[str(y)]["estimated_value"] >= crore_target), None
    )
    crore_years_opt = next(
        (y for y in [5, 10, 15, 20, 25, 30] if optimistic[str(y)]["estimated_value"] >= crore_target), None
    )
    crore_years_cons = next(
        (y for y in [5, 10, 15, 20, 25, 30] if conservative[str(y)]["estimated_value"] >= crore_target), None
    )

    return {
        "base_case": base,
        "optimistic": optimistic,
        "conservative": conservative,
        "investor_profile": INVESTOR_PROFILE,
        "assumptions": {
            "monthly_sip": monthly_sip,
            "current_portfolio_value": current_value,
            "base_return": annual_return,
            "optimistic_return": 15,
            "conservative_return": 8,
            "investor_age": 21,
            "disclaimer": (
                "Returns are NOT guaranteed. Market-linked investments are subject to risks. "
                "12% CAGR is the long-term historical average for diversified Indian equity funds. "
                "Past performance does not guarantee future results."
            )
        },
        "crore_target": {
            "target": crore_target,
            "years_base": crore_years_base,
            "age_base": 21 + crore_years_base if crore_years_base else None,
            "years_optimistic": crore_years_opt,
            "age_optimistic": 21 + crore_years_opt if crore_years_opt else None,
            "years_conservative": crore_years_cons,
            "age_conservative": 21 + crore_years_cons if crore_years_cons else None,
        },
        "key_insight": (
            f"At your current SIP of ₹1,025/month, you could reach ₹1 Crore by age "
            f"{21 + crore_years_base if crore_years_base else '30+'} (base case). "
            f"Increasing SIP to ₹5,000/month could accelerate this by 5-7 years!"
        )
    }


@router.get("/sip-calculator")
async def sip_calculator(
    monthly_amount: float = 1025,
    annual_return: float = 12,
    years: int = 10
) -> Dict[str, Any]:
    """SIP calculator"""
    months = years * 12
    r = annual_return / 100 / 12

    if r > 0:
        fv = monthly_amount * ((((1 + r) ** months) - 1) / r) * (1 + r)
    else:
        fv = monthly_amount * months

    total_invested = monthly_amount * months
    profit = fv - total_invested

    return {
        "monthly_amount": monthly_amount,
        "annual_return": annual_return,
        "years": years,
        "total_invested": round(total_invested, 2),
        "estimated_value": round(fv, 2),
        "estimated_profit": round(profit, 2),
        "returns_multiple": round(fv / total_invested, 2),
        "wealth_gain_percent": round((profit / total_invested) * 100, 1)
    }
