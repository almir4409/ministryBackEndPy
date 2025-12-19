RAG Chatbot - Setup Instructions
Starting the Backend

Open Terminal in VS Code

Navigate to backend folder:



bash   cd backend

Add Your PDF Documents

Place all PDF files in backend/documents/ folder
You can add 1-200+ PDFs


Start the Backend Server

bash   python app.py
```
   
   You should see:
```
   🚀 Initializing RAG Engine...
   ✅ Loaded embedding model
   ✅ ChromaDB initialized: 0 documents
   ✅ OpenRouter client ready
   INFO: Uvicorn running on http://0.0.0.0:8000

Process Documents (IMPORTANT - Must do first!)

Open browser and go to: http://localhost:8000/docs
Find the POST /process-documents endpoint
Click "Try it out" → Click "Execute"
Wait for processing to complete (may take a few minutes for many PDFs)
Check response to see how many documents were processed



Connecting Frontend to Backend

Open Frontend

Simply open frontend/index.html in your browser
Or use VS Code Live Server extension


Frontend automatically connects to Backend

Frontend is configured to connect to http://localhost:8000
Make sure backend is running first!



Important Notes

Documents MUST be processed from backend BEFORE using the chat
You can also process documents via API: POST http://localhost:8000/process-documents
Once processed, documents are stored in ChromaDB and persist between sessions
To add new documents: add PDFs to backend/documents/ folder and call process-documents again