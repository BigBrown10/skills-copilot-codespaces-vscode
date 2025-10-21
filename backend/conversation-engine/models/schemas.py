from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime

class Message(BaseModel):
    """Message model"""
    sender: str
    content: str
    timestamp: Optional[datetime] = Field(default_factory=datetime.now)

class Intent(BaseModel):
    """Intent classification result"""
    type: str  # BOOKING, SUPPORT, INQUIRY, OTHER
    confidence: float
    entities: Optional[Dict[str, Any]] = {}

class ConversationRequest(BaseModel):
    """Incoming conversation request"""
    message: str
    user_id: str
    conversation_id: str
    platform: str  # whatsapp, telegram
    metadata: Optional[Dict[str, Any]] = {}

class ConversationResponse(BaseModel):
    """Conversation response"""
    message: Message
    intent: Intent
    conversation_id: str
    requires_human: bool = False
    metadata: Optional[Dict[str, Any]] = {}
