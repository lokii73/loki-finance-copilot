import re

file_path = "backend/app/routers/exit_alerts.py"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Import REAL_HOLDINGS and REAL_MUTUAL_FUNDS
import_statement = """from typing import List, Dict, Any
from app.services.mock_data import REAL_HOLDINGS, REAL_MUTUAL_FUNDS"""
content = re.sub(r'from typing import List, Dict, Any', import_statement, content)

# Rewrite get_exit_dashboard
new_dashboard = """@router.get("/")
async def get_exit_dashboard() -> List[Dict[str, Any]]:
    \"\"\"Returns exit analysis for Logesh's REAL holdings only.\"\"\"
    result = []
    
    # Combine ETFs/Stocks and Mutual Funds into a common format
    all_holdings = []
    for h in REAL_HOLDINGS:
        all_holdings.append({
            "symbol": h["symbol"],
            "company_name": h["company_name"],
            "holding_type": h.get("instrument_type", "ETF"),
            "quantity": h["quantity"],
            "avg_buy_price": h["avg_buy_price"],
            "current_price": h["current_price"],
            "invested": h["quantity"] * h["avg_buy_price"],
            "current": h["quantity"] * h["current_price"]
        })
        
    for h in REAL_MUTUAL_FUNDS:
        all_holdings.append({
            "symbol": h["scheme_code"],
            "company_name": h["scheme_name"],
            "holding_type": "Mutual Fund SIP",
            "quantity": h["units"],
            "avg_buy_price": h["avg_nav"],
            "current_price": h["current_nav"],
            "invested": h["invested_amount"],
            "current": h["current_value"]
        })

    for h in all_holdings:
        sym = h["symbol"]
        pnl = h["current"] - h["invested"]
        pnl_pct = (pnl / h["invested"]) * 100 if h["invested"] > 0 else 0
        
        # Use hardcoded data if available, otherwise generate mock data dynamically
        if sym in EXIT_HOLDINGS_DATA:
            data = EXIT_HOLDINGS_DATA[sym]
        else:
            data = {
                "exit_risk_score": 45,
                "exit_probability": 20,
                "bullish_probability": 65,
                "bearish_probability": 35,
                "confidence_score": 75,
                "news_sentiment": "Neutral",
                "recommendation": "Hold Position",
                "target_price": h["avg_buy_price"] * 1.15,
                "stop_loss": h["avg_buy_price"] * 0.85,
            }

        result.append({
            "symbol": sym,
            "company_name": h["company_name"],
            "holding_type": h["holding_type"],
            "quantity": h.get("quantity"),
            "avg_buy_price": h.get("avg_buy_price"),
            "current_price": h.get("current_price"),
            "invested_amount": round(h["invested"], 2),
            "current_value": round(h["current"], 2),
            "pnl": round(pnl, 2),
            "pnl_percent": round(pnl_pct, 2),
            "stop_loss": data.get("stop_loss"),
            "target_price": data.get("target_price"),
            "exit_risk_score": data.get("exit_risk_score", 50),
            "exit_probability": data.get("exit_probability", 20),
            "bullish_probability": data.get("bullish_probability", 60),
            "bearish_probability": data.get("bearish_probability", 40),
            "confidence_score": data.get("confidence_score", 70),
            "news_sentiment": data.get("news_sentiment", "Neutral"),
            "recommendation": data.get("recommendation", "Hold"),
        })
    return result"""
content = re.sub(r'@router\.get\("/"\)\nasync def get_exit_dashboard\(\) -> List\[Dict\[str, Any\]\]:.*?return result', new_dashboard, content, flags=re.DOTALL)

# Rewrite get_exit_detail
new_detail = """@router.get("/{symbol}")
async def get_exit_detail(symbol: str) -> Dict[str, Any]:
    \"\"\"Get detailed exit analysis for a specific holding.\"\"\"
    sym = symbol.upper()
    
    # Find the holding in REAL_HOLDINGS or REAL_MUTUAL_FUNDS
    holding = next((h for h in REAL_HOLDINGS if h["symbol"] == sym), None)
    is_mf = False
    if not holding:
        holding = next((h for h in REAL_MUTUAL_FUNDS if h["scheme_code"] == sym), None)
        is_mf = True

    if not holding:
        raise HTTPException(
            status_code=404,
            detail=f"Holding '{sym}' not found in your portfolio."
        )

    if is_mf:
        invested = holding["invested_amount"]
        current = holding["current_value"]
        comp_name = holding["scheme_name"]
        htype = "Mutual Fund SIP"
    else:
        invested = holding["quantity"] * holding["avg_buy_price"]
        current = holding["quantity"] * holding["current_price"]
        comp_name = holding["company_name"]
        htype = holding.get("instrument_type", "ETF")

    pnl = current - invested
    pnl_pct = (pnl / invested) * 100 if invested > 0 else 0

    if sym in EXIT_HOLDINGS_DATA:
        data = EXIT_HOLDINGS_DATA[sym]
    else:
        # Generate default dynamic data for new stocks
        data = {
            "symbol": sym,
            "company_name": comp_name,
            "holding_type": htype,
            "exit_risk_score": 45,
            "exit_probability": 20,
            "bullish_probability": 65,
            "bearish_probability": 35,
            "confidence_score": 75,
            "news_sentiment": "Neutral",
            "recommendation": "Hold Position",
            "verdict_reason": f"{comp_name} is currently a solid hold in your portfolio. Stay invested for long-term growth.",
            "technical_summary": "Technical indicators suggest neutral to bullish momentum. No immediate exit signals generated.",
            "profit_booking_advice": "Maintain position. Consider adding on dips if it aligns with your asset allocation.",
            "risk_factors": ["Market volatility", "Sector-specific headwinds"],
            "positives": ["Solid fundamentals", "Long-term compounding potential"]
        }

    return {
        **data,
        "symbol": sym,
        "company_name": comp_name,
        "holding_type": htype,
        "quantity": holding.get("quantity", holding.get("units")),
        "avg_buy_price": holding.get("avg_buy_price", holding.get("avg_nav")),
        "current_price": holding.get("current_price", holding.get("current_nav")),
        "invested_amount": round(invested, 2),
        "current_value": round(current, 2),
        "pnl": round(pnl, 2),
        "pnl_percent": round(pnl_pct, 2),
    }"""
content = re.sub(r'@router\.get\("/{symbol}"\)\nasync def get_exit_detail\(symbol: str\) -> Dict\[str, Any\]:.*', new_detail, content, flags=re.DOTALL)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
