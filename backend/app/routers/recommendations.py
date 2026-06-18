from fastapi import APIRouter
from app.services.mock_data import get_real_recommendations
from typing import List, Dict, Any

router = APIRouter()


@router.get("/")
async def get_all_recommendations() -> List[Dict[str, Any]]:
    """Get personalized AI recommendations for Logesh's portfolio"""
    return get_real_recommendations()


@router.get("/action-plan")
async def get_action_plan() -> Dict[str, Any]:
    """Get prioritized action plan"""
    recs = get_real_recommendations()
    critical = [r for r in recs if r["priority"] == "Critical"]
    high = [r for r in recs if r["priority"] == "High"]
    medium = [r for r in recs if r["priority"] == "Medium"]
    low = [r for r in recs if r["priority"] == "Low"]

    return {
        "critical": critical,
        "high_priority": high,
        "medium_priority": medium,
        "low_priority": low,
        "summary": f"{len(critical)} critical, {len(high)} high, {len(medium)} medium, {len(low)} low priority",
        "top_action": "Add a Nifty 50 Index Fund SIP immediately – your portfolio is 97% midcap",
        "disclaimer": (
            "These are AI-generated suggestions based on your portfolio screenshots. "
            "Not SEBI-registered financial advice. Consult a qualified advisor for major decisions."
        )
    }
