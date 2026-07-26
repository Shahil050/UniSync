from .loader import load_document
from .splitter import split_and_chunking
from .documents import create_documents
from .embeddings import get_embeddings
# Import the updated function that handles multi-PDF appending
from .vector_store import save_or_update_vector_index, load_vector_index

from pathlib import Path

# Path where your composite research papers FAISS index will live
PAPERS_INDEX_PATH = "faiss_papers_index"

def ingest(pdf_path: str, paper_id: str):
    """
    Ingests a single PDF research paper, chunks it, and safely appends 
    its semantic data into the shared FAISS database.
    """
    print(f"\n--- Starting Ingestion for Paper ID: {paper_id} ---")
    embeddings = get_embeddings()
    vectorstore = load_vector_index(embeddings, path=PAPERS_INDEX_PATH)
    
    if vectorstore is not None:
        # Scan through document metadata values currently registered in the FAISS index memory
        existing_ids = {
            doc.metadata.get("source") 
            for doc in vectorstore.docstore._dict.values() 
            if doc.metadata
        }
        
        if paper_id in existing_ids:
            print(f"⚠️ Notice: Paper ID '{paper_id}' is already indexed in FAISS. Skipping parsing pipeline to avoid duplicate chunks.")
            print(f"Ingestion Aborted for Paper ID: {paper_id}")
            return



    print("Loading PDF document.....")
    text = load_document(pdf_path)

    print("Splitting text .....")
    chunks = split_and_chunking(text)
    
    print("Creating Documents ....")
    # Pass paper_id as the source name so your search knows which DB record it maps to
    documents = create_documents(chunks, source_name=paper_id)

    print("Generating embeddings + Syncing with FAISS index ...")
    embeddings = get_embeddings()
    
    # This automatically checks for an existing index, appends data, and saves back to disk
    save_or_update_vector_index(
        documents=documents,
        embeddings=embeddings,
        path=PAPERS_INDEX_PATH
    )

    print(f"Ingestion Complete for Paper ID: {paper_id}\n")

