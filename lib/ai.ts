// AI Grading — calls server-side API routes (key is hidden from browser)

export async function gradeWriting(essay: string, prompt: string) {
  const res = await fetch("/api/ai/grade-writing", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ essay, prompt }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Grading failed");
  }

  return res.json() as Promise<{
    band: number;
    feedback: { criterion: string; score: number; comment: string }[];
    correctedText: string;
    suggestions: string[];
  }>;
}

export async function gradeSpeaking(transcript: string, part: number) {
  const res = await fetch("/api/ai/grade-speaking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transcript, part }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Grading failed");
  }

  return res.json() as Promise<{
    band: number;
    feedback: { criterion: string; score: number; comment: string }[];
    corrections: { original: string; corrected: string; explanation: string }[];
    suggestions: string[];
  }>;
}
