from langchain_google_genai import GoogleGenerativeAIEmbeddings
from config import get_settings

_service = None


def _get_service():
    global _service
    if not _service:
        key = get_settings().gemini_api_key
        _service = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001",
            google_api_key=key
        )
    return _service


def embed_query(text: str) -> list[float]:
    return _get_service().embed_query(text)


def embed_documents(texts: list[str]) -> list[list[float]]:
    return _get_service().embed_documents(texts)
