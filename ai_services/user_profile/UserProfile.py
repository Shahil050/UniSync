from pydantic import BaseModel, Field
from typing import List

class UserProfile(BaseModel):
    user_id:str=Field(...,examples=["ID1"])
    interest:List[str]=Field(...,examples=[["Python","Data Science","Machine Learning"]])


