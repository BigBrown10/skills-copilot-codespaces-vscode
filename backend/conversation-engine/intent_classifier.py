from typing import Tuple
from models.schemas import IntentType
import re


class IntentClassifier:
    """Classifies user intent from message content"""
    
    def __init__(self):
        self.intent_patterns = {
            IntentType.BOOKING: [
                r'\b(book|schedule|appointment|reserve|reservation)\b',
                r'\b(available|availability|free time)\b',
                r'\b(when can|what time)\b',
            ],
            IntentType.SUPPORT: [
                r'\b(help|support|issue|problem|trouble|error)\b',
                r'\b(not working|broken|fix)\b',
                r'\b(how do|how to|how can)\b',
            ],
            IntentType.GREETING: [
                r'\b(hi|hello|hey|greetings|good morning|good afternoon|good evening)\b',
                r'^(hi|hello|hey)$',
            ],
            IntentType.GOODBYE: [
                r'\b(bye|goodbye|see you|thanks bye|thank you bye)\b',
                r'\b(have a good day|take care)\b',
            ],
            IntentType.INFORMATION: [
                r'\b(what is|who is|where is|when is|why is|how is)\b',
                r'\b(tell me about|information about|details about)\b',
                r'\b(price|cost|fee|charge)\b',
            ],
        }
    
    def classify(self, message: str) -> Tuple[IntentType, float]:
        """
        Classify the intent of a message
        Returns: (intent_type, confidence_score)
        """
        message_lower = message.lower()
        
        # Check each intent pattern
        scores = {}
        for intent, patterns in self.intent_patterns.items():
            score = 0
            for pattern in patterns:
                if re.search(pattern, message_lower):
                    score += 1
            if score > 0:
                scores[intent] = score / len(patterns)
        
        # Return intent with highest score
        if scores:
            best_intent = max(scores, key=scores.get)
            confidence = scores[best_intent]
            return best_intent, confidence
        
        # Default to unknown if no patterns match
        return IntentType.UNKNOWN, 0.0
    
    def extract_booking_info(self, message: str) -> dict:
        """Extract booking-related information from message"""
        info = {}
        
        # Extract date patterns (simple examples)
        date_patterns = [
            r'(tomorrow|today|next week|next month)',
            r'(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})',
            r'(monday|tuesday|wednesday|thursday|friday|saturday|sunday)',
        ]
        
        for pattern in date_patterns:
            match = re.search(pattern, message.lower())
            if match:
                info['preferred_date'] = match.group(0)
                break
        
        # Extract time patterns
        time_pattern = r'(\d{1,2}:\d{2}\s*(?:am|pm)?|\d{1,2}\s*(?:am|pm))'
        time_match = re.search(time_pattern, message.lower())
        if time_match:
            info['preferred_time'] = time_match.group(0)
        
        return info
