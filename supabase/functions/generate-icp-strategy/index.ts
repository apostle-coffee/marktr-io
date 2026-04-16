// Supabase Edge Function: generate-icp-strategy
// Deploy with: supabase functions deploy generate-icp-strategy
// Set secret with: supabase secrets set OPENAI_API_KEY=sk-...
//
// Generates a marketing strategy for a specific ICP and inserts into icp_strategies.

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const PROMPT_VERSION = "icp_strategy_v2_brand_context";
const MODEL = "gpt-5.2";
const MAX_ICP_STRATEGIES = 10;
const MONTHLY_SPEND_CAP_GBP = Number(Deno.env.get("OPENAI_MONTHLY_SPEND_CAP_GBP") ?? "7.5");
const GBP_TO_USD_RATE = Number(Deno.env.get("OPENAI_GBP_USD_RATE") ?? "1.28");
const MONTHLY_SPEND_CAP_USD = MONTHLY_SPEND_CAP_GBP * GBP_TO_USD_RATE;

const MODEL_PRICING_USD_PER_MILLION: Record<string, { input: number; output: number }> = {
  "gpt-5.4": { input: 2.5, output: 15 },
  "gpt-5.4-mini": { input: 0.75, output: 4.5 },
  "gpt-5.4-nano": { input: 0.2, output: 1.25 },
  "gpt-5.2": { input: 1.75, output: 14 },
  "gpt-5.1": { input: 1.25, output: 10 },
  "gpt-5": { input: 1.25, output: 10 },
  "gpt-5-mini": { input: 0.25, output: 2 },
  "gpt-5-nano": { input: 0.05, output: 0.4 },
  "gpt-4.1": { input: 2, output: 8 },
  "gpt-4.1-mini": { input: 0.4, output: 1.6 },
  "gpt-4.1-nano": { input: 0.1, output: 0.4 },
  "gpt-4o": { input: 2.5, output: 10 },
  "gpt-4o-mini": { input: 0.15, output: 0.6 },
  o3: { input: 2, output: 8 },
  "o4-mini": { input: 1.1, output: 4.4 },
};

function estimateCostUsd(modelRaw: unknown, inputTokensRaw: unknown, outputTokensRaw: unknown): number {
  const model = String(modelRaw || "").toLowerCase();
  const pricing = MODEL_PRICING_USD_PER_MILLION[model];
  if (!pricing) return 0;
  const inputTokens = Number(inputTokensRaw || 0);
  const outputTokens = Number(outputTokensRaw || 0);
  return (
    (Math.max(0, inputTokens) * pricing.input) / 1_000_000 +
    (Math.max(0, outputTokens) * pricing.output) / 1_000_000
  );
}

async function getMonthlyUsageSpendUsd(
  supabase: ReturnType<typeof createClient>,
  userId: string
): Promise<{ spendUsd: number; error?: string }> {
  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("openai_usage_events")
    .select("model,input_tokens,output_tokens,created_at")
    .eq("user_id", userId)
    .gte("created_at", monthStart.toISOString())
    .limit(10000);

  if (error) {
    return { spendUsd: 0, error: error.message };
  }

  const spendUsd = ((data as any[]) || []).reduce(
    (sum, row) => sum + estimateCostUsd(row?.model, row?.input_tokens, row?.output_tokens),
    0
  );

  return { spendUsd };
}

function extractUsage(data: any) {
  return {
    responseId: data?.id ?? null,
    inputTokens: data?.usage?.input_tokens ?? null,
    outputTokens: data?.usage?.output_tokens ?? null,
    totalTokens: data?.usage?.total_tokens ?? null,
    reasoningTokens: data?.usage?.output_tokens_details?.reasoning_tokens ?? null,
  };
}

