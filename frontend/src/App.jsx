import { useEffect, useRef, useState } from "react";

import {
  AudioLines,
  Mic,
  MicOff,
  ArrowUp,
  ArrowRight,
  Languages,
  Leaf,
  Landmark,
  Scale,
  HeartPulse,
  Sparkles,
  Volume2,
  Plus,
  Check,
  ChevronDown,
  RotateCcw,
  MessageCircle,
  AlertCircle,
} from "lucide-react";

const LANGUAGES = [
  { id: "auto", label: "Auto-detect", code: "en-IN" },
  { id: "hi", label: "हिन्दी", code: "hi-IN" },
  { id: "en", label: "English", code: "en-IN" },
  { id: "bn", label: "বাংলা", code: "bn-IN" },
  { id: "ta", label: "தமிழ்", code: "ta-IN" },
  { id: "te", label: "తెలుగు", code: "te-IN" },
  { id: "mr", label: "मराठी", code: "mr-IN" },
  { id: "gu", label: "ગુજરાતી", code: "gu-IN" },
  { id: "kn", label: "ಕನ್ನಡ", code: "kn-IN" },
  { id: "ml", label: "മലയാളം", code: "ml-IN" },
  { id: "pa", label: "ਪੰਜਾਬੀ", code: "pa-IN" },
  { id: "or", label: "ଓଡ଼ିଆ", code: "or-IN" },
  { id: "ur", label: "اردو", code: "ur-PK" },
];

const SUGGESTIONS = [
  {
    title: "Government schemes",
    description: "Discover benefits and support you may qualify for.",
    question: "Which government schemes can a small farmer apply for?",
    icon: Landmark,
    color: "yellow",
    tag: "BENEFITS & ELIGIBILITY",
  },
  {
    title: "Farming",
    description: "Get practical guidance on crops, soil and seasons.",
    question: "What crops should I sow this month?",
    icon: Leaf,
    color: "green",
    tag: "AGRICULTURE",
  },
  {
    title: "Legal rights",
    description: "Understand your rights and possible next steps.",
    question: "What can I do if my employer refuses to pay my wages?",
    icon: Scale,
    color: "blue",
    tag: "RIGHTS & GUIDANCE",
  },
  {
    title: "Health information",
    description: "Learn about common symptoms and when to seek care.",
    question: "What symptoms mean I should see a doctor?",
    icon: HeartPulse,
    color: "pink",
    tag: "HEALTH & WELLNESS",
  },
];

const TRANSLATIONS = {
  en: {
    greeting: "Your voice. Your language.",
    description:
      "Ask what matters to you. Get helpful answers on farming, government schemes, rights and everyday life.",
    mic: "Tap to speak",
    listening: "Listening to you...",
    languageTitle: "CHOOSE YOUR LANGUAGE",
    suggestions: "How can we help?",
    suggestionSub: "Explore a topic or ask your own question.",
    placeholder: "Ask anything in your language...",
  },
  hi: {
    greeting: "आपकी आवाज़। आपकी भाषा।",
    description:
      "खेती, सरकारी योजनाओं, अधिकारों और रोज़मर्रा की ज़िंदगी के सवालों के जवाब पाएँ।",
    mic: "बोलने के लिए टैप करें",
    listening: "सुन रहे हैं...",
    languageTitle: "अपनी भाषा चुनें",
    suggestions: "हम आपकी कैसे मदद करें?",
    suggestionSub: "कोई विषय चुनें या अपना सवाल पूछें।",
    placeholder: "अपनी भाषा में सवाल पूछें...",
  },
  bn: {
    greeting: "আপনার কণ্ঠ। আপনার ভাষা।",
    description:
      "কৃষি, সরকারি প্রকল্প, অধিকার এবং দৈনন্দিন জীবনের প্রশ্নের উত্তর পান।",
    mic: "বলতে ট্যাপ করুন",
    listening: "শোনা হচ্ছে...",
    languageTitle: "আপনার ভাষা বেছে নিন",
    suggestions: "আমরা কীভাবে সাহায্য করতে পারি?",
    suggestionSub: "একটি বিষয় বেছে নিন অথবা প্রশ্ন করুন।",
    placeholder: "আপনার ভাষায় প্রশ্ন করুন...",
  },
  ta: {
    greeting: "உங்கள் குரல். உங்கள் மொழி.",
    description:
      "விவசாயம், அரசு திட்டங்கள், உரிமைகள் மற்றும் அன்றாடக் கேள்விகளுக்கான உதவியைப் பெறுங்கள்.",
    mic: "பேசத் தட்டவும்",
    listening: "கேட்கிறது...",
    languageTitle: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்",
    suggestions: "நாங்கள் எப்படி உதவலாம்?",
    suggestionSub: "ஒரு தலைப்பைத் தேர்ந்தெடுக்கவும் அல்லது கேள்வி கேட்கவும்.",
    placeholder: "உங்கள் மொழியில் கேளுங்கள்...",
  },
  te: {
    greeting: "మీ స్వరం. మీ భాష.",
    description:
      "వ్యవసాయం, ప్రభుత్వ పథకాలు, హక్కులు మరియు రోజువారీ ప్రశ్నలకు సహాయం పొందండి.",
    mic: "మాట్లాడటానికి నొక్కండి",
    listening: "వింటున్నాం...",
    languageTitle: "మీ భాషను ఎంచుకోండి",
    suggestions: "మేము ఎలా సహాయం చేయగలం?",
    suggestionSub: "ఒక అంశాన్ని ఎంచుకోండి లేదా ప్రశ్న అడగండి.",
    placeholder: "మీ భాషలో ప్రశ్న అడగండి...",
  },
};

