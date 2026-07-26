from profile import UserProfile, profile_to_text
from fastapi import APIRouter, HTTPException
from RAG_pipeline.embeddings import get_embeddings




router=APIRouter()


@router.post("/users/register")
async def register_user(profile: UserProfile):
    text_repr=profile_to_text(profile.interest)
    model=get_embeddings()
    embeddings=model.encode(text_repr,convert_to_tensor=True)
    



    