"use client";

import AuthGuard from "@/components/ui/AuthGuard";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { getUserProgress } from "@/lib/firestore";
import { lessons } from "@/data/lessons";
import ProgressBar from "@/components/ui/ProgressBar";
import Link from "next/link";
import type { UserProgress } from "@/types";

export default function LessonsPage() {
  return (
    <AuthGuard>
      <LessonsContent />
    </AuthGuard>
  );
}

function LessonsContent() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [activeLevel, setActiveLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");

  useEffect(() => {
    async function fetchProgress() {
      if (user) {
        const data = await getUserProgress(user.uid);
        setProgress(data);
        if (data?.level) {
          setActiveLevel(data.level);
        }
      }
    }
    fetchProgress();
  }, [user]);

  const completedDays = progress?.completedDays || [];

  const isDayAccessible = (day: number) => {
    if (day === 1) return true;
    if (day === 31) {
      return progress?.level === "intermediate" || progress?.level === "advanced" || completedDays.includes(30);
    }
    if (day === 61) {
      return progress?.level === "advanced" || completedDays.includes(60);
    }
    return completedDays.includes(day - 1);
  };

  const startDay = activeLevel === "intermediate" ? 31 : activeLevel === "advanced" ? 61 : 1;
  const endDay = activeLevel === "intermediate" ? 60 : activeLevel === "advanced" ? 90 : 30;
  const filteredLessons = lessons.filter((l) => l.day >= startDay && l.day <= endDay);
  const levelCompletedCount = completedDays.filter((d) => d >= startDay && d <= endDay).length;

  const trackNames = {
    beginner: "Beginner (Level 1)",
    intermediate: "Intermediate (Level 2)",
    advanced: "Advanced (Level 3)",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 page-enter">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            📚 English Mastery Course
          </h1>
          <p className="text-slate-400 text-sm mb-4">
            Learn English systematically across 3 difficulty tracks. Complete daily lessons to unlock certificates.
          </p>
          <ProgressBar
            value={levelCompletedCount}
            max={30}
            label={`${trackNames[activeLevel]} Progress: ${levelCompletedCount} of 30 days completed`}
            color="indigo"
          />
        </div>

        {/* Level Selector Tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/5 pb-px overflow-x-auto scrollbar-none">
          {[
            { id: "beginner", label: "🟢 Level 1: Beginner", days: "Days 1-30" },
            { id: "intermediate", label: "🟡 Level 2: Intermediate", days: "Days 31-60" },
            { id: "advanced", label: "🔴 Level 3: Advanced", days: "Days 61-90" }
          ].map((track) => {
            const isActive = activeLevel === track.id;
            return (
              <button
                key={track.id}
                onClick={() => setActiveLevel(track.id as any)}
                className={`flex flex-col items-start px-4 py-2 border-b-2 transition-all ${
                  isActive
                    ? "border-indigo-500 text-white"
                    : "border-transparent text-slate-500 hover:text-slate-300"
                }`}
              >
                <span className="text-sm font-bold">{track.label}</span>
                <span className="text-[10px] opacity-75 mt-0.5">{track.days}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {filteredLessons.map((lesson) => {
            const isCompleted = completedDays.includes(lesson.day);
            const isAccessible = isDayAccessible(lesson.day);
            const isCurrent = !isCompleted && isAccessible;

            return (
              <Link
                key={lesson.day}
                href={isAccessible ? `/lessons/${lesson.day}` : "#"}
                onClick={(e) => !isAccessible && e.preventDefault()}
                className={`relative p-4 rounded-xl border transition-all duration-300 ${
                  isCompleted
                    ? "bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10"
                    : isCurrent
                    ? "bg-indigo-500/5 border-indigo-500/30 hover:bg-indigo-500/10 hover:-translate-y-1 glow-pulse"
                    : "bg-slate-900/30 border-slate-800/50 opacity-50 cursor-not-allowed"
                }`}
              >
                {/* Day Number */}
                <div
                  className={`text-2xl font-extrabold mb-2 ${
                    isCompleted
                      ? "text-emerald-400"
                      : isCurrent
                      ? "text-indigo-400"
                      : "text-slate-700"
                  }`}
                >
                  {isCompleted ? "✅" : isAccessible ? lesson.day : "🔒"}
                </div>

                {/* Topic */}
                <h3
                  className={`text-xs font-semibold leading-tight ${
                    isCompleted
                      ? "text-emerald-300"
                      : isAccessible
                      ? "text-white"
                      : "text-slate-600"
                  }`}
                >
                  {isAccessible ? lesson.topic : `Day ${lesson.day}`}
                </h3>

                {/* Telugu Hint */}
                {isAccessible && (
                  <p className="text-[10px] text-indigo-400/40 mt-1 truncate">
                    {lesson.teluguHint}
                  </p>
                )}

                {/* Status badge */}
                {isCurrent && (
                  <div className="absolute -top-1.5 -right-1.5 px-2 py-0.5 bg-indigo-500 text-white text-[10px] font-bold rounded-full shadow-lg shadow-indigo-500/30">
                    NEW
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
