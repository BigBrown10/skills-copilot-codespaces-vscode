from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql://postgres:password@localhost:5432/chatbot_platform"
    
    # Redis
    redis_host: str = "localhost"
    redis_port: int = 6379
    redis_password: str = ""
    
    # Google Gemini
    gemini_api_key: str
    gemini_model: str = "gemini-pro"
    
    # API Configuration
    conversation_engine_port: int = 8000
    admin_api_url: str = "http://localhost:4000"
    
    # Application
    debug: bool = False
    
    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    return Settings()
