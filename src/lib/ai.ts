// ============================================================
// AI Agent Logic (Gemini 2.5 Flash)
// ============================================================

import type { EvaluationResult, InterviewType, InterviewQuestion } from "@/types";

export interface ChatAgentResult {
  nextQuestion: string;
  isComplete: boolean;
  feedback: string;
  grammarCorrection: string;
  betterAnswer: string;
  realTimeScores: {
    grammar: number;
    fluency: number;
    vocabulary: number;
    confidence: number;
    pronunciation: number;
  };
}

export interface FinalReportResult {
  overallScore: number;
  cefrLevel: string;
  overallFeedback: string; // Interview Summary
  strengths: string[];
  weaknesses: string[];
  recommendedLessons: string[];
}

/**
 * Conduct dynamic stateful conversational turns with Gemini.
 */
export async function chatWithAgent(
  messages: { role: "user" | "assistant"; content: string }[],
  interviewType: InterviewType,
  pronunciationConfidence: number = 1.0
): Promise<ChatAgentResult> {
  const apiKey = process.env.AI_API_KEY;
  const provider = process.env.AI_PROVIDER || "gemini";

  const userTurns = messages.filter((m) => m.role === "user").length;
  const isTooShort = userTurns < 5;

  if (apiKey && apiKey !== "your_gemini_or_openai_key_here" && provider === "gemini") {
    try {
      const systemInstructions: Record<InterviewType, string> = {
        hr: "You are a professional HR Interviewer. Your tone is professional, polite, and direct. You ask behavioral and situational questions, probe into weak answers, and evaluate job suitability. Speak and ask follow-ups like a real human HR manager.",
        tech: "You are a Software Developer Technical Interviewer. Your tone is professional, engineering-focused, and analytical. You ask about tech stack choices, programming projects, solving challenges, and teamwork.",
        support: "You are a Customer Support Manager. Your tone is polite, empathetic, and patient. You simulate customer service cases, asking how they deal with complaints, help users, and show empathy.",
        english: "You are a friendly, encouraging English conversation coach. Your tone is warm, supportive, and helpful. You speak clearly, keep sentences accessible, and focus on helping them build conversational flow.",
        daily: "You are an encouraging friend practicing daily conversations. Your tone is casual, warm, and engaging. You ask about hobbies, food, hometowns, and daily routines.",
      };

      const baseInstruction = systemInstructions[interviewType] || systemInstructions.daily;
      const systemInstruction = `${baseInstruction}
      
Evaluate the user's latest response and generate the next turn. 
Rules:
1. Detect grammar mistakes, vocabulary usage, and communication gaps in their latest answer.
2. If the user's answer is weak, short (e.g. less than 10 words), or vague, probe deeper on those topics and ask a natural, challenging follow-up question.
3. Check the conversation length. If the user has completed 5 or more turns (there are at least 10 messages in total) and you feel all topics have been covered, or if the user requests to finish, set "isComplete" to true and output a polite closing remark. Otherwise, set "isComplete" to false.
4. If "isComplete" is true, write a brief wrap-up message as the "nextQuestion".
5. Provide real-time scores (out of 10) for:
   - "grammar": subject-verb agreement, tenses, etc.
   - "fluency": length, continuity, fillers.
   - "vocabulary": choice of words, variety.
   - "confidence": completeness, clarity.
   - "pronunciation": rhythm, readability (approximate based on text structure, or grade highly if clear).
6. Provide a corrected version of their answer in "grammarCorrection". If perfect, output "No corrections needed.".
7. Provide a model response in "betterAnswer" showing how they could have answered it more fluently or professionally.
8. Output ONLY a valid JSON object matching the JSON schema below:

{
  "nextQuestion": "The next dynamic question or follow-up question, or a wrap-up greeting if isComplete is true.",
  "isComplete": ${isTooShort ? "false" : "true or false depending on context"},
  "feedback": "2-3 sentences of encouraging but honest feedback on their latest answer.",
  "grammarCorrection": "Corrected text here or 'No corrections needed.'",
  "betterAnswer": "Model answer here",
  "realTimeScores": {
    "grammar": 8,
    "fluency": 7,
    "vocabulary": 8,
    "confidence": 7,
    "pronunciation": 8
  }
}

Do not include any Markdown blocks, backticks, or extra text. Output JSON only.`;

      const contents = messages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

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
        
        // Calibrate pronunciation score based on client STT confidence if available
        let finalPronScore = parsed.realTimeScores?.pronunciation || 8;
        if (pronunciationConfidence > 0 && pronunciationConfidence < 1.0) {
          // Adjust score based on STT confidence
          const confidenceAdjustment = Math.round(pronunciationConfidence * 10);
          finalPronScore = Math.min(10, Math.max(1, Math.round((finalPronScore + confidenceAdjustment) / 2)));
        }

        return {
          nextQuestion: parsed.nextQuestion || "Can you tell me more about that?",
          isComplete: isTooShort ? false : !!parsed.isComplete,
          feedback: parsed.feedback || "Good attempt! Keep expressing yourself.",
          grammarCorrection: parsed.grammarCorrection || "No corrections needed.",
          betterAnswer: parsed.betterAnswer || messages[messages.length - 1]?.content || "",
          realTimeScores: {
            grammar: Math.min(10, Math.max(1, parsed.realTimeScores?.grammar || 7)),
            fluency: Math.min(10, Math.max(1, parsed.realTimeScores?.fluency || 7)),
            vocabulary: Math.min(10, Math.max(1, parsed.realTimeScores?.vocabulary || 7)),
            confidence: Math.min(10, Math.max(1, parsed.realTimeScores?.confidence || 7)),
            pronunciation: Math.min(10, Math.max(1, finalPronScore)),
          },
        };
      }
    } catch (error) {
      console.error("Gemini Conversational Chat error:", error);
    }
  }

  // Fallback to offline / placeholder
  return generatePlaceholderChatTurn(messages, interviewType, pronunciationConfidence);
}

