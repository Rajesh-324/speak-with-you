export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-slate-950 py-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
            S
          </div>
          <span className="text-sm font-semibold text-white">SpeakWithYou</span>
          <span className="text-xs text-slate-600">|</span>
          <span className="text-xs text-indigo-400/40">స్పీక్ విత్ యూ</span>
        </div>
        <p className="text-xs text-slate-600">
          © {new Date().getFullYear()} SpeakWithYou. Learn English with confidence.
        </p>
      </div>
    </footer>
  );
}
