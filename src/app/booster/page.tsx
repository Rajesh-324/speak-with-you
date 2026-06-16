"use client";

import AuthGuard from "@/components/ui/AuthGuard";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import Link from "next/link";

export default function BoosterPage() {
  return (
    <AuthGuard>
      <BoosterContent />
    </AuthGuard>
  );
}

type BoosterTask = "review" | "questions" | "roadmap";

function BoosterContent() {
  const [activeTab, setActiveTab] = useState<BoosterTask>("review");
  const [jobTitle, setJobTitle] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleRunTask = async () => {
    if (!jobTitle.trim() || !resumeText.trim() || loading) return;

    if (jobTitle.length > 200) {
      alert("Job title exceeds the maximum limit of 200 characters.");
      return;
    }
    if (resumeText.length > 10000) {
      alert("Resume text exceeds the maximum limit of 10,000 characters.");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/booster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: activeTab,
          resumeText: resumeText.trim(),
          jobTitle: jobTitle.trim(),
        }),
      });

      if (!response.ok) throw new Error("Booster execution failed");
      const data = await response.json();
      setResult(data.result);
    } catch (err) {
      console.error(err);
      setResult("### ⚠️ Connection Error\n\nFailed to reach the AI Booster API. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: BoosterTask) => {
    setActiveTab(tab);
    setResult("");
  };

  const renderResultText = (text: string) => {
    if (!text) return null;
    return text.split("\n").map((line, index) => {
      let trimmed = line.trim();
      if (trimmed.startsWith("###")) {
        return <h3 key={index} className="text-base font-bold text-white mt-4 mb-2">{trimmed.replace("###", "")}</h3>;
      }
      if (trimmed.startsWith("##")) {
        return <h2 key={index} className="text-lg font-extrabold text-indigo-300 mt-5 mb-3">{trimmed.replace("##", "")}</h2>;
      }
      if (trimmed.startsWith("1.") || trimmed.startsWith("2.") || trimmed.startsWith("3.") || trimmed.startsWith("4.") || trimmed.startsWith("5.")) {
        return <p key={index} className="text-sm font-bold text-indigo-200 leading-relaxed mt-4 mb-2">{formatBoldText(trimmed)}</p>;
      }
      if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        let rawContent = trimmed.slice(1).trim();
        return (
          <li key={index} className="ml-4 list-disc text-sm text-slate-300 leading-relaxed mb-1.5">
            {formatBoldText(rawContent)}
          </li>
        );
      }
      return <p key={index} className="text-sm text-slate-300 leading-relaxed mb-2">{formatBoldText(trimmed)}</p>;
    });
  };

  const formatBoldText = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) => (i % 2 === 1 ? <strong key={i} className="text-indigo-300 font-bold">{part}</strong> : part));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/20 to-slate-950 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Back navigation */}
        <div>
          <Link href="/dashboard" className="text-xs text-indigo-400 hover:text-indigo-300">
            ← Back to Dashboard
          </Link>
          <h1 className="text-xl font-bold flex items-center gap-2 mt-1">
            <span>🚀</span> Resume & Interview Booster
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Prepare resumes and generate tailored HR questions using Gemini.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Column: Form (1 Col) */}
          <div className="glass-card p-6 border border-white/5 space-y-4 h-fit">
            
            {/* Tab Selector */}
            <div className="flex flex-col gap-1.5 border-b border-white/5 pb-4">
              {[
                { id: "review", label: "📝 Resume Reviewer" },
                { id: "questions", label: "❓ HR Question Generator" },
                { id: "roadmap", label: "🗺️ Prep Roadmap Builder" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id as BoosterTask)}
                  className={`w-full text-left p-3 rounded-xl text-xs font-bold transition-all border ${
                    activeTab === tab.id
                      ? "bg-indigo-500/10 border-indigo-500/35 text-indigo-300"
                      : "bg-slate-900/40 border-white/5 text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Target Job */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Target Job Title</label>
                <span className="text-[9px] text-slate-500 font-mono">{jobTitle.length}/200</span>
              </div>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                maxLength={200}
                placeholder="E.g. React Developer"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Resume Input */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Paste Resume Text</label>
                <span className="text-[9px] text-slate-500 font-mono">{resumeText.length.toLocaleString()}/10,000</span>
              </div>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                maxLength={10000}
                placeholder="Copy and paste your resume content here..."
                className="w-full h-48 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs leading-relaxed text-white focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <button
              onClick={handleRunTask}
              disabled={!jobTitle.trim() || !resumeText.trim() || loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl text-xs shadow-md disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg active:scale-[0.98] transition-all"
            >
              {loading ? "Analyzing..." : "Analyze & Generate →"}
            </button>

          </div>

          {/* Right Column: Result Output (2 Cols) */}
          <div className="md:col-span-2 flex flex-col">
            {loading ? (
              <div className="glass-card p-12 text-center space-y-4 flex-1 flex flex-col justify-center items-center">
                <div className="w-12 h-12 border-4 border-indigo-400 border-t-indigo-600 rounded-full animate-spin mx-auto" />
                <h3 className="text-md font-bold animate-pulse text-indigo-300">Processing Career Insights...</h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                  Gemini is reading your experience metrics and matching them against hiring standards.
                </p>
              </div>
            ) : result ? (
              <div className="glass-card p-8 border border-indigo-500/10 bg-slate-900/20 shadow-2xl flex-1 max-h-[600px] overflow-y-auto custom-scrollbar">
                <div className="prose prose-invert max-w-none space-y-3">
                  {renderResultText(result)}
                </div>
              </div>
            ) : (
              <div className="glass-card p-12 text-center space-y-4 flex-1 flex flex-col justify-center items-center border border-white/5">
                <div className="text-5xl">📄</div>
                <h3 className="text-md font-bold">Awaiting Career Analysis</h3>
                <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                  Input your target role and paste your resume in the left panel, then hit Generate to review recommendations.
                </p>
              </div>
            )}
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
