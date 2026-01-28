// Lightweight OpenAI client wrapper for the ICP Generator app.
// Uses the new "responses" API as the main entry point.
// We keep all direct HTTP calls to OpenAI in this file so it is easy
// to move them to a backend/edge function later if needed.

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  // This will show up in the browser console in dev if the key is missing.
  console.warn(
    "[openaiClient] VITE_OPENAI_API_KEY is missing. " +
      "Add it to .env.local in the project root."
  );
}

export interface OpenAIResponse {
  // Shape is intentionally loose so it works across models / options.
  output?: Array<{
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
  [key: string]: any;
}

/**
 * Low-level helper to call the OpenAI Responses API.
 * You usually won't use this directly – prefer the higher-level helpers
 * in src/services/icpAiService.ts.
 */
export async function callOpenAI<T = OpenAIResponse>(
  body: Record<string, any>
): Promise<T> {
  if (!OPENAI_API_KEY) {
    throw new Error(
      "VITE_OPENAI_API_KEY is not set. Update .env.local with your real key."
    );
  }

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[openaiClient] API error:", res.status, text);
    throw new Error(`OpenAI API error ${res.status}: ${text}`);
  }

  return (await res.json()) as T;
}

/**
 * Convenience helper to pull JSON text out of a Responses API result.
 * We standardise this here so the rest of the app can just say:
 *
 *   const profile = extractJsonFromResponse<ICPProfile>(apiResponse)
 */
export function extractJsonFromResponse<T = unknown>(
  apiResponse: OpenAIResponse
): T {
  const text =
    apiResponse?.output?.[0]?.content?.[0]?.text ??
    apiResponse?.output_text ??
    "";

  if (!text || typeof text !== "string") {
    throw new Error(
      "[openaiClient] Could not find text content in OpenAI response"
    );
  }

  try {
    return JSON.parse(text) as T;
  } catch (err) {
    console.error("[openaiClient] Failed to parse JSON from response:", text);
    throw err;
  }
}

