"use client";

import AuthGuard from "@/components/ui/AuthGuard";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { getUserProgress, getInterviewHistory, getBestScore } from "@/lib/firestore";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import type { UserProgress, InterviewSession } from "@/types";

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  );
}

function ProfileContent() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [interviews, setInterviews] = useState<InterviewSession[]>([]);
  const [bestScore, setBestScore] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [indexError, setIndexError] = useState(false);

  useEffect(() => {
    if (!user) return;

    setLoadingProgress(true);
    setLoadingAnalytics(true);
    setIndexError(false);

    // Fetch progress (does not require composite indexes)
    getUserProgress(user.uid)
      .then((progressData) => {
        setProgress(progressData);
      })
      .catch((err) => {
        console.error("Error fetching progress data:", err);
      })
      .finally(() => {
        setLoadingProgress(false);
      });

    // Fetch interview history (requires composite index, can fail during provisioning)
    Promise.all([
      getInterviewHistory(user.uid),
      getBestScore(user.uid),
    ])
      .then(([interviewData, best]) => {
        setInterviews(interviewData);
        setBestScore(best);
      })
      .catch((err) => {
        console.error("Error fetching interview history:", err);
        const errMsg = (err as Error)?.message || "";
        const errCode = (err as { code?: string })?.code || "";
        if (
          errCode === "failed-precondition" ||
          errMsg.includes("index") ||
          errMsg.includes("requires an index") ||
          errMsg.includes("indexing")
        ) {
          setIndexError(true);
        }
      })
      .finally(() => {
        setLoadingAnalytics(false);
      });
  }, [user]);

  const completedDays = progress?.completedDays || [];

  const interviewTypeLabels: Record<string, string> = {
    "self-intro": "🙋 Self Introduction",
    hr: "🤝 HR Interview",
    fresher: "🎓 Fresher Interview",
    daily: "💬 Daily Conversation Practice",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 page-enter">
        {/* User Info */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center gap-4">
            {user?.photoURL && (
              <img
                src={user.photoURL}
                alt={user.displayName || ""}
                className="w-16 h-16 rounded-2xl ring-2 ring-indigo-500/30 shadow-lg"
                referrerPolicy="no-referrer"
              />
            )}
            <div>
              <h1 className="text-xl font-extrabold text-white">
                {user?.displayName}
              </h1>
              <p className="text-sm text-slate-400">{user?.email}</p>
              <div className="flex gap-2 mt-2 flex-wrap items-center">
                {loadingProgress ? (
                  <div className="h-6 w-24 bg-slate-800 rounded animate-pulse" />
                ) : (
                  <>
                    {progress?.streak && progress.streak > 0 && (
                      <Badge variant="warning">🔥 {progress.streak} Day Streak</Badge>
                    )}
                    <Badge variant="info">📚 {completedDays.length} Days</Badge>
                  </>
                )}
                {loadingAnalytics ? (
                  <div className="h-6 w-24 bg-slate-800 rounded animate-pulse" />
                ) : (
                  <>
                    <Badge variant="success">
                      🏆 {indexError ? "--" : `${bestScore}/10`}
                    </Badge>
                    <Badge variant="warning">
                      🎤 {indexError ? "--" : interviews.length} Interviews
                    </Badge>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {loadingProgress ? (
            <div className="glass-card p-4 text-center animate-pulse col-span-1">
              <div className="h-6 w-6 bg-slate-800 rounded mx-auto mb-2" />
              <div className="h-5 w-12 bg-slate-800 rounded mx-auto mb-1" />
              <div className="h-3 w-16 bg-slate-800 rounded mx-auto" />
            </div>
          ) : (
            <div className="glass-card p-4 text-center">
              <div className="text-2xl mb-1">📅</div>
              <div className="text-xl font-extrabold text-indigo-400">
                {completedDays.length}/30
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Days Completed</div>
            </div>
          )}

          {loadingAnalytics ? (
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card p-4 text-center animate-pulse">
                  <div className="h-6 w-6 bg-slate-800 rounded mx-auto mb-2" />
                  <div className="h-5 w-12 bg-slate-800 rounded mx-auto mb-1" />
                  <div className="h-3 w-16 bg-slate-800 rounded mx-auto" />
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="glass-card p-4 text-center">
                <div className="text-2xl mb-1">🏆</div>
                <div className="text-xl font-extrabold text-amber-400">
                  {indexError ? "Preparing..." : `${bestScore}/10`}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Best Score</div>
              </div>

              <div className="glass-card p-4 text-center">
                <div className="text-2xl mb-1">🎤</div>
                <div className="text-xl font-extrabold text-purple-400">
                  {indexError ? "Preparing..." : interviews.length}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Interviews Taken</div>
              </div>

              <div className="glass-card p-4 text-center">
                <div className="text-2xl mb-1">📊</div>
                <div className="text-xl font-extrabold text-emerald-400">
                  {indexError
                    ? "Preparing..."
                    : interviews.length > 0
                    ? `${(interviews.reduce((s, i) => s + i.overallScore, 0) / interviews.length).toFixed(1)}/10`
                    : "N/A"}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Avg Score</div>
              </div>
            </>
          )}
        </div>

        {/* AI Skills Assessment */}
        {loadingAnalytics ? (
          <div className="glass-card p-5 mb-6 animate-pulse">
            <div className="h-4 w-40 bg-slate-800 rounded mb-4" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white/[0.01] border border-white/[0.05] rounded-xl p-3 text-center h-20 flex flex-col justify-between items-center">
                  <div className="h-6 w-6 bg-slate-800 rounded mb-1" />
                  <div className="h-4 w-12 bg-slate-800 rounded mb-1" />
                  <div className="h-3 w-16 bg-slate-800 rounded" />
                </div>
              ))}
            </div>
          </div>
        ) : indexError ? (
          <div className="glass-card p-5 mb-6 bg-amber-500/5 border border-amber-500/10">
            <h2 className="text-sm font-bold text-white mb-2">🤖 AI Skills Assessment</h2>
            <p className="text-xs text-slate-400">
              Analytics are being prepared. This will activate automatically once the database indexes are fully built by Firebase.
            </p>
          </div>
        ) : interviews.length > 0 ? (
          <div className="glass-card p-5 mb-6">
            <h2 className="text-sm font-bold text-white mb-4">🤖 AI Skills Assessment</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  label: "Grammar",
                  value: (interviews.reduce((sum, s) => sum + s.questions.reduce((qSum, q) => qSum + (q.grammarScore || 0), 0) / s.questions.length, 0) / interviews.length).toFixed(1),
                  color: "text-emerald-400",
                  icon: "📝"
                },
                {
                  label: "Fluency",
                  value: (interviews.reduce((sum, s) => sum + s.questions.reduce((qSum, q) => qSum + (q.fluencyScore || 0), 0) / s.questions.length, 0) / interviews.length).toFixed(1),
                  color: "text-indigo-400",
                  icon: "🗣️"
                },
                {
                  label: "Vocabulary",
                  value: (interviews.reduce((sum, s) => sum + s.questions.reduce((qSum, q) => qSum + (q.vocabularyScore || 0), 0) / s.questions.length, 0) / interviews.length).toFixed(1),
                  color: "text-purple-400",
                  icon: "📚"
                },
                {
                  label: "Confidence",
                  value: (interviews.reduce((sum, s) => sum + s.questions.reduce((qSum, q) => qSum + (q.confidenceScore || 0), 0) / s.questions.length, 0) / interviews.length).toFixed(1),
                  color: "text-amber-400",
                  icon: "⚡"
                }
              ].map((skill) => (
                <div key={skill.label} className="bg-white/[0.01] border border-white/[0.05] rounded-xl p-3 text-center">
                  <div className="text-xl mb-1">{skill.icon}</div>
                  <div className={`text-lg font-extrabold ${skill.color}`}>{skill.value}/10</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{skill.label}</div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Progress Bar */}
        <div className="glass-card p-5 mb-6">
          <h2 className="text-sm font-bold text-white mb-3">30-Day Challenge Progress</h2>
          {loadingProgress ? (
            <div className="animate-pulse">
              <div className="h-4 bg-slate-800 rounded w-full mb-4" />
              <div className="flex flex-wrap gap-1 mt-4">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div key={i} className="w-6 h-6 rounded bg-slate-800" />
                ))}
              </div>
            </div>
          ) : (
            <>
              <ProgressBar value={completedDays.length} max={30} color="indigo" />

              {/* Day indicators */}
              <div className="flex flex-wrap gap-1 mt-4">
                {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                  <div
                    key={day}
                    className={`w-6 h-6 rounded text-[10px] font-bold flex items-center justify-center ${
                      completedDays.includes(day)
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-slate-800/50 text-slate-700 border border-slate-700/30"
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Interview History */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-bold text-white mb-4">🎤 Interview History</h2>

          {loadingAnalytics ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.06] animate-pulse">
                  <div className="flex justify-between items-center mb-2">
                    <div className="h-4 w-32 bg-slate-800 rounded" />
                    <div className="h-6 w-12 bg-slate-800 rounded" />
                  </div>
                  <div className="h-3 w-24 bg-slate-800 rounded mb-2" />
                  <div className="h-2 w-full bg-slate-800 rounded mb-2" />
                  <div className="h-3 w-48 bg-slate-800 rounded" />
                </div>
              ))}
            </div>
          ) : indexError ? (
            <div className="text-center py-8 bg-amber-500/5 border border-amber-500/10 rounded-xl p-4">
              <div className="text-3xl mb-2">⏳</div>
              <p className="text-sm text-amber-300 font-semibold">Analytics are being prepared</p>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Firebase is building the database indexes required to load your history. This takes a few minutes. Please refresh the page in a bit.
              </p>
            </div>
          ) : interviews.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-3xl mb-2">🎯</div>
              <p className="text-sm text-slate-400">No interviews yet.</p>
              <p className="text-xs text-slate-600 mt-1">
                Take a mock interview to see your results here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {interviews.map((session, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {interviewTypeLabels[session.type] || session.type}
                      </span>
                    </div>
                    <span
                      className={`text-lg font-extrabold ${
                        session.overallScore >= 8
                          ? "text-emerald-400"
                          : session.overallScore >= 5
                          ? "text-amber-400"
                          : "text-rose-400"
                      }`}
                    >
                      {session.overallScore}/10
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mb-2">
                    {session.createdAt && typeof session.createdAt === "object" && "toDate" in session.createdAt
                      ? (session.createdAt as { toDate: () => Date }).toDate().toLocaleDateString()
                      : "Recently"}
                    {" · "}
                    {session.questions.length} questions
                  </p>

                  {/* Per-question scores */}
                  <div className="flex gap-1">
                    {session.questions.map((q, qi) => (
                      <div
                        key={qi}
                        className={`flex-1 h-1.5 rounded-full ${
                          q.score >= 8
                            ? "bg-emerald-500"
                            : q.score >= 5
                            ? "bg-amber-500"
                            : "bg-rose-500"
                        }`}
                        title={`Q${qi + 1}: ${q.score}/10`}
                      />
                    ))}
                  </div>

                  <p className="text-xs text-slate-500 mt-2 italic">
                    {session.overallFeedback}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
