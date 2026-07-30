import os
import shutil
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from RAG_pipeline.ingest import ingest
#

router = APIRouter()

# Match this path with the index storage directory used by your recommend endpoint
PAPERS_INDEX_PATH = "faiss_papers_index"

@router.post("/enter_pdf")
async def enter_pdf(
    postgres_id: str = Form(..., description="The unique database UUID/ID for this research paper."), 
    file: UploadFile = File(..., description="The research paper PDF file to parse and index.")
):

    # Validate file extension
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only standard PDF documents (.pdf) are supported.")

    temp_dir = "temp_sync"
    os.makedirs(temp_dir, exist_ok=True)
    temp_path = os.path.join(temp_dir, file.filename)
    
    try:
        # 1. Stream and save incoming multipart payload data to temporary file
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # 2. Feed the document directly into your RAG ingestion pipeline
        # Passing PAPERS_INDEX_PATH ensures it builds the right directory
        ingest(pdf_path=temp_path, paper_id=postgres_id)
        
        return {
            "success": True, 
            "message": f"Paper '{file.filename}' with ID {postgres_id} successfully appended to '{PAPERS_INDEX_PATH}'."
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to ingest paper structure: {str(e)}")
        
    finally:
        # 3. Clean up the physical file from disk to prevent storage leak loops
        if os.path.exists(temp_path):
            os.remove(temp_path)
