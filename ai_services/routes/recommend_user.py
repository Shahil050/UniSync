from user_profile.UserProfile import UserProfile
from fastapi import APIRouter, HTTPException
from RAG_pipeline.embeddings import get_embeddings
from RAG_pipeline.vector_store import add_user_to_fiass


router=APIRouter()


@router.post("/users/user_recommendation")
async def user_recommendation(profile: UserProfile):
    model=get_embeddings()