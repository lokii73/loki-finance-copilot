# 🚀 Loki Finance Copilot — Setup Guide

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- Python 3.10+
- Git

---

## 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate
source venv/bin/activate       # Mac/Linux
venv\Scripts\activate          # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and set your SECRET_KEY

# Start server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend runs at: `http://localhost:8000`  
API Docs: `http://localhost:8000/docs`

---

## 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local — set NEXT_PUBLIC_API_URL=http://localhost:8000

# Start dev server
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## 3. Access on Mobile (PWA)

Find your laptop IP:
```bash
# Mac/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig
```

Open `http://<YOUR_LAPTOP_IP>:3000` on your phone.  
Tap **Share → Add to Home Screen** to install as PWA.

**Note:** Both devices must be on the same Wi-Fi network.

---

## 4. Demo Login

```
Username: logesh
Password: loki2024
```

---

## Production Deployment

### Frontend → Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Repository
3. Set root directory: `frontend`
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = your Railway backend URL
5. Deploy

### Backend → Railway

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Set root directory: `backend`
3. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add all environment variables from `.env.example`
5. Deploy

### Database → Supabase (Phase 2)

1. Create project at [supabase.com](https://supabase.com)
2. Copy the PostgreSQL connection string
3. Set `DATABASE_URL` in Railway environment variables
4. Uncomment `psycopg2-binary` in `requirements.txt`

---

## API Endpoints Reference

| Module | Endpoint | Description |
|--------|----------|-------------|
| Portfolio | `GET /portfolio/overview` | Main portfolio summary |
| Portfolio | `GET /portfolio/intelligence` | AI scores (portfolio, risk, diversification, wealth) |
| Portfolio | `GET /portfolio/holdings` | ETF/stock positions |
| Portfolio | `GET /portfolio/sips` | Active SIP details |
| Exit Alerts | `GET /exit-alerts/` | All holdings with exit analysis |
| Exit Alerts | `GET /exit-alerts/{symbol}` | Detailed analysis for one holding |
| Exit Alerts | `GET /exit-alerts/news` | Portfolio news feed |
| Mutual Funds | `GET /mutual-funds/` | Your MF holdings |
| News | `GET /news/` | Market news with portfolio impact |
| News | `GET /news/market-impact` | Macro scenario analysis |
| Goal Planner | `POST /planners/goal` | Calculate goal corpus |
| Retirement | `POST /planners/retirement` | Calculate retirement corpus |
| Projections | `GET /projections/wealth` | Wealth projection scenarios |
| Chat | `POST /chat/message` | AI wealth advisor chat |
| Auth | `POST /auth/login` | Get JWT token |

---

## Project Structure

```
loki-finance-copilot/
├── frontend/
│   ├── app/
│   │   ├── dashboard/          ← Main portfolio overview
│   │   ├── portfolio/          ← Portfolio Intelligence Engine (NEW)
│   │   ├── exit-alerts/        ← Exit probability dashboard
│   │   ├── mutual-funds/       ← Fund analyzer with coverage audit
│   │   ├── news-alerts/        ← News Intelligence Engine (NEW)
│   │   ├── goal-planner/       ← Goal calculator
│   │   ├── retirement-planner/ ← Retirement calculator
│   │   ├── projections/        ← Wealth projections (rebuilt)
│   │   ├── recommendations/    ← Top stock/fund picks
│   │   └── chat/               ← AI Wealth Advisor
│   ├── components/
│   │   └── AppLayout.tsx       ← Nav with mobile hamburger + bottom tabs
│   └── lib/
│       ├── api.ts              ← All API calls
│       └── utils.ts            ← formatCurrency, formatPercent
├── backend/
│   ├── app/
│   │   ├── main.py             ← FastAPI app entry point
│   │   ├── routers/            ← All API route handlers
│   │   └── services/
│   │       ├── mock_data.py    ← Logesh's real portfolio data
│   │       └── ai_service.py   ← AI chat service
│   └── requirements.txt
└── SETUP.md                    ← This file
```

---

## Roadmap

| Version | Feature |
|---------|---------|
| **v2.0** (Current) | Portfolio Intelligence Engine, News Engine, Exit Alerts rebuild |
| **v2.1** | Real AI via Anthropic API (replace mock responses) |
| **v3.0** | Angel One Smart API integration (live portfolio sync) |
| **v3.1** | WhatsApp alerts via Twilio for exit signals |
| **v4.0** | AI Portfolio Agent (autonomous rebalancing suggestions) |
| **v5.0** | Multi-user support, shared watchlists |

---

*Built for Logesh — Personal AI Wealth Copilot. Not SEBI-registered advice.*
