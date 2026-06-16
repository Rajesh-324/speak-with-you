// ============================================================
// API Route: POST /api/booster
// Handles Resume Review, HR Question Generation, and Roadmap
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
    const { task, resumeText, jobTitle } = body;

    if (!task || !resumeText || !jobTitle) {
      return NextResponse.json(
        { error: "Missing required fields: task, resumeText, jobTitle" },
        { status: 400 }
      );
    }

    if (resumeText.length > 10000 || jobTitle.length > 200) {
      return NextResponse.json(
        { error: "Input exceeds maximum allowed length (10,000 characters for resume, 200 for job title)." },
        { status: 400 }
      );
    }

    const apiKey = process.env.AI_API_KEY;
    const provider = process.env.AI_PROVIDER || "gemini";

    let resultText = "";

    if (apiKey && apiKey !== "your_gemini_or_openai_key_here" && provider === "gemini") {
      try {
        let prompt = "";

        if (task === "review") {
          prompt = `You are an expert HR Manager and Resume Consultant.
          Review the following resume for the target job title: "${jobTitle}".
          Resume Content:
          "${resumeText}"
          
          Provide a professional critique. Structure your reply in Markdown:
          1. **Overall Impression** (1-2 sentences)
          2. **Grammar & Phrasing Corrections** (List specific fixes)
          3. **Impact Improvements** (How to make it sound more professional/result-oriented)
          4. **Missing Skills/Keywords** (Skills they should add for this role)`;
        } else if (task === "questions") {
          prompt = `You are a Senior Recruiter interviewing for the role: "${jobTitle}".
          Read this resume content:
          "${resumeText}"
          
          Generate exactly 5 customized situational or behavioral HR interview questions. Under each question, add a brief "Recruiter Tip" explaining what the interviewer is looking for. Write in Markdown.`;
        } else if (task === "roadmap") {
          prompt = `You are an expert Career Coach.
          Help this candidate prepare for a "${jobTitle}" interview.
          Candidate Resume:
          "${resumeText}"
          
          Generate a detailed 3-Week Interview Preparation Roadmap in Markdown.
          Week 1: Foundations & Resume Prep
          Week 2: Behavioral & Scenario prep
          Week 3: Mock interviews & final delivery.`;
        }

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
          resultText = text.trim();
        }
      } catch (error) {
        console.error("Gemini Booster error:", error);
      }
    }

    // Fallback response if offline
    if (!resultText) {
      if (task === "review") {
        resultText = `### 📝 Offline Resume Review: ${jobTitle}
        
- **Overall Impression:** Your resume has a solid foundation, but can be improved with active verbs and skill alignments.
- **Grammar & Phrasing:** Ensure capitalization is consistent. Use "Responsible for implementing..." instead of "I was doing...".
- **Impact Improvements:** Quantify results (e.g. "Improved efficiency by 15%").
- **Target Keywords:** Add teamwork, project cycle, and active communication skills.`;
      } else if (task === "questions") {
        resultText = `### ❓ Custom HR Questions: ${jobTitle}
        
1. **Can you describe a project you led that demonstrates your target skills?**
   *Recruiter Tip:* Focus on the STAR method (Situation, Task, Action, Result).
2. **How do you handle disagreements within a development team?**
   *Recruiter Tip:* The recruiter wants to evaluate your conflict resolution skills.
3. **What motivates you to work specifically in this field?**
   *Recruiter Tip:* Highlight your long-term career ambition.`;
      } else {
        resultText = `### 🗺️ preparation Roadmap: ${jobTitle}
        
- **Week 1: Core Resume Storyboarding**
  Prepare 2-sentence summaries for every project mentioned in your resume.
- **Week 2: Situational HR prep**
  Practice conflict, leadership, and failure stories using the STAR framework.
- **Week 3: Dynamic Mock Practice**
  Spend 10 minutes daily practicing mock interview modules on SpeakWithYou.`;
      }
    }

    return NextResponse.json({ result: resultText });
  } catch (error) {
    console.error("Booster API Route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
