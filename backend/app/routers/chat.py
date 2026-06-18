"""
Chat router — session-scoped history, provider display, suggestions.
"""
from fastapi import APIRouter, Header
from pydantic import BaseModel
from app.services.ai_service import ai_service
from app.services.mock_data import PORTFOLIO_CONTEXT_FOR_AI
from typing import List, Dict, Any, Optional
import uuid

router = APIRouter()

# Session-scoped history: { session_id: [messages] }
_sessions: Dict[str, List[Dict[str, str]]] = {}
_DEFAULT = "default"


def _get_history(session_id: str) -> List[Dict[str, str]]:
    return _sessions.setdefault(session_id, [])


class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = _DEFAULT


@router.post("/message")
async def send_message(body: ChatMessage) -> Dict[str, Any]:
    sid = body.session_id or _DEFAULT
    history = _get_history(sid)

    history.append({"role": "user", "content": body.message})

    response = await ai_service.chat(
        messages=history,
        portfolio_context=PORTFOLIO_CONTEXT_FOR_AI
    )

    history.append({"role": "assistant", "content": response})

    # Keep last 20 messages to avoid token overflow
    if len(history) > 20:
        _sessions[sid] = history[-20:]

    return {
        "response": response,
        "provider": ai_service.provider_display,
        "is_real_ai": ai_service.is_real_ai,
        "session_id": sid,
        "disclaimer": "Not SEBI-registered advice. AI insights are probability-based."
    }


@router.get("/history")
async def get_history(session_id: str = _DEFAULT) -> Dict[str, Any]:
    return {"history": _get_history(session_id), "count": len(_get_history(session_id))}


@router.post("/clear")
async def clear_history(session_id: str = _DEFAULT) -> Dict[str, str]:
    _sessions[session_id] = []
    return {"status": "cleared"}


@router.get("/suggestions")
async def get_suggestions() -> List[str]:
    return [
        "Analyse my full portfolio",
        "Am I taking too much risk?",
        "Can I reach ₹1 crore by age 40?",
        "What should I invest in next month?",
        "Should I stop my ABSL PSU SIP?",
        "Tell me about my HDFCMID150 ETF",
        "How do I fix my midcap concentration?",
        "How long until I reach Financial Freedom?",
    ]
