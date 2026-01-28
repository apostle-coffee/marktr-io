// Supabase Edge Function: create-checkout-session
// Deploy with: supabase functions deploy create-checkout-session
// Set secrets with:
//   supabase secrets set STRIPE_SECRET_KEY=sk_... SUPABASE_URL=... SUPABASE_ANON_KEY=...

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "https://esm.sh/stripe@12.18.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type CreateCheckoutInput = {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
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
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey || !stripeKey) {
      return json({ error: "Missing server env vars" }, 500);
    }

    const body = (await req.json()) as CreateCheckoutInput;
    if (!body?.priceId || !body?.successUrl || !body?.cancelUrl) {
      return json({ error: "Missing required fields" }, 400);
    }

    const authHeader = req.headers.get("Authorization") ?? "";
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

    let user: { id: string; email?: string | null } | null = null;
    if (authHeader.startsWith("Bearer ")) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } },
      });
      const {
        data: { user: authUser },
        error: userError,
      } = await supabase.auth.getUser();
      if (!userError && authUser?.id) {
        user = authUser;
      }
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const guestRef = crypto.randomUUID();

    const successUrl = (() => {
      try {
        const url = new URL(body.successUrl);
        if (!user?.id && !url.searchParams.get("guest_ref")) {
          url.searchParams.set("guest_ref", guestRef);
        }
        if (!url.searchParams.get("session_id")) {
          url.searchParams.set("session_id", "{CHECKOUT_SESSION_ID}");
        }
        return url.toString();
      } catch {
        const joiner = body.successUrl.includes("?") ? "&" : "?";
        const guestPart = user?.id
          ? ""
          : `guest_ref=${encodeURIComponent(guestRef)}&`;
        return `${body.successUrl}${joiner}${guestPart}session_id={CHECKOUT_SESSION_ID}`;
      }
    })();

    let stripeCustomerId: string | null = null;

    if (user?.id) {
      const { data: existingCustomer, error: existingCustomerError } = await supabaseAdmin
        .from("stripe_customers")
        .select("stripe_customer_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingCustomerError) {
        return json({ error: "Failed to load Stripe customer mapping" }, 500);
      }

      if (existingCustomer?.stripe_customer_id) {
        stripeCustomerId = existingCustomer.stripe_customer_id;

        try {
          await stripe.customers.retrieve(stripeCustomerId);
        } catch (err: any) {
          const code = err?.code;
          const message = err?.message || "";
          const isMissing =
            code === "resource_missing" ||
            message.toLowerCase().includes("no such customer");

          if (isMissing) {
            try {
              await supabaseAdmin
                .from("stripe_customers")
                .delete()
                .eq("user_id", user.id);
            } catch {
              // ignore delete errors; we will overwrite with upsert
            }
            stripeCustomerId = null;
          } else {
            throw err;
          }
        }
      }
    }

    if (user?.id && !stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        metadata: { user_id: user.id },
      });
      stripeCustomerId = customer.id;

      const { error: insertError } = await supabaseAdmin
        .from("stripe_customers")
        .upsert(
          {
            user_id: user.id,
            stripe_customer_id: stripeCustomerId,
          },
          { onConflict: "user_id" }
        );

      if (insertError) {
        return json({ error: "Failed to store Stripe customer" }, 500);
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      ...(stripeCustomerId ? { customer: stripeCustomerId } : {}),
      ...(!stripeCustomerId && body.customerEmail
        ? { customer_email: body.customerEmail }
        : {}),
      line_items: [{ price: body.priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 7,
        ...(user?.id
          ? {
              metadata: {
                user_id: user.id,
              },
            }
          : {
              metadata: { guest_ref: guestRef },
            }),
      },
      ...(user?.id ? { client_reference_id: user.id } : { client_reference_id: guestRef }),
      metadata: {
        ...(user?.id ? { user_id: user.id } : { guest_ref: guestRef }),
        price_id: body.priceId,
      },
      payment_method_collection: "always",
      success_url: successUrl,
      cancel_url: body.cancelUrl,
    });

    if (!session.url) {
      return json({ error: "Checkout session failed", message: "Missing URL" }, 500);
    }

    return json({ url: session.url });
  } catch (err: any) {
    console.error("create-checkout-session error", err);
    return json(
      {
        error: "Checkout session failed",
        message: err?.message ?? "Unknown error",
        code: err?.code ?? null,
        statusCode: err?.statusCode ?? err?.status ?? null,
      },
      500
    );
  }
});
