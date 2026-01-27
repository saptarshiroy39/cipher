from pydantic import BaseModel


class QueryRequest(BaseModel):
    question: str


class QueryResponse(BaseModel):
    answer: str
    sources: list[str] = []


class UploadResponse(BaseModel):
    status: str
    message: str
    chunks: int


class GenerateKeyRequest(BaseModel):
    company_name: str
    email: str


class APIKeyResponse(BaseModel):
    api_key: str
    tenant_id: str


class ValidateKeyResponse(BaseModel):
    valid: bool
    tenant_id: str = None
    company_name: str = None
