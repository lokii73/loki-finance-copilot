from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql://stockgpt:stockgpt123@localhost:5432/stockgpt_india"

    # Security
    SECRET_KEY: str = "stockgpt-india-secret-key-change-in-prod"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # AI
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    AI_PROVIDER: str = "mock"  # mock, openai, anthropic

    # Angel One
    ANGEL_ONE_API_KEY: Optional[str] = None
    ANGEL_ONE_CLIENT_ID: Optional[str] = None
    ANGEL_ONE_PASSWORD: Optional[str] = None
    ANGEL_ONE_TOTP_SECRET: Optional[str] = None

    # App
    MOCK_MODE: bool = True
    APP_ENV: str = "development"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
