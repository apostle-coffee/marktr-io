"use client";

import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { DashboardSidebar } from "../components/dashboard/DashboardSidebar";
import { ICPPreviewCard } from "../components/dashboard/ICPPreviewCard";
import { PaywallModal } from "../components/paywall/PaywallModal";
import { CheckoutModal } from "../components/paywall/CheckoutModal";
import { 
  ArrowLeft, 
  Plus, 
  Edit2, 
  Trash2, 
  FolderPlus,
  Search
} from "lucide-react";
import type { ICP } from "./Dashboard";
// Placeholder avatars - replace with actual images
const avatarSarah = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face";
const avatarMarcus = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";
const avatarEmma = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face";

export default function CollectionView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditingName, setIsEditingName] = useState(false);
  const [collectionName, setCollectionName] = useState("Q1 2024 Campaigns");
  const [tempName, setTempName] = useState(collectionName);
  const [userTier, setUserTier] = useState<"free" | "paid">("free");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPaywall, setShowPaywall] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">("annual");

  // Mock collection color
  const collectionColor = "#BBA0E5";

  // Mock ICPs in this collection
  const icpsInCollection: ICP[] = [
    {
      id: "1",
      persona_name: "Sarah the Startup Founder",
      age_range: "28-38",
      bio: "Early-stage tech founder seeking product-market fit",
      avatar: avatarSarah,
      circleColor: "#BBA0E5",
      tags: ["B2B SaaS", "Tech", "Startup"],
      created_date: "2024-01-15",
      isLocked: false,
      collection: "Q1 2024 Campaigns"
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
      isLocked: userTier === "free",
      collection: "Q1 2024 Campaigns"
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
      isLocked: userTier === "free",
      collection: "Q1 2024 Campaigns"
    }
  ];

  const handleSaveName = () => {
    setCollectionName(tempName);
    setIsEditingName(false);
  };

  const handleCancelEdit = () => {
    setTempName(collectionName);
    setIsEditingName(false);
  };

  const handleDeleteCollection = () => {
    console.log("Delete collection");
    navigate("/collections");
  };

  const handleAddICPs = () => {
    console.log("Add ICPs to collection");
  };

  const handleUpgrade = () => {
    console.log("Upgrade to paid");
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

  const filteredICPs = icpsInCollection.filter(icp =>
    icp.persona_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    icp.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const showEmptyState = icpsInCollection.length === 0;

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
          onCreateNew={() => {}}
          userTier={userTier}
          onUpgrade={handleUpgrade}
        />

        {/* Content Area */}
        <main className="flex-1 px-6 py-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            {/* Back Button */}
            <Link 
              to="/collections"
              className="inline-flex items-center gap-2 font-['Inter'] text-foreground/70 hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Collections
            </Link>

            {/* Collection Header */}
            <div 
              className="bg-background border border-black rounded-[10px] p-6 lg:p-8 mb-8 shadow-md"
              style={{ 
                borderTopWidth: '6px',
                borderTopColor: collectionColor 
              }}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  {!isEditingName ? (
                    <div className="flex items-center gap-3 group">
                      <h1 className="font-['Fraunces'] text-3xl lg:text-4xl">
                        {collectionName}
                      </h1>
                      <button
                        onClick={() => {
                          setIsEditingName(true);
                          setTempName(collectionName);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-accent-grey/20 rounded-[10px]"
                        aria-label="Edit collection name"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Input
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="font-['Fraunces'] text-3xl lg:text-4xl border-black rounded-[10px] h-auto py-2"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveName();
                          if (e.key === "Escape") handleCancelEdit();
                        }}
                      />
                      <Button
                        onClick={handleSaveName}
                        size="sm"
                        className="bg-button-green hover:bg-button-green/90 text-foreground border border-black rounded-[10px]"
                      >
                        Save
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        size="sm"
                        variant="outline"
                        className="border-black rounded-[10px]"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                  <p className="font-['Inter'] text-foreground/70 mt-2">
                    {icpsInCollection.length} {icpsInCollection.length === 1 ? 'ICP' : 'ICPs'} in this collection
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleAddICPs}
                    className="bg-button-green hover:bg-button-green/90 text-foreground border border-black rounded-[10px] px-4 py-2 lg:px-6 lg:py-5 transition-all hover:scale-[1.02] hover:shadow-md"
                  >
                    <Plus className="w-4 h-4 lg:mr-2" />
                    <span className="hidden lg:inline">Add ICPs</span>
                  </Button>
                  <Button
                    onClick={handleDeleteCollection}
                    variant="outline"
                    className="border-black rounded-[10px] px-4 py-2 lg:px-6 lg:py-5 text-red-600 hover:bg-red-50 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            {!showEmptyState && (
              <div className="mb-6">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                  <Input
                    type="text"
                    placeholder="Search ICPs in this collection..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-black rounded-[10px] font-['Inter']"
                  />
                </div>
              </div>
            )}

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
                    This Collection is Empty
                  </h2>
                  <p className="font-['Inter'] text-foreground/70 mb-6 max-w-md mx-auto">
                    Add ICPs to start organising your audience.
                  </p>
                  <Button
                    onClick={handleAddICPs}
                    className="bg-button-green hover:bg-button-green/90 text-foreground border border-black rounded-[10px] px-8 py-6 transition-all hover:scale-[1.02] hover:shadow-lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add ICPs
                  </Button>
                </div>
              </div>
            )}

            {/* ICPs Grid */}
            {!showEmptyState && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredICPs.map((icp) => (
                    <ICPPreviewCard
                      key={icp.id}
                      icp={icp}
                      userTier={userTier}
                      onUpgrade={handleUpgrade}
                      isInCollection={true}
                    />
                  ))}
                </div>

                {/* Free User Limit Message */}
                {userTier === "free" && icpsInCollection.length > 1 && (
                  <div className="mt-12 text-center animate-fade-in-up">
                    <div className="bg-accent-grey/30 border border-black rounded-[10px] p-8 max-w-2xl mx-auto">
                      <h3 className="font-['Fraunces'] text-xl mb-3">
                        Unlock all ICPs in this collection
                      </h3>
                      <p className="font-['Inter'] text-foreground/70 mb-6">
                        Upgrade to view and manage unlimited ICPs in your collections.
                      </p>
                      <Button
                        onClick={handleUpgrade}
                        className="bg-button-green hover:bg-button-green/90 text-foreground border border-black rounded-[10px] px-8 py-6 transition-all hover:scale-[1.02] hover:shadow-lg"
                      >
                        Upgrade Now
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* No Results */}
            {!showEmptyState && filteredICPs.length === 0 && (
              <div className="text-center py-16">
                <p className="font-['Inter'] text-foreground/60">
                  No ICPs found matching "{searchQuery}"
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
