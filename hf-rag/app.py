from fastapi import FastAPI, File, UploadFile, Header, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import uuid
from datetime import datetime

from models import (
    QueryRequest, QueryResponse, UploadResponse,
    GenerateKeyRequest, APIKeyResponse, ValidateKeyResponse
)
from read.pdf import read_pdf
from read.filetype import get_type
from read.text import read_json, read_text
from process.chunker import chunk
from rag.rag import ask, ingest
from storage.pinecone_db import get_stats


API_KEYS = {}

app = FastAPI(title="RAG API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth
def get_tenant(x_api_key: str = Header(...)) -> dict:
    if x_api_key not in API_KEYS:
        raise HTTPException(401, "Invalid API key")
    return API_KEYS[x_api_key]


@app.get("/")
def health():
    return {"status": "ok"}


@app.post("/api-key/generate", response_model=APIKeyResponse)
def generate_key(req: GenerateKeyRequest):
    api_key = f"sk-{uuid.uuid4().hex}"
    tenant_id = f"tenant-{uuid.uuid4().hex[:12]}"
    
    API_KEYS[api_key] = {
        "tenant_id": tenant_id,
        "company_name": req.company_name,
        "email": req.email,
        "created_at": datetime.utcnow().isoformat()
    }
    
    return APIKeyResponse(api_key=api_key, tenant_id=tenant_id)


@app.post("/api-key/validate", response_model=ValidateKeyResponse)
def validate_key(x_api_key: str = Header(...)):
    if x_api_key not in API_KEYS:
        return ValidateKeyResponse(valid=False)
    
    info = API_KEYS[x_api_key]
    return ValidateKeyResponse(
        valid=True,
        tenant_id=info["tenant_id"],
        company_name=info["company_name"]
    )


@app.post("/upload", response_model=UploadResponse)
async def upload(file: UploadFile = File(...), tenant: dict = Depends(get_tenant)):
    fname = file.filename
    ftype = get_type(fname)
    
    if ftype == "unknown":
        raise HTTPException(400, f"Unsupported file type: {fname}")
    
    content = await file.read()
    
    if ftype == "pdf":
        text = read_pdf(content, fname)
    elif fname.endswith(".json"):
        text = read_json(content, fname)
    else:
        text = read_text(content, fname)
    
    if not text:
        raise HTTPException(400, "Could not extract text from file")
    
    chunks = chunk(text)
    count = ingest(chunks, tenant["tenant_id"])
    
    return UploadResponse(status="success", message=f"Processed {fname}", chunks=count)


@app.post("/query", response_model=QueryResponse)
def query(req: QueryRequest, tenant: dict = Depends(get_tenant)):
    result = ask(req.question, tenant["tenant_id"])
    return QueryResponse(answer=result["answer"], sources=[])


@app.get("/stats")
def stats(tenant: dict = Depends(get_tenant)):
    return get_stats(tenant["tenant_id"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
