import re

with open("backend/app/services/mock_data.py", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update REAL_HOLDINGS
new_holdings = """REAL_HOLDINGS = [
    {
        "symbol": "HDFCMID150",
        "company_name": "HDFC Nifty Midcap 150 ETF",
        "instrument_type": "ETF",
        "quantity": 18,
        "avg_buy_price": 23.47,
        "current_price": 23.25,
        "day_change": 0.21,
        "day_change_percent": 0.91
    },
    {
        "symbol": "ITC",
        "company_name": "ITC Limited",
        "instrument_type": "Stock",
        "quantity": 1,
        "avg_buy_price": 297.56,
        "current_price": 291.15,
        "day_change": 0.40,
        "day_change_percent": 0.14
    },
    {
        "symbol": "NIFTYBEES",
        "company_name": "Nippon India Nifty 50 ETF",
        "instrument_type": "ETF",
        "quantity": 2,
        "avg_buy_price": 274.96,
        "current_price": 273.97,
        "day_change": 0.86,
        "day_change_percent": 0.31
    },
    {
        "symbol": "PHARMABEES",
        "company_name": "Nippon India Pharma ETF",
        "instrument_type": "ETF",
        "quantity": 2,
        "avg_buy_price": 25.57,
        "current_price": 24.90,
        "day_change": 0.15,
        "day_change_percent": 0.61
    },
    {
        "symbol": "TATAGOLD",
        "company_name": "Tata Gold ETF",
        "instrument_type": "ETF",
        "quantity": 7,
        "avg_buy_price": 15.47,
        "current_price": 14.34,
        "day_change": -0.18,
        "day_change_percent": -1.24
    }
]"""
content = re.sub(r'REAL_HOLDINGS\s*=\s*\[\]', new_holdings, content)

# 2. Update Mutual Fund amounts directly using regex
content = re.sub(r'("invested_amount":)\s*999\.88,', r'\g<1>1611.00,', content)
content = re.sub(r'("current_value":)\s*979\.55,', r'\g<1>1654.36,', content)
content = re.sub(r'("pnl":)\s*-20\.33,', r'\g<1>43.36,', content)
content = re.sub(r'("pnl_percent":)\s*-2\.03,', r'\g<1>2.69,', content)

content = re.sub(r'("invested_amount":)\s*799\.89,', r'\g<1>1288.78,', content)
content = re.sub(r'("current_value":)\s*804\.64,', r'\g<1>1358.95,', content)
content = re.sub(r'("pnl":)\s*4\.75,', r'\g<1>70.17,', content)
content = re.sub(r'("pnl_percent":)\s*0\.59,', r'\g<1>5.44,', content)

content = re.sub(r'("invested_amount":)\s*299\.98,', r'\g<1>483.33,', content)
content = re.sub(r'("current_value":)\s*296\.13,', r'\g<1>500.13,', content)
content = re.sub(r'("pnl":)\s*-3\.85,', r'\g<1>16.80,', content)
content = re.sub(r'("pnl_percent":)\s*-1\.28,', r'\g<1>3.48,', content)

content = re.sub(r'("invested_amount":)\s*25\.31,', r'\g<1>40.78,', content)
content = re.sub(r'("current_value":)\s*26\.93,', r'\g<1>45.48,', content)
content = re.sub(r'("pnl":)\s*1\.62,', r'\g<1>4.70,', content)
content = re.sub(r'("pnl_percent":)\s*6\.39,', r'\g<1>11.53,', content)

# 3. Update get_real_portfolio_overview values
content = re.sub(r'("total_invested":\s*)2125\.06,', r'\g<1>4853.00,', content)
content = re.sub(r'("total_value":\s*)2107\.24,', r'\g<1>4966.00,', content)
content = re.sub(r'("total_pnl":\s*)-17\.81,', r'\g<1>112.84,', content)
content = re.sub(r'("total_pnl_percent":\s*)-0\.84,', r'\g<1>2.33,', content)
content = re.sub(r'("today_change":\s*)-3\.20,', r'\g<1>24.01,', content)
content = re.sub(r'("today_change_percent":\s*)-0\.15,', r'\g<1>0.48,', content)
content = re.sub(r'("mf_value":\s*)2107\.24,', r'\g<1>3559.00,', content)
content = re.sub(r'("stocks_value":\s*)0\.0,', r'\g<1>1407.00,', content)

with open("backend/app/services/mock_data.py", "w", encoding="utf-8") as f:
    f.write(content)
