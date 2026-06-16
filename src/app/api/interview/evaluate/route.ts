// ============================================================
// API Route: POST /api/interview/evaluate
// Evaluates a user's interview answer using AI (or placeholder)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { evaluateAnswer } from "@/lib/ai";
import type { InterviewType } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, answer, interviewType } = body;

    // Validate input
    if (!question || !answer || !interviewType) {
      return NextResponse.json(
        { error: "Missing required fields: question, answer, interviewType" },
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

    // Evaluate the answer
    const result = await evaluateAnswer(question, answer, interviewType);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Evaluation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
