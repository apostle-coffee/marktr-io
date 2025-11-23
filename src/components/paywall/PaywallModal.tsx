"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { X, Check, Circle } from "lucide-react";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: (plan: "monthly" | "annual") => void;
  onContinueFree: () => void;
}

export function PaywallModal({ isOpen, onClose, onUpgrade, onContinueFree }: PaywallModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">("annual");

  if (!isOpen) return null;

  const freeFeatures = [
    "1 ICP unlocked",
    "Limited insights",
    "No content strategy",
    "No Meta Ads export",
    "No editing",
    "No collections",
    "No tagging",
    "No sharing or exports"
  ];

  const proFeatures = [
    "All 3 ICPs unlocked",
    "Behaviour & online habits",
    "Brand affinities",
    "Full psychographics",
    "Messaging that converts",
    "Content strategy",
    "Meta Ads lookalike audience",
    "Unlimited ICP creation",
    "Collections & tagging",
    "Export to PDF & Ads JSON",
    "Shareable public links",
    "Edit mode",
    "Priority updates"
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-black rounded-[10px] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fade-in-up">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-warm-grey p-6 flex items-start justify-between">
          <div>
            <h2 className="font-['Fraunces'] text-3xl mb-2">
              Unlock All 3 ICPs
            </h2>
            <p className="font-['Inter'] text-foreground/70 max-w-xl">
              Get full insights, motivations, behaviours, content strategy, and Meta Ads audiences for every persona.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent-grey/20 rounded-[10px] transition-colors flex-shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 lg:p-8">
          {/* Feature Comparison */}
          <div className="mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Free Tier */}
              <div className="bg-accent-grey/20 border border-warm-grey rounded-[10px] p-6">
                <h3 className="font-['Fraunces'] text-xl mb-1">Free</h3>
                <p className="font-['Inter'] text-sm text-foreground/60 mb-6">Limited access</p>
                <ul className="space-y-3">
                  {freeFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Circle className="w-4 h-4 mt-0.5 text-foreground/30 flex-shrink-0" />
                      <span className="font-['Inter'] text-sm text-foreground/60">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pro Tier */}
              <div className="bg-gradient-to-br from-button-green/20 to-[#BBA0E5]/20 border-2 border-black rounded-[10px] p-6 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-button-green border border-black rounded-full px-4 py-1">
                  <span className="font-['Inter'] text-xs uppercase tracking-wide">Recommended</span>
                </div>
                <h3 className="font-['Fraunces'] text-xl mb-1 mt-2">Pro</h3>
                <p className="font-['Inter'] text-sm text-foreground/70 mb-6">Full customer intelligence</p>
                <ul className="space-y-3">
                  {proFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-button-green rounded-full border border-black flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="font-['Inter'] text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="mb-6">
            <h3 className="font-['Fraunces'] text-xl mb-4">Choose Your Plan</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {/* Annual Plan */}
              <button
                onClick={() => setSelectedPlan("annual")}
                className={`text-left p-6 rounded-[10px] border-2 transition-all ${
                  selectedPlan === "annual"
                    ? "border-black bg-button-green/30 shadow-md"
                    : "border-warm-grey bg-background hover:border-black"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-['Fraunces'] text-lg mb-1">Annual Plan</h4>
                    <div className="flex items-baseline gap-2">
                      <span className="font-['Fraunces'] text-2xl">£29</span>
                      <span className="font-['Inter'] text-sm text-foreground/70">/month</span>
                    </div>
                  </div>
                  <div className="bg-[#FFD336] border border-black rounded-full px-3 py-1">
                    <span className="font-['Inter'] text-xs">Save 25%</span>
                  </div>
                </div>
                <p className="font-['Inter'] text-sm text-foreground/70 mb-2">
                  Billed annually (£348/year)
                </p>
                <p className="font-['Inter'] text-xs text-foreground/60">
                  Renews automatically each year unless cancelled.
                </p>
              </button>

              {/* Monthly Plan */}
              <button
                onClick={() => setSelectedPlan("monthly")}
                className={`text-left p-6 rounded-[10px] border-2 transition-all ${
                  selectedPlan === "monthly"
                    ? "border-black bg-accent-grey/30 shadow-md"
                    : "border-warm-grey bg-background hover:border-black"
                }`}
              >
                <div className="mb-2">
                  <h4 className="font-['Fraunces'] text-lg mb-1">Monthly Plan</h4>
                  <div className="flex items-baseline gap-2">
                    <span className="font-['Fraunces'] text-2xl">£39</span>
                    <span className="font-['Inter'] text-sm text-foreground/70">/month</span>
                  </div>
                </div>
                <p className="font-['Inter'] text-sm text-foreground/70 mb-2">
                  Billed monthly
                </p>
                <p className="font-['Inter'] text-xs text-foreground/60">
                  Renews automatically each month unless cancelled.
                </p>
              </button>
            </div>

            {/* Legal Disclosure */}
            <div className="bg-accent-grey/20 border border-warm-grey rounded-[10px] p-4 mb-6">
              <p className="font-['Inter'] text-xs text-foreground/70 text-center">
                This is a recurring subscription. You will be charged automatically until you cancel from your account settings.
              </p>
            </div>
          </div>

          {/* CTAs */}
          <div className="space-y-4">
            <Button
              onClick={() => onUpgrade(selectedPlan)}
              className="w-full bg-button-green hover:bg-button-green/90 text-foreground border border-black rounded-[10px] py-6 text-lg transition-all hover:scale-[1.02] hover:shadow-lg font-['Inter']"
            >
              Upgrade & Unlock All ICPs
            </Button>

            <button
              onClick={onContinueFree}
              className="w-full font-['Inter'] text-sm text-foreground/70 hover:text-foreground transition-colors py-2 text-center"
            >
              Continue for Free
            </button>
          </div>

          {/* Footer Links */}
          <div className="mt-6 pt-6 border-t border-warm-grey">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <a href="#" className="font-['Inter'] text-xs text-foreground/60 hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <span className="text-foreground/30">•</span>
              <a href="#" className="font-['Inter'] text-xs text-foreground/60 hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <span className="text-foreground/30">•</span>
              <a href="#" className="font-['Inter'] text-xs text-foreground/60 hover:text-foreground transition-colors">
                Cancellation Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

