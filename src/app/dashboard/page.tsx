"use client";

import AuthGuard from "@/components/ui/AuthGuard";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { getUserProgress } from "@/lib/firestore";
import { lessons } from "@/data/lessons";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import type { UserProgress } from "@/types";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    async function fetchProgress() {
      if (user) {
        try {
          const data = await getUserProgress(user.uid);
          setProgress(data);
        } catch (err) {
          console.error("Error fetching progress:", err);
        }
      }
    }
    fetchProgress();
  }, [user]);

  const completedDays = progress?.completedDays || [];
  const completedCount = completedDays.length;
  const nextDay = completedCount > 0 ? Math.max(...completedDays) + 1 : 1;
  const todayLesson = lessons.find((l) => l.day === (nextDay <= 30 ? nextDay : 30));

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getMotivation = () => {
    if (completedCount === 0) return "Start your English journey today! 🚀";
    if (completedCount < 10) return "Great start! Keep the momentum going! 💪";
    if (completedCount < 20) return "You're making amazing progress! 🌟";
    if (completedCount < 30) return "Almost there! You're a champion! 🏆";
    return "Congratulations! You completed all 30 days! 🎉";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 page-enter">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
              {getGreeting()},{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                {user?.displayName?.split(" ")[0] || "Learner"}
              </span>
              !
            </h1>
            <p className="text-sm text-slate-400">{getMotivation()}</p>
          </div>
          {user?.photoURL && (
            <img
              src={user.photoURL}
              alt={user.displayName || ""}
              className="w-12 h-12 rounded-xl ring-2 ring-indigo-500/30 shadow-lg"
              referrerPolicy="no-referrer"
            />
          )}
        </div>

        {/* Progress Overview */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">30-Day Challenge</h2>
            <div className="flex items-center gap-2">
              {progress?.streak && progress.streak > 0 && (
                <Badge variant="warning">
                  🔥 {progress.streak} Day Streak
                </Badge>
              )}
              <Badge variant={completedCount >= 30 ? "success" : "info"}>
                {completedCount}/30 Days
              </Badge>
            </div>
          </div>
          <ProgressBar value={completedCount} max={30} label="Overall Progress" color="indigo" />

          {/* Milestone Badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {[7, 15, 30].map((milestone) => (
              <div
                key={milestone}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                  completedCount >= milestone
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                    : "bg-slate-800/50 text-slate-600 border border-slate-700/50"
                }`}
              >
                {completedCount >= milestone ? "🏅" : "🔒"} Day {milestone}
              </div>
            ))}
          </div>
        </div>

        {/* Today's Task */}
        {todayLesson && completedCount < 30 && (
          <div className="glass-card p-6 mb-6 glow-pulse">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">📖</span>
              <h2 className="text-lg font-bold text-white">
                {completedDays.includes(todayLesson.day) ? "Continue Learning" : "Today's Lesson"}
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-indigo-300 font-semibold">
                  Day {todayLesson.day}: {todayLesson.topic}
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  {todayLesson.description}
                </p>
                <p className="text-xs text-indigo-400/50 mt-1">
                  {todayLesson.teluguHint}
                </p>
              </div>
              <Link
                href={`/lessons/${todayLesson.day}`}
                className="shrink-0 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Start Lesson →
              </Link>
            </div>
          </div>
        )}

        {completedCount >= 30 && (
          <div className="glass-card p-6 mb-6 border-emerald-500/20">
            <div className="text-center py-4">
              <div className="text-5xl mb-3">🎉</div>
              <h2 className="text-xl font-bold text-white mb-2">
                Congratulations! You completed the 30-Day Challenge!
              </h2>
              <p className="text-slate-400 text-sm">
                You&apos;re now ready for AI Mock Interviews. Keep practicing!
              </p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/lessons"
            className="glass-card p-5 hover:-translate-y-1 transition-all duration-300 group"
          >
            <span className="text-3xl mb-3 block">📚</span>
            <h3 className="font-bold text-white group-hover:text-indigo-300 transition-colors">
              All Lessons
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Browse all 30 days of lessons
            </p>
          </Link>

          <Link
            href="/interview"
            className="glass-card p-5 hover:-translate-y-1 transition-all duration-300 group"
          >
            <span className="text-3xl mb-3 block">🎤</span>
            <h3 className="font-bold text-white group-hover:text-purple-300 transition-colors">
              Mock Interview
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Practice with AI interviews
            </p>
          </Link>

          <Link
            href="/profile"
            className="glass-card p-5 hover:-translate-y-1 transition-all duration-300 group"
          >
            <span className="text-3xl mb-3 block">📊</span>
            <h3 className="font-bold text-white group-hover:text-emerald-300 transition-colors">
              My Progress
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              View stats and interview history
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
