# 🤖 RAG Chatbot - Monorepo Setup

This project is a Retrieval-Augmented Generation (RAG) chatbot consisting of a **Python/FastAPI** backend and a **Next.js** frontend.

## 📂 Project Structure
* **`/backend`**: Python FastAPI server, ChromaDB vector storage, and PDF processing logic.
* **`/frontend`**: Next.js web interface built with Tailwind CSS.

---

## ⚙️ Backend Setup

### 1. Environment & Dependencies
Navigate to the backend folder and set up your Python environment to keep dependencies isolated:

cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install required packages
pip install -r requirements.txt

### 2. Configuration
Setup your environment variables for the AI model and API access:
1. Locate `.env.example` in the root or backend folder.
2. Create a new file named `.env` in the project root folder.
3. Copy the contents and add your specific credentials:
   - `OPENROUTER_API_KEY`: Your sk-or-v1 key.
   - `MODEL_NAME`: The model you want to use from OpenRouter
   - `NEXT_PUBLIC_API_URL`: Set to http://localhost:8000.

### 3. Add Documents
Place all PDF files you want the chatbot to analyze into the backend/documents/ folder.

### 4. Start the Server
python app.py

Check for the confirmation: 🚀 Initializing RAG Engine... and INFO: Uvicorn running on http://0.0.0.0:8000.

### 5. Process Documents (Required First Step)
Before the chat can answer questions, you must index the PDFs:
1. Open your browser to: http://localhost:8000/docs
2. Find the POST /process-documents endpoint.
3. Click "Try it out" → "Execute".
4. Wait for the response showing the number of processed documents.

---

## 💻 Frontend Setup

### 1. Frontend Environment Configuration
Before starting the frontend, you must configure the API connection:
1. Navigate to the frontend folder.
2. Create a file named .env (or .env.local).
3. Add the Backend API URL. For local development, use the localhost URL:
   NEXT_PUBLIC_API_URL=http://localhost:8000

### 2. Install & Run
cd frontend

# Install Node dependencies
npm install

# Start the development server
npm run dev

### 3. Access the Chat
Open your browser and navigate to:
**http://localhost:3000**

---

## ⚠️ Important Notes
* **Persistence:** Documents are stored in ChromaDB. Once processed, they persist even if you restart the server.
* **Adding New Data:** To add more PDFs, place them in backend/documents/ and call the /process-documents endpoint again.
* **API Access:** Document processing can also be triggered via terminal:
  curl -X POST http://localhost:8000/process-documents
