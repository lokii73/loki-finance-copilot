# 🏹 Loki Finance Copilot – AI Wealth & Tactical Exit Dashboard

> **Your 100% self-hosted, independent, and secure AI wealth manager and tactical exit copilot for Indian markets.**
>
> ⚠️ **Disclaimer:** This application serves solely as decision-support technology providing probability-based insights. It is NOT SEBI-registered financial advice. Always consult a qualified professional before executing investment decisions.

---

## 📱 Essential Mobile & Desktop PWA Integration
Loki Finance Copilot is fully configured as a **Progressive Web App (PWA)**. 

### How to Install on Your Phone:
1. **iOS (Safari)**: Open the deployed URL, tap the **Share** button, and select **Add to Home Screen**.
2. **Android (Chrome)**: Open the deployed URL, tap the three dots in the corner, and select **Install App** or **Add to Home Screen**.

---

## ⚙️ Fast Production Deployments

### 🌐 Deploy Frontend (Vercel)
You can deploy the Next.js frontend to **Vercel** with a single click:
1. Push this folder to a new **GitHub repository** (e.g. `your-username/loki-finance`).
2. Log into **[vercel.com](https://vercel.com/)** and click **Add New Project**.
3. Import the repository.
4. Set the following **Environment Variables**:
   * `NEXT_PUBLIC_API_URL`: Your live backend URL (e.g. `https://loki-backend.up.railway.app` or your public tunnel address).
   * `NEXT_PUBLIC_APP_NAME`: `Loki Finance Copilot`
   * `NEXT_PUBLIC_MOCK_MODE`: `true`
5. Click **Deploy**!

### ⚙️ Deploy Backend (Railway / Render)
1. Push the `backend` folder to GitHub.
2. In **Railway** (or **Render**), click **New Project** and deploy from your GitHub repository.
3. Add backend environment variables (from `backend/.env.example`).
4. Copy the deployment URL and add it as the `NEXT_PUBLIC_API_URL` variable in your Vercel frontend.

---

## 💻 Local Setup Steps

### Prerequisites
- **Node.js 18+** (`node --version`)
- **Python 3.10+** (`python --version`)

### 1. Configure Environment Variables
Copy the sample environment variables for both the frontend and backend:
```bash
# In the root directory:
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

### 2. Start the FastAPI Backend
```powershell
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
* **Desktop Access**: `http://localhost:8000/docs`
* **Network Mode**: Bound to `0.0.0.0` so any device on your local Wi-Fi can connect.

### 3. Start the Next.js Frontend
```powershell
cd frontend
npm install
npm run dev
```
* **Desktop Access**: `http://localhost:3000`

---

## 📶 Connecting from Your Phone on Local Wi-Fi
Loki Finance Copilot has built-in dynamic local IP mapping. To test it on your phone:
1. Ensure your laptop and phone are on the **same Wi-Fi network**.
2. Find your laptop's local IP (e.g. `192.168.1.100` via `ipconfig` on Windows or `ifconfig` on Mac).
3. Open **`http://<your-laptop-ip>:3000`** in your mobile browser.
4. The client will automatically map API requests to `http://<your-laptop-ip>:8000` so the app functions perfectly!

---

## 🏗️ Project Architecture

```
loki-finance/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry & dynamic CORS headers
│   │   ├── config.py            # Pydantic environment configuration
│   │   ├── routers/
│   │   │   ├── exit_alerts.py   # Stop-losses, exit probability, promoter pledges
│   │   │   ├── planners.py      # Goal planners & retirement nest egg compounds
│   │   │   ├── auth.py          # Demo auth
│   │   │   └── chat.py          # ChatGPT split-pane prompt processor
│   │   └── services/
│   │       ├── mock_data.py     # Logesh's portfolio baseline (TCS, HDFC Bank, Rel)
│   │       └── ai_service.py    # Wealth Coach AI advisor service
│   ├── .env.example
│   └── requirements.txt
│
└── frontend/
    ├── app/
    │   ├── exit-alerts/         # Positional exit tracker dashboard
    │   ├── goal-planner/        # Slider-based milestone calculators
    │   ├── retirement-planner/  # Inflation adjusted target planners
    │   ├── news-alerts/         # NSE/BSE filing & promoter watch
    │   ├── chat/                # Dual-pane ChatGPT Wealth Coach
    │   └── globals.css          # Groww × Zerodha light styling sheet
    ├── public/
    │   └── manifest.json        # PWA capability manifest
    ├── .env.example
    └── package.json
```

---

## 🛡️ Premium Safety Protocols Built-In
- **No Guarantees**: Never claims guaranteed returns or "100% accuracy".
- **Risk Indicators**: Shows risk percentages and probability thresholds alongside returns.
- **Support-Only**: Emphasizes that final execution decisions belong to the user.
- **SEBI Notices**: Explicit warning blocks rendered on every planner and tracker.
