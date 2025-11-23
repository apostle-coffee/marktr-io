"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { DashboardSidebar } from "../components/dashboard/DashboardSidebar";
import { ICPPreviewCard } from "../components/dashboard/ICPPreviewCard";
import { CollectionCard } from "../components/dashboard/CollectionCard";
import { EmptyState } from "../components/dashboard/EmptyState";
import { PaywallModal } from "../components/paywall/PaywallModal";
import { CheckoutModal } from "../components/paywall/CheckoutModal";
import { Search, Plus } from "lucide-react";
// Placeholder avatars - replace with actual images
const avatarSarah = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face";
const avatarMarcus = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";
const avatarEmma = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face";

export interface ICP {
  id: string;
  persona_name: string;
  age_range?: string;
  bio: string;
  avatar: string;
  circleColor: string;
  tags: string[];
  created_date: string;
  isLocked?: boolean;
  collection?: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<"icps" | "collections">("icps");
  const [searchQuery, setSearchQuery] = useState("");
  const [userTier, setUserTier] = useState<"free" | "paid">("free"); // Demo purposes
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">("annual");

  // Mock ICP data
  const icps: ICP[] = [
    {
      id: "1",
      persona_name: "Sarah the Startup Founder",
      age_range: "28-38",
      bio: "Early-stage tech founder seeking product-market fit",
      avatar: avatarSarah,
      circleColor: "#BBA0E5",
      tags: ["B2B SaaS", "Tech", "Startup"],
      created_date: "2024-01-15",
      isLocked: false
    },
    {
      id: "2",
      persona_name: "Marcus the Marketing Manager",
      age_range: "30-45",
      bio: "Growth-focused marketer at a scaling B2B company",
      avatar: avatarMarcus,
      circleColor: "#FFD336",
      tags: ["Marketing", "B2B", "Enterprise"],
      created_date: "2024-01-14",
      isLocked: userTier === "free" // Lock for free users
    },
    {
      id: "3",
      persona_name: "Emma the E-commerce Owner",
      age_range: "25-40",
      bio: "Small business owner selling handmade products online",
      avatar: avatarEmma,
      circleColor: "#FF9922",
      tags: ["E-commerce", "SMB", "Retail"],
      created_date: "2024-01-13",
      isLocked: userTier === "free" // Lock for free users
    }
  ];

  // Mock collections
  const collections = [
    {
      id: "1",
      name: "Q1 2024 Campaigns",
      icpCount: 3,
      lastUpdated: "2024-01-15",
      color: "#BBA0E5"
    },
    {
      id: "2",
      name: "Tech Startups",
      icpCount: 5,
      lastUpdated: "2024-01-10",
      color: "#FFD336"
    }
  ];

  const handleCreateNew = () => {
    // Navigate to ICP generator
    console.log("Create new ICP");
  };

  const handleUpgrade = () => {
    setShowPaywall(true);
  };

  const handleUpgradeWithPlan = (plan: "monthly" | "annual") => {
    setSelectedPlan(plan);
    setShowPaywall(false);
    setShowCheckout(true);
  };

  const handleCheckoutBack = () => {
    setShowCheckout(false);
    setShowPaywall(true);
  };

  const handleCheckoutSuccess = () => {
    setShowCheckout(false);
    navigate("/payment-success");
  };

  const handleContinueFree = () => {
    setShowPaywall(false);
    console.log("User continued with free tier");
  };

  const filteredICPs = icps.filter(icp => 
    icp.persona_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    icp.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const showEmptyState = icps.length === 0;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <DashboardSidebar 
        currentView={currentView}
        onViewChange={setCurrentView}
        userTier={userTier}
        onUpgrade={handleUpgrade}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <DashboardHeader 
          onCreateNew={handleCreateNew}
          userTier={userTier}
          onUpgrade={handleUpgrade}
        />

        {/* Content Area */}
        <main className="flex-1 px-6 py-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            {/* Page Title & Search */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="font-['Fraunces'] text-3xl lg:text-4xl mb-2">
                    {currentView === "icps" ? "My ICPs" : "Collections"}
                  </h1>
                  <p className="font-['Inter'] text-foreground/70">
                    {currentView === "icps" 
                      ? `${icps.length} ${icps.length === 1 ? 'ICP' : 'ICPs'} created`
                      : `${collections.length} collections`
                    }
                  </p>
                </div>

                <Button
                  onClick={handleCreateNew}
                  className="hidden sm:flex bg-button-green hover:bg-button-green/90 text-foreground border border-black rounded-[10px] px-6 py-5 transition-all hover:scale-[1.02] hover:shadow-md items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Create New ICP</span>
                  <span className="sm:hidden">New</span>
                </Button>
              </div>

              {/* Mobile Dashboard Navigation */}
              <div className="lg:hidden mb-6">
                <div className="bg-accent-grey/20 border border-black rounded-[10px] p-1 flex gap-1">
                  <button
                    onClick={() => setCurrentView("icps")}
                    className={`flex-1 py-2 px-4 rounded-[8px] font-['Inter'] text-sm transition-all ${
                      currentView === "icps"
                        ? "bg-background border border-black shadow-sm"
                        : "hover:bg-background/50"
                    }`}
                  >
                    My ICPs
                  </button>
                  <button
                    onClick={() => setCurrentView("collections")}
                    className={`flex-1 py-2 px-4 rounded-[8px] font-['Inter'] text-sm transition-all ${
                      currentView === "collections"
                        ? "bg-background border border-black shadow-sm"
                        : "hover:bg-background/50"
                    }`}
                  >
                    Collections
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              {currentView === "icps" && icps.length > 0 && (
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                  <Input
                    type="text"
                    placeholder="Search ICPs or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-black rounded-[10px] font-['Inter']"
                  />
                </div>
              )}
            </div>

            {/* Empty State */}
            {showEmptyState && currentView === "icps" && (
              <EmptyState 
                type="new-user"
                onCreateNew={handleCreateNew}
              />
            )}

            {/* ICP Grid */}
            {currentView === "icps" && !showEmptyState && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredICPs.map((icp) => (
                    <ICPPreviewCard
                      key={icp.id}
                      icp={icp}
                      userTier={userTier}
                      onUpgrade={handleUpgrade}
                    />
                  ))}
                </div>

                {/* Free User Limit Message */}
                {userTier === "free" && icps.length >= 1 && (
                  <div className="mt-12 text-center animate-fade-in-up">
                    <div className="bg-accent-grey/30 border border-black rounded-[10px] p-8 max-w-2xl mx-auto">
                      <h3 className="font-['Fraunces'] text-xl mb-3">
                        You've reached your free ICP limit
                      </h3>
                      <p className="font-['Inter'] text-foreground/70 mb-6">
                        Unlock unlimited ICPs, full data exports, and advanced features.
                      </p>
                      <Button
                        onClick={handleUpgrade}
                        className="bg-button-green hover:bg-button-green/90 text-foreground border border-black rounded-[10px] px-8 py-6 transition-all hover:scale-[1.02] hover:shadow-lg"
                      >
                        Upgrade to unlock unlimited ICPs
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Collections Grid */}
            {currentView === "collections" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((collection) => (
                  <CollectionCard
                    key={collection.id}
                    collection={collection}
                    userTier={userTier}
                    onUpgrade={handleUpgrade}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        onUpgrade={handleUpgradeWithPlan}
        onContinueFree={handleContinueFree}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        onSuccess={handleCheckoutSuccess}
        onBack={handleCheckoutBack}
        plan={selectedPlan}
        userEmail="demo@example.com"
      />
    </div>
  );
}
