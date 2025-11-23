"use client";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "../components/ui/button";
import { ProgressBar } from "../components/onboarding/ProgressBar";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  WelcomeScreen,
  NameScreen,
  BrandNameScreen,
  BusinessDescriptionScreen,
  ProductOrServiceScreen,
  AssumedAudienceScreen,
  MarketingChannelsScreen,
  EmailCaptureScreen,
  LoadingScreen
} from "../components/onboarding/screens";

type Step = 
  | "1_Welcome"
  | "2_Name"
  | "3_BrandName"
  | "4_BusinessDescription"
  | "5_ProductOrService"
  | "6_AssumedAudience"
  | "7_MarketingChannels"
  | "8_EmailCapture"
  | "9_Loading";

const STEPS: Step[] = [
  "1_Welcome",
  "2_Name",
  "3_BrandName",
  "4_BusinessDescription",
  "5_ProductOrService",
  "6_AssumedAudience",
  "7_MarketingChannels",
  "8_EmailCapture",
  "9_Loading"
];

interface FormData {
  name: string;
  brandName: string;
  businessDescription: string;
  productOrService: string;
  assumedAudience: string[];
  customAudience: string;
  marketingChannels: string[];
  email: string;
  emailTips: boolean;
}

export default function OnboardingBuild() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("1_Welcome");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    brandName: "",
    businessDescription: "",
    productOrService: "",
    assumedAudience: [],
    customAudience: "",
    marketingChannels: [],
    email: "",
    emailTips: false
  });

  const currentStepIndex = STEPS.indexOf(currentStep);
  const showBackButton = currentStepIndex > 1 && currentStep !== "9_Loading"; // Show back button after step 2, hide on ICP carousel
  const showProgressBar = currentStep !== "9_Loading";

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex]);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex]);
    }
  };

  const handleLoadingComplete = () => {
    // Navigate to dedicated ICP Results page after loading
    navigate('/icp-results');
  };

  const renderScreen = () => {
    switch (currentStep) {
      case "1_Welcome":
        return <WelcomeScreen onContinue={handleNext} />;
      
      case "2_Name":
        return (
          <NameScreen
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: value })}
            onContinue={handleNext}
            onBack={handleBack}
          />
        );
      
      case "3_BrandName":
        return (
          <BrandNameScreen
            value={formData.brandName}
            onChange={(value) => setFormData({ ...formData, brandName: value })}
            onContinue={handleNext}
            onBack={handleBack}
          />
        );
      
      case "4_BusinessDescription":
        return (
          <BusinessDescriptionScreen
            value={formData.businessDescription}
            onChange={(value) => setFormData({ ...formData, businessDescription: value })}
            onContinue={handleNext}
            onBack={handleBack}
          />
        );
      
      case "5_ProductOrService":
        return (
          <ProductOrServiceScreen
            value={formData.productOrService}
            onChange={(value) => setFormData({ ...formData, productOrService: value })}
            onContinue={handleNext}
            onBack={handleBack}
          />
        );
      
      case "6_AssumedAudience":
        return (
          <AssumedAudienceScreen
            value={formData.assumedAudience}
            customAudience={formData.customAudience}
            onChange={(value) => setFormData({ ...formData, assumedAudience: value })}
            onCustomAudienceChange={(value) => setFormData({ ...formData, customAudience: value })}
            onContinue={handleNext}
            onBack={handleBack}
          />
        );
      
      case "7_MarketingChannels":
        return (
          <MarketingChannelsScreen
            value={formData.marketingChannels}
            onChange={(value) => setFormData({ ...formData, marketingChannels: value })}
            onContinue={handleNext}
            onBack={handleBack}
          />
        );
      
      case "8_EmailCapture":
        return (
          <EmailCaptureScreen
            email={formData.email}
            emailTips={formData.emailTips}
            onEmailChange={(value) => setFormData({ ...formData, email: value })}
            onEmailTipsChange={(value) => setFormData({ ...formData, emailTips: value })}
            onContinue={handleNext}
            onBack={handleBack}
          />
        );
      
      case "9_Loading":
        return <LoadingScreen onComplete={handleLoadingComplete} />;
      
      default:
        return null;
    }
  };

  const getCTAText = () => {
    if (currentStep === "1_Welcome") return "Start";
    if (currentStep === "8_EmailCapture") return "Generate My ICP";
    return "Continue";
  };

  const canContinue = () => {
    switch (currentStep) {
      case "1_Welcome":
        return true;
      case "2_Name":
        return formData.name.trim().length > 0;
      case "3_BrandName":
        return formData.brandName.trim().length > 0;
      case "4_BusinessDescription":
        return formData.businessDescription.trim().length > 0;
      case "5_ProductOrService":
        return formData.productOrService.trim().length > 0;
      case "6_AssumedAudience":
        return formData.assumedAudience.length > 0 || formData.customAudience.trim().length > 0;
      case "7_MarketingChannels":
        return formData.marketingChannels.length > 0;
      case "8_EmailCapture":
        return formData.email.trim().length > 0 && formData.email.includes("@");
      case "9_Loading":
        return false;
      default:
        return true;
    }
  };

  // Screen backgrounds and illustrations
  const SCREEN_STYLES: Record<Step, { bgColor: string; illustration: string }> = {
    "1_Welcome": {
      bgColor: "bg-purple/20",
      illustration: "https://images.unsplash.com/photo-1612201584008-f46f8a16c66d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWxjb21lJTIwaGFwcGluZXNzJTIwY2VsZWJyYXRpb258ZW58MXx8fHwxNzYzMjM1MzMwfDA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    "2_Name": {
      bgColor: "bg-pink/20",
      illustration: "https://images.unsplash.com/photo-1672462478040-a5920e2c23d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBzbWlsaW5nJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYzMTI3NDQ1fDA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    "3_BrandName": {
      bgColor: "bg-orange/20",
      illustration: "https://images.unsplash.com/photo-1540200049848-d9813ea0e120?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHN0b3JlZnJvbnR8ZW58MXx8fHwxNzYzMTUyMzc5fDA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    "4_BusinessDescription": {
      bgColor: "bg-yellow/20",
      illustration: "https://images.unsplash.com/photo-1606234942951-b10a5b373ff0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWdodGJ1bGIlMjBpZGVhJTIwY3JlYXRpdmV8ZW58MXx8fHwxNzYzMjM1MzMxfDA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    "5_ProductOrService": {
      bgColor: "bg-green/20",
      illustration: "https://images.unsplash.com/photo-1759563874665-ffa9dfbd0205?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwcGFja2FnZSUyMGdpZnR8ZW58MXx8fHwxNzYzMjM1MzMxfDA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    "6_AssumedAudience": {
      bgColor: "bg-purple/20",
      illustration: "https://images.unsplash.com/photo-1580849279061-0179c4ebf14e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW9wbGUlMjBjb21tdW5pdHklMjBncm91cHxlbnwxfHx8fDE3NjMyMzUzMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    "7_MarketingChannels": {
      bgColor: "bg-pink/20",
      illustration: "https://images.unsplash.com/photo-1690883793939-f8cca2f28ee0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBtZWRpYSUyMHBob25lfGVufDF8fHx8MTc2MzE2MTkzM3ww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    "8_EmailCapture": {
      bgColor: "bg-green/20",
      illustration: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbWFpbCUyMGluYm94JTIwbWVzc2FnZXxlbnwxfHx8fDE3NjMyMzUzMzN8MA&ixlib=rb-4.1.0&q=80&w=1080"
    },
    "9_Loading": {
      bgColor: "bg-button-green/20",
      illustration: ""
    }
  };

  return (
    <main className="min-h-screen bg-background flex">
      {/* Full-width layout for ICP Carousel */}
      {currentStep === "9_Loading" ? (
        <div className="w-full">
          {renderScreen()}
        </div>
      ) : (
        <>
          {/* Left Column - White Background */}
          <div className="w-full lg:w-1/2 bg-background flex flex-col">
            <div className="flex-1 flex flex-col px-6 sm:px-12 lg:px-16 py-8">
              {/* Homepage Link - Above Progress Bar */}
              <div className="mb-6">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 font-['Inter'] text-sm text-foreground/70 hover:text-foreground transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Go back to homepage
                </Link>
              </div>

              {/* Progress Bar - Top */}
              {showProgressBar && (
                <div className="mb-8 animate-fade-in-up">
                  <ProgressBar current={currentStepIndex + 1} total={STEPS.length} />
                </div>
              )}

              {/* Back Button */}
              {showBackButton && currentStep !== "9_Loading" && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors mb-8 group"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span>Back</span>
                </button>
              )}

              {/* Screen Content */}
              <div className="flex-1 flex flex-col justify-start pt-8 max-w-xl">
                {renderScreen()}
                
                {/* CTA Button */}
                {currentStep !== "1_Welcome" && currentStep !== "9_Loading" && (
                  <div className="mt-8 animate-fade-in-up delay-300">
                    <Button
                      onClick={handleNext}
                      disabled={!canContinue()}
                      className="bg-button-green text-text-dark hover:bg-button-green/90 border-[1px] border-black rounded-[10px] px-8 py-6 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-['Fraunces']"
                    >
                      {getCTAText()}
                    </Button>
                  </div>
                )}

                {/* Welcome Screen Button */}
                {currentStep === "1_Welcome" && (
                  <div className="mt-8 animate-fade-in-up delay-300">
                    <Button
                      onClick={handleNext}
                      className="bg-button-green text-text-dark hover:bg-button-green/90 border-[1px] border-black rounded-[10px] px-8 py-6 transition-all hover:scale-105 active:scale-95 font-['Fraunces']"
                    >
                      Start
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Colored Background with Illustration */}
          <div className={`hidden lg:flex lg:w-1/2 ${SCREEN_STYLES[currentStep].bgColor} items-center justify-center p-16`}>
            {currentStep !== "9_Loading" && SCREEN_STYLES[currentStep].illustration && (
              <div className="relative w-full max-w-lg aspect-square animate-fade-in-up delay-200">
                <ImageWithFallback
                  src={SCREEN_STYLES[currentStep].illustration}
                  alt="Illustration"
                  className="w-full h-full object-cover rounded-[20px] shadow-lg animate-float"
                />
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
}
