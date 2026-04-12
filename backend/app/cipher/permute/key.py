import secrets


ALPHA = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")


def generate_key() -> str:
    shuffled = ALPHA.copy()
    secrets.SystemRandom().shuffle(shuffled)
    return "".join(shuffled)
