import re


def normalize(text: str) -> str:
    if not text:
        return ""
    text = text.replace('\x00', '')
    return re.sub(r"\s+", " ", text).strip()


def safe_filename(fname: str) -> str:
    return re.sub(r'[^a-zA-Z0-9._-]', '_', fname)
