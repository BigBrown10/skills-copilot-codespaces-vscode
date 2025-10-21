from typing import Dict, Optional
import logging

from utils.gemini_client import GeminiClient

logger = logging.getLogger(__name__)

class BookingService:
    """
    Handles booking-related conversations
    """
    
    def __init__(self):
        self.gemini_client = GeminiClient()
    
    async def handle(self, message: str, context: Optional[Dict] = None) -> str:
        """
        Handle booking requests
        """
        try:
            # Check if we have booking context
            booking_state = self._get_booking_state(context)
            
            prompt = f"""You are a professional booking assistant. Help the customer book an appointment.

Current booking state: {booking_state}
Customer message: {message}

If information is missing, ask for:
1. Service type
2. Preferred date and time
3. Contact information

Once you have all information, confirm the booking details.
Be friendly, professional, and efficient."""

            response = await self.gemini_client.generate(prompt)
            return response
            
        except Exception as e:
            logger.error(f"Error in booking service: {str(e)}")
            return "I'd be happy to help you book an appointment. Could you tell me what service you're interested in?"
    
    def _get_booking_state(self, context: Optional[Dict]) -> str:
        """Extract booking state from context"""
        if not context or "metadata" not in context:
            return "No booking information collected yet"
        
        metadata = context.get("metadata", {})
        return f"Service: {metadata.get('service', 'not specified')}, Date: {metadata.get('date', 'not specified')}"
