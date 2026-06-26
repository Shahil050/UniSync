from fastapi import APIRouter, HTTPException


from .recommend import get_recommendations_by_query
router=APIRouter()

@router.get("/recommend")
async def recommend_papers(query: str):
    """
    Takes a search string from Node.js, scans the accumulated FAISS index,
    and returns the top 5 Postgres IDs.
    """
    if not query.strip():
        raise HTTPException(status_code=400, detail="Search query cannot be empty.")
        
    try:
        # Searches across whatever documents have been accumulated in FAISS so far
        top_ids = get_recommendations_by_query(query, top_n=5)
        
        return {
            "success": True,
            "query": query,
            "recommended_postgres_ids": top_ids
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))