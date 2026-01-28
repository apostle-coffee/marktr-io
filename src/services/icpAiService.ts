// High-level AI helpers for the ICP Generator.
// This is the main entry point for anything that talks to OpenAI.
//
// - generateICPProfile:   returns a rich ICP object (structured JSON)
// - generateICPInsights:  returns a short personality / insights summary
// - generateICPAvatar:    returns a URL for an avatar image (OpenAI images API)
//
// You can wire these into your onboarding / "Create ICP" flows later.

import { callOpenAI, extractJsonFromResponse } from "../lib/openaiClient";

// --- Types ------------------------------------------------------------------

export interface ICPProfile {
  name: string;
  roleTitle: string;
  companyType: string;
  industry: string;
  companySize: string;
  location: string;
  goals: string[];
  painPoints: string[];
  buyingTriggers: string[];
  objections: string[];
  personalityTraits: string[];
  summary: string;
}

export interface ICPInsights {
  shortTagline: string;
  vibe: string;
  primaryMotivation: string;
  keyObsession: string;
  bigFear: string;
}

export interface ICPAvatarResult {
  imageUrl: string;
  promptUsed: string;
}

export interface ICPSeedInput {
  // Whatever you collect from the user in your existing UI
  workingTitle: string;
  notes: string;
  industry?: string;
  companySize?: string;
  tone?: "playful" | "serious" | "neutral";
}

// --- Profile generation (structured JSON) -----------------------------------

export async function generateICPProfile(
  seed: ICPSeedInput
): Promise<ICPProfile> {
  const response = await callOpenAI({
    model: "gpt-5.1-mini",
    input: [
      {
        role: "system",
        content:
          "You are an expert B2B strategist who turns messy notes into a clear, " +
          "actionable Ideal Customer Profile (ICP). Always respond with valid JSON " +
          "that matches the given schema.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `
Create a detailed ICP based on the notes below.

Working title: ${seed.workingTitle}
Preferred tone: ${seed.tone || "neutral"}
Industry (if provided): ${seed.industry || "unspecified"}
Company size (if provided): ${seed.companySize || "unspecified"}

NOTES:
"""
${seed.notes}
"""
`,
          },
        ],
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "ICPProfile",
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            name: { type: "string" },
            roleTitle: { type: "string" },
            companyType: { type: "string" },
            industry: { type: "string" },
            companySize: { type: "string" },
            location: { type: "string" },
            goals: {
              type: "array",
              items: { type: "string" },
            },
            painPoints: {
              type: "array",
              items: { type: "string" },
            },
            buyingTriggers: {
              type: "array",
              items: { type: "string" },
            },
            objections: {
              type: "array",
              items: { type: "string" },
            },
            personalityTraits: {
              type: "array",
              items: { type: "string" },
            },
            summary: { type: "string" },
          },
          required: [
            "name",
            "roleTitle",
            "companyType",
            "industry",
            "companySize",
            "location",
            "goals",
            "painPoints",
            "buyingTriggers",
            "objections",
            "personalityTraits",
            "summary",
          ],
        },
        strict: true,
      },
    },
  });

  return extractJsonFromResponse<ICPProfile>(response);
}

// --- Personality / insights summary ----------------------------------------

export async function generateICPInsights(
  seed: ICPSeedInput
): Promise<ICPInsights> {
  const response = await callOpenAI({
    model: "gpt-5.1-mini",
    input: [
      {
        role: "system",
        content:
          "You write sharp, clear summaries of B2B buyer personas. Always respond " +
          "with JSON matching the given schema.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `
Based on this ICP brief, create a concise, marketing-friendly insight summary.
Focus on how this person thinks, feels and buys – not generic fluff.

Working title: ${seed.workingTitle}
Industry: ${seed.industry || "unspecified"}
Company size: ${seed.companySize || "unspecified"}

NOTES:
"""
${seed.notes}
"""
`,
          },
        ],
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "ICPInsights",
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            shortTagline: { type: "string" },
            vibe: { type: "string" },
            primaryMotivation: { type: "string" },
            keyObsession: { type: "string" },
            bigFear: { type: "string" },
          },
          required: [
            "shortTagline",
            "vibe",
            "primaryMotivation",
            "keyObsession",
            "bigFear",
          ],
        },
        strict: true,
      },
    },
  });

  return extractJsonFromResponse<ICPInsights>(response);
}

// --- Avatar image generation (URL) -----------------------------------------

// NOTE:
// This uses the Images API directly from the frontend for now.
// In production you will probably want to proxy this through a backend
// or edge function so your key is never exposed to end users.

export async function generateICPAvatar(
  seed: ICPSeedInput
): Promise<ICPAvatarResult> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "VITE_OPENAI_API_KEY is not set. Update .env.local with your real key."
    );
  }

  const prompt = `
Flat-colour vector avatar of a professional B2B buyer.

Persona title: ${seed.workingTitle}
Industry: ${seed.industry || "unspecified"}
Tone: ${seed.tone || "neutral"}

Style:
- clean lines, simple shapes
- soft, friendly expression
- front-facing or 3/4 view
- no text, no logo, no background scene
- suitable as a circular profile picture
`;

  const res = await fetch("https://api.openai.com/v1/images", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt,
      size: "512x512",
      n: 1,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("[icpAiService] Avatar generation error:", res.status, text);
    throw new Error(`Avatar generation failed: ${res.status}`);
  }

  const json = await res.json();
  const imageUrl: string | undefined = json?.data?.[0]?.url;

  if (!imageUrl) {
    throw new Error(
      "[icpAiService] Avatar generation succeeded but no image URL was returned."
    );
  }

  return {
    imageUrl,
    promptUsed: prompt.trim(),
  };
}

