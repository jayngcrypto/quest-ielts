import { NextRequest, NextResponse } from "next/server";
import { callAI } from "@/lib/ai-provider";

export async function POST(req: NextRequest) {
  const { transcript, part } = await req.json();
  if (!transcript) return NextResponse.json({ error: "Missing transcript" }, { status: 400 });

  const systemPrompt = `You are an expert IELTS examiner. Grade the following IELTS Speaking Part ${part || 1} response.
Return ONLY valid JSON with this exact structure:
{
  "band": <overall band 1-9, can use .5>,
  "feedback": [
    {"criterion": "Fluency & Coherence", "score": <1-9>, "comment": "<comment in Vietnamese>"},
    {"criterion": "Lexical Resource", "score": <1-9>, "comment": "<comment in Vietnamese>"},
    {"criterion": "Grammatical Range & Accuracy", "score": <1-9>, "comment": "<comment in Vietnamese>"},
    {"criterion": "Pronunciation", "score": <1-9>, "comment": "<comment in Vietnamese>"}
  ],
  "corrections": [
    {"original": "<wrong phrase>", "corrected": "<correct phrase>", "explanation": "<Vietnamese>"}
  ],
  "suggestions": ["<suggestion 1 in Vietnamese>", "<suggestion 2>", "<suggestion 3>"]
}`;

  try {
    const result = await callAI([
      { role: "system", content: systemPrompt },
      { role: "user", content: `Transcript:\n${transcript}` },
    ]);

    return NextResponse.json(JSON.parse(result.content));
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "AI grading failed" },
      { status: 500 }
    );
  }
}
