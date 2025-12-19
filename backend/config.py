import os
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
MODEL_NAME = os.getenv("MODEL_NAME", "nex-agi/deepseek-v3.1-nex-n1:free")
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

# Paths
DOCUMENTS_DIR = "documents"
CHROMA_DB_DIR = "chroma_db"

# RAG settings
EMBEDDING_MODEL = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
TOP_K_RESULTS = 5
CHUNK_SIZE = 1000  # characters per chunk
CHUNK_OVERLAP = 200

# Safety keywords
BAD_PATTERNS = ["самоуби", "самоповред", "убиј", "бомба", "терор", "омраза", "порн"]
MEDICAL_HINTS = ["доза", "лек", "терапија", "симптоми", "дијагноза", "како да се лекувам"]

SYSTEM_PROMPT = """Ти си информативен асистент за правни/нормативни документи (Министерство за здравство на РСМ).

СТРОГО:
- Одговарај ИСКЛУЧИВО врз основа на дадениот КОНТЕКСТ од документите.
- Ако одговорот не е јасно содржан во контекстот, одговори:
  "Не можам сигурно да одговорам врз основа на достапниот документ."

БЕЗБЕДНОСТ:
- Ако прашањето бара личен медицински совет (дијагноза/терапија/доза), одбиј и упати на лекар.
- Одбиј самоповредување, насилство, нелегални активности, омраза, експлицитна содржина.
- Одговори на македонски.
"""