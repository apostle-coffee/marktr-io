import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import DashboardShell from "../layouts/DashboardShell";
import { useBrands, Brand } from "../hooks/useBrands";
import "../styles/Modal.css";
import { ArrowLeft, Save, MoreVertical, Trash2, Palette, Copy, FileText } from "lucide-react";
import { TagInput } from "../components/ui/tag-input";
import useSubscription from "../hooks/useSubscription";
import { usePaywall } from "../contexts/PaywallContext";
import { useICPs } from "../hooks/useICPs";
import { generateICPs } from "../lib/ai/pipeline";
import { ICPPreviewCard } from "../components/cards/ICPPreviewCard";
import ICPColorModal from "../components/ICPColorModal";
import ICPAvatarModal from "../components/ICPAvatarModal";
import BrandDeleteModal from "../components/BrandDeleteModal";
import BrandColorModal from "../components/BrandColorModal";
import { exportBrandAsPDF } from "../utils/exportBrand";
import { canCreateBrand, canExportBrand } from "../config/accessRules";

type DirtyTrackFields = Partial<Brand>;

export default function BrandEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { brands, getBrand, updateBrand, deleteBrand, createBrand } = useBrands();
  const { tier: userTier, effectiveTier, trialActive, isLoading: subscriptionLoading } = useSubscription();
  const { openPaywall } = usePaywall();
  const { icps, createICP, fetchICPs, updateICP } = useICPs();

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [isLoading, setIsLoading] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateStatus, setGenerateStatus] = useState<"idle" | "generating" | "success" | "error">("idle");

  // ------------------------------------------------------------
  // Generating UX (mirrors onboarding "what's happening" lines)
  // ------------------------------------------------------------
  const GENERATE_LINES = useMemo(
    () => [
      "Analysing your brand details…",
      "Mapping motivations and buying triggers…",
      "Optimising pain points and objections…",
      "Shaping your new customer profiles…",
      "Turning insights into clear next steps…",
    ],
    []
  );
  const [generateLineIndex, setGenerateLineIndex] = useState(0);
  const [generateLineOverride, setGenerateLineOverride] = useState<string | null>(null);

  useEffect(() => {
    if (!isGenerating) return;
    setGenerateLineIndex(0);
    setGenerateLineOverride(null);
    const t = setInterval(() => {
      setGenerateLineIndex((prev) => (prev + 1) % GENERATE_LINES.length);
    }, 2000);
    return () => clearInterval(t);
  }, [isGenerating, GENERATE_LINES.length]);
  const pendingNavRef = useRef<string | null>(null);
  const originalDataRef = useRef<DirtyTrackFields | null>(null);
  const [icpColorModal, setIcpColorModal] = useState({
    open: false,
    id: null as string | null,
    currentColor: null as string | null,
  });
  const [icpAvatarModal, setIcpAvatarModal] = useState({
    open: false,
    id: null as string | null,
    currentAvatarKey: null as string | null,
    gender: null as string | null,
    ageRange: null as string | null,
  });
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [brandColorModal, setBrandColorModal] = useState({
    open: false,
    id: null as string | null,
    currentColor: null as string | null,
  });
  const [, setIsExporting] = useState(false);

  const handleOpenIcpColorModal = (icpId: string, currentColor?: string | null) => {
    setIcpColorModal({
      open: true,
      id: icpId,
      currentColor: currentColor ?? null,
    });
  };

  const handleOpenIcpAvatarModal = (
    icpId: string,
    currentAvatarKey?: string | null,
    gender?: string | null,
    ageRange?: string | null
  ) => {
    setIcpAvatarModal({
      open: true,
      id: icpId,
      currentAvatarKey: currentAvatarKey ?? null,
      gender: gender ?? null,
      ageRange: ageRange ?? null,
    });
  };

  const [brandData, setBrandData] = useState<DirtyTrackFields>({
    name: "",
    business_description: "",
    product_or_service: "",
    business_type: "B2C",
    assumed_audience: [],
    marketing_channels: [],
    country: "",
    region_or_city: "",
    currency: "GBP",
    website: "",
  });

  // Load brand
  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setIsLoading(true);
      const brand = await getBrand(id);
      if (brand) {
        setBrandData(brand);
        originalDataRef.current = brand;
        setIsDirty(false);
      } else {
        navigate("/my-brands");
      }
      setIsLoading(false);
    };
    load();
  }, [id, getBrand, navigate]);

  // Warn on browser/tab close if dirty
  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  // Track dirty
  useEffect(() => {
    if (!originalDataRef.current) return;
    const serialize = (data: DirtyTrackFields) =>
      JSON.stringify({
        name: data.name || "",
        business_description: data.business_description || "",
        product_or_service: data.product_or_service || "",
        business_type: data.business_type || "",
        assumed_audience: data.assumed_audience || [],
        marketing_channels: data.marketing_channels || [],
        country: data.country || "",
        region_or_city: data.region_or_city || "",
        currency: data.currency || "",
        website: data.website || "",
      });
    const current = serialize(brandData);
    const original = serialize(originalDataRef.current);
    setIsDirty(current !== original);
  }, [brandData]);

  // Intercept in-app navigation
  useEffect(() => {
    if (!isDirty) return;
    const onClickCapture = (e: MouseEvent) => {
      if (!isDirty) return;
      if (e.defaultPrevented) return;
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest("[data-allow-navigation='true']")) return;
      const anchor = target.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href) return;
      if (href.startsWith("#")) return;
      if (anchor.target === "_blank") return;
      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) return;
      const nextPath = `${url.pathname}${url.search}${url.hash}`;
      const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (nextPath === currentPath) return;
      e.preventDefault();
      e.stopPropagation();
      pendingNavRef.current = nextPath;
      setLeaveDialogOpen(true);
    };
    document.addEventListener("click", onClickCapture, true);
    return () => document.removeEventListener("click", onClickCapture, true);
  }, [isDirty]);

  const handleSave = useCallback(async (): Promise<boolean> => {
    if (!id) return false;
    setIsSaving(true);
    setSaveStatus("saving");

    const updates = {
      name: brandData.name,
      business_description: brandData.business_description,
      product_or_service: brandData.product_or_service,
      business_type: brandData.business_type,
      assumed_audience: brandData.assumed_audience,
      marketing_channels: brandData.marketing_channels,
      country: brandData.country,
      region_or_city: brandData.region_or_city,
      currency: brandData.currency,
      website: brandData.website,
    };

    const success = await updateBrand(id, updates);
    if (!success) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
      alert("Failed to save changes. Please try again.");
      setIsSaving(false);
      return false;
    }

    originalDataRef.current = { ...brandData, ...updates };
    setIsDirty(false);
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 3000);
    setIsSaving(false);
    return true;
  }, [brandData, id, updateBrand]);

  const performPendingNavigation = (path: string | null) => {
    if (!path) return;
    pendingNavRef.current = null;
    navigate(path);
  };

  const handleLeaveWithoutSaving = () => {
    setLeaveDialogOpen(false);
    performPendingNavigation(pendingNavRef.current);
  };

  const handleCloseLeaveDialog = () => {
    pendingNavRef.current = null;
    setLeaveDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    setDeleteError(null);
    const ok = await deleteBrand(id);
    setIsDeleting(false);
    if (ok) {
      setDeleteOpen(false);
      navigate("/my-brands");
    } else {
      setDeleteError("Couldn’t delete this brand. Please try again.");
    }
  };

  const handleDuplicateBrand = async () => {
    if (!id) return;
    if (!canCreateBrand((brands || []).length, effectiveTier as any)) {
      openPaywall();
      return;
    }
    try {
      const getUniqueName = (baseInput: string, suffixWord: string, existingNames: string[]) => {
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

      const uniqueName = getUniqueName(
        brandData.name || "Brand",
        "Copy",
        (brands || []).map((b) => b?.name || "")
      );

      const copyPayload = {
        ...brandData,
        name: uniqueName,
      };
      delete (copyPayload as any).id;
      delete (copyPayload as any).user_id;
      delete (copyPayload as any).created_at;
      delete (copyPayload as any).updated_at;

      const created = await createBrand(copyPayload as any);
      if (created?.id) {
        navigate(`/my-brands/${created.id}`);
      }
    } catch (err) {
      console.error("Duplicate brand failed", err);
    }
  };

  const handleExportBrand = async () => {
    if (!brandData) return;
    if (!canExportBrand(effectiveTier as any)) {
      if (!subscriptionLoading) openPaywall();
      return;
    }
    setIsExporting(true);
    try {
      exportBrandAsPDF(brandData as any);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveAndLeave = async () => {
    const ok = await handleSave();
    if (!ok) return;
    setLeaveDialogOpen(false);
    performPendingNavigation(pendingNavRef.current);
  };

  const handleGenerate = async () => {
    if (userTier === "free" && !trialActive) {
      if (!subscriptionLoading) openPaywall();
      return;
    }
    if (!id) return;
    setIsGenerating(true);
    setGenerateStatus("generating");
    try {
      setGenerateLineOverride(null);
      const safeText = (v: unknown, fallback: string) => {
        const s = typeof v === "string" ? v.trim() : "";
        return s.length ? s : fallback;
      };

      const payload = {
        // Edge function requires these to be non-empty strings
        name: safeText(brandData.name, "Founder"),
        brandName: safeText(brandData.name, "Brand"),
        businessDescription: safeText(
          brandData.business_description,
          "Not provided"
        ),
        productOrService: safeText(
          brandData.product_or_service,
          "Not provided"
        ),
        assumedAudience: brandData.assumed_audience ?? [],
        marketingChannels: brandData.marketing_channels ?? [],
        country: safeText(brandData.country, "United Kingdom"),
        regionOrCity: safeText(brandData.region_or_city, ""),
        currency: safeText(brandData.currency, "GBP"),
      };

      const result = await generateICPs(payload as any);
      const generated = (result as any)?.icps ?? [];
      const created: any[] = [];
      for (const icp of generated) {
        const createdRow = await createICP({
          ...icp,
          brand_id: id,
        } as any);
        if (createdRow) created.push(createdRow);
      }

      setGenerateStatus("success");
      try {
        window.dispatchEvent(new Event("icps:changed"));
      } catch {}
      try {
        await fetchICPs(true);
      } catch {}

      // Give the user a clear final cue before navigation
      setGenerateLineOverride("Taking you to your new ICPs…");
      await new Promise((r) => setTimeout(r, 350));

      if (created[0]?.id) {
        navigate(`/icp/${created[0].id}`);
      } else {
        navigate("/icps");
      }
    } catch (err) {
      console.error("BrandEditor: generate ICPS error", err);
      setGenerateStatus("error");
      alert("Generation failed. Please check your Brand fields and try again.");
    } finally {
      setIsGenerating(false);
      setTimeout(() => setGenerateStatus("idle"), 3000);
    }
  };

  if (isLoading) {
    return (
      <DashboardShell contentClassName="flex-1 px-6 py-8 lg:px-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-button-green border-t-transparent rounded-full animate-spin" />
            <p className="text-foreground/70">Loading brand...</p>
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (import.meta.env.DEV) {
    console.log("[BrandEditor] tier", { userTier, subscriptionLoading });
  }

  return (
    <DashboardShell contentClassName="flex-1 px-6 py-8 lg:px-12">
      {leaveDialogOpen && (
        <div
          className="modal-overlay"
          onClick={() => {
            pendingNavRef.current = null;
            setLeaveDialogOpen(false);
          }}
        >
          <div
            className="modal-content modal-content-wide"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleCloseLeaveDialog();
              }}
              aria-label="Close"
            >
              ×
            </button>

            <h2>Save changes before leaving?</h2>
            <p>
              You have unsaved edits.
              <br />
              Leave without saving or save and continue.
            </p>

            <div className="modal-buttons modal-buttons-2">
              <button className="modal-cancel" onClick={handleLeaveWithoutSaving}>
                Leave without saving
              </button>
              <button
                className="modal-save"
                onClick={handleSaveAndLeave}
                disabled={isSaving}
              >
                {isSaving ? "Saving…" : "Save & leave"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto w-full">
        <header className="border-b border-warm-grey bg-background sticky top-0 z-40">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link to="/my-brands" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-['Inter']">Back to My Brands</span>
                </Link>
                {isDirty && saveStatus !== "saving" && (
                  <span className="text-sm text-amber-700 bg-amber-100 border border-amber-300 rounded-full px-3 py-1 font-['Inter']">
                    Unsaved changes
                  </span>
                )}
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-button-green hover:bg-button-green/90 text-foreground border border-black rounded-design px-6 py-2 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
                {saveStatus === "saved" && !isDirty && (
                  <span className="text-sm text-green-700 bg-green-100 border border-green-300 rounded-full px-3 py-1 font-['Inter']">
                    Saved
                  </span>
                )}
                {saveStatus === "error" && (
                  <span className="text-sm text-red-700 bg-red-100 border border-red-300 rounded-full px-3 py-1 font-['Inter']">
                    Save failed
                  </span>
                )}
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="bg-background hover:bg-accent-grey/20 text-foreground border border-black rounded-design px-6 py-2 flex items-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <span
                        className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin"
                        aria-hidden="true"
                      />
                      <span>Generating…</span>
                    </>
                  ) : (
                    "Generate new ICPs"
                  )}
                </Button>

                {/* Live status line while generating */}
                {isGenerating && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs font-['Inter'] text-foreground/70">
                      {generateLineOverride ?? GENERATE_LINES[generateLineIndex]}
                    </span>
                  </div>
                )}

                {generateStatus === "success" && !isGenerating && (
                  <span className="text-sm text-green-700 bg-green-100 border border-green-300 rounded-full px-3 py-1 font-['Inter']">
                    Generated
                  </span>
                )}
                {generateStatus === "error" && (
                  <span className="text-sm text-red-700 bg-red-100 border border-red-300 rounded-full px-3 py-1 font-['Inter']">
                    Generation failed
                  </span>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="p-2 bg-background rounded-full border border-black hover:scale-105 transition-transform h-10 w-10 flex items-center justify-center"
                    aria-label="Brand actions"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[180px] border border-black rounded-design bg-neutral-light text-foreground shadow-lg">
                  <DropdownMenuItem
                    className="text-sm"
                    onSelect={(e) => {
                      e.preventDefault();
                      (e as any).stopPropagation?.();
                      handleDuplicateBrand();
                    }}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate Brand
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-sm"
                    onSelect={(e) => {
                      e.preventDefault();
                      (e as any).stopPropagation?.();
                      handleExportBrand();
                    }}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-sm"
                    onSelect={(e) => {
                      e.preventDefault();
                      (e as any).stopPropagation?.();
                      setBrandColorModal({
                        open: true,
                        id: id ?? null,
                        currentColor: (brandData as any)?.color ?? null,
                      });
                    }}
                  >
                    <Palette className="h-4 w-4 mr-2" />
                    Change Colour
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-sm text-red-600 focus:text-red-600"
                    onSelect={(e) => {
                      e.preventDefault();
                      (e as any).stopPropagation?.();
                      setDeleteError(null);
                      setDeleteOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Brand
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-12 max-w-4xl space-y-8">
          <div className="bg-background border border-black rounded-design p-8 shadow-md animate-fade-in-up space-y-6">
            <div className="space-y-4">
              <label className="font-['Inter'] text-sm text-foreground/70">Brand name</label>
              <Input
                value={brandData.name || ""}
                onChange={(e) => setBrandData((prev) => ({ ...prev, name: e.target.value }))}
                className="font-['Fraunces'] text-2xl border-black rounded-design"
                placeholder="Apostle Coffee"
              />
            </div>

            <div className="space-y-3">
              <label className="font-['Inter'] text-sm text-foreground/70">Business description</label>
              <Textarea
                value={brandData.business_description || ""}
                onChange={(e) => setBrandData((prev) => ({ ...prev, business_description: e.target.value }))}
                className="border-black rounded-design resize-none"
                rows={3}
                placeholder="Describe what the business does"
              />
            </div>

            <div className="space-y-3">
              <label className="font-['Inter'] text-sm text-foreground/70">Product or service</label>
              <Input
                value={brandData.product_or_service || ""}
                onChange={(e) => setBrandData((prev) => ({ ...prev, product_or_service: e.target.value }))}
                className="border-black rounded-design"
                placeholder="e.g., Marketing consultancy, Organic coffee subscription"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="font-['Inter'] text-sm text-foreground/70">Business type</label>
                <select
                  value={brandData.business_type || "B2C"}
                  onChange={(e) => setBrandData((prev) => ({ ...prev, business_type: e.target.value }))}
                  className="border border-black rounded-design px-4 py-3 bg-white font-['Inter'] text-foreground"
                >
                  {["B2C", "B2B", "Both"].map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <label className="font-['Inter'] text-sm text-foreground/70">Currency</label>
                <Input
                  value={brandData.currency || ""}
                  onChange={(e) => setBrandData((prev) => ({ ...prev, currency: e.target.value }))}
                  className="border-black rounded-design"
                  placeholder="e.g., GBP, USD"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="font-['Inter'] text-sm text-foreground/70">Country</label>
                <Input
                  value={brandData.country || ""}
                  onChange={(e) => setBrandData((prev) => ({ ...prev, country: e.target.value }))}
                  className="border-black rounded-design"
                  placeholder="United States"
                />
              </div>
              <div className="space-y-3">
                <label className="font-['Inter'] text-sm text-foreground/70">Region / City (optional)</label>
                <Input
                  value={brandData.region_or_city || ""}
                  onChange={(e) => setBrandData((prev) => ({ ...prev, region_or_city: e.target.value }))}
                  className="border-black rounded-design"
                  placeholder="California, London, Berlin"
                />
              </div>
            </div>

            <TagInput
              label="Assumed audience (comma-separated)"
              value={brandData.assumed_audience ?? []}
              onChange={(next) =>
                setBrandData((prev) => ({ ...prev, assumed_audience: next }))
              }
              placeholder="e.g. Busy professionals, Parents, Students"
            />

            <TagInput
              label="Marketing channels (comma-separated)"
              value={brandData.marketing_channels ?? []}
              onChange={(next) =>
                setBrandData((prev) => ({ ...prev, marketing_channels: next }))
              }
              placeholder="e.g. Instagram, Email, Google Ads"
            />
            <div className="space-y-3">
              <label className="font-['Inter'] text-sm text-foreground/70">Website (optional)</label>
              <Input
                value={brandData.website || ""}
                onChange={(e) => setBrandData((prev) => ({ ...prev, website: e.target.value }))}
                className="border-black rounded-design"
                placeholder="https://example.com"
              />
            </div>
          </div>

          {/* Associated ICPs */}
          <div className="bg-background border border-black rounded-design p-8 shadow-md animate-fade-in-up space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-['Fraunces'] text-2xl">ICPs for this brand</h2>
                <p className="font-['Inter'] text-sm text-foreground/70">
                  These profiles are linked to this brand. If you delete the brand, they’ll stay and become “No brand allocated”.
                </p>
              </div>
              <Button
                onClick={() => navigate("/icps")}
                className="bg-background hover:bg-accent-grey/20 text-foreground border border-black rounded-design px-4 py-2"
              >
                View all ICPs
              </Button>
            </div>

            {(() => {
              const brandICPs = (icps || [])
                .filter((x: any) => x?.brand_id === id)
                .map((x: any) => ({
                  ...x,
                  brandName: (brandData?.name as any) || "Untitled Brand",
                }));

              if (!brandICPs.length) {
                return (
                  <div className="text-sm text-foreground/70 font-['Inter']">
                    No ICPs linked to this brand yet. Click <span className="font-medium">Generate new ICPs</span> to create some.
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {brandICPs.map((icp: any) => (
                    <ICPPreviewCard
                      key={icp.id}
                      icp={icp}
                      userTier={userTier}
                      onUpgrade={() => {
                        if (!subscriptionLoading) openPaywall();
                      }}
                      isLocked={false}
                      onDelete={() => fetchICPs(true)}
                      onChangeColor={handleOpenIcpColorModal}
                      onChangeAvatar={handleOpenIcpAvatarModal}
                      brands={brands?.map((b) => ({ id: b.id, name: b.name })) || []}
                      onMoveToBrand={async (icpId, brandId) => {
                        await updateICP(icpId, { brand_id: brandId } as any);
                        try {
                          window.dispatchEvent(new Event("icps:changed"));
                        } catch {}
                        await fetchICPs(true);
                      }}
                    />
                  ))}
                </div>
              );
            })()}
          </div>
        </main>

      <ICPColorModal
        isOpen={icpColorModal.open}
        id={icpColorModal.id}
        currentColor={icpColorModal.currentColor}
        onClose={() => setIcpColorModal({ open: false, id: null, currentColor: null })}
        onSaved={async () => {
          setIcpColorModal({ open: false, id: null, currentColor: null });
          try {
            window.dispatchEvent(new Event("icps:changed"));
          } catch {}
          await fetchICPs(true);
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
          try {
            window.dispatchEvent(new Event("icps:changed"));
          } catch {}
          await fetchICPs(true);
        }}
      />
      <BrandColorModal
        open={brandColorModal.open}
        id={brandColorModal.id}
        currentColor={brandColorModal.currentColor}
        onClose={() => setBrandColorModal({ open: false, id: null, currentColor: null })}
        onSaved={(color) => {
          setBrandColorModal({ open: false, id: null, currentColor: null });
          if (color) {
            setBrandData((prev) => ({ ...prev, color }));
            if (originalDataRef.current) {
              originalDataRef.current = { ...(originalDataRef.current as any), color };
            }
          }
        }}
      />
      <BrandDeleteModal
        isOpen={deleteOpen}
        onClose={() => {
          if (isDeleting) return;
          setDeleteOpen(false);
          setDeleteError(null);
        }}
        onConfirm={handleConfirmDelete}
        brandName={brandData?.name || "this brand"}
        isDeleting={isDeleting}
        error={deleteError}
      />
      </div>
    </DashboardShell>
  );
}
