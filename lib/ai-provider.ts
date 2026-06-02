// AI Provider with fallback logic
// Priority: Groq (fast, free) → OpenRouter free models → error

interface AIMessage {
  role: "system" | "user";
  content: string;
}

interface AIResponse {
  content: string;
}

const PROVIDERS = [
  {
    name: "Groq",
    url: "https://api.groq.com/openai/v1/chat/completions",
    getKey: () => process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    supportsJsonFormat: true,
  },
  {
    name: "OpenRouter-Gemma",
    url: "https://openrouter.ai/api/v1/chat/completions",
    getKey: () => process.env.OPENROUTER_API_KEY,
    model: "google/gemma-4-31b-it:free",
    supportsJsonFormat: false,
  },
  {
    name: "OpenRouter-Kimi",
    url: "https://openrouter.ai/api/v1/chat/completions",
    getKey: () => process.env.OPENROUTER_API_KEY,
    model: "moonshotai/kimi-k2.6:free",
    supportsJsonFormat: false,
  },
];

function cleanJsonResponse(text: string): string {
  let cleaned = text.trim();
  if (cleaned.startsWith("```json")) cleaned = cleaned.slice(7);
  else if (cleaned.startsWith("```")) cleaned = cleaned.slice(3);
  if (cleaned.endsWith("```")) cleaned = cleaned.slice(0, -3);
  return cleaned.trim();
}

export async function callAI(messages: AIMessage[]): Promise<AIResponse> {
  const errors: string[] = [];

  for (const provider of PROVIDERS) {
    const key = provider.getKey();
    if (!key) continue;

    try {
      const body: Record<string, unknown> = {
        model: provider.model,
        messages,
        max_tokens: 4000,
      };

      if (provider.supportsJsonFormat) {
        body.response_format = { type: "json_object" };
      }

      const res = await fetch(provider.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${key}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      // Check for errors
      if (data.error) {
        errors.push(`${provider.name}: ${data.error.message || "Unknown error"}`);
        continue; // Try next provider
      }

      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        errors.push(`${provider.name}: Empty response`);
        continue;
      }

      return { content: cleanJsonResponse(content) };
    } catch (e) {
      errors.push(`${provider.name}: ${e instanceof Error ? e.message : "Network error"}`);
      continue;
    }
  }

  throw new Error(`All AI providers failed: ${errors.join(" | ")}`);
}
