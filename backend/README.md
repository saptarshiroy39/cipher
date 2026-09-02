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

<p align="center">
  <a href="https://github.com/saptarshiroy39/cipher">
    <img alt="Version" src="https://img.shields.io/badge/version-v1.5.0-emerald">
  </a>
  <a href="https://github.com/saptarshiroy39/cipher/blob/main/LICENSE">
    <img alt="GitHub License" src="https://img.shields.io/github/license/saptarshiroy39/cipher?color=crimson">
  </a>
</p>

---

## ✳️ _API Endpoints_

| METHOD | ENDPOINT | TAG | DESCRIPTION |
| :---: | :---: | :---: | :---: |
| ![GET](https://img.shields.io/badge/GET-blue) | `/` | default | API name, version & status |
| ![POST](https://img.shields.io/badge/POST-green) | `/report` | Report | Compare original vs recovered and download report |
| ![GET](https://img.shields.io/badge/GET-blue) | `/caesar/key` | Caesar Cipher | Generate a random Caesar cipher key |
| ![POST](https://img.shields.io/badge/POST-green) | `/caesar/encrypt` | Caesar Cipher | Encrypt with Caesar cipher |
| ![POST](https://img.shields.io/badge/POST-green) | `/caesar/decrypt` | Caesar Cipher | Decrypt with Caesar cipher |
| ![POST](https://img.shields.io/badge/POST-green) | `/caesar/attack` | Caesar Cipher | Frequency analysis attack on Caesar cipher |
| ![POST](https://img.shields.io/badge/POST-green) | `/caesar/attack/stream` | Caesar Cipher | SSE feed for Caesar attack progress |
| ![GET](https://img.shields.io/badge/GET-blue) | `/permute/key` | Permutation Cipher | Generate a random Permutation cipher key |
| ![POST](https://img.shields.io/badge/POST-green) | `/permute/encrypt` | Permutation Cipher | Encrypt with Permutation cipher |
| ![POST](https://img.shields.io/badge/POST-green) | `/permute/decrypt` | Permutation Cipher | Decrypt with Permutation cipher |
| ![POST](https://img.shields.io/badge/POST-green) | `/permute/attack` | Permutation Cipher | Frequency analysis attack on Permutation cipher |
| ![POST](https://img.shields.io/badge/POST-green) | `/permute/attack/stream` | Permutation Cipher | SSE feed for Permutation attack progress |
| ![GET](https://img.shields.io/badge/GET-blue) | `/playfair/key` | Playfair Cipher (8x8) | Generate a random Playfair cipher (8x8) key |
| ![POST](https://img.shields.io/badge/POST-green) | `/playfair/encrypt` | Playfair Cipher (8x8) | Encrypt with Playfair cipher (8x8) |
| ![POST](https://img.shields.io/badge/POST-green) | `/playfair/decrypt` | Playfair Cipher (8x8) | Decrypt with Playfair cipher (8x8) |
| ![GET](https://img.shields.io/badge/GET-blue) | `/hill/key` | Hill Cipher (2x2) | Generate a random Hill cipher (2x2) key |
| ![POST](https://img.shields.io/badge/POST-green) | `/hill/encrypt` | Hill Cipher (2x2) | Encrypt with Hill cipher (2x2) |
| ![POST](https://img.shields.io/badge/POST-green) | `/hill/decrypt` | Hill Cipher (2x2) | Decrypt with Hill cipher (2x2) |
| ![POST](https://img.shields.io/badge/POST-green) | `/hill/attack` | Hill Cipher (2x2) | Frequency analysis attack on Hill cipher (2x2) |
| ![POST](https://img.shields.io/badge/POST-green) | `/hill/attack/stream` | Hill Cipher (2x2) | SSE feed for Hill attack progress |
| ![GET](https://img.shields.io/badge/GET-blue) | `/vigenere/key` | Vigenère Cipher | Generate a random Vigenère cipher key |
| ![POST](https://img.shields.io/badge/POST-green) | `/vigenere/encrypt` | Vigenère Cipher | Encrypt with Vigenère cipher |
| ![POST](https://img.shields.io/badge/POST-green) | `/vigenere/decrypt` | Vigenère Cipher | Decrypt with Vigenère cipher |
| ![POST](https://img.shields.io/badge/POST-green) | `/vigenere/attack` | Vigenère Cipher | Frequency analysis attack on Vigenère cipher |
| ![POST](https://img.shields.io/badge/POST-green) | `/vigenere/attack/stream` | Vigenère Cipher | SSE feed for Vigenère attack progress |
| ![GET](https://img.shields.io/badge/GET-blue) | `/rc5/key` | RC5 | Generate a random RC5 key (default: 16 bytes) |
| ![POST](https://img.shields.io/badge/POST-green) | `/rc5/encrypt` | RC5 | Encrypt with RC5 |
| ![POST](https://img.shields.io/badge/POST-green) | `/rc5/decrypt` | RC5 | Decrypt with RC5 |
| ![GET](https://img.shields.io/badge/GET-blue) | `/des/key` | DES | Generate a random DES key |
| ![POST](https://img.shields.io/badge/POST-green) | `/des/encrypt` | DES | Encrypt with DES |
| ![POST](https://img.shields.io/badge/POST-green) | `/des/decrypt` | DES | Decrypt with DES |
| ![GET](https://img.shields.io/badge/GET-blue) | `/aes/key` | AES | Generate a random AES key (default: 128 bits) |
| ![POST](https://img.shields.io/badge/POST-green) | `/aes/encrypt` | AES | Encrypt with AES |
| ![POST](https://img.shields.io/badge/POST-green) | `/aes/decrypt` | AES | Decrypt with AES |

---

## ✳️ _Structure_

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
│   ├── services/       # Cipher implementations
│   │   ├── caesar/     # Caesar cipher (encrypt, decrypt, attack)
│   │   ├── permute/    # Permutation cipher
│   │   ├── vigenere/   # Vigenère cipher
│   │   ├── playfair/   # Playfair cipher (8x8)
│   │   ├── hill/       # Hill cipher (2x2)
│   │   ├── des/        # DES
│   │   ├── aes/        # AES
│   │   ├── rc5/        # RC5
│   │   └── report/     # Report generation logic (compare.py)
│   └── static/         # Static files
├── pyproject.toml      # Python project configuration
├── uv.lock             # Dependency lockfile
└── .env.example        # Environment variables template
```

---

## ✳️ _Getting Started_

```bash
cd backend
```

```bash
uv sync
```

```bash
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## ✳️ _API Documentation_

▶️ [**_`API`_**](http://localhost:8000) - API runs at [`localhost:8000`](http://localhost:8000)

▶️ [**_`Swagger UI Docs`_**](http://localhost:8000/docs) - Swagger UI docs at [`localhost:8000/docs`](http://localhost:8000/docs)
