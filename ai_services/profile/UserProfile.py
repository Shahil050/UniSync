from pydantic import BaseModel, Field


class UserProfile(BaseModel):
    user_id:str=Field(...,example="ID1")
    # name: str=Field(...,example="Shahil Shrestha")
    interest:str=Field(...,example=["Python","Data Science","Machine Learning"])