/**
 * Generate a final evaluation report at the end of the interview.
 */
export async function generateFinalReport(
  messages: { role: "user" | "assistant"; content: string }[],
  interviewType: InterviewType
): Promise<FinalReportResult> {
  const apiKey = process.env.AI_API_KEY;
  const provider = process.env.AI_PROVIDER || "gemini";

  if (apiKey && apiKey !== "your_gemini_or_openai_key_here" && provider === "gemini") {
    try {
      const transcript = messages
        .map((m) => `${m.role === "assistant" ? "Interviewer" : "Candidate"}: ${m.content}`)
        .join("\n\n");

      const prompt = `You are an expert English language examiner and career consultant.
Read the full interview transcript below:

${transcript}

Based on this conversation, generate a final Interview Report Card.
Evaluate the candidate's performance. Output ONLY a valid JSON object in this format:
{
  "overallScore": <integer score 1-10>,
  "cefrLevel": "<estimated CEFR level: A1 | A2 | B1 | B2 | C1 | C2>",
  "overallFeedback": "<3-4 sentences summarizing their performance, strengths, weaknesses, and communication tips>",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "weaknesses": ["Weakness 1", "Weakness 2", "Weakness 3"],
  "recommendedLessons": [
    "Day 12: Introduce Yourself",
    "Day 35: Handling Work pressure",
    "Day 65: Active Listening"
  ]
}

Make sure recommended lessons include specific Days (from 1 to 90) that match the SpeakWithYou curriculum.
Do not output markdown code blocks. Output JSON only.`;

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
          overallScore: Math.min(10, Math.max(1, parsed.overallScore || 6)),
          cefrLevel: parsed.cefrLevel || "B1",
          overallFeedback: parsed.overallFeedback || "You did a good job practicing. Focus on grammar structure.",
          strengths: parsed.strengths || ["Cooperative", "Responded to questions", "Maintained flow"],
          weaknesses: parsed.weaknesses || ["Minor grammatical errors", "Vocabulary range", "Elaborating details"],
          recommendedLessons: parsed.recommendedLessons || ["Day 15: Talking about Hobbies", "Day 40: Work Communication"],
        };
      }
    } catch (err) {
      console.error("Gemini Final Report error:", err);
    }
  }

  // Fallback to offline report
  return generatePlaceholderFinalReport(messages, interviewType);
}

/**
 * Legacy evaluator method for keeping existing file structures compatible if needed.
 */
export async function evaluateAnswer(
  question: string,
  answer: string,
  interviewType: InterviewType
): Promise<EvaluationResult> {
  // Map back to chat-based evaluator
  const result = await chatWithAgent(
    [
      { role: "assistant", content: question },
      { role: "user", content: answer },
    ],
    interviewType
  );
  return {
    score: Math.round((result.realTimeScores.grammar + result.realTimeScores.fluency + result.realTimeScores.vocabulary + result.realTimeScores.confidence) / 4),
    grammarScore: result.realTimeScores.grammar,
    fluencyScore: result.realTimeScores.fluency,
    vocabularyScore: result.realTimeScores.vocabulary,
    confidenceScore: result.realTimeScores.confidence,
    grammarCorrection: result.grammarCorrection,
    betterAnswer: result.betterAnswer,
    feedback: result.feedback,
  };
}

// ============================================================
// OFFLINE FALLBACK IMPLEMENTATIONS
// ============================================================

function generatePlaceholderChatTurn(
  messages: { role: "user" | "assistant"; content: string }[],
  interviewType: InterviewType,
  pronunciationConfidence: number
): ChatAgentResult {
  const userMessages = messages.filter((m) => m.role === "user");
  const lastAnswer = userMessages[userMessages.length - 1]?.content || "";
  const wordCount = lastAnswer.trim().split(/\s+/).filter(Boolean).length;

  // Real-time scoring heuristics
  const commonErrors = detectCommonErrors(lastAnswer);
  let grammar = 8;
  if (commonErrors.length > 0) grammar -= commonErrors.length * 1.5;
  if (wordCount > 0 && !/^[A-Z]/.test(lastAnswer.trim())) grammar -= 1;
  grammar = Math.min(10, Math.max(2, Math.round(grammar)));

  let fluency = 5;
  if (wordCount >= 10) fluency += 2;
  if (wordCount >= 20) fluency += 3;
  fluency = Math.min(10, Math.max(2, fluency));

  let vocabulary = 5;
  if (wordCount >= 12) vocabulary += 2;
  if (wordCount >= 25) vocabulary += 3;
  vocabulary = Math.min(10, Math.max(2, vocabulary));

  let confidence = 5;
  if (wordCount >= 15) confidence += 3;
  if (/[.!?]$/.test(lastAnswer.trim())) confidence += 2;
  confidence = Math.min(10, Math.max(2, confidence));

  const pronunciation = Math.round((pronunciationConfidence * 10 + 8) / 2);

  // Correction
  let grammarCorrection = lastAnswer;
  if (lastAnswer.trim().length > 0) {
    if (!/^[A-Z]/.test(grammarCorrection.trim())) {
      grammarCorrection = grammarCorrection.trim().charAt(0).toUpperCase() + grammarCorrection.trim().slice(1);
    }
    if (!/[.!?]$/.test(grammarCorrection.trim())) {
      grammarCorrection = grammarCorrection.trim() + ".";
    }
  }
  for (const error of commonErrors) {
    grammarCorrection = grammarCorrection.replace(error.wrong, error.right);
  }
  if (grammarCorrection === lastAnswer) {
    grammarCorrection = "No corrections needed.";
  }

  // Next Question Generator (Dynamic list based on turn index)
  const isComplete = userMessages.length >= 6;
  let nextQuestion = "Could you elaborate more on that point?";
  
  if (isComplete) {
    nextQuestion = "Thank you very much. That concludes our interview session today. I wish you all the best!";
  } else {
    // Generate simple flow
    const turnIndex = userMessages.length;
    const questions: Record<InterviewType, string[]> = {
      hr: [
        "Why should we hire you for this role?",
        "What are your biggest strengths and weaknesses?",
        "How do you handle pressure or difficult situations at work?",
        "Why do you want to work at our company?",
        "What are your long-term career goals?",
      ],
      tech: [
        "Can you tell me about a project you worked on recently? What technologies did you use?",
        "What is your favorite programming language, and why?",
        "Describe a difficult bug or coding challenge you solved.",
        "How do you keep up to date with new technology trends?",
        "Do you prefer working in a team or independently, and why?",
      ],
      support: [
        "How would you handle an angry customer who demands a refund immediately?",
        "What does 'good customer service' mean to you?",
        "Describe a time you went above and beyond to help someone.",
        "How do you handle multitasking during peak support hours?",
        "What would you do if a customer asks a question you don't know the answer to?",
      ],
      english: [
        "That's interesting. What do you do to learn and practice English daily?",
        "Can you describe your hometown or where you currently live?",
        "What is your favorite season of the year and why?",
        "Tell me about a book or a movie you enjoyed recently.",
        "If you could travel to any country tomorrow, where would you go?",
      ],
      daily: [
        "That's cool! What is your favorite type of food, and do you like to cook?",
        "How do you typically spend a sunny weekend afternoon?",
        "What kind of music or movies do you like to relax with?",
        "Can you tell me about your best friend or someone you admire?",
        "What is one goal you want to achieve this month?",
      ],
    };

    const qList = questions[interviewType] || questions.daily;
    nextQuestion = qList[Math.min(turnIndex - 1, qList.length - 1)];
  }

  const betterAnswer = generateBetterAnswer(messages[messages.length - 1]?.content || "", interviewType);

  return {
    nextQuestion,
    isComplete,
    feedback: wordCount < 5 
      ? "Your response is quite short. Try adding details and completing your thought with full sentences."
      : "Good effort. You are constructing sentences nicely, though you could expand on examples.",
    grammarCorrection,
    betterAnswer,
    realTimeScores: {
      grammar,
      fluency,
      vocabulary,
      confidence,
      pronunciation,
    },
  };
}

