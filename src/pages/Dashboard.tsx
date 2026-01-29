import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ICPPreviewCard } from "../components/cards/ICPPreviewCard";
import { CollectionCard as DashboardCollectionCard } from "../components/cards/DashboardCollectionCard";
import { BrandCard } from "../components/cards/BrandCard";
import { useICPs } from "../hooks/useICPs";
import { useBrands } from "../hooks/useBrands";
import { useCollections, type Collection } from "../hooks/useCollections";
import useSubscription from "../hooks/useSubscription";
import { useOutboxSync } from "../hooks/useOutboxSync";
import { useAuth } from "../contexts/AuthContext";
import { usePaywall } from "../contexts/PaywallContext";
import { useAuthModal } from "../contexts/AuthModalContext";
import { WifiOff, AlertCircle } from "lucide-react";
import { exportBrandAsPDF } from "../utils/exportBrand";
import CollectionColorModal from "../components/CollectionColorModal";
import ICPColorModal from "../components/ICPColorModal";
import ICPAvatarModal from "../components/ICPAvatarModal";
import CollectionRenameModal from "../components/CollectionRenameModal";
import CollectionDeleteModal from "../components/CollectionDeleteModal";
import { canCreateICP, canCreateCollection, canViewICP, canCreateBrand, canExportBrand } from "../config/accessRules";
import { supabase } from "../config/supabase";
import DashboardShell from "../layouts/DashboardShell";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { openPaywall } = usePaywall();
  const { openFinishAccount } = useAuthModal();
  const finishPromptedRef = useRef(false);

  // Fetch data from Supabase
  const { user, loading: authLoading } = useAuth();
  const {
    icps: rawICPs,
    isLoading: icpsLoading,
    isOffline: icpsOffline,
    fetchICPs,
    updateICP,
    hasLoadedOnce,
  } = useICPs();
  const {
    brands,
    isLoading: brandsLoading,
    createBrand,
    deleteBrand,
    refetch: refetchBrands,
  } = useBrands();
  const {
    collections,
    isLoading: collectionsLoading,
    isOffline: collectionsOffline,
    refetch: refetchCollections,
  } = useCollections();
  const {
    tier: userTier,
    trialActive,
    ready: subReady,
    loading: subLoading,
    isPro,
  } = useSubscription();
  const { isSyncing, pendingCount } = useOutboxSync();
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [showColorModal, setShowColorModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [creatingBrand, setCreatingBrand] = useState(false);
  const getUniqueBrandName = (baseInput: string, suffixWord: string, existingNames: string[]) => {
    const existing = new Set(existingNames.map((n) => (n || "").trim().toLowerCase()));
    const stripSuffix = (name: string) => {
      let candidate = name.trim();
      const re = new RegExp(`\\s\\(${suffixWord}(?:\\s\\d+)?\\)$`, "i");
      while (re.test(candidate)) {
        candidate = candidate.replace(re, "").trim();
      }
      return candidate;
    };
    const base = stripSuffix(baseInput || "Untitled Brand") || "Untitled Brand";
    if (!existing.has(base.toLowerCase())) return base;
    let i = 1;
    while (true) {
      const candidate = `${base} (${suffixWord}${i === 1 ? "" : ` ${i}`})`;
      if (!existing.has(candidate.toLowerCase())) return candidate;
      i += 1;
    }
  };
  const [icpColorModal, setIcpColorModal] = useState({
    open: false,
    id: null as string | null,
    currentColor: null as string | null,
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const checkout = params.get("checkout");
    const guestRef = params.get("guest_ref");
    const isAnonymous = Boolean((user as any)?.is_anonymous);
    if (checkout === "success" && !finishPromptedRef.current) {
      finishPromptedRef.current = true;
      if (guestRef) {
        openFinishAccount({ guestRef });
      } else if (isAnonymous) {
        openFinishAccount();
      }

      const url = new URL(window.location.href);
      url.searchParams.delete("checkout");
      url.searchParams.delete("guest_ref");
      url.searchParams.delete("session_id");
      window.history.replaceState({}, "", `${url.pathname}${url.search}`);
    }
  }, [location.search, openFinishAccount, user]);

  useEffect(() => {
    if (finishPromptedRef.current) return;
    const isAnonymous = Boolean((user as any)?.is_anonymous);
    if (isAnonymous && isPro) {
      finishPromptedRef.current = true;
      openFinishAccount();
    }
  }, [user, isPro, openFinishAccount]);

  const [icpAvatarModal, setIcpAvatarModal] = useState({
    open: false,
    id: null as string | null,
    currentAvatarKey: null as string | null,
    gender: null as string | null,
    ageRange: null as string | null,
  });

  // Transform ICP data to match component expectations
  const effectiveTier = subReady ? (isPro ? "pro" : "free") : "free";

  const icps = useMemo(() => {
    return rawICPs.map((icp, index) => ({
      ...icp,
      _index: icp._index ?? index,
      tags: icp.tags || [],
      isLocked: subReady ? !canViewICP(effectiveTier as any, icp._index ?? index) : false,
      gender: (icp as any).gender ?? (icp as any).avatar_gender ?? null,
      age_range: (icp as any).age_range ?? (icp as any).avatar_age_range ?? null,
    }));
  }, [rawICPs, subReady, userTier, trialActive, effectiveTier, isPro]);

  const canCreateICPFlag = canCreateICP(icps.length, effectiveTier as any);
  const canCreateCollectionFlag = canCreateCollection(collections.length, effectiveTier as any);
  const canCreateBrandFlag = canCreateBrand(brands.length, effectiveTier as any);

  const handleCreateNew = () => {
    if (!canCreateICPFlag) {
      openPaywall();
      return;
    }
    navigate("/onboarding-build");
  };

  const handleUpgrade = () => {
    openPaywall();
  };

  const handleCreateBrand = async () => {
    if (!canCreateBrandFlag) {
      openPaywall();
      return;
    }
    if (!createBrand) {
      navigate("/my-brands");
      return;
    }
    setCreatingBrand(true);
    try {
      const uniqueName = getUniqueBrandName(
        "Untitled Brand",
        "New",
        (brands || []).map((b: any) => b?.name || "")
      );
      const created = await createBrand({ name: uniqueName } as any);
      await refetchBrands();
      if (created?.id) {
        navigate(`/my-brands/${created.id}`);
      } else {
        navigate("/my-brands");
      }
    } catch (err) {
      console.error("Dashboard: create brand error", err);
      navigate("/my-brands");
    } finally {
      setCreatingBrand(false);
    }
  };

  const handleOpenColorModal = (collection: Collection) => {
    setEditingCollection(collection);
    setShowColorModal(true);
  };

  const handleOpenRenameModal = (collection: Collection) => {
    setEditingCollection(collection);
    setShowRenameModal(true);
  };

  const handleOpenDeleteModal = (collection: Collection) => {
    setEditingCollection(collection);
    setShowDeleteModal(true);
  };

  const handleOpenIcpColorModal = (id: string, currentColor?: string | null) => {
    setIcpColorModal({
      open: true,
      id,
      currentColor: currentColor ?? null,
    });
  };

  const handleOpenIcpAvatarModal = (
    id: string,
    currentAvatarKey?: string | null,
    gender?: string | null,
    ageRange?: string | null
  ) => {
    setIcpAvatarModal({
      open: true,
      id,
      currentAvatarKey: currentAvatarKey ?? null,
      gender: gender ?? null,
      ageRange: ageRange ?? null,
    });
  };

  const handleMoveIcpToBrand = async (icpId: string, brandId: string | null) => {
    await updateICP(icpId, { brand_id: brandId } as any);
    try {
      window.dispatchEvent(new Event("icps:changed"));
    } catch {}
  };

  // Refetch on global change events
  useEffect(() => {
    const onIcpsChanged = () => {
      void fetchICPs();
    };
    const onBrandsChanged = () => {
      void refetchBrands();
    };
    window.addEventListener("icps:changed", onIcpsChanged);
    window.addEventListener("brands:changed", onBrandsChanged);
    return () => {
      window.removeEventListener("icps:changed", onIcpsChanged);
      window.removeEventListener("brands:changed", onBrandsChanged);
    };
  }, [fetchICPs, refetchBrands]);

  const isLoading = authLoading || icpsLoading || collectionsLoading;
  const showEmptyIcps = hasLoadedOnce && !icpsLoading && rawICPs.length === 0;
  const showIcpPlaceholder = !hasLoadedOnce || icpsLoading;

  // Debug logging and error display
  useEffect(() => {
    if (authLoading || icpsLoading || collectionsLoading || subLoading) {
      console.log("Dashboard loading states:", {
        authLoading,
        icpsLoading,
        collectionsLoading,
        subscriptionLoading: subLoading,
        hasUser: !!user,
        userId: user?.id,
        subReady,
      });
    }
  }, [authLoading, icpsLoading, collectionsLoading, subLoading, subReady, user]);

  console.log("Dashboard loading states:", {
    authLoading,
    icpsLoading,
    collectionsLoading,
    subscriptionLoading: subLoading,
    subReady,
    hasUser: !!user,
    hasICPs: icps.length > 0,
    hasCollections: collections.length > 0,
  });

  // Only block on auth loading or missing user; other data can be empty/fail softly.
  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-button-green border-t-transparent rounded-full animate-spin" />
          <p className="text-foreground/70">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <DashboardShell contentClassName="flex-1 px-6 py-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
            {/* Sync Status Banner */}
            {pendingCount > 0 && (
              <div className={`mb-4 px-4 py-3 rounded-design border border-black flex items-center gap-2 ${
                isSyncing 
                  ? "bg-amber-50 text-amber-800" 
                  : icpsOffline || collectionsOffline
                  ? "bg-red-50 text-red-800"
                  : "bg-green-50 text-green-800"
              }`}>
                {isSyncing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium">Syncing changes...</span>
                  </>
                ) : icpsOffline || collectionsOffline ? (
                  <>
                    <WifiOff className="w-4 h-4" />
                    <span className="text-sm font-medium">Some changes pending sync ({pendingCount})</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">All changes synced</span>
                  </>
                )}
              </div>
            )}
            {/* Offline Banner */}
            {(icpsOffline || collectionsOffline) && !isLoading && (
              <div className="mb-6 bg-amber-50 border border-amber-200 rounded-design p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-amber-800 font-['Inter']">
                    We're having trouble syncing with the server. Your ICPs are saved locally and will sync automatically when the connection is restored.
                  </p>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 border-4 border-button-green border-t-transparent rounded-full animate-spin" />
                  <p className="text-foreground/70 mb-2">Loading...</p>
                  <p className="text-xs text-foreground/50">
                    {authLoading && "Authenticating..."}
                    {!authLoading && icpsLoading && "Loading ICPs..."}
                    {!authLoading && !icpsLoading && collectionsLoading && "Loading collections..."}
                    {!authLoading && !icpsLoading && !collectionsLoading && subLoading && "Loading subscription..."}
                  </p>
                </div>
              </div>
            )}

            {!isLoading && (
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h1 className="font-['Fraunces'] text-3xl lg:text-4xl mb-2">Dashboard</h1>
                  <p className="font-['Inter'] text-foreground/70">Quick overview of your ICPs and collections.</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => {
                      if (!canCreateCollectionFlag) {
                        openPaywall();
                        return;
                      }
                      navigate("/collections");
                    }}
                    variant="outline"
                    className="border-black rounded-design px-4 py-2"
                  >
                    Create Collection
                  </Button>
                  <Button
                    onClick={handleCreateBrand}
                    variant="outline"
                    className="border-black rounded-design px-4 py-2"
                    disabled={creatingBrand}
                  >
                    {creatingBrand ? "Creating Brand..." : "Create New Brand"}
                  </Button>
                  <Button
                    onClick={handleCreateNew}
                    className="bg-button-green hover:bg-button-green/90 text-foreground border border-black rounded-design px-4 py-2"
                  >
                    Create New ICP
                  </Button>
                </div>
              </div>
            )}

            {!isLoading && user && subReady && !isPro && (
              <div className="mb-8 bg-background border border-black rounded-design p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-['Fraunces'] text-xl">Start your 7-day trial</h2>
                  <p className="font-['Inter'] text-sm text-foreground/70">
                    Add payment details to unlock Pro features.
                  </p>
                </div>
                <Button
                  onClick={() => openPaywall()}
                  className="bg-button-green hover:bg-button-green/90 text-foreground border border-black rounded-design px-5 py-3"
                >
                  Start 7-day trial
                </Button>
              </div>
            )}

            {/* My ICPs overview */}
            {!isLoading && (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-['Fraunces'] text-2xl">My ICPs</h2>
                    <p className="font-['Inter'] text-sm text-foreground/70">Quick view of your latest ideal customers.</p>
                  </div>
                  {icps.length > 3 && (
                    <Button
                      variant="outline"
                      className="border-black rounded-design"
                      onClick={() => navigate("/icps")}
                    >
                      View all ICPs
                    </Button>
                  )}
                </div>

                {showIcpPlaceholder ? (
                  <div className="text-foreground/60 text-sm">Loading ICPs...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {icps.slice(0, 3).map((icp, index) => (
                      <ICPPreviewCard
                        key={icp.id}
                        icp={icp}
                        userTier={effectiveTier}
                        onUpgrade={handleUpgrade}
                        isLocked={subReady ? !canViewICP(effectiveTier as any, icp._index ?? index) : false}
                        onChangeColor={handleOpenIcpColorModal}
                        onChangeAvatar={handleOpenIcpAvatarModal}
                        brands={brands?.map((b) => ({ id: b.id, name: b.name })) || []}
                        onMoveToBrand={handleMoveIcpToBrand}
                        onDelete={fetchICPs}
                      />
                    ))}
                    {showEmptyIcps && <p className="text-sm text-foreground/60">No ICPs yet.</p>}
                  </div>
                )}
              </section>
            )}

            {/* My Brands overview */}
            {!isLoading && (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-['Fraunces'] text-2xl">My Brands</h2>
                    <p className="font-['Inter'] text-sm text-foreground/70">
                      Manage the business details you use to generate ICPs.
                    </p>
                  </div>
                  {brands.length > 3 && (
                    <Button
                      variant="outline"
                      className="border-black rounded-design"
                      onClick={() => navigate("/my-brands")}
                    >
                      View all brands
                    </Button>
                  )}
                </div>

                {brandsLoading ? (
                  <div className="text-foreground/60 text-sm">Loading brands...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {brands.slice(0, 3).map((brand: any) => (
                      <BrandCard
                        key={brand.id}
                        brand={brand}
                        onView={() => navigate(`/my-brands/${brand.id}`)}
                        onDuplicate={async () => {
                          if (!canCreateBrandFlag) {
                            openPaywall();
                            return;
                          }
                          if (!createBrand) return;
                          const { id: _id, user_id: _uid, created_at: _c, updated_at: _u, ...rest } =
                            brand || {};
                          const uniqueName = getUniqueBrandName(
                            brand?.name || "Untitled Brand",
                            "Copy",
                            (brands || []).map((b: any) => b?.name || "")
                          );
                          const copyPayload = {
                            ...rest,
                            name: uniqueName,
                            color: brand?.color ?? null,
                          };
                          const created = await createBrand(copyPayload as any);
                          await refetchBrands();
                          if (created?.id) {
                            navigate(`/my-brands/${created.id}`);
                          }
                        }}
                        onExportPDF={() => {
                          if (!canExportBrand(userTier as any)) {
                            openPaywall();
                            return;
                          }
                          exportBrandAsPDF(brand);
                        }}
                        onDelete={() => {
                          const ok = window.confirm(
                            "Delete this brand? ICPs will remain but will be unassigned."
                          );
                          if (!ok) return;
                          if (!deleteBrand) {
                            navigate("/my-brands");
                            return;
                          }
                          deleteBrand(brand.id).then(() => {
                            void refetchBrands();
                          });
                        }}
                      />
                    ))}
                    {!brands.length && <p className="text-sm text-foreground/60">No brands yet.</p>}
                  </div>
                )}
              </section>
            )}

            {/* Collections overview */}
            {!isLoading && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-['Fraunces'] text-2xl">My Collections</h2>
                    <p className="font-['Inter'] text-sm text-foreground/70">Organise your ICPs for campaigns, products, or teams.</p>
                  </div>
                  {collections.length > 3 && (
                    <Button
                      variant="outline"
                      className="border-black rounded-design"
                      onClick={() => navigate("/collections")}
                    >
                      View all Collections
                    </Button>
                  )}
                </div>

                {collectionsLoading ? (
                  <div className="text-foreground/60 text-sm">Loading collections...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {collections.slice(0, 3).map((collection) => (
                      <DashboardCollectionCard
                        key={collection.id}
                        collection={{
                          id: collection.id,
                          name: collection.name,
                          icpCount: collection.icpCount || 0,
                          lastUpdated: collection.updated_at || collection.created_at,
                          color: collection.color,
                          isLocked: collection.isLocked,
                          tags: collection.tags || [],
                        }}
                        onRename={() => handleOpenRenameModal(collection)}
                        onChangeColor={() => handleOpenColorModal(collection)}
                        onDelete={() => handleOpenDeleteModal(collection)}
                      />
                    ))}
                    {!collections.length && <p className="text-sm text-foreground/60">No collections yet.</p>}
                  </div>
                )}
              </section>
            )}
        </div>
      </DashboardShell>

      <CollectionColorModal
        open={showColorModal}
        id={editingCollection?.id ?? null}
        currentColor={editingCollection?.color ?? null}
        onClose={() => setShowColorModal(false)}
        onSaved={async () => {
          setShowColorModal(false);
          await refetchCollections();
        }}
      />

      <ICPColorModal
        isOpen={icpColorModal.open}
        id={icpColorModal.id}
        currentColor={icpColorModal.currentColor}
        onClose={() => setIcpColorModal({ open: false, id: null, currentColor: null })}
        onSaved={async () => {
          setIcpColorModal({ open: false, id: null, currentColor: null });
          await fetchICPs();
        }}
      />

      <ICPAvatarModal
        isOpen={icpAvatarModal.open}
        icpId={icpAvatarModal.id}
        currentAvatarKey={icpAvatarModal.currentAvatarKey}
        gender={icpAvatarModal.gender}
        ageRange={icpAvatarModal.ageRange}
        onClose={() =>
          setIcpAvatarModal({
            open: false,
            id: null,
            currentAvatarKey: null,
            gender: null,
            ageRange: null,
          })
        }
        onSaved={async () => {
          await fetchICPs();
        }}
      />

      <CollectionRenameModal
        isOpen={showRenameModal}
        initialName={editingCollection?.name || ""}
        onClose={() => setShowRenameModal(false)}
        onConfirm={async (newName) => {
          if (!editingCollection?.id) return;
          const { error } = await supabase
            .from("collections")
            .update({ name: newName })
            .eq("id", editingCollection.id);

          if (error) {
            console.error("Dashboard: Rename failed", error);
          } else {
            await refetchCollections();
          }
          setShowRenameModal(false);
        }}
      />

      <CollectionDeleteModal
        isOpen={showDeleteModal}
        collectionName={editingCollection?.name || ""}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={async () => {
          if (!editingCollection?.id) return;
          const { error } = await supabase.from("collections").delete().eq("id", editingCollection.id);
          if (error) {
            console.error("Dashboard: Failed to delete collection", error);
          } else {
            await refetchCollections();
          }
          setShowDeleteModal(false);
        }}
      />
    </>
  );
}
