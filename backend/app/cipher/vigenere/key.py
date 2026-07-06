import secrets
import string


def generate_key() -> str:
    length = secrets.randbelow(4) + 3
    return "".join(secrets.choice(string.ascii_uppercase) for _ in range(length))
