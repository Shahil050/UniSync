import os
from RAG_pipeline.documents import create_documents
from langchain_core.documents import Document
from langchain_community.vectorstores import FAISS

path="faiss_index"


def save_or_update_vector_index(documents, embeddings, path=path):
    """
    Loads an existing FAISS index from disk and appends new documents to it.
    If no index exists, it initializes a brand new one.
    """
    # Check if the folder and the index file actually exist
    index_file = os.path.join(path, "index.faiss")
    
    if os.path.exists(index_file):
        print(f"Existing index found at '{path}'. Loading and merging new documents...")
        # 1. Load the existing index
        # allow_dangerous_deserialization=True is required by LangChain to load local pickle files
        vectorstore = FAISS.load_local(
            folder_path=path, 
            embeddings=embeddings, 
            allow_dangerous_deserialization=True
        )
        # 2. Append the new document chunks without losing old ones
        vectorstore.add_documents(documents)
    else:
        print(f" No index found at '{path}'. Creating a brand new FAISS index...")
        # 1. Create fresh index if it doesn't exist yet
        vectorstore = FAISS.from_documents(
            documents=documents,
            embedding=embeddings
        )
    
    # Save the updated/new index back to disk
    vectorstore.save_local(path)
    print(f" Vector store successfully saved to '{path}'.")
    return vectorstore


def load_vector_index(embeddings, path=path):
    """
    Helper function to load the index for searching queries.
    """
    if not os.path.exists(os.path.join(path, "index.faiss")):
        return None
        
    return FAISS.load_local(
        folder_path=path, 
        embeddings=embeddings, 
        allow_dangerous_deserialization=True
    )



def add_user_to_fiass(user_id:str,interest:list[str],embeddings,path=path):
    documents=f"interest:{', '.join(interest)}"
    user_doc=Document(
        page_content=documents,
        metadata={
            "doc_type":"user",
            "user_id":user_id
        }
    )
    return save_or_update_vector_index([user_doc],embeddings,path=path)




def get_similar_user_recommendations(user_id: str, embeddings, path="fiass_index", k: int = 5):
    """
    Finds top 'k' users with interests similar to the given target user_id.
    """
    # 1. Load vector store from disk
    try:
        vectorstore = FAISS.load_local(
            folder_path=path,
            embeddings=embeddings,
            allow_dangerous_deserialization=True
        )
    except Exception as e:
        print(f"Error loading vector store from {path}: {e}")
        return []

    # 2. Extract all stored documents from memory
    all_docs = list(vectorstore.docstore._dict.values())
    
    # 3. Locate the target user's document
    target_user_doc = next(
        (d for d in all_docs if d.metadata.get("user_id") == user_id), 
        None
    )

    if not target_user_doc:
        print(f"User '{user_id}' not found in vector store.")
        return []

    # 4. Search for similar entries
    # Request extra candidates (k + 5) to account for filtering out self/duplicates
    results = vectorstore.similarity_search_with_relevance_scores(
        query=target_user_doc.page_content,
        k=k + 5,
        filter={"doc_type": "user"}  # Filter specifically for user profiles
    )

    recommended_users = []
    seen_users = {user_id}  # Add target user_id so they don't recommend themselves

    # 5. Filter unique candidate user IDs
    for doc, score in results:
        candidate_id = doc.metadata.get("user_id")
        
        # Ensure ID exists, hasn't been seen yet, and isn't the target user
        if candidate_id and candidate_id not in seen_users:
            seen_users.add(candidate_id)
            recommended_users.append({
                "user_id": candidate_id,
                "similarity_score": round(float(score), 4),
                "interests": doc.page_content
            })
            
            if len(recommended_users) == k:
                break

    return recommended_users

