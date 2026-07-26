import os
from documents import create_documents
from langchain_core.documents import Document
from langchain_community.vectorstores import FAISS

def save_or_update_vector_index(documents, embeddings, path="faiss_index"):
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


def load_vector_index(embeddings, path="faiss_index"):
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

def similarity_search_with_score(query, embeddings, path="faiss_index", k=4):
    """
    Loads the FAISS index and performs a similarity search.
    Returns a list of tuples: (Document, Score).
    Note: For FAISS, a LOWER score (L2 distance) means HIGHER similarity.
    """
    # 1. Load the existing vector index
    vectorstore = load_vector_index(embeddings, path=path)
    
    if vectorstore is None:
        print(f"Error: No FAISS index found at '{path}'. Please index documents first.")
        return []
        
    print(f"Searching index at '{path}' for query: '{query}'...")
    
    # 2. Perform the similarity search with score
    results = vectorstore.similarity_search_with_score(query, k=k)
    
    return results


def add_pdf_to_fiass(pdf_id:str, chunks:list[str],embeddings,path="faiss_index")
    documents=create_documents(chunks=chunks,pdf_id=pdf_id)
    return save_or_update_vector_index(documents,embeddings,path=path)

def add_user_to_fiass(user_id:str,interest:list[str],embeddings,path="fiass_index"):
    documents=f"interest:{', '.join(interest)}"
    user_doc=Document(
        page_content=interest_text,
        metadata={
            "doc_type":"user",
            "user_id":user_id
        }
    )
    return save_or_update_vector_index([user_doc],embeddings,path=path)

def get_recommendations_for_user(user_id:str, embeddings,path="faiss_index",k:int=5):
    vectorstore=load_vector_index(embeddings,path=path)
    if not vectorstore:
        return []
    
    all_docs=list(vectorstore.docstore._dict.values())
    target_user_doc=next((d for d in all_docs if d.metadata.get("user_id")==user_id),None)

    if not target_user_doc:
        return []
    
    results=vectorstore.similarity_search_with_relevance_scores(
        query=target_user_doc.page_content,
        k=k*4,
        filter={"doc_type":"pdf"}
    )
    recommended_pdf_ids=[]
    seen=set()
    for doc, _ in results:
        p_id=doc.metadata.get("pdf_id")
        if p_id and p_id not in seen:
            seen.add(p_id)
            recommended_pdf_ids.append(p_id)
            if len(recommended_pdf_ids)==k:
                break

    return recommended_pdf_ids



def get_recommendations_for_pdf(pdf_id: str, embeddings, path="faiss_index", k: int = 5):
    """
    Looks up a PDF's vector in FAISS and finds interested User IDs.
    Returns a list of unique user_ids.
    """
    vectorstore = load_vector_index(embeddings, path=path)
    if not vectorstore:
        return []

    # 1. Retrieve the first chunk of the PDF
    all_docs = list(vectorstore.docstore._dict.values())
    target_pdf_doc = next((d for d in all_docs if d.metadata.get("pdf_id") == pdf_id), None)
    
    if not target_pdf_doc:
        return []

    # 2. Similarity search filtered ONLY for Users
    results = vectorstore.similarity_search_with_score(
        query=target_pdf_doc.page_content,
        k=k * 2,
        filter={"doc_type": "user"}
    )

    # 3. Collect unique user_ids
    recommended_user_ids = []
    seen = set()
    for doc, _ in results:
        u_id = doc.metadata.get("user_id")
        if u_id and u_id not in seen:
            seen.add(u_id)
            recommended_user_ids.append(u_id)
            if len(recommended_user_ids) == k:
                break

    return recommended_user_ids

