// ============================================================
// API Route: POST /api/interview/chat
// Conducts interactive AI interviewer conversation
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { chatWithGemini } from "@/lib/ai";
import type { InterviewType } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, interviewType } = body;

    // Validate input
    if (!messages || !Array.isArray(messages) || !interviewType) {
      return NextResponse.json(
        { error: "Missing required fields: messages, interviewType" },
        { status: 400 }
      );
    }

    // Validate interview type
    const validTypes: InterviewType[] = ["self-intro", "hr", "fresher", "daily"];
    if (!validTypes.includes(interviewType)) {
      return NextResponse.json(
        { error: "Invalid interview type" },
        { status: 400 }
      );
    }

    // Call chat helper
    const responseText = await chatWithGemini(messages, interviewType);

    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
