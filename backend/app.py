from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional
import os
import shutil
from rag_engine import RAGEngine
from config import DOCUMENTS_DIR

app = FastAPI(title="RAG Chatbot API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize RAG engine
rag = RAGEngine()

# Auto-process documents on startup if database is empty
@app.on_event("startup")
async def startup_event():
    stats = rag.get_stats()
    if stats['total_chunks'] == 0:
        print("\n📂 Database is empty. Auto-processing documents...")
        result = rag.process_all_documents()
        print(f"✅ {result['message']}: {result['total_chunks']} chunks from {result['processed']} PDFs\n")
    else:
        print(f"\n✅ Database already loaded: {stats['total_chunks']} chunks from {stats['total_pdfs']} PDFs\n")

class QuestionRequest(BaseModel):
    question: str
    top_k: Optional[int] = 5

class ProcessResponse(BaseModel):
    status: str
    message: str

@app.get("/")
async def root():
    """API health check"""
    return {
        "status": "healthy",
        "message": "RAG Chatbot API is running",
        "version": "1.0"
    }

@app.post("/ask")
async def ask_question(request: QuestionRequest):
    """
    Ask a question and get RAG-based answer
    """
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    
    try:
        result = rag.ask(request.question, top_k=request.top_k)
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing question: {str(e)}")

@app.post("/process-documents")
async def process_documents():
    """
    Process all PDFs in the documents folder
    """
    try:
        result = rag.process_all_documents()
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing documents: {str(e)}")

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    """
    Upload a single PDF file
    """
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    try:
        # Save file
        os.makedirs(DOCUMENTS_DIR, exist_ok=True)
        file_path = os.path.join(DOCUMENTS_DIR, file.filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Process the uploaded PDF
        chunks_added = rag.process_pdf(file_path)
        
        return JSONResponse(content={
            "status": "success",
            "message": f"Uploaded and processed {file.filename}",
            "chunks_added": chunks_added
        })
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading file: {str(e)}")

@app.get("/stats")
async def get_stats():
    """
    Get database statistics
    """
    try:
        stats = rag.get_stats()
        return JSONResponse(content=stats)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting stats: {str(e)}")

@app.delete("/clear-database")
async def clear_database():
    """
    Clear all documents from the database
    """
    try:
        rag.clear_database()
        return JSONResponse(content={
            "status": "success",
            "message": "Database cleared successfully"
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error clearing database: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)