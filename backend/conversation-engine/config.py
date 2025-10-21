from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # API Configuration
    app_name: str = "Conversation Engine"
    debug: bool = False
    
    # Database
    database_url: str = "postgresql://postgres:password@localhost:5432/chatbot_platform"
    
    # Redis
    redis_host: str = "localhost"
    redis_port: int = 6379
    redis_password: Optional[str] = None
    
    # OpenAI
    openai_api_key: str
    openai_model: str = "gpt-4-turbo-preview"
    openai_temperature: float = 0.7
    openai_max_tokens: int = 500
    
    # Admin API
    admin_api_url: str = "http://localhost:4000"
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
