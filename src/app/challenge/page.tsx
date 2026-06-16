"use client";

import AuthGuard from "@/components/ui/AuthGuard";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect, useRef } from "react";
import { completeDailyChallenge } from "@/lib/firestore";
import Link from "next/link";

export default function ChallengePage() {
  return (
    <AuthGuard>
      <DailyChallengeContent />
    </AuthGuard>
  );
}

const WEEKLY_CHALLENGES = [
  { day: "Sunday", id: "sun", topic: "Describe your hometown or where you live. What makes it special or unique?", hint: "Talk about locations, culture, food, and why people like it." },
  { day: "Monday", id: "mon", topic: "Describe your current career goals and how you plan to achieve them.", hint: "State your desired role, key skills needed, and study timelines." },
  { day: "Tuesday", id: "tue", topic: "Explain a recent challenge you faced in your work or studies and how you resolved it.", hint: "Describe the issue, your steps, and what you learned." },
  { day: "Wednesday", id: "wed", topic: "Talk about your favorite childhood memory. Why is it memorable to you?", hint: "Focus on people, places, events, and emotions." },
  { day: "Thursday", id: "thu", topic: "Give your opinion: Are books better than movies? Explain why.", hint: "Discuss imagination, details, visual aspects, and time." },
  { day: "Friday", id: "fri", topic: "Describe your perfect weekend plan that you would love to enjoy.", hint: "Outline activities, companions, food, and locations." },
  { day: "Saturday", id: "sat", topic: "Explain the benefits of learning a new language like English.", hint: "Focus on global travel, job prospects, cognitive training, and networking." },
];

