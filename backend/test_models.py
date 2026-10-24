import os
import time
import httpx
from dotenv import load_dotenv

load_dotenv()
key = os.getenv("GEMINI_API_KEY")
base = "https://generativelanguage.googleapis.com/v1beta"

r = httpx.get(
    f"{base}/models",
    headers={"x-goog-api-key": key},
    params={"pageSize": 200},
    timeout=60,
)
models = [
    m["name"].split("/")[1]
    for m in r.json().get("models", [])
    if "generateContent" in m.get("supportedGenerationMethods", [])
    and "flash" in m["name"]
    and not any(x in m["name"] for x in ("image", "tts", "live", "audio", "embedding"))
]
models = sorted(models, key=lambda n: ("lite" not in n, n))[:8]
print(len(models), "models to test")

body = {
    "contents": [
        {"role": "user", "parts": [{"text": "mujhe ration card kaise banwana hai"}]}
    ],
    "generationConfig": {"maxOutputTokens": 300},
}

for name in models:
    t = time.time()
    try:
        resp = httpx.post(
            f"{base}/models/{name}:generateContent",
            headers={"x-goog-api-key": key},
            json=body,
            timeout=120,
        )
        print(name, round(time.time() - t, 1), "s", resp.status_code)
    except Exception as e:
        print(name, "error", type(e).__name__)