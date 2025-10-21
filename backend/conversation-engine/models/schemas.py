from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class Channel(str, Enum):
    WHATSAPP = "whatsapp"
    TELEGRAM = "telegram"


class IntentType(str, Enum):
    BOOKING = "booking"
    SUPPORT = "support"
    INFORMATION = "information"
    GREETING = "greeting"
    GOODBYE = "goodbye"
    UNKNOWN = "unknown"


class Message(BaseModel):
    role: MessageRole
    content: str
    timestamp: Optional[datetime] = None
    metadata: Optional[Dict[str, Any]] = None


class ConversationRequest(BaseModel):
    conversation_id: str
    user_id: str
    bot_id: str
    channel: Channel
    message: str
    metadata: Optional[Dict[str, Any]] = None


class ConversationResponse(BaseModel):
    conversation_id: str
    response: str
    intent: Optional[IntentType] = None
    confidence: Optional[float] = None
    metadata: Optional[Dict[str, Any]] = None


class BookingRequest(BaseModel):
    customer_name: str
    customer_phone: str
    customer_email: Optional[str] = None
    service_type: str
    preferred_date: str
    preferred_time: Optional[str] = None
    notes: Optional[str] = None


class BookingResponse(BaseModel):
    booking_id: str
    status: str
    scheduled_at: datetime
    confirmation_message: str
