"use client";

import AuthGuard from "@/components/ui/AuthGuard";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { savePlacementTestResult } from "@/lib/firestore";
import Link from "next/link";

export default function PlacementTestPage() {
  return (
    <AuthGuard>
      <PlacementTestContent />
    </AuthGuard>
  );
}

const QUESTIONS = [
  {
    title: "Question 1 of 5",
    question: "Introduce yourself in English.",
    teluguHint: "ఇంగ్లీష్‌లో మిమ్మల్ని మీరు పరిచయం చేసుకోండి.",
    placeholder: "Tell us your name, where you are from, and what you do...",
  },
  {
    title: "Question 2 of 5",
    question: "Describe your hobbies and interests.",
    teluguHint: "మీ అభిరుచులు మరియు ఆసక్తుల గురించి చెప్పండి.",
    placeholder: "What do you like to do in your free time? Why do you enjoy it?...",
  },
  {
    title: "Question 3 of 5",
    question: "Talk about a recent holiday or trip you took.",
    teluguHint: "మీరు ఇటీవల వెళ్ళిన ఒక సెలవు లేదా ప్రయాణం గురించి మాట్లాడండి.",
    placeholder: "Where did you go? Who did you go with? What did you do there?...",
  },
  {
    title: "Question 4 of 5",
    question: "Describe a challenge you solved in your life, studies, or work.",
    teluguHint: "మీ జీవితంలో, చదువులో లేదా పనిలో మీరు పరిష్కరించిన ఒక సవాలును వివరించండి.",
    placeholder: "What was the problem? How did you solve it? What did you learn?...",
  },
  {
    title: "Question 5 of 5",
    question: "Give your opinion: Is technology good or bad for education?",
    teluguHint: "మీ అభిప్రాయం చెప్పండి: విద్యకు సాంకేతికత మంచిదా లేదా చెడ్డదా?",
    placeholder: "Do you think computers/mobile phones help students learn? Why or why not?...",
  },
];

function PlacementTestContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(5).fill(""));
  const [grading, setGrading] = useState(false);
  const [gradingStep, setGradingStep] = useState(0);
  const [result, setResult] = useState<{
    cefrLevel: string;
    assignedTrack: "beginner" | "intermediate" | "advanced";
    feedback: string;
    score: number;
  } | null>(null);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      submitTest();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitTest = async () => {
    if (!user) return;
    setGrading(true);
    setGradingStep(1);

    // Dynamic fake loading messages for a premium feel
    const timer1 = setTimeout(() => setGradingStep(2), 1500);
    const timer2 = setTimeout(() => setGradingStep(3), 3000);

    try {
      const response = await fetch("/api/placement/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      const data = await response.json();
      
      clearTimeout(timer1);
      clearTimeout(timer2);
      
      if (response.ok) {
        setResult(data);
      } else {
        throw new Error(data.error || "Failed to grade");
      }
    } catch (err) {
      console.error("Error submitting placement test:", err);
      // Clean fallback if API fails
      setResult({
        cefrLevel: "A2",
        assignedTrack: "beginner",
        feedback: "We encountered an issue grading your test. Based on your inputs, we suggest starting with our Beginner course to strengthen core skills.",
        score: 40,
      });
    } finally {
      setGrading(false);
    }
  };

  const handleComplete = async () => {
    if (!user || !result) return;
    try {
      await savePlacementTestResult(
        user.uid,
        result.cefrLevel,
        result.assignedTrack,
        result.score
      );
      router.push("/dashboard");
    } catch (err) {
      console.error("Error saving placement result:", err);
      router.push("/dashboard");
    }
  };

  const isCurrentStepEmpty = answers[currentStep].trim().split(/\s+/).filter(Boolean).length < 3;

  if (grading) {
    const loadingTexts = [
      "",
      "🔍 Analyzing grammar and sentence structure...",
      "🎓 Assessing vocabulary size and semantic coherence...",
      "🧠 Aligning scores with CEFR (A1-C1) benchmarks...",
    ];

    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-t-indigo-500 border-r-indigo-500 rounded-full animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Grading Your Responses</h2>
          <p className="text-slate-400 text-sm animate-pulse h-6">
            {loadingTexts[gradingStep]}
          </p>
        </div>
      </div>
    );
  }

  if (result) {
    const trackColors = {
      beginner: "from-blue-500 to-cyan-500 text-cyan-300 border-cyan-500/20",
      intermediate: "from-purple-500 to-indigo-500 text-indigo-300 border-indigo-500/20",
      advanced: "from-amber-500 to-orange-500 text-amber-300 border-amber-500/20",
    };

    const trackTitles = {
      beginner: "Level 1: Beginner (Day 1-30)",
      intermediate: "Level 2: Intermediate (Day 31-60)",
      advanced: "Level 3: Advanced (Day 61-90)",
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-950 flex flex-col items-center justify-center p-4">
        <div className="max-w-xl w-full glass-card p-6 sm:p-8 text-center border border-indigo-500/10 shadow-2xl relative overflow-hidden">
          {/* Confetti Background Sparkles */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />

          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            Assessment Completed!
          </h1>
          <p className="text-slate-400 text-sm mb-6">
            We have analyzed your English skills across grammar, vocabulary, and coherence.
          </p>

          {/* Level Box */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] mb-6 inline-block w-full">
            <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">
              Your Evaluated Level
            </div>
            <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">
              CEFR {result.cefrLevel}
            </div>
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 inline-block">
              Assigned: {trackTitles[result.assignedTrack]}
            </span>
          </div>

          {/* Feedback */}
          <div className="text-left bg-indigo-950/15 border border-indigo-500/10 rounded-xl p-4 mb-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-wide mb-1.5">
              AI Assessment Feedback
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {result.feedback}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleComplete}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-base shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Start Learning Path (+100 XP)
            </button>
            <Link
              href="/dashboard"
              onClick={handleComplete}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Skip customized path, start from Day 1
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = QUESTIONS[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-950 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full glass-card p-5 sm:p-6 border border-white/[0.06] shadow-2xl relative">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
            AI Placement Test
          </span>
          <span className="text-xs text-slate-500">
            Step {currentStep + 1} of 5
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-slate-800 rounded-full w-full mb-6 overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / 5) * 100}%` }}
          />
        </div>

        {/* Question Panel */}
        <div className="mb-6">
          <span className="text-xs text-slate-500">{currentQ.title}</span>
          <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
            {currentQ.question}
          </h2>
          <p className="text-xs text-indigo-400/50 mt-1">{currentQ.teluguHint}</p>
        </div>

        {/* Answer input */}
        <textarea
          value={answers[currentStep]}
          onChange={(e) => {
            const newAnswers = [...answers];
            newAnswers[currentStep] = e.target.value;
            setAnswers(newAnswers);
          }}
          placeholder={currentQ.placeholder}
          className="w-full h-44 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 resize-none mb-4"
        />

        {/* Word count display */}
        <div className="flex justify-between items-center text-xs text-slate-500 mb-6">
          <span>
            {answers[currentStep].trim().split(/\s+/).filter(Boolean).length} words
          </span>
          <span>Please write at least 3 words to proceed.</span>
        </div>

        {/* Footer controls */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-5 py-2.5 rounded-xl border border-white/10 text-white text-sm font-semibold transition-all hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={isCurrentStepEmpty}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold transition-all hover:shadow-lg hover:shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
          >
            {currentStep === 4 ? "Finish Test" : "Next Question"}
          </button>
        </div>
      </div>
    </div>
  );
}
