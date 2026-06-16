// ============================================================
// Interview Questions Bank — 5 Conversational Interview Modes
// ============================================================

import type { InterviewQuestionBank } from "@/types";

export const interviewQuestions: InterviewQuestionBank[] = [
  {
    type: "hr",
    label: "HR Interview",
    description: "Practice behavioral questions, career goals, and workplace scenarios.",
    icon: "🤝",
    questions: [
      "Welcome to your HR Interview. To start, could you please introduce yourself and tell me why you are interested in this position?",
    ],
  },
  {
    type: "tech",
    label: "Software Developer Interview",
    description: "Prepare for coding project questions, tech stacks, and engineering challenges.",
    icon: "💻",
    questions: [
      "Hello! Welcome to the Software Developer Technical interview. Please tell me about your background in programming and what technologies you are most comfortable with.",
    ],
  },
  {
    type: "support",
    label: "Customer Support Interview",
    description: "Simulate handling customer complaints, product support, and service empathy.",
    icon: "📞",
    questions: [
      "Welcome to the Customer Support Simulation. Can you describe your past experience in customer service and how you handle difficult customer queries?",
    ],
  },
  {
    type: "english",
    label: "English Speaking Practice",
    description: "A friendly English coach session focusing on fluency, vocabulary, and active talking.",
    icon: "🗣️",
    questions: [
      "Hi there! I am your English coach. I'd love to help you practice. How are you doing today? Tell me a little bit about what you did recently.",
    ],
  },
  {
    type: "daily",
    label: "Daily Conversation",
    description: "Practice casual chat about hobbies, hometowns, food, and daily routines.",
    icon: "💬",
    questions: [
      "Hello! Let's have a casual conversation. What is your favorite hobby, and how do you spend your weekends?",
    ],
  },
];
