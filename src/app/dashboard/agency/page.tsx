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
} from "lucide-react";
import { TrustPulseStore } from "@/lib/storage/trustpulse-store";
import { Workspace } from "@/types/trustpulse";
import type { GooglePlaceResult } from "@/lib/places/google-maps";

export default function AgencyHubPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(
    TrustPulseStore.getWorkspaces()
  );

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

  // Selected client for report printing
  const [reportingClient, setReportingClient] = useState<Workspace>(workspaces[0]);

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
        body: JSON.stringify({ business: detectedResult }),
      });

      const data = await res.json();
      if (data.success && data.workspace) {
        TrustPulseStore.saveWorkspace(data.workspace);
        setWorkspaces([data.workspace, ...TrustPulseStore.getWorkspaces().filter((w) => w.id !== data.workspace.id)]);
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
    setWorkspaces([...TrustPulseStore.getWorkspaces()]);
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

  const handlePrintClientReport = (ws: Workspace) => {
    setReportingClient(ws);
    setTimeout(() => {
      window.print();
    }, 150);
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
                  onClick={() => handlePrintClientReport(w)}
                  className="tp-btn-light px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print PDF Report</span>
                </button>

                <Link
                  href="/dashboard"
                  className="tp-btn-dark px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Workspace</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
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

      {/* PRINTABLE PDF REPORT (Only visible when printing) */}
      <div className="hidden print:block p-8 bg-white text-black space-y-6">
        <div className="border-b-2 border-black pb-4">
          <h1 className="text-2xl font-black">{reportingClient?.name} — Monthly Reputation Audit</h1>
          <p className="text-xs text-gray-600">Generated by TrustPulse AI White-Label Agency Service</p>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="p-4 border rounded">
            <strong>Average Rating:</strong> {reportingClient?.stats?.averageRating || "4.94"} ★
          </div>
          <div className="p-4 border rounded">
            <strong>Total Reviews:</strong> {reportingClient?.stats?.totalReviews || 184}
          </div>
          <div className="p-4 border rounded">
            <strong>Grievances Shielded:</strong> {reportingClient?.stats?.shieldedReviews || 18}
          </div>
        </div>
      </div>
    </div>
  );
}
