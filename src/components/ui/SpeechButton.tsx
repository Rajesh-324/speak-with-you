"use client";

import { useState, useCallback, useEffect } from "react";

interface SpeechButtonProps {
  onResult: (text: string) => void;
  disabled?: boolean;
}

export default function SpeechButton({ onResult, disabled }: SpeechButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const supported =
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
    const timer = setTimeout(() => {
      setIsSupported(supported);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) return;

    const SpeechRecognition =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).SpeechRecognition ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [isSupported, onResult]);

  if (!isSupported) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={startListening}
      disabled={disabled || isListening}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
        isListening
          ? "bg-rose-500/20 text-rose-400 border border-rose-500/50 animate-pulse"
          : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/20 hover:border-indigo-500/50"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      title="Click to speak your answer"
    >
      {isListening ? (
        <>
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
          </span>
          Listening...
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          Speak
        </>
      )}
    </button>
  );
}
