// Supabase Edge Function: link-guest-checkout
// Deploy with: supabase functions deploy link-guest-checkout

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

Deno.serve(async (req) => {
  const preflight = corsPreflight(req);
  if (preflight) return preflight;

  try {
    if (req.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const supabaseServiceRoleKey = Deno.env.get("SERVICE_ROLE_KEY");
    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
      return json({ error: "Missing server env vars" }, 500);
    }

    const body = (await req.json()) as Input;
    const guestRef = body?.guest_ref?.trim() || null;
    const sessionId = body?.session_id?.trim() || null;
    if (!guestRef && !sessionId) {
      return json({ error: "Missing guest_ref or session_id" }, 400);
    }

    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) {
      return json({ error: "Missing authorization" }, 401);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user?.id) {
      return json({ error: "Unauthorized" }, 401);
    }

    // Ensure a profile row exists for this user (safe no-op if it already exists)
    await supabaseAdmin.from("profiles").upsert(
      {
        id: user.id,
        subscription_tier: "free",
      },
      { onConflict: "id" }
    );

    const selectFields =
      "guest_ref,session_id,email,stripe_customer_id,stripe_subscription_id,price_id,status,linked_user_id";

    let guest = null;
    let guestError = null;

    if (sessionId) {
      const { data, error } = await supabaseAdmin
        .from("guest_checkouts")
        .select(selectFields)
        .eq("session_id", sessionId)
        .maybeSingle();
      guest = data;
      guestError = error;
    }

    if (!guest && !guestError && guestRef) {
      const { data, error } = await supabaseAdmin
        .from("guest_checkouts")
        .select(selectFields)
        .eq("guest_ref", guestRef)
        .maybeSingle();
      guest = data;
      guestError = error;
    }

    if (guestError || !guest?.guest_ref) {
      return json({ error: "Guest checkout not found" }, 404);
    }

    if (guest.linked_user_id && guest.linked_user_id === user.id) {
      return json({ ok: true, alreadyLinked: true });
    }

    if (guest.linked_user_id && guest.linked_user_id !== user.id) {
      return json({ error: "Guest checkout already linked" }, 409);
    }

    if (guest.stripe_customer_id) {
      await supabaseAdmin.from("stripe_customers").upsert(
        {
          user_id: user.id,
          stripe_customer_id: guest.stripe_customer_id,
        },
        { onConflict: "user_id" }
      );
    }

    if (guest.stripe_subscription_id) {
      const nowIso = new Date().toISOString();
      await supabaseAdmin.from("stripe_subscriptions").upsert(
        {
          user_id: user.id,
          stripe_subscription_id: guest.stripe_subscription_id,
          stripe_customer_id: guest.stripe_customer_id ?? null,
          price_id: guest.price_id ?? null,
          status: guest.status ?? null,
          updated_at: nowIso,
        },
        { onConflict: "stripe_subscription_id" }
      );

      const isPro =
        guest.status === "trialing" || guest.status === "active";
      await supabaseAdmin
        .from("profiles")
        .update({ subscription_tier: isPro ? "pro" : "free" })
        .eq("id", user.id);
    }

    try {
      await supabaseAdmin
        .from("guest_checkouts")
        .update({ linked_user_id: user.id })
        .eq("guest_ref", guest.guest_ref);
    } catch {
      // best-effort
    }

    return json({ ok: true, linked: true });
  } catch (err: any) {
    console.error("[link-guest-checkout] error", err);
    return json(
      {
        error: "Request failed",
        message: err?.message ?? "Unknown error",
      },
      500
    );
  }
});
