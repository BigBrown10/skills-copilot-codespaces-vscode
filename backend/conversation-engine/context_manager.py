import redis.asyncio as redis
import json
from typing import Optional, Dict, Any, List
import logging

logger = logging.getLogger(__name__)


class ContextManager:
    def __init__(self, host: str = "localhost", port: int = 6379, password: Optional[str] = None):
        """
        Initialize Redis connection for context management
        """
        self.redis = redis.Redis(
            host=host,
            port=port,
            password=password,
            decode_responses=True,
        )
    
    async def ping(self):
        """
        Check Redis connection
        """
        return await self.redis.ping()
    
    async def get_context(self, conversation_id: str) -> Optional[Dict[str, Any]]:
        """
        Get conversation context from Redis
        """
        try:
            context_data = await self.redis.get(f"context:{conversation_id}")
            if context_data:
                return json.loads(context_data)
            return None
        except Exception as e:
            logger.error(f"Error getting context: {e}")
            return None
    
    async def save_context(self, conversation_id: str, context: Dict[str, Any], ttl: int = 86400):
        """
        Save conversation context to Redis with TTL (default 24 hours)
        """
        try:
            await self.redis.setex(
                f"context:{conversation_id}",
                ttl,
                json.dumps(context)
            )
        except Exception as e:
            logger.error(f"Error saving context: {e}")
    
    async def update_context(self, conversation_id: str, updates: Dict[str, Any]):
        """
        Update specific fields in conversation context
        """
        try:
            context = await self.get_context(conversation_id) or {}
            context.update(updates)
            await self.save_context(conversation_id, context)
        except Exception as e:
            logger.error(f"Error updating context: {e}")
    
    async def add_message_to_history(
        self,
        conversation_id: str,
        sender: str,
        content: str,
        intent: Optional[str] = None
    ):
        """
        Add a message to conversation history
        """
        try:
            context = await self.get_context(conversation_id) or {}
            
            if "history" not in context:
                context["history"] = []
            
            context["history"].append({
                "sender": sender,
                "content": content,
                "intent": intent,
            })
            
            # Keep only last 20 messages
            if len(context["history"]) > 20:
                context["history"] = context["history"][-20:]
            
            await self.save_context(conversation_id, context)
        
        except Exception as e:
            logger.error(f"Error adding message to history: {e}")
    
    async def get_conversation_history(self, conversation_id: str) -> List[Dict[str, str]]:
        """
        Get conversation history
        """
        try:
            context = await self.get_context(conversation_id)
            if context and "history" in context:
                return context["history"]
            return []
        except Exception as e:
            logger.error(f"Error getting conversation history: {e}")
            return []
    
    async def clear_context(self, conversation_id: str):
        """
        Clear conversation context
        """
        try:
            await self.redis.delete(f"context:{conversation_id}")
        except Exception as e:
            logger.error(f"Error clearing context: {e}")
    
    async def close(self):
        """
        Close Redis connection
        """
        await self.redis.close()
