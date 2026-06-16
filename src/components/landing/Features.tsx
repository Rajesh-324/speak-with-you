"use client";

export default function Features() {
  const features = [
    {
      icon: "📅",
      title: "30-Day Challenge",
      titleTelugu: "30 రోజుల ఛాలెంజ్",
      description:
        "Structured daily lessons from alphabet to interview prep. Vocabulary, grammar, practice sentences, and quizzes every day.",
      gradient: "from-blue-500 to-cyan-400",
    },
    {
      icon: "🎤",
      title: "Speaking Practice",
      titleTelugu: "మాట్లాడే అభ్యాసం",
      description:
        "Practice pronunciation with speech-to-text. Read aloud, record yourself, and build speaking confidence day by day.",
      gradient: "from-purple-500 to-pink-400",
    },
    {
      icon: "🤖",
      title: "AI Mock Interviews",
      titleTelugu: "AI మాక్ ఇంటర్వ్యూలు",
      description:
        "Take mock interviews for self-intro, school, job, or daily conversation. Get AI scoring, grammar correction, and tips.",
      gradient: "from-amber-500 to-orange-400",
    },
    {
      icon: "📊",
      title: "Progress & Ratings",
      titleTelugu: "ప్రగతి & రేటింగ్‌లు",
      description:
        "Track your 30-day progress with visual charts. See interview scores, improvement over time, and earn completion badges.",
      gradient: "from-emerald-500 to-green-400",
    },
  ];

  return (
    <section id="features" className="relative py-24 px-4 sm:px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Learn English
            </span>
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            A complete learning system designed for absolute beginners. No prior English knowledge needed.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className="text-4xl mb-4">{feature.icon}</div>

              {/* Title */}
              <h3 className="text-lg font-bold text-white mb-1">
                {feature.title}
              </h3>
              <p className="text-xs text-indigo-400/50 mb-3">
                {feature.titleTelugu}
              </p>

              {/* Description */}
              <p className="text-sm text-slate-400 leading-relaxed">
                {feature.description}
              </p>

              {/* Gradient accent line */}
              <div
                className={`absolute bottom-0 left-6 right-6 h-0.5 rounded-full bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
