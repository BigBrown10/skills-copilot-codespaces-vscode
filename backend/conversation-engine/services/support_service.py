from typing import Dict, Optional
import logging

from utils.gemini_client import GeminiClient

logger = logging.getLogger(__name__)

class SupportService:
    """
    Handles customer support conversations
    """
    
    def __init__(self):
        self.gemini_client = GeminiClient()
        self.faq_database = self._load_faq()
    
    async def handle(self, message: str, context: Optional[Dict] = None) -> str:
        """
        Handle support requests
        """
        try:
            # Try to match FAQ
            faq_answer = self._match_faq(message)
            
            if faq_answer:
                return faq_answer
            
            # Use Gemini for complex support queries
            prompt = f"""You are a helpful customer support assistant. Address the following customer issue professionally:

Customer Issue: {message}

Provide a clear, helpful solution. If you cannot resolve the issue, suggest escalating to a human agent."""

            response = await self.gemini_client.generate(prompt)
            
            # Check if escalation is needed
            if self._requires_escalation(message):
                response += "\n\nWould you like me to connect you with a human support agent?"
            
            return response
            
        except Exception as e:
            logger.error(f"Error in support service: {str(e)}")
            return "I apologize for the inconvenience. Let me connect you with a human support agent who can better assist you."
    
    def _load_faq(self) -> Dict[str, str]:
        """Load FAQ database"""
        return {
            "hours": "Our business hours are Monday-Friday 9AM-6PM, Saturday 10AM-4PM.",
            "location": "We're located at 123 Main Street, Downtown.",
            "contact": "You can reach us at support@example.com or call (555) 123-4567.",
            "refund": "We offer a 30-day money-back guarantee on all services.",
        }
    
    def _match_faq(self, message: str) -> Optional[str]:
        """Match message to FAQ"""
        message_lower = message.lower()
        
        if any(word in message_lower for word in ["hours", "open", "close"]):
            return self.faq_database["hours"]
        elif any(word in message_lower for word in ["location", "address", "where"]):
            return self.faq_database["location"]
        elif any(word in message_lower for word in ["contact", "phone", "email"]):
            return self.faq_database["contact"]
        elif any(word in message_lower for word in ["refund", "money back", "return"]):
            return self.faq_database["refund"]
        
        return None
    
    def _requires_escalation(self, message: str) -> bool:
        """Check if issue requires human escalation"""
        escalation_keywords = ["manager", "complaint", "legal", "lawyer", "sue", "angry", "furious"]
        return any(keyword in message.lower() for keyword in escalation_keywords)
