import { useState } from "react";

export type OnboardingStep =
  | "1_Welcome"
  | "2_Name"
  | "3_BrandName"
  | "4_BusinessDescription"
  | "5_ProductOrService"
  | "6_AssumedAudience"
  | "7_MarketingChannels"
  | "8_EmailCapture"
  | "9_Loading"
  | "10_ICPCarousel";

export interface OnboardingFormData {
  name: string;
  brandName: string;
  businessDescription: string;
  productOrService: string;
  assumedAudience: string[];
  customAudience: string;
  marketingChannels: string[];
  email: string;
}

const STEPS: OnboardingStep[] = [
  "1_Welcome",
  "2_Name",
  "3_BrandName",
  "4_BusinessDescription",
  "5_ProductOrService",
  "6_AssumedAudience",
  "7_MarketingChannels",
  "8_EmailCapture",
  "9_Loading",
  "10_ICPCarousel",
];

/**
 * Hook for managing onboarding flow state and navigation
 * @returns Current step, form data, and navigation functions
 */
export function useOnboarding() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("1_Welcome");
  const [formData, setFormData] = useState<OnboardingFormData>({
    name: "",
    brandName: "",
    businessDescription: "",
    productOrService: "",
    assumedAudience: [],
    customAudience: "",
    marketingChannels: [],
    email: "",
  });

  const currentStepIndex = STEPS.indexOf(currentStep);
  const totalSteps = STEPS.length;
  const progress = ((currentStepIndex + 1) / totalSteps) * 100;

  const nextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex]);
    }
  };

  const previousStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex]);
    }
  };

  const goToStep = (step: OnboardingStep) => {
    setCurrentStep(step);
  };

  const updateFormData = (updates: Partial<OnboardingFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const submitOnboarding = async () => {
    // TODO: Implement API call to submit onboarding data and generate ICPs
    console.log("Submitting onboarding data:", formData);
    return Promise.resolve();
  };

  const resetOnboarding = () => {
    setCurrentStep("1_Welcome");
    setFormData({
      name: "",
      brandName: "",
      businessDescription: "",
      productOrService: "",
      assumedAudience: [],
      customAudience: "",
      marketingChannels: [],
      email: "",
    });
  };

  return {
    currentStep,
    formData,
    currentStepIndex,
    totalSteps,
    progress,
    nextStep,
    previousStep,
    goToStep,
    updateFormData,
    submitOnboarding,
    resetOnboarding,
    STEPS,
  };
}