async function logOpenAiUsage(
  supabase: ReturnType<typeof createClient>,
  payload: {
    userId: string;
    icpId: string;
    relatedId?: string | null;
    status: "success" | "error";
    responseId?: string | null;
    inputTokens?: number | null;
    outputTokens?: number | null;
    totalTokens?: number | null;
    reasoningTokens?: number | null;
    errorMessage?: string | null;
  }
) {
  const { error } = await supabase.from("openai_usage_events").insert({
    user_id: payload.userId,
    feature: "generate_icp_strategy",
    model: MODEL,
    status: payload.status,
    icp_id: payload.icpId,
    related_id: payload.relatedId ?? null,
    response_id: payload.responseId ?? null,
    input_tokens: payload.inputTokens ?? null,
    output_tokens: payload.outputTokens ?? null,
    total_tokens: payload.totalTokens ?? null,
    reasoning_tokens: payload.reasoningTokens ?? null,
    error_message: payload.errorMessage ?? null,
  });
  if (error) {
    console.warn("logOpenAiUsage failed", error.message);
  }
}

type GenerateInput = {
  icpId: string;
  goal: string;
  channel?: string | null;
  offerType?: string | null;
  tone?: string | null;
  businessStage?: string | null;
  monthlyBudgetBand?: string | null;
  objectiveHorizon?: string | null;
  marketingCapacity?: string | null;
};

function json(resBody: unknown, status = 200) {
  return new Response(JSON.stringify(resBody), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
    },
  });
}

function corsPreflight(req: Request) {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }
  return null;
}

function buildPrompt(icp: Record<string, any>, brand: Record<string, any> | null, input: GenerateInput) {
  const list = (arr: unknown) =>
    Array.isArray(arr) && arr.length ? arr.join("; ") : "Not provided";

  return `
You are a senior marketing strategist. Use UK English. Be concise and practical.
Do not invent company-specific facts. If details are missing, use plausible but generic examples.
Return STRICT JSON ONLY that matches the given schema. No markdown.

ICP context:
- Name: ${icp.name || "Not provided"}
- Description: ${icp.description || "Not provided"}
- Industry: ${icp.industry || "Not provided"}
- Company size: ${icp.company_size || "Not provided"}
- Location: ${icp.location || "Not provided"}
- Goals: ${list(icp.goals)}
- Pain points: ${list(icp.pain_points)}
- Budget: ${icp.budget || "Not provided"}
- Decision makers: ${list(icp.decision_makers)}
- Tech stack: ${list(icp.tech_stack)}
- Challenges: ${list(icp.challenges)}
- Opportunities: ${list(icp.opportunities)}

Brand context (if available):
- Brand name: ${brand?.name || "Not provided"}
- Brand description: ${brand?.business_description || "Not provided"}
- Product/service: ${brand?.product_or_service || "Not provided"}
- Business type: ${brand?.business_type || "Not provided"}
- Assumed audience: ${list(brand?.assumed_audience)}
- Existing channels: ${list(brand?.marketing_channels)}
- Country: ${brand?.country || "Not provided"}
- Region/city: ${brand?.region_or_city || "Not provided"}
- Currency: ${brand?.currency || "Not provided"}

Strategy inputs:
- Goal (required): ${input.goal}
- Preferred channel: ${input.channel || "No preference"}
- Offer type: ${input.offerType || "No preference"}
- Tone: ${input.tone || "No preference"}
- Business stage / size: ${input.businessStage || "Not specified"}
- Monthly marketing budget band: ${input.monthlyBudgetBand || "Not specified"}
- Objective horizon: ${input.objectiveHorizon || "Not specified"}
- Weekly marketing capacity: ${input.marketingCapacity || "Not specified"}

Rules:
- Keep outputs short and actionable.
- Avoid jargon and hype.
- Provide 3–5 items per list where possible.
- Prioritise recommendations that can realistically be executed within the stated budget and capacity.
`;
}

