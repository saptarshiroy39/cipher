from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

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
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    docs_url=None if settings.ENV == "production" else "/docs",
    redoc_url=None if settings.ENV == "production" else "/redoc",
    openapi_url=None if settings.ENV == "production" else "/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
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
    return {"name": settings.APP_NAME, "version": settings.APP_VERSION, "status": "ok"}