function DailyChallengeContent() {
  const { user } = useAuth();
  const [challenge, setChallenge] = useState<typeof WEEKLY_CHALLENGES[0] | null>(null);
  const [answer, setAnswer] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
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

  // Evaluation Results
  const [evaluation, setEvaluation] = useState<{
    score: number;
    grammarScore: number;
    fluencyScore: number;
    vocabularyScore: number;
    grammarCorrection: string;
    betterAnswer: string;
    feedback: string;
  } | null>(null);

  // 1. Get Today's Challenge
  useEffect(() => {
    const dayOfWeek = new Date().getDay(); // 0 is Sunday, 6 is Saturday
    setChallenge(WEEKLY_CHALLENGES[dayOfWeek]);
  }, []);

  // 2. Timer Effects
  useEffect(() => {
    if (isListening) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isListening]);

  // 3. Speech Recognition
  const startListening = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome.");
      return;
    }

    try {
      if (recognitionRef.current) recognitionRef.current.abort();

      const rec = new SpeechRecognition();
      recognitionRef.current = rec;
      rec.lang = "en-US";
      rec.continuous = true;
      rec.interimResults = false;

      rec.onstart = () => {
        setIsListening(true);
      };
      rec.onend = () => {
        setIsListening(false);
      };
      rec.onresult = (event: any) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + " ";
          }
        }
        if (finalTranscript) {
          setAnswer((prev) => (prev ? prev + " " + finalTranscript.trim() : finalTranscript.trim()));
        }
      };
      rec.start();
    } catch (e) {
      console.error("Mic error:", e);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  // 4. Submit & Evaluate
  const handleSubmit = async () => {
    if (!answer.trim() || !challenge || !user || loading) return;
    stopListening();
    setLoading(true);

    try {
      const response = await fetch("/api/challenge/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          challengeId: challenge.id,
          answer: answer.trim(),
          promptText: challenge.topic,
        }),
      });

      if (!response.ok) throw new Error("Evaluation failed");
      const data = await response.json();
      setEvaluation(data);

      // Save +30 XP in Firestore
      await completeDailyChallenge(user.uid, 30);
      setCompleted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetChallenge = () => {
    setAnswer("");
    setSeconds(0);
    setCompleted(false);
    setEvaluation(null);
  };

  if (!challenge) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? "0" : ""}${s}`;
  };

  const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/20 to-slate-950 text-white py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Back navigation */}
        <div>
          <Link href="/dashboard" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            ← Back to Dashboard
          </Link>
        </div>

        {/* CHALLENGE DISPLAY CARD */}
        {!completed ? (
          <div className="glass-card p-8 border border-white/5 space-y-6">
            <div className="flex justify-between items-center">
              <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300 text-xs font-bold uppercase tracking-wider">
                🔥 Daily Speaking Challenge
              </span>
              <span className="text-xs text-slate-500 font-bold">{challenge.day}</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold leading-snug">{challenge.topic}</h2>
              <p className="text-xs text-slate-400 leading-relaxed"><strong className="text-indigo-300">💡 Hint:</strong> {challenge.hint}</p>
            </div>

            {/* Speaking Timer & Equalizer */}
            <div className="bg-slate-950/60 rounded-2xl border border-white/5 p-6 flex flex-col items-center justify-center space-y-4">
              <div className="text-3xl font-mono tracking-wider text-indigo-300 font-black">
                {formatTime(seconds)}
              </div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest">Recommended speaking time: 2-3 minutes</div>

              {isListening && (
                <div className="flex items-center gap-1.5 h-8">
                  <div className="w-1 h-3 bg-rose-400 rounded-full animate-bounce [animation-duration:0.6s]" />
                  <div className="w-1 h-6 bg-rose-400 rounded-full animate-bounce [animation-duration:0.4s] delay-75" />
                  <div className="w-1.5 h-8 bg-rose-500 rounded-full animate-bounce [animation-duration:0.5s] delay-150" />
                  <div className="w-1 h-5 bg-rose-400 rounded-full animate-bounce [animation-duration:0.7s] delay-75" />
                  <div className="w-1 h-2.5 bg-rose-400 rounded-full animate-bounce [animation-duration:0.3s]" />
                </div>
              )}
            </div>

            {/* User Input Transcription View */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">🗣️ Spoken Transcript</label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder={
                  isSpeechSupported
                    ? "Click the microphone and start speaking. Your voice transcript will appear here..."
                    : "Speech recognition is not supported in this browser. Please type your response directly here to complete the challenge!"
                }
                disabled={loading}
                className="w-full h-32 p-4 bg-slate-900 border border-slate-800 rounded-xl text-sm leading-relaxed text-white focus:outline-none focus:border-indigo-500 resize-none"
              />
              <div className="flex justify-between items-center text-[10px] text-slate-500">
                <span>{wordCount} words recorded</span>
                <span>{isSpeechSupported ? "Press stop before submitting." : "Type directly and submit."}</span>
              </div>
            </div>

            {/* Call to actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                disabled={!isSpeechSupported}
                className={`flex-1 py-3.5 rounded-xl font-bold text-sm border flex items-center justify-center gap-2 transition-all ${
                  isListening
                    ? "bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse shadow-lg"
                    : !isSpeechSupported
                    ? "bg-slate-900 text-slate-600 border-slate-800/40 cursor-not-allowed opacity-50"
                    : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20"
                }`}
                title={isSpeechSupported ? "Speak answer via microphone" : "Speech recognition is not supported in this browser"}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                {isListening ? "Stop Recording ⏹" : "Start Speaking 🎤"}
              </button>

              <button
                onClick={handleSubmit}
                disabled={!answer.trim() || loading || isListening}
                className="flex-1 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl text-sm shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
              >
                {loading ? "Evaluating Answer..." : "Submit & Grade Challenge →"}
              </button>
            </div>
          </div>
        ) : (
          /* 5. EVALUATION RESULTS VIEW */
          evaluation && (
            <div className="space-y-6 animate-fade-in">
              <div className="glass-card p-8 border border-white/5 text-center relative overflow-hidden space-y-6">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl" />

                <div className="text-5xl animate-bounce">🎉</div>
                <div>
                  <h2 className="text-2xl font-black">Daily Challenge Completed!</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Your spoken answers have been analyzed.</p>
                </div>

                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-xl max-w-xs mx-auto text-xs font-bold uppercase tracking-wider">
                  ⚡ Reward: +30 XP Earned!
                </div>

                {/* Score meters */}
                <div className="grid grid-cols-4 gap-3 max-w-md mx-auto mt-6">
                  {[
                    { label: "Overall", val: evaluation.score, color: "text-indigo-400" },
                    { label: "Grammar", val: evaluation.grammarScore, color: "text-emerald-400" },
                    { label: "Fluency", val: evaluation.fluencyScore, color: "text-amber-400" },
                    { label: "Vocabulary", val: evaluation.vocabularyScore, color: "text-pink-400" },
                  ].map((s) => (
                    <div key={s.label} className="bg-slate-950/60 rounded-xl p-3 border border-white/5">
                      <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{s.label}</div>
                      <div className={`text-xl font-extrabold mt-1 ${s.color}`}>
                        {s.val}/10
                      </div>
                    </div>
                  ))}
                </div>

                {/* Feedback text */}
                <div className="bg-indigo-950/20 border border-indigo-500/15 p-4 rounded-xl text-left text-xs sm:text-sm text-slate-300 leading-relaxed mt-4">
                  <h4 className="font-bold text-indigo-300 mb-1">📝 Feedback:</h4>
                  "{evaluation.feedback}"
                </div>

                {/* Corrections */}
                {evaluation.grammarCorrection !== "No corrections needed." && (
                  <div className="bg-amber-500/5 border border-amber-500/15 p-4 rounded-xl text-left text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <h4 className="font-bold text-amber-400 mb-1">📝 Grammar Correction:</h4>
                    {evaluation.grammarCorrection}
                  </div>
                )}

                {/* Model Phrasing */}
                <div className="bg-emerald-500/5 border border-emerald-500/15 p-4 rounded-xl text-left text-xs sm:text-sm text-slate-300 leading-relaxed">
                  <h4 className="font-bold text-emerald-400 mb-1">✨ Model Phrasing:</h4>
                  <p className="italic font-medium">"{evaluation.betterAnswer}"</p>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={resetChallenge}
                    className="flex-1 py-3 border border-slate-700 hover:bg-slate-800 rounded-xl text-xs font-bold transition-all"
                  >
                    Try Again
                  </button>
                  <Link
                    href="/dashboard"
                    className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl text-xs shadow-md text-center flex items-center justify-center hover:shadow-lg transition-all"
                  >
                    Go to Dashboard →
                  </Link>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
