import asyncio
import queue
import threading
from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse, StreamingResponse

from app.cipher.permute.key import generate_key as permute_generate_key
from app.cipher.permute.encrypt import encrypt as permute_encrypt
from app.cipher.permute.decrypt import decrypt as permute_decrypt
from app.cipher.permute.attack import frequency_attack
from app.routes._helpers import read_file, _run_attack_with_progress, _sse_generator


router = APIRouter(prefix="/permute", tags=["permute"])


@router.get("/key")
async def permute_key_route():
    return {"key": permute_generate_key()}


@router.post("/encrypt")
async def permute_encrypt_route(file: UploadFile = File(...), key: str = Form(...)):
    content = await read_file(file)
    encrypted = permute_encrypt(content, key)
    return JSONResponse(content=encrypted)


@router.post("/decrypt")
async def permute_decrypt_route(file: UploadFile = File(...), key: str = Form(...)):
    content = await read_file(file)
    decrypted = permute_decrypt(content, key)
    return JSONResponse(content=decrypted)


@router.post("/attack")
async def permute_attack_route(file: UploadFile = File(...)):
    content = await read_file(file)
    result = await asyncio.get_running_loop().run_in_executor(
        None, frequency_attack, content
    )
    return JSONResponse(content=result)


@router.post("/attack/stream")
async def permute_attack_stream(file: UploadFile = File(...)):
    content = await read_file(file)
    progress_queue = queue.Queue()
    threading.Thread(
        target=_run_attack_with_progress,
        args=(frequency_attack, content, progress_queue),
        daemon=True,
    ).start()
    return StreamingResponse(_sse_generator(progress_queue), media_type="text/event-stream")
