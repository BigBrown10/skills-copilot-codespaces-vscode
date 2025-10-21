from typing import Dict, Optional
import logging

from models.schemas import Intent
from utils.gemini_client import GeminiClient

logger = logging.getLogger(__name__)

class IntentClassifier:
    """
    Classifies user intent using Google Gemini
    """
    
    def __init__(self):
        self.gemini_client = GeminiClient()
    
    async def classify(self, message: str, context: Optional[Dict] = None) -> Intent:
        """
        Classify the intent of a user message
        
        Returns:
            Intent object with type and confidence
        """
        try:
            prompt = f"""Classify the following customer message into one of these intents:
- BOOKING: Customer wants to book an appointment or make a reservation
- SUPPORT: Customer needs help or has a problem
- INQUIRY: Customer is asking for information
- OTHER: General conversation or unclear intent

Message: "{message}"

Respond with just the intent name (BOOKING, SUPPORT, INQUIRY, or OTHER) and confidence score (0.0-1.0) in format: INTENT:CONFIDENCE
Example: BOOKING:0.95"""

            response = await self.gemini_client.generate(prompt)
            
            # Parse response
            parts = response.strip().split(':')
            if len(parts) == 2:
                intent_type = parts[0].strip().upper()
                confidence = float(parts[1].strip())
            else:
                intent_type = "OTHER"
                confidence = 0.5
            
            # Validate intent type
            valid_intents = ["BOOKING", "SUPPORT", "INQUIRY", "OTHER"]
            if intent_type not in valid_intents:
                intent_type = "OTHER"
                confidence = 0.5
            
            return Intent(
                type=intent_type,
                confidence=confidence,
                entities=self._extract_entities(message)
            )
            
        except Exception as e:
            logger.error(f"Error classifying intent: {str(e)}")
            return Intent(type="OTHER", confidence=0.0)
    
    def _extract_entities(self, message: str) -> Dict:
        """Extract entities from message (placeholder)"""
        # This could be enhanced with NER using Gemini or other tools
        return {}
