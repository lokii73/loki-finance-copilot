from fastapi import APIRouter, HTTPException
from app.services.mock_data import REAL_MUTUAL_FUNDS
from typing import Dict, Any, List
import random
from datetime import datetime, timedelta

router = APIRouter()

# Detailed analysis already embedded in REAL_MUTUAL_FUNDS
MF_DETAIL_ANALYSIS = {
    "MOF_MIDCAP": {
        "performance_vs_category": {
            "fund_1y": 26.4, "category_avg_1y": 18.2,
            "fund_3y": 32.8, "category_avg_3y": 24.6,
            "fund_5y": 29.4, "category_avg_5y": 22.8,
        }
    },
    "HDFC_MIDCAP": {
        "performance_vs_category": {
            "fund_1y": 18.6, "category_avg_1y": 18.2,
            "fund_3y": 22.4, "category_avg_3y": 24.6,
            "fund_5y": 24.8, "category_avg_5y": 22.8,
        }
    },
    "ABSL_PSU": {
        "performance_vs_category": {
            "fund_1y": 12.4, "category_avg_1y": 16.8,
            "fund_3y": None, "category_avg_3y": None,
            "fund_5y": None, "category_avg_5y": None,
        }
    }
}


@router.get("/")
async def get_all_mutual_funds() -> List[Dict[str, Any]]:
    """Get all real mutual fund holdings"""
    return REAL_MUTUAL_FUNDS


@router.get("/{scheme_code}")
async def get_mf_detail(scheme_code: str) -> Dict[str, Any]:
    """Get detailed analysis for a mutual fund"""
    mf = next((m for m in REAL_MUTUAL_FUNDS if m["scheme_code"] == scheme_code), None)
    if not mf:
        raise HTTPException(status_code=404, detail=f"Fund {scheme_code} not in your portfolio")

    extra = MF_DETAIL_ANALYSIS.get(scheme_code, {})

    # NAV history simulation
    nav_history = []
    nav = mf["avg_nav"] * 0.92
    for i in range(90, 0, -1):
        date = (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d")
        nav = nav * (1 + random.gauss(0.0004, 0.009))
        nav_history.append({"date": date, "nav": round(nav, 4)})
    nav_history.append({"date": datetime.now().strftime("%Y-%m-%d"), "nav": mf["current_nav"]})

    return {
        **mf,
        **extra,
        "nav_history": nav_history,
    }
