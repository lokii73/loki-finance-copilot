from fastapi import APIRouter, HTTPException
from app.services.mock_data import REAL_HOLDINGS
from typing import Dict, Any, List
import random
from datetime import datetime, timedelta

router = APIRouter()

# Real stock analysis for Logesh's actual holding
REAL_STOCK_ANALYSIS = {
    "HDFCMID150": {
        "pe_ratio": 28.4,
        "pb_ratio": 3.8,
        "roe": 18.2,
        "roce": 20.4,
        "debt_to_equity": None,
        "profit_growth_1y": None,
        "revenue_growth_1y": None,
        "eps": None,
        "dividend_yield": 0.0,
        "52w_high": 28.90,
        "52w_low": 19.80,
        "rsi": 44.2,
        "macd_signal": "Neutral",
        "moving_avg_50": 23.10,
        "moving_avg_200": 22.40,
        "investment_score": 62,
        "bullish_probability": 58,
        "bearish_probability": 42,
        "confidence": 65,
        "verdict": "Hold",
        "verdict_reason": (
            "HDFC Nifty Midcap 150 ETF tracks the NIFTY Midcap 150 index passively at low cost. "
            "It's a decent product, but since you already hold TWO active midcap mutual funds "
            "(Motilal + HDFC), this ETF creates redundant midcap exposure. "
            "Consider whether you need a 3rd midcap vehicle or if this capital could go into "
            "a large cap index fund for better portfolio balance."
        ),
        "risk_factors": [
            "Already over-exposed to midcap via 2 active MFs",
            "Midcap ETFs can fall 35-45% in major market corrections",
            "No unique alpha over active midcap funds at this size",
            "Portfolio concentration risk – all 3 instruments are midcap"
        ]
    }
}


@router.get("/")
async def get_all_stocks() -> List[Dict[str, Any]]:
    """Get all stock/ETF holdings with analysis"""
    result = []
    for h in REAL_HOLDINGS:
        sym = h["symbol"]
        analysis = REAL_STOCK_ANALYSIS.get(sym, {})
        invested = h["quantity"] * h["avg_buy_price"]
        current = h["quantity"] * h["current_price"]
        pnl = current - invested

        result.append({
            "symbol": sym,
            "company_name": h["company_name"],
            "sector": h.get("sector", "ETF"),
            "market_cap_category": h.get("market_cap_category", "Mid"),
            "instrument_type": h.get("instrument_type", "ETF"),
            "current_price": h["current_price"],
            "avg_buy_price": h["avg_buy_price"],
            "quantity": h["quantity"],
            "invested_value": round(invested, 2),
            "current_value": round(current, 2),
            "pnl": round(pnl, 2),
            "pnl_percent": round((pnl / invested * 100) if invested > 0 else 0, 2),
            "investment_score": analysis.get("investment_score", 62),
            "verdict": analysis.get("verdict", "Hold"),
            "bullish_probability": analysis.get("bullish_probability", 58),
            "bearish_probability": analysis.get("bearish_probability", 42),
        })
    return result


@router.get("/{symbol}")
async def get_stock_detail(symbol: str) -> Dict[str, Any]:
    """Get detailed analysis for a specific stock/ETF"""
    symbol = symbol.upper()

    holding = next((h for h in REAL_HOLDINGS if h["symbol"] == symbol), None)
    if not holding:
        raise HTTPException(status_code=404, detail=f"{symbol} not in your portfolio")

    analysis = REAL_STOCK_ANALYSIS.get(symbol, {})

    invested = holding["quantity"] * holding["avg_buy_price"]
    current = holding["quantity"] * holding["current_price"]

    # Price history simulation (last 30 days, starting from avg price ~6 months ago)
    price_history = []
    price = holding["avg_buy_price"] * 1.05  # started slightly above avg
    for i in range(30, 0, -1):
        date = (datetime.now() - timedelta(days=i)).strftime("%Y-%m-%d")
        price = price * (1 + random.gauss(0.0, 0.018))
        price_history.append({"date": date, "price": round(max(price, 18.0), 2)})
    price_history.append({"date": datetime.now().strftime("%Y-%m-%d"), "price": holding["current_price"]})

    return {
        **holding,
        **analysis,
        "invested_value": round(invested, 2),
        "current_value": round(current, 2),
        "pnl": round(current - invested, 2),
        "pnl_percent": round(((current - invested) / invested * 100) if invested > 0 else 0, 2),
        "price_history": price_history,
        "technical_summary": {
            "rsi_signal": "Neutral",
            "trend": "Sideways",
            "support": holding.get("technical_summary", {}).get("support", 21.50),
            "resistance": holding.get("technical_summary", {}).get("resistance", 25.80)
        }
    }
