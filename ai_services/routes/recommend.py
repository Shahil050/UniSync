from collections import Counter
from RAG_pipeline.embeddings import get_embeddings
from RAG_pipeline.vector_store import save_or_update_vector_index, load_vector_index, similarity_search_with_score

PAPERS_INDEX_PATH = "faiss_papers_index"

def get_recommendations_by_query(user_query: str, top_n: int = 5) -> list[str]:
    """
    Queries FAISS using the user's semantic string query and returns 
    the top N unique Postgres IDs (source).
    """
    embeddings = get_embeddings()
    vectorstore = load_vector_index(embeddings, path=PAPERS_INDEX_PATH)
    
    if not vectorstore:
        return []

    # Query for more chunks (k=15) because a single paper will have multiple chunks matching
    results = vectorstore.similarity_search_with_score(user_query, k=15)
    
    # Track scores based on L2 distance (lower distance = higher weight)
    score_board = Counter()
    for doc, score in results:
        postgres_id = doc.metadata.get("source")
        if postgres_id:
            weight = 1.0 / (score + 1e-5)
            score_board[postgres_id] += weight

    # Return only the top N unique Postgres IDs sorted by relevance
    return [postgres_id for postgres_id, _ in score_board.most_common(top_n)]