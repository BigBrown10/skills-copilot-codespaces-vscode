from typing import Dict, Any
import logging
from models.schemas import Intent

logger = logging.getLogger(__name__)


class IntentClassifier:
    def __init__(self, gemini_client):
        """
        Initialize intent classifier with Gemini client
        """
        self.gemini_client = gemini_client
        
        # Intent keywords for quick classification
        self.intent_keywords = {
            Intent.GREETING: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening"],
            Intent.BOOKING: ["book", "appointment", "schedule", "reserve", "availability", "available"],
            Intent.SUPPORT: ["help", "issue", "problem", "support", "assist", "trouble"],
            Intent.FAQ: ["what", "how", "why", "when", "where", "who", "explain", "tell me"],
            Intent.FEEDBACK: ["feedback", "review", "complaint", "suggestion", "satisfied", "happy", "unhappy"],
        }
    
    async def classify(self, message: str) -> Dict[str, Any]:
        """
        Classify user message intent
        First tries keyword matching, then falls back to Gemini
        """
        message_lower = message.lower()
        
        # Quick keyword-based classification
        for intent, keywords in self.intent_keywords.items():
            if any(keyword in message_lower for keyword in keywords):
                return {
                    "intent": intent,
                    "confidence": 0.85,
                    "method": "keyword"
                }
        
        # Use Gemini for complex classification
        try:
            result = await self.gemini_client.classify_intent(message)
            intent_str = result.get("intent", "unknown")
            
            # Map to Intent enum
            try:
                intent = Intent(intent_str)
            except ValueError:
                intent = Intent.UNKNOWN
            
            return {
                "intent": intent,
                "confidence": result.get("confidence", 0.5),
                "method": "gemini"
            }
        
        except Exception as e:
            logger.error(f"Error in intent classification: {e}")
            return {
                "intent": Intent.UNKNOWN,
                "confidence": 0.0,
                "method": "error"
            }
    
    async def extract_booking_details(self, message: str, history: list) -> Dict[str, Any]:
        """
        Extract booking details from conversation
        """
        try:
            prompt = f"""
            Extract booking information from this conversation:
            
            History:
            {self._format_history(history)}
            
            Latest message: "{message}"
            
            Extract these details if present:
            - Service: What service is being booked
            - Date: Preferred date
            - Time: Preferred time
            - Customer name
            - Customer email
            - Customer phone
            
            Respond in JSON format with only the fields that were mentioned.
            """
            
            response = await self.gemini_client.generate_response(prompt)
            
            # Parse JSON response
            import json
            try:
                details = json.loads(response)
                return details
            except:
                return {}
        
        except Exception as e:
            logger.error(f"Error extracting booking details: {e}")
            return {}
    
    def _format_history(self, history: list) -> str:
        """
        Format conversation history for prompts
        """
        formatted = []
        for msg in history[-5:]:  # Last 5 messages
            sender = msg.get("sender", "unknown")
            content = msg.get("content", "")
            formatted.append(f"{sender}: {content}")
        return "\n".join(formatted)
