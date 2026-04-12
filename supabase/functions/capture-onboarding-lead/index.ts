// Supabase Edge Function: capture-onboarding-lead
// - Captures onboarding emails (with Cloudflare Turnstile verification for anon)
// - Supports "convert" intent for authenticated users (mark has_account=true)

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const turnstileSecret = Deno.env.get("TURNSTILE_SECRET_KEY") || "";

const supabase = createClient(supabaseUrl, serviceRoleKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: any, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });

type TurnstileVerifyResult = { ok: true } | { ok: false; errorCodes: string[] };

function clientIpFromRequest(req: Request): string | null {
  const cf = req.headers.get("cf-connecting-ip");
  if (cf?.trim()) return cf.trim();
  const xff = req.headers.get("x-forwarded-for");
  const first = xff?.split(",")[0]?.trim();
  return first || null;
}

async function verifyTurnstile(
  token: string | null | undefined,
  remoteip?: string | null,
): Promise<TurnstileVerifyResult> {
  if (!token) return { ok: false, errorCodes: ["missing-token"] };
  if (!turnstileSecret) return { ok: false, errorCodes: ["missing-secret"] };
  try {
    const form = new FormData();
    form.append("secret", turnstileSecret);
    form.append("response", token);
    if (remoteip) form.append("remoteip", remoteip);
    const resp = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
    });
    const data = await resp.json();
    if (data?.success) return { ok: true };
    const codes = Array.isArray(data?.["error-codes"]) ? data["error-codes"] : ["verification-failed"];
    console.error("capture-onboarding-lead: Turnstile siteverify failed", {
      errorCodes: codes,
      httpStatus: resp.status,
    });
    return { ok: false, errorCodes: codes };
  } catch {
    return { ok: false, errorCodes: ["turnstile-request-failed"] };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const body = await req.json();
    const emailRaw = body?.email ?? "";
    const intent = body?.intent === "convert" ? "convert" : "capture";
    const token = body?.token ?? null;
    const userIdFromBody = body?.userId ?? null;
    const metadata = body?.metadata ?? null;
    const source = body?.source ?? "onboarding";
    const nameRaw = body?.name ?? null;

    const email = (emailRaw as string).trim();
    if (!email) return json({ error: "Email is required" }, 400);
    let userId: string | null = null;

    if (intent === "convert") {
      // Require authenticated user; no Turnstile needed
      const authHeader = req.headers.get("Authorization") || "";
      const tokenParts = authHeader.split(" ");
      const accessToken = tokenParts.length === 2 ? tokenParts[1] : null;

      if (!accessToken) return json({ error: "Unauthorized" }, 401);

      const { data: userData, error: userErr } = await supabase.auth.getUser(accessToken);
      if (userErr || !userData?.user) return json({ error: "Unauthorized" }, 401);

      userId = userData.user.id;
      // If caller provided a userId, ensure it matches
      if (userIdFromBody && userIdFromBody !== userId) {
        return json({ error: "User mismatch" }, 403);
      }
    } else {
      // capture intent: require Turnstile (site token + server secret)
      if (!turnstileSecret) {
        console.error(
          "capture-onboarding-lead: TURNSTILE_SECRET_KEY is not set; refusing unverified lead capture",
        );
        return json(
          {
            error: "Server misconfiguration",
            code: "turnstile_secret_missing",
            hint: "Set TURNSTILE_SECRET_KEY on the Edge Function (Supabase Dashboard → Edge Functions → Secrets).",
          },
          503,
        );
      }
      if (!token) {
        return json({ error: "Turnstile token required", code: "turnstile_token_missing" }, 400);
      }
      const turnstileResult = await verifyTurnstile(token, clientIpFromRequest(req));
      if (!turnstileResult.ok) {
        return json(
          {
            error: "Turnstile verification failed",
            code: "turnstile_failed",
            errorCodes: turnstileResult.errorCodes,
            hint:
              "Check Cloudflare Turnstile widget hostnames include this origin, and TURNSTILE_SECRET_KEY matches the widget’s site key.",
          },
          400,
        );
      }
      userId = userIdFromBody; // optional for capture
    }

    const now = new Date().toISOString();
    const payload: any = {
      email,
      source,
      last_seen_at: now,
      updated_at: now,
      metadata,
    };

    if (typeof nameRaw === "string" && nameRaw.trim().length) {
      payload.name = nameRaw.trim();
    }

    if (userId) {
      payload.user_id = userId;
    }

    if (intent === "convert") {
      payload.has_account = true;
      payload.converted_at = now;
    }

    const { error } = await supabase
      .from("onboarding_leads")
      .upsert(payload, { onConflict: "email_normalized" });

    if (error) throw error;

    return json({ ok: true });
  } catch (err) {
    console.error("capture-onboarding-lead error", err);
    return json({ error: "Server error" }, 500);
  }
});
