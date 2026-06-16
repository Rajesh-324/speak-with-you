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
}

// ----- Interview -----
export type InterviewType = "self-intro" | "hr" | "fresher" | "daily";

export interface InterviewQuestion {
  question: string;
  userAnswer: string;
  score: number;
  grammarScore: number;
  fluencyScore: number;
  vocabularyScore: number;
  confidenceScore: number;
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
  overallFeedback: string;
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
