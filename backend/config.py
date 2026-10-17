import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Amplify API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Defaults to SQLite for immediate out-of-the-box local operation,
    # or takes PostgreSQL connection string via DATABASE_URL environment variable
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./amplify.db")
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "amplify-hackathon-super-secret-jwt-key-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    REACH_MULTIPLIER: int = 27  # $1 = 27 impressions

    class Config:
        env_file = ".env"

settings = Settings()
