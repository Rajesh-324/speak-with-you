import { NextRequest, NextResponse } from "next/server";
import { evaluatePlacementAnswers } from "@/lib/ai";
import { checkRateLimit } from "@/lib/rateLimit";

export async function POST(request: NextRequest) {
  try {
    if (checkRateLimit(request)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429 }
      );
    }
    const { answers } = await request.json();
    if (!answers || !Array.isArray(answers) || answers.length !== 5) {
      return NextResponse.json(
        { error: "Invalid request. Please provide exactly 5 answers." },
        { status: 400 }
      );
    }

    const result = await evaluatePlacementAnswers(answers);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Placement API error:", error);
    return NextResponse.json(
      { error: "Failed to evaluate placement test." },
      { status: 500 }
    );
  }
}
