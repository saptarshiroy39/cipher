## Setup

```bash
cd hf-rag
pip install -r requirements.txt
cp .env.example .env  # Add your API keys
uvicorn app:app --reload --port 7860
```

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api-key/generate` | Create API key |
| POST | `/upload` | Upload PDF/JSON |
| POST | `/query` | Ask question |
| GET | `/stats` | Get stats |

## Deploy to HF Spaces

1. Create Docker Space at huggingface.co/spaces
2. Push this folder
3. Add secrets: `GEMINI_API_KEY`, `PINECONE_API_KEY`