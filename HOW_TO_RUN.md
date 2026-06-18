# 🚀 How to Run Loki Finance Copilot

---

## Step 1 — Extract the zip

Unzip `loki-finance-copilot-v3.zip` anywhere on your laptop.

```
loki-fixed/
├── backend/
├── frontend/
├── HOW_TO_RUN.md   ← you are here
└── SETUP.md
```

---

## Step 2 — Start the Backend (FastAPI)

Open **Terminal 1**:

```bash
cd loki-fixed/backend

# Create virtual environment (first time only)
python -m venv venv

# Activate it
source venv/bin/activate        # Mac / Linux
venv\Scripts\activate           # Windows

# Install packages (first time only)
pip install -r requirements.txt

# Create your .env file (first time only)
cp .env.example .env
```

Open `.env` and change one line:
```
SECRET_KEY=any-long-random-string-you-make-up
```

Then start the server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

✅ You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

API docs available at: **http://localhost:8000/docs**

---

## Step 3 — Start the Frontend (Next.js)

Open **Terminal 2**:

```bash
cd loki-fixed/frontend

# Install packages (first time only)
npm install

# Create your .env file (first time only)
cp .env.example .env.local
```

`.env.local` should contain:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the frontend:
```bash
npm run dev
```

✅ You should see:
```
▲ Next.js 14
- Local:   http://localhost:3000
- Network: http://192.168.x.x:3000   ← use this on mobile
```

---

## Step 4 — Open the App

**On your laptop:**
👉 http://localhost:3000

**Login:**
```
Username: logesh
Password: loki2024
```

---

## Step 5 — Open on Mobile (PWA)

1. Make sure your phone is on the **same Wi-Fi** as your laptop
2. Find your laptop IP (shown in `npm run dev` output as "Network:")
3. Open `http://192.168.x.x:3000` in your phone browser
4. Tap **Share → Add to Home Screen** (iOS) or **Install App** (Android)

The app installs like a native app on your phone. ✅

---

## Step 6 — Enable Real AI (Optional but Recommended)

The app works out of the box with smart mock responses.
To get real Claude AI answers, add your Anthropic API key:

1. Get a free API key at **console.anthropic.com**
2. Edit `backend/.env`:
```
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-your-key-here
```
3. Restart the backend (`Ctrl+C` then `uvicorn app.main:app --reload ...`)

The chat will now use **Claude Haiku** for real intelligent responses about your portfolio.

---

## Daily Use (After First Setup)

Every time you want to use the app:

**Terminal 1 (backend):**
```bash
cd loki-fixed/backend
source venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 (frontend):**
```bash
cd loki-fixed/frontend
npm run dev
```

Then open http://localhost:3000

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `ModuleNotFoundError` | Run `pip install -r requirements.txt` again |
| `npm: command not found` | Install Node.js from nodejs.org |
| Frontend shows "Backend offline" | Make sure backend is running on port 8000 |
| Mobile can't connect | Check same Wi-Fi. Use the Network IP, not localhost |
| Login fails | Username: `logesh` Password: `loki2024` |
| Port 8000 already in use | `lsof -i :8000` then `kill -9 <PID>` |
| Port 3000 already in use | Use `npm run dev -- -p 3001` |

---

## What Each Page Does

| Page | URL | What You'll See |
|------|-----|-----------------|
| Dashboard | /dashboard | Portfolio overview, chart, insights |
| Intelligence | /portfolio | AI scores: Portfolio 44, Risk 82, Diversification 25 |
| Exit Alerts | /exit-alerts | Your 4 holdings with exit probabilities |
| Mutual Funds | /mutual-funds | Fund analyzer + what to add next |
| News | /news-alerts | Market news filtered by your portfolio |
| Goals | /goal-planner | Financial Freedom calculator |
| Retirement | /retirement-planner | Retirement corpus calculator |
| Projections | /projections | ₹1 Crore timeline + age milestones |
| AI Advisor | /chat | Chat with Loki AI about your portfolio |
