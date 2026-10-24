from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.core.language import detect_language, LANG_NAMES
from app.core.llm import ask_llm

app = FastAPI(title="Awaaz AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str
    history: list[dict] = []


class ChatResponse(BaseModel):
    reply: str
    detected_language: str
    language_name: str


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Empty message")
    lang = detect_language(req.message)
    try:
        reply = ask_llm(req.message, req.history)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"LLM error: {e}")
    return ChatResponse(
        reply=reply,
        detected_language=lang,
        language_name=LANG_NAMES.get(lang, lang),
    )