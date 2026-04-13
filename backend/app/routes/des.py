from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse

from app.cipher.des.key import generate_key as des_generate_key
from app.cipher.des.encrypt import encrypt as des_encrypt
from app.cipher.des.decrypt import decrypt as des_decrypt
from app.routes._helpers import read_file


router = APIRouter(prefix="/des", tags=["des"])


@router.get("/key")
async def des_key_route():
    return {"key": des_generate_key()}


@router.post("/encrypt")
async def des_encrypt_route(file: UploadFile = File(...), key: str = Form(...)):
    content = await read_file(file)
    encrypted = des_encrypt(content, key)
    return JSONResponse(content=encrypted)


@router.post("/decrypt")
async def des_decrypt_route(file: UploadFile = File(...), key: str = Form(...)):
    content = await read_file(file)
    decrypted = des_decrypt(content, key)
    return JSONResponse(content=decrypted)
