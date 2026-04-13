import json
import asyncio
import queue
import threading
from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse, StreamingResponse

from app.cipher.hill.key import generate_key as hill_generate_key
from app.cipher.hill.encrypt import encrypt as hill_encrypt
from app.cipher.hill.decrypt import decrypt as hill_decrypt
from app.cipher.hill.attack import hill_attack
from app.routes._helpers import read_file, _run_attack_with_progress, _sse_generator


router = APIRouter(prefix="/hill", tags=["hill"])


@router.get("/key")
async def hill_key_route():
    return hill_generate_key()


@router.post("/encrypt")
async def hill_encrypt_route(file: UploadFile = File(...), key: str = Form(...)):
    content = await read_file(file)
    key_data = json.loads(key)
    encrypted = hill_encrypt(content, key_data)
    return JSONResponse(content=encrypted)


@router.post("/decrypt")
async def hill_decrypt_route(file: UploadFile = File(...), key: str = Form(...)):
    content = await read_file(file)
    key_data = json.loads(key)
    decrypted = hill_decrypt(content, key_data)
    return JSONResponse(content=decrypted)


@router.post("/attack")
async def hill_attack_route(file: UploadFile = File(...)):
    content = await read_file(file)
    result = await asyncio.get_running_loop().run_in_executor(
        None, hill_attack, content
    )
    return JSONResponse(content=result)


@router.post("/attack/stream")
async def hill_attack_stream(file: UploadFile = File(...)):
    content = await read_file(file)
    progress_queue = queue.Queue()
    threading.Thread(
        target=_run_attack_with_progress,
        args=(hill_attack, content, progress_queue),
        daemon=True,
    ).start()
    return StreamingResponse(_sse_generator(progress_queue), media_type="text/event-stream")
