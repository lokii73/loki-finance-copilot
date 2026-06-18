from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from jose import jwt
from datetime import datetime, timedelta
from app.config import settings
import hashlib

router = APIRouter()


def hash_password(password: str) -> str:
    """Simple SHA-256 hash for MVP. Use bcrypt/argon2 in production."""
    return hashlib.sha256(password.encode()).hexdigest()


def verify_password(plain: str, hashed: str) -> bool:
    return hash_password(plain) == hashed


# Simple in-memory user store for MVP (replace with DB in production)
DEMO_USER = {
    "id": 1,
    "name": "Logesh",
    "email": "logesh@stockgpt.in",
    "hashed_password": hash_password("demo123"),
}


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user_name: str
    user_email: str


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    """Simple login endpoint for MVP"""
    # For MVP: accept demo credentials or any email with demo123
    if request.password == "demo123" or (
        request.email == DEMO_USER["email"] and
        verify_password(request.password, DEMO_USER["hashed_password"])
    ):
        token = create_access_token({"sub": request.email, "user_id": 1})
        return TokenResponse(
            access_token=token,
            token_type="bearer",
            user_name="Logesh",
            user_email=request.email
        )
    raise HTTPException(status_code=401, detail="Invalid email or password")


@router.get("/me")
async def get_me():
    """Get current user info"""
    return {
        "id": 1,
        "name": "Logesh",
        "email": "logesh@stockgpt.in",
        "angel_one_connected": False,
        "mock_mode": True
    }
