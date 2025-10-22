from typing import Dict, Any, Optional
import logging
from models.schemas import ConversationResponse, Intent
from utils.gemini_client import GeminiClient
from intent_classifier import IntentClassifier
from context_manager import ContextManager
from services.booking_service import BookingService
from services.support_service import SupportService

logger = logging.getLogger(__name__)


class ConversationOrchestrator:
    def __init__(self, gemini_api_key: str, context_manager: ContextManager):
        """
        Initialize the conversation orchestrator with Google Gemini
        """
        self.gemini_client = GeminiClient(api_key=gemini_api_key)
        self.context_manager = context_manager
        self.intent_classifier = IntentClassifier(self.gemini_client)
        self.booking_service = BookingService()
        self.support_service = SupportService()
    
    async def process_message(
        self,
        conversation_id: str,
        user_id: str,
        message: str,
        bot_config: Optional[Dict[str, Any]] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> ConversationResponse:
        """
        Main orchestration method to process incoming messages
        """
        try:
            # Get conversation context and history
            history = await self.context_manager.get_conversation_history(conversation_id)
            
            # Save user message to history
            await self.context_manager.add_message_to_history(
                conversation_id, "user", message
            )
            
            # Classify intent
            intent_result = await self.intent_classifier.classify(message)
            intent = intent_result["intent"]
            confidence = intent_result["confidence"]
            
            logger.info(f"Classified intent: {intent} (confidence: {confidence})")
            
            # Generate contextual system prompt
            system_prompt = self._build_system_prompt(bot_config, intent, history)
            
            # Generate response based on intent
            if intent == Intent.BOOKING:
                response_text = await self._handle_booking(
                    conversation_id, message, history, system_prompt
                )
            elif intent == Intent.SUPPORT:
                response_text = await self._handle_support(
                    conversation_id, message, history, system_prompt
                )
            else:
                # General conversation using Gemini
                full_prompt = f"{system_prompt}\n\nUser: {message}\nAssistant:"
                response_text = await self.gemini_client.generate_response(
                    full_prompt,
                    conversation_id=conversation_id,
                    history=history
                )
            
            # Save bot response to history
            await self.context_manager.add_message_to_history(
                conversation_id, "bot", response_text, str(intent)
            )
            
            return ConversationResponse(
                conversation_id=conversation_id,
                response=response_text,
                intent=intent,
                confidence=confidence,
                metadata=metadata or {}
            )
        
        except Exception as e:
            logger.error(f"Error in conversation orchestration: {e}")
            return ConversationResponse(
                conversation_id=conversation_id,
                response="I apologize, but I'm having trouble processing your request. Could you please try again?",
                intent=Intent.UNKNOWN,
                confidence=0.0
            )
    
    def _build_system_prompt(
        self,
        bot_config: Optional[Dict[str, Any]],
        intent: Intent,
        history: list
    ) -> str:
        """
        Build a system prompt based on bot configuration and context
        """
        base_prompt = """You are a helpful AI assistant for a business chatbot platform. 
You help customers with bookings, support inquiries, and general questions.
Be professional, friendly, and concise in your responses."""
        
        if bot_config:
            business_name = bot_config.get("business_name", "our business")
            services = bot_config.get("services", [])
            
            base_prompt += f"\n\nYou are representing {business_name}."
            
            if services:
                base_prompt += f"\nServices available: {', '.join(services)}"
        
        # Intent-specific instructions
        if intent == Intent.BOOKING:
            base_prompt += "\n\nYou are helping the user book an appointment. Ask for necessary details like service, date, time, and contact information."
        elif intent == Intent.SUPPORT:
            base_prompt += "\n\nYou are providing customer support. Be empathetic and try to resolve their issue."
        elif intent == Intent.GREETING:
            base_prompt += "\n\nGreet the user warmly and ask how you can help them today."
        
        return base_prompt
    
    async def _handle_booking(
        self,
        conversation_id: str,
        message: str,
        history: list,
        system_prompt: str
    ) -> str:
        """
        Handle booking-related conversations
        """
        # Extract booking details
        booking_details = await self.intent_classifier.extract_booking_details(message, history)
        
        # Save booking details to context
        if booking_details:
            await self.context_manager.update_context(
                conversation_id,
                {"booking_data": booking_details}
            )
        
        # Get current context
        context = await self.context_manager.get_context(conversation_id)
        current_booking = context.get("booking_data", {}) if context else {}
        
        # Check if we have all required information
        required_fields = ["service", "date", "time", "customer_name"]
        missing_fields = [f for f in required_fields if f not in current_booking]
        
        if missing_fields:
            # Ask for missing information
            prompt = f"""{system_prompt}

Current booking information: {current_booking}
Missing: {', '.join(missing_fields)}

User message: {message}

Guide the user to provide the missing information naturally."""
            
            return await self.gemini_client.generate_response(
                prompt,
                conversation_id=conversation_id,
                history=history
            )
        else:
            # All information collected, confirm booking
            confirmation = await self.booking_service.create_booking(
                conversation_id,
                current_booking
            )
            return confirmation
    
    async def _handle_support(
        self,
        conversation_id: str,
        message: str,
        history: list,
        system_prompt: str
    ) -> str:
        """
        Handle support-related conversations
        """
        # Analyze support issue
        issue_analysis = await self.support_service.analyze_issue(message)
        
        # Generate helpful response
        prompt = f"""{system_prompt}

Support issue category: {issue_analysis.get('category', 'general')}
Severity: {issue_analysis.get('severity', 'low')}

User message: {message}

Provide a helpful and empathetic response."""
        
        return await self.gemini_client.generate_response(
            prompt,
            conversation_id=conversation_id,
            history=history
        )