const RESPONSE_SCHEMA = {
  name: "icp_strategy",
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      positioning: {
        type: "object",
        additionalProperties: false,
        properties: {
          one_liner: { type: "string" },
          why_us: { type: "string" },
          differentiators: { type: "array", items: { type: "string" } },
        },
        required: ["one_liner", "why_us", "differentiators"],
      },
      messaging: {
        type: "object",
        additionalProperties: false,
        properties: {
          value_props: { type: "array", items: { type: "string" } },
          pain_to_promise: { type: "array", items: { type: "string" } },
          objections_and_rebuttals: { type: "array", items: { type: "string" } },
        },
        required: ["value_props", "pain_to_promise", "objections_and_rebuttals"],
      },
      campaign_ideas: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            name: { type: "string" },
            hook: { type: "string" },
            angle: { type: "string" },
            cta: { type: "string" },
          },
          required: ["name", "hook", "angle", "cta"],
        },
      },
      channel_plan: {
        type: "object",
        additionalProperties: false,
        properties: {
          primary_channel: { type: "string" },
          secondary_channels: { type: "array", items: { type: "string" } },
          first_14_days: { type: "array", items: { type: "string" } },
        },
        required: ["primary_channel", "secondary_channels", "first_14_days"],
      },
      offer: {
        type: "object",
        additionalProperties: false,
        properties: {
          recommended_offer: { type: "string" },
          lead_magnet_idea: { anyOf: [{ type: "string" }, { type: "null" }] },
          landing_page_sections: { type: "array", items: { type: "string" } },
        },
        required: ["recommended_offer", "lead_magnet_idea", "landing_page_sections"],
      },
      ad_assets: {
        anyOf: [
          {
            type: "object",
            additionalProperties: false,
            properties: {
              headlines: { type: "array", items: { type: "string" } },
              primary_texts: { type: "array", items: { type: "string" } },
              creative_briefs: { type: "array", items: { type: "string" } },
            },
            required: ["headlines", "primary_texts", "creative_briefs"],
          },
          { type: "null" },
        ],
      },
      success_metrics: {
        type: "object",
        additionalProperties: false,
        properties: {
          kpis: { type: "array", items: { type: "string" } },
          targets: { type: "array", items: { type: "string" } },
        },
        required: ["kpis", "targets"],
      },
    },
    required: [
      "positioning",
      "messaging",
      "campaign_ideas",
      "channel_plan",
      "offer",
      "ad_assets",
      "success_metrics",
    ],
  },
  strict: true,
};