function generatePlaceholderFinalReport(
  messages: { role: "user" | "assistant"; content: string }[],
  interviewType: InterviewType
): FinalReportResult {
  const userMessages = messages.filter((m) => m.role === "user");
  let scoreSum = 0;
  let wordCountSum = 0;

  for (const m of userMessages) {
    wordCountSum += m.content.split(/\s+/).filter(Boolean).length;
    // Compute simple offline score
    const errors = detectCommonErrors(m.content);
    let score = 8;
    if (errors.length > 0) score -= errors.length * 1.5;
    if (m.content.length < 15) score -= 2;
    scoreSum += Math.max(3, score);
  }

  const avgScore = userMessages.length > 0 ? Math.round(scoreSum / userMessages.length) : 6;
  const avgWords = userMessages.length > 0 ? wordCountSum / userMessages.length : 10;

  let cefrLevel = "A2";
  let strengths = ["Cooperative attitude", "Speaks clearly", "Understands questions well"];
  let weaknesses = ["Short response length", "Basic vocabulary usage", "Minor subject-verb agreement errors"];
  let recommendedLessons = ["Day 5: Daily Routine Sentences", "Day 12: Introducing Yourself", "Day 22: Speaking Confidently"];

  if (avgWords >= 20 && avgScore >= 8) {
    cefrLevel = "B2";
    strengths = ["Rich vocabulary choice", "Fluent speaking flow", "Coherent paragraphs"];
    weaknesses = ["Preposition precision", "Advanced sentence connector variety", "More workplace expressions needed"];
    recommendedLessons = ["Day 45: Advanced Vocabulary", "Day 52: Professional Emails", "Day 68: Group Discussions"];
  } else if (avgWords >= 12 && avgScore >= 6) {
    cefrLevel = "B1";
    strengths = ["Good sentence structure", "Expresses personal views", "Consistent flow"];
    weaknesses = ["Tense consistency", "Elaborating with specific examples", "Speech confidence"];
    recommendedLessons = ["Day 32: Past Tense Mastery", "Day 40: Explaining College Projects", "Day 48: Telephone Etiquette"];
  }

  return {
    overallScore: avgScore,
    cefrLevel,
    overallFeedback: `You did a solid job completing the ${interviewType} session. Your average length was ${Math.round(avgWords)} words per answer. Keep practicing daily to increase fluency and expand your vocabulary range.`,
    strengths,
    weaknesses,
    recommendedLessons,
  };
}

function detectCommonErrors(text: string): { wrong: string; right: string }[] {
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

function generateBetterAnswer(question: string, interviewType: InterviewType): string {
  const lowerQ = question.toLowerCase();

  if (lowerQ.includes("introduce") || lowerQ.includes("tell me about yourself")) {
    return "Hello! My name is Rajesh. I completed my engineering degree in computer science. In my free time, I enjoy reading books and practicing speech skills. I am looking forward to contributing to your team's success.";
  }
  if (lowerQ.includes("hire you") || lowerQ.includes("why should we")) {
    return "You should hire me because I have a solid foundation in software principles, a quick learning attitude, and I communicate effectively. I am highly motivated to excel in this role.";
  }
  if (lowerQ.includes("strength")) {
    return "My primary strength is problem-solving. I am analytical, pay close attention to detail, and work well under pressure to meet tight deadlines.";
  }
  if (lowerQ.includes("weakness")) {
    return "One area I am improving is public speaking. Sometimes I feel nervous in front of large crowds, so I am taking online speaking challenges to build my confidence.";
  }
  if (lowerQ.includes("project")) {
    return "I recently worked on a web portal for student assignments. We used React for the frontend and Firestore for the database. It streamlined the submission process and helped save time.";
  }

  return "Thank you for the question. I believe that expressing ideas clearly and structured is the key. I would summarize that by focusing on core deliverables and maintaining consistent team alignment.";
}

/**
 * Conduct AI Placement Test answer evaluation.
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
        "Give your opinion: Is technology good or bad for education?",
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
          score: parsed.score || 60,
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
    score,
  };
}
