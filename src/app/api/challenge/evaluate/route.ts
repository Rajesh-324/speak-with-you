// ============================================================
// API Route: POST /api/challenge/evaluate
// Evaluates the user's daily speaking challenge response
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  try {
    if (checkRateLimit(request)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429 }
      );
    }
    const body = await request.json();
    const { challengeId, answer, promptText } = body;

    if (!challengeId || !answer || !promptText) {
      return NextResponse.json(
        { error: "Missing required fields: challengeId, answer, promptText" },
        { status: 400 }
      );
    }

    const apiKey = process.env.AI_API_KEY;
    const provider = process.env.AI_PROVIDER || "gemini";

    if (apiKey && apiKey !== "your_gemini_or_openai_key_here" && provider === "gemini") {
      try {
        const prompt = `You are an expert English examiner evaluating a student's answer to a daily speaking challenge.
        Challenge Topic: "${promptText}"
        Student's Answer: "${answer}"
        
        Evaluate their response and output ONLY a valid JSON object matching the schema below:
        {
          "score": <overall score 1-10>,
          "grammarScore": <grammar score 1-10>,
          "fluencyScore": <fluency score 1-10>,
          "vocabularyScore": <vocabulary score 1-10>,
          "grammarCorrection": "<grammar correction highlights, or 'No corrections needed' if perfect>",
          "betterAnswer": "<a model answer suited for them to learn from>",
          "feedback": "<2-3 sentences of constructive and encouraging feedback>"
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
          return NextResponse.json({
            score: Math.min(10, Math.max(1, parsed.score || 5)),
            grammarScore: Math.min(10, Math.max(1, parsed.grammarScore || 5)),
            fluencyScore: Math.min(10, Math.max(1, parsed.fluencyScore || 5)),
            vocabularyScore: Math.min(10, Math.max(1, parsed.vocabularyScore || 5)),
            grammarCorrection: parsed.grammarCorrection || "No corrections needed.",
            betterAnswer: parsed.betterAnswer || answer,
            feedback: parsed.feedback || "Good attempt!",
          });
        }
      } catch (error) {
        console.error("Gemini Challenge Evaluation error:", error);
      }
    }

    // Offline fallback calculations
    const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;
    let score = 5;
    if (wordCount >= 10) score += 2;
    if (wordCount >= 20) score += 2;
    score = Math.min(10, score);

    return NextResponse.json({
      score,
      grammarScore: score,
      fluencyScore: Math.min(10, Math.max(2, Math.round(wordCount / 3))),
      vocabularyScore: score,
      grammarCorrection: "No corrections needed.",
      betterAnswer: `In regards to ${promptText}, I would say that it is a very interesting topic. I strive to expand my communication capabilities in this area through structured daily practice.`,
      feedback: `You spoke ${wordCount} words. Good attempt. Focus on structuring your points clearly and speaking longer sentences.`,
    });
  } catch (error) {
    console.error("Challenge evaluate endpoint error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
