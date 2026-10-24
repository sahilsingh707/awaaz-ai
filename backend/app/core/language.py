from langdetect import detect, DetectorFactory

DetectorFactory.seed = 0

LANG_NAMES = {
    "en": "English", "hi": "Hindi", "bn": "Bengali", "mr": "Marathi",
    "te": "Telugu", "ta": "Tamil", "gu": "Gujarati", "kn": "Kannada",
    "ml": "Malayalam", "pa": "Punjabi", "ur": "Urdu", "or": "Odia",
}


def has_odia(text: str) -> bool:
    return any("\u0b00" <= ch <= "\u0b7f" for ch in text)


def detect_language(text: str) -> str:
    if has_odia(text):
        return "or"
    try:
        return detect(text)
    except Exception:
        return "en"