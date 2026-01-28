import { supabase } from "../config/supabase";

/**
 * Best-effort lead capture for onboarding emails via Edge Function (service role).
 * Requires Turnstile token for anonymous users; logged-in users can pass userId without token.
 */
export async function upsertOnboardingLead(
  email: string,
  opts?: { source?: string; userId?: string | null; token?: string | null; metadata?: Record<string, any>; name?: string | null }
) {
  const trimmed = email?.trim();
  if (!trimmed) return;

  try {
    const payload: any = {
      email: trimmed,
      source: opts?.source || "onboarding",
      token: opts?.token ?? null,
      metadata: opts?.metadata ?? null,
    };

    if (opts?.userId) {
      payload.userId = opts.userId;
    }

    if (typeof opts?.name === "string" && opts.name.trim().length) {
      payload.name = opts.name.trim();
    }

    const { error } = await supabase.functions.invoke("capture-onboarding-lead", {
      body: payload,
    });
    if (error) throw error;
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn("[leadCapture] upsert lead failed", err);
    }
  }
}

/**
 * Mark a lead as converted when a user account exists (service role Edge Function).
 */
export async function markLeadConverted(email: string | null | undefined, userId: string | null | undefined) {
  if (!email || !userId) return;
  try {
    const { error } = await supabase.functions.invoke("capture-onboarding-lead", {
      body: {
        email,
        userId,
        intent: "convert",
      },
    });
    if (error) throw error;
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn("[leadCapture] mark converted failed", err);
    }
  }
}