function getTranslation(language) {
  return TRANSLATIONS[language] || TRANSLATIONS.en;
}

function getDemoAnswer(question, language) {
  const q = question.toLowerCase();

  if (language === "hi") {
    if (/खेती|फसल|किसान|बीज|बुवाई/.test(q)) {
      return "सही फसल चुनने के लिए अपने क्षेत्र, मिट्टी, मौसम, पानी की उपलब्धता और स्थानीय बाज़ार की माँग पर विचार करें। अपने ज़िले के कृषि विज्ञान केंद्र से स्थानीय सलाह लें।\n\nआप अपना राज्य, ज़िला और मिट्टी का प्रकार बताएँ, तो मैं संभावित विकल्पों की तुलना करने में मदद कर सकता हूँ।";
    }

    if (/योजना|सरकारी|लाभ/.test(q)) {
      return "सरकारी योजनाओं की पात्रता आपके राज्य, आय, व्यवसाय और अन्य शर्तों पर निर्भर करती है। अपने राज्य के आधिकारिक सरकारी पोर्टल या नज़दीकी कॉमन सर्विस सेंटर से शुरुआत करें।\n\nअपना राज्य और अपनी स्थिति बताएँ, तो मैं आपके लिए संबंधित योजनाओं की पहचान करने में मदद कर सकता हूँ। आवेदन करने से पहले आधिकारिक स्रोत से जानकारी सत्यापित करें।";
    }
  }

  if (/farm|crop|sow|seed|farming/.test(q)) {
    return "Choosing the right crop depends on your location, soil type, water availability, season and local market demand.\n\nTell me your state or district, soil type and whether you have irrigation. I can help you compare suitable options. Check your local agricultural department for region-specific recommendations.";
  }

  if (/scheme|government|farmer|benefit|subsidy/.test(q)) {
    return "Government schemes depend on your state, occupation, income and eligibility criteria.\n\nTell me your state and a little about your situation, and I can help you identify relevant schemes to investigate. Always verify application deadlines and eligibility on an official government source.";
  }

  if (/legal|law|wage|rights|salary|employer/.test(q)) {
    return "The right next step depends on your location and circumstances. Keep copies of relevant messages, contracts, payment records and dates. Your local labour department or a legal aid service may be able to help.\n\nIf you share your state and briefly explain the situation, I can help you explore possible next steps. This is general information, not a substitute for advice from a qualified legal professional.";
  }

  if (/health|medical|symptom|doctor|pain/.test(q)) {
    return "I can help you understand general health information, but I cannot diagnose a condition. If symptoms are severe, sudden or rapidly worsening, seek urgent medical care.\n\nTell me what symptoms you are experiencing and how long they have been happening. I can help you understand general possibilities and prepare questions for a healthcare professional.";
  }

  return "Thanks for your question. I'd be happy to help you work through it step by step.\n\nThis is a demonstration response from the Awaaz AI frontend. Once you connect your AI backend, this section can generate real answers tailored to your question and language.\n\nTell me a little more about your situation so I can help you explore the next steps.";
}

