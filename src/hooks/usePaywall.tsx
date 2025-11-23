import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function usePaywall() {
  const navigate = useNavigate();
  const [showPaywall, setShowPaywall] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">("annual");

  const openPaywall = () => {
    setShowPaywall(true);
  };

  const closePaywall = () => {
    setShowPaywall(false);
  };

  const handleUpgrade = (plan: "monthly" | "annual") => {
    setSelectedPlan(plan);
    setShowPaywall(false);
    setShowCheckout(true);
  };

  const handleCheckoutSuccess = () => {
    setShowCheckout(false);
    navigate("/payment-success");
  };

  const handleContinueFree = () => {
    setShowPaywall(false);
  };

  const closeCheckout = () => {
    setShowCheckout(false);
  };

  return {
    showPaywall,
    showCheckout,
    selectedPlan,
    openPaywall,
    closePaywall,
    handleUpgrade,
    handleCheckoutSuccess,
    handleContinueFree,
    closeCheckout,
  };
}

