import os
import time
import httpx
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
MODEL = os.getenv("LLM_MODEL")
URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"

SYSTEM_PROMPT = """You are Awaaz AI, a voice-first assistant for Indian citizens.
- Always reply in the same language and script the user writes in.
  If the user writes Hinglish (romanized Hindi), reply in Hinglish.
- Use simple, short, clear sentences. Many users have low literacy.
- Keep every answer under 5 short sentences unless the user asks for more detail.
- If you are not sure about something, say so and suggest the official
  office, website, or helpline instead of guessing.
- Never give final medical or legal decisions; give general information only."""

client = httpx.Client(
    transport=httpx.HTTPTransport(local_address="0.0.0.0"),
    timeout=180,
)


def ask_llm(message: str, history: list[dict] | None = None) -> str:
    if not API_KEY or not MODEL:
        raise RuntimeError("GEMINI_API_KEY or LLM_MODEL is missing in .env")

    contents = []
    for turn in history or []:
        role = "model" if turn.get("role") == "assistant" else "user"
        contents.append({"role": role, "parts": [{"text": turn.get("content", "")}]})
    contents.append({"role": "user", "parts": [{"text": message}]})

    body = {
        "system_instruction": {"parts": [{"text": SYSTEM_PROMPT}]},
        "contents": contents,
        "generationConfig": {
            "maxOutputTokens": 350,
            "thinkingConfig": {"thinkingLevel": "low"},
        },
    }
    
    for attempt in range(3):
        response = client.post(
            URL.format(model=MODEL),
            headers={"x-goog-api-key": API_KEY, "Content-Type": "application/json"},
            json=body,
        )
        if response.status_code in (429, 503) and attempt < 2:
            time.sleep(2 * (attempt + 1))
            continue
        break
    response.raise_for_status()
    data = response.json()
    parts = data["candidates"][0]["content"]["parts"]
    return "".join(p.get("text", "") for p in parts)