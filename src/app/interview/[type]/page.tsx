"use client";

import AuthGuard from "@/components/ui/AuthGuard";
import { useAuth } from "@/contexts/AuthContext";
import { useParams, useRouter } from "next/navigation";
import { useState, useCallback, useMemo } from "react";
import { interviewQuestions } from "@/data/interviewQuestions";
import { saveInterviewSession } from "@/lib/firestore";
import SpeechButton from "@/components/ui/SpeechButton";
import ProgressBar from "@/components/ui/ProgressBar";
import type { InterviewQuestion, InterviewType, EvaluationResult } from "@/types";
import Link from "next/link";

export default function InterviewSessionPage() {
  return (
    <AuthGuard>
      <InterviewSessionContent />
    </AuthGuard>
  );
}

type SessionState = "ready" | "questioning" | "evaluating" | "feedback" | "complete";

function InterviewSessionContent() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const interviewType = params.type as InterviewType;

  const bank = interviewQuestions.find((q) => q.type === interviewType);
  const questions = useMemo(() => bank?.questions || [], [bank]);

  const [state, setState] = useState<SessionState>("ready");
  const [currentQ, setCurrentQ] = useState(0);
  const [answer, setAnswer] = useState("");
  const [results, setResults] = useState<InterviewQuestion[]>([]);
  const [currentFeedback, setCurrentFeedback] = useState<EvaluationResult | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmitAnswer = useCallback(async () => {
    if (!answer.trim()) return;
    setState("evaluating");

    try {
      const response = await fetch("/api/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: questions[currentQ],
          answer: answer.trim(),
          interviewType,
        }),
      });

      const feedback: EvaluationResult = await response.json();
      setCurrentFeedback(feedback);

      setResults((prev) => [
        ...prev,
        {
          question: questions[currentQ],
          userAnswer: answer.trim(),
          score: feedback.score,
          grammarScore: feedback.grammarScore,
          fluencyScore: feedback.fluencyScore,
          vocabularyScore: feedback.vocabularyScore,
          confidenceScore: feedback.confidenceScore,
          grammarCorrection: feedback.grammarCorrection,
          betterAnswer: feedback.betterAnswer,
          feedback: feedback.feedback,
        },
      ]);

      setState("feedback");
    } catch (err) {
      console.error("Evaluation error:", err);
      setState("questioning");
    }
  }, [answer, currentQ, interviewType, questions]);

  const handleNext = useCallback(() => {
    if (currentQ + 1 < questions.length) {
      setCurrentQ((prev) => prev + 1);
      setAnswer("");
      setCurrentFeedback(null);
      setState("questioning");
    } else {
      setState("complete");
    }
  }, [currentQ, questions.length]);

  const handleSaveAndFinish = useCallback(async () => {
    if (!user || saving) return;
    setSaving(true);

    const overallScore =
      results.reduce((sum, r) => sum + r.score, 0) / results.length;

    try {
      await saveInterviewSession({
        uid: user.uid,
        type: interviewType,
        questions: results,
        overallScore: Math.round(overallScore * 10) / 10,
        overallFeedback:
          overallScore >= 8
            ? "Excellent performance! You communicate very well."
            : overallScore >= 6
            ? "Good effort! Keep practicing to improve further."
            : "You're making progress! Focus on grammar and sentence structure.",
      });
    } catch (err) {
      console.error("Error saving session:", err);
    }

    setSaving(false);
    router.push("/profile");
  }, [user, results, interviewType, saving, router]);

  const handleSpeechResult = (text: string) => {
    setAnswer((prev) => (prev ? prev + " " + text : text));
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

  const overallScore = results.length > 0
    ? Math.round((results.reduce((s, r) => s + r.score, 0) / results.length) * 10) / 10
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 page-enter">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/interview" className="text-xs text-indigo-400 hover:text-indigo-300 mb-1 inline-block">
              ← Back
            </Link>
            <h1 className="text-xl font-bold text-white">
              {bank.icon} {bank.label}
            </h1>
          </div>
          {state !== "ready" && state !== "complete" && (
            <ProgressBar
              value={currentQ + (state === "feedback" ? 1 : 0)}
              max={questions.length}
              showPercentage={false}
            />
          )}
        </div>

        {/* READY STATE */}
        {state === "ready" && (
          <div className="glass-card p-8 text-center">
            <div className="text-5xl mb-4">{bank.icon}</div>
            <h2 className="text-xl font-bold text-white mb-2">{bank.label}</h2>
            <p className="text-sm text-slate-400 mb-6">
              {bank.description}. You will be asked {questions.length} questions.
              Type or speak your answers in English.
            </p>
            <button
              onClick={() => setState("questioning")}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Start Interview 🎤
            </button>
          </div>
        )}

        {/* QUESTIONING STATE */}
        {state === "questioning" && (
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold">
                Q{currentQ + 1}/{questions.length}
              </span>
            </div>

            <h2 className="text-lg font-bold text-white mb-6">
              {questions[currentQ]}
            </h2>

            <div className="space-y-3">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here... (Write at least 2-3 sentences)"
                className="w-full h-32 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 resize-none"
              />

              <div className="flex items-center justify-between">
                <SpeechButton onResult={handleSpeechResult} />
                <span className="text-xs text-slate-600">
                  {answer.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              </div>

              <button
                onClick={handleSubmitAnswer}
                disabled={!answer.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
              >
                Submit Answer →
              </button>
            </div>
          </div>
        )}

        {/* EVALUATING STATE */}
        {state === "evaluating" && (
          <div className="glass-card p-8 text-center">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-indigo-300 animate-pulse">AI is evaluating your answer...</p>
          </div>
        )}

        {/* FEEDBACK STATE */}
        {state === "feedback" && currentFeedback && (
          <div className="space-y-4">
            {/* Score */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-400">Your Score</h3>
                <div className="text-center">
                  <div className={`text-4xl font-extrabold ${
                    currentFeedback.score >= 8 ? "text-emerald-400" :
                    currentFeedback.score >= 5 ? "text-amber-400" : "text-rose-400"
                  }`}>
                    {currentFeedback.score}/10
                  </div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Overall</div>
                </div>
              </div>

              {/* Detailed Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 mt-2">
                {[
                  { label: "Grammar", value: currentFeedback.grammarScore },
                  { label: "Fluency", value: currentFeedback.fluencyScore },
                  { label: "Vocabulary", value: currentFeedback.vocabularyScore },
                  { label: "Confidence", value: currentFeedback.confidenceScore },
                ].map((metric) => {
                  const scoreColor = 
                    metric.value >= 8 ? "text-emerald-400" :
                    metric.value >= 5 ? "text-amber-400" : "text-rose-400";
                  return (
                    <div key={metric.label} className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-3 text-center">
                      <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{metric.label}</div>
                      <div className={`text-lg font-extrabold mt-1 ${scoreColor}`}>
                        {metric.value}/10
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Feedback */}
              <div className="bg-indigo-500/5 rounded-lg p-3 mb-3">
                <p className="text-sm text-slate-300">{currentFeedback.feedback}</p>
              </div>

              {/* Grammar Correction */}
              {currentFeedback.grammarCorrection !== "No corrections needed." && (
                <div className="bg-amber-500/5 rounded-lg p-3 mb-3">
                  <h4 className="text-xs font-semibold text-amber-400 mb-1">📝 Grammar Correction:</h4>
                  <p className="text-sm text-slate-300">{currentFeedback.grammarCorrection}</p>
                </div>
              )}

              {/* Better Answer */}
              <div className="bg-emerald-500/5 rounded-lg p-3">
                <h4 className="text-xs font-semibold text-emerald-400 mb-1">✨ Better Answer:</h4>
                <p className="text-sm text-slate-300 italic">{currentFeedback.betterAnswer}</p>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
            >
              {currentQ + 1 < questions.length
                ? `Next Question (${currentQ + 2}/${questions.length}) →`
                : "See Final Results 🏆"}
            </button>
          </div>
        )}

        {/* COMPLETE STATE */}
        {state === "complete" && (
          <div className="space-y-4">
            <div className="glass-card p-6 text-center">
              <div className="text-5xl mb-3">🏆</div>
              <h2 className="text-2xl font-extrabold text-white mb-1">Interview Complete!</h2>
              <p className="text-sm text-slate-400 mb-4">
                Here&apos;s your overall performance
              </p>

              <div className={`text-5xl font-extrabold mb-2 ${
                overallScore >= 8 ? "text-emerald-400" :
                overallScore >= 5 ? "text-amber-400" : "text-rose-400"
              }`}>
                {overallScore}/10
              </div>
              <p className="text-sm text-slate-400">
                {overallScore >= 8
                  ? "🌟 Excellent! You communicate very well!"
                  : overallScore >= 5
                  ? "👍 Good effort! Keep practicing!"
                  : "📖 You're improving! Review your lessons and try again."}
              </p>
            </div>

            {/* Per-question breakdown */}
            <div className="glass-card p-5">
              <h3 className="text-sm font-bold text-white mb-3">Question Breakdown</h3>
              <div className="space-y-3">
                {results.map((r, i) => (
                  <div key={i} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs text-slate-400 flex-1">
                        Q{i + 1}: {r.question}
                      </p>
                      <span className={`shrink-0 text-sm font-bold ${
                        r.score >= 8 ? "text-emerald-400" :
                        r.score >= 5 ? "text-amber-400" : "text-rose-400"
                      }`}>
                        {r.score}/10
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSaveAndFinish}
                disabled={saving}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/20 transition-all disabled:opacity-50"
              >
                {saving ? "Saving..." : "💾 Save & View Profile"}
              </button>
              <Link
                href="/interview"
                className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm text-center hover:bg-white/10 transition-all"
              >
                Try Another Interview
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
