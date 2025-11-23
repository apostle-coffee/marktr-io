"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { DashboardSidebar } from "../components/dashboard/DashboardSidebar";
import { CollectionCard } from "../components/dashboard/CollectionCard";
import { PaywallModal } from "../components/paywall/PaywallModal";
import { CheckoutModal } from "../components/paywall/CheckoutModal";
import { Search, Plus, FolderPlus } from "lucide-react";

export interface Collection {
  id: string;
  name: string;
  icpCount: number;
  lastUpdated: string;
  color: string;
  icpPreviews?: {
    id: string;
    avatar: string;
    circleColor: string;
  }[];
  isLocked?: boolean;
}

export default function Collections() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [userTier, setUserTier] = useState<"free" | "paid">("free");
  const [showPaywall, setShowPaywall] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">("annual");

  // Mock collections data
  const collections: Collection[] = [
    {
      id: "1",
      name: "Q1 2024 Campaigns",
      icpCount: 3,
      lastUpdated: "2024-01-15",
      color: "#BBA0E5",
      icpPreviews: [],
      isLocked: false
    },
    {
      id: "2",
      name: "Tech Startups",
      icpCount: 5,
      lastUpdated: "2024-01-10",
      color: "#FFD336",
      icpPreviews: [],
      isLocked: userTier === "free"
    },
    {
      id: "3",
      name: "E-commerce Clients",
      icpCount: 4,
      lastUpdated: "2024-01-08",
      color: "#FF9922",
      icpPreviews: [],
      isLocked: userTier === "free"
    }
  ];

  const handleCreateNew = () => {
    console.log("Create new collection");
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

  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showEmptyState = collections.length === 0;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <DashboardSidebar
        currentView="collections"
        onViewChange={() => {}}
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
              <div className="flex items-start justify-between mb-6 gap-4">
                <div className="flex-1">
                  <h1 className="font-['Fraunces'] text-3xl lg:text-4xl mb-2">
                    Collections
                  </h1>
                  <p className="font-['Inter'] text-foreground/70 max-w-2xl">
                    Organise your ICPs into groups for campaigns, products, or teams.
                  </p>
                </div>

                <Button
                  onClick={handleCreateNew}
                  className="hidden sm:flex bg-button-green hover:bg-button-green/90 text-foreground border border-black rounded-[10px] px-6 py-5 transition-all hover:scale-[1.02] hover:shadow-md items-center gap-2 whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  Create Collection
                </Button>
              </div>

              {/* Search Bar */}
              {collections.length > 0 && (
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                  <Input
                    type="text"
                    placeholder="Search collections..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-black rounded-[10px] font-['Inter']"
                  />
                </div>
              )}
            </div>

            {/* Empty State */}
            {showEmptyState && (
              <div className="text-center py-16 animate-fade-in-up">
                <div className="bg-accent-grey/20 border border-black rounded-[10px] p-12 max-w-2xl mx-auto">
                  <div className="mb-6">
                    <div className="w-24 h-24 bg-button-green/20 rounded-full border border-black flex items-center justify-center mx-auto mb-4">
                      <FolderPlus className="w-12 h-12 text-foreground/60" />
                    </div>
                  </div>
                  <h2 className="font-['Fraunces'] text-2xl mb-3">
                    No Collections Yet
                  </h2>
                  <p className="font-['Inter'] text-foreground/70 mb-6 max-w-md mx-auto">
                    Organise your ICPs into groups for campaigns, products, or teams.
                  </p>
                  <Button
                    onClick={handleCreateNew}
                    className="bg-button-green hover:bg-button-green/90 text-foreground border border-black rounded-[10px] px-8 py-6 transition-all hover:scale-[1.02] hover:shadow-lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Collection
                  </Button>
                </div>
              </div>
            )}

            {/* Collections Grid */}
            {!showEmptyState && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCollections.map((collection) => (
                    <CollectionCard
                      key={collection.id}
                      collection={collection}
                      userTier={userTier}
                      onUpgrade={handleUpgrade}
                    />
                  ))}
                </div>

                {/* Free User Limit Message */}
                {userTier === "free" && collections.length >= 1 && (
                  <div className="mt-12 text-center animate-fade-in-up">
                    <div className="bg-accent-grey/30 border border-black rounded-[10px] p-8 max-w-2xl mx-auto">
                      <h3 className="font-['Fraunces'] text-xl mb-3">
                        You've reached your free collection limit
                      </h3>
                      <p className="font-['Inter'] text-foreground/70 mb-6">
                        Unlock unlimited collections, advanced organisation, and team collaboration.
                      </p>
                      <Button
                        onClick={handleUpgrade}
                        className="bg-button-green hover:bg-button-green/90 text-foreground border border-black rounded-[10px] px-8 py-6 transition-all hover:scale-[1.02] hover:shadow-lg"
                      >
                        Upgrade to unlock unlimited collections
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* No Results */}
            {!showEmptyState && filteredCollections.length === 0 && (
              <div className="text-center py-16">
                <p className="font-['Inter'] text-foreground/60">
                  No collections found matching "{searchQuery}"
                </p>
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
