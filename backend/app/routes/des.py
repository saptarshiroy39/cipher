from fastapi import APIRouter, File, Form, UploadFile

from app.services.des.decrypt import decrypt as des_decrypt
from app.services.des.encrypt import encrypt as des_encrypt
from app.services.des.key import generate_key as des_generate_key
from app.routes._helpers import read_file

router = APIRouter(prefix="/des", tags=["DES"])

@router.get("/key")
async def des_key_route():
    return {"key": des_generate_key()}

@router.post("/encrypt")
async def des_encrypt_route(file: UploadFile = File(...), key: str = Form(...)):
    content = await read_file(file)
    return des_encrypt(content, key)

@router.post("/decrypt")
async def des_decrypt_route(file: UploadFile = File(...), key: str = Form(...)):
    content = await read_file(file)
    return des_decrypt(content, key)
