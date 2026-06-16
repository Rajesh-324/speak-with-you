"use client";

import AuthGuard from "@/components/ui/AuthGuard";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    if (progress && !progress.placementTestCompleted) {
      router.push("/placement-test");
    }
  }, [progress, router]);

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

  let nextDay = 1;
  let maxDayLimit = 30;
  let trackName = "Beginner";
  
  if (progress) {
    if (progress.level === "intermediate") {
      nextDay = 31;
      maxDayLimit = 60;
      trackName = "Intermediate";
    } else if (progress.level === "advanced") {
      nextDay = 61;
      maxDayLimit = 90;
      trackName = "Advanced";
    }
  }

  if (completedDays.length > 0) {
    const highestCompleted = Math.max(...completedDays);
    nextDay = highestCompleted + 1;
  }

  const isTrackCompleted = completedDays.includes(maxDayLimit);
  const todayLesson = lessons.find((l) => l.day === (nextDay <= maxDayLimit ? nextDay : maxDayLimit));

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getMotivation = () => {
    if (isTrackCompleted) {
      return `Congratulations! You completed the ${trackName} Track! 🎉`;
    }
    if (completedCount === 0) return "Start your English journey today! 🚀";
    if (completedCount < 10) return "Great start! Keep the momentum going! 💪";
    if (completedCount < 30) return "You're making amazing progress! 🌟";
    return "Almost there! You're a champion! 🏆";
  };

  // Determine completed percentage for progress bar
  const startDay = progress?.level === "intermediate" ? 31 : progress?.level === "advanced" ? 61 : 1;
  const levelCompletedCount = completedDays.filter(d => d >= startDay && d <= maxDayLimit).length;

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
            <p className="text-sm text-slate-400 mb-2">{getMotivation()}</p>
            <div className="flex gap-1.5 flex-wrap items-center mt-2">
              <Badge variant="info">🏅 CEFR {progress?.cefrLevel || "A1"}</Badge>
              <Badge variant="success">⚡ {progress?.xp || 0} XP</Badge>
              <Badge variant="warning">
                👑 Track: {trackName}
              </Badge>
            </div>
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

        {/* Placement Test CTA */}
        {progress && !progress.placementTestCompleted && (
          <div className="glass-card p-5 mb-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 glow-pulse">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-base font-bold text-white mb-1">🤖 Custom Learning Path</h2>
                <p className="text-xs text-slate-400">
                  Take a 5-minute AI Placement Test to evaluate your speaking/writing skills and instantly unlock Level 2: Intermediate (Day 31+) or Level 3: Advanced (Day 61+) lessons!
                </p>
              </div>
              <Link
                href="/placement-test"
                className="shrink-0 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-xs shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Take Placement Test (+100 XP)
              </Link>
            </div>
          </div>
        )}

        {/* Progress Overview */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">{trackName} Challenge</h2>
            <div className="flex items-center gap-2">
              {progress?.streak && progress.streak > 0 && (
                <Badge variant="warning">
                  🔥 {progress.streak} Day Streak
                </Badge>
              )}
              <Badge variant={isTrackCompleted ? "success" : "info"}>
                {levelCompletedCount}/30 Days
              </Badge>
            </div>
          </div>
          <ProgressBar value={levelCompletedCount} max={30} label={`${trackName} Progress`} color="indigo" />

          {/* Milestone Badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {[7, 15, 30].map((milestone) => {
              const dayToCheck = startDay - 1 + milestone;
              const hasCompletedMilestone = completedDays.includes(dayToCheck);
              return (
                <div
                  key={milestone}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                    hasCompletedMilestone
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      : "bg-slate-800/50 text-slate-600 border border-slate-700/50"
                  }`}
                >
                  {hasCompletedMilestone ? "🏅" : "🔒"} Day {milestone}
                </div>
              );
            })}
          </div>
        </div>

        {/* Today's Task */}
        {todayLesson && !isTrackCompleted && (
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

        {isTrackCompleted && (
          <div className="glass-card p-6 mb-6 border-emerald-500/20">
            <div className="text-center py-4">
              <div className="text-5xl mb-3">🎉</div>
              <h2 className="text-xl font-bold text-white mb-2">
                Congratulations! You completed the {trackName} Track!
              </h2>
              <p className="text-slate-400 text-sm mb-4">
                You have earned your {trackName} Certificate. Check it out on your profile!
              </p>
              {progress?.level !== "advanced" && (
                <button
                  onClick={async () => {
                    if (!progress || !user) return;
                    const nextLvl = progress.level === "beginner" ? "intermediate" : "advanced";
                    const { changeUserLevel } = await import("@/lib/firestore");
                    await changeUserLevel(user.uid, nextLvl);
                    window.location.reload();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold text-sm shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Unlock Next Track →
                </button>
              )}
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
              Browse lessons across all 3 levels
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
              My Progress & Badges
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              View achievements and certificates
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
