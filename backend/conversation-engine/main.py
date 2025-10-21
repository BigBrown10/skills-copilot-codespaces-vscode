from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from config import settings
from models.schemas import (
    ConversationRequest,
    ConversationResponse,
    BookingRequest,
    BookingResponse,
)
from orchestrator import ConversationOrchestrator


# Initialize orchestrator
orchestrator = ConversationOrchestrator()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print(f"Starting {settings.app_name}")
    yield
    # Shutdown
    print("Shutting down...")


app = FastAPI(
    title=settings.app_name,
    description="Conversation Engine for B2B Chatbot Platform using LangChain and GPT-4",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "message": "Conversation Engine API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy"}


@app.post("/conversation", response_model=ConversationResponse)
async def process_conversation(request: ConversationRequest):
    """
    Process a conversation message and generate a response
    """
    try:
        response = orchestrator.process_message(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/booking", response_model=BookingResponse)
async def create_booking(request: BookingRequest):
    """
    Create a new booking
    """
    try:
        booking = orchestrator.create_booking(request.dict())
        
        return BookingResponse(
            booking_id=booking["id"],
            status=booking["status"],
            scheduled_at=booking["scheduled_at"],
            confirmation_message=f"Your booking has been confirmed for {booking['scheduled_at']}"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/conversation/{conversation_id}/summary")
async def get_conversation_summary(conversation_id: str):
    """
    Get a summary of the conversation
    """
    try:
        summary = orchestrator.get_conversation_summary(conversation_id)
        return {"conversation_id": conversation_id, "summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/conversation/{conversation_id}/context")
async def clear_context(conversation_id: str):
    """
    Clear conversation context
    """
    try:
        orchestrator.context_manager.clear_context(conversation_id)
        return {"message": "Context cleared successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(settings.conversation_engine_port) if hasattr(settings, 'conversation_engine_port') else 8000,
        reload=settings.debug
    )
