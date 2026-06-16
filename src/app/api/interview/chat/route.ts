// ============================================================
// API Route: POST /api/interview/chat
// Conducts interactive AI interviewer conversation
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { chatWithAgent } from "@/lib/ai";
import type { InterviewType } from "@/types";
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
    const { messages, interviewType, pronunciationConfidence } = body;

    // Validate input
    if (!messages || !Array.isArray(messages) || !interviewType) {
      return NextResponse.json(
        { error: "Missing required fields: messages, interviewType" },
        { status: 400 }
      );
    }

    // Validate interview type
    const validTypes: InterviewType[] = ["hr", "tech", "support", "english", "daily"];
    if (!validTypes.includes(interviewType)) {
      return NextResponse.json(
        { error: "Invalid interview type" },
        { status: 400 }
      );
    }

    // Call chat agent helper
    const result = await chatWithAgent(
      messages, 
      interviewType, 
      typeof pronunciationConfidence === "number" ? pronunciationConfidence : 1.0
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
