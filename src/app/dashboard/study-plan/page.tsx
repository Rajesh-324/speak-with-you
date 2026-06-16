"use client";

import AuthGuard from "@/components/ui/AuthGuard";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { getUserProgress, getInterviewHistory } from "@/lib/firestore";
import Link from "next/link";

export default function StudyPlanPage() {
  return (
    <AuthGuard>
      <StudyPlanContent />
    </AuthGuard>
  );
}

function StudyPlanContent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState<any>(null);
  const [weaknesses, setWeaknesses] = useState<string[]>([]);
  const [currentPlan, setCurrentPlan] = useState<string>("");

  const loadProgressAndPlan = async () => {
    if (!user) return;
    try {
      const p = await getUserProgress(user.uid);
      setProgress(p);
      if (p?.studyPlan?.plan) {
        setCurrentPlan(p.studyPlan.plan);
      }

      // Collect weaknesses from interview history
      const history = await getInterviewHistory(user.uid);
      const collectedWeaknesses: string[] = [];
      
      // Pull weaknesses from the last 3 interviews if available
      history.slice(0, 3).forEach((sess) => {
        if (sess.weaknesses) {
          collectedWeaknesses.push(...sess.weaknesses);
        }
      });

      // Remove duplicates and limit to 4
      const uniqueWeaknesses = Array.from(new Set(collectedWeaknesses)).slice(0, 4);
      setWeaknesses(uniqueWeaknesses.length > 0 ? uniqueWeaknesses : ["grammar precision", "vocabulary size"]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgressAndPlan();
  }, [user]);

  const handleGenerate = async () => {
    if (!user || !progress) return;
    setGenerating(true);
    try {
      const response = await fetch("/api/study-plan/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          cefrLevel: progress.cefrLevel || "A2",
          weaknesses,
        }),
      });

      if (!response.ok) throw new Error("Plan generation failed");
      const data = await response.json();
      setCurrentPlan(data.plan);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  // Convert simple markdown elements for readable rendering without external markdown library
  const renderPlanText = (text: string) => {
    if (!text) return null;
    return text.split("\n").map((line, index) => {
      let trimmed = line.trim();
      if (trimmed.startsWith("###")) {
        return <h3 key={index} className="text-lg font-bold text-white mt-4 mb-2">{trimmed.replace("###", "")}</h3>;
      }
      if (trimmed.startsWith("##")) {
        return <h2 key={index} className="text-xl font-extrabold text-indigo-300 mt-5 mb-3">{trimmed.replace("##", "")}</h2>;
      }
      if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        // Strip bullet points and evaluate bold highlights
        let rawContent = trimmed.slice(1).trim();
        return (
          <li key={index} className="ml-4 list-disc text-sm text-slate-300 leading-relaxed mb-1.5">
            {formatBoldText(rawContent)}
          </li>
        );
      }
      return <p key={index} className="text-sm text-slate-300 leading-relaxed mb-3">{formatBoldText(trimmed)}</p>;
    });
  };

  const formatBoldText = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) => (i % 2 === 1 ? <strong key={i} className="text-indigo-200 font-bold">{part}</strong> : part));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/20 to-slate-950 text-white py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        
        <div>
          <Link href="/dashboard" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            ← Back to Dashboard
          </Link>
        </div>

        {loading ? (
          <div className="glass-card p-8 text-center space-y-3">
            <div className="w-8 h-8 border-4 border-indigo-400 border-t-indigo-600 rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500">Evaluating progress statistics...</p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Header info */}
            <div className="glass-card p-6 border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-xl font-bold flex items-center gap-2">
                  <span>📅</span> AI Study Planner
                </h1>
                <p className="text-xs text-slate-400 mt-1">Personalized weekly study roadmaps based on your active weaknesses.</p>
              </div>

              <button
                onClick={handleGenerate}
                disabled={generating}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-xs font-bold shadow-md hover:shadow-indigo-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50"
              >
                {generating ? "Generating Plan..." : currentPlan ? "Regenerate Study Plan" : "Generate Custom Plan 🚀"}
              </button>
            </div>

            {/* Profile Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="glass-card p-5 border border-white/5 space-y-2">
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Active Skill Level</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black">{progress?.cefrLevel || "A2"}</span>
                  <span className="text-xs text-slate-400">({progress?.level || "beginner"} track)</span>
                </div>
              </div>

              <div className="glass-card p-5 border border-white/5 space-y-2">
                <span className="text-[10px] text-rose-400 font-bold uppercase tracking-widest">Target Weaknesses</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {weaknesses.map((w, index) => (
                    <span key={index} className="px-2.5 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[10px] rounded-lg font-bold">
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Plan Display */}
            {generating ? (
              <div className="glass-card p-12 text-center space-y-4">
                <div className="w-12 h-12 border-4 border-indigo-400 border-t-indigo-600 rounded-full animate-spin mx-auto" />
                <h3 className="text-md font-bold animate-pulse text-indigo-300">Creating Your Action Roadmap...</h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                  Buddy is processing your CEFR level and mock interview errors to craft a custom study outline for the week.
                </p>
              </div>
            ) : currentPlan ? (
              <div className="glass-card p-8 border border-indigo-500/10 bg-slate-900/20 shadow-2xl relative">
                <span className="absolute top-4 right-4 text-[10px] text-slate-500">Generated: {progress?.studyPlan?.generatedAt ? new Date(progress.studyPlan.generatedAt).toLocaleDateString() : new Date().toLocaleDateString()}</span>
                <div className="prose prose-invert max-w-none space-y-3">
                  {renderPlanText(currentPlan)}
                </div>
              </div>
            ) : (
              <div className="glass-card p-12 text-center space-y-4">
                <div className="text-5xl">📋</div>
                <h3 className="text-md font-bold">No Study Plan Active</h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto">
                  Click the button above to generate your first weekly learning roadmap. Buddy will customize it to help you overcome grammatical errors and extend vocabulary.
                </p>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
