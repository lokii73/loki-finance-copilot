import re

with open("backend/app/services/mock_data.py", "r", encoding="utf-8") as f:
    content = f.read()

# Update asset_allocation
content = re.sub(r'("mutual_funds_percent":\s*)100,', r'\g<1>72,', content)
content = re.sub(r'("stocks_percent":\s*)0,', r'\g<1>28,', content)

# Update the top of the file comments
content = re.sub(r'Total Invested:\s*₹2,125.06', r'Total Invested:  ₹4,853.00', content)
content = re.sub(r'Current Value:\s*₹2,107.24', r'Current Value:   ₹4,966.00', content)
content = re.sub(r'Unrealised P&L:\s*-₹17.81 \(-0.84%\)', r'Unrealised P&L:  ₹112.84 (+2.33%)', content)

with open("backend/app/services/mock_data.py", "w", encoding="utf-8") as f:
    f.write(content)
