// ============================================================
// API Route: POST /api/friend/chat
// Conducts conversations with the Friendly AI Coach
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
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Missing required field: messages" },
        { status: 400 }
      );
    }

    const apiKey = process.env.AI_API_KEY;
    const provider = process.env.AI_PROVIDER || "gemini";

    if (apiKey && apiKey !== "your_gemini_or_openai_key_here" && provider === "gemini") {
      try {
        const systemInstruction = `You are a friendly AI English coach named Buddy. Your tone is extremely warm, encouraging, casual, and polite. 
        You keep your answers very short (1-3 sentences max) and conversational to maintain a natural flow.
        1. If the user makes a clear grammar mistake, gently point it out and provide a friendly correction. E.g. "I is going -> I am going". Keep it brief.
        2. Respond to the content of what the user said with interest.
        3. Ask a simple, engaging follow-up question about daily topics (hobbies, weather, food, dreams, plans) to keep the chat going.`;

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
            }),
          }
        );

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return NextResponse.json({ response: text.trim() });
        }
      } catch (error) {
        console.error("Gemini Friend Chat error:", error);
      }
    }

    // Offline / Fallback response builder
    const userMessages = messages.filter((m) => m.role === "user");
    const lastUserMessage = userMessages[userMessages.length - 1]?.content.toLowerCase() || "";
    let reply = "That's lovely! Tell me more about it. What is your favorite thing to do on weekends?";

    if (lastUserMessage.includes("hello") || lastUserMessage.includes("hi")) {
      reply = "Hello! I am your AI English coach Buddy. I'm so happy to chat with you today! How has your week been so far?";
    } else if (lastUserMessage.includes("hobby") || lastUserMessage.includes("like to")) {
      reply = "That sounds like a wonderful hobby! Practicing hobbies is a great way to unwind. How often do you get to do that?";
    } else if (lastUserMessage.includes("weather") || lastUserMessage.includes("rain") || lastUserMessage.includes("hot")) {
      reply = "Weather shapes our entire day, doesn't it? What is your absolute favorite type of weather and why?";
    } else if (lastUserMessage.includes("food") || lastUserMessage.includes("eat")) {
      reply = "Yum! That makes me hungry just thinking about it. Do you prefer cooking at home or eating out?";
    }

    return NextResponse.json({ response: reply });
  } catch (error) {
    console.error("Friend Chat API Route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
