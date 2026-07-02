from fastapi import APIRouter
from typing import List, Dict, Any

router = APIRouter()

SUGGESTIONS = [
    {
        "id": "1",
        "symbol": "TATAELXSI",
        "company_name": "Tata Elxsi Ltd",
        "sector": "IT & Engineering",
        "category": "High Growth / Tech",
        "current_price": 7250.45,
        "target_price": 8800.00,
        "potential_upside": 21.3,
        "ai_confidence_score": 88,
        "time_horizon": "1-3 Years",
        "rationale": "Strong demand in automotive ER&D (Electric Vehicles & autonomous driving) and healthcare design. Tata Elxsi is uniquely positioned to capture the AI and smart mobility boom with high margins.",
        "risk_level": "High"
    },
    {
        "id": "2",
        "symbol": "HDFCBANK",
        "company_name": "HDFC Bank Ltd",
        "sector": "Banking",
        "category": "Undervalued / Core",
        "current_price": 1495.20,
        "target_price": 1850.00,
        "potential_upside": 23.7,
        "ai_confidence_score": 94,
        "time_horizon": "1-2 Years",
        "rationale": "Post-merger integration overhang is fully priced in. The bank is trading at its lowest Price-to-Book multiple in a decade while maintaining a massive retail deposit franchise.",
        "risk_level": "Low"
    },
    {
        "id": "3",
        "symbol": "HAL",
        "company_name": "Hindustan Aeronautics Ltd",
        "sector": "Defence",
        "category": "High Growth / Momentum",
        "current_price": 3840.60,
        "target_price": 4500.00,
        "potential_upside": 17.1,
        "ai_confidence_score": 85,
        "time_horizon": "2-3 Years",
        "rationale": "Massive government push for indigenous defence manufacturing. HAL has an unprecedented multi-year order book securing its revenue visibility for the next 5 years.",
        "risk_level": "Medium"
    },
    {
        "id": "4",
        "symbol": "ZOMATO",
        "company_name": "Zomato Ltd",
        "sector": "Consumer / Tech",
        "category": "High Growth / Disruptor",
        "current_price": 184.25,
        "target_price": 240.00,
        "potential_upside": 30.2,
        "ai_confidence_score": 79,
        "time_horizon": "3-5 Years",
        "rationale": "Blinkit (quick commerce) is hitting operational profitability much faster than anticipated. Dominant duopoly in food delivery provides a strong, cash-generating moat.",
        "risk_level": "Very High"
    },
    {
        "id": "5",
        "symbol": "RELIANCE",
        "company_name": "Reliance Industries Ltd",
        "sector": "Conglomerate",
        "category": "Core / Defensive",
        "current_price": 2945.10,
        "target_price": 3400.00,
        "potential_upside": 15.4,
        "ai_confidence_score": 92,
        "time_horizon": "1-3 Years",
        "rationale": "Upcoming tariff hikes in Jio and sustained retail expansion. A potential spin-off of the telecom or retail units in the coming years will unlock massive shareholder value.",
        "risk_level": "Low"
    }
]

@router.get("/")
async def get_stock_suggestions() -> List[Dict[str, Any]]:
    """Get AI-analyzed stock suggestions for future profits."""
    return SUGGESTIONS
