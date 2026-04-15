import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const PROMPT_VERSION = "meta_activation_pack_v1";
const MODEL = "gpt-5.2";
const MAX_PACKS_PER_ICP = 10;

type GenerateInput = {
  icpId: string;
  strategyId?: string | null;
  goal?: string | null;
  packName?: string | null;
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

function list(value: unknown): string {
  return Array.isArray(value) && value.length ? value.join("; ") : "Not provided";
}

function buildPrompt(icp: Record<string, unknown>, brand: Record<string, unknown> | null, strategy: any, input: GenerateInput) {
  return `
You are a senior performance marketer specialising in Meta Ads (Facebook/Instagram). Use UK English.
Return STRICT JSON ONLY. No markdown. Keep everything practical and implementable.

You are creating a "Meta Activation Pack" that helps a business:
1) build Custom Audiences in Meta Ads Manager,
2) prepare better Lookalike seed data from first-party data,
3) map messaging and creatives to funnel stages,
4) follow a 30-day activation roadmap.

CRITICAL POLICY RULES:
- Do NOT claim direct API creation of Meta audiences.
- Do NOT infer or target sensitive traits (health, financial status, housing, employment, ethnicity, religion, sexuality, etc.).
- Include clear compliance notes about consent and lawful data use.
- Keep recommendations consistent with Meta audience workflows.

ICP context:
- Name: ${icp.name || "Not provided"}
- Description: ${icp.description || "Not provided"}
- Industry: ${icp.industry || "Not provided"}
- Company size: ${icp.company_size || "Not provided"}
- Location: ${icp.location || "Not provided"}
- Budget: ${icp.budget || "Not provided"}
- Goals: ${list(icp.goals)}
- Pain points: ${list(icp.pain_points)}
- Decision makers: ${list(icp.decision_makers)}
- Tech stack: ${list(icp.tech_stack)}
- Challenges: ${list(icp.challenges)}
- Opportunities: ${list(icp.opportunities)}

Brand context:
- Name: ${brand?.name || "Not provided"}
- Description: ${brand?.business_description || "Not provided"}
- Product/service: ${brand?.product_or_service || "Not provided"}
- Existing channels: ${list(brand?.marketing_channels)}
- Audience assumptions: ${list(brand?.assumed_audience)}
- Country: ${brand?.country || "Not provided"}

Optional strategy context:
- Positioning one-liner: ${strategy?.positioning?.one_liner || "Not provided"}
- Value props: ${list(strategy?.messaging?.value_props)}
- Campaign ideas: ${list(strategy?.campaign_ideas?.map((x: any) => x?.name).filter(Boolean))}

Activation objective:
- Goal: ${input.goal || "Generate a practical Meta activation plan"}

Output requirements:
- audience_plan: 6-10 practical audience recipes across mixed source types where possible.
- seed_quality: specific qualification rules for high-quality lookalike seeds.
- lookalike_plan: explicit tiering (1%, 2%, 3-5%).
- messaging_matrix: at least 5 rows tied to funnel stages.
- roadmap_30d: 4 weekly phases with action checklists.
- compliance_notes: concise mandatory warnings.
`;
}

const RESPONSE_SCHEMA = {
  name: "meta_activation_pack",
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      audience_plan: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            audience_name: { type: "string" },
            source_type: { type: "string" },
            build_rule: { type: "string" },
            retention_window: { type: "string" },
            use_case: { type: "string" },
            exclusions: { type: "array", items: { type: "string" } },
          },
          required: [
            "audience_name",
            "source_type",
            "build_rule",
            "retention_window",
            "use_case",
            "exclusions",
          ],
        },
      },
      seed_quality: {
        type: "object",
        additionalProperties: false,
        properties: {
          primary_seed_definition: { type: "string" },
          fallback_seed_definition: { type: "string" },
          minimum_size: { type: "string" },
          recommended_size: { type: "string" },
          data_quality_checklist: { type: "array", items: { type: "string" } },
          do_not_use_cohorts: { type: "array", items: { type: "string" } },
        },
        required: [
          "primary_seed_definition",
          "fallback_seed_definition",
          "minimum_size",
          "recommended_size",
          "data_quality_checklist",
          "do_not_use_cohorts",
        ],
      },
      lookalike_plan: {
        type: "object",
        additionalProperties: false,
        properties: {
          source_audiences: { type: "array", items: { type: "string" } },
          tier_recommendations: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                tier_name: { type: "string" },
                percentage: { type: "string" },
                use_case: { type: "string" },
              },
              required: ["tier_name", "percentage", "use_case"],
            },
          },
          stacking_strategy: { type: "string" },
          mandatory_exclusions: { type: "array", items: { type: "string" } },
          location_note: { type: "string" },
        },
        required: [
          "source_audiences",
          "tier_recommendations",
          "stacking_strategy",
          "mandatory_exclusions",
          "location_note",
        ],
      },
      messaging_matrix: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            audience: { type: "string" },
            funnel_stage: { type: "string" },
            awareness_level: { type: "string" },
            pain_angle: { type: "string" },
            promise_angle: { type: "string" },
            primary_cta: { type: "string" },
            proof_type: { type: "string" },
            creative_format: { type: "string" },
          },
          required: [
            "audience",
            "funnel_stage",
            "awareness_level",
            "pain_angle",
            "promise_angle",
            "primary_cta",
            "proof_type",
            "creative_format",
          ],
        },
      },
      roadmap_30d: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            week: { type: "string" },
            focus: { type: "string" },
            tasks: { type: "array", items: { type: "string" } },
            checkpoint: { type: "string" },
            decision_rule: { type: "string" },
          },
          required: ["week", "focus", "tasks", "checkpoint", "decision_rule"],
        },
      },
      compliance_notes: { type: "array", items: { type: "string" } },
    },
    required: [
      "audience_plan",
      "seed_quality",
      "lookalike_plan",
      "messaging_matrix",
      "roadmap_30d",
      "compliance_notes",
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
    const openAiKey = Deno.env.get("OPENAI_API_KEY");
    if (!supabaseUrl || !supabaseAnonKey || !openAiKey) {
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
    if (!body?.icpId) {
      return json({ error: "icpId is required" }, 400);
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
      .from("icp_meta_activation_packs")
      .select("id", { count: "exact", head: true })
      .eq("icp_id", body.icpId)
      .eq("user_id", user.id);
    if (countError) {
      return json({ error: "Failed to count existing packs", details: countError.message }, 500);
    }
    if ((existingCount ?? 0) >= MAX_PACKS_PER_ICP) {
      return json({ error: `You can save up to ${MAX_PACKS_PER_ICP} Meta activation packs per ICP.` }, 400);
    }

    let brand: Record<string, unknown> | null = null;
    if ((icp as any)?.brand_id) {
      const { data: brandData } = await supabase
        .from("brands")
        .select("*")
        .eq("id", (icp as any).brand_id)
        .eq("user_id", user.id)
        .maybeSingle();
      brand = (brandData as Record<string, unknown> | null) ?? null;
    }

    let strategy: any = null;
    if (body.strategyId) {
      const { data: strategyData } = await supabase
        .from("icp_strategies")
        .select("id, strategy")
        .eq("id", body.strategyId)
        .eq("icp_id", body.icpId)
        .eq("user_id", user.id)
        .maybeSingle();
      strategy = strategyData?.strategy ?? null;
    }

    const prompt = buildPrompt(icp as Record<string, unknown>, brand, strategy, body as GenerateInput);
    const resp = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAiKey}`,
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
      return json({ error: "OpenAI call failed", status: resp.status, details: errText }, 500);
    }

    const aiData = await resp.json();
    const outputText =
      aiData?.output_text ??
      aiData?.output?.[0]?.content?.[0]?.text ??
      aiData?.output?.[0]?.content?.[0]?.value ??
      "";

    let parsed: unknown = null;
    try {
      parsed = JSON.parse(outputText);
    } catch {
      const match = String(outputText).match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
    }
    if (!parsed) {
      return json({ error: "Model response did not contain valid JSON", raw: outputText }, 500);
    }

    const now = new Date().toISOString();
    const row = {
      icp_id: body.icpId,
      user_id: user.id,
      strategy_id: body.strategyId ?? null,
      pack_name: body.packName?.trim() || `Meta Activation Pack ${(existingCount ?? 0) + 1}`,
      goal: body.goal ?? null,
      pack_json: parsed,
      prompt_version: PROMPT_VERSION,
      model: MODEL,
      created_at: now,
      updated_at: now,
    };

    const { data: saved, error: saveError } = await supabase
      .from("icp_meta_activation_packs")
      .insert(row)
      .select("*")
      .single();
    if (saveError) {
      return json({ error: "Failed to save Meta activation pack", details: saveError.message }, 500);
    }

    return json({ record: saved, pack: parsed, prompt_version: PROMPT_VERSION, model: MODEL });
  } catch (err) {
    return json({ error: "Unhandled error", message: String(err) }, 500);
  }
});
