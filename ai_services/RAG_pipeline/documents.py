from langchain_core.documents import Document

# def create_documents(chunks: list[str], source_name: str):
#     documents = []
#     for i, chunk in enumerate(chunks):
#         doc = Document(
#             page_content=chunk,
#             metadata={"chunk_id": i, "source": source_name} # Node's database ID goes here
#         )
#         documents.append(doc)
#     return documents

#debug
# documents.py

def create_documents(chunks: list[str], pdf_id: str) -> list[Document]:
    """
    Converts raw PDF text chunks into LangChain Document objects 
    tagged for FAISS indexing and recommendation filtering.
    """
    documents = []
    for i, chunk in enumerate(chunks):
        doc = Document(
            page_content=chunk,
            metadata={
                "doc_type": "pdf",   # Distinguishes PDF vectors from User vectors in FAISS
                "pdf_id": pdf_id,     # Database ID used for recommendation lookups
                "chunk_id": i,
                "source": pdf_id      # Keeps source tracking consistent
            }
        )
        documents.append(doc)
    return documents