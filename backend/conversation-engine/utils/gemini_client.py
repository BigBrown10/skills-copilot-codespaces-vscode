import google.generativeai as genai
from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)


class GeminiClient:
    def __init__(self, api_key: str, model_name: str = "gemini-pro"):
        """
        Initialize Google Gemini client
        """
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel(model_name)
        self.chat_sessions: Dict[str, any] = {}
    
    async def generate_response(
        self,
        prompt: str,
        conversation_id: Optional[str] = None,
        history: Optional[List[Dict[str, str]]] = None,
    ) -> str:
        """
        Generate a response using Gemini
        """
        try:
            if conversation_id and conversation_id in self.chat_sessions:
                # Continue existing chat
                chat = self.chat_sessions[conversation_id]
            else:
                # Start new chat
                chat_history = []
                if history:
                    for msg in history:
                        role = "user" if msg.get("sender") == "user" else "model"
                        chat_history.append({
                            "role": role,
                            "parts": [msg.get("content", "")]
                        })
                
                chat = self.model.start_chat(history=chat_history)
                
                if conversation_id:
                    self.chat_sessions[conversation_id] = chat
            
            # Generate response
            response = chat.send_message(prompt)
            return response.text
        
        except Exception as e:
            logger.error(f"Error generating Gemini response: {e}")
            raise
    
    async def classify_intent(self, message: str) -> Dict[str, any]:
        """
        Classify user intent using Gemini
        """
        prompt = f"""
        Analyze the following message and classify its intent.
        
        Message: "{message}"
        
        Classify into one of these categories:
        - greeting: General greetings or small talk
        - booking: Appointment or service booking requests
        - support: Customer support or help requests
        - faq: Questions about products, services, or policies
        - feedback: Feedback, complaints, or reviews
        - unknown: Cannot determine intent
        
        Respond ONLY with the category name and confidence score (0-1) in this format:
        Category: <category>
        Confidence: <score>
        """
        
        try:
            response = await self.generate_response(prompt)
            
            # Parse response
            lines = response.strip().split('\n')
            intent = "unknown"
            confidence = 0.5
            
            for line in lines:
                if line.startswith("Category:"):
                    intent = line.split(":", 1)[1].strip().lower()
                elif line.startswith("Confidence:"):
                    try:
                        confidence = float(line.split(":", 1)[1].strip())
                    except:
                        confidence = 0.5
            
            return {
                "intent": intent,
                "confidence": confidence
            }
        
        except Exception as e:
            logger.error(f"Error classifying intent: {e}")
            return {
                "intent": "unknown",
                "confidence": 0.0
            }
    
    def clear_session(self, conversation_id: str):
        """
        Clear a chat session
        """
        if conversation_id in self.chat_sessions:
            del self.chat_sessions[conversation_id]
