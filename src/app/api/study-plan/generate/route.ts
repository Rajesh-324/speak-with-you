// ============================================================
// API Route: POST /api/study-plan/generate
// Generates a personalized weekly study plan based on weaknesses
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { saveStudyPlan } from "@/lib/firestore";
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
    const { uid, cefrLevel, weaknesses } = body;

    if (!uid || !cefrLevel) {
      return NextResponse.json(
        { error: "Missing required fields: uid, cefrLevel" },
        { status: 400 }
      );
    }

    const weaknessesList = Array.isArray(weaknesses) ? weaknesses : ["grammar precision", "vocabulary range"];
    const apiKey = process.env.AI_API_KEY;
    const provider = process.env.AI_PROVIDER || "gemini";

    let generatedPlan = "";

    if (apiKey && apiKey !== "your_gemini_or_openai_key_here" && provider === "gemini") {
      try {
        const prompt = `You are a professional AI English Coach.
        Generate a personalized Weekly English Study Plan (7 Days) for a student.
        Student CEFR Level: "${cefrLevel}"
        Identified Weaknesses: ${weaknessesList.join(", ")}
        
        Write a detailed study roadmap in Markdown format. Outline specific daily actions, e.g.:
        - Day 1: [Topic name related to weaknesses]
        - Day 2: [Another topic]
        Include encouraging words, recommended practice exercises, and study tips. Do not include markdown code block characters. Just write the raw markdown text.`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            }),
          }
        );

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          generatedPlan = text.trim();
        }
      } catch (error) {
        console.error("Gemini study plan generator error:", error);
      }
    }

    // Offline fallback plan
    if (!generatedPlan) {
      generatedPlan = `### 📅 Your Personalized Weekly Study Plan (${cefrLevel})
      
Based on your identified weaknesses in **${weaknessesList.join(", ")}**, here is your custom 7-day roadmap:

- **Day 1: Grammar Core Foundations**
  Focus on Subject-Verb agreement. Practice reading Day 5 and Day 12 grammar guides in the SpeakWithYou curriculum.
- **Day 2: Active Vocabulary Expansion**
  Practice logging 5 new words from intermediate lessons and constructing sentences with them.
- **Day 3: Listening & Echoing**
  Watch an English video or podcast for 10 minutes, writing down expressions and reading them aloud.
- **Day 4: Conversational Practice**
  Spend 5 minutes chatting with our AI English Friend Buddy about your hobbies.
- **Day 5: Behavioral Mock Prep**
  Engage in a Software Developer or HR mock interview to practice speaking under time limits.
- **Day 6: Reviewing Mistakes**
  Look at your saved interview history, read all grammar corrections, and re-write the corrected sentences.
- **Day 7: Assessment & Celebration**
  Take the Daily Speaking Challenge on Saturday to assess your fluency growth and earn XP.

*Coach Tip:* Consistent daily practice of 10-15 minutes yields far better results than studying for 2 hours once a week!`;
    }

    // Save study plan in Firestore
    await saveStudyPlan(uid, generatedPlan, weaknessesList);

    return NextResponse.json({ plan: generatedPlan });
  } catch (error) {
    console.error("Study plan generate route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
