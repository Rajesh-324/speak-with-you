// ============================================================
// Interview Questions Bank — 4 Interview Types
// ============================================================

import type { InterviewQuestionBank } from "@/types";

export const interviewQuestions: InterviewQuestionBank[] = [
  {
    type: "self-intro",
    label: "Self Introduction",
    description: "Practice introducing yourself confidently in English.",
    icon: "🙋",
    questions: [
      "Tell me about yourself.",
      "What is your name and where are you from?",
      "What are your hobbies and interests?",
      "What do you do in your daily life?",
      "What are your goals and dreams for the future?",
    ],
  },
  {
    type: "hr",
    label: "HR Interview",
    description: "Prepare for HR rounds, behavioral questions, and career goals.",
    icon: "🤝",
    questions: [
      "Why should we hire you for this role?",
      "What are your biggest strengths and weaknesses?",
      "How do you handle pressure or difficult situations at work or school?",
      "Why do you want to work at our company?",
      "What are your salary expectations and career goals?",
    ],
  },
  {
    type: "fresher",
    label: "Fresher Interview",
    description: "Practice entry-level questions about projects, studies, and teamwork.",
    icon: "🎓",
    questions: [
      "Tell me about your college project or final year project.",
      "Why did you choose your field of study or degree?",
      "Do you prefer working in a team or working alone, and why?",
      "Tell me about a challenge you faced in college and how you solved it.",
      "Why do you want to start your career with our company?",
    ],
  },
  {
    type: "daily",
    label: "Daily Conversation Practice",
    description: "Practice everyday English conversations with confidence.",
    icon: "💬",
    questions: [
      "How are you doing today? Tell me about your day.",
      "What did you do last weekend? How did you spend your time?",
      "Can you describe your hometown or where you live to me?",
      "What is your favorite food and how do you make it?",
      "If you could travel anywhere in the world, where would you go and why?",
    ],
  },
];
