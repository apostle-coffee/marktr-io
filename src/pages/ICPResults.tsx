"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "../components/ui/button";
import { ICPCard, ICPData } from "../components/onboarding/ICPCard";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
// Placeholder avatars - replace with actual images
const avatarSarah = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face";
const avatarMarcus = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";
const avatarEmma = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face";

export default function ICPResults() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Mock ICP data - this would come from the backend/AI generation
  const icpData: ICPData[] = [
    {
      persona_name: "Sarah the Startup Founder",
      age_range: "28-38",
      bio: "Early-stage tech founder seeking product-market fit",
      goals: [
        "Validate product-market fit quickly",
        "Build a scalable customer acquisition strategy",
        "Understand target audience deeply"
      ],
      pain_points: [
        "Limited budget for market research",
        "Wasting time on wrong customer segments",
        "Struggling to articulate value proposition clearly"
      ],
      buying_triggers: [
        "Fast implementation and results",
        "Affordable pricing for early-stage companies",
        "Proven case studies from similar startups"
      ],
      behaviours: [
        "Active on LinkedIn and Twitter/X",
        "Consumes startup podcasts and newsletters",
        "Attends virtual networking events weekly"
      ],
      affinities: [
        "Y Combinator, Product Hunt, Indie Hackers",
        "Tools: Notion, Figma, Linear",
        "Follows: Harry Stebbings, Lenny Rachitsky"
      ],
      messaging: [
        "Speed and efficiency messaging",
        "ROI-focused language",
        "Founder-to-founder tone"
      ],
      conversion_drivers: [
        "Free trial with immediate value",
        "Transparent pricing",
        "Community testimonials"
      ],
      content_pillars: [
        "Product-market fit frameworks",
        "Customer research best practices",
        "Startup growth strategies"
      ],
      meta_lookalike: "Tech founders, 25-40, interested in SaaS, entrepreneurship, product management. Engaged with Y Combinator, Product Hunt, TechCrunch.",
      avatar: avatarSarah,
      circleColor: "#BBA0E5"
    },
    {
      persona_name: "Marcus the Marketing Manager",
      age_range: "30-45",
      bio: "Growth-focused marketer at a scaling B2B company",
      goals: [
        "Increase conversion rates across campaigns",
        "Better segment and target audiences",
        "Prove marketing ROI to leadership"
      ],
      pain_points: [
        "Generic messaging not resonating",
        "High CAC with low conversion",
        "Difficulty personalizing at scale"
      ],
      buying_triggers: [
        "Data-driven insights and analytics",
        "Integration with existing marketing stack",
        "Clear ROI metrics and reporting"
      ],
      avatar: avatarMarcus,
      circleColor: "#FFD336"
    },
    {
      persona_name: "Emma the E-commerce Owner",
      age_range: "25-40",
      bio: "Small business owner selling handmade products online",
      goals: [
        "Grow online sales consistently",
        "Build a loyal customer community",
        "Stand out in a crowded market"
      ],
      pain_points: [
        "Limited marketing expertise",
        "Competing with bigger brands on budget",
        "Understanding customer preferences"
      ],
      buying_triggers: [
        "Easy-to-use tools (no tech skills needed)",
        "Affordable monthly pricing",
        "Visual results and actionable insights"
      ],
      avatar: avatarEmma,
      circleColor: "#FF9922"
    }
  ];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? icpData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === icpData.length - 1 ? 0 : prev + 1));
  };

  const handleUnlockAll = () => {
    // Handle unlock logic - could navigate to pricing or payment page
    console.log("Unlock all ICPs");
  };

  const handleEmailICP = () => {
    // Handle email ICP logic
    console.log("Email ICP");
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipe();
  };

  const handleSwipe = () => {
    if (touchStartX.current && touchEndX.current) {
      const swipeDistance = touchStartX.current - touchEndX.current;
      if (swipeDistance > 50) {
        handleNext();
      } else if (swipeDistance < -50) {
        handlePrevious();
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Simple Header/Nav */}
      <header className="border-b border-warm-grey bg-background">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-['Fraunces'] hover:opacity-70 transition-opacity">
            ICP Builder
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-16 pb-32 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h1 className="font-['Fraunces'] mb-4 text-4xl sm:text-5xl">
              Meet Your Ideal Customers
            </h1>
            <p className="font-['Inter'] text-foreground/70 max-w-2xl mx-auto text-lg">
              We've identified 3 distinct ICPs. Your first is unlocked - upgrade to reveal the full picture and discover the customers you're missing.
            </p>
          </div>

          {/* Carousel Container - Linear Stacked Cards */}
          <div className="relative mb-16" style={{ minHeight: '2000px' }}>
            
            {/* All three cards displayed in linear fashion */}
            <div
              className="relative flex items-start justify-center"
              style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}
              ref={containerRef}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Navigation Arrows - Always visible, positioned at persona name level */}
              <button
                onClick={handlePrevious}
                className="absolute z-50 transition-all hover:scale-110 active:scale-95 bg-background rounded-full w-12 h-12 flex items-center justify-center shadow-lg border border-black left-2 sm:-left-6"
                style={{ 
                  top: '120px' // Positioned at persona name level (profile circle + padding + header area)
                }}
                aria-label="Previous ICP"
              >
                <svg
                  width="16"
                  height="14"
                  viewBox="0 0 8 7"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="rotate-90"
                >
                  <path
                    d="M4 7L0.535898 0.25L7.4641 0.25L4 7Z"
                    fill="#FF9922"
                    stroke="black"
                    strokeWidth="1"
                  />
                </svg>
              </button>
              
              <button
                onClick={handleNext}
                className="absolute z-50 transition-all hover:scale-110 active:scale-95 bg-background rounded-full w-12 h-12 flex items-center justify-center shadow-lg border border-black right-2 sm:-right-6"
                style={{ 
                  top: '120px' // Positioned at persona name level (profile circle + padding + header area)
                }}
                aria-label="Next ICP"
              >
                <svg
                  width="16"
                  height="14"
                  viewBox="0 0 8 7"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="-rotate-90"
                >
                  <path
                    d="M4 7L0.535898 0.25L7.4641 0.25L4 7Z"
                    fill="#FF9922"
                    stroke="black"
                    strokeWidth="1"
                  />
                </svg>
              </button>

              {icpData.map((icp, index) => {
                // Calculate position and styling for each card
                const isActive = index === currentIndex;
                const offset = (index - currentIndex) * 120; // Horizontal offset for stacking
                const verticalOffset = index * 20; // Vertical offset reduced by 50% - each card steps down 20px instead of 40px
                const zIndex = isActive ? 30 : 20 - Math.abs(index - currentIndex);
                const scale = isActive ? 1 : 0.95;
                const opacity = isActive ? 1 : 0.7;
                
                return (
                  <div
                    key={index}
                    className="absolute transition-all duration-500 ease-out cursor-pointer"
                    style={{
                      left: `calc(50% + ${offset}px)`,
                      top: `${verticalOffset}px`,
                      transform: `translateX(-50%) scale(${scale})`,
                      zIndex: zIndex,
                      opacity: opacity,
                      width: '100%',
                      maxWidth: '500px',
                      pointerEvents: 'auto'
                    }}
                    onClick={() => !isActive && setCurrentIndex(index)}
                  >
                    <ICPCard 
                      data={icp} 
                      isLocked={index !== 0}
                      onUnlock={handleUnlockAll}
                      cardNumber={index + 1}
                      onEmailICP={handleEmailICP}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Page-level CTA */}
          <div className="text-center animate-fade-in-up delay-200">
            <Button
              onClick={handleUnlockAll}
              className="bg-button-green hover:bg-button-green/90 text-foreground border border-black rounded-[10px] px-8 py-6 transition-all hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2 mx-auto"
            >
              <Lock className="w-4 h-4" />
              Unlock All 3 ICPs
            </Button>
            <p className="font-['Inter'] text-sm text-foreground/60 mt-4">
              Reveal the customers you're missing and how to reach them.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
