# Production To-Do

## 🔴 High Priority

- [ ] **Database for API keys** - Replace in-memory `API_KEYS` dict with PostgreSQL/Supabase
  - File: `app.py`
  
- [ ] **Restrict CORS origins** - Change `allow_origins=["*"]` to your frontend domain
  - File: `app.py`

## 🟡 Medium Priority

- [ ] **Rate limiting** - Add per-API-key rate limits (use `slowapi`)
  - File: `app.py`

- [ ] **File size limits** - Limit uploads to 10MB
  - File: `app.py`

## 🟢 Low Priority

- [ ] **Logging** - Replace `print()` with `logging` module
  - Files: `read/pdf.py`, `read/text.py`

- [ ] **Input validation** - Validate question length, sanitize inputs
  - File: `app.py`

- [ ] **Health check improvements** - Add Pinecone/Gemini connectivity check
  - File: `app.py`
