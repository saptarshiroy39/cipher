import secrets


def generate_key() -> int:
    return secrets.randbelow(26) + 1
