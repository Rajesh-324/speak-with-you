"use client";

import AuthGuard from "@/components/ui/AuthGuard";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect, useRef, useCallback } from "react";
import { saveFriendMessage, getFriendHistory, incrementSpeakingMinutes } from "@/lib/firestore";
import Link from "next/link";

export default function FriendPage() {
  return (
    <AuthGuard>
      <FriendChatContent />
    </AuthGuard>
  );
}

const DAILY_TOPICS = [
  { topic: "🎬 Talk about your favorite movie", prompt: "My favorite movie is..." },
  { topic: "🍕 Share your favorite food recipes", prompt: "I love eating..." },
  { topic: "✈ Describe your dream travel destination", prompt: "If I could travel anywhere, I would go to..." },
  { topic: "🧸 Tell me about a childhood dream", prompt: "When I was young, I dreamed of..." },
  { topic: "🌞 Discuss how you plan your weekends", prompt: "On weekends, I usually..." },
];

function FriendChatContent() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string; id: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);

  // Voice States
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPushToTalk, setIsPushToTalk] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Detect Speech Recognition support on load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSpeechSupported(false);
      }
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 1. Fetch History from Firestore on Load
  useEffect(() => {
    if (!user) return;
    const loadHistory = async () => {
      try {
        const hist = await getFriendHistory(user.uid);
        if (hist.length > 0) {
          setMessages(hist.map((h, i) => ({ ...h, id: `hist-${i}` })));
        } else {
          // Greeting
          const initialGreeting = "Hi there! I am your AI English coach Buddy. I'm so excited to practice English conversation with you today. What would you like to talk about?";
          setMessages([{ role: "assistant", content: initialGreeting, id: "init" }]);
        }
      } catch (err) {
        console.error("Failed to load friend history:", err);
      } finally {
        setHistoryLoading(false);
      }
    };
    loadHistory();
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // 2. Text to Speech
  const speakText = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(
      (v) => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Natural"))
    );
    if (naturalVoice) utterance.voice = naturalVoice;

    utterance.onend = () => {
      setIsSpeaking(false);
      // Auto-listen if continuous voice mode is on
      if (isVoiceMode && !isPushToTalk) {
        startSpeechRecognition();
      }
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
    };
    window.speechSynthesis.speak(utterance);
  }, [isVoiceMode, isPushToTalk]);

  // 3. Speech to Text Recognition
  const startSpeechRecognition = useCallback(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    try {
      if (recognitionRef.current) recognitionRef.current.abort();

      const rec = new SpeechRecognition();
      recognitionRef.current = rec;
      rec.lang = "en-US";
      rec.continuous = false;
      rec.interimResults = false;

      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? prev + " " + transcript : transcript));
      };
      rec.start();
    } catch (err) {
      console.error(err);
    }
  }, []);

  const stopSpeechRecognition = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  // 4. Send Message Handler
  const handleSend = async (textToSend = input) => {
    if (!textToSend.trim() || loading || !user) return;
    setInput("");
    setLoading(true);

    const userMsg = { role: "user" as const, content: textToSend.trim(), id: `msg-${Date.now()}` };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    // Increment speaking minutes in progress (estimate 0.5 minutes per response)
    try {
      await saveFriendMessage(user.uid, "user", userMsg.content);
      await incrementSpeakingMinutes(user.uid, 0.5);
    } catch (e) {
      console.warn("Saving user message error:", e);
    }

    try {
      const response = await fetch("/api/friend/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) throw new Error("Friend chat call failed");
      const data = await response.json();

      const assistantMsg = { role: "assistant" as const, content: data.response, id: `msg-ai-${Date.now()}` };
      setMessages((prev) => [...prev, assistantMsg]);
      setLoading(false);

      // Save AI reply in Firestore
      try {
        await saveFriendMessage(user.uid, "assistant", assistantMsg.content);
      } catch (e) {
        console.warn("Saving AI message error:", e);
      }

      if (isVoiceMode) {
        speakText(assistantMsg.content);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // Keyboard Space Bar listener for Push-to-Talk
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && isPushToTalk && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        if (!isListening) {
          startSpeechRecognition();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space" && isPushToTalk) {
        e.preventDefault();
        stopSpeechRecognition();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isPushToTalk, isListening, startSpeechRecognition, stopSpeechRecognition]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/20 to-slate-950 text-white flex flex-col">
      {/* HEADER */}
      <header className="border-b border-white/5 bg-slate-900/50 backdrop-blur-md py-4 px-4 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-md sm:text-lg font-bold flex items-center gap-2">
                <span>🤖</span> AI English Friend Buddy
              </h1>
              <p className="text-xs text-emerald-400">Online • Casual conversation practice</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (!isSpeechSupported) {
                  alert("Voice mode requires Speech Recognition which is not supported in this browser.");
                  return;
                }
                setIsVoiceMode(!isVoiceMode);
                if (isVoiceMode) {
                  if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
                  stopSpeechRecognition();
                } else if (messages.length > 0) {
                  speakText(messages[messages.length - 1].content);
                }
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                isVoiceMode
                  ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300"
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
              }`}
            >
              {isVoiceMode ? "🔊 Voice Mode On" : "🔇 Voice Mode Off"}
            </button>
          </div>
        </div>
      </header>

      {/* WORKSPACE AREA */}
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        
        {/* Dialogue Feed */}
        <div className="flex-1 flex flex-col bg-slate-900/40 border border-white/5 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
          {historyLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 border-4 border-indigo-400 border-t-indigo-600 rounded-full animate-spin" />
              <p className="text-xs text-slate-500">Retrieving previous conversations...</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[55vh] sm:max-h-[60vh] custom-scrollbar">
              {messages.map((m) => {
                const isUser = m.role === "user";
                return (
                  <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                    <div className={`flex gap-3 max-w-[85%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center font-bold text-xs shadow-md ${
                        isUser ? "bg-indigo-600 text-white" : "bg-slate-800 text-indigo-400 border border-slate-700"
                      }`}>
                        {isUser ? "U" : "B"}
                      </div>
                      
                      {/* Text Bubble */}
                      <div className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                        isUser 
                          ? "bg-indigo-600/90 text-white rounded-tr-none" 
                          : "bg-slate-800/80 text-slate-100 border border-slate-700/40 rounded-tl-none"
                      }`}>
                        {m.content}
                      </div>
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="flex justify-start items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700 animate-pulse text-[10px] text-indigo-400">
                    B
                  </div>
                  <div className="bg-slate-800/40 border border-slate-700/30 rounded-2xl rounded-tl-none p-3.5 text-xs text-indigo-400 flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    Buddy is typing...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* CHAT INPUT BAR */}
          <div className="p-4 border-t border-white/5 bg-slate-900/80">
            {isVoiceMode && (
              <div className="flex items-center justify-between bg-slate-800/30 border border-white/5 rounded-xl px-3 py-2 mb-3 text-xs">
                <span className="text-slate-400 font-semibold">Voice Settings</span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsPushToTalk(!isPushToTalk)}
                    className={`font-bold transition-colors ${
                      isPushToTalk ? "text-rose-400" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {isPushToTalk ? "🔘 Push-To-Talk Active" : "🔄 Continuous Mic Mode"}
                  </button>
                </div>
              </div>
            )}

            {(isSpeaking || isListening) && (
              <div className="flex items-center gap-3 px-3 py-2 bg-slate-800/40 border border-white/5 rounded-xl mb-3 text-xs justify-center">
                {isSpeaking && <div className="text-indigo-400 font-semibold animate-pulse">Buddy is speaking out loud...</div>}
                {isListening && (
                  <div className="flex items-center gap-2 text-rose-400 font-semibold animate-pulse">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                    </span>
                    Listening (Speak now)...
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onMouseDown={() => {
                  if (isSpeechSupported && isPushToTalk) startSpeechRecognition();
                }}
                onMouseUp={() => {
                  if (isSpeechSupported && isPushToTalk) stopSpeechRecognition();
                }}
                onClick={() => {
                  if (isSpeechSupported && !isPushToTalk) {
                    if (isListening) stopSpeechRecognition();
                    else startSpeechRecognition();
                  }
                }}
                disabled={loading || !isSpeechSupported}
                className={`p-3 rounded-xl border shrink-0 transition-all ${
                  isListening
                    ? "bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse shadow-lg shadow-rose-500/10"
                    : !isSpeechSupported
                    ? "bg-slate-900 text-slate-600 border-slate-800/40 cursor-not-allowed opacity-50"
                    : "bg-slate-800 text-slate-400 hover:text-white border-slate-700 hover:bg-slate-700"
                }`}
                title={
                  !isSpeechSupported
                    ? "Speech recognition is not supported in this browser"
                    : isPushToTalk
                    ? "Hold down to speak, release to send"
                    : "Click to speak"
                }
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                placeholder={
                  !isSpeechSupported
                    ? "Speech recognition is not supported in this browser. Type here..."
                    : isPushToTalk
                    ? "Press Space or hold Mic to Speak..."
                    : isListening
                    ? "Listening..."
                    : "Say something to Buddy..."
                }
                disabled={loading}
                className="flex-1 bg-slate-800 border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 disabled:opacity-50"
              />

              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="p-3 rounded-xl bg-indigo-600 text-white font-semibold disabled:opacity-50 shadow-md active:scale-[0.98] transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9-2-9-9-9 9 9 2zm0 0v-8" />
                </svg>
              </button>
            </div>
            
            {isPushToTalk && (
              <p className="text-center text-[10px] text-slate-500 mt-2">
                💡 Keyboard Pro-tip: Press and hold <kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 font-bold">Spacebar</kbd> outside inputs to speak, and release to submit!
              </p>
            )}
          </div>
        </div>

        {/* Right Sidebar: Topics Suggestions */}
        <div className="w-full md:w-64 shrink-0 space-y-4">
          <div className="glass-card p-5">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">💬 Daily Chat Topics</h3>
            <p className="text-[11px] text-slate-500 mb-4">Click a topic below to kickstart your daily practice dialogue:</p>
            <div className="space-y-2.5">
              {DAILY_TOPICS.map((topic, index) => (
                <button
                  key={index}
                  onClick={() => handleSend(topic.prompt)}
                  className="w-full text-left p-3 rounded-xl bg-white/[0.02] hover:bg-indigo-500/10 border border-white/5 hover:border-indigo-500/30 text-xs text-slate-300 hover:text-white transition-all duration-200"
                >
                  {topic.topic}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card p-5 space-y-2 text-xs text-slate-400 leading-relaxed">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">🎓 Conversation Tips</h3>
            <p>1. Talk casually! Buddy is a friend, so you don't need to be formal.</p>
            <p>2. If you make a mistake, Buddy will gently help you correct it without grading you down.</p>
            <p>3. Spend 5-10 minutes daily speaking with Buddy to improve fluency scores.</p>
          </div>
        </div>

      </div>

      {/* SCROLLBAR STYLE */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.15);
        }
      `}</style>
    </div>
  );
}
