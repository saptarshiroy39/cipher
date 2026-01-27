import os

TYPES = {
    ".pdf": "pdf",
    ".json": "text",
    ".txt": "text",
    ".md": "text"
}


def get_type(fname: str) -> str:
    ext = os.path.splitext(fname)[1].lower()
    return TYPES.get(ext, "unknown")
