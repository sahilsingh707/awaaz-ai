import os
import time
import socket
import httpx
from dotenv import load_dotenv

load_dotenv()
key = os.getenv("GEMINI_API_KEY")
model = os.getenv("LLM_MODEL")
host = "generativelanguage.googleapis.com"

t = time.time()
infos = socket.getaddrinfo(host, 443)
print("dns", round(time.time() - t, 2), "s", sorted({i[0].name for i in infos}))

t = time.time()
s = socket.create_connection((host, 443), timeout=60)
print("tcp connect", round(time.time() - t, 2), "s")
s.close()

url = f"https://{host}/v1beta/models/{model}:generateContent"
plain = {"contents": [{"role": "user", "parts": [{"text": "say hi in one word"}]}]}
tuned = {
    "contents": [{"role": "user", "parts": [{"text": "say hi in one word"}]}],
    "generationConfig": {
        "maxOutputTokens": 600,
        "thinkingConfig": {"thinkingLevel": "low"},
    },
}

for name, body in [("plain", plain), ("tuned", tuned)]:
    t = time.time()
    r = httpx.post(url, headers={"x-goog-api-key": key}, json=body, timeout=240)
    print(name, "api call", round(time.time() - t, 2), "s", "status", r.status_code)