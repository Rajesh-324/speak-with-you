"use client";

import AuthGuard from "@/components/ui/AuthGuard";
import { useAuth } from "@/contexts/AuthContext";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { getUserProgress, markDayCompleted } from "@/lib/firestore";
import { lessons } from "@/data/lessons";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import type { UserProgress } from "@/types";

export default function LessonDayPage() {
  return (
    <AuthGuard>
      <LessonDayContent />
    </AuthGuard>
  );
}

function LessonDayContent() {
  const { user } = useAuth();
  const params = useParams();
  const dayNum = Number(params.day);

  const lesson = lessons.find((l) => l.day === dayNum) || null;
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [activeTab, setActiveTab] = useState("vocabulary");
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [writingText, setWritingText] = useState("");

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
  const isCompleted = completedDays.includes(dayNum);
  const isAccessible = dayNum === 1 || completedDays.includes(dayNum - 1);

  const handleComplete = useCallback(async () => {
    if (!user || isCompleted || completing) return;
    setCompleting(true);
    try {
      await markDayCompleted(user.uid, dayNum);
      setProgress((prev) => {
        const currentStreak = prev?.streak || 0;
        let newStreak = 1;
        if (prev?.updatedAt) {
          const lastUpdated = prev.updatedAt instanceof Date
            ? prev.updatedAt
            : (prev.updatedAt as { toDate?: () => Date }).toDate
            ? (prev.updatedAt as { toDate: () => Date }).toDate()
            : new Date(prev.updatedAt as unknown as string);
          const today = new Date();
          const date1 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
          const date2 = new Date(lastUpdated.getFullYear(), lastUpdated.getMonth(), lastUpdated.getDate());
          const diffTime = Math.abs(date1.getTime() - date2.getTime());
          const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays === 0) {
            newStreak = currentStreak || 1;
          } else if (diffDays === 1) {
            newStreak = currentStreak + 1;
          } else {
            newStreak = 1;
          }
        }
        return {
          uid: user.uid,
          completedDays: [...(prev?.completedDays || []), dayNum],
          lastCompletedDay: dayNum,
          streak: newStreak,
          updatedAt: new Date(),
        };
      });
    } catch (err) {
      console.error("Error marking day completed:", err);
    }
    setCompleting(false);
  }, [user, dayNum, isCompleted, completing]);

  const toggleFlip = (index: number) => {
    setFlippedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) newSet.delete(index);
      else newSet.add(index);
      return newSet;
    });
  };

  const getQuizScore = () => {
    if (!lesson) return 0;
    return lesson.quiz.reduce(
      (score, q, i) => score + (quizAnswers[i] === q.correctIndex ? 1 : 0),
      0
    );
  };

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <p className="text-xl text-slate-400">Lesson not found</p>
          <Link href="/lessons" className="text-indigo-400 hover:underline text-sm mt-2 inline-block">
            ← Back to lessons
          </Link>
        </div>
      </div>
    );
  }

  if (!isAccessible) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center glass-card p-8">
          <div className="text-5xl mb-4">🔒</div>
          <p className="text-lg text-white font-bold mb-2">Day {dayNum} is Locked</p>
          <p className="text-sm text-slate-400 mb-4">Complete Day {dayNum - 1} first to unlock this lesson.</p>
          <Link
            href={`/lessons/${dayNum - 1}`}
            className="px-6 py-2 rounded-lg bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition-colors"
          >
            Go to Day {dayNum - 1}
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "vocabulary", label: "📝 Vocabulary", shortLabel: "Vocab" },
    { id: "grammar", label: "📖 Grammar", shortLabel: "Grammar" },
    { id: "practice", label: "🗣️ Practice", shortLabel: "Practice" },
    { id: "speaking", label: "🎤 Speaking", shortLabel: "Speak" },
    { id: "writing", label: "✍️ Writing", shortLabel: "Write" },
    { id: "quiz", label: "❓ Quiz", shortLabel: "Quiz" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 page-enter">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <Link href="/lessons" className="text-xs text-indigo-400 hover:text-indigo-300 mb-2 inline-block">
              ← Back to lessons
            </Link>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              Day {lesson.day}: {lesson.topic}
            </h1>
            <p className="text-sm text-slate-400 mt-1">{lesson.description}</p>
            <p className="text-xs text-indigo-400/50 mt-0.5">{lesson.teluguHint}</p>
          </div>
          <Badge variant={isCompleted ? "success" : "info"}>
            {isCompleted ? "✅ Done" : `Day ${dayNum}`}
          </Badge>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-2 scrollbar-thin">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
              }`}
            >
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.shortLabel}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="glass-card p-5 sm:p-6 mb-6">
          {/* VOCABULARY */}
          {activeTab === "vocabulary" && (
            <div>
              <h2 className="text-lg font-bold text-white mb-4">📝 Vocabulary ({lesson.vocabulary.length} words)</h2>
              <p className="text-xs text-slate-500 mb-4">Click on a card to see the meaning and example</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lesson.vocabulary.map((word, i) => (
                  <div
                    key={i}
                    onClick={() => toggleFlip(i)}
                    className="cursor-pointer flip-card"
                  >
                    <div className={`flip-card-inner relative ${flippedCards.has(i) ? "flipped" : ""}`}
                      style={{ minHeight: "120px" }}
                    >
                      {/* Front */}
                      <div className={`flip-card-front absolute inset-0 p-4 rounded-xl border transition-colors ${
                        flippedCards.has(i)
                          ? "bg-indigo-500/5 border-indigo-500/20"
                          : "bg-white/[0.02] border-white/[0.06] hover:border-indigo-500/30"
                      }`}>
                        <div className="text-lg font-bold text-indigo-300">{word.word}</div>
                        <div className="text-xs text-slate-500 mt-1">/{word.pronunciation}/</div>
                        <div className="text-xs text-slate-600 mt-2">👆 Tap to see meaning</div>
                      </div>

                      {/* Back */}
                      <div className="flip-card-back absolute inset-0 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                        <div className="text-sm font-bold text-indigo-300">{word.word}</div>
                        <div className="text-xs text-slate-300 mt-1">{word.meaning}</div>
                        <div className="text-xs text-slate-400 mt-2 italic">&ldquo;{word.example}&rdquo;</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GRAMMAR */}
          {activeTab === "grammar" && (
            <div>
              <h2 className="text-lg font-bold text-white mb-2">📖 {lesson.grammar.title}</h2>
              <div className="bg-indigo-500/5 rounded-xl p-4 border border-indigo-500/10 mb-4">
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {lesson.grammar.explanation}
                </p>
              </div>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-indigo-300 mb-2">Structure:</h3>
                <code className="text-xs bg-slate-800 text-emerald-400 px-3 py-1.5 rounded-lg inline-block">
                  {lesson.grammar.structure}
                </code>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-indigo-300 mb-2">Examples:</h3>
                <ul className="space-y-2">
                  {lesson.grammar.examples.map((ex, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-indigo-400 mt-0.5">→</span>
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* PRACTICE SENTENCES */}
          {activeTab === "practice" && (
            <div>
              <h2 className="text-lg font-bold text-white mb-4">🗣️ Practice Sentences</h2>
              <p className="text-xs text-slate-500 mb-4">Read each sentence aloud 3 times. Telugu translation is provided for understanding.</p>
              <div className="space-y-3">
                {lesson.practiceSentences.map((sentence, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <div className="flex items-start gap-3">
                      <span className="text-indigo-400 font-bold text-sm mt-0.5">{i + 1}</span>
                      <div>
                        <p className="text-sm text-white font-medium">{sentence.english}</p>
                        <p className="text-xs text-indigo-400/50 mt-1">{sentence.telugu}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SPEAKING TASK */}
          {activeTab === "speaking" && (
            <div>
              <h2 className="text-lg font-bold text-white mb-4">🎤 Speaking Task</h2>
              <div className="bg-purple-500/5 rounded-xl p-4 border border-purple-500/10 mb-4">
                <h3 className="text-sm font-semibold text-purple-300 mb-2">Your Task:</h3>
                <p className="text-sm text-slate-300">{lesson.speakingTask.instruction}</p>
              </div>
              <div className="bg-white/[0.02] rounded-xl p-4 border border-white/[0.06]">
                <h3 className="text-sm font-semibold text-emerald-300 mb-2">Example Answer:</h3>
                <p className="text-sm text-slate-400 italic">&ldquo;{lesson.speakingTask.exampleAnswer}&rdquo;</p>
              </div>
              <p className="text-xs text-slate-600 mt-4 text-center">
                💡 Tip: Practice by speaking aloud. You can record yourself on your phone to hear how you sound!
              </p>
            </div>
          )}

          {/* WRITING TASK */}
          {activeTab === "writing" && (
            <div>
              <h2 className="text-lg font-bold text-white mb-4">✍️ Writing Task</h2>
              <div className="bg-amber-500/5 rounded-xl p-4 border border-amber-500/10 mb-4">
                <h3 className="text-sm font-semibold text-amber-300 mb-2">Your Task:</h3>
                <p className="text-sm text-slate-300">{lesson.writingTask.instruction}</p>
                <p className="text-xs text-slate-500 mt-2">💡 Hint: {lesson.writingTask.hint}</p>
              </div>
              <textarea
                value={writingText}
                onChange={(e) => setWritingText(e.target.value)}
                placeholder="Write your answer here..."
                className="w-full h-40 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 resize-none"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-slate-600">
                  {writingText.trim().split(/\s+/).filter(Boolean).length} words
                </span>
                <span className="text-xs text-slate-600">
                  Practice makes perfect! ✨
                </span>
              </div>
            </div>
          )}

          {/* QUIZ */}
          {activeTab === "quiz" && (
            <div>
              <h2 className="text-lg font-bold text-white mb-4">
                ❓ Quiz ({lesson.quiz.length} questions)
              </h2>
              <div className="space-y-5">
                {lesson.quiz.map((q, qi) => (
                  <div key={qi} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <p className="text-sm font-semibold text-white mb-3">
                      {qi + 1}. {q.question}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((option, oi) => {
                        const isSelected = quizAnswers[qi] === oi;
                        const isCorrect = quizSubmitted && oi === q.correctIndex;
                        const isWrong = quizSubmitted && isSelected && oi !== q.correctIndex;

                        return (
                          <button
                            key={oi}
                            onClick={() => {
                              if (!quizSubmitted) {
                                setQuizAnswers((prev) => ({ ...prev, [qi]: oi }));
                              }
                            }}
                            disabled={quizSubmitted}
                            className={`p-2.5 rounded-lg text-left text-sm transition-all ${
                              isCorrect
                                ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                                : isWrong
                                ? "bg-rose-500/20 border border-rose-500/40 text-rose-300"
                                : isSelected
                                ? "bg-indigo-500/20 border border-indigo-500/40 text-indigo-300"
                                : "bg-slate-800/30 border border-slate-700/30 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                            }`}
                          >
                            {String.fromCharCode(65 + oi)}. {option}
                          </button>
                        );
                      })}
                    </div>
                    {quizSubmitted && (
                      <p className="text-xs text-slate-400 mt-2 p-2 bg-slate-800/30 rounded-lg">
                        💡 {q.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {!quizSubmitted ? (
                <button
                  onClick={() => setQuizSubmitted(true)}
                  disabled={Object.keys(quizAnswers).length < lesson.quiz.length}
                  className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
                >
                  Submit Quiz ({Object.keys(quizAnswers).length}/{lesson.quiz.length} answered)
                </button>
              ) : (
                <div className="mt-6 text-center p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                  <p className="text-lg font-bold text-white">
                    Score: {getQuizScore()}/{lesson.quiz.length}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    {getQuizScore() === lesson.quiz.length
                      ? "🎉 Perfect score! Amazing!"
                      : getQuizScore() >= 3
                      ? "👍 Good job! Review the explanations above."
                      : "📖 Keep studying! Review the lesson and try again."}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation & Complete */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-2">
            {dayNum > 1 && (
              <Link
                href={`/lessons/${dayNum - 1}`}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-400 hover:text-white transition-colors"
              >
                ← Day {dayNum - 1}
              </Link>
            )}
            {dayNum < 30 && completedDays.includes(dayNum) && (
              <Link
                href={`/lessons/${dayNum + 1}`}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-400 hover:text-white transition-colors"
              >
                Day {dayNum + 1} →
              </Link>
            )}
          </div>

          {!isCompleted && (
            <button
              onClick={handleComplete}
              disabled={completing}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {completing ? "Completing..." : "✅ Mark Day as Completed"}
            </button>
          )}

          {isCompleted && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
              ✅ Day {dayNum} Completed!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
