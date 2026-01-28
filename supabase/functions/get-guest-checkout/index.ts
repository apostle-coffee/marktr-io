// Supabase Edge Function: get-guest-checkout
// Deploy with: supabase functions deploy get-guest-checkout --no-verify-jwt

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type Input = {
  guest_ref?: string;
  session_id?: string;
};

function json(resBody: unknown, status = 200) {
  return new Response(JSON.stringify(resBody), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    },
  });
}

function corsPreflight(req: Request) {
  if (req.method === "OPTIONS") return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" } });
  return null;
}

Deno.serve(async (req) => {
  const preflight = corsPreflight(req);
  if (preflight) return preflight;

  try {
    if (req.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceRoleKey = Deno.env.get("SERVICE_ROLE_KEY");

    // Log env presence (not values) to diagnose 500s fast
    console.log("[get-guest-checkout] env", {
      hasSupabaseUrl: Boolean(supabaseUrl),
      hasServiceRoleKey: Boolean(supabaseServiceRoleKey),
    });

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return json({ error: "Missing server env vars" }, 500);
    }

    const body = (await req.json()) as Input;
    const guest_ref = body?.guest_ref ?? null;
    const session_id = body?.session_id ?? null;

    console.log("[get-guest-checkout] input", {
      hasGuestRef: Boolean(guest_ref),
      hasSessionId: Boolean(session_id),
    });

    if (!guest_ref && !session_id) {
      return json({ error: "Missing guest_ref or session_id" }, 400);
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
    const filters: string[] = [];
    if (guest_ref) filters.push(`guest_ref.eq.${guest_ref}`);
    if (session_id) filters.push(`session_id.eq.${session_id}`);

    const { data, error } = await supabaseAdmin
      .from("guest_checkouts")
      .select("*")
      .or(filters.join(","))
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      if ((error as any)?.message?.includes?.("session_id")) {
        return json({ error: "session_id lookup not supported" }, 400);
      }
      console.error("[get-guest-checkout] db error", error);
      return json({ error: "Database error", message: error.message }, 500);
    }

    if (!data) {
      return json({ found: false }, 404);
    }

    return json({ found: true, checkout: data });
  } catch (err: any) {
    console.error("[get-guest-checkout] unexpected error", err);
    return json(
      { error: "Unexpected error", message: err?.message ?? "Unknown error" },
      500
    );
  }
});
