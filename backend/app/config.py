import os
import json
from dotenv import load_dotenv

load_dotenv()

APP_NAME = "Cipher API"
APP_VERSION = "1.0.0"
DEBUG = False

HOST = "0.0.0.0"
PORT = 8000

CORS_ORIGINS_STR = os.getenv("CORS_ORIGINS", '["*"]')
CORS_ORIGINS = json.loads(CORS_ORIGINS_STR)

ENV = os.getenv("ENV", "development")
