from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    gemini_api_key: str = ""
    pinecone_api_key: str = ""
    pinecone_index_name: str = "rag-index"
    
    class Config:
        env_file = ".env"


@lru_cache()
def get_settings():
    return Settings()
