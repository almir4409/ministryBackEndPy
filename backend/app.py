# This is the main backend application for a RAG (Retrieval-Augmented Generation) Chatbot API.
# It provides endpoints for asking questions, uploading documents, and managing a knowledge base.
# The app uses FastAPI, a modern web framework for Python, to create a REST API.
# It integrates with a RAG engine that processes PDF documents and answers questions based on their content.

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional
import os
import shutil
from rag_engine import RAGEngine
from config import DOCUMENTS_DIR

# Create a FastAPI application instance
# This is the main object that will handle all our API routes and requests
app = FastAPI(title="RAG Chatbot API")

# Enable CORS (Cross-Origin Resource Sharing) for the frontend
# This allows the frontend (running on a different port) to make requests to our backend
# Without CORS, browsers would block these requests for security reasons
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow requests from any origin (in production, specify your frontend URL)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Initialize the RAG (Retrieval-Augmented Generation) engine
# This engine handles processing documents and answering questions based on their content
rag = RAGEngine()

# This function runs automatically when the application starts up
# It checks if the database is empty and automatically processes any documents if needed
@app.on_event("startup")
async def startup_event():
    # Get current statistics about the database (number of chunks and PDFs)
    stats = rag.get_stats()
    
    # If there are no chunks in the database (meaning no documents have been processed yet)
    if stats['total_chunks'] == 0:
        print("\n📂 Database is empty. Auto-processing documents...")
        # Process all PDF documents in the documents folder and add them to the database
        result = rag.process_all_documents()
        print(f"✅ {result['message']}: {result['total_chunks']} chunks from {result['processed']} PDFs\n")
    else:
        # If the database already has data, just show the current statistics
        print(f"\n✅ Database already loaded: {stats['total_chunks']} chunks from {stats['total_pdfs']} PDFs\n")

# Define data models using Pydantic
# Pydantic helps validate and parse the data sent in API requests
# These models define the expected structure of the data

# Model for question requests - defines what data is expected when asking a question
class QuestionRequest(BaseModel):
    question: str  # The question text (required)
    top_k: Optional[int] = 5  # Number of relevant chunks to retrieve (optional, defaults to 5)

# Model for processing responses - defines the structure of responses from document processing
class ProcessResponse(BaseModel):
    status: str  # Status of the operation (e.g., "success" or "error")
    message: str  # Descriptive message about what happened

# Root endpoint - a simple health check for the API
# This endpoint tells us if the server is running and healthy
@app.get("/")
async def root():
    """API health check"""
    return {
        "status": "healthy",  # Indicates the API is working
        "message": "RAG Chatbot API is running",  # Human-readable message
        "version": "1.0"  # Version of the API
    }

# Endpoint to ask questions to the chatbot
# This is the main functionality - users send questions and get answers based on the documents
@app.post("/ask")
async def ask_question(request: QuestionRequest):
    """
    Ask a question and get RAG-based answer
    """
    # Validate that the question is not empty or just whitespace
    if not request.question.strip():
        # Raise an HTTP exception with status 400 (Bad Request) if question is empty
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    
    try:
        # Use the RAG engine to process the question and get an answer
        # The engine will search for relevant information in the processed documents
        result = rag.ask(request.question, top_k=request.top_k)
        # Return the result as JSON
        return JSONResponse(content=result)
    except Exception as e:
        # If something goes wrong, return a 500 error with details
        raise HTTPException(status_code=500, detail=f"Error processing question: {str(e)}")

# Endpoint to process all PDF documents in the documents folder
# This reads all PDFs, breaks them into chunks, and stores them in the database for later retrieval
@app.post("/process-documents")
async def process_documents():
    """
    Process all PDFs in the documents folder
    """
    try:
        # Call the RAG engine to process all documents in the documents directory
        result = rag.process_all_documents()
        # Return the result (includes number of chunks processed, etc.)
        return JSONResponse(content=result)
    except Exception as e:
        # Handle any errors during processing
        raise HTTPException(status_code=500, detail=f"Error processing documents: {str(e)}")

# Endpoint to upload a single PDF file
# Users can send a PDF file, which gets saved and immediately processed into the database
@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    """
    Upload a single PDF file
    """
    # Check if the uploaded file has a .pdf extension
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    try:
        # Create the documents directory if it doesn't exist
        os.makedirs(DOCUMENTS_DIR, exist_ok=True)
        # Create the full path where the file will be saved
        file_path = os.path.join(DOCUMENTS_DIR, file.filename)
        
        # Save the uploaded file to disk
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Process the uploaded PDF file and add its content to the database
        chunks_added = rag.process_pdf(file_path)
        
        # Return success response with details
        return JSONResponse(content={
            "status": "success",
            "message": f"Uploaded and processed {file.filename}",
            "chunks_added": chunks_added  # Number of text chunks added to the database
        })
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading file: {str(e)}")

# Endpoint to get statistics about the database
# Shows how many documents and chunks are stored
@app.get("/stats")
async def get_stats():
    """
    Get database statistics
    """
    try:
        # Get statistics from the RAG engine (number of PDFs, chunks, etc.)
        stats = rag.get_stats()
        # Return the statistics as JSON
        return JSONResponse(content=stats)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting stats: {str(e)}")

# Endpoint to clear all data from the database
# This removes all processed documents and chunks - use with caution!
@app.delete("/clear-database")
async def clear_database():
    """
    Clear all documents from the database
    """
    try:
        # Tell the RAG engine to clear all data
        rag.clear_database()
        # Return success confirmation
        return JSONResponse(content={
            "status": "success",
            "message": "Database cleared successfully"
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error clearing database: {str(e)}")

# This block runs when the script is executed directly (not imported as a module)
# It starts the FastAPI server using Uvicorn
if __name__ == "__main__":
    import uvicorn
    # Run the FastAPI app on all network interfaces (0.0.0.0) on port 8000
    # This makes the API accessible from other devices on the network
    uvicorn.run(app, host="0.0.0.0", port=8000)