from typing import List


def profile_to_text(interest:List[str]) -> str:
    interest=", ".join(interest)
    return f"interest:{interest}"