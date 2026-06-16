// ============================================================
// AI Evaluation Logic (Gemini 2.5 Flash)
// ============================================================

import type { EvaluationResult, InterviewType } from "@/types";

/**
 * Main evaluation function — routes to real AI or placeholder.
 */
export async function evaluateAnswer(
  question: string,
  answer: string,
  interviewType: InterviewType
): Promise<EvaluationResult> {
  const apiKey = process.env.AI_API_KEY;
  const provider = process.env.AI_PROVIDER || "gemini";

  // If API key is configured, use real AI
  if (apiKey && apiKey !== "your_gemini_or_openai_key_here") {
    if (provider === "gemini") {
      return evaluateWithGemini(question, answer, interviewType, apiKey);
    }
  }

  // Fallback to smart placeholder
  return generatePlaceholderFeedback(question, answer, interviewType);
}

/**
 * Conduct chat conversations with AI.
 */
export async function chatWithGemini(
  messages: { role: "user" | "assistant"; content: string }[],
  interviewType: string
): Promise<string> {
  const apiKey = process.env.AI_API_KEY;
  if (apiKey && apiKey !== "your_gemini_or_openai_key_here") {
    try {
      const contents = messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      const systemInstruction = `You are a friendly AI English interviewer conducting a ${interviewType} practice session. Keep your responses short (1-3 sentences) and conversational. Ask one follow-up question related to what the user said to keep the conversation going.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents,
            systemInstruction: {
              parts: [{ text: systemInstruction }],
            },
          }),
        }
      );

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text.trim();
    } catch (error) {
      console.error("Gemini Chat error:", error);
    }
  }

  return generatePlaceholderChat(messages, interviewType);
}

// ============================================================
// GEMINI INTEGRATION
// ============================================================
async function evaluateWithGemini(
  question: string,
  answer: string,
  interviewType: InterviewType,
  apiKey: string
): Promise<EvaluationResult> {
  try {
    const prompt = buildPrompt(question, answer, interviewType);
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) {
      const parsed = JSON.parse(text);
      return {
        score: Math.min(10, Math.max(1, parsed.score || 5)),
        grammarScore: Math.min(10, Math.max(1, parsed.grammarScore || 5)),
        fluencyScore: Math.min(10, Math.max(1, parsed.fluencyScore || 5)),
        vocabularyScore: Math.min(10, Math.max(1, parsed.vocabularyScore || 5)),
        confidenceScore: Math.min(10, Math.max(1, parsed.confidenceScore || 5)),
        grammarCorrection: parsed.grammarCorrection || "No corrections needed.",
        betterAnswer: parsed.betterAnswer || answer,
        feedback: parsed.feedback || "Good attempt!",
      };
    }
    return generatePlaceholderFeedback(question, answer, interviewType);
  } catch (error) {
    console.error("Gemini API error:", error);
    return generatePlaceholderFeedback(question, answer, interviewType);
  }
}

// ============================================================
// SHARED PROMPT BUILDER
// ============================================================
function buildPrompt(
  question: string,
  answer: string,
  interviewType: InterviewType
): string {
  return `You are an expert English language examiner evaluating a beginner's answer in a ${interviewType} mock interview.

Question: "${question}"
Student's Answer: "${answer}"

Evaluate their response and output a JSON object with this exact structure:
{
  "score": <overall score 1-10>,
  "grammarScore": <grammar score 1-10>,
  "fluencyScore": <fluency score 1-10>,
  "vocabularyScore": <vocabulary score 1-10>,
  "confidenceScore": <confidence/completion score 1-10>,
  "grammarCorrection": "<corrected version of their answer, or 'No corrections needed' if perfect>",
  "betterAnswer": "<a model answer suited for a beginner to learn from>",
  "feedback": "<2-3 sentences of encouraging, specific feedback focusing on grammar, vocabulary, and fluency>"
}

Ensure the response is JSON only.`;
}

// ============================================================
// SMART PLACEHOLDER EVALUATION (works without any API key)
// ============================================================
function generatePlaceholderFeedback(
  question: string,
  answer: string,
  interviewType: InterviewType
): EvaluationResult {
  const wordCount = answer.trim().split(/\s+/).length;
  const sentenceCount = answer.split(/[.!?]+/).filter((s) => s.trim()).length;
  const hasCapital = /^[A-Z]/.test(answer.trim());
  const hasPunctuation = /[.!?]$/.test(answer.trim());
  const hasCommonErrors = detectCommonErrors(answer);

  let grammarScore = 8;
  if (hasCommonErrors.length > 0) grammarScore -= hasCommonErrors.length * 1.5;
  if (!hasCapital && answer.length > 0) grammarScore -= 1;
  grammarScore = Math.min(10, Math.max(1, Math.round(grammarScore)));

  let fluencyScore = 5;
  if (wordCount >= 10) fluencyScore += 2;
  if (wordCount >= 20) fluencyScore += 2;
  if (sentenceCount >= 2) fluencyScore += 1;
  fluencyScore = Math.min(10, Math.max(1, fluencyScore));

  let vocabularyScore = 5;
  if (wordCount >= 12) vocabularyScore += 2;
  if (wordCount >= 25) vocabularyScore += 2;
  vocabularyScore = Math.min(10, Math.max(1, vocabularyScore));

  let confidenceScore = 6;
  if (wordCount >= 15) confidenceScore += 2;
  if (hasPunctuation) confidenceScore += 2;
  confidenceScore = Math.min(10, Math.max(1, confidenceScore));

  const score = Math.round((grammarScore + fluencyScore + vocabularyScore + confidenceScore) / 4);

  let grammarCorrection = answer;
  if (!hasCapital && answer.trim().length > 0) {
    grammarCorrection =
      answer.trim().charAt(0).toUpperCase() + answer.trim().slice(1);
  }
  if (!hasPunctuation && answer.trim().length > 0) {
    grammarCorrection = grammarCorrection.trim() + ".";
  }
  for (const error of hasCommonErrors) {
    grammarCorrection = grammarCorrection.replace(error.wrong, error.right);
  }

  const feedback = generateContextualFeedback(
    wordCount,
    score,
    interviewType
  );

  const betterAnswer = generateBetterAnswer(question, interviewType);

  return {
    score,
    grammarScore,
    fluencyScore,
    vocabularyScore,
    confidenceScore,
    grammarCorrection:
      grammarCorrection === answer ? "No corrections needed." : grammarCorrection,
    betterAnswer,
    feedback,
  };
}

function detectCommonErrors(
  text: string
): { wrong: string; right: string }[] {
  const errors: { wrong: string; right: string }[] = [];
  const commonMistakes: [RegExp, string, string][] = [
    [/\bi is\b/gi, "i is", "I am"],
    [/\bi am go\b/gi, "i am go", "I am going"],
    [/\bhe go\b/gi, "he go", "he goes"],
    [/\bshe go\b/gi, "she go", "she goes"],
    [/\bthey is\b/gi, "they is", "they are"],
    [/\bwe is\b/gi, "we is", "we are"],
    [/\bhe don't\b/gi, "he don't", "he doesn't"],
    [/\bshe don't\b/gi, "she don't", "she doesn't"],
    [/\bmore better\b/gi, "more better", "better"],
    [/\bmost best\b/gi, "most best", "the best"],
    [/\bmyself name\b/gi, "myself name", "my name"],
    [/\bi can able\b/gi, "i can able", "I can"],
    [/\bhe have\b/gi, "he have", "he has"],
    [/\bshe have\b/gi, "she have", "she has"],
  ];

  for (const [regex, wrong, right] of commonMistakes) {
    if (regex.test(text)) {
      errors.push({ wrong, right });
    }
  }

  return errors;
}

function generateContextualFeedback(
  wordCount: number,
  score: number,
  interviewType: InterviewType
): string {
  const tips: Record<string, string> = {
    "self-intro":
      "Include details about your hobbies, professional goals, and background.",
    hr: "Explain with examples why you are suitable, highlighting behavioral competencies.",
    fresher: "Focus on academic projects, your enthusiasm to learn, and teamwork.",
    daily: "Keep the flow natural, using common phrases.",
  };

  if (wordCount < 5) {
    return `Your response is very brief. Try expressing yourself in full sentences. ${tips[interviewType]}`;
  }
  if (score >= 8) {
    return `Excellent response! You showed great grammar, vocabulary and fluency. Maintain this level of practice!`;
  }
  if (score >= 6) {
    return `Good effort! Your response covers the topic. Try to add 1-2 more sentences to expand on your points.`;
  }
  return `Keep practicing! Focus on subject-verb agreement and constructing clear, simple sentences.`;
}

function generateBetterAnswer(
  question: string,
  interviewType: InterviewType
): string {
  const lowerQ = question.toLowerCase();

  if (
    interviewType === "self-intro" ||
    lowerQ.includes("tell me about yourself") ||
    lowerQ.includes("introduce yourself")
  ) {
    return "Hello! My name is Ravi. I am from Hyderabad, India. I completed my education in computer science. In my free time, I like reading books and playing cricket. I am learning English to improve my career growth. Thank you!";
  }

  if (lowerQ.includes("hire you") || lowerQ.includes("why should we")) {
    return "You should hire me because I have the required skills and a strong desire to learn. I am hardworking, reliable, and work well in teams. I am excited to contribute to your company's growth.";
  }

  if (lowerQ.includes("strength") || lowerQ.includes("strong")) {
    return "My biggest strength is my quick learning ability and positive attitude. I am also honest and finish my tasks on time. I always look for ways to improve myself.";
  }

  if (lowerQ.includes("weakness") || lowerQ.includes("improve")) {
    return "Sometimes I get nervous speaking in front of big groups. To improve, I am taking speaking practices and participating in small group discussions to gain confidence.";
  }

  if (lowerQ.includes("project")) {
    return "In my final year, I built an online book store application using React and Firebase. It allows users to browse, search, and purchase books online. I learned a lot about databases and UI design during this project.";
  }

  if (lowerQ.includes("hometown") || lowerQ.includes("where you live")) {
    return "I live in Hyderabad. It is a historical and beautiful city known for its rich culture, technology hubs, and delicious food like Biryani. It is a very lively place.";
  }

  return "Thank you for the question. I would highlight that [provide details]. I strive to build my skills in this area through consistent learning and daily practice.";
}

// ============================================================
// CHAT PLACEHOLDER
// ============================================================
function generatePlaceholderChat(
  messages: { role: "user" | "assistant"; content: string }[],
  interviewType: string
): string {
  const userMessages = messages.filter((m) => m.role === "user");
  const lastUserMessage = userMessages[userMessages.length - 1]?.content.toLowerCase() || "";

  if (lastUserMessage.includes("hello") || lastUserMessage.includes("hi")) {
    return `Hello! Welcome to your ${interviewType} practice. Let's start! Could you tell me a little bit about what you do?`;
  }
  if (lastUserMessage.includes("hobbies") || lastUserMessage.includes("interest") || lastUserMessage.includes("like to")) {
    return "That sounds very interesting! How long have you been interested in this, and how often do you get to do it?";
  }
  if (lastUserMessage.includes("strength") || lastUserMessage.includes("good at")) {
    return "Those are great strengths to have. Can you share an example of how you used these strengths in a real situation?";
  }
  return "Thank you for sharing that! That is very clear. Can you tell me more about your future goals in this area?";
}

/**
 * Evaluate AI Placement Test answers to determine CEFR level.
 */
export async function evaluatePlacementAnswers(
  answers: string[]
): Promise<{ cefrLevel: string; assignedTrack: "beginner" | "intermediate" | "advanced"; feedback: string; score: number }> {
  const apiKey = process.env.AI_API_KEY;
  const provider = process.env.AI_PROVIDER || "gemini";

  if (apiKey && apiKey !== "your_gemini_or_openai_key_here" && provider === "gemini") {
    try {
      const questions = [
        "Introduce yourself in English.",
        "Describe your hobbies and interests.",
        "Talk about a recent holiday or trip you took.",
        "Describe a challenge you solved in your life, studies, or work.",
        "Give your opinion: Is technology good or bad for education?"
      ];

      let prompt = `You are an expert English language examiner assessing a student's CEFR level.
Analyze the following 5 placement test answers:

`;

      for (let i = 0; i < 5; i++) {
        prompt += `Question ${i + 1}: "${questions[i]}"\n`;
        prompt += `Answer ${i + 1}: "${answers[i] || ""}"\n\n`;
      }

      prompt += `Evaluate the grammar, vocabulary, sentence structure, and coherence.
Determine their CEFR level (A1, A2, B1, B2, C1, or C2) and map it to one of these three tracks:
- "beginner" (if CEFR is A1 or A2)
- "intermediate" (if CEFR is B1 or B2)
- "advanced" (if CEFR is C1 or C2)

Provide a brief summary feedback (2-3 sentences) explaining the placement.
Provide an overall placement score out of 100.

Respond ONLY with a JSON object in this exact format:
{
  "cefrLevel": "B1",
  "assignedTrack": "intermediate",
  "feedback": "Your vocabulary is appropriate for intermediate tasks. However, work on complex structures.",
  "score": 65
}

Ensure the response is JSON only.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
            },
          }),
        }
      );

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        const parsed = JSON.parse(text);
        return {
          cefrLevel: parsed.cefrLevel || "B1",
          assignedTrack: parsed.assignedTrack || "intermediate",
          feedback: parsed.feedback || "Based on your test performance, you have been placed in the intermediate level.",
          score: parsed.score || 60
        };
      }
    } catch (error) {
      console.error("Gemini placement error, using fallback:", error);
    }
  }

  // Fallback to local heuristic evaluation
  let totalLength = 0;
  for (const ans of answers) {
    totalLength += (ans || "").trim().split(/\s+/).filter(Boolean).length;
  }
  const avgWords = totalLength / 5;

  let cefrLevel = "A2";
  let assignedTrack: "beginner" | "intermediate" | "advanced" = "beginner";
  let feedback = "Your answers indicate beginner-level familiarity. We recommend starting with our Level 1: Beginner course to build core structures.";
  let score = 35;

  if (avgWords >= 25) {
    cefrLevel = "C1";
    assignedTrack = "advanced";
    feedback = "Excellent! You demonstrate a rich vocabulary and fluent sentence construction. You have been placed directly in our Level 3: Advanced course.";
    score = 85;
  } else if (avgWords >= 10) {
    cefrLevel = "B1";
    assignedTrack = "intermediate";
    feedback = "Good job! You can express yourself in complete sentences. We recommend starting with our Level 2: Intermediate course to focus on professional communication.";
    score = 60;
  }

  return {
    cefrLevel,
    assignedTrack,
    feedback,
    score
  };
}
