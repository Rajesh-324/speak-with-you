// ============================================================
// API Route: POST /api/interview/report
// Compiles the final interview report card based on chat history
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { generateFinalReport } from "@/lib/ai";
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
    const { messages, interviewType } = body;

    if (!messages || !Array.isArray(messages) || !interviewType) {
      return NextResponse.json(
        { error: "Missing required fields: messages, interviewType" },
        { status: 400 }
      );
    }

    const validTypes: InterviewType[] = ["hr", "tech", "support", "english", "daily"];
    if (!validTypes.includes(interviewType)) {
      return NextResponse.json(
        { error: "Invalid interview type" },
        { status: 400 }
      );
    }

    const report = await generateFinalReport(messages, interviewType);
    return NextResponse.json(report);
  } catch (error) {
    console.error("Report compiling error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
