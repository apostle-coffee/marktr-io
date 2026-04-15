import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(resBody: unknown, status = 200) {
  return new Response(JSON.stringify(resBody), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
    },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRole =
      Deno.env.get("SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRole) {
      return json({ error: "Missing server env vars" }, 500);
    }

    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length).trim()
      : "";
    if (!token) return json({ error: "Missing authorization" }, 401);

    const supabaseAdmin = createClient(supabaseUrl, serviceRole);
    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);
    if (userError || !user?.id) return json({ error: "Unauthorized" }, 401);

    const { data: callerProfile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    if (callerProfile?.role !== "admin") return json({ error: "Forbidden" }, 403);

    const body = (await req.json().catch(() => ({}))) as {
      days?: number;
      limit?: number;
    };
    const days = Math.min(90, Math.max(1, Number(body?.days ?? 30)));
    const limit = Math.min(200, Math.max(10, Number(body?.limit ?? 50)));
    const sinceIso = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    const { data: events, error: eventsError } = await supabaseAdmin
      .from("openai_usage_events")
      .select(
        "id,feature,model,status,icp_id,related_id,input_tokens,output_tokens,total_tokens,reasoning_tokens,error_message,created_at,user_id"
      )
      .gte("created_at", sinceIso)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (eventsError) {
      return json({ error: "Failed to load usage events", details: eventsError.message }, 500);
    }

    const byFeature = new Map<string, { events: number; input: number; output: number; total: number }>();
    let totalInput = 0;
    let totalOutput = 0;
    let totalTokens = 0;
    let errorCount = 0;

    (events || []).forEach((ev: any) => {
      const feature = ev.feature || "unknown";
      const input = Number(ev.input_tokens || 0);
      const output = Number(ev.output_tokens || 0);
      const total = Number(ev.total_tokens || 0);
      totalInput += input;
      totalOutput += output;
      totalTokens += total;
      if (ev.status === "error") errorCount += 1;

      const bucket = byFeature.get(feature) || { events: 0, input: 0, output: 0, total: 0 };
      bucket.events += 1;
      bucket.input += input;
      bucket.output += output;
      bucket.total += total;
      byFeature.set(feature, bucket);
    });

    return json({
      ok: true,
      summary: {
        days,
        event_count: (events || []).length,
        error_count: errorCount,
        input_tokens: totalInput,
        output_tokens: totalOutput,
        total_tokens: totalTokens,
      },
      by_feature: Array.from(byFeature.entries()).map(([feature, stats]) => ({
        feature,
        ...stats,
      })),
      events: events || [],
    });
  } catch (err: any) {
    console.error("[admin-openai-usage] unexpected error", err);
    return json(
      { error: "Unexpected error", message: err?.message ?? "Unknown error" },
      500
    );
  }
});
