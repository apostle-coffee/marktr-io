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
      userId?: string | null;
    };
    const days = Math.min(90, Math.max(1, Number(body?.days ?? 30)));
    const limit = Math.min(200, Math.max(10, Number(body?.limit ?? 50)));
    const filterUserId =
      typeof body?.userId === "string" && body.userId.trim().length ? body.userId.trim() : null;
    const sinceIso = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    const { data: aggRaw, error: aggError } = await supabaseAdmin.rpc(
      "admin_openai_usage_aggregate",
      { since_ts: sinceIso, filter_user_id: filterUserId }
    );

    if (aggError) {
      return json(
        {
          error: "Failed to aggregate usage",
          details: aggError.message,
          hint: "Apply migration 20260415220000_admin_openai_usage_aggregate.sql and grant execute to service_role.",
        },
        500
      );
    }

    const agg = (aggRaw ?? {}) as {
      totals?: Record<string, unknown>;
      by_feature?: unknown[];
    };

    const totals = agg.totals ?? {};
    const systemSummary = {
      days,
      filter_user_id: filterUserId,
      event_count: Number(totals.event_count ?? 0),
      error_count: Number(totals.error_count ?? 0),
      input_tokens: Number(totals.input_tokens ?? 0),
      output_tokens: Number(totals.output_tokens ?? 0),
      total_tokens: Number(totals.total_tokens ?? 0),
    };

    const systemByFeature = Array.isArray(agg.by_feature)
      ? (agg.by_feature as Record<string, unknown>[]).map((row) => ({
          feature: String(row.feature ?? "unknown"),
          events: Number(row.events ?? 0),
          input: Number(row.input ?? 0),
          output: Number(row.output ?? 0),
          total: Number(row.total ?? 0),
        }))
      : [];

    let eventsQuery = supabaseAdmin
      .from("openai_usage_events")
      .select(
        "id,feature,model,status,icp_id,related_id,input_tokens,output_tokens,total_tokens,reasoning_tokens,error_message,created_at,user_id"
      )
      .gte("created_at", sinceIso)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (filterUserId) {
      eventsQuery = eventsQuery.eq("user_id", filterUserId);
    }

    const { data: events, error: eventsError } = await eventsQuery;

    if (eventsError) {
      return json({ error: "Failed to load recent usage events", details: eventsError.message }, 500);
    }

    return json({
      ok: true,
      summary: systemSummary,
      by_feature: systemByFeature,
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
