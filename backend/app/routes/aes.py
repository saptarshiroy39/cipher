from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse

from app.cipher.aes.key import generate_key as aes_generate_key
from app.cipher.aes.encrypt import encrypt as aes_encrypt
from app.cipher.aes.decrypt import decrypt as aes_decrypt
from app.routes._helpers import read_file


router = APIRouter(prefix="/aes", tags=["aes"])


@router.get("/key")
async def aes_key_route(bits: int = 128):
    return {"key": aes_generate_key(bits)}


@router.post("/encrypt")
async def aes_encrypt_route(file: UploadFile = File(...), key: str = Form(...)):
    content = await read_file(file)
    encrypted = aes_encrypt(content, key)
    return JSONResponse(content=encrypted)


@router.post("/decrypt")
async def aes_decrypt_route(file: UploadFile = File(...), key: str = Form(...)):
    content = await read_file(file)
    decrypted = aes_decrypt(content, key)
    return JSONResponse(content=decrypted)
