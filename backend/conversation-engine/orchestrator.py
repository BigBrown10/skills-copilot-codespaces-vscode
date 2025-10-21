from typing import Dict, Optional, Any
import logging

from intent_classifier import IntentClassifier
from services.booking_service import BookingService
from services.support_service import SupportService
from models.schemas import ConversationResponse, Message, Intent
from utils.gemini_client import GeminiClient

logger = logging.getLogger(__name__)

class ConversationOrchestrator:
    """
    Orchestrates conversation flow using Google Gemini and LangChain
    """
    
    def __init__(self):
        self.gemini_client = GeminiClient()
        self.intent_classifier = IntentClassifier()
        self.booking_service = BookingService()
        self.support_service = SupportService()
    
    async def process_message(
        self,
        message: str,
        user_id: str,
        conversation_id: str,
        platform: str,
        context: Optional[Dict[str, Any]] = None
    ) -> ConversationResponse:
        """
        Process incoming message and generate appropriate response
        """
        try:
            # Classify intent
            intent = await self.intent_classifier.classify(message, context)
            logger.info(f"Classified intent: {intent.type} (confidence: {intent.confidence})")
            
            # Route to appropriate service based on intent
            if intent.type == "BOOKING":
                response_text = await self.booking_service.handle(message, context)
            elif intent.type == "SUPPORT":
                response_text = await self.support_service.handle(message, context)
            elif intent.type == "INQUIRY":
                response_text = await self._handle_inquiry(message, context)
            else:
                response_text = await self._handle_general(message, context)
            
            return ConversationResponse(
                message=Message(
                    sender="bot",
                    content=response_text,
                ),
                intent=intent,
                conversation_id=conversation_id,
                requires_human=intent.confidence < 0.6,
                metadata={
                    "platform": platform,
                    "user_id": user_id,
                }
            )
            
        except Exception as e:
            logger.error(f"Error in orchestrator: {str(e)}")
            return ConversationResponse(
                message=Message(
                    sender="bot",
                    content="I apologize, but I'm having trouble understanding. Could you please rephrase that?",
                ),
                intent=Intent(type="UNKNOWN", confidence=0.0),
                conversation_id=conversation_id,
                requires_human=True,
            )
    
    async def _handle_inquiry(self, message: str, context: Optional[Dict]) -> str:
        """Handle general inquiries"""
        prompt = f"""You are a helpful business assistant. Answer the following customer inquiry professionally and concisely:

Customer Question: {message}

Provide a helpful, accurate response."""

        return await self.gemini_client.generate(prompt)
    
    async def _handle_general(self, message: str, context: Optional[Dict]) -> str:
        """Handle general conversation"""
        prompt = f"""You are a friendly business chatbot. Respond to the following message naturally:

Customer: {message}

Respond in a warm, professional manner."""

        return await self.gemini_client.generate(prompt)
