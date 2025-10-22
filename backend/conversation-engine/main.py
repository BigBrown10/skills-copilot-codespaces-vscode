from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import logging

from config import get_settings
from orchestrator import ConversationOrchestrator
from context_manager import ContextManager
from models.schemas import ConversationRequest, ConversationResponse

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()

app = FastAPI(
    title="B2B Chatbot Conversation Engine",
    description="AI-powered conversation engine using Google Gemini",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
context_manager = ContextManager(
    host=settings.redis_host,
    port=settings.redis_port,
    password=settings.redis_password or None,
)

orchestrator = ConversationOrchestrator(
    gemini_api_key=settings.gemini_api_key,
    context_manager=context_manager,
)


@app.get("/")
async def root():
    return {
        "service": "Conversation Engine",
        "status": "running",
        "version": "1.0.0",
    }


@app.get("/health")
async def health_check():
    try:
        # Check Redis connection
        await context_manager.ping()
        return {
            "status": "healthy",
            "redis": "connected",
            "gemini": "configured",
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=503, detail="Service unhealthy")


@app.post("/conversation", response_model=ConversationResponse)
async def process_conversation(request: ConversationRequest):
    """
    Process a conversation message using Google Gemini AI
    """
    try:
        logger.info(f"Processing message from user {request.user_id} in conversation {request.conversation_id}")
        
        response = await orchestrator.process_message(
            conversation_id=request.conversation_id,
            user_id=request.user_id,
            message=request.message,
            bot_config=request.bot_config,
            metadata=request.metadata,
        )
        
        return response
    
    except Exception as e:
        logger.error(f"Error processing conversation: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/conversation/{conversation_id}/end")
async def end_conversation(conversation_id: str):
    """
    End a conversation and clean up context
    """
    try:
        await context_manager.clear_context(conversation_id)
        return {"message": "Conversation ended successfully"}
    except Exception as e:
        logger.error(f"Error ending conversation: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/conversation/{conversation_id}/context")
async def get_conversation_context(conversation_id: str):
    """
    Get conversation context from Redis
    """
    try:
        context = await context_manager.get_context(conversation_id)
        return {"conversation_id": conversation_id, "context": context}
    except Exception as e:
        logger.error(f"Error getting context: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.conversation_engine_port,
        reload=settings.debug,
    )
