import redis.asyncio as redis
from typing import Dict, Optional, Any
import json
import logging

from config import settings

logger = logging.getLogger(__name__)

class ContextManager:
    """
    Manages conversation context using Redis
    """
    
    def __init__(self):
        self.redis_client = None
        self.ttl = 3600 * 24  # 24 hours
    
    async def _get_client(self):
        """Get or create Redis client"""
        if self.redis_client is None:
            self.redis_client = redis.Redis(
                host=settings.REDIS_HOST,
                port=settings.REDIS_PORT,
                password=settings.REDIS_PASSWORD,
                decode_responses=True
            )
        return self.redis_client
    
    async def get_context(self, conversation_id: str) -> Optional[Dict[str, Any]]:
        """Get conversation context from Redis"""
        try:
            client = await self._get_client()
            key = f"context:{conversation_id}"
            data = await client.get(key)
            
            if data:
                return json.loads(data)
            return None
            
        except Exception as e:
            logger.error(f"Error getting context: {str(e)}")
            return None
    
    async def update_context(
        self,
        conversation_id: str,
        user_message: str,
        bot_response: Any
    ):
        """Update conversation context"""
        try:
            client = await self._get_client()
            key = f"context:{conversation_id}"
            
            # Get existing context
            context = await self.get_context(conversation_id) or {
                "messages": [],
                "metadata": {}
            }
            
            # Add new messages
            context["messages"].append({
                "sender": "user",
                "content": user_message
            })
            context["messages"].append({
                "sender": "bot",
                "content": bot_response.message.content
            })
            
            # Keep only last 10 messages
            context["messages"] = context["messages"][-10:]
            
            # Update metadata
            if hasattr(bot_response, "intent"):
                context["metadata"]["last_intent"] = bot_response.intent.type
            
            # Save to Redis
            await client.setex(
                key,
                self.ttl,
                json.dumps(context)
            )
            
        except Exception as e:
            logger.error(f"Error updating context: {str(e)}")
    
    async def clear_context(self, conversation_id: str):
        """Clear conversation context"""
        try:
            client = await self._get_client()
            key = f"context:{conversation_id}"
            await client.delete(key)
        except Exception as e:
            logger.error(f"Error clearing context: {str(e)}")
