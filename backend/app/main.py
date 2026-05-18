import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.config import APP_NAME, APP_VERSION, CORS_ORIGINS, ENV

from app.routes.report import router as report_router
from app.routes.caesar import router as caesar_router
from app.routes.permute import router as permute_router
from app.routes.vigenere import router as vigenere_router
from app.routes.playfair import router as playfair_router
from app.routes.hill import router as hill_router
from app.routes.des import router as des_router
from app.routes.aes import router as aes_router
from app.routes.rc5 import router as rc5_router

app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    docs_url=None if ENV == "production" else "/docs",
    redoc_url=None if ENV == "production" else "/redoc",
    openapi_url=None if ENV == "production" else "/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
)

app.include_router(report_router)
app.include_router(caesar_router)
app.include_router(permute_router)
app.include_router(vigenere_router)
app.include_router(playfair_router)
app.include_router(hill_router)
app.include_router(des_router)
app.include_router(aes_router)
app.include_router(rc5_router)

@app.get("/")
async def root():
    return {"name": APP_NAME, "version": APP_VERSION, "status": "ok"}

app.mount("/static", StaticFiles(directory="app/static"), name="static")

@app.get('/favicon.ico', include_in_schema=False)
async def favicon():
    return FileResponse(os.path.join("app", "static", "favicon.ico"))