Deno.serve(async (req) => {
  const preflight = corsPreflight(req);
  if (preflight) return preflight;

  try {
    if (req.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const apiKey = Deno.env.get("OPENAI_API_KEY");

    if (!supabaseUrl || !supabaseAnonKey || !apiKey) {
      return json({ error: "Missing server env vars" }, 500);
    }

    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) {
      return json({ error: "Missing or invalid Authorization header" }, 401);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return json({ error: "Unauthenticated" }, 401);
    }

    const body = (await req.json()) as Partial<GenerateInput>;
    if (!body?.icpId || !body?.goal) {
      return json({ error: "icpId and goal are required" }, 400);
    }

    const { data: icp, error: icpError } = await supabase
      .from("icps")
      .select("*")
      .eq("id", body.icpId)
      .eq("user_id", user.id)
      .single();

    if (icpError || !icp) {
      return json({ error: "ICP not found" }, 404);
    }

    const { count: existingCount, error: countError } = await supabase
      .from("icp_strategies")
      .select("id", { count: "exact", head: true })
      .eq("icp_id", body.icpId)
      .eq("user_id", user.id);

    if (countError) {
      return json({ error: "Failed to count existing strategies", details: countError.message }, 500);
    }

    if ((existingCount ?? 0) >= MAX_ICP_STRATEGIES) {
      return json(
        { error: `You can save up to ${MAX_ICP_STRATEGIES} strategies per ICP.` },
        400
      );
    }

    let brand: Record<string, any> | null = null;
    if (icp?.brand_id) {
      const { data: brandData } = await supabase
        .from("brands")
        .select("*")
        .eq("id", icp.brand_id)
        .eq("user_id", user.id)
        .maybeSingle();
      brand = brandData || null;
    }

    const monthlyUsage = await getMonthlyUsageSpendUsd(supabase, user.id);
    if (monthlyUsage.error) {
      return json({ error: "Failed to check monthly usage cap", details: monthlyUsage.error }, 500);
    }
    if (monthlyUsage.spendUsd >= MONTHLY_SPEND_CAP_USD) {
      await logOpenAiUsage(supabase, {
        userId: user.id,
        icpId: body.icpId,
        status: "error",
        errorMessage:
          `Monthly AI usage cap reached (GBP ${MONTHLY_SPEND_CAP_GBP.toFixed(2)} / USD ${MONTHLY_SPEND_CAP_USD.toFixed(2)}).`,
      });
      return json(
        {
          error:
            `Monthly AI usage cap reached for this account (£${MONTHLY_SPEND_CAP_GBP.toFixed(2)}). Please contact support to increase your limit.`,
        },
        402
      );
    }

    const prompt = buildPrompt(icp, brand, body as GenerateInput);

    const resp = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        input: prompt,
        text: {
          format: {
            type: "json_schema",
            name: PROMPT_VERSION,
            schema: RESPONSE_SCHEMA.schema,
            strict: true,
          },
        },
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error("OpenAI error", resp.status, errText);
      await logOpenAiUsage(supabase, {
        userId: user.id,
        icpId: body.icpId,
        status: "error",
        errorMessage: `OpenAI ${resp.status}: ${errText.slice(0, 1000)}`,
      });
      return json({ error: "OpenAI call failed", status: resp.status, details: errText }, 500);
    }

    const data = await resp.json();
    const usage = extractUsage(data);
    const outputText =
      data?.output_text ??
      data?.output?.[0]?.content?.[0]?.text ??
      data?.output?.[0]?.content?.[0]?.value ??
      "";

    let parsed: any = null;
    try {
      parsed = JSON.parse(outputText);
    } catch {
      const match = String(outputText).match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
    }

    if (!parsed) {
      return json({ error: "Model response did not contain valid JSON.", raw: outputText }, 500);
    }

    const now = new Date().toISOString();
    const row = {
      icp_id: body.icpId,
      user_id: user.id,
      strategy_name: `Strategy ${(existingCount ?? 0) + 1}`,
      goal: body.goal,
      channel: body.channel ?? null,
      offer_type: body.offerType ?? null,
      tone: body.tone ?? null,
      strategy: parsed,
      prompt_version: PROMPT_VERSION,
      model: MODEL,
      created_at: now,
      updated_at: now,
    };

    const { data: saved, error: saveError } = await supabase
      .from("icp_strategies")
      .insert(row)
      .select()
      .single();

    if (saveError) {
      await logOpenAiUsage(supabase, {
        userId: user.id,
        icpId: body.icpId,
        status: "error",
        responseId: usage.responseId,
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.totalTokens,
        reasoningTokens: usage.reasoningTokens,
        errorMessage: `Failed to save strategy: ${saveError.message}`,
      });
      return json({ error: "Failed to save strategy", details: saveError.message }, 500);
    }

    await logOpenAiUsage(supabase, {
      userId: user.id,
      icpId: body.icpId,
      relatedId: saved?.id ?? null,
      status: "success",
      responseId: usage.responseId,
      inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens,
      totalTokens: usage.totalTokens,
      reasoningTokens: usage.reasoningTokens,
    });

    return json({
      strategy: parsed,
      prompt_version: PROMPT_VERSION,
      model: MODEL,
      record: saved,
    });
  } catch (err) {
    return json({ error: "Unhandled error", message: String(err) }, 500);
  }
});
