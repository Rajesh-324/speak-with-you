// ============================================================
// SpeakWithYou — TypeScript Type Definitions
// ============================================================

import { Timestamp } from "firebase/firestore";

// ----- User -----
export interface UserProfile {
  uid: string;
  displayName: string;
  name: string;
  email: string;
  photoURL: string;
  createdAt: Timestamp | Date;
  lastLoginAt: Timestamp | Date;
}

// ----- Lesson Content -----
export interface VocabularyItem {
  word: string;
  meaning: string;
  pronunciation: string;
  example: string;
}

export interface GrammarLesson {
  title: string;
  explanation: string;
  structure: string;
  examples: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LessonDay {
  day: number;
  topic: string;
  description: string;
  teluguHint: string;
  vocabulary: VocabularyItem[];
  grammar: GrammarLesson;
  practiceSentences: {
    english: string;
    telugu: string;
  }[];
  speakingTask: {
    instruction: string;
    exampleAnswer: string;
  };
  writingTask: {
    instruction: string;
    hint: string;
  };
  quiz: QuizQuestion[];
}

// ----- Progress -----
export interface UserProgress {
  uid: string;
  completedDays: number[];
  lastCompletedDay: number;
  streak: number;
  updatedAt: Timestamp | Date;
  level?: "beginner" | "intermediate" | "advanced";
  cefrLevel?: string;
  placementTestCompleted?: boolean;
  placementScore?: number;
  placementCompletedAt?: Timestamp | Date;
  xp?: number;
  badges?: string[];
  certificates?: string[];
  referralCode?: string;
  referredBy?: string;
  totalSpeakingMinutes?: number;
  wordsLearned?: number;
  studyPlan?: {
    plan: string;
    weaknesses: string[];
    generatedAt: string;
  };
}

// ----- Interview -----
export type InterviewType = "hr" | "tech" | "support" | "english" | "daily";

export interface InterviewQuestion {
  question: string;
  userAnswer: string;
  score: number;
  grammarScore: number;
  fluencyScore: number;
  vocabularyScore: number;
  confidenceScore: number;
  pronunciationScore?: number;
  grammarCorrection: string;
  betterAnswer: string;
  feedback: string;
}

export interface InterviewSession {
  id: string;
  uid: string;
  type: InterviewType;
  questions: InterviewQuestion[];
  overallScore: number;
  overallFeedback: string; // Dynamic Summary
  strengths?: string[];
  weaknesses?: string[];
  recommendedLessons?: string[];
  cefrLevel?: string;
  createdAt: Timestamp | Date;
}

// ----- AI Evaluation -----
export interface EvaluationRequest {
  question: string;
  answer: string;
  interviewType: InterviewType;
}

export interface EvaluationResult {
  score: number;
  grammarScore: number;
  fluencyScore: number;
  vocabularyScore: number;
  confidenceScore: number;
  grammarCorrection: string;
  betterAnswer: string;
  feedback: string;
}

// ----- Interview Questions Bank -----
export interface InterviewQuestionBank {
  type: InterviewType;
  label: string;
  description: string;
  icon: string;
  questions: string[];
}
