import google.generativeai as genai
from config import get_settings
from process.cleaner import normalize

PDF_PROMPT = """Extract ALL text from this PDF verbatim.
- Convert tables to Markdown tables.
- Describe charts/images in detail.
- Start each page with [Page N] delimiter.
- No filler text, just content."""


def read_pdf(blob: bytes, fname: str, api_key: str = None) -> str:
    try:
        key = api_key or get_settings().gemini_api_key
        genai.configure(api_key=key)
        model = genai.GenerativeModel("gemini-2.0-flash")
        
        res = model.generate_content([PDF_PROMPT, {"mime_type": "application/pdf", "data": blob}])
        text = normalize(res.text)
        return f"[Content from {fname}]\n{text}"
    except Exception as e:
        print(f"PDF error: {e}")
        return ""
