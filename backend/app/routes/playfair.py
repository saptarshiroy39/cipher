from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse

from app.cipher.playfair.key import generate_key as playfair_generate_key
from app.cipher.playfair.encrypt import encrypt as playfair_encrypt
from app.cipher.playfair.decrypt import decrypt as playfair_decrypt
from app.routes._helpers import read_file


router = APIRouter(prefix="/playfair", tags=["playfair"])


@router.get("/key")
async def playfair_key_route():
    return {"key": playfair_generate_key()}


@router.post("/encrypt")
async def playfair_encrypt_route(file: UploadFile = File(...), key: str = Form(...)):
    content = await read_file(file)
    encrypted = playfair_encrypt(content, key)
    return JSONResponse(content=encrypted)


@router.post("/decrypt")
async def playfair_decrypt_route(file: UploadFile = File(...), key: str = Form(...)):
    ciphertext = await read_file(file)
    decrypted = playfair_decrypt(ciphertext, key)
    return JSONResponse(content=decrypted)
