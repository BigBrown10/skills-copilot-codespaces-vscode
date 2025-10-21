from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging

from config import settings
from orchestrator import ConversationOrchestrator
from models.schemas import ConversationRequest, ConversationResponse
from context_manager import ContextManager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Conversation Engine",
    description="AI-powered conversation engine using Google Gemini",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
orchestrator = ConversationOrchestrator()
context_manager = ContextManager()

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "conversation-engine",
        "version": "1.0.0"
    }

@app.post("/conversation", response_model=ConversationResponse)
async def process_conversation(request: ConversationRequest):
    """
    Process a conversation message and generate AI response
    """
    try:
        logger.info(f"Processing conversation for user: {request.user_id}")
        
        # Get conversation context
        context = await context_manager.get_context(request.conversation_id)
        
        # Process message through orchestrator
        response = await orchestrator.process_message(
            message=request.message,
            user_id=request.user_id,
            conversation_id=request.conversation_id,
            platform=request.platform,
            context=context
        )
        
        # Update context
        await context_manager.update_context(
            request.conversation_id,
            request.message,
            response
        )
        
        return response
        
    except Exception as e:
        logger.error(f"Error processing conversation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/conversation/{conversation_id}")
async def clear_context(conversation_id: str):
    """Clear conversation context"""
    try:
        await context_manager.clear_context(conversation_id)
        return {"message": "Context cleared successfully"}
    except Exception as e:
        logger.error(f"Error clearing context: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
