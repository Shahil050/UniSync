import os


from langchain_community.vectorstores import FAISS

# #creating faiss index
# def create_vector_index(documents,embeddings):
#     vectorstore=FAISS.from_documents(
#         documents=documents,
#         embedding=embeddings
#     )
#     return vectorstore

# #saving vector embeddings
# def save_vector_index(vectorstore,path="faiss_index"):
#     vectorstore.save_local(path)



def save_or_update_vector_index(documents, embeddings, path="faiss_index"):
    """
    Loads an existing FAISS index from disk and appends new documents to it.
    If no index exists, it initializes a brand new one.
    """
    # Check if the folder and the index file actually exist
    index_file = os.path.join(path, "index.faiss")
    
    if os.path.exists(index_file):
        print(f"🔄 Existing index found at '{path}'. Loading and merging new documents...")
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
        print(f"✨ No index found at '{path}'. Creating a brand new FAISS index...")
        # 1. Create fresh index if it doesn't exist yet
        vectorstore = FAISS.from_documents(
            documents=documents,
            embedding=embeddings
        )
    
    # Save the updated/new index back to disk
    vectorstore.save_local(path)
    print(f"💾 Vector store successfully saved to '{path}'.")
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
        print(f"❌ Error: No FAISS index found at '{path}'. Please index documents first.")
        return []
        
    print(f"🔍 Searching index at '{path}' for query: '{query}'...")
    
    # 2. Perform the similarity search with score
    results = vectorstore.similarity_search_with_score(query, k=k)
    
    return results

