from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any

router = APIRouter()


class GoalPlannerInput(BaseModel):
    goal_name: str
    goal_amount: float
    timeline_years: float
    current_savings: float
    monthly_investment: float
    expected_return: float


class RetirementPlannerInput(BaseModel):
    current_age: float
    retirement_age: float
    desired_monthly_expense: float
    inflation_rate: float
    existing_investments: float
    pre_return: float
    post_return: float


@router.post("/goal")
async def calculate_goal(body: GoalPlannerInput) -> Dict[str, Any]:
    years = body.timeline_years
    months = years * 12
    r = (body.expected_return / 100) / 12
    
    # Target to cover after current savings grow
    future_savings = body.current_savings * ((1 + body.expected_return / 100) ** years)
    target_to_reach = max(body.goal_amount - future_savings, 0)
    
    # Calculate required monthly SIP using PMT formula
    if r > 0:
        required_monthly = target_to_reach * r / (((1 + r) ** months) - 1) / (1 + r)
    else:
        required_monthly = target_to_reach / months if months > 0 else 0
        
    # Projected corpus with current monthly investment
    if r > 0:
        projected_sip_fv = body.monthly_investment * ((((1 + r) ** months) - 1) / r) * (1 + r)
    else:
        projected_sip_fv = body.monthly_investment * months
        
    projected_corpus = projected_sip_fv + future_savings
    shortfall_or_surplus = projected_corpus - body.goal_amount
    progress_percent = min((projected_corpus / body.goal_amount * 100) if body.goal_amount > 0 else 0, 100)
    
    return {
        "goal_name": body.goal_name,
        "goal_amount": body.goal_amount,
        "required_monthly_sip": round(required_monthly, 2),
        "projected_corpus": round(projected_corpus, 2),
        "shortfall_or_surplus": round(shortfall_or_surplus, 2),
        "progress_percent": round(progress_percent, 2),
        "is_on_track": shortfall_or_surplus >= 0
    }


@router.post("/retirement")
async def calculate_retirement(body: RetirementPlannerInput) -> Dict[str, Any]:
    years_to_retire = max(body.retirement_age - body.current_age, 0)
    life_expectancy_years = 85 - body.retirement_age  # assume living until 85
    months_in_retirement = life_expectancy_years * 12
    
    # 1. Inflation adjusted expense at retirement
    inflation_factor = (1 + body.inflation_rate / 100) ** years_to_retire
    inflated_monthly_expense = body.desired_monthly_expense * inflation_factor
    
    # 2. Retirement Corpus Needed (using post-retirement return rate adjusted by inflation)
    # real post-retirement return rate adjusted for inflation: (post_ret - inflation) / (1 + inflation)
    real_monthly_return = ((body.post_return - body.inflation_rate) / 100) / 12
    
    if real_monthly_return > 0:
        corpus_needed = inflated_monthly_expense * (1 - (1 + real_monthly_return) ** -months_in_retirement) / real_monthly_return
    else:
        corpus_needed = inflated_monthly_expense * months_in_retirement
        
    # 3. Future Value of Existing Investments
    future_value_existing = body.existing_investments * ((1 + body.pre_return / 100) ** years_to_retire)
    
    # 4. Shortfall and monthly SIP required pre-retirement
    target_to_sip = max(corpus_needed - future_value_existing, 0)
    pre_r_monthly = ((body.pre_return / 100) / 12)
    months_to_retire = years_to_retire * 12
    
    if pre_r_monthly > 0 and months_to_retire > 0:
        required_sip = target_to_sip * pre_r_monthly / (((1 + pre_r_monthly) ** months_to_retire) - 1) / (1 + pre_r_monthly)
    else:
        required_sip = target_to_sip / months_to_retire if months_to_retire > 0 else 0
        
    # Calculate readiness score (0-100)
    total_expected_coverage = future_value_existing
    readiness_score = min((total_expected_coverage / corpus_needed * 100) if corpus_needed > 0 else 100, 100)
    
    return {
        "inflated_monthly_expense": round(inflated_monthly_expense, 2),
        "retirement_corpus_needed": round(corpus_needed, 2),
        "future_value_existing": round(future_value_existing, 2),
        "required_pre_retirement_sip": round(required_sip, 2),
        "retirement_readiness_score": round(readiness_score, 2)
    }
