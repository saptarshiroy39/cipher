import json
import asyncio
import threading
import queue
from fastapi import UploadFile


async def read_file(file: UploadFile) -> str:
    raw = await file.read()
    try:
        return raw.decode("utf-8")
    except UnicodeDecodeError:
        return raw.decode("cp1252", errors="replace")


def get_name(file: UploadFile) -> str:
    name = file.filename or "file"
    return name.rsplit(".", 1)[0] if "." in name else name


def _run_attack_with_progress(attack_fn, content, progress_queue, **kwargs):
    def progress_callback(current, total, status):
        pct = int((current / total) * 100) if total else 0
        progress_queue.put({"progress": pct, "status": status})

    try:
        result = attack_fn(content, progress_callback=progress_callback, **kwargs)
        progress_queue.put({"progress": 100, "status": "Complete", "result": result})
    except Exception as e:
        progress_queue.put({"progress": -1, "status": "Error", "error": str(e)})
    progress_queue.put(None)


async def _sse_generator(progress_queue):
    while True:
        try:
            msg = await asyncio.get_event_loop().run_in_executor(None, progress_queue.get, True, 0.5)
        except Exception:
            await asyncio.sleep(0.1)
            continue
        if msg is None:
            break
        yield f"data: {json.dumps(msg)}\n\n"
