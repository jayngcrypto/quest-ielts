import { NextRequest, NextResponse } from "next/server";
import { callAI } from "@/lib/ai-provider";

export async function POST(req: NextRequest) {
  const { essay, prompt } = await req.json();
  if (!essay || !prompt) return NextResponse.json({ error: "Missing essay or prompt" }, { status: 400 });

  const systemPrompt = `You are an expert IELTS examiner. Grade the following IELTS Writing response.
Return ONLY valid JSON with this exact structure:
{
  "band": <overall band 1-9, can use .5>,
  "feedback": [
    {"criterion": "Task Response", "score": <1-9>, "comment": "<comment in Vietnamese>"},
    {"criterion": "Coherence & Cohesion", "score": <1-9>, "comment": "<comment in Vietnamese>"},
    {"criterion": "Lexical Resource", "score": <1-9>, "comment": "<comment in Vietnamese>"},
    {"criterion": "Grammatical Range & Accuracy", "score": <1-9>, "comment": "<comment in Vietnamese>"}
  ],
  "correctedText": "<brief corrected version or key corrections>",
  "suggestions": ["<suggestion 1 in Vietnamese>", "<suggestion 2>", "<suggestion 3>"]
}`;

  try {
    const result = await callAI([
      { role: "system", content: systemPrompt },
      { role: "user", content: `Prompt: "${prompt}"\n\nEssay:\n${essay}` },
    ]);

    return NextResponse.json(JSON.parse(result.content));
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "AI grading failed" },
      { status: 500 }
    );
  }
}
