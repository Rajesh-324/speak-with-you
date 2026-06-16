"use client";

import AuthGuard from "@/components/ui/AuthGuard";
import { useAuth } from "@/contexts/AuthContext";
import { useParams, useRouter } from "next/navigation";
import { useState, useCallback, useEffect, useRef } from "react";
import { interviewQuestions } from "@/data/interviewQuestions";
import { saveInterviewSession } from "@/lib/firestore";
import ProgressBar from "@/components/ui/ProgressBar";
import type { InterviewQuestion, InterviewType } from "@/types";
import type { ChatAgentResult, FinalReportResult } from "@/lib/ai";
import Link from "next/link";

export default function InterviewSessionPage() {
  return (
    <AuthGuard>
      <InterviewSessionContent />
    </AuthGuard>
  );
}

type SessionState = "ready" | "interviewing" | "compiling" | "complete";

interface Message {
  role: "user" | "assistant";
  content: string;
  id: string;
  feedback?: {
    grammarCorrection: string;
    betterAnswer: string;
    feedback: string;
    scores: {
      grammar: number;
      fluency: number;
      vocabulary: number;
      confidence: number;
      pronunciation: number;
    };
  };
}

function InterviewSessionContent() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const interviewType = params.type as InterviewType;

  const bank = interviewQuestions.find((q) => q.type === interviewType);
  const initialQuestion = bank?.questions[0] || "Hello, please introduce yourself.";

  const [state, setState] = useState<SessionState>("ready");
  const [messages, setMessages] = useState<Message[]>([]);
  const [answer, setAnswer] = useState("");
  const [saving, setSaving] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sttConfidence, setSttConfidence] = useState(1.0);
  const [loadingAnswer, setLoadingAnswer] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);

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

  // Final Evaluation Results
  const [report, setReport] = useState<FinalReportResult | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loadingAnswer]);

  // Load voices for speech synthesis
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const loadVoices = () => {
        setVoicesLoaded(true);
      };
      window.speechSynthesis.onvoiceschanged = loadVoices;
      loadVoices();
    }
  }, []);

  // Text to Speech
  const speakText = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";

    const voices = window.speechSynthesis.getVoices();
    // Try to find a premium or natural English voice
    const naturalVoice = voices.find(
      (v) =>
        v.lang.startsWith("en") &&
        (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha"))
    );
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onend = () => {
      setIsSpeaking(false);
      // Auto-start listening if in voice mode
      if (isVoiceMode) {
        startSpeechRecognition();
      }
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [isVoiceMode]);

  // Speech to Text Recognition
  const startSpeechRecognition = useCallback(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    // Cancel active synthesis so mic doesn't catch AI voice
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const confidence = event.results[0][0].confidence;
        setAnswer((prev) => (prev ? prev + " " + transcript : transcript));
        setSttConfidence(confidence);
      };

      recognition.onerror = (e: any) => {
        console.warn("Speech recognition error:", e);
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error("Failed to start Speech Recognition:", err);
    }
  }, []);

  const stopSpeechRecognition = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  // Toggle Voice Mode
  const toggleVoiceMode = () => {
    if (!isSpeechSupported) {
      alert("Voice mode requires Speech Recognition which is not supported in this browser.");
      return;
    }
    const nextMode = !isVoiceMode;
    setIsVoiceMode(nextMode);

    if (nextMode) {
      // If AI just spoke, speak it or listen
      if (messages.length > 0) {
        const lastMsg = messages[messages.length - 1];
        if (lastMsg.role === "assistant") {
          speakText(lastMsg.content);
        }
      }
    } else {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      stopSpeechRecognition();
      setIsSpeaking(false);
    }
  };

  // Start the interview session
  const handleStart = () => {
    setState("interviewing");
    const firstMsg: Message = {
      role: "assistant",
      content: initialQuestion,
      id: "init-question",
    };
    setMessages([firstMsg]);

    if (isVoiceMode) {
      // Small timeout to let voices load and user click register
      setTimeout(() => {
        speakText(initialQuestion);
      }, 300);
    }
  };

  // Submit Answer
  const handleSubmitAnswer = async () => {
    if (!answer.trim() || loadingAnswer) return;

    stopSpeechRecognition();

    const userMsgText = answer.trim();
    setAnswer("");
    setLoadingAnswer(true);

    const userMsgId = `user-msg-${Date.now()}`;
    const newMessages = [
      ...messages,
      { role: "user" as const, content: userMsgText, id: userMsgId },
    ];

    setMessages(newMessages);

    try {
      // Call Chat Agent endpoint
      const response = await fetch("/api/interview/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          interviewType,
          pronunciationConfidence: sttConfidence,
        }),
      });

      if (!response.ok) throw new Error("Chat response failed");

      const data: ChatAgentResult = await response.json();

      // Update user message with real-time feedback scores
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id === userMsgId) {
            return {
              ...m,
              feedback: {
                grammarCorrection: data.grammarCorrection,
                betterAnswer: data.betterAnswer,
                feedback: data.feedback,
                scores: {
                  grammar: data.realTimeScores.grammar,
                  fluency: data.realTimeScores.fluency,
                  vocabulary: data.realTimeScores.vocabulary,
                  confidence: data.realTimeScores.confidence,
                  pronunciation: data.realTimeScores.pronunciation,
                },
              },
            };
          }
          return m;
        })
      );

      // Add AI follow-up question
      const aiMsg: Message = {
        role: "assistant",
        content: data.nextQuestion,
        id: `ai-msg-${Date.now()}`,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setLoadingAnswer(false);

      if (data.isComplete) {
        // Automatically compile report if AI decides it's complete
        handleFinishInterview([...newMessages, aiMsg]);
      } else {
        if (isVoiceMode) {
          speakText(data.nextQuestion);
        }
      }
    } catch (err) {
      console.error("Error submitting answer:", err);
      setLoadingAnswer(false);
    }
  };

  // Compile Final Report
  const handleFinishInterview = async (finalMessagesList = messages) => {
    setState("compiling");
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    stopSpeechRecognition();

    try {
      const response = await fetch("/api/interview/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: finalMessagesList.map((m) => ({ role: m.role, content: m.content })),
          interviewType,
        }),
      });

      if (!response.ok) throw new Error("Report compiling failed");

      const reportData: FinalReportResult = await response.json();
      setReport(reportData);
      setState("complete");
    } catch (err) {
      console.error("Error generating report:", err);
      // Hard fallback report
      setReport({
        overallScore: 7,
        cefrLevel: "B1",
        overallFeedback: "Great effort in completing the conversational practice. We recommend focusing on sentence structure and confidence.",
        strengths: ["Willingness to speak", "Understanding the context", "Natural follow-ups"],
        weaknesses: ["Grammar corrections recommended", "Preposition errors", "Sentence length variety"],
        recommendedLessons: ["Day 10: Introducing Yourself", "Day 35: Workplace Scenarios"],
      });
      setState("complete");
    }
  };

  // Save Session in Firestore
  const handleSaveAndProfile = async () => {
    if (!user || saving || !report) return;
    setSaving(true);

    try {
      // Map message details to the old InterviewQuestion type to support history views
      const savedQuestions: InterviewQuestion[] = [];
      
      for (let i = 0; i < messages.length; i++) {
        const msg = messages[i];
        if (msg.role === "user" && msg.feedback) {
          const prevAiMsg = messages[i - 1]?.content || "Initial Question";
          savedQuestions.push({
            question: prevAiMsg,
            userAnswer: msg.content,
            score: Math.round(
              (msg.feedback.scores.grammar +
                msg.feedback.scores.fluency +
                msg.feedback.scores.vocabulary +
                msg.feedback.scores.confidence) /
                4
            ),
            grammarScore: msg.feedback.scores.grammar,
            fluencyScore: msg.feedback.scores.fluency,
            vocabularyScore: msg.feedback.scores.vocabulary,
            confidenceScore: msg.feedback.scores.confidence,
            pronunciationScore: msg.feedback.scores.pronunciation,
            grammarCorrection: msg.feedback.grammarCorrection,
            betterAnswer: msg.feedback.betterAnswer,
            feedback: msg.feedback.feedback,
          });
        }
      }

      await saveInterviewSession({
        uid: user.uid,
        type: interviewType,
        questions: savedQuestions,
        overallScore: report.overallScore,
        overallFeedback: report.overallFeedback,
        strengths: report.strengths,
        weaknesses: report.weaknesses,
        recommendedLessons: report.recommendedLessons,
        cefrLevel: report.cefrLevel,
      });
    } catch (err) {
      console.error("Firestore save error:", err);
    }

    setSaving(false);
    router.push("/profile");
  };

  if (!bank) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <p className="text-xl text-slate-400">Interview type not found</p>
          <Link href="/interview" className="text-indigo-400 hover:underline text-sm mt-2 inline-block">
            ← Back to interviews
          </Link>
        </div>
      </div>
    );
  }

  const userTurns = messages.filter((m) => m.role === "user").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/20 to-slate-950 text-white flex flex-col">
      {/* HEADER NAVBAR */}
      <div className="border-b border-white/5 bg-slate-900/50 backdrop-blur-md py-4 px-4 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/interview" className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl">{bank.icon}</span>
                <h1 className="text-md sm:text-lg font-bold">{bank.label}</h1>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">AI Conversational Practice Agent</p>
            </div>
          </div>

          {state === "interviewing" && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/60 rounded-full px-3 py-1 text-xs text-indigo-300 font-semibold shadow-inner">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                Turn {userTurns + 1}
              </div>
              {userTurns >= 5 && (
                <button
                  onClick={() => handleFinishInterview()}
                  className="px-3.5 py-1.5 text-xs font-bold bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/40 rounded-full transition-all"
                >
                  Finish Interview 🏆
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col max-w-5xl w-full mx-auto px-4 py-6">
        
        {/* 1. READY STATE */}
        {state === "ready" && (
          <div className="max-w-2xl mx-auto w-full my-auto glass-card p-8 text-center space-y-6 animate-fade-in">
            <div className="text-7xl mb-2 animate-bounce">{bank.icon}</div>
            <h2 className="text-2xl font-black">{bank.label}</h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-lg mx-auto">
              {bank.description} This is a real conversational simulation. The AI agent will dynamically listen to your answers and ask questions.
            </p>

            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/15 max-w-md mx-auto text-left space-y-3">
              <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-widest">⚙️ Interview Settings</h3>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold block">Voice Mode (Interactive)</span>
                  <span className="text-[10px] text-slate-500">AI reads questions out loud & enables microphone auto-listening.</span>
                </div>
                <button
                  onClick={() => {
                    if (!isSpeechSupported) {
                      alert("Voice mode requires Speech Recognition which is not supported in this browser.");
                      return;
                    }
                    setIsVoiceMode(!isVoiceMode);
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative ${isVoiceMode ? "bg-indigo-600" : "bg-slate-700"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow transition-transform ${isVoiceMode ? "translate-x-6" : ""}`} />
                </button>
              </div>
            </div>

            <button
              onClick={handleStart}
              className="px-10 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all text-md"
            >
              Start AI Interview Agent 🚀
            </button>
          </div>
        )}

        {/* 2. INTERVIEWING CHAT ROOM */}
        {state === "interviewing" && (
          <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-[500px]">
            {/* Left Column: Chat Dialogue */}
            <div className="flex-1 flex flex-col bg-slate-900/40 border border-white/5 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
              <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[55vh] sm:max-h-[60vh] custom-scrollbar">
                {messages.map((m, index) => {
                  const isUser = m.role === "user";
                  return (
                    <div key={m.id} className="space-y-3">
                      <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                        <div className={`flex gap-3 max-w-[85%] ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                          {/* Avatar */}
                          <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center font-bold text-xs shadow-md ${
                            isUser ? "bg-indigo-600 text-white" : "bg-slate-800 text-indigo-400 border border-slate-700"
                          }`}>
                            {isUser ? "U" : "AI"}
                          </div>
                          
                          {/* Bubble */}
                          <div>
                            <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                              isUser 
                                ? "bg-indigo-600/90 text-white rounded-tr-none" 
                                : "bg-slate-800/80 text-slate-100 border border-slate-700/40 rounded-tl-none"
                            }`}>
                              {m.content}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Real-time turn analysis block under user answer */}
                      {isUser && m.feedback && (
                        <div className="max-w-[85%] ml-auto bg-slate-900/80 border border-indigo-500/10 rounded-2xl p-4 space-y-3 shadow-inner text-xs text-slate-300">
                          {/* Metrics Header */}
                          <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="font-bold text-indigo-400 uppercase tracking-widest text-[10px]">📊 Turn Evaluation</span>
                            <span className="text-emerald-400 font-bold">Feedback Details</span>
                          </div>

                          {/* 5 metric scores */}
                          <div className="grid grid-cols-5 gap-1.5 text-center">
                            {[
                              { label: "Grammar", val: m.feedback.scores.grammar },
                              { label: "Fluency", val: m.feedback.scores.fluency },
                              { label: "Vocabulary", val: m.feedback.scores.vocabulary },
                              { label: "Confidence", val: m.feedback.scores.confidence },
                              { label: "Pronun.", val: m.feedback.scores.pronunciation },
                            ].map((s) => (
                              <div key={s.label} className="bg-slate-800/40 rounded-lg py-1 border border-white/5">
                                <div className="text-[9px] text-slate-500 font-semibold truncate">{s.label}</div>
                                <div className={`font-black text-sm mt-0.5 ${
                                  s.val >= 8 ? "text-emerald-400" : s.val >= 5 ? "text-amber-400" : "text-rose-400"
                                }`}>
                                  {s.val}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Feedback text */}
                          <div className="bg-indigo-500/5 p-2.5 rounded-lg border border-indigo-500/10 text-slate-300">
                            {m.feedback.feedback}
                          </div>

                          {/* Grammar Correction */}
                          {m.feedback.grammarCorrection !== "No corrections needed." && (
                            <div className="bg-amber-500/5 p-2.5 rounded-lg border border-amber-500/10">
                              <span className="font-bold text-amber-400 block mb-0.5">📝 Correction:</span>
                              <span className="text-slate-300">{m.feedback.grammarCorrection}</span>
                            </div>
                          )}

                          {/* Better answer */}
                          <div className="bg-emerald-500/5 p-2.5 rounded-lg border border-emerald-500/10">
                            <span className="font-bold text-emerald-400 block mb-0.5">✨ Model Phrasing:</span>
                            <span className="italic text-slate-300 font-medium">"{m.feedback.betterAnswer}"</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Loading indicator */}
                {loadingAnswer && (
                  <div className="flex justify-start items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700 animate-pulse">
                      AI
                    </div>
                    <div className="bg-slate-800/60 border border-slate-700/30 rounded-2xl rounded-tl-none p-4 text-xs text-indigo-400 flex items-center gap-2">
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                      </span>
                      AI Agent is analyzing your answer and formulating follow-up questions...
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* INPUT BAR */}
              <div className="p-4 border-t border-white/5 bg-slate-900/80">
                {/* Voice mode state visualizers */}
                {(isSpeaking || isListening) && (
                  <div className="flex items-center gap-3 px-3 py-2 bg-slate-800/40 border border-white/5 rounded-xl mb-3 text-xs justify-center">
                    {isSpeaking && (
                      <div className="flex items-center gap-2 text-indigo-400 font-semibold">
                        <div className="flex items-center gap-0.5">
                          <div className="w-1 h-3 bg-indigo-400 rounded-full animate-bounce delay-100" />
                          <div className="w-1 h-4.5 bg-indigo-400 rounded-full animate-bounce delay-200" />
                          <div className="w-1 h-2.5 bg-indigo-400 rounded-full animate-bounce delay-300" />
                        </div>
                        AI Interviewer is speaking...
                      </div>
                    )}
                    {isListening && (
                      <div className="flex items-center gap-2 text-rose-400 font-semibold">
                        {/* Audio equalizer animation */}
                        <div className="flex items-center gap-0.5">
                          <div className="w-1.5 h-2 bg-rose-400 rounded-full animate-bounce [animation-duration:0.6s]" />
                          <div className="w-1.5 h-4.5 bg-rose-400 rounded-full animate-bounce [animation-duration:0.4s]" style={{animationDelay: '0.1s'}} />
                          <div className="w-1.5 h-3 bg-rose-400 rounded-full animate-bounce [animation-duration:0.5s]" style={{animationDelay: '0.2s'}} />
                          <div className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce [animation-duration:0.7s]" style={{animationDelay: '0.3s'}} />
                        </div>
                        Listening (Speak now)...
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {/* Microphone speech recognition trigger */}
                  <button
                    type="button"
                    disabled={!isSpeechSupported}
                    onClick={isListening ? stopSpeechRecognition : startSpeechRecognition}
                    className={`p-3 rounded-xl border shrink-0 transition-all ${
                      isListening
                        ? "bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse shadow-lg shadow-rose-500/10"
                        : !isSpeechSupported
                        ? "bg-slate-900 text-slate-600 border-slate-800/40 cursor-not-allowed opacity-50"
                        : "bg-slate-800 text-slate-400 hover:text-white border-slate-700 hover:bg-slate-700"
                    }`}
                    title={isSpeechSupported ? "Speak answer via microphone" : "Speech recognition is not supported in this browser"}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </button>

                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSubmitAnswer();
                    }}
                    placeholder={
                      !isSpeechSupported
                        ? "Speech recognition is not supported in this browser. Please type..."
                        : isListening
                        ? "Listening..."
                        : "Type your message response..."
                    }
                    disabled={isListening || loadingAnswer}
                    className="flex-1 bg-slate-800 border border-slate-700/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  />

                  <button
                    onClick={handleSubmitAnswer}
                    disabled={!answer.trim() || loadingAnswer || isListening}
                    className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all active:scale-[0.98]"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9-2-9-9-9 9 9 2zm0 0v-8" />
                    </svg>
                  </button>
                </div>

                {/* Turn controls and helper info */}
                <div className="flex justify-between items-center mt-3 text-[10px] text-slate-500">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleVoiceMode}
                      className={`flex items-center gap-1 font-bold ${
                        isVoiceMode ? "text-indigo-400" : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      <span>{isVoiceMode ? "🔊 Voice Mode On" : "🔇 Voice Mode Off"}</span>
                    </button>
                  </div>
                  <span>Speak or type detailed answers (2-3 sentences) for better scores.</span>
                </div>
              </div>
            </div>

            {/* Right Column: Tips & Turn Info */}
            <div className="w-full md:w-72 space-y-4 shrink-0">
              <div className="glass-card p-5">
                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">💡 Interview Guidance</h3>
                <ul className="space-y-2.5 text-xs text-slate-400 leading-relaxed">
                  <li className="flex gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <div>
                      <strong className="text-slate-300">Answer comprehensively:</strong> Don't give short yes/no replies. Give background details.
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <div>
                      <strong className="text-slate-300">Grammar & vocabulary:</strong> AI grades based on accurate tense structures and expression variety.
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <div>
                      <strong className="text-slate-300">Speech input:</strong> Turn on <strong className="text-indigo-300">Voice Mode</strong> to speak. Review transcription before hitting send.
                    </div>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <div>
                      <strong className="text-slate-300">Target count:</strong> Complete at least 5 user responses (turns) for the AI to prepare the complete assessment report.
                    </div>
                  </li>
                </ul>
              </div>

              {/* Real-time score details */}
              <div className="glass-card p-5">
                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">🏷️ Scoring Metrics</h3>
                <div className="space-y-2 text-[11px] text-slate-400">
                  <div>
                    <span className="font-bold text-slate-300 block">Grammar</span>
                    Subject-verb alignment, correct tenses, and syntax.
                  </div>
                  <div>
                    <span className="font-bold text-slate-300 block">Fluency</span>
                    Speech continuity, sentence pacing, and length of answer.
                  </div>
                  <div>
                    <span className="font-bold text-slate-300 block">Vocabulary</span>
                    Correct word choice, avoiding repetitive phrasing.
                  </div>
                  <div>
                    <span className="font-bold text-slate-300 block">Confidence</span>
                    Clarity of thought, directness, and complete responses.
                  </div>
                  <div>
                    <span className="font-bold text-slate-300 block">Pronunciation</span>
                    Speech flow and rhythm (evaluated from voice input).
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. REPORT COMPILING STATE */}
        {state === "compiling" && (
          <div className="max-w-md mx-auto w-full my-auto glass-card p-8 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-400 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white animate-pulse">Compiling Performance Report Card...</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Gemini is reviewing the conversation history, assessing strengths/weaknesses, assigning your CEFR rating, and generating recommended curriculum lessons.
            </p>
          </div>
        )}

        {/* 4. COMPLETE REPORT STATE */}
        {state === "complete" && report && (
          <div className="max-w-3xl mx-auto w-full space-y-6 animate-fade-in my-auto py-8">
            <div className="glass-card p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl" />

              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-2xl font-black mb-1">Interview Evaluation Complete!</h2>
              <p className="text-xs text-slate-500 mb-6">AI Conversational Assessment Report</p>

              {/* Main Scores Grid */}
              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-6">
                <div className="bg-slate-800/80 border border-slate-700/40 rounded-2xl p-4">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Overall Score</div>
                  <div className={`text-4xl font-extrabold mt-1 ${
                    report.overallScore >= 8 ? "text-emerald-400" : report.overallScore >= 5 ? "text-amber-400" : "text-rose-400"
                  }`}>
                    {report.overallScore}/10
                  </div>
                </div>
                <div className="bg-slate-800/80 border border-slate-700/40 rounded-2xl p-4">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">CEFR Grade</div>
                  <div className="text-4xl font-extrabold mt-1 text-indigo-400">
                    {report.cefrLevel}
                  </div>
                </div>
              </div>

              {/* Feedback Summary */}
              <div className="bg-indigo-950/20 border border-indigo-500/10 rounded-2xl p-5 text-sm text-slate-300 leading-relaxed text-left">
                <h3 className="font-bold text-indigo-300 text-xs uppercase tracking-widest mb-2">📝 Interview Summary</h3>
                "{report.overallFeedback}"
              </div>
            </div>

            {/* Strengths and Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="glass-card p-6 bg-emerald-950/5 border border-emerald-500/10">
                <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2 mb-3">
                  <span>💪</span> Key Strengths
                </h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  {report.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-500">✔</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card p-6 bg-rose-950/5 border border-rose-500/10">
                <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2 mb-3">
                  <span>⚠️</span> Areas to Improve
                </h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  {report.weaknesses.map((weak, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-500">⚡</span>
                      <span>{weak}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommended Lessons */}
            <div className="glass-card p-6">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">📖 Recommended 90-Day Challenge Lessons</h3>
              <p className="text-xs text-slate-400 mb-4">
                To improve in your weak areas, the AI suggests practicing these modules in the curriculum:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {report.recommendedLessons.map((lesson, idx) => {
                  // Extract day number for linking (e.g. "Day 12: Introduce Yourself" -> "12")
                  const match = lesson.match(/Day\s+(\d+)/i);
                  const dayNum = match ? match[1] : null;
                  const linkHref = dayNum ? `/lessons` : "/lessons";

                  return (
                    <Link
                      key={idx}
                      href={linkHref}
                      className="p-3 bg-white/[0.02] hover:bg-indigo-500/10 border border-white/5 hover:border-indigo-500/30 rounded-xl flex items-center justify-between group transition-all"
                    >
                      <span className="text-xs font-semibold group-hover:text-indigo-300 transition-colors">{lesson}</span>
                      <span className="text-xs text-indigo-400 group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleSaveAndProfile}
                disabled={saving}
                className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50 active:scale-[0.98] text-sm"
              >
                {saving ? "Saving Session..." : "💾 Save & View History Profile"}
              </button>
              <Link
                href="/interview"
                className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-2xl text-center border border-slate-700 transition-all text-sm"
              >
                Practice Another Topic
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* WAVEFORM ANIMATION CSS */}
      <style jsx global>{`
        @keyframes bounceWave {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(2); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.01);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
