from langchain_community.embeddings import FastEmbedEmbeddings

def get_embeddings():
    embeddings=FastEmbedEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )
    return embeddings