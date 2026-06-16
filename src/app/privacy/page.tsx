import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white py-16 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <Link href="/" className="text-xs text-indigo-400 hover:text-indigo-300">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-extrabold mt-2">Privacy Policy</h1>
          <p className="text-slate-500 text-xs mt-1">Last updated: June 16, 2026</p>
        </div>

        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">1. Information We Collect</h2>
            <p>
              When you register or log in using Google Authentication, we collect basic profile information: your name, email address, and photo URL.
            </p>
            <p>
              We also store your learning activity, lesson completion flags, quiz history, streaks, and interview transcript data in Firestore to personalize your training dashboard.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">2. How We Use Information</h2>
            <p>
              We use your data exclusively to track progress through the 90-day mastery tracks, formulate AI placement test mappings, provide real-time speech grammar scoring, and generate certificate documents.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">3. AI Evaluation Data</h2>
            <p>
              Your voice recordings (converted locally via the Web Speech API) and typed dialogue scripts are sent to Google Gemini API servers to create follow-up questions and performance feedback score cards. We do not store or sell your text transcriptions to third-party advertising companies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">4. Your Rights</h2>
            <p>
              You can request to delete your account data at any time by contacting our support team.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">5. Contact Us</h2>
            <p>
              If you have any questions, feel free to email Rajesh at{" "}
              <a href="mailto:gunagantirajesh7@gmail.com" className="text-indigo-400 hover:underline">
                gunagantirajesh7@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
