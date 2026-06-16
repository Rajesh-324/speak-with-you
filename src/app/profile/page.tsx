"use client";

import AuthGuard from "@/components/ui/AuthGuard";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { getUserProgress, getInterviewHistory, getBestScore } from "@/lib/firestore";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import type { UserProgress, InterviewSession } from "@/types";
import Link from "next/link";

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
  const [selectedCert, setSelectedCert] = useState<string | null>(null);

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
  const userBadges = progress?.badges || [];
  const userCerts = progress?.certificates || [];

  const BADGES_DETAILS: Record<string, { icon: string; name: string; desc: string; color: string }> = {
    placement_hero: { icon: "🚀", name: "Placement Hero", desc: "Completed the AI Placement Test", color: "border-blue-500/30 text-blue-400 bg-blue-500/5" },
    streak_3: { icon: "🔥", name: "Streak Starter", desc: "Achieved a 3-day learning streak", color: "border-orange-500/30 text-orange-400 bg-orange-500/5" },
    streak_7: { icon: "⚡", name: "Streak Master", desc: "Achieved a 7-day learning streak", color: "border-amber-500/30 text-amber-400 bg-amber-500/5" },
    streak_15: { icon: "🌌", name: "Streak Legend", desc: "Achieved a 15-day learning streak", color: "border-purple-500/30 text-purple-400 bg-purple-500/5" },
    streak_30: { icon: "☄️", name: "Streak Champion", desc: "Achieved a 30-day learning streak", color: "border-rose-500/30 text-rose-400 bg-rose-500/5" },
    lessons_5: { icon: "✍️", name: "Grammar Guru", desc: "Completed 5 daily lessons", color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/5" },
    lessons_15: { icon: "🗣️", name: "Fluency Seeker", desc: "Completed 15 daily lessons", color: "border-cyan-500/30 text-cyan-400 bg-cyan-500/5" },
    grad_beginner: { icon: "🎓", name: "Beginner Graduate", desc: "Finished Beginner Course (Day 30)", color: "border-indigo-500/30 text-indigo-400 bg-indigo-500/5" },
    grad_intermediate: { icon: "🎖️", name: "Intermediate Graduate", desc: "Finished Intermediate Course (Day 60)", color: "border-pink-500/30 text-pink-400 bg-pink-500/5" },
    grad_advanced: { icon: "🏆", name: "Advanced Graduate", desc: "Finished Advanced Course (Day 90)", color: "border-yellow-500/30 text-yellow-400 bg-yellow-500/5" },
    grad_master: { icon: "👑", name: "English Master", desc: "Finished all 90 days of lessons", color: "border-red-500/30 text-red-400 bg-red-500/5" },
    xp_1000: { icon: "💎", name: "XP Elite", desc: "Earned more than 1,000 XP", color: "border-amber-500/30 text-amber-400 bg-amber-500/5" },
    interview_master: { icon: "🥇", name: "Interview Master", desc: "Completed 3 interviews with score >= 8", color: "border-indigo-500/30 text-indigo-400 bg-indigo-500/5" },
  };

  const interviewTypeLabels: Record<string, string> = {
    hr: "🤝 HR Interview",
    tech: "💻 Tech Interview",
    support: "📞 Support Interview",
    english: "🗣️ English Practice",
    daily: "💬 Daily Conversation",
  };

  const trackNames = {
    beginner: "Beginner (Level 1)",
    intermediate: "Intermediate (Level 2)",
    advanced: "Advanced (Level 3)",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 page-enter">
        {/* User Info */}
        <div className="glass-card p-6 mb-6">
          <div className="flex flex-col gap-4">
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
                  <Badge variant="info">🏅 CEFR {progress?.cefrLevel || "A1"}</Badge>
                  <Badge variant="success">⚡ {progress?.xp || 0} XP</Badge>
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

            {/* Current Track Settings */}
            <div className="mt-2 border-t border-white/5 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-slate-400 font-semibold">Current Track:</span>
              <div className="flex gap-1.5">
                {(["beginner", "intermediate", "advanced"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={async () => {
                      if (!user) return;
                      const { changeUserLevel } = await import("@/lib/firestore");
                      await changeUserLevel(user.uid, lvl);
                      window.location.reload();
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize border transition-all ${
                      progress?.level === lvl
                        ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-300"
                        : "bg-slate-900/40 border-white/5 text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Part B Quick Navigation Links */}
            <div className="mt-3 border-t border-white/5 pt-3 flex flex-wrap gap-2 justify-end">
              <Link
                href="/leaderboard"
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/25 transition-all"
              >
                🏆 Leaderboard & Referrals
              </Link>
              <Link
                href="/booster"
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/25 transition-all"
              >
                🚀 Resume & Interview Booster
              </Link>
              {user?.email === "gunagantirajesh7@gmail.com" && (
                <Link
                  href="/admin"
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/25 transition-all"
                >
                  ⚙️ Admin Dashboard
                </Link>
              )}
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
                {completedDays.length}/90
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

        {/* Unlocked Certificates */}
        <div className="glass-card p-5 mb-6">
          <h2 className="text-sm font-bold text-white mb-4">🎓 Unlocked Credentials</h2>
          {userCerts.length === 0 ? (
            <div className="text-center py-6 bg-slate-900/20 border border-white/5 rounded-xl">
              <span className="text-3xl mb-2 block">🔒</span>
              <p className="text-xs text-slate-500 font-bold">No certificates unlocked yet.</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Complete Day 30, 60, or 90 to unlock completion credentials.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {userCerts.map((cKey) => {
                const titleMap = {
                  beginner_cert: "Beginner Certificate",
                  intermediate_cert: "Intermediate Certificate",
                  advanced_cert: "Advanced Certificate",
                  master_cert: "90-Day Master Certificate",
                };
                const descMap = {
                  beginner_cert: "For completing Level 1 Beginner curriculum (Days 1–30)",
                  intermediate_cert: "For completing Level 2 Intermediate curriculum (Days 31–60)",
                  advanced_cert: "For completing Level 3 Advanced curriculum (Days 61–90)",
                  master_cert: "For completing the full 90-Day English Mastery course",
                };

                return (
                  <div key={cKey} className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/20 to-slate-900 border border-indigo-500/10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">🏆</span>
                        <h3 className="text-sm font-bold text-white">{titleMap[cKey as keyof typeof titleMap]}</h3>
                      </div>
                      <p className="text-xs text-slate-400 mb-4">{descMap[cKey as keyof typeof descMap]}</p>
                    </div>
                    <button
                      onClick={() => setSelectedCert(cKey)}
                      className="w-full py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-xs transition-colors shadow-lg shadow-indigo-500/10"
                    >
                      View & Print Certificate
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Earned Badges */}
        <div className="glass-card p-5 mb-6">
          <h2 className="text-sm font-bold text-white mb-4">🎖️ Earned Achievements ({userBadges.length}/{Object.keys(BADGES_DETAILS).length})</h2>
          {userBadges.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No achievements unlocked yet. Complete daily lessons and streaks to earn badges!</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {userBadges.map((bKey) => {
                const badge = BADGES_DETAILS[bKey];
                if (!badge) return null;
                return (
                  <div key={bKey} className={`p-3 rounded-xl border flex flex-col items-center text-center ${badge.color}`}>
                    <div className="text-3xl mb-1">{badge.icon}</div>
                    <div className="text-xs font-bold text-white leading-tight">{badge.name}</div>
                    <div className="text-[10px] text-slate-400 mt-1 leading-snug">{badge.desc}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="glass-card p-5 mb-6">
          <h2 className="text-sm font-bold text-white mb-3">Overall Progress Dashboard</h2>
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
              <ProgressBar value={completedDays.length} max={90} color="indigo" />

              {/* Day indicators */}
              <div className="flex flex-wrap gap-1 mt-4 max-h-48 overflow-y-auto pr-1">
                {Array.from({ length: 90 }, (_, i) => i + 1).map((day) => (
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

      {/* Certificate Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-2xl w-full bg-slate-900 border border-amber-500/20 rounded-2xl p-6 sm:p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Printable Certificate Frame */}
            <div id="printable-certificate" className="border-4 border-double border-amber-500/30 p-6 sm:p-8 rounded-xl bg-slate-950 text-center relative overflow-hidden my-4">
              <div className="absolute top-2 left-2 text-amber-500/20 text-xs">◆</div>
              <div className="absolute top-2 right-2 text-amber-500/20 text-xs">◆</div>
              <div className="absolute bottom-2 left-2 text-amber-500/20 text-xs">◆</div>
              <div className="absolute bottom-2 right-2 text-amber-500/20 text-xs">◆</div>

              <div className="text-[10px] sm:text-xs text-amber-400/60 uppercase tracking-widest font-bold mb-2">
                Certificate of Completion
              </div>
              <h2 className="text-xl sm:text-2xl font-serif text-white mb-4">
                {selectedCert === "master_cert" ? "🏆 English Master Certificate" : "🎓 SpeakWithYou English Certification"}
              </h2>

              <p className="text-xs text-slate-400 italic mb-4">This is proudly presented to</p>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-300 mb-4 font-serif">
                {user?.displayName || "Dedicated Learner"}
              </h1>

              <p className="text-xs text-slate-400 leading-relaxed max-w-md mx-auto mb-6">
                for successfully completing all curriculum requirements and speaking/writing tasks of the
                <span className="text-white font-bold block mt-1">
                  {selectedCert === "beginner_cert"
                    ? "Level 1: Beginner Course (Days 1–30)"
                    : selectedCert === "intermediate_cert"
                    ? "Level 2: Intermediate Course (Days 31–60)"
                    : selectedCert === "advanced_cert"
                    ? "Level 3: Advanced Course (Days 61–90)"
                    : "90-Day Full English Mastery Course"}
                </span>
              </p>

              <div className="grid grid-cols-2 gap-4 border-t border-b border-white/5 py-4 max-w-sm mx-auto mb-6">
                <div className="text-left">
                  <div className="text-[8px] text-slate-500 uppercase font-semibold">CEFR Assessment</div>
                  <div className="text-xs text-amber-400 font-bold">Grade {progress?.cefrLevel || "A2"}</div>
                </div>
                <div className="text-right">
                  <div className="text-[8px] text-slate-500 uppercase font-semibold">Verification ID</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    SWY-{selectedCert.split("_")[0].toUpperCase()}-{user?.uid.slice(0, 6)}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center max-w-md mx-auto mt-8">
                <div className="text-center w-28">
                  <div className="h-6 flex items-center justify-center font-serif text-indigo-400 italic text-sm">
                    SpeakWithYou
                  </div>
                  <div className="border-t border-white/10 pt-1 text-[8px] text-slate-500 uppercase">
                    Issuer
                  </div>
                </div>
                <div className="text-center w-28">
                  <div className="h-6 flex items-center justify-center font-serif text-indigo-400 italic text-sm">
                    AI Assessor
                  </div>
                  <div className="border-t border-white/10 pt-1 text-[8px] text-slate-500 uppercase">
                    Evaluator
                  </div>
                </div>
              </div>
            </div>

            {/* Print Styles helper */}
            <style dangerouslySetInnerHTML={{__html: `
              @media print {
                body * {
                  visibility: hidden !important;
                }
                #printable-certificate, #printable-certificate * {
                  visibility: visible !important;
                }
                #printable-certificate {
                  position: fixed !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: 100% !important;
                  height: auto !important;
                  border: none !important;
                  background: white !important;
                  color: black !important;
                  z-index: 9999 !important;
                }
                #printable-certificate * {
                  color: black !important;
                  background: transparent !important;
                }
                #printable-certificate h1, #printable-certificate h2 {
                  color: black !important;
                  background-image: none !important;
                  -webkit-text-fill-color: black !important;
                }
              }
            `}} />

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-amber-500/10"
              >
                🖨️ Print Certificate
              </button>
              <button
                onClick={() => setSelectedCert(null)}
                className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-semibold hover:bg-white/10 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
