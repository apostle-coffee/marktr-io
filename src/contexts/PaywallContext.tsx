import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { PaywallModal } from "../components/modals/PaywallModal";
import { supabase } from "../config/supabase";

// IMPORTANT: internally we ONLY allow these two values.
// (UI can say "Yearly", but the value must remain "annual".)
type Plan = "monthly" | "annual";

type PaywallContextValue = {
  openPaywall: (plan?: Plan) => void;
  startCheckout: (plan?: Plan) => Promise<void>;
  closePaywall: () => void;
  isStartingCheckout: boolean;
};

const PaywallContext = createContext<PaywallContextValue | undefined>(undefined);

export function PaywallProvider({ children }: { children: React.ReactNode }) {
  const [showPaywall, setShowPaywall] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan>("annual");
  const [isStartingCheckout, setIsStartingCheckout] = useState(false);

  const openPaywall = useCallback((plan?: Plan) => {
    if (plan) setSelectedPlan(plan);
    setShowPaywall(true);
  }, []);

  const closePaywall = useCallback(() => setShowPaywall(false), []);

  // Defensive: if any caller accidentally passes "yearly", normalise it.
  const normalisePlan = (p: any): Plan => (p === "yearly" ? "annual" : p);

  const startCheckout = useCallback(
    async (plan?: Plan) => {
      const nextPlan = normalisePlan(plan ?? selectedPlan);

      try {
        setIsStartingCheckout(true);
        const monthlyPriceId = import.meta.env.VITE_STRIPE_PRICE_MONTHLY as
          | string
          | undefined;
        const annualPriceId = import.meta.env.VITE_STRIPE_PRICE_ANNUAL as
          | string
          | undefined;

        const priceId = nextPlan === "monthly" ? monthlyPriceId : annualPriceId;
        const origin = window.location.origin;

        console.log("[paywall] startCheckout", { plan: nextPlan, priceId, origin });

        if (!priceId) {
          console.error("[paywall] Missing Stripe priceId", {
            plan: nextPlan,
            monthlyPriceIdPresent: Boolean(monthlyPriceId),
            annualPriceIdPresent: Boolean(annualPriceId),
          });
          throw new Error(
            "Stripe price ID missing. Check VITE_STRIPE_PRICE_MONTHLY / VITE_STRIPE_PRICE_ANNUAL in your frontend env and restart dev server."
          );
        }

        const { data, error } = await supabase.functions.invoke(
          "create-checkout-session",
          {
            body: {
              priceId,
              successUrl: `${origin}/dashboard?checkout=success`,
              cancelUrl: `${origin}/dashboard?checkout=cancel`,
            },
          }
        );

        console.log("[paywall] checkout response", {
          hasError: !!error,
          dataKeys: Object.keys(data ?? {}),
          url: data?.url,
        });
        if (error) {
          console.error("[paywall] checkout error", error, (error as any)?.context);
        }

        // Surface the real error details (critical for debugging)
        if (error) {
          console.error("[paywall] create-checkout-session invoke error", {
            error,
            data,
            plan: nextPlan,
            priceId,
          });
          const msg =
            (data as any)?.message ||
            (data as any)?.error ||
            (error as any)?.message ||
            "Unexpected error";
          throw new Error(msg);
        }

        if (!data?.url) throw new Error("Checkout URL missing");
        console.log("[paywall] redirecting to checkout", data.url);
        // NOTE: we intentionally do not unset isStartingCheckout here because
        // the browser will navigate away immediately.
        window.location.assign(data.url);
      } catch (err) {
        console.error("[paywall] startCheckout failed", err);
        alert(
          err instanceof Error
            ? `Unable to start checkout: ${err.message}`
            : "Unable to start checkout. Please try again."
        );
        setIsStartingCheckout(false);
      }
    },
    [selectedPlan]
  );

  const value = useMemo(
    () => ({
      openPaywall,
      startCheckout,
      closePaywall,
      isStartingCheckout,
    }),
    [openPaywall, startCheckout, closePaywall, isStartingCheckout]
  );

  return (
    <PaywallContext.Provider value={value}>
      {children}

      <PaywallModal
        isOpen={showPaywall}
        onClose={closePaywall}
        // Normalise in case PaywallModal passes "yearly"
        onUpgrade={(plan) => startCheckout(normalisePlan(plan) as Plan)}
        onContinueFree={closePaywall}
        selectedPlan={selectedPlan}
        // Normalise in case PaywallModal passes "yearly"
        onSelectPlan={(plan) => setSelectedPlan(normalisePlan(plan))}
        isStartingCheckout={isStartingCheckout}
      />
    </PaywallContext.Provider>
  );
}

export function usePaywall(): PaywallContextValue {
  const ctx = useContext(PaywallContext);
  if (!ctx) {
    throw new Error("usePaywall must be used within a PaywallProvider");
  }
  return ctx;
}
