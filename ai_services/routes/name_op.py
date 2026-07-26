import os
import io
import shutil
from RAG_pipeline.ingest import ingest


from fastapi import APIRouter, UploadFile, File, HTTPException, Form


# # PDF route
# @router.post("/papers/index")
# async def index_research_paper(
#     paper_id: str=Form(...),
#     file: UploadFile=File(...)
# ):
#     if not file.filename.endswith(".pdf"):
#         raise HTTPException(status_code=400, detail="Only pdf are supported")
    
#     file_byte=await file.read()
#     raw_text=extract_text_from_stream(file_bytes)
#     process_and_index_text(raw_text,paper_id=paper_id)




router = APIRouter(prefix="/pdf", tags=["PDF System"])

@router.post("/sync-one")
async def sync_single_pdf(
    postgres_id: str = Form(...), 
    file: UploadFile = File(...)
):
    """
    Call this whenever a single new PDF is added or updated in Postgres.
    It appends cleanly to your existing FAISS index without losing previous papers.
    """
    temp_dir = "temp_sync"
    os.makedirs(temp_dir, exist_ok=True)
    temp_path = os.path.join(temp_dir, file.filename)
    
    try:
        # 1. Save the incoming stream to a temporary file
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # 2. Run your existing ingestion pipeline
        # This calls save_or_update_vector_index under the hood
        ingest(pdf_path=temp_path, paper_id=postgres_id)
        
        return {
            "success": True, 
            "message": f"Paper {postgres_id} successfully appended to the vector database."
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to ingest paper: {str(e)}")
        
    finally:
        # 3. Always clean up the raw temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)