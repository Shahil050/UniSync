from user_profile.UserProfile import UserProfile
from fastapi import APIRouter, HTTPException
from RAG_pipeline.embeddings import get_embeddings
from RAG_pipeline.vector_store import add_user_to_fiass


router=APIRouter()


@router.post("/register_user")
async def register_user(profile: UserProfile):
    model=get_embeddings()
    added_user=add_user_to_fiass(profile.user_id,profile.interest,embeddings=model)
    return {
        "status": "success",
        "message": f"User {profile.user_id} successfully added to FAISS vector index.",
        "user_id": profile.user_id
    }
    






    