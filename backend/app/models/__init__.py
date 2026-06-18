from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, JSON, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum


class RiskLevel(str, enum.Enum):
    LOW = "Low"
    MODERATE = "Moderate"
    HIGH = "High"
    VERY_HIGH = "Very High"


class TransactionType(str, enum.Enum):
    BUY = "BUY"
    SELL = "SELL"
    DIVIDEND = "DIVIDEND"
    SIP = "SIP"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    angel_one_client_id = Column(String(50), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    holdings = relationship("Holding", back_populates="user")
    mutual_funds = relationship("MutualFundHolding", back_populates="user")
    sip_plans = relationship("SIPPlan", back_populates="user")
    transactions = relationship("Transaction", back_populates="user")
    snapshots = relationship("PortfolioSnapshot", back_populates="user")
    chat_history = relationship("ChatHistory", back_populates="user")


class Holding(Base):
    __tablename__ = "holdings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    symbol = Column(String(50), nullable=False)
    company_name = Column(String(200), nullable=False)
    exchange = Column(String(10), default="NSE")
    quantity = Column(Float, nullable=False)
    avg_buy_price = Column(Float, nullable=False)
    current_price = Column(Float, nullable=False)
    sector = Column(String(100), nullable=True)
    market_cap_category = Column(String(20), nullable=True)  # Large, Mid, Small
    isin = Column(String(20), nullable=True)
    last_updated = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="holdings")

    @property
    def invested_value(self):
        return self.quantity * self.avg_buy_price

    @property
    def current_value(self):
        return self.quantity * self.current_price

    @property
    def pnl(self):
        return self.current_value - self.invested_value

    @property
    def pnl_percent(self):
        if self.invested_value > 0:
            return (self.pnl / self.invested_value) * 100
        return 0


class MutualFundHolding(Base):
    __tablename__ = "mutual_fund_holdings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    scheme_code = Column(String(20), nullable=False)
    scheme_name = Column(String(300), nullable=False)
    fund_house = Column(String(200), nullable=True)
    category = Column(String(100), nullable=True)
    sub_category = Column(String(100), nullable=True)
    units = Column(Float, nullable=False)
    avg_nav = Column(Float, nullable=False)
    current_nav = Column(Float, nullable=False)
    invested_amount = Column(Float, nullable=False)
    risk_level = Column(String(20), nullable=True)
    aum_cr = Column(Float, nullable=True)
    expense_ratio = Column(Float, nullable=True)
    cagr_1y = Column(Float, nullable=True)
    cagr_3y = Column(Float, nullable=True)
    cagr_5y = Column(Float, nullable=True)
    fund_manager = Column(String(100), nullable=True)
    last_updated = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="mutual_funds")

    @property
    def current_value(self):
        return self.units * self.current_nav

    @property
    def pnl(self):
        return self.current_value - self.invested_amount

    @property
    def pnl_percent(self):
        if self.invested_amount > 0:
            return (self.pnl / self.invested_amount) * 100
        return 0


class SIPPlan(Base):
    __tablename__ = "sip_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    scheme_code = Column(String(20), nullable=False)
    scheme_name = Column(String(300), nullable=False)
    monthly_amount = Column(Float, nullable=False)
    sip_date = Column(Integer, nullable=True)  # Day of month
    start_date = Column(DateTime(timezone=True), nullable=True)
    total_invested = Column(Float, default=0)
    installments_paid = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="sip_plans")


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    transaction_type = Column(String(20), nullable=False)  # BUY, SELL, DIVIDEND, SIP
    instrument_type = Column(String(20), nullable=False)  # STOCK, MF
    symbol = Column(String(50), nullable=True)
    scheme_code = Column(String(20), nullable=True)
    instrument_name = Column(String(300), nullable=False)
    quantity = Column(Float, nullable=True)
    price = Column(Float, nullable=True)
    amount = Column(Float, nullable=False)
    transaction_date = Column(DateTime(timezone=True), nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="transactions")


class PortfolioSnapshot(Base):
    __tablename__ = "portfolio_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    snapshot_date = Column(DateTime(timezone=True), nullable=False)
    total_value = Column(Float, nullable=False)
    total_invested = Column(Float, nullable=False)
    stocks_value = Column(Float, default=0)
    mf_value = Column(Float, default=0)
    pnl = Column(Float, default=0)
    pnl_percent = Column(Float, default=0)
    portfolio_score = Column(Float, nullable=True)
    risk_score = Column(Float, nullable=True)

    user = relationship("User", back_populates="snapshots")


class MarketData(Base):
    __tablename__ = "market_data"

    id = Column(Integer, primary_key=True, index=True)
    index_name = Column(String(50), nullable=False)
    current_value = Column(Float, nullable=False)
    change = Column(Float, default=0)
    change_percent = Column(Float, default=0)
    high = Column(Float, nullable=True)
    low = Column(Float, nullable=True)
    volume = Column(Float, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())


class AIAnalysisCache(Base):
    __tablename__ = "ai_analysis_cache"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    analysis_type = Column(String(50), nullable=False)  # portfolio, stock, mf
    target_id = Column(String(100), nullable=True)  # symbol or scheme_code
    analysis_data = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=True)


class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role = Column(String(20), nullable=False)  # user, assistant
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="chat_history")
