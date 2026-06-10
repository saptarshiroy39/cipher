---
title: Cipher
emoji: 🔑
colorFrom: gray
colorTo: blue
sdk: docker
pinned: false
app_port: 7860
short_description: Cryptography Toolkit
---

<h1 align="center">
  <img src="./app/static/logo.png" alt="🔑" width="64">
  <br>
  <b>Cipher (Backend)</b>
</h1>

<p align="center">
  <b>FastAPI</b> backend for the <b>Cipher</b> project.
</p>

## ⚙️ _API Endpoints_

| METHOD                                           | ENDPOINT                  | DESCRIPTION                                       |
| ------------------------------------------------ | ------------------------- | ------------------------------------------------- |
| ![GET](https://img.shields.io/badge/GET-blue)    | `/`                       | API name, version & status                        |
| ![POST](https://img.shields.io/badge/POST-green) | `/report`                 | Compare original vs recovered and download report |
| ![GET](https://img.shields.io/badge/GET-blue)    | `/caesar/key`             | Generate a random Caesar cipher key               |
| ![POST](https://img.shields.io/badge/POST-green) | `/caesar/encrypt`         | Encrypt with Caesar cipher                        |
| ![POST](https://img.shields.io/badge/POST-green) | `/caesar/decrypt`         | Decrypt with Caesar cipher                        |
| ![POST](https://img.shields.io/badge/POST-green) | `/caesar/attack`          | Frequency analysis attack on Caesar cipher        |
| ![POST](https://img.shields.io/badge/POST-green) | `/caesar/attack/stream`   | SSE feed for Caesar attack progress               |
| ![GET](https://img.shields.io/badge/GET-blue)    | `/permute/key`            | Generate a random Permutation cipher key          |
| ![POST](https://img.shields.io/badge/POST-green) | `/permute/encrypt`        | Encrypt with Permutation cipher                   |
| ![POST](https://img.shields.io/badge/POST-green) | `/permute/decrypt`        | Decrypt with Permutation cipher                   |
| ![POST](https://img.shields.io/badge/POST-green) | `/permute/attack`         | Frequency analysis attack on Permutation cipher   |
| ![POST](https://img.shields.io/badge/POST-green) | `/permute/attack/stream`  | SSE feed for Permutation attack progress          |
| ![GET](https://img.shields.io/badge/GET-blue)    | `/vigenere/key`           | Generate a random Vigenère cipher key             |
| ![POST](https://img.shields.io/badge/POST-green) | `/vigenere/encrypt`       | Encrypt with Vigenère cipher                      |
| ![POST](https://img.shields.io/badge/POST-green) | `/vigenere/decrypt`       | Decrypt with Vigenère cipher                      |
| ![POST](https://img.shields.io/badge/POST-green) | `/vigenere/attack`        | Frequency analysis attack on Vigenère cipher      |
| ![POST](https://img.shields.io/badge/POST-green) | `/vigenere/attack/stream` | SSE feed for Vigenère attack progress             |
| ![GET](https://img.shields.io/badge/GET-blue)    | `/playfair/key`           | Generate a random Playfair cipher (8x8) key       |
| ![POST](https://img.shields.io/badge/POST-green) | `/playfair/encrypt`       | Encrypt with Playfair cipher (8x8)                |
| ![POST](https://img.shields.io/badge/POST-green) | `/playfair/decrypt`       | Decrypt with Playfair cipher (8x8)                |
| ![GET](https://img.shields.io/badge/GET-blue)    | `/hill/key`               | Generate a random Hill cipher (2x2) key           |
| ![POST](https://img.shields.io/badge/POST-green) | `/hill/encrypt`           | Encrypt with Hill cipher (2x2)                    |
| ![POST](https://img.shields.io/badge/POST-green) | `/hill/decrypt`           | Decrypt with Hill cipher (2x2)                    |
| ![POST](https://img.shields.io/badge/POST-green) | `/hill/attack`            | Frequency analysis attack on Hill cipher (2x2)    |
| ![POST](https://img.shields.io/badge/POST-green) | `/hill/attack/stream`     | SSE feed for Hill attack progress                 |
| ![GET](https://img.shields.io/badge/GET-blue)    | `/des/key`                | Generate a random DES key                         |
| ![POST](https://img.shields.io/badge/POST-green) | `/des/encrypt`            | Encrypt with DES                                  |
| ![POST](https://img.shields.io/badge/POST-green) | `/des/decrypt`            | Decrypt with DES                                  |
| ![GET](https://img.shields.io/badge/GET-blue)    | `/aes/key`                | Generate a random AES key (default: 128 bits)     |
| ![POST](https://img.shields.io/badge/POST-green) | `/aes/encrypt`            | Encrypt with AES                                  |
| ![POST](https://img.shields.io/badge/POST-green) | `/aes/decrypt`            | Decrypt with AES                                  |
| ![GET](https://img.shields.io/badge/GET-blue)    | `/rc5/key`                | Generate a random RC5 key (default: 16 bytes)     |
| ![POST](https://img.shields.io/badge/POST-green) | `/rc5/encrypt`            | Encrypt with RC5                                  |
| ![POST](https://img.shields.io/badge/POST-green) | `/rc5/decrypt`            | Decrypt with RC5                                  |

## 📁 _Structure_

```
backend/
├── app/
│   ├── main.py         # FastAPI app entry point
│   ├── config.py       # App configuration (env vars)
│   ├── routes/         # API route definitions (one file per cipher)
│   │   ├── _helpers.py # Shared utilities (file I/O, SSE streaming)
│   │   ├── caesar.py   # Caesar cipher routes
│   │   ├── permute.py  # Permutation cipher routes
│   │   ├── vigenere.py # Vigenère cipher routes
│   │   ├── playfair.py # Playfair cipher routes
│   │   ├── hill.py     # Hill cipher routes
│   │   ├── des.py      # DES routes
│   │   ├── aes.py      # AES routes
│   │   ├── rc5.py      # RC5 routes
│   │   └── report.py   # Report & favicon routes
│   ├── cipher/         # Cipher implementations
│   │   ├── caesar/     # Caesar cipher (encrypt, decrypt, attack)
│   │   ├── permute/    # Permutation cipher
│   │   ├── vigenere/   # Vigenère cipher
│   │   ├── playfair/   # Playfair cipher (8x8)
│   │   ├── hill/       # Hill cipher (2x2)
│   │   ├── des/        # DES
│   │   ├── aes/        # AES
│   │   ├── rc5/        # RC5
│   │   └── report.py   # Report generation logic
│   └── static/         # Static files
├── requirements.txt    # Python dependencies
└── .env.example        # Environment variables template
```

## 🚀 _Getting Started_

```bash
cd backend
```

```bash
uv venv .venv
```

```bash
.venv\Scripts\activate       # Windows
# OR
source .venv/bin/activate    # Linux / macOS
```

```bash
uv pip install -r requirements.txt
```

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- 🚀 [**_`API`_**](http://localhost:8000) - API runs at [`localhost:8000`](http://localhost:8000)
- 📚 [**_`Swagger UI Docs`_**](http://localhost:8000/docs) - Swagger UI docs at [`localhost:8000/docs`](http://localhost:8000/docs)
