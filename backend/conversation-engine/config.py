from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    # Google Gemini
    GOOGLE_GEMINI_API_KEY: str
    GEMINI_MODEL: str = "gemini-pro"
    
    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_PASSWORD: Optional[str] = None
    
    # Database
    DATABASE_URL: Optional[str] = None
    
    # API Configuration
    PORT: int = 8000
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
