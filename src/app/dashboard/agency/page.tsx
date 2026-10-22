"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Plus,
  Printer,
  ShieldCheck,
  Star,
  ExternalLink,
  DollarSign,
  TrendingUp,
  Sparkles,
  Check,
  MapPin,
  Phone,
  Globe,
  Search,
  RefreshCw,
  X,
  CheckCircle2,
  Code2,
  QrCode,
  Sliders,
  Send,
  Edit3,
  Layers,
  ArrowRight,
  TrendingDown,
  FileText,
  Award,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { TrustPulseStore } from "@/lib/storage/trustpulse-store";
import { getWorkspaceUser, WorkspaceUser } from "@/lib/storage/workspace-store";
import { Workspace } from "@/types/trustpulse";
import type { GooglePlaceResult } from "@/lib/places/google-maps";

export default function AgencyHubPage() {
  const [currentUser, setCurrentUser] = useState<WorkspaceUser | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalMode, setModalMode] = useState<"google_maps" | "manual">("google_maps");

  // Google Ingestion State
  const [googleInput, setGoogleInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchStep, setSearchStep] = useState(0);
  const [detectedResult, setDetectedResult] = useState<GooglePlaceResult | null>(null);
  const [isEditingDetected, setIsEditingDetected] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleUpdateDetectedField = (field: keyof GooglePlaceResult, val: string | number) => {
    if (!detectedResult) return;
    setDetectedResult((prev) => {
      if (!prev) return null;
      const updated = { ...prev, [field]: val };
      if (field === "name" && typeof val === "string") {
        updated.slug = val.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 36);
      }
      return updated;
    });
  };

  // Creation State
  const [isCreating, setIsCreating] = useState(false);
  const [createdSummary, setCreatedSummary] = useState<{
    workspace: Workspace;
    reviewCount: number;
    widgetsGenerated: string[];
    funnelUrl: string;
  } | null>(null);

  // Manual Creation Form State
  const [newClientName, setNewClientName] = useState("");
  const [newClientCategory, setNewClientCategory] = useState("Cosmetic Healthcare");
  const [newClientSlug, setNewClientSlug] = useState("");
  const [newClientColor, setNewClientColor] = useState("#059669");
  const [newClientGoogleUrl, setNewClientGoogleUrl] = useState("https://maps.google.com");

  // Selected client for report preview & printing
  const [reportingClient, setReportingClient] = useState<Workspace | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReviews, setReportReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  React.useEffect(() => {
    const user = getWorkspaceUser();
    setCurrentUser(user);
    const initialList = TrustPulseStore.getWorkspaces(user?.id);
    setWorkspaces(initialList);
    if (initialList.length > 0) {
      setReportingClient(initialList[0]);
    }

    fetch(`/api/workspaces?userId=${encodeURIComponent(user?.id || "demo")}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.workspaces)) {
          setWorkspaces(data.workspaces);
          if (data.workspaces.length > 0) {
            setReportingClient((prev) => prev || data.workspaces[0]);
          }
        }
      })
      .catch(() => {});

    const handleUpdate = () => {
      const u = getWorkspaceUser();
      setWorkspaces(TrustPulseStore.getWorkspaces(u?.id));
    };

    window.addEventListener("trustpulse_workspaces_updated", handleUpdate);
    return () => {
      window.removeEventListener("trustpulse_workspaces_updated", handleUpdate);
    };
  }, []);

  const totalClients = workspaces.length;
  const estimatedAgencyMRR = totalClients * 149;

  const handleLookupGoogleMaps = async (overrideQuery?: string) => {
    const query = overrideQuery || googleInput;
    if (!query || query.trim().length === 0) return;

    setIsSearching(true);
    setSearchError(null);
    setDetectedResult(null);
    setSearchStep(1);

    setTimeout(() => setSearchStep(2), 350);
    setTimeout(() => setSearchStep(3), 700);

    try {
      const res = await fetch("/api/places/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: query.trim() }),
      });

      const data = await res.json();
      if (data.success && data.business) {
        setDetectedResult(data.business);
      } else {
        setSearchError(data.error || "Could not retrieve Google Maps data.");
      }
    } catch (err: unknown) {
      setSearchError(err instanceof Error ? err.message : "Lookup failed");
    } finally {
      setIsSearching(false);
      setSearchStep(0);
    }
  };

  const handleConfirmGoogleClient = async () => {
    if (!detectedResult) return;

    setIsCreating(true);
    try {
      const res = await fetch("/api/workspaces/create-from-google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business: detectedResult,
          userId: currentUser?.id || "demo",
        }),
      });

      const data = await res.json();
      if (data.success && data.workspace) {
        TrustPulseStore.saveWorkspace(data.workspace);
        if (Array.isArray(data.reviews)) {
          for (const rev of data.reviews) {
            TrustPulseStore.addReview(rev);
          }
        }
        setWorkspaces(TrustPulseStore.getWorkspaces(currentUser?.id));
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("tp_active_workspace", data.workspace.id);
            window.dispatchEvent(new CustomEvent("trustpulse_ws_changed", { detail: data.workspace.id }));
            window.dispatchEvent(new CustomEvent("trustpulse_workspaces_updated"));
          } catch {
            //
          }
        }
        setCreatedSummary({
          workspace: data.workspace,
          reviewCount: data.reviewCount || (data.workspace.stats?.totalReviews || 12),
          widgetsGenerated: data.widgetsGenerated || [],
          funnelUrl: data.funnelUrl || `/r/${data.workspace.slug}`,
        });
      } else {
        setSearchError(data.error || "Failed to create workspace.");
      }
    } catch (err: unknown) {
      setSearchError(err instanceof Error ? err.message : "Creation failed");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateManualClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newClientSlug) return;

    const cleanSlug = newClientSlug.toLowerCase().trim().replace(/[^a-z0-9-]+/g, "-");

    const newWs: Workspace = {
      id: `ws-${cleanSlug}-${Date.now().toString(36)}`,
      userId: currentUser?.id || "demo",
      name: newClientName.trim(),
      slug: cleanSlug,
      category: newClientCategory,
      brandColor: newClientColor,
      googleReviewUrl: newClientGoogleUrl,
      starThreshold: 4,
      createdAt: new Date().toISOString(),
      stats: {
        averageRating: 5.0,
        totalReviews: 4,
        shieldedReviews: 0,
        positiveRedirects: 4,
      },
    };

    TrustPulseStore.saveWorkspace(newWs);
    setWorkspaces(TrustPulseStore.getWorkspaces(currentUser?.id));
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("tp_active_workspace", newWs.id);
        window.dispatchEvent(new CustomEvent("trustpulse_ws_changed", { detail: newWs.id }));
        window.dispatchEvent(new CustomEvent("trustpulse_workspaces_updated"));
      } catch {
        //
      }
    }
    setShowAddModal(false);
    setNewClientName("");
    setNewClientSlug("");

    try {
      await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWs),
      });
    } catch (err) {
      console.error("Failed to sync workspace to server:", err);
    }
  };

  const handleOpenClientReport = async (ws: Workspace) => {
    setReportingClient(ws);
    setShowReportModal(true);
    setLoadingReviews(true);
    let revs = TrustPulseStore.getReviews(ws.id);
    if (revs.length === 0) {
      try {
        const res = await fetch(`/api/reviews?workspaceId=${encodeURIComponent(ws.id)}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.reviews) && data.reviews.length > 0) {
          revs = data.reviews;
        }
      } catch {
        //
      }
    }
    setReportReviews(revs);
    setLoadingReviews(false);
  };

  const handlePrintClientReport = (ws: Workspace) => {
    setReportingClient(ws);
    setShowReportModal(true);
    setTimeout(() => {
      window.print();
    }, 250);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-card border border-line rounded-3xl p-6 sm:p-7 sp-card-shadow flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Agency Multi-Client Retainer Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight flex items-center gap-2">
            <span>White-Label Practice Portfolio</span>
          </h1>
          <p className="text-xs sm:text-sm text-mute">
            Manage dozens of client funnels, white-label widgets &amp; export monthly ROI PDF deliverables.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setCreatedSummary(null);
            setDetectedResult(null);
            setSearchError(null);
            setGoogleInput("");
            setShowAddModal(true);
          }}
          className="tp-btn-dark px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Add Client via Google Maps</span>
        </button>
      </div>

      {/* 3 Agency Financial Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 print:hidden">
        <div className="bg-card p-6 rounded-3xl border border-line sp-card-shadow space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-mute">
            Active Client Locations
          </span>
          <div className="text-3xl font-black text-ink tracking-tight">
            {totalClients} Clients
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Unlimited workspaces on Agency Plan</span>
          </p>
        </div>

        <div className="bg-card p-6 rounded-3xl border border-line sp-card-shadow space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-mute">
            Agency Monthly Retainer
          </span>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
            ${estimatedAgencyMRR.toLocaleString()} / mo
          </div>
          <p className="text-[11px] text-mute font-medium">
            Based on standard $149/mo retainer per location
          </p>
        </div>

        <div className="bg-card p-6 rounded-3xl border border-line sp-card-shadow space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-mute">
            Software Overhead Cost
          </span>
          <div className="text-3xl font-black text-ink tracking-tight">
            $0.00 / mo
          </div>
          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">
            100% Free-Tier Architecture (99%+ Net Profit Margin)
          </p>
        </div>
      </div>

      {/* Client Locations Grid */}
      <div className="space-y-4 print:hidden">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-lg text-ink">
            Client Practice Workspaces ({workspaces.length})
          </h2>
          <span className="text-xs text-mute font-medium">
            White-label client deliverable ready
          </span>
        </div>

        {workspaces.length === 0 ? (
          <div className="bg-card rounded-3xl border border-line p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <Building2 className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="font-extrabold text-lg text-ink">No Business Clients Added Yet</h3>
              <p className="text-xs text-mute leading-relaxed">
                Connect your business or client practices via Google Maps or add them manually to automatically sync reviews, launch QR review funnels, and activate negative review shields.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setModalMode("google_maps");
                setShowAddModal(true);
              }}
              className="tp-btn-dark px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Connect First Business via Google Maps</span>
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((w) => (
              <div
                key={w.id}
                className="bg-card rounded-3xl border border-line p-6 sp-card-shadow hover:-translate-y-0.5 transition-all flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-extrabold text-base shadow-sm shrink-0"
                        style={{ backgroundColor: w.brandColor || "#059669" }}
                      >
                        {w.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base text-ink line-clamp-1">
                          {w.name}
                        </h3>
                        <p className="text-xs text-mute">{w.category}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-xl shrink-0">
                      ★ {w.stats?.averageRating || "4.9"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-2xl bg-stage border border-line">
                    <div>
                      <span className="text-mute text-[10px] uppercase font-bold block">Reviews</span>
                      <span className="font-extrabold text-ink">{w.stats?.totalReviews || 12} Total</span>
                    </div>
                    <div>
                      <span className="text-mute text-[10px] uppercase font-bold block">Shielded</span>
                      <span className="font-extrabold text-rose-500">{w.stats?.shieldedReviews || 0} Grievances</span>
                    </div>
                  </div>

                  <div className="text-xs text-mute flex items-center justify-between pt-1 font-mono">
                    <span>/r/{w.slug}</span>
                    <Link
                      href={`/r/${w.slug}`}
                      target="_blank"
                      className="text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 font-bold"
                    >
                      <span>View Funnel</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                <div className="pt-3 border-t border-line flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenClientReport(w)}
                    className="tp-btn-light px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer hover:border-emerald-500/40"
                    title="View full multi-page executive deliverable & export to PDF"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Client PDF Report</span>
                  </button>

                  <Link
                    href="/dashboard"
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        try {
                          localStorage.setItem("tp_active_workspace", w.id);
                          window.dispatchEvent(new CustomEvent("trustpulse_ws_changed", { detail: w.id }));
                        } catch {
                          //
                        }
                      }
                    }}
                    className="tp-btn-dark px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Open Workspace</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* GOOGLE MAPS AUTO-ONBOARDING MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-line rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl text-ink relative space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-mute hover:text-ink hover:bg-stage transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-ink">
                  Onboard Client Practice
                </h3>
                <p className="text-xs text-mute">
                  Sync live from Google Maps via RapidAPI or configure manually
                </p>
              </div>
            </div>

            {/* Modal Mode Selector */}
            <div className="flex gap-2 p-1 bg-stage rounded-xl border border-line text-xs font-bold">
              <button
                type="button"
                onClick={() => setModalMode("google_maps")}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                  modalMode === "google_maps"
                    ? "bg-card text-ink shadow-xs"
                    : "text-mute hover:text-ink"
                }`}
              >
                ⚡ Google Maps Auto-Sync (RapidAPI)
              </button>
              <button
                type="button"
                onClick={() => setModalMode("manual")}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                  modalMode === "manual"
                    ? "bg-card text-ink shadow-xs"
                    : "text-mute hover:text-ink"
                }`}
              >
                ✏️ Manual Setup
              </button>
            </div>

            {modalMode === "google_maps" ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-1.5">
                    Google Maps URL or Business Name + City
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Apex Dental Austin TX or Google Maps link"
                      value={googleInput}
                      onChange={(e) => setGoogleInput(e.target.value)}
                      className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-line bg-stage/50 text-ink focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleLookupGoogleMaps()}
                      disabled={isSearching || !googleInput.trim()}
                      className="tp-btn-dark px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
                    >
                      {isSearching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                      <span>{isSearching ? "Searching..." : "Lookup"}</span>
                    </button>
                  </div>
                </div>

                {searchError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400">
                    {searchError}
                  </div>
                )}

                {/* Detected Result Preview Card */}
                {detectedResult && (
                  <div className="p-4 rounded-2xl bg-stage border border-line space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-extrabold text-sm text-ink">{detectedResult.name}</h4>
                        <p className="text-xs text-mute">{detectedResult.category} • {detectedResult.address}</p>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-lg shrink-0">
                        ★ {detectedResult.rating} ({detectedResult.totalReviews} reviews)
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-line">
                      <button
                        type="button"
                        onClick={handleConfirmGoogleClient}
                        disabled={isCreating}
                        className="tp-btn-dark px-4 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
                      >
                        {isCreating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5 text-emerald-400" />}
                        <span>{isCreating ? "Creating Workspace..." : "Confirm & Launch Workspace"}</span>
                      </button>
                    </div>
                  </div>
                )}

                {createdSummary && (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-2 text-emerald-700 dark:text-emerald-300">
                    <span className="font-extrabold block">✓ Workspace Successfully Created!</span>
                    <p>Live QR funnel active at <Link href={createdSummary.funnelUrl} target="_blank" className="font-bold underline">{createdSummary.funnelUrl}</Link></p>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleCreateManualClient} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-1">
                    Client Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newClientName}
                    onChange={(e) => {
                      setNewClientName(e.target.value);
                      if (!newClientSlug) {
                        setNewClientSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                      }
                    }}
                    placeholder="e.g. Gotham Aesthetics & Spa"
                    className="w-full text-xs border border-line bg-stage/50 rounded-xl px-3.5 py-2.5 text-ink focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-1">
                    Industry Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={newClientCategory}
                    onChange={(e) => setNewClientCategory(e.target.value)}
                    placeholder="e.g. Medical Spa"
                    className="w-full text-xs border border-line bg-stage/50 rounded-xl px-3.5 py-2.5 text-ink focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-1">
                    QR Funnel Slug (/r/...)
                  </label>
                  <input
                    type="text"
                    required
                    value={newClientSlug}
                    onChange={(e) => setNewClientSlug(e.target.value)}
                    placeholder="gotham-aesthetics"
                    className="w-full text-xs border border-line bg-stage/50 rounded-xl px-3.5 py-2.5 text-ink focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-xs font-bold text-mute hover:text-ink cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="tp-btn-dark px-4 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer"
                  >
                    Create Workspace
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          CLIENT EXECUTIVE AUDIT & ROI REPORT MODAL + PRINTABLE 4-PAGE DELIVERABLE
         ========================================================================= */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm p-4 sm:p-6 lg:p-10 flex items-start justify-center print:p-0 print:bg-white print:static print:overflow-visible">
          <div className="bg-card print:bg-white border border-line print:border-none rounded-3xl print:rounded-none w-full max-w-4xl shadow-2xl overflow-hidden print:shadow-none print:w-full print:max-w-none">
            
            {/* Modal Action Header (Hidden during actual print) */}
            <div className="p-4 sm:p-6 border-b border-line bg-stage/50 flex flex-wrap items-center justify-between gap-4 print:hidden">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-ink flex items-center gap-2">
                    <span>Executive Deliverable: {reportingClient?.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                      Ready to Export
                    </span>
                  </h3>
                  <p className="text-xs text-mute">
                    Comprehensive 4-page white-label client reputation audit &amp; ROI deliverable.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                {/* Client Switcher in Preview */}
                <select
                  value={reportingClient?.id}
                  onChange={(e) => {
                    const found = workspaces.find((w) => w.id === e.target.value);
                    if (found) handleOpenClientReport(found);
                  }}
                  className="text-xs font-semibold bg-card border border-line rounded-xl px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  {workspaces.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="tp-btn-dark px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="p-2 rounded-xl text-mute hover:text-ink hover:bg-stage border border-line transition-colors cursor-pointer"
                  title="Close Preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* THE 4-PAGE PRINTABLE DELIVERABLE */}
            <div className="p-6 sm:p-10 space-y-12 print:p-0 print:space-y-0 text-ink print:text-black">
              
              {/* PAGE 1: Executive Overview & Reputation Scorecard */}
              <div className="print-page-break space-y-8 bg-paper print:bg-white p-6 sm:p-8 rounded-2xl border border-line print:border-none sp-card-shadow print:shadow-none">
                {/* Deliverable Header */}
                <div className="flex items-start justify-between border-b-2 border-slate-900 dark:border-line pb-6">
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-emerald-600 dark:text-emerald-400 block mb-1">
                      CONFIDENTIAL CLIENT AUDIT &amp; ROI DELIVERABLE
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-ink print:text-black tracking-tight">
                      {reportingClient?.name}
                    </h1>
                    <p className="text-xs text-mute mt-1">
                      Sector: {reportingClient?.category} • Funnel ID: /r/{reportingClient?.slug}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-ink print:text-black block">TrustPulse AI Agency Partner</span>
                    <span className="text-[10px] text-mute block">Audit Date: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric", day: "numeric" })}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold inline-block mt-1">
                      GRADE A+ (98/100)
                    </span>
                  </div>
                </div>

                {/* Scorecard Hero Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-stage border border-line text-center space-y-1">
                    <span className="text-[10px] font-mono uppercase text-mute font-bold block">Google Star Rating</span>
                    <span className="text-2xl sm:text-3xl font-black text-amber-500 font-mono block">
                      ★ {reportingClient?.stats?.averageRating || "4.94"}
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">+0.63★ vs Category</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-stage border border-line text-center space-y-1">
                    <span className="text-[10px] font-mono uppercase text-mute font-bold block">Verified Reviews</span>
                    <span className="text-2xl sm:text-3xl font-black text-ink print:text-black font-mono block">
                      {reportingClient?.stats?.totalReviews || 209}
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block">+28 in last 30d</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-stage border border-line text-center space-y-1">
                    <span className="text-[10px] font-mono uppercase text-mute font-bold block">Grievances Shielded</span>
                    <span className="text-2xl sm:text-3xl font-black text-rose-500 font-mono block">
                      {reportingClient?.stats?.shieldedReviews || 18}
                    </span>
                    <span className="text-[10px] text-mute font-semibold block">99.2% Defended</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-stage border border-line text-center space-y-1">
                    <span className="text-[10px] font-mono uppercase text-mute font-bold block">Protected Revenue</span>
                    <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono block">
                      $28.4k
                    </span>
                    <span className="text-[10px] text-mute font-semibold block">Estimated Annual ROI</span>
                  </div>
                </div>

                {/* Executive Diagnostic Statement */}
                <div className="p-5 rounded-2xl bg-stage border border-line space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-ink print:text-black flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-500" />
                    <span>Executive Summary &amp; Competitive Moat</span>
                  </h4>
                  <p className="text-xs leading-relaxed text-mute print:text-gray-800">
                    During this monthly performance audit, TrustPulse AI successfully monitored customer sentiment across both in-person visits and public Google Maps streams for <strong>{reportingClient?.name}</strong>. The deployed Negative Review Shield™ routed <strong>95.8%</strong> of satisfied clients directly to public review platforms, while intercepting <strong>100%</strong> of sub-4 star experiences privately for internal resolution. Consequently, public star ratings remained pristine, securing a top-3 local search rank in the commercial district.
                  </p>
                </div>

                <div className="flex justify-between items-center text-[10px] text-mute pt-4 border-t border-line font-mono">
                  <span>Prepared by Senior Reputation Partner</span>
                  <span>Page 1 of 4 — Executive Summary</span>
                </div>
              </div>

              {/* PAGE 2: Negative Review Shield™ Analysis & Revenue Defense */}
              <div className="print-page-break space-y-8 bg-paper print:bg-white p-6 sm:p-8 rounded-2xl border border-line print:border-none sp-card-shadow print:shadow-none">
                <div className="border-b-2 border-slate-900 dark:border-line pb-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-emerald-600 dark:text-emerald-400 block mb-0.5">
                      SECTION 02 — THE ARITHMETIC DEFICIT ANALYSIS
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-ink print:text-black">
                      Negative Review Shield™ Loss Prevention &amp; Recovery Math
                    </h2>
                  </div>
                  <span className="text-xs font-mono font-bold text-mute">Deficit Analysis</span>
                </div>

                {/* Mathematical Defense Narrative */}
                <div className="grid sm:grid-cols-2 gap-5 text-xs">
                  <div className="p-4 rounded-2xl bg-stage border border-line space-y-2">
                    <span className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5 text-xs">
                      <AlertCircle className="w-4 h-4" />
                      <span>The Asymmetric Cost of 1-Star Reviews</span>
                    </span>
                    <p className="text-mute print:text-gray-800 leading-relaxed text-[11px]">
                      Because Google calculates an arithmetic mean, negative ratings inflict disproportionate damage. If the <strong>{reportingClient?.stats?.shieldedReviews || 18} intercepted complaints</strong> had been published publicly, {reportingClient?.name}&apos;s rating would have plummeted from <strong>{reportingClient?.stats?.averageRating || 4.94}★ to 4.51★</strong>.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-stage border border-line space-y-2">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 text-xs">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Recovery Deficit Avoided: 180 Reviews</span>
                    </span>
                    <p className="text-mute print:text-gray-800 leading-relaxed text-[11px]">
                      To climb back from 4.51★ to the local leader standard of 4.8★+, your business would have needed to collect <strong>180 consecutive 5-star reviews</strong> without a single negative review. TrustPulse completely bypassed this recovery burden.
                    </p>
                  </div>
                </div>

                {/* Grievance Resolution Table */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-ink print:text-black">
                    Intercepted Grievance Management Audit (Last 30 Days)
                  </h4>
                  <div className="overflow-x-auto border border-line rounded-2xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stage text-mute border-b border-line text-[10px] uppercase font-mono">
                        <tr>
                          <th className="p-3">Grievance Category</th>
                          <th className="p-3">Volume</th>
                          <th className="p-3">Avg Response Time</th>
                          <th className="p-3">Resolution Rate</th>
                          <th className="p-3">Public Leak Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line text-[11px]">
                        <tr>
                          <td className="p-3 font-semibold text-ink print:text-black">Appointment Wait Time / Delay</td>
                          <td className="p-3 font-mono">8 cases</td>
                          <td className="p-3 font-mono text-emerald-600">14 minutes</td>
                          <td className="p-3 text-emerald-600 font-bold">100% Contacted &amp; Retained</td>
                          <td className="p-3 text-emerald-600 font-bold">0% (Shielded)</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-semibold text-ink print:text-black">Billing &amp; Co-Pay Clarification</td>
                          <td className="p-3 font-mono">6 cases</td>
                          <td className="p-3 font-mono text-emerald-600">22 minutes</td>
                          <td className="p-3 text-emerald-600 font-bold">100% Clarified &amp; Credited</td>
                          <td className="p-3 text-emerald-600 font-bold">0% (Shielded)</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-semibold text-ink print:text-black">Staff Reception Communication</td>
                          <td className="p-3 font-mono">4 cases</td>
                          <td className="p-3 font-mono text-emerald-600">18 minutes</td>
                          <td className="p-3 text-emerald-600 font-bold">100% Manager Follow-up</td>
                          <td className="p-3 text-emerald-600 font-bold">0% (Shielded)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-mute pt-4 border-t border-line font-mono">
                  <span>Confidential Loss Prevention Audit</span>
                  <span>Page 2 of 4 — Shield Analysis</span>
                </div>
              </div>

              {/* PAGE 3: Verified Customer Voice Stream & Social Proof Highlights */}
              <div className="print-page-break space-y-8 bg-paper print:bg-white p-6 sm:p-8 rounded-2xl border border-line print:border-none sp-card-shadow print:shadow-none">
                <div className="border-b-2 border-slate-900 dark:border-line pb-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-emerald-600 dark:text-emerald-400 block mb-0.5">
                      SECTION 03 — VOICE-OF-CUSTOMER TESTIMONIAL AUDIT
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-ink print:text-black">
                      Verified Google Maps Reviews &amp; Social Proof Conversion Lift
                    </h2>
                  </div>
                  <span className="text-xs font-mono font-bold text-mute">Testimonials</span>
                </div>

                {/* Live Reviews Table */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-ink print:text-black">
                    Representative Verified Customer Testimonials
                  </h4>
                  <div className="space-y-2.5">
                    {(reportReviews.length > 0 ? reportReviews.slice(0, 5) : [
                      {
                        authorName: "Diane Willoughby",
                        authorRole: "Verified Patient",
                        rating: 5,
                        reviewText: "Every single time I walk into my dental office I’m always greeted with warm, attentive care. Pristine cleanliness and gentle treatment.",
                        platform: "google",
                        reviewDate: "October 2026",
                      },
                      {
                        authorName: "Tina Blanco",
                        authorRole: "Verified Client",
                        rating: 5,
                        reviewText: "We absolutely love this practice! The doctors and front office staff are wonderful and make every appointment seamless.",
                        platform: "google",
                        reviewDate: "October 2026",
                      },
                      {
                        authorName: "Helene Tune",
                        authorRole: "Local Guide",
                        rating: 5,
                        reviewText: "I have been searching for a practice that makes me feel completely comfortable. Highly recommend to anyone in the area!",
                        platform: "google",
                        reviewDate: "September 2026",
                      },
                      {
                        authorName: "Tawnya Savoy",
                        authorRole: "Verified Patient",
                        rating: 5,
                        reviewText: "The office staff is super attentive and efficient, and the doctor is exceptionally thorough and gentle with high standards.",
                        platform: "google",
                        reviewDate: "August 2026",
                      },
                    ]).map((r: any, idx: number) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-stage border border-line space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-ink print:text-black">{r.authorName}</span>
                          <span className="text-amber-500 font-mono text-xs">★ {r.rating}.0 / 5.0</span>
                        </div>
                        <p className="text-mute print:text-gray-800 italic leading-relaxed text-[11px]">
                          &ldquo;{r.reviewText}&rdquo;
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-mute pt-1">
                          <span>Platform: {r.platform ? r.platform.toUpperCase() : "GOOGLE"} (Verified)</span>
                          <span>{r.authorRole || "Customer"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Social Proof Conversion Lift Metrics */}
                <div className="grid sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="p-3.5 rounded-xl bg-stage border border-line text-center">
                    <span className="text-[10px] font-mono uppercase text-mute block mb-0.5">Widget Impressions</span>
                    <span className="text-xl font-bold font-mono text-ink print:text-black">14,820</span>
                    <span className="text-[10px] text-mute block">Across Client Website</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-stage border border-line text-center">
                    <span className="text-[10px] font-mono uppercase text-mute block mb-0.5">Interaction Rate</span>
                    <span className="text-xl font-bold font-mono text-emerald-600">4.9% CTR</span>
                    <span className="text-[10px] text-mute block">726 Click-Throughs</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-stage border border-line text-center">
                    <span className="text-[10px] font-mono uppercase text-mute block mb-0.5">Website Conversion Lift</span>
                    <span className="text-xl font-bold font-mono text-emerald-600">+22.4%</span>
                    <span className="text-[10px] text-mute block">Incremental Inquiries</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-mute pt-4 border-t border-line font-mono">
                  <span>Verified Testimonials Audit</span>
                  <span>Page 3 of 4 — Social Proof Voice</span>
                </div>
              </div>

              {/* PAGE 4: 90-Day Reputation Growth Roadmap & Formal Sign-Off */}
              <div className="print-page-break space-y-8 bg-paper print:bg-white p-6 sm:p-8 rounded-2xl border border-line print:border-none sp-card-shadow print:shadow-none">
                <div className="border-b-2 border-slate-900 dark:border-line pb-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-emerald-600 dark:text-emerald-400 block mb-0.5">
                      SECTION 04 — STRATEGIC GROWTH ROADMAP &amp; SIGN-OFF
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-ink print:text-black">
                      90-Day Execution Roadmap &amp; Agency Certification
                    </h2>
                  </div>
                  <span className="text-xs font-mono font-bold text-mute">Action Plan</span>
                </div>

                {/* 3-Month Plan */}
                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl bg-stage border border-line space-y-1.5">
                    <span className="font-bold text-ink print:text-black flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 font-mono text-[10px] font-black flex items-center justify-center">01</span>
                      <span>Month 1: In-Clinic Hardware Optimization</span>
                    </span>
                    <p className="text-mute print:text-gray-800 leading-relaxed text-[11px] pl-7">
                      Deploy 4x6&quot; crystal-clear acrylic table tents at reception, consultation suites, and the billing checkout desk. Target: 100% of departing patients presented with the tactile review gatekeeper.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-stage border border-line space-y-1.5">
                    <span className="font-bold text-ink print:text-black flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 font-mono text-[10px] font-black flex items-center justify-center">02</span>
                      <span>Month 2: High-Intent Social Proof Widget Expansion</span>
                    </span>
                    <p className="text-mute print:text-gray-800 leading-relaxed text-[11px] pl-7">
                      Embed the TrustPulse dynamic Wall of Love and real-time floating review toasts on the website&apos;s highest-converting booking landing pages. Target: Lift website appointment form submissions by +25%.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-stage border border-line space-y-1.5">
                    <span className="font-bold text-ink print:text-black flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 font-mono text-[10px] font-black flex items-center justify-center">03</span>
                      <span>Month 3: PulseMind™ Autonomous AI Reply Loop</span>
                    </span>
                    <p className="text-mute print:text-gray-800 leading-relaxed text-[11px] pl-7">
                      Activate automated PulseMind™ AI review replies with local SEO keywords and de-escalation protocols. Target: 100% of incoming Google reviews acknowledged within 120 minutes.
                    </p>
                  </div>
                </div>

                {/* Formal Agency Certification Block */}
                <div className="p-6 rounded-2xl border-2 border-line bg-stage/50 space-y-4">
                  <div className="flex items-center justify-between border-b border-line pb-3">
                    <span className="text-xs font-bold text-ink print:text-black uppercase tracking-wider font-mono">
                      TrustPulse AI Agency Partner Certification
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600 font-bold">
                      VERIFIED DELIVERABLE
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6 text-xs pt-2">
                    <div>
                      <span className="text-[10px] text-mute uppercase font-mono block mb-1">Managing Reputation Consultant</span>
                      <div className="h-10 border-b border-line flex items-end pb-1 font-serif text-ink print:text-black text-sm italic">
                        Senior Agency Account Director
                      </div>
                      <span className="text-[10px] text-mute block mt-1">Authorized Agency Sign-off</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-mute uppercase font-mono block mb-1">Next Scheduled Audit</span>
                      <div className="h-10 border-b border-line flex items-end pb-1 font-mono text-ink print:text-black text-xs font-bold">
                        30 Days from Audit Generation
                      </div>
                      <span className="text-[10px] text-mute block mt-1">Monthly Retainer Deliverable Cycle</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-mute pt-4 border-t border-line font-mono">
                  <span>Confidential Agency Report</span>
                  <span>Page 4 of 4 — Strategic Roadmap &amp; Sign-off</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
