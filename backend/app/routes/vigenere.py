import asyncio
import queue
import threading
from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse, StreamingResponse

from app.cipher.vigenere.key import generate_key as vigenere_generate_key
from app.cipher.vigenere.encrypt import encrypt as vigenere_encrypt
from app.cipher.vigenere.decrypt import decrypt as vigenere_decrypt
from app.cipher.vigenere.attack import vigenere_attack
from app.routes._helpers import read_file, _run_attack_with_progress, _sse_generator


router = APIRouter(prefix="/vigenere", tags=["vigenere"])


@router.get("/key")
async def vigenere_key_route():
    return {"key": vigenere_generate_key()}


@router.post("/encrypt")
async def vigenere_encrypt_route(file: UploadFile = File(...), key: str = Form(...)):
    content = await read_file(file)
    encrypted = vigenere_encrypt(content, key)
    return JSONResponse(content=encrypted)


@router.post("/decrypt")
async def vigenere_decrypt_route(file: UploadFile = File(...), key: str = Form(...)):
    content = await read_file(file)
    decrypted = vigenere_decrypt(content, key)
    return JSONResponse(content=decrypted)


@router.post("/attack")
async def vigenere_attack_route(file: UploadFile = File(...)):
    content = await read_file(file)
    result = await asyncio.get_running_loop().run_in_executor(
        None, vigenere_attack, content
    )
    return JSONResponse(content=result)


@router.post("/attack/stream")
async def vigenere_attack_stream(file: UploadFile = File(...)):
    content = await read_file(file)
    progress_queue = queue.Queue()
    threading.Thread(
        target=_run_attack_with_progress,
        args=(vigenere_attack, content, progress_queue),
        daemon=True,
    ).start()
    return StreamingResponse(_sse_generator(progress_queue), media_type="text/event-stream")
