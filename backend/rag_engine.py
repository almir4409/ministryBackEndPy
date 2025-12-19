import os
import re
from typing import List, Dict, Tuple
from pypdf import PdfReader
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings
import numpy as np
from openai import OpenAI
from config import *

class RAGEngine:
    def __init__(self):
        """Initialize the RAG engine with embedding model and vector DB"""
        print("🚀 Initializing RAG Engine...")
        
        # Load embedding model
        self.embed_model = SentenceTransformer(EMBEDDING_MODEL)
        print(f"✅ Loaded embedding model: {EMBEDDING_MODEL}")
        
        # Initialize ChromaDB
        os.makedirs(CHROMA_DB_DIR, exist_ok=True)
        self.chroma_client = chromadb.PersistentClient(path=CHROMA_DB_DIR)
        self.collection = self.chroma_client.get_or_create_collection(
            name="legal_documents",
            metadata={"hnsw:space": "cosine"}
        )
        print(f"✅ ChromaDB initialized: {self.collection.count()} documents")
        
        # Initialize OpenRouter client
        self.llm_client = OpenAI(
            base_url=OPENROUTER_BASE_URL,
            api_key=OPENROUTER_API_KEY
        )
        print("✅ OpenRouter client ready")
    
    def extract_pdf_text(self, pdf_path: str) -> str:
        """Extract text from PDF file"""
        reader = PdfReader(pdf_path)
        texts = []
        for page in reader.pages:
            text = page.extract_text() or ""
            texts.append(text)
        return "\n".join(texts)
    
    def chunk_by_articles(self, text: str, pdf_name: str) -> List[Dict]:
        """
        Split text by 'Член' (Article) markers.
        Falls back to fixed-size chunks if no articles found.
        """
        # Normalize whitespace
        text = re.sub(r"\r\n", "\n", text)
        text = re.sub(r"[ \t]+", " ", text)
        
        # Try to find articles
        pattern = re.compile(r"(?m)^\s*Член\s+(\d+)\s*", re.UNICODE)
        matches = list(pattern.finditer(text))
        
        chunks = []
        
        if matches:
            # Split by articles
            for idx, match in enumerate(matches):
                article_num = int(match.group(1))
                start = match.start()
                end = matches[idx + 1].start() if idx + 1 < len(matches) else len(text)
                article_text = text[start:end].strip()
                
                if article_text:
                    chunks.append({
                        "text": article_text,
                        "metadata": {
                            "pdf": pdf_name,
                            "article": article_num,
                            "type": "article"
                        }
                    })
        else:
            # Fallback: fixed-size chunks
            text_clean = text.strip()
            for i in range(0, len(text_clean), CHUNK_SIZE - CHUNK_OVERLAP):
                chunk_text = text_clean[i:i + CHUNK_SIZE]
                if chunk_text:
                    chunks.append({
                        "text": chunk_text,
                        "metadata": {
                            "pdf": pdf_name,
                            "chunk_index": i // (CHUNK_SIZE - CHUNK_OVERLAP),
                            "type": "chunk"
                        }
                    })
        
        return chunks
    
    def process_pdf(self, pdf_path: str) -> int:
        """Process a single PDF and add to vector database"""
        pdf_name = os.path.basename(pdf_path)
        print(f"📄 Processing: {pdf_name}")
        
        # Extract text
        raw_text = self.extract_pdf_text(pdf_path)
        print(f"   Extracted {len(raw_text)} characters")
        
        # Chunk the text
        chunks = self.chunk_by_articles(raw_text, pdf_name)
        print(f"   Created {len(chunks)} chunks")
        
        if not chunks:
            print(f"   ⚠️  No content extracted from {pdf_name}")
            return 0
        
        # Generate embeddings
        texts = [c["text"] for c in chunks]
        embeddings = self.embed_model.encode(
            texts,
            normalize_embeddings=True,
            show_progress_bar=False
        )
        
        # Prepare data for ChromaDB
        ids = [f"{pdf_name}-{i}" for i in range(len(chunks))]
        metadatas = [c["metadata"] for c in chunks]
        
        # Add to vector database
        self.collection.add(
            ids=ids,
            documents=texts,
            embeddings=embeddings.tolist(),
            metadatas=metadatas
        )
        
        print(f"   ✅ Added {len(chunks)} chunks to database")
        return len(chunks)
    
    def process_all_documents(self, documents_dir: str = DOCUMENTS_DIR) -> Dict:
        """Process all PDFs in the documents directory"""
        os.makedirs(documents_dir, exist_ok=True)
        
        pdf_files = [f for f in os.listdir(documents_dir) if f.endswith('.pdf')]
        
        if not pdf_files:
            return {
                "status": "warning",
                "message": f"No PDF files found in {documents_dir}",
                "processed": 0
            }
        
        total_chunks = 0
        processed_files = []
        
        for pdf_file in pdf_files:
            pdf_path = os.path.join(documents_dir, pdf_file)
            try:
                chunks = self.process_pdf(pdf_path)
                total_chunks += chunks
                processed_files.append(pdf_file)
            except Exception as e:
                print(f"   ❌ Error processing {pdf_file}: {str(e)}")
        
        return {
            "status": "success",
            "message": f"Processed {len(processed_files)} PDFs",
            "processed": len(processed_files),
            "total_chunks": total_chunks,
            "files": processed_files
        }
    
    def retrieve(self, question: str, top_k: int = TOP_K_RESULTS) -> List[Tuple]:
        """Retrieve most relevant chunks for a question"""
        # Generate query embedding
        q_emb = self.embed_model.encode([question], normalize_embeddings=True)[0].tolist()
        
        # Query ChromaDB
        results = self.collection.query(
            query_embeddings=[q_emb],
            n_results=top_k,
            include=["documents", "metadatas", "distances"]
        )
        
        # Unpack results
        docs = results["documents"][0]
        metas = results["metadatas"][0]
        dists = results["distances"][0]
        
        return list(zip(docs, metas, dists))
    
    def safety_check(self, question: str) -> Tuple[bool, str]:
        """Check if question contains harmful content"""
        q_lower = question.lower()
        
        # Check for harmful patterns
        if any(pattern in q_lower for pattern in BAD_PATTERNS):
            return False, "Не можам да помогнам со тоа барање."
        
        # Check for medical advice requests
        if any(hint in q_lower for hint in MEDICAL_HINTS):
            return False, (
                "Не можам да дадам личен медицински совет. "
                "Ве молам консултирајте лекар или здравствена установа."
            )
        
        return True, ""
    
    def ask(self, question: str, top_k: int = TOP_K_RESULTS) -> Dict:
        """Main RAG query function"""
        # Safety check
        is_safe, safety_msg = self.safety_check(question)
        if not is_safe:
            return {
                "answer": safety_msg,
                "sources": [],
                "safe": False
            }
        
        # Retrieve relevant chunks
        hits = self.retrieve(question, top_k=top_k)
        
        if not hits:
            return {
                "answer": "Не пронајдов релевантни информации во документите.",
                "sources": [],
                "safe": True
            }
        
        # Build context
        context_blocks = []
        sources = []
        
        for doc, meta, dist in hits:
            source_info = f"[Извор: {meta.get('pdf')}"
            if meta.get('article'):
                source_info += f" | Член {meta.get('article')}"
            source_info += f" | релевантност={1-dist:.2f}]"
            
            context_blocks.append(f"{source_info}\n{doc}")
            sources.append({
                "pdf": meta.get('pdf'),
                "article": meta.get('article'),
                "relevance": round(1-dist, 2),
                "preview": doc[:200] + "..." if len(doc) > 200 else doc
            })
        
        context = "\n\n---\n\n".join(context_blocks)
        
        # Build prompt
        user_prompt = f"""КОНТЕКСТ (извадок од документи):
{context}

ПРАШАЊЕ:
{question}

ИНСТРУКЦИЈА:
Одговори само врз основа на контекстот. Ако не можеш, кажи дека не можеш сигурно врз основа на документот.
"""
        
        # Call LLM
        try:
            completion = self.llm_client.chat.completions.create(
                model=MODEL_NAME,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=800,
                temperature=0.2,
            )
            
            answer = completion.choices[0].message.content
            
            return {
                "answer": answer,
                "sources": sources,
                "safe": True
            }
        
        except Exception as e:
            return {
                "answer": f"Грешка при генерирање одговор: {str(e)}",
                "sources": sources,
                "safe": True
            }
    
    def get_stats(self) -> Dict:
        """Get database statistics"""
        count = self.collection.count()
        
        # Get unique PDFs
        if count > 0:
            results = self.collection.get(limit=count, include=["metadatas"])
            pdfs = set(meta.get('pdf', 'unknown') for meta in results['metadatas'])
        else:
            pdfs = set()
        
        return {
            "total_chunks": count,
            "total_pdfs": len(pdfs),
            "pdfs": list(pdfs)
        }
    
    def clear_database(self):
        """Clear all data from the vector database"""
        self.chroma_client.delete_collection(name="legal_documents")
        self.collection = self.chroma_client.get_or_create_collection(
            name="legal_documents",
            metadata={"hnsw:space": "cosine"}
        )
        print("🗑️  Database cleared")