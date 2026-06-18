from fastapi import APIRouter
from app.services.mock_data import REAL_MARKET_DATA
from typing import Dict, Any

router = APIRouter()


@router.get("/overview")
async def get_market_overview() -> Dict[str, Any]:
    return REAL_MARKET_DATA


@router.get("/indices")
async def get_indices():
    return REAL_MARKET_DATA["indices"]


@router.get("/commodities")
async def get_commodities():
    return REAL_MARKET_DATA["commodities"]


@router.get("/forex")
async def get_forex():
    return REAL_MARKET_DATA["forex"]


@router.get("/summary")
async def get_market_summary() -> Dict[str, str]:
    return {"summary": REAL_MARKET_DATA["market_summary"]}


@router.get("/news")
async def get_market_news():
    return [
        {
            "id": 1,
            "headline": "Nifty Midcap 150 corrects 0.65% – profit booking after strong run",
            "source": "Economic Times",
            "time": "3 hours ago",
            "sentiment": "Neutral",
            "impact": "Your midcap funds (Motilal + HDFC) and HDFCMID150 ETF will reflect this dip",
            "category": "Your Portfolio Impact"
        },
        {
            "id": 2,
            "headline": "RBI holds repo rate at 6.5% – markets stabilize on policy clarity",
            "source": "Business Standard",
            "time": "4 hours ago",
            "sentiment": "Positive",
            "impact": "Stable rates are good for mid-cap growth companies in your funds",
            "category": "Monetary Policy"
        },
        {
            "id": 3,
            "headline": "PSU stocks see selling – NTPC, Coal India, Power Grid down 1-2%",
            "source": "Mint",
            "time": "5 hours ago",
            "sentiment": "Negative",
            "impact": "Your ABSL PSU Equity Fund may see slight NAV decline today",
            "category": "Your Portfolio Impact"
        },
        {
            "id": 4,
            "headline": "SEBI mandates clearer risk disclosure for thematic/sectoral funds",
            "source": "SEBI Press Release",
            "time": "Yesterday",
            "sentiment": "Neutral",
            "impact": "Relevant for your ABSL PSU Fund – SEBI highlighting thematic fund risks",
            "category": "Regulation"
        },
        {
            "id": 5,
            "headline": "Motilal Oswal Midcap Fund crosses ₹22,000 Cr AUM milestone",
            "source": "Value Research",
            "time": "Yesterday",
            "sentiment": "Positive",
            "impact": "Your Motilal Midcap fund continues to attract investors – strong conviction",
            "category": "Your Portfolio"
        },
        {
            "id": 6,
            "headline": "Direct mutual fund investments surge 34% YoY – fintech platforms drive growth",
            "source": "AMFI Data",
            "time": "2 days ago",
            "sentiment": "Positive",
            "impact": "You're already on Direct plans – saving 0.5-1% in expense ratios vs regular plans",
            "category": "Investing Insight"
        },
        {
            "id": 7,
            "headline": "Young investors (18-25) now 28% of new SIP registrations – AMFI report",
            "source": "AMFI",
            "time": "3 days ago",
            "sentiment": "Positive",
            "impact": "You're part of a growing trend of young Indian investors – great company!",
            "category": "Investing Trend"
        }
    ]
