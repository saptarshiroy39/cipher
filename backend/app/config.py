import json
import os

from dotenv import load_dotenv

load_dotenv()

APP_NAME = "Cipher API"
APP_VERSION = "1.5.0"

CORS_ORIGINS_STR = os.getenv("CORS_ORIGINS", '["*"]')
CORS_ORIGINS = json.loads(CORS_ORIGINS_STR)
