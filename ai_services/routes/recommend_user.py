from user_profile.UserProfile import UserProfile
from fastapi import APIRouter, HTTPException
from RAG_pipeline.embeddings import get_embeddings
from RAG_pipeline.vector_store import add_user_to_fiass
from RAG_pipeline.vector_store import get_similar_user_recommendations

router=APIRouter()

@router.post("/user_recommendation")
async def user_recommendation(user_id:str):
    embeddings=get_embeddings()
    recommended_user=get_similar_user_recommendations(user_id,embeddings, path="fiass_index",k=5)
    return recommended_user