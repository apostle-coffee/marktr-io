import { supabase } from "../../config/supabase";
import { setLastGenerated } from "./generatedStore";

export type GenerateICPsInput = {
  name: string;
  brandName: string;
  businessDescription: string;
  productOrService: string;
  assumedAudience: string[];
  marketingChannels: string[];
  businessType?: string;
  country?: string;
  regionOrCity?: string;
  currency?: string;
};

export type GeneratedICP = {
  name: string;
  description: string;
  industry?: string;
  company_size?: string;
  location?: string;
  goals?: string[];
  pain_points?: string[];
  budget?: string;
  decision_makers?: string[];
  tech_stack?: string[];
  challenges?: string[];
  opportunities?: string[];
};

export type GenerateICPsResult = { icps: GeneratedICP[] };

function mockICPs(input: GenerateICPsInput): GenerateICPsResult {
  const base = `${input.brandName} / ${input.productOrService}`;
  const currency = (input.currency || "GBP").toUpperCase();
  const currencySymbol =
    currency === "GBP"
      ? "£"
      : currency === "USD"
      ? "$"
      : currency === "EUR"
      ? "€"
      : currency === "CAD"
      ? "C$"
      : currency === "AUD"
      ? "A$"
      : currency === "NZD"
      ? "NZ$"
      : currency === "AED"
      ? "د.إ"
      : currency === "INR"
      ? "₹"
      : currency === "ZAR"
      ? "R"
      : `${currency} `;

  const location =
    [input.regionOrCity, input.country].filter(Boolean).join(", ") ||
    input.country ||
    "UK";

  return {
    icps: [
      {
        name: "The Time-Poor Owner",
        description: `Busy founder looking for predictable growth for ${base} in ${location}.`,
        industry: "SME / Services",
        company_size: "1–10",
        location,
        goals: ["Get more qualified leads", "Increase conversions", "Stop wasting ad spend"],
        pain_points: ["Inconsistent pipeline", "No time for marketing", "Unclear messaging"],
        budget: `${currencySymbol}500–${currencySymbol}2,000/month`,
        decision_makers: ["Founder/Owner"],
        tech_stack: ["WordPress/Shopify", "Google Analytics", "Email tool"],
        challenges: ["Low clarity on ICP", "Poor tracking"],
        opportunities: ["Simple funnel + email capture", "Offer clarity + targeting"],
      },
    ],
  };
}

function normalise(icp: GeneratedICP) {
  return {
    name: icp.name ?? "",
    description: icp.description ?? "",
    industry: icp.industry ?? "",
    company_size: icp.company_size ?? "",
    location: icp.location ?? "",
    goals: Array.isArray(icp.goals) ? icp.goals : [],
    pain_points: Array.isArray(icp.pain_points) ? icp.pain_points : [],
    budget: icp.budget ?? "",
    decision_makers: Array.isArray(icp.decision_makers) ? icp.decision_makers : [],
    tech_stack: Array.isArray(icp.tech_stack) ? icp.tech_stack : [],
    challenges: Array.isArray(icp.challenges) ? icp.challenges : [],
    opportunities: Array.isArray(icp.opportunities) ? icp.opportunities : [],
  };
}

/**
 * generateICPs()
 * - Default: calls Supabase Edge Function `generate-icps` (real OpenAI call, server-side).
 * - Mock mode only if VITE_AI_MOCK=1
 */
export async function generateICPs(input: GenerateICPsInput): Promise<GenerateICPsResult> {
  const mock = (import.meta.env.VITE_AI_MOCK || "").trim() === "1";
  if (mock) {
    console.warn("⚠️ AI pipeline running in MOCK mode (VITE_AI_MOCK=1).");
    return mockICPs(input);
  }

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (import.meta.env.DEV) {
    console.log("generateICPs payload (dev):", {
      name: input.name,
      brandName: input.brandName,
      productOrService: input.productOrService,
      country: input.country,
      regionOrCity: input.regionOrCity,
      currency: input.currency,
      assumedAudience: input.assumedAudience,
      marketingChannels: input.marketingChannels,
      sessionError,
      hasSession: !!sessionData?.session,
      userId: sessionData?.session?.user?.id,
    });
  }

  console.log("🤖 AI pipeline: invoking Supabase Edge Function generate-icps… (before invoke)");

  const { data, error } = await supabase.functions.invoke("generate-icps", {
    body: input,
  });

  console.log("🤖 AI pipeline: generate-icps invoke completed", { hasError: !!error, hasData: !!data });

  if (error) {
    console.error("❌ generate-icps function error:", error);
    throw new Error(
      `generate-icps failed: ${error.message || "Unknown error"}`
    );
  }

  const icps = (data?.icps || []).map(normalise);
  if (!icps.length) {
    throw new Error("generate-icps returned no icps.");
  }

  console.log("✅ AI pipeline: received icps =", icps.length);

  // Store for guest users (and as a fallback for results UI)
  try {
    if (icps?.length) {
      setLastGenerated(icps);
    }
  } catch (e) {
    console.warn("AI pipeline: could not store last generated ICPs", e);
  }
  return { icps };
}
