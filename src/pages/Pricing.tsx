import { useState } from "react";
import { Check, Lock, Star, RotateCcw, Heart } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(true);
  const [currency, setCurrency] = useState<"GBP" | "USD">("GBP");

  const prices = {
    monthly: {
      GBP: 30,
      USD: 42,
    },
    yearly: {
      GBP: 25,
      USD: 35,
    },
  };

  const getCurrencySymbol = () => (currency === "GBP" ? "£" : "$");
  const getMonthlyPrice = () => prices.monthly[currency];
  const getYearlyPrice = () => prices.yearly[currency];
  const getYearlyTotal = () => prices.yearly[currency] * 12;

  const faqs = [
    {
      question: "What happens if I cancel?",
      answer: "You keep access to your Pro features until the end of your billing period. After that, your account reverts to the Free plan.",
    },
    {
      question: "Do unused ICPs roll over?",
      answer: "Pro and Team plans include unlimited ICPs, so there's nothing to roll over. Generate as many as you need!",
    },
    {
      question: "Can I upgrade or downgrade anytime?",
      answer: "Yes! You can change your plan at any time. Upgrades take effect immediately, downgrades at the end of your billing cycle.",
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 14-day money-back guarantee on all paid plans. For full details, see our Refund Policy.",
    },
    {
      question: "How does billing through Stripe work?",
      answer: "Stripe is our secure payment partner. They handle all billing and provide you with receipts. You can manage your subscription directly through your account settings.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="font-['Fraunces'] text-4xl sm:text-5xl lg:text-6xl mb-6">
            Plans built to help you target smarter & grow faster
          </h1>
          <p className="font-['Inter'] text-lg sm:text-xl text-foreground/70 max-w-2xl mx-auto">
            Start free. Upgrade to access full ICPs, strategic insights, and export-ready Meta targeting data.
          </p>
        </div>
      </section>

      {/* Monthly/Yearly Toggle - Pills Design */}
      <section className="pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center gap-3">
            {/* Currency Toggle */}
            <div className="inline-flex rounded-design border border-warm-grey p-0.5 bg-background mb-2">
              <button
                onClick={() => setCurrency("GBP")}
                className={`font-['Inter'] text-xs px-4 py-1.5 rounded-[8px] transition-all ${
                  currency === "GBP"
                    ? "bg-accent-grey text-text-dark"
                    : "bg-transparent text-foreground/70 hover:text-foreground"
                }`}
              >
                GBP (£)
              </button>
              <button
                onClick={() => setCurrency("USD")}
                className={`font-['Inter'] text-xs px-4 py-1.5 rounded-[8px] transition-all ${
                  currency === "USD"
                    ? "bg-accent-grey text-text-dark"
                    : "bg-transparent text-foreground/70 hover:text-foreground"
                }`}
              >
                USD ($)
              </button>
            </div>

            {/* Plan Period Toggle */}
            <div className="inline-flex rounded-design border-2 border-warm-grey p-1 bg-background">
              <button
                onClick={() => setIsYearly(false)}
                className={`font-['Inter'] text-sm px-6 py-2 rounded-[8px] transition-all ${
                  !isYearly
                    ? "bg-button-green border-2 border-button-green text-text-dark"
                    : "bg-transparent border-2 border-transparent text-foreground/70 hover:text-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`font-['Inter'] text-sm px-6 py-2 rounded-[8px] transition-all flex items-center gap-2 ${
                  isYearly
                    ? "bg-button-green border-2 border-button-green text-text-dark"
                    : "bg-transparent border-2 border-transparent text-foreground/70 hover:text-foreground"
                }`}
              >
                Yearly
                <span className="text-xs bg-[#FFD336] text-text-dark px-2 py-0.5 rounded-full border border-black">
                  2 months free
                </span>
              </button>
            </div>
            <p className="font-['Inter'] text-xs text-foreground/60">
              All plans auto-renew. Cancel anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Grid - 2 Plans */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
            {/* Monthly Plan */}
            <div
              onClick={() => setIsYearly(false)}
              className={`relative bg-background rounded-design p-8 flex flex-col transition-all cursor-pointer ${
                !isYearly
                  ? "border-2 border-button-green shadow-lg md:scale-105 hover:shadow-xl"
                  : "border border-warm-grey hover:shadow-lg"
              }`}
              style={
                !isYearly
                  ? {
                      boxShadow: "0 0 40px rgba(176, 237, 157, 0.3)",
                    }
                  : {}
              }
            >
              <div className="mb-6">
                <h3 className="font-['Fraunces'] text-2xl mb-2">Monthly</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-['Fraunces'] text-4xl">
                    {getCurrencySymbol()}
                    {getMonthlyPrice()}
                  </span>
                  <span className="font-['Inter'] text-sm text-foreground/70">/mo</span>
                </div>
                <p className="font-['Inter'] text-xs text-foreground/60 mb-2">
                  VAT may apply
                </p>
                <p className="font-['Inter'] text-sm text-foreground/70">
                  Flexible monthly access
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-button-green shrink-0 mt-0.5" />
                  <span className="font-['Inter'] text-sm">All ICP features unlocked</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-button-green shrink-0 mt-0.5" />
                  <span className="font-['Inter'] text-sm">Unlimited edits</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-button-green shrink-0 mt-0.5" />
                  <span className="font-['Inter'] text-sm">Content strategy tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-button-green shrink-0 mt-0.5" />
                  <span className="font-['Inter'] text-sm">Meta lookalike exports</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-button-green shrink-0 mt-0.5" />
                  <span className="font-['Inter'] text-sm">Create collections</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-button-green shrink-0 mt-0.5" />
                  <span className="font-['Inter'] text-sm">Cancel anytime</span>
                </li>
              </ul>

              <Link to="/paywall-demo" className="w-full" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant={!isYearly ? "default" : "outline"}
                  className={`w-full font-['Fraunces'] transition-all hover:scale-105 active:scale-95 ${
                    !isYearly
                      ? "bg-button-green text-text-dark hover:bg-button-green/90"
                      : "bg-transparent text-foreground hover:bg-accent-grey/20 border-warm-grey"
                  }`}
                >
                  Start free trial (Monthly)
                </Button>
              </Link>
              <p className="mt-3 text-center font-['Inter'] text-xs text-foreground/60">
                £0 today • then {getCurrencySymbol()}{getMonthlyPrice()}/mo after 7 days
              </p>

              <div className="mt-6 pt-6 border-t border-warm-grey">
                <p className="font-['Inter'] text-xs text-foreground/50 text-center">
                  Great if you're testing or working month-to-month.
                </p>
              </div>
            </div>

            {/* Yearly Plan - Highlighted */}
            <div
              onClick={() => setIsYearly(true)}
              className={`relative bg-background rounded-design p-8 flex flex-col transition-all cursor-pointer ${
                isYearly
                  ? "border-2 border-button-green shadow-lg md:scale-105 hover:shadow-xl"
                  : "border border-warm-grey hover:shadow-lg"
              }`}
              style={
                isYearly
                  ? {
                      boxShadow: "0 0 40px rgba(176, 237, 157, 0.3)",
                    }
                  : {}
              }
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-button-green text-text-dark px-4 py-1 rounded-full border border-black font-['Inter'] text-xs flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
                Best Value
              </div>
              <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                <span className="font-['Inter'] text-xs text-foreground/60">Most Popular</span>
              </div>

              <div className="mb-6">
                <h3 className="font-['Fraunces'] text-2xl mb-2">Yearly</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-['Fraunces'] text-4xl">
                    {getCurrencySymbol()}
                    {getYearlyPrice()}
                  </span>
                  <span className="font-['Inter'] text-sm text-foreground/70">/mo</span>
                </div>
                <p className="font-['Inter'] text-xs text-foreground/60 mb-1">
                  billed yearly ({getCurrencySymbol()}
                  {getYearlyTotal()})
                </p>
                <p className="font-['Inter'] text-xs text-foreground/60 mb-2">
                  VAT may apply
                </p>
                <p className="font-['Inter'] text-sm text-foreground/70">
                  Best value for long-term use
                </p>
              </div>

              <div className="mb-4 pb-4 border-b border-warm-grey">
                <p className="font-['Inter'] text-xs text-foreground/70">
                  Same full access, lower effective monthly price
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-button-green shrink-0 mt-0.5" />
                  <span className="font-['Inter'] text-sm">1 bonus ICP refresh each month</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-button-green shrink-0 mt-0.5" />
                  <span className="font-['Inter'] text-sm">Priority persona rendering</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-button-green shrink-0 mt-0.5" />
                  <span className="font-['Inter'] text-sm">Free avatar colour customisation</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-button-green shrink-0 mt-0.5" />
                  <span className="font-['Inter'] text-sm">Early access to new features</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-button-green shrink-0 mt-0.5" />
                  <span className="font-['Inter'] text-sm">14-day money-back guarantee</span>
                </li>
              </ul>

              <Link to="/paywall-demo" className="w-full" onClick={(e) => e.stopPropagation()}>
                <Button
                  className={`w-full font-['Fraunces'] transition-all hover:scale-105 active:scale-95 ${
                    isYearly
                      ? "bg-button-green text-text-dark hover:bg-button-green/90"
                      : "bg-transparent text-foreground hover:bg-accent-grey/20 border-warm-grey"
                  }`}
                >
                  Start free trial (Yearly)
                </Button>
              </Link>
              <p className="mt-3 text-center font-['Inter'] text-xs text-foreground/60">
                £0 today • then {getCurrencySymbol()}{getYearlyTotal()}/year after 7 days
              </p>

              <div className="mt-6 pt-6 border-t border-warm-grey">
                <p className="font-['Inter'] text-xs text-foreground/50 text-center">
                  Most popular — perfect for teams building long-term strategy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legal + Clarity Notes */}
      <section className="pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center space-y-2">
            <p className="font-['Inter'] text-xs text-foreground/60">
              Prices available in GBP (£) and USD ($). Use the currency toggle above to switch.
            </p>
            <p className="font-['Inter'] text-xs text-foreground/60">
              All plans renew automatically. You can cancel anytime in your account settings.
            </p>
            <p className="font-['Inter'] text-xs text-foreground/60">
              <Link to="/terms-of-service" className="underline hover:text-foreground transition-colors">
                Full Terms
              </Link>{" "}
              &{" "}
              <Link to="/privacy-policy" className="underline hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-accent-grey/20">
        <div className="container mx-auto max-w-5xl">
          <h2 className="font-['Fraunces'] text-3xl sm:text-4xl text-center mb-12">
            Compare Plans
          </h2>
          
          <div className="bg-background rounded-design border border-black overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-warm-grey">
                  <th className="text-left p-4 sm:p-6 font-['Fraunces'] text-lg">Features</th>
                  <th className="text-center p-4 sm:p-6 font-['Fraunces'] text-lg">Free (Guest)</th>
                  <th className="text-center p-4 sm:p-6 font-['Fraunces'] text-lg bg-button-green/10">Monthly</th>
                  <th className="text-center p-4 sm:p-6 font-['Fraunces'] text-lg bg-button-green/10">Yearly</th>
                </tr>
              </thead>
              <tbody className="font-['Inter'] text-sm">
                <tr className="border-b border-warm-grey">
                  <td className="p-4 sm:p-6">Structured ICP framework (goals, pains, segments)</td>
                  <td className="text-center p-4 sm:p-6">
                    <Check className="w-5 h-5 mx-auto" strokeWidth={3} style={{ color: "#4A9D3C" }} />
                  </td>
                  <td className="text-center p-4 sm:p-6 bg-button-green/5">
                    <Check className="w-5 h-5 mx-auto" strokeWidth={3} style={{ color: "#4A9D3C" }} />
                  </td>
                  <td className="text-center p-4 sm:p-6 bg-button-green/5">
                    <Check className="w-5 h-5 mx-auto" strokeWidth={3} style={{ color: "#4A9D3C" }} />
                  </td>
                </tr>
                <tr className="border-b border-warm-grey">
                  <td className="p-4 sm:p-6">ICPs included</td>
                  <td className="text-center p-4 sm:p-6 text-foreground/60">3 ICP previews (read-only)</td>
                  <td className="text-center p-4 sm:p-6 bg-button-green/5">Unlimited ICPs</td>
                  <td className="text-center p-4 sm:p-6 bg-button-green/5">Unlimited ICPs</td>
                </tr>
                <tr className="border-b border-warm-grey">
                  <td className="p-4 sm:p-6">Save ICPs to your account</td>
                  <td className="text-center p-4 sm:p-6 text-foreground/60">—</td>
                  <td className="text-center p-4 sm:p-6 bg-button-green/5"><Check className="w-5 h-5 mx-auto" strokeWidth={3} style={{ color: '#4A9D3C' }} /></td>
                  <td className="text-center p-4 sm:p-6 bg-button-green/5"><Check className="w-5 h-5 mx-auto" strokeWidth={3} style={{ color: '#4A9D3C' }} /></td>
                </tr>
                <tr className="border-b border-warm-grey">
                  <td className="p-4 sm:p-6">Edit & regenerate ICPs</td>
                  <td className="text-center p-4 sm:p-6 text-foreground/60">—</td>
                  <td className="text-center p-4 sm:p-6 bg-button-green/5"><Check className="w-5 h-5 mx-auto" strokeWidth={3} style={{ color: '#4A9D3C' }} /></td>
                  <td className="text-center p-4 sm:p-6 bg-button-green/5"><Check className="w-5 h-5 mx-auto" strokeWidth={3} style={{ color: '#4A9D3C' }} /></td>
                </tr>
                <tr className="border-b border-warm-grey">
                  <td className="p-4 sm:p-6">Build brand pages</td>
                  <td className="text-center p-4 sm:p-6 text-foreground/60">—</td>
                  <td className="text-center p-4 sm:p-6 bg-button-green/5"><Check className="w-5 h-5 mx-auto" strokeWidth={3} style={{ color: '#4A9D3C' }} /></td>
                  <td className="text-center p-4 sm:p-6 bg-button-green/5"><Check className="w-5 h-5 mx-auto" strokeWidth={3} style={{ color: '#4A9D3C' }} /></td>
                </tr>
                <tr className="border-b border-warm-grey">
                  <td className="p-4 sm:p-6">Generate marketing strategies</td>
                  <td className="text-center p-4 sm:p-6 text-foreground/60">—</td>
                  <td className="text-center p-4 sm:p-6 bg-button-green/5"><Check className="w-5 h-5 mx-auto" strokeWidth={3} style={{ color: '#4A9D3C' }} /></td>
                  <td className="text-center p-4 sm:p-6 bg-button-green/5"><Check className="w-5 h-5 mx-auto" strokeWidth={3} style={{ color: '#4A9D3C' }} /></td>
                </tr>
                <tr className="border-b border-warm-grey">
                  <td className="p-4 sm:p-6">Create & manage ICP collections</td>
                  <td className="text-center p-4 sm:p-6 text-foreground/60">—</td>
                  <td className="text-center p-4 sm:p-6 bg-button-green/5"><Check className="w-5 h-5 mx-auto" strokeWidth={3} style={{ color: '#4A9D3C' }} /></td>
                  <td className="text-center p-4 sm:p-6 bg-button-green/5"><Check className="w-5 h-5 mx-auto" strokeWidth={3} style={{ color: '#4A9D3C' }} /></td>
                </tr>
                <tr className="border-b border-warm-grey">
                  <td className="p-4 sm:p-6">Export ICPs & strategies as PDFs</td>
                  <td className="text-center p-4 sm:p-6 text-foreground/60">—</td>
                  <td className="text-center p-4 sm:p-6 bg-button-green/5"><Check className="w-5 h-5 mx-auto" strokeWidth={3} style={{ color: '#4A9D3C' }} /></td>
                  <td className="text-center p-4 sm:p-6 bg-button-green/5"><Check className="w-5 h-5 mx-auto" strokeWidth={3} style={{ color: '#4A9D3C' }} /></td>
                </tr>
                <tr className="border-b border-warm-grey">
                  <td className="p-4 sm:p-6">Faster ICP generation</td>
                  <td className="text-center p-4 sm:p-6 text-foreground/60">—</td>
                  <td className="text-center p-4 sm:p-6 bg-button-green/5"><Check className="w-5 h-5 mx-auto" strokeWidth={3} style={{ color: '#4A9D3C' }} /></td>
                  <td className="text-center p-4 sm:p-6 bg-button-green/5"><Check className="w-5 h-5 mx-auto" strokeWidth={3} style={{ color: '#4A9D3C' }} /></td>
                </tr>
                <tr className="border-b border-warm-grey">
                  <td className="p-4 sm:p-6">Early access to new features</td>
                  <td className="text-center p-4 sm:p-6 text-foreground/60">—</td>
                  <td className="text-center p-4 sm:p-6 bg-button-green/5"><Check className="w-5 h-5 mx-auto" strokeWidth={3} style={{ color: '#4A9D3C' }} /></td>
                  <td className="text-center p-4 sm:p-6 bg-button-green/5"><Check className="w-5 h-5 mx-auto" strokeWidth={3} style={{ color: '#4A9D3C' }} /></td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-6">14-day money-back guarantee</td>
                  <td className="text-center p-4 sm:p-6 text-foreground/60">—</td>
                  <td className="text-center p-4 sm:p-6 bg-button-green/5"><Check className="w-5 h-5 mx-auto" strokeWidth={3} style={{ color: '#4A9D3C' }} /></td>
                  <td className="text-center p-4 sm:p-6 bg-button-green/5"><Check className="w-5 h-5 mx-auto" strokeWidth={3} style={{ color: '#4A9D3C' }} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Trust / Reassurance Row */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-accent-grey/30">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-background border-2 border-black flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <p className="font-['Inter'] text-sm">
                Secure checkout via Stripe
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-background border-2 border-black flex items-center justify-center">
                <RotateCcw className="w-6 h-6" />
              </div>
              <p className="font-['Inter'] text-sm">
                14-day money-back guarantee
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-background border-2 border-black flex items-center justify-center">
                <Heart className="w-6 h-6 fill-current" />
              </div>
              <p className="font-['Inter'] text-sm">
                Loved by founders, marketers & SMEs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-['Fraunces'] text-3xl sm:text-4xl text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-background rounded-design border border-black p-6 transition-all hover:shadow-lg"
              >
                <h3 className="font-['Fraunces'] text-lg mb-3">{faq.question}</h3>
                <p className="font-['Inter'] text-sm text-foreground/70 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
