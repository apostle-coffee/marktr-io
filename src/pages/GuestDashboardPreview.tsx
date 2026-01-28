import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardShell from "../layouts/DashboardShell";
import { Button } from "../components/ui/button";
import { ICPPreviewCard } from "../components/cards/ICPPreviewCard";
import { BrandCard } from "../components/cards/BrandCard";
import { usePaywall } from "../contexts/PaywallContext";
import { useAuth } from "../contexts/AuthContext";
import { getGuestICPs } from "../lib/guestICP";
import { getGuestBrandSeed } from "../lib/guestBrandSeed";

export default function GuestDashboardPreview() {
  const navigate = useNavigate();
  const { openPaywall } = usePaywall();
  const { user } = useAuth();

  // If user is already authenticated, send them to the real dashboard
  useEffect(() => {
    if (user?.id) {
      navigate("/dashboard", { replace: true });
    }
  }, [user?.id, navigate]);

  const brandSeed = getGuestBrandSeed();
  const guestBrand = useMemo(
    () => ({
      id: "guest-brand",
      name: brandSeed?.brandName?.trim() || "Untitled Brand",
      color: brandSeed?.color || "#EDEDED",
      business_type: brandSeed?.businessType ?? null,
      country: brandSeed?.country ?? null,
      updated_at: brandSeed?.created_at ?? new Date().toISOString(),
      created_at: brandSeed?.created_at ?? new Date().toISOString(),
    }),
    [brandSeed]
  );

  const guestICPs = useMemo(() => {
    const icps = getGuestICPs() || [];
    return icps.map((icp: any, index: number) => ({
      ...icp,
      id: icp.id || `guest-icp-${index}`,
      _index: index,
      isLocked: index > 0, // only first ICP is unlocked
      brand_id: icp.brand_id ?? guestBrand.id,
      brandName: guestBrand.name,
      gender: icp.gender ?? icp.avatar_gender ?? null,
      age_range: icp.age_range ?? icp.avatar_age_range ?? null,
    }));
  }, [guestBrand.id, guestBrand.name]);

  const handleUpgrade = () => {
    openPaywall();
  };

  return (
    <DashboardShell
      contentClassName="flex-1 px-6 py-8 lg:px-12"
      guestMode
      onGuestAction={() => openPaywall()}
    >
      <div className="max-w-7xl mx-auto space-y-10 pb-12">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="font-['Fraunces'] text-3xl lg:text-4xl mb-2">
              Dashboard
            </h1>
            <p className="font-['Inter'] text-foreground/70">
              This is your marketing workspace — unlock it to edit, test, and refine your ICPs.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              className="bg-button-green hover:bg-button-green/90 text-foreground border border-black rounded-design px-4 py-2"
              onClick={() => openPaywall()}
            >
              Start 7-day free trial
            </Button>
          </div>
        </header>

        {/* My ICPs */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-['Fraunces'] text-2xl">My ICPs</h2>
              <p className="font-['Inter'] text-sm text-foreground/70">
                Preview of your generated ICPs. Save them by signing up.
              </p>
            </div>
          </div>

          {guestICPs.length === 0 ? (
            <p className="text-sm text-foreground/60">No ICPs yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guestICPs.map((icp: any, index: number) => (
                <ICPPreviewCard
                  key={icp.id}
                  icp={icp}
                  userTier="free"
                  onUpgrade={handleUpgrade}
                  isLocked={icp.isLocked}
                  brands={[{ id: guestBrand.id, name: guestBrand.name }]}
                  onChangeColor={() => handleUpgrade()}
                  onChangeAvatar={() => handleUpgrade()}
                  onMoveToBrand={() => handleUpgrade()}
                  onDelete={() => {}}
                  onRemoveFromCollection={() => {}}
                  onAddToCollection={() => {}}
                  onCardClickOverride={() => {
                    if (index === 0) {
                      navigate("/icp-preview/0");
                    } else {
                      openPaywall();
                    }
                  }}
                />
              ))}
            </div>
          )}
        </section>

        {/* My Brands */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-['Fraunces'] text-2xl">My Brands</h2>
              <p className="font-['Inter'] text-sm text-foreground/70">
                Manage the business details you use to generate ICPs.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <BrandCard
              brand={guestBrand as any}
              onView={() => openPaywall()}
              onChangeColor={() => openPaywall()}
              onDelete={() => openPaywall()}
              onDuplicate={() => openPaywall()}
              onExportPDF={() => openPaywall()}
            />
          </div>
        </section>

        {/* CTA panel */}
        <div className="bg-background border border-black rounded-design p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-['Fraunces'] text-xl">Start your 7-day free trial</h3>
            <p className="font-['Inter'] text-sm text-foreground/70">
              Full access to edit, save, and unlock marketing insights.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              className="bg-button-green hover:bg-button-green/90 text-foreground border border-black rounded-design px-4 py-2"
              onClick={() => openPaywall()}
            >
              Start 7-day free trial
            </Button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
