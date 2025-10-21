import google.generativeai as genai
from typing import Optional
import logging
import asyncio
from functools import wraps

from config import settings

logger = logging.getLogger(__name__)

def retry_on_failure(max_retries=3, delay=1):
    """Decorator for retrying failed API calls"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            for attempt in range(max_retries):
                try:
                    return await func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_retries - 1:
                        raise
                    logger.warning(f"Attempt {attempt + 1} failed: {str(e)}. Retrying...")
                    await asyncio.sleep(delay * (attempt + 1))
            return None
        return wrapper
    return decorator

class GeminiClient:
    """
    Wrapper for Google Gemini API with retry logic
    """
    
    def __init__(self):
        genai.configure(api_key=settings.GOOGLE_GEMINI_API_KEY)
        self.model = genai.GenerativeModel(settings.GEMINI_MODEL)
        self.generation_config = {
            "temperature": 0.7,
            "top_p": 0.95,
            "top_k": 40,
            "max_output_tokens": 1024,
        }
    
    @retry_on_failure(max_retries=3, delay=1)
    async def generate(self, prompt: str) -> str:
        """
        Generate response using Gemini API
        
        Args:
            prompt: Input prompt
            
        Returns:
            Generated text response
        """
        try:
            # Run sync API in thread pool
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: self.model.generate_content(
                    prompt,
                    generation_config=self.generation_config
                )
            )
            
            if response.text:
                return response.text
            else:
                logger.error("Empty response from Gemini API")
                return "I apologize, but I couldn't generate a response. Please try again."
                
        except Exception as e:
            logger.error(f"Error calling Gemini API: {str(e)}")
            raise
    
    async def generate_with_context(
        self,
        prompt: str,
        context: Optional[str] = None
    ) -> str:
        """
        Generate response with conversation context
        """
        if context:
            full_prompt = f"{context}\n\n{prompt}"
        else:
            full_prompt = prompt
        
        return await self.generate(full_prompt)
