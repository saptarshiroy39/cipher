import secrets
import string


def generate_key() -> str:
    length = secrets.randbelow(5) + 4
    return "".join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(length))
