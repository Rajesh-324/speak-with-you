import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white py-16 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <Link href="/" className="text-xs text-indigo-400 hover:text-indigo-300">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-extrabold mt-2">Terms of Service</h1>
          <p className="text-slate-500 text-xs mt-1">Last updated: June 16, 2026</p>
        </div>

        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">1. Agreement to Terms</h2>
            <p>
              By accessing and using SpeakWithYou, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use the platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">2. Use of Platform</h2>
            <p>
              SpeakWithYou provides educational content, speaking exercises, and AI interview simulations. You agree to use the service only for personal learning and practice. Any automated scraping, misuse of API endpoints, or disruptive behavior is strictly prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">3. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your Google Authentication log, and for all activities that occur under your user profile.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">4. Intellectual Property</h2>
            <p>
              All course curriculum content, layout, designs, and AI agent prompt configurations are the intellectual property of SpeakWithYou. You may not copy, republish, or redistribute our contents without explicit authorization.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">5. Termination</h2>
            <p>
              We reserve the right to suspend or terminate user profiles at our sole discretion, without notice, if we detect fraudulent activity or violations of these terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
