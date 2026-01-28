// Supabase Edge Function: check-guest-checkout
// Deploy with: supabase functions deploy check-guest-checkout --no-verify-jwt

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type Input = {
  guest_ref: string;
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
    const supabaseServiceRoleKey = Deno.env.get("SERVICE_ROLE_KEY");
    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return json({ error: "Missing server env vars" }, 500);
    }

    const body = (await req.json()) as Input;
    if (!body?.guest_ref) {
      return json({ error: "Missing guest_ref" }, 400);
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
    const { data: guest, error: guestError } = await supabaseAdmin
      .from("guest_checkouts")
      .select("guest_ref,email,stripe_customer_id")
      .eq("guest_ref", body.guest_ref)
      .maybeSingle();

    if (guestError || !guest?.guest_ref) {
      return json({ error: "Guest checkout not found" }, 404);
    }

    const email = guest.email ?? null;
    let userExists = false;
    let linkedUserId: string | null = null;

    if (email) {
      const { data: userData } = await supabaseAdmin.auth.admin.getUserByEmail(
        email
      );
      if (userData?.user?.id) userExists = true;
    }

    if (guest.stripe_customer_id) {
      const { data: existing } = await supabaseAdmin
        .from("stripe_customers")
        .select("user_id")
        .eq("stripe_customer_id", guest.stripe_customer_id)
        .maybeSingle();
      linkedUserId = existing?.user_id ?? null;
    }

    return json({
      email,
      guest_ref: guest.guest_ref,
      user_exists: userExists,
      linked_user_id: linkedUserId,
    });
  } catch (err: any) {
    console.error("[check-guest-checkout] error", err);
    return json(
      {
        error: "Request failed",
        message: err?.message ?? "Unknown error",
      },
      500
    );
  }
});
