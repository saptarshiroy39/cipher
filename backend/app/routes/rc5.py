from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse

from app.cipher.rc5.key import generate_key as rc5_generate_key
from app.cipher.rc5.encrypt import encrypt as rc5_encrypt
from app.cipher.rc5.decrypt import decrypt as rc5_decrypt
from app.routes._helpers import read_file


router = APIRouter(prefix="/rc5", tags=["rc5"])


@router.get("/key")
async def rc5_key_route(b: int = 16):
    return {"key": rc5_generate_key(b)}


@router.post("/encrypt")
async def rc5_encrypt_route(
    file: UploadFile = File(...),
    key: str = Form(...),
    w: int = Form(32),
    r: int = Form(12),
):
    content = await read_file(file)
    encrypted = rc5_encrypt(content, key, w, r)
    return JSONResponse(content=encrypted)


@router.post("/decrypt")
async def rc5_decrypt_route(
    file: UploadFile = File(...),
    key: str = Form(...),
    w: int = Form(32),
    r: int = Form(12),
):
    content = await read_file(file)
    decrypted = rc5_decrypt(content, key, w, r)
    return JSONResponse(content=decrypted)
