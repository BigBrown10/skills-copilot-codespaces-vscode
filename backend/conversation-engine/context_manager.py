import redis
import json
from typing import List, Dict, Any, Optional
from config import settings


class ContextManager:
    """Manages conversation context using Redis"""
    
    def __init__(self):
        self.redis_client = redis.Redis(
            host=settings.redis_host,
            port=settings.redis_port,
            password=settings.redis_password,
            decode_responses=True
        )
        self.context_ttl = 3600  # 1 hour
    
    def get_context(self, conversation_id: str) -> List[Dict[str, Any]]:
        """Retrieve conversation context from Redis"""
        key = f"context:{conversation_id}"
        context_data = self.redis_client.get(key)
        
        if context_data:
            return json.loads(context_data)
        return []
    
    def save_context(self, conversation_id: str, messages: List[Dict[str, Any]]) -> None:
        """Save conversation context to Redis"""
        key = f"context:{conversation_id}"
        self.redis_client.setex(
            key,
            self.context_ttl,
            json.dumps(messages)
        )
    
    def add_message(self, conversation_id: str, role: str, content: str) -> None:
        """Add a message to the conversation context"""
        context = self.get_context(conversation_id)
        context.append({
            "role": role,
            "content": content
        })
        
        # Keep only last 10 messages for context
        if len(context) > 10:
            context = context[-10:]
        
        self.save_context(conversation_id, context)
    
    def clear_context(self, conversation_id: str) -> None:
        """Clear conversation context"""
        key = f"context:{conversation_id}"
        self.redis_client.delete(key)
    
    def get_user_data(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve user data from Redis"""
        key = f"user:{user_id}"
        user_data = self.redis_client.get(key)
        
        if user_data:
            return json.loads(user_data)
        return None
    
    def save_user_data(self, user_id: str, data: Dict[str, Any]) -> None:
        """Save user data to Redis"""
        key = f"user:{user_id}"
        self.redis_client.setex(
            key,
            86400,  # 24 hours
            json.dumps(data)
        )
