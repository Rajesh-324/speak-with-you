"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  const { user, signIn, loading } = useAuth();
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await signIn();
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const faqs = [
    {
      q: "How does the AI Conversational Interview Agent work?",
      a: "Unlike traditional mock interviews with fixed questions, our agent evaluates your responses dynamically. Using Gemini 2.5 Flash, it asks natural follow-up questions, probes deep when it detects weak answers, corrects your grammar, and scores your fluency in real-time."
    },
    {
      q: "What is the AI Placement Test?",
      a: "Upon your first login, you will take a quick 5-question speaking/writing test. Our AI analyzes your proficiency and instantly places you in the Beginner, Intermediate, or Advanced track, unlocking the corresponding lessons."
    },
    {
      q: "Can I use Voice Mode to practice speaking?",
      a: "Yes! SpeakWithYou has full Voice Mode support. The AI will speak questions aloud using Text-to-Speech (TTS), and you can speak back using your microphone (Speech-to-Text). It simulates a real-life face-to-face conversation."
    },
    {
      q: "How do I earn the Certificates?",
      a: "As you progress through the 90-day program, you unlock milestone certificates: Beginner Certificate at Day 30, Intermediate Certificate at Day 60, Advanced Certificate at Day 90, and the Master Certificate upon completing the entire program."
    },
    {
      q: "Is SpeakWithYou really free?",
      a: "Yes! SpeakWithYou is completely free. We want to make high-quality English education and AI interview coaching accessible to everyone."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden">
      {/* BACKGROUND GRAPHICS */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 -z-10" />
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* MODERN NAVBAR */}
      <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
              S
            </div>
            <div className="flex flex-col">
              <span className="text-md font-black tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                SpeakWithYou
              </span>
              <span className="text-[9px] text-indigo-400/60 -mt-1 font-bold">
                స్పీక్ విత్ యూ
              </span>
            </div>
          </Link>

          {/* Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection("features")} className="text-xs font-semibold text-slate-400 hover:text-white transition-colors uppercase tracking-wider">Features</button>
            <button onClick={() => scrollToSection("program")} className="text-xs font-semibold text-slate-400 hover:text-white transition-colors uppercase tracking-wider">90-Day Program</button>
            <button onClick={() => scrollToSection("agent")} className="text-xs font-semibold text-slate-400 hover:text-white transition-colors uppercase tracking-wider">AI Agent</button>
            <button onClick={() => scrollToSection("certificates")} className="text-xs font-semibold text-slate-400 hover:text-white transition-colors uppercase tracking-wider">Certificates</button>
            <button onClick={() => scrollToSection("faq")} className="text-xs font-semibold text-slate-400 hover:text-white transition-colors uppercase tracking-wider">FAQ</button>
          </nav>

          {/* Action Button */}
          <div className="hidden md:block">
            {loading ? (
              <div className="w-28 h-9 bg-slate-800 animate-pulse rounded-xl" />
            ) : user ? (
              <Link href="/dashboard" className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold transition-all shadow-md">
                Go to Dashboard →
              </Link>
            ) : (
              <button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isLoggingIn ? "Logging in..." : "Login with Google"}
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 bg-slate-950 px-4 py-4 space-y-3 mt-4">
            <button onClick={() => scrollToSection("features")} className="block w-full text-left py-2 text-sm font-semibold text-slate-400 hover:text-white uppercase tracking-wider">Features</button>
            <button onClick={() => scrollToSection("program")} className="block w-full text-left py-2 text-sm font-semibold text-slate-400 hover:text-white uppercase tracking-wider">90-Day Program</button>
            <button onClick={() => scrollToSection("agent")} className="block w-full text-left py-2 text-sm font-semibold text-slate-400 hover:text-white uppercase tracking-wider">AI Agent</button>
            <button onClick={() => scrollToSection("certificates")} className="block w-full text-left py-2 text-sm font-semibold text-slate-400 hover:text-white uppercase tracking-wider">Certificates</button>
            <button onClick={() => scrollToSection("faq")} className="block w-full text-left py-2 text-sm font-semibold text-slate-400 hover:text-white uppercase tracking-wider">FAQ</button>
            
            <div className="pt-4 border-t border-white/5">
              {user ? (
                <Link href="/dashboard" className="block w-full py-3 text-center bg-indigo-600 rounded-xl font-bold text-xs">
                  Go to Dashboard →
                </Link>
              ) : (
                <button
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="w-full py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
                >
                  {isLoggingIn ? "Logging in..." : "Login with Google"}
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-24 px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Empowered by Gemini 2.5 Flash
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none">
            Master English with Your
            <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Personal AI Speaking Coach
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Beginner to Advanced 90-day learning path, AI placement test, daily speaking tasks, mock interviews, and certificates.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-sm mx-auto">
            {user ? (
              <Link
                href="/dashboard"
                className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all text-sm"
              >
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <button
                  onClick={handleLogin}
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all text-sm"
                >
                  Start Free 🚀
                </button>
                <button
                  onClick={handleLogin}
                  className="w-full py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-2xl hover:border-white/20 transition-all text-sm"
                >
                  Try AI Interview 🎤
                </button>
              </>
            )}
          </div>
        </div>

        {/* Hero Visual Mockup */}
        <div className="mt-16 max-w-5xl mx-auto px-4">
          <div className="relative rounded-2xl overflow-hidden border border-white/5 bg-slate-900/40 p-3 sm:p-5 shadow-2xl backdrop-blur-md">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
            <div className="rounded-xl overflow-hidden aspect-[16/9] bg-slate-950/80 flex flex-col p-4 sm:p-6 text-left border border-white/5 relative">
              
              {/* Fake AI Agent Dialog Mockup */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[10px] text-slate-500 font-mono">AI_CONVERSATION_AGENT_ACTIVE</span>
                <span className="px-2 py-0.5 rounded bg-indigo-500/25 text-indigo-300 text-[9px] font-bold">HR MODE</span>
              </div>

              <div className="space-y-4 flex-1 overflow-hidden text-xs sm:text-sm">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-[9px] shrink-0 text-indigo-400">AI</div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-white/5 max-w-[80%] text-slate-300 leading-relaxed">
                    Hello! Why do you want to work at our company, and how do you handle workload pressure?
                  </div>
                </div>

                <div className="flex gap-3 flex-row-reverse">
                  <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center font-bold text-[9px] shrink-0">U</div>
                  <div className="bg-indigo-600 text-white p-3 rounded-xl max-w-[80%] leading-relaxed">
                    I want to join because I is very hard working. I handle pressure by staying calm and priority my tasks.
                  </div>
                </div>

                <div className="bg-slate-900/95 border border-indigo-500/20 rounded-xl p-3 max-w-[80%] ml-9 space-y-2 text-[11px]">
                  <div className="flex justify-between border-b border-white/5 pb-1 text-[9px] font-bold uppercase tracking-wider text-indigo-400">
                    <span>📊 Evaluation Feedback</span>
                    <span className="text-amber-400">Grammar Score: 6/10</span>
                  </div>
                  <p className="text-slate-400 italic">"I is very hard working" should be corrected to "I am very hardworking."</p>
                  <p className="text-slate-300 font-semibold">✨ Better phrasing: "I would love to join your company because I am a dedicated worker. Under pressure, I stay organized and prioritize tasks systematically."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE FEATURES SECTION */}
      <section id="features" className="py-24 border-t border-white/5 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">Core Features</h2>
            <p className="text-3xl sm:text-4xl font-extrabold">Everything You Need for Fluency</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6 border border-white/5 hover:border-indigo-500/25 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">🗣️</div>
              <h3 className="text-lg font-bold mb-2">Speech Exercises</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Practice daily speaking tasks using Speech-to-Text inputs. Record answers, review phonetic models, and build confidence.
              </p>
            </div>
            <div className="glass-card p-6 border border-white/5 hover:border-purple-500/25 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">🎯</div>
              <h3 className="text-lg font-bold mb-2">XP & Strengths</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Track your XP gains, keep up your daily streak to earn badges, and get granular statistics on your vocabulary expansion.
              </p>
            </div>
            <div className="glass-card p-6 border border-white/5 hover:border-pink-500/25 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">📜</div>
              <h3 className="text-lg font-bold mb-2">Printable Credentials</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Receive certified achievements instantly as you finish level tracks, ready to display on resumes or social portfolios.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 90-DAY PROGRAM SECTION */}
      <section id="program" className="py-24 border-t border-white/5 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">Structured Curriculum</h2>
            <p className="text-3xl sm:text-4xl font-extrabold">The 90-Day Mastery Path</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Level 1 */}
            <div className="glass-card p-8 border border-white/5 hover:border-indigo-500/10 transition-all flex flex-col justify-between">
              <div>
                <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">Level 1</span>
                <h3 className="text-xl font-bold mt-4 mb-2">Beginner</h3>
                <p className="text-xs text-indigo-400/60 mb-4 font-bold">Days 1–30 • Vocabulary & Grammar Basics</p>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  Perfect for absolute beginners. Structured daily topics covering alphabet sounds, basic sentence structures, present tenses, and Telugu hints for vocabulary.
                </p>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300 border-t border-white/5 pt-4">
                <li>✔ Basic greeting expressions</li>
                <li>✔ Daily routine verbs</li>
                <li>✔ Simple present/past tense</li>
                <li>✔ Beginner Certificate</li>
              </ul>
            </div>

            {/* Level 2 */}
            <div className="glass-card p-8 border border-white/5 hover:border-purple-500/10 transition-all flex flex-col justify-between">
              <div>
                <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-wider">Level 2</span>
                <h3 className="text-xl font-bold mt-4 mb-2">Intermediate</h3>
                <p className="text-xs text-purple-400/60 mb-4 font-bold">Days 31–60 • Work & Writing Practice</p>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  Focuses on active workplace communication. Learn vocabulary for business, email writing frameworks, handling phone conversations, and basic grammar improvement.
                </p>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300 border-t border-white/5 pt-4">
                <li>✔ Workplace greetings & etiquette</li>
                <li>✔ Writing professional emails</li>
                <li>✔ Complex sentence structures</li>
                <li>✔ Intermediate Certificate</li>
              </ul>
            </div>

            {/* Level 3 */}
            <div className="glass-card p-8 border border-white/5 hover:border-pink-500/10 transition-all flex flex-col justify-between">
              <div>
                <span className="px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-[10px] font-bold uppercase tracking-wider">Level 3</span>
                <h3 className="text-xl font-bold mt-4 mb-2">Advanced</h3>
                <p className="text-xs text-pink-400/60 mb-4 font-bold">Days 61–90 • Job Prep & Public Speaking</p>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  Prepares you for executive roles. Focuses on public speaking, presentations, advanced business vocabulary, and HR/Software Developer job interview strategies.
                </p>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300 border-t border-white/5 pt-4">
                <li>✔ Designing business presentations</li>
                <li>✔ Advanced vocabulary definitions</li>
                <li>✔ HR & Technical Interview Prep</li>
                <li>✔ Advanced Certificate</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. AI INTERVIEW AGENT SECTION */}
      <section id="agent" className="py-24 border-t border-white/5 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="space-y-6">
              <span className="px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-[10px] font-bold uppercase tracking-wider">Interactive Engine</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
                Upgrade to a Real Conversational AI Interview Agent
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Our Mock Interview system has been upgraded from a fixed checklist of questions to a smart, reactive conversation. It mimics a live HR manager, pushing you to refine your expression.
              </p>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/15 shrink-0 flex items-center justify-center text-lg">💬</div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-200">Dynamic Follow-Ups</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mt-0.5">Gemini creates follow-ups dynamically by analyzing the contents of your last answer. It detects weak points and probes deeper.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/15 shrink-0 flex items-center justify-center text-lg">📊</div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-200">Real-Time Metric Scoring</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mt-0.5">Every response is graded out of 10 for Grammar accuracy, Fluency pacing, Vocabulary choices, Confidence clarity, and Pronunciation.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/15 shrink-0 flex items-center justify-center text-lg">📝</div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-200">Detailed final report card</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mt-0.5">Get a comprehensive post-interview report containing your overall CEFR level, list of strengths, weaknesses, and direct links to suggested curriculum days.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Waveform visual */}
            <div className="glass-card p-8 border border-white/5 bg-slate-900/30 text-center space-y-6 relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="text-5xl">🎙️</div>
              <h3 className="font-bold text-lg">Interactive Voice Mode</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Experience simulated spoken conversations. Enabled with automatic turn-taking so that the microphone activates right when the AI finishes speaking.
              </p>

              {/* Equilizer Waves */}
              <div className="flex items-center justify-center gap-1.5 h-12">
                <div className="w-1.5 h-4 bg-indigo-500 rounded-full animate-bounce [animation-duration:0.6s]" />
                <div className="w-1.5 h-8 bg-indigo-400 rounded-full animate-bounce [animation-duration:0.4s] delay-75" />
                <div className="w-1.5 h-10 bg-purple-500 rounded-full animate-bounce [animation-duration:0.5s] delay-150" />
                <div className="w-1.5 h-6 bg-pink-500 rounded-full animate-bounce [animation-duration:0.7s] delay-75" />
                <div className="w-1.5 h-3 bg-purple-400 rounded-full animate-bounce [animation-duration:0.3s]" />
              </div>

              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest block">Web Speech API Integration</span>
            </div>

          </div>
        </div>
      </section>

      {/* 5. AI PLACEMENT TEST SECTION */}
      <section className="py-24 border-t border-white/5 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Graphics card */}
            <div className="glass-card p-6 border border-white/5 bg-slate-900/40 relative overflow-hidden order-last lg:order-first">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-xs font-bold text-indigo-400 uppercase">AI Placement Grading</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">Graded</span>
                </div>
                
                <div className="space-y-2">
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-white/5">
                    <span className="text-[10px] text-slate-500 block">Estimated CEFR Proficiency</span>
                    <span className="text-2xl font-black text-white">B2 (Upper Intermediate)</span>
                  </div>
                  <div className="p-3 bg-slate-950/80 rounded-xl border border-white/5">
                    <span className="text-[10px] text-slate-500 block">Assigned Learning Track</span>
                    <span className="text-sm font-bold text-indigo-300">Level 2: Intermediate Track</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 leading-relaxed italic bg-indigo-500/5 p-3 rounded-lg border border-indigo-500/10">
                  "Candidate shows intermediate vocabulary and structured present sentences. Proceed to intermediate track to study workplace emails."
                </div>
              </div>
            </div>

            {/* Right content */}
            <div className="space-y-6">
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">Smart Enrollment</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
                AI-Driven Placement Assessment
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Take our 5-question entry test upon your first login. The AI evaluates grammatical accuracy, syntactic complexity, and coherence to map you instantly into your optimal 30-day level segment.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="text-indigo-400">✓</span>
                  No fixed questionnaires. Evaluates speaking & writing answers.
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-400">✓</span>
                  Automatically unlocks matching track (Beginner, Intermediate, or Advanced).
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-indigo-400">✓</span>
                  Option to manually adjust your level later in Profile settings.
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* 6. CERTIFICATES SHOWCASE SECTION */}
      <section id="certificates" className="py-24 border-t border-white/5 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">Earn Achievements</h2>
            <p className="text-3xl sm:text-4xl font-extrabold">Milestone Certification Documents</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: "Beginner Certificate", desc: "Day 30 Milestone", border: "border-indigo-500/20", color: "from-indigo-500 to-purple-600" },
              { title: "Intermediate Certificate", desc: "Day 60 Milestone", border: "border-purple-500/20", color: "from-purple-500 to-pink-500" },
              { title: "Advanced Certificate", desc: "Day 90 Milestone", border: "border-pink-500/20", color: "from-pink-500 to-rose-500" },
              { title: "90-Day Master Certificate", desc: "Full Mastery Complete", border: "border-emerald-500/20", color: "from-emerald-500 to-green-500" },
            ].map((cert, idx) => (
              <div key={idx} className={`glass-card p-6 border ${cert.border} hover:scale-105 transition-all text-center flex flex-col justify-between`}>
                <div className="w-full aspect-[4/3] rounded-lg bg-slate-950 border border-white/5 flex items-center justify-center p-3 relative overflow-hidden mb-4">
                  <div className={`absolute -inset-10 bg-gradient-to-br ${cert.color} opacity-[0.05] rounded-full blur-2xl`} />
                  <div className="text-slate-500 text-center space-y-1">
                    <span className="text-3xl block">📜</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider block text-indigo-400">SpeakWithYou</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{cert.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-1">{cert.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS SECTION */}
      <section className="py-24 border-t border-white/5 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">User Stories</h2>
            <p className="text-3xl sm:text-4xl font-extrabold">Success Demo Stories</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-6 border border-white/5 relative bg-slate-900/35">
              <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[9px] font-bold uppercase">Demo Story</span>
              <p className="text-sm text-slate-300 leading-relaxed italic mb-6">
                "As a software engineering fresher, I struggled with mock interview rounds. SpeakWithYou's dynamic interview agent pointed out my grammatical errors on verbs and suggested better phrasing. The voice mode made it feel like a real hiring process, and I cleared my job rounds with ease!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs">R</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Rajesh G.</h4>
                  <p className="text-[10px] text-slate-500">Junior Software Engineer</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 border border-white/5 relative bg-slate-900/35">
              <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[9px] font-bold uppercase">Demo Story</span>
              <p className="text-sm text-slate-300 leading-relaxed italic mb-6">
                "The 90-day mastery curriculum completely took me from zero basics to business level. I loved the placement test which let me skip things I already knew. Unlocking certificates made the process feel like a fun game!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center font-bold text-xs">P</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Pranitha K.</h4>
                  <p className="text-[10px] text-slate-500">Customer Success Associate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ SECTION */}
      <section id="faq" className="py-24 border-t border-white/5 bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">Questions & Answers</h2>
            <p className="text-3xl sm:text-4xl font-extrabold">Frequently Asked Questions</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="glass-card border border-white/5 overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between font-bold text-sm sm:text-base hover:bg-white/[0.02] transition-all"
                >
                  <span>{faq.q}</span>
                  <span className="text-indigo-400 font-bold shrink-0 ml-4">{activeFaq === index ? "−" : "+"}</span>
                </button>
                {activeFaq === index && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-white/5 bg-slate-900/20">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FOOTER SECTION */}
      <footer className="relative border-t border-white/5 bg-slate-950 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            
            {/* Col 1: Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                  S
                </div>
                <span className="text-sm font-semibold text-white">SpeakWithYou</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Elevate your English conversational fluency and job interview confidence with customized AI-driven loops.
              </p>
            </div>

            {/* Col 2: Program */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Program</h4>
              <ul className="space-y-2 text-xs text-slate-500">
                <li><button onClick={() => scrollToSection("program")} className="hover:text-indigo-400 transition-colors">Beginner Lessons</button></li>
                <li><button onClick={() => scrollToSection("program")} className="hover:text-indigo-400 transition-colors">Intermediate Track</button></li>
                <li><button onClick={() => scrollToSection("program")} className="hover:text-indigo-400 transition-colors">Advanced Prep</button></li>
                <li><button onClick={() => scrollToSection("certificates")} className="hover:text-indigo-400 transition-colors">Certificates Details</button></li>
              </ul>
            </div>

            {/* Col 3: Company */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Resources</h4>
              <ul className="space-y-2 text-xs text-slate-500">
                <li><Link href="/privacy" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
                <li><a href="mailto:gunagantirajesh7@gmail.com" className="hover:text-indigo-400 transition-colors">Contact Support</a></li>
              </ul>
            </div>

            {/* Col 4: Contact */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Contact</h4>
              <p className="text-xs text-slate-500">Have questions or feedback? Send us an email.</p>
              <a
                href="mailto:gunagantirajesh7@gmail.com"
                className="inline-block px-4 py-2 bg-slate-900 border border-white/5 hover:bg-slate-800 text-xs font-semibold rounded-xl text-slate-300 hover:text-white transition-all"
              >
                gunagantirajesh7@gmail.com
              </a>
            </div>

          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
            <span>© {new Date().getFullYear()} SpeakWithYou. All rights reserved.</span>
            <span>Created for English Mastery & Interview Excellence</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
