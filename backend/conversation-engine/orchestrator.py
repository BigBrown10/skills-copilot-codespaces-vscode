from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage, AIMessage, SystemMessage
from typing import Dict, Any, List
from config import settings
from context_manager import ContextManager
from intent_classifier import IntentClassifier
from services.booking_service import BookingService
from services.support_service import SupportService
from models.schemas import IntentType, ConversationRequest, ConversationResponse


class ConversationOrchestrator:
    """Orchestrates conversation flow using LangChain and GPT-4"""
    
    def __init__(self):
        self.llm = ChatOpenAI(
            model=settings.openai_model,
            temperature=settings.openai_temperature,
            max_tokens=settings.openai_max_tokens,
            openai_api_key=settings.openai_api_key
        )
        self.context_manager = ContextManager()
        self.intent_classifier = IntentClassifier()
        self.booking_service = BookingService()
        self.support_service = SupportService()
    
    def get_system_prompt(self, bot_config: Dict[str, Any]) -> str:
        """Generate system prompt based on bot configuration"""
        default_prompt = """You are a helpful AI assistant for a business. 
        You can help with:
        - Booking appointments and reservations
        - Answering customer support questions
        - Providing information about services
        
        Be friendly, professional, and concise in your responses.
        Always ask clarifying questions when needed."""
        
        return bot_config.get("system_prompt", default_prompt)
    
    def process_message(self, request: ConversationRequest) -> ConversationResponse:
        """Process an incoming message and generate a response"""
        
        # Classify intent
        intent, confidence = self.intent_classifier.classify(request.message)
        
        # Get conversation context
        context = self.context_manager.get_context(request.conversation_id)
        
        # Build messages for LLM
        messages = self._build_messages(request, context, intent)
        
        # Generate response
        response = self.llm.invoke(messages)
        response_text = response.content
        
        # Handle specific intents
        if intent == IntentType.BOOKING:
            response_text = self._handle_booking(request, response_text)
        elif intent == IntentType.SUPPORT:
            response_text = self._handle_support(request, response_text)
        
        # Save to context
        self.context_manager.add_message(
            request.conversation_id,
            "user",
            request.message
        )
        self.context_manager.add_message(
            request.conversation_id,
            "assistant",
            response_text
        )
        
        return ConversationResponse(
            conversation_id=request.conversation_id,
            response=response_text,
            intent=intent,
            confidence=confidence,
            metadata={"bot_id": request.bot_id}
        )
    
    def _build_messages(
        self,
        request: ConversationRequest,
        context: List[Dict[str, str]],
        intent: IntentType
    ) -> List:
        """Build message list for LLM"""
        
        # System message
        system_prompt = self.get_system_prompt(request.metadata or {})
        messages = [SystemMessage(content=system_prompt)]
        
        # Add context
        for msg in context:
            if msg["role"] == "user":
                messages.append(HumanMessage(content=msg["content"]))
            else:
                messages.append(AIMessage(content=msg["content"]))
        
        # Add current message
        messages.append(HumanMessage(content=request.message))
        
        return messages
    
    def _handle_booking(self, request: ConversationRequest, response: str) -> str:
        """Handle booking-related logic"""
        # Extract booking information from the conversation
        booking_info = self.intent_classifier.extract_booking_info(request.message)
        
        if booking_info:
            # Check availability
            available = self.booking_service.check_availability(
                booking_info.get("preferred_date", ""),
                booking_info.get("preferred_time")
            )
            
            if available:
                response += "\n\nGreat! That time slot is available. To confirm your booking, I'll need your name and phone number."
            else:
                slots = self.booking_service.get_available_slots(
                    booking_info.get("preferred_date", "")
                )
                response += f"\n\nThat slot isn't available, but I have these times open: {', '.join(slots[:3])}"
        
        return response
    
    def _handle_support(self, request: ConversationRequest, response: str) -> str:
        """Handle support-related logic"""
        # Search knowledge base
        kb_answer = self.support_service.search_knowledge_base(request.message)
        
        if kb_answer:
            response = kb_answer + "\n\n" + response
        
        return response
    
    def create_booking(self, booking_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a booking from extracted data"""
        return self.booking_service.create_booking(**booking_data)
    
    def get_conversation_summary(self, conversation_id: str) -> str:
        """Generate a summary of the conversation"""
        context = self.context_manager.get_context(conversation_id)
        
        if not context:
            return "No conversation history found."
        
        # Use LLM to summarize
        summary_prompt = f"""Summarize the following conversation in 2-3 sentences:

{chr(10).join([f"{msg['role']}: {msg['content']}" for msg in context])}

Summary:"""
        
        messages = [HumanMessage(content=summary_prompt)]
        response = self.llm.invoke(messages)
        
        return response.content