function App() {
  const [language, setLanguage] = useState("auto");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [languageMenu, setLanguageMenu] = useState(false);
  const [error, setError] = useState("");
  const [speaking, setSpeaking] = useState(null);

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const currentLanguage =
    LANGUAGES.find((item) => item.id === language) || LANGUAGES[0];

  const copy = getTranslation(language === "auto" ? "en" : language);

  const isChatOpen = messages.length > 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel();
    };
  }, []);

  function changeLanguage(id) {
    setLanguage(id);
    setLanguageMenu(false);
    setError("");
  }

  function newConversation() {
    recognitionRef.current?.stop();
    window.speechSynthesis?.cancel();

    setMessages([]);
    setInput("");
    setLoading(false);
    setListening(false);
    setSpeaking(null);
    setError("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function sendMessage(text = input) {
    const question = text.trim();

    if (!question || loading) return;

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: question,
    };

    setMessages((previous) => [...previous, userMessage]);
    setInput("");
    setError("");
    setLoading(true);

    // DEMO ONLY:
    // Replace this timeout with your actual backend API request.
    window.setTimeout(() => {
      const answer = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: getDemoAnswer(
          question,
          language === "auto" ? "en" : language
        ),
      };

      setMessages((previous) => [...previous, answer]);
      setLoading(false);
    }, 800);
  }

  function startListening() {
    setError("");

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError(
        "Voice recognition is not supported in this browser. Try Chrome or type your question."
      );
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();

    recognitionRef.current = recognition;
    recognition.lang = currentLanguage.code;
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      let transcript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      setInput(transcript);
    };

    recognition.onerror = (event) => {
      setListening(false);

      if (event.error === "not-allowed") {
        setError(
          "Microphone permission is blocked. Allow microphone access in your browser settings."
        );
      } else if (
        event.error !== "no-speech" &&
        event.error !== "aborted"
      ) {
        setError("We couldn't hear that clearly. Please try again.");
      }
    };

    recognition.onend = () => {
      setListening(false);
    };

    try {
      recognition.start();
    } catch {
      setListening(false);
      setError("The microphone couldn't start. Please try again.");
    }
  }

  function readAloud(message) {
    if (!("speechSynthesis" in window)) {
      setError("Audio playback is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(message.text);
    utterance.lang = currentLanguage.code;

    utterance.onstart = () => setSpeaking(message.id);
    utterance.onend = () => setSpeaking(null);
    utterance.onerror = () => setSpeaking(null);

    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className="app">
      {/* HEADER */}
      <header className="topbar">
        <div className="topbar-inner">
          <button className="brand" onClick={newConversation}>
            <span className="brand-icon">
              <AudioLines size={23} strokeWidth={2.5} />
            </span>

            <span className="brand-text">
              Awaaz<span> AI</span>
            </span>
          </button>

          <div className="header-actions">
            <div className="language-dropdown">
              <button
                className="header-language"
                onClick={() => setLanguageMenu(!languageMenu)}
                aria-expanded={languageMenu}
              >
                <Languages size={17} />
                <span>{currentLanguage.label}</span>
                <ChevronDown size={15} />
              </button>

              {languageMenu && (
                <div className="dropdown-panel">
                  {LANGUAGES.map((item) => (
                    <button
                      key={item.id}
                      className={`dropdown-item ${
                        language === item.id ? "selected" : ""
                      }`}
                      onClick={() => changeLanguage(item.id)}
                    >
                      <span>{item.label}</span>
                      {language === item.id && <Check size={16} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="new-chat" onClick={newConversation}>
              <Plus size={17} />
              <span>New question</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className={`main ${isChatOpen ? "chat-mode" : ""}`}>
        {!isChatOpen ? (
          <>
            {/* HERO SECTION */}
            <section className="hero">
              <div className="hero-badge">
                <span className="badge-dot" />
                Information for everyone
              </div>

              <h1>{copy.greeting}</h1>

              <p className="hero-description">{copy.description}</p>

              {/* MICROPHONE */}
              <div className={`voice-area ${listening ? "listening" : ""}`}>
                <div className="voice-ring ring-outer" />
                <div className="voice-ring ring-middle" />
                <div className="voice-ring ring-inner" />

                <button
                  className="mic-button"
                  onClick={startListening}
                  aria-label={listening ? "Stop listening" : "Start speaking"}
                  aria-pressed={listening}
                >
                  {listening ? (
                    <MicOff size={30} />
                  ) : (
                    <Mic size={33} strokeWidth={2.2} />
                  )}
                </button>

                <div className="mic-caption">
                  {listening ? copy.listening : copy.mic}
                </div>
              </div>

              {/* LANGUAGE SELECTOR */}
              <div className="language-section">
                <div className="language-heading">
                  <Languages size={15} />
                  {copy.languageTitle}
                </div>

                <div className="language-pills">
                  {LANGUAGES.map((item) => (
                    <button
                      key={item.id}
                      className={`language-pill ${
                        language === item.id ? "active" : ""
                      }`}
                      onClick={() => changeLanguage(item.id)}
                      aria-pressed={language === item.id}
                    >
                      {item.label}

                      {language === item.id && (
                        <Check size={13} strokeWidth={2.5} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="error-message" role="alert">
                  <AlertCircle size={17} />
                  <span>{error}</span>
                </div>
              )}
            </section>

            {/* SUGGESTION CARDS */}
            <section className="suggestions">
              <div className="section-heading">
                <div>
                  <span className="section-eyebrow">EXPLORE YOUR OPTIONS</span>
                  <h2>{copy.suggestions}</h2>
                  <p>{copy.suggestionSub}</p>
                </div>

                <div className="sparkle-icon">
                  <Sparkles size={21} />
                </div>
              </div>

              <div className="suggestion-grid">
                {SUGGESTIONS.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.title}
                      className={`suggestion-card ${item.color}`}
                      onClick={() => sendMessage(item.question)}
                      disabled={loading}
                    >
                      <div className="suggestion-card-top">
                        <span className="suggestion-icon">
                          <Icon size={21} strokeWidth={1.9} />
                        </span>

                        <span className="suggestion-arrow">
                          <ArrowRight size={18} />
                        </span>
                      </div>

                      <span className="suggestion-tag">{item.tag}</span>

                      <h3>{item.title}</h3>

                      <p>{item.description}</p>
                    </button>
                  );
                })}
              </div>

              <div className="trust-note">
                <MessageCircle size={17} />
                <span>
                  No question is too small. Start wherever you feel comfortable.
                </span>
              </div>
            </section>
          </>
        ) : (
          /* CHAT INTERFACE */
          <section className="conversation">
            <div className="conversation-header">
              <div>
                <span className="assistant-label">
                  <span className="status-dot" />
                  Awaaz AI
                </span>

                <h1>Your conversation</h1>
                <p>Ask a follow-up whenever you're ready.</p>
              </div>

              <button className="reset-button" onClick={newConversation}>
                <RotateCcw size={15} />
                Start over
              </button>
            </div>

            <div className="messages">
              {messages.map((message) => (
                <div
                  className={`message-row ${message.role}`}
                  key={message.id}
                >
                  {message.role === "assistant" && (
                    <div className="assistant-avatar">
                      <AudioLines size={19} />
                    </div>
                  )}

                  <div className="message-content">
                    <div className="message-author">
                      {message.role === "user" ? "You" : "Awaaz AI"}
                    </div>

                    <div className="message-bubble">{message.text}</div>

                    {message.role === "assistant" && (
                      <button
                        className="read-aloud"
                        onClick={() => readAloud(message)}
                      >
                        <Volume2 size={15} />
                        {speaking === message.id
                          ? "Playing audio"
                          : "Read aloud"}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="thinking-row">
                  <div className="assistant-avatar">
                    <AudioLines size={19} />
                  </div>

                  <div className="thinking-bubble">
                    <span className="typing-dots">
                      <i />
                      <i />
                      <i />
                    </span>
                    Thinking of a helpful answer...
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="conversation-disclaimer">
              AI can make mistakes. Verify important information with trusted
              official sources.
            </div>

            {error && (
              <div className="error-message" role="alert">
                <AlertCircle size={17} />
                <span>{error}</span>
              </div>
            )}
          </section>
        )}
      </main>

      {/* FIXED MESSAGE INPUT */}
      <div className={`composer-container ${isChatOpen ? "chat-composer" : ""}`}>
        <form
          className="composer"
          onSubmit={(event) => {
            event.preventDefault();
            sendMessage();
          }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={copy.placeholder}
            aria-label="Ask Awaaz AI a question"
            disabled={loading}
          />

          <button
            type="button"
            className={`composer-mic ${listening ? "recording" : ""}`}
            onClick={startListening}
            aria-label="Use voice input"
            disabled={loading}
          >
            <Mic size={19} />
          </button>

          <button
            type="submit"
            className="send-button"
            aria-label="Send question"
            disabled={!input.trim() || loading}
          >
            <ArrowUp size={22} strokeWidth={2.3} />
          </button>
        </form>

        <p className="composer-caption">
          Speak or type. Help is just a question away.
        </p>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <span>Making information accessible to everyone.</span>

        <span className="footer-status">
          <span className="status-dot" />
          Awaaz AI Demo
        </span>
      </footer>
    </div>
  );
}

export default App;