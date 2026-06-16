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

  useEffect(() => {
    async function fetchProgress() {
      if (user) {
        const data = await getUserProgress(user.uid);
        setProgress(data);
      }
    }
    fetchProgress();
  }, [user]);

  const completedDays = progress?.completedDays || [];

  const isDayAccessible = (day: number) => {
    if (day === 1) return true;
    return completedDays.includes(day - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 page-enter">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            📚 30-Day English Course
          </h1>
          <p className="text-slate-400 text-sm mb-4">
            Complete each day to unlock the next. Start from Day 1 and build your skills step by step.
          </p>
          <ProgressBar
            value={completedDays.length}
            max={30}
            label={`${completedDays.length} of 30 days completed`}
            color="indigo"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {lessons.map((lesson) => {
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
                  {isCompleted ? "✅" : isCurrent ? lesson.day : "🔒"}
                </div>

                {/* Topic */}
                <h3
                  className={`text-xs font-semibold leading-tight ${
                    isCompleted
                      ? "text-emerald-300"
                      : isCurrent
                      ? "text-white"
                      : "text-slate-600"
                  }`}
                >
                  {isCurrent || isCompleted ? lesson.topic : `Day ${lesson.day}`}
                </h3>

                {/* Telugu Hint */}
                {(isCurrent || isCompleted) && (
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
