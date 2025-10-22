from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from enum import Enum


class Intent(str, Enum):
    GREETING = "greeting"
    BOOKING = "booking"
    SUPPORT = "support"
    FAQ = "faq"
    FEEDBACK = "feedback"
    UNKNOWN = "unknown"


class Platform(str, Enum):
    WHATSAPP = "whatsapp"
    TELEGRAM = "telegram"
    WEBCHAT = "webchat"


class ConversationRequest(BaseModel):
    conversation_id: str
    user_id: str
    message: str
    bot_config: Optional[Dict[str, Any]] = None
    metadata: Optional[Dict[str, Any]] = None
    platform: Optional[Platform] = Platform.WHATSAPP


class ConversationResponse(BaseModel):
    conversation_id: str
    response: str
    intent: Optional[Intent] = None
    confidence: Optional[float] = None
    actions: Optional[List[Dict[str, Any]]] = None
    metadata: Optional[Dict[str, Any]] = None


class BookingRequest(BaseModel):
    service: str
    date: str
    time: str
    customer_name: str
    customer_email: Optional[str] = None
    customer_phone: Optional[str] = None
    notes: Optional[str] = None


class BookingResponse(BaseModel):
    booking_id: str
    status: str
    confirmation_message: str
    scheduled_at: str


class ContextData(BaseModel):
    conversation_id: str
    user_id: str
    platform: Platform
    history: List[Dict[str, str]] = Field(default_factory=list)
    intent_history: List[Intent] = Field(default_factory=list)
    booking_data: Optional[Dict[str, Any]] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
