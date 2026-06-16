"use client";

import AuthGuard from "@/components/ui/AuthGuard";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { getUserProgress, getInterviewHistory } from "@/lib/firestore";
import Link from "next/link";

export default function AnalyticsPage() {
  return (
    <AuthGuard>
      <AnalyticsContent />
    </AuthGuard>
  );
}

function AnalyticsContent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const loadData = async () => {
      try {
        const p = await getUserProgress(user.uid);
        const hist = await getInterviewHistory(user.uid);
        setProgress(p);
        // Reverse history to show chronological order (oldest first)
        setHistory([...hist].reverse());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  // Render SVG Line Chart for Grammar Trend
  const renderGrammarChart = () => {
    const dataPoints = history.map((h) => {
      // Find average grammar score
      const gScores = h.questions?.map((q: any) => q.grammarScore || 0) || [];
      return gScores.length > 0 ? gScores.reduce((a: number, b: number) => a + b, 0) / gScores.length : h.overallScore || 5;
    });

    // Fallback demo data if no history exists
    const isDemo = dataPoints.length < 2;
    const points = isDemo ? [5, 6, 5.5, 7, 7.5, 8.5] : dataPoints;

    const width = 500;
    const height = 200;
    const padding = 25;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const xCoords = points.map((_, idx) => padding + (idx * chartWidth) / (points.length - 1 || 1));
    const yCoords = points.map((val) => height - padding - ((val - 1) * chartHeight) / 9);

    const pathData = xCoords.map((x, i) => `${i === 0 ? "M" : "L"} ${x} ${yCoords[i]}`).join(" ");

    return (
      <div className="relative bg-slate-900/50 border border-white/5 rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-slate-200">Grammar Improvement Trend</h3>
            <p className="text-[10px] text-slate-500">Subject-verb agreement & tense scores across sessions</p>
          </div>
          {isDemo && <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[9px] font-bold">Demo Graph</span>}
        </div>

        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
          <defs>
            <linearGradient id="grammarGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[1, 3, 5, 7, 9, 10].map((val) => {
            const y = height - padding - ((val - 1) * chartHeight) / 9;
            return (
              <line key={val} x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            );
          })}

          {/* Area under the line */}
          <path
            d={`${pathData} L ${xCoords[xCoords.length - 1]} ${height - padding} L ${xCoords[0]} ${height - padding} Z`}
            fill="url(#grammarGrad)"
          />

          {/* Trend line */}
          <path d={pathData} fill="none" stroke="#6366f1" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data points circles */}
          {xCoords.map((x, idx) => (
            <circle
              key={idx}
              cx={x}
              cy={yCoords[idx]}
              r="4.5"
              fill="#818cf8"
              stroke="#0f172a"
              strokeWidth="2"
              className="hover:scale-125 transition-transform cursor-pointer"
            />
          ))}

          {/* Y Axis indicators */}
          <text x={padding - 10} y={height - padding + 4} fill="rgba(255,255,255,0.2)" fontSize="9" textAnchor="end">1</text>
          <text x={padding - 10} y={height - padding - chartHeight / 2 + 4} fill="rgba(255,255,255,0.2)" fontSize="9" textAnchor="end">5</text>
          <text x={padding - 10} y={padding + 4} fill="rgba(255,255,255,0.2)" fontSize="9" textAnchor="end">10</text>
        </svg>
      </div>
    );
  };

  // Render SVG Fluency Trend Area Chart
  const renderFluencyChart = () => {
    const dataPoints = history.map((h) => {
      const fScores = h.questions?.map((q: any) => q.fluencyScore || 0) || [];
      return fScores.length > 0 ? fScores.reduce((a: number, b: number) => a + b, 0) / fScores.length : h.overallScore || 5;
    });

    const isDemo = dataPoints.length < 2;
    const points = isDemo ? [4, 4.5, 6, 5.5, 7, 8] : dataPoints;

    const width = 500;
    const height = 200;
    const padding = 25;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const xCoords = points.map((_, idx) => padding + (idx * chartWidth) / (points.length - 1 || 1));
    const yCoords = points.map((val) => height - padding - ((val - 1) * chartHeight) / 9);

    const pathData = xCoords.map((x, i) => `${i === 0 ? "M" : "L"} ${x} ${yCoords[i]}`).join(" ");

    return (
      <div className="relative bg-slate-900/50 border border-white/5 rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-slate-200">Fluency pacing Trend</h3>
            <p className="text-[10px] text-slate-500">Speaking duration and conversation continuation metrics</p>
          </div>
          {isDemo && <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[9px] font-bold">Demo Graph</span>}
        </div>

        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
          <defs>
            <linearGradient id="fluencyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fb7185" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#fb7185" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[1, 3, 5, 7, 9, 10].map((val) => {
            const y = height - padding - ((val - 1) * chartHeight) / 9;
            return (
              <line key={val} x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            );
          })}

          <path
            d={`${pathData} L ${xCoords[xCoords.length - 1]} ${height - padding} L ${xCoords[0]} ${height - padding} Z`}
            fill="url(#fluencyGrad)"
          />

          <path d={pathData} fill="none" stroke="#f43f5e" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

          {xCoords.map((x, idx) => (
            <circle
              key={idx}
              cx={x}
              cy={yCoords[idx]}
              r="4.5"
              fill="#fb7185"
              stroke="#0f172a"
              strokeWidth="2"
            />
          ))}

          <text x={padding - 10} y={height - padding + 4} fill="rgba(255,255,255,0.2)" fontSize="9" textAnchor="end">1</text>
          <text x={padding - 10} y={height - padding - chartHeight / 2 + 4} fill="rgba(255,255,255,0.2)" fontSize="9" textAnchor="end">5</text>
          <text x={padding - 10} y={padding + 4} fill="rgba(255,255,255,0.2)" fontSize="9" textAnchor="end">10</text>
        </svg>
      </div>
    );
  };

  // Render SVG Bar Chart for Vocabulary Growth
  const renderVocabularyChart = () => {
    const dataPoints = history.map((h) => {
      const vScores = h.questions?.map((q: any) => q.vocabularyScore || 0) || [];
      return vScores.length > 0 ? vScores.reduce((a: number, b: number) => a + b, 0) / vScores.length : h.overallScore || 5;
    });

    const isDemo = dataPoints.length < 2;
    const points = isDemo ? [5, 5.5, 6, 6.5, 7, 8.5] : dataPoints;

    const width = 500;
    const height = 200;
    const padding = 25;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const barWidth = Math.max(10, chartWidth / (points.length * 2 || 1));

    return (
      <div className="relative bg-slate-900/50 border border-white/5 rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-slate-200">Vocabulary growth</h3>
            <p className="text-[10px] text-slate-500">Choice of words and phrase complexity growth</p>
          </div>
          {isDemo && <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[9px] font-bold">Demo Graph</span>}
        </div>

        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
          {/* Grid lines */}
          {[1, 3, 5, 7, 9, 10].map((val) => {
            const y = height - padding - ((val - 1) * chartHeight) / 9;
            return (
              <line key={val} x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
            );
          })}

          {points.map((val, idx) => {
            const x = padding + (idx * chartWidth) / (points.length || 1) + barWidth / 2;
            const barHeight = ((val - 1) * chartHeight) / 9;
            const y = height - padding - barHeight;

            return (
              <rect
                key={idx}
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx="3.5"
                fill="#34d399"
                opacity="0.8"
                className="hover:opacity-100 transition-opacity cursor-pointer"
              />
            );
          })}

          <text x={padding - 10} y={height - padding + 4} fill="rgba(255,255,255,0.2)" fontSize="9" textAnchor="end">1</text>
          <text x={padding - 10} y={height - padding - chartHeight / 2 + 4} fill="rgba(255,255,255,0.2)" fontSize="9" textAnchor="end">5</text>
          <text x={padding - 10} y={padding + 4} fill="rgba(255,255,255,0.2)" fontSize="9" textAnchor="end">10</text>
        </svg>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/20 to-slate-950 text-white py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation */}
        <div className="flex justify-between items-center">
          <div>
            <Link href="/dashboard" className="text-xs text-indigo-400 hover:text-indigo-300">
              ← Back to Dashboard
            </Link>
            <h1 className="text-xl font-bold flex items-center gap-2 mt-1">
              <span>📊</span> Analytics & Progress Trends
            </h1>
          </div>
        </div>

        {loading ? (
          <div className="glass-card p-12 text-center space-y-3">
            <div className="w-8 h-8 border-4 border-indigo-400 border-t-indigo-600 rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500">Compiling progress database...</p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Aggregate Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="glass-card p-6 border border-white/5 space-y-1 bg-slate-900/30">
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">📝 Vocabulary Learned</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black">{progress?.wordsLearned || 0}</span>
                  <span className="text-xs text-slate-500">words</span>
                </div>
              </div>

              <div className="glass-card p-6 border border-white/5 space-y-1 bg-slate-900/30">
                <span className="text-[10px] text-rose-400 font-bold uppercase tracking-widest">🎙️ Total Practice Time</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black">{Math.round(progress?.totalSpeakingMinutes || 0)}</span>
                  <span className="text-xs text-slate-500">minutes</span>
                </div>
              </div>

              <div className="glass-card p-6 border border-white/5 space-y-1 bg-slate-900/30">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">🔥 Learning Streak</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black">{progress?.streak || 0}</span>
                  <span className="text-xs text-slate-500">days active</span>
                </div>
              </div>
            </div>

            {/* Check if no history exists and show disclaimer */}
            {history.length < 2 && (
              <div className="p-4 bg-indigo-500/10 border border-indigo-500/15 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                <div>
                  <h4 className="text-sm font-bold text-slate-200">Track Real-Time Progress Charts</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Please complete at least 2 conversational AI interviews to plot your custom improvement graphs.</p>
                </div>
                <Link
                  href="/interview"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold shrink-0 transition-colors"
                >
                  Start First Interview 🎤
                </Link>
              </div>
            )}

            {/* Grids of charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderGrammarChart()}
              {renderFluencyChart()}
              <div className="md:col-span-2">
                {renderVocabularyChart()}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
