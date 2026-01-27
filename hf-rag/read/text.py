import json
from process.cleaner import normalize


def read_json(blob: bytes, fname: str) -> str:
    try:
        data = json.loads(blob.decode('utf-8'))
        text = json.dumps(data, indent=2)
        return f"[Content from {fname}]\n{normalize(text)}"
    except:
        return ""


def read_text(blob: bytes, fname: str) -> str:
    try:
        text = blob.decode('utf-8')
        return normalize(text)
    except:
        return ""
