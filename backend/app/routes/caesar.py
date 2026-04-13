import queue
import threading
from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse, StreamingResponse

from app.cipher.caesar.key import generate_key as caesar_generate_key
from app.cipher.caesar.encrypt import caesar_encrypt
from app.cipher.caesar.decrypt import caesar_decrypt
from app.cipher.caesar.attack import caesar_attack
from app.routes._helpers import read_file, _run_attack_with_progress, _sse_generator


router = APIRouter(prefix="/caesar", tags=["caesar"])


@router.get("/key")
async def caesar_key_route():
    return {"key": caesar_generate_key()}


@router.post("/encrypt")
async def caesar_encrypt_route(file: UploadFile = File(...), key: int = Form(...)):
    content = await read_file(file)
    encrypted = caesar_encrypt(content, key)
    return JSONResponse(content=encrypted)


@router.post("/decrypt")
async def caesar_decrypt_route(file: UploadFile = File(...), key: int = Form(...)):
    content = await read_file(file)
    decrypted = caesar_decrypt(content, key)
    return JSONResponse(content=decrypted)


@router.post("/attack")
async def caesar_attack_route(file: UploadFile = File(...)):
    content = await read_file(file)
    result = caesar_attack(content)
    return JSONResponse(content=result)


@router.post("/attack/stream")
async def caesar_attack_stream(file: UploadFile = File(...)):
    content = await read_file(file)
    progress_queue = queue.Queue()
    threading.Thread(
        target=_run_attack_with_progress,
        args=(caesar_attack, content, progress_queue),
        daemon=True,
    ).start()
    return StreamingResponse(_sse_generator(progress_queue), media_type="text/event-stream")
