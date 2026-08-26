import binascii
import os


def generate_key() -> str:
    binary_key = os.urandom(8)
    return binascii.hexlify(binary_key).decode("utf-8")
