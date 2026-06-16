"use client";

import AuthGuard from "@/components/ui/AuthGuard";
import { interviewQuestions } from "@/data/interviewQuestions";
import Link from "next/link";

export default function InterviewPage() {
  return (
    <AuthGuard>
      <InterviewContent />
    </AuthGuard>
  );
}

function InterviewContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 page-enter">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            🎤 AI Mock Interview
          </h1>
          <p className="text-slate-400 text-sm">
            Choose an interview type below. The AI will ask you 5 questions and give you feedback on each answer.
          </p>
          <p className="text-xs text-indigo-400/50 mt-1">
            AI మాక్ ఇంటర్వ్యూ — మీ ఇంటర్వ్యూ రకం ఎంచుకోండి
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {interviewQuestions.map((type) => (
            <Link
              key={type.type}
              href={`/interview/${type.type}`}
              className="glass-card p-6 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="text-4xl mb-3">{type.icon}</div>
              <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                {type.label}
              </h3>
              <p className="text-sm text-slate-400 mt-2">{type.description}</p>
              <div className="mt-4 flex items-center gap-1 text-xs text-indigo-400">
                <span>5 questions</span>
                <span>•</span>
                <span>AI feedback</span>
                <span>•</span>
                <span>Scored</span>
              </div>
              <div className="mt-3 text-xs text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Start Interview →
              </div>
            </Link>
          ))}
        </div>

        {/* Tips */}
        <div className="mt-8 glass-card p-5">
          <h3 className="text-sm font-bold text-white mb-3">💡 Interview Tips</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">✓</span>
              Answer in complete sentences, not just one or two words.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">✓</span>
              Start sentences with capital letters and end with full stops.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">✓</span>
              Use the vocabulary and grammar you learned in the 30-day challenge.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">✓</span>
              Don&apos;t worry about mistakes — this is for practice! The AI will help you improve.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
