import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Amplify API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./amplify.db")
    SECRET_KEY: str = "amplify-hackathon-super-secret-jwt-key-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    REACH_MULTIPLIER: int = 27  # $1 = 27 impressions

    def get_jwt_secret(self) -> str:
        raw = os.getenv("SECRET_KEY") or self.SECRET_KEY
        if not raw or not str(raw).strip():
            return "amplify-hackathon-super-secret-jwt-key-2026"
        return str(raw).strip()

settings = Settings()
