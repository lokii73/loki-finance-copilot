from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, portfolio, stocks, mutual_funds, market, chat, projections, recommendations, exit_alerts, planners, news

app = FastAPI(
    title="StockGPT India API",
    description="Personal AI Wealth Manager for Indian Investors",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration - relaxed to support both Next.js and standard local HTML files (file:// origin)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(portfolio.router, prefix="/portfolio", tags=["Portfolio"])
app.include_router(stocks.router, prefix="/stocks", tags=["Stocks"])
app.include_router(mutual_funds.router, prefix="/mutual-funds", tags=["Mutual Funds"])
app.include_router(market.router, prefix="/market", tags=["Market"])
app.include_router(chat.router, prefix="/chat", tags=["AI Chat"])
app.include_router(projections.router, prefix="/projections", tags=["Projections"])
app.include_router(recommendations.router, prefix="/recommendations", tags=["Recommendations"])
app.include_router(exit_alerts.router, prefix="/exit-alerts", tags=["Exit Alerts"])
app.include_router(planners.router, prefix="/planners", tags=["Goal Planners"])
app.include_router(news.router, prefix="/news", tags=["News"])


@app.get("/")
async def root():
    return {
        "app": "StockGPT India",
        "version": "1.0.0",
        "status": "running",
        "mode": "mock",
        "docs": "/docs"
    }


@app.get("/health")
async def health():
    return {"status": "healthy", "service": "StockGPT India API"}
