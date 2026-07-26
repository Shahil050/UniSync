from pydantic import BaseModel
from typing import List


class MatchResponse(BaseModel):
    user_id: str
    interest:List[str]