"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Star,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  QrCode,
  Sparkles,
  ExternalLink,
  MessageSquare,
  CheckCircle2,
  Check,
  Copy,
  ChevronDown,
  Building2,
  Sliders,
  Code2,
  Plus,
  X,
  Search,
  Filter,
  RefreshCw,
  Phone,
  Mail,
  Smartphone,
  Eye,
  Award,
  ArrowRight,
  TrendingDown,
} from "lucide-react";
import { TrustPulseStore } from "@/lib/storage/trustpulse-store";
import { Workspace, ReviewItem, PrivateFeedback } from "@/types/trustpulse";
import { GoogleBadge, TrustpilotBadge } from "@/components/ui/PlatformBadges";

export default function DashboardPage() {
  const workspaces = TrustPulseStore.getWorkspaces();
  const [selectedWsId, setSelectedWsId] = useState<string>(workspaces[0]?.id || "ws-apex-dental");
  const currentWorkspace = workspaces.find((w) => w.id === selectedWsId) || workspaces[0];

  const [reviewsList, setReviewsList] = useState<ReviewItem[]>(
    TrustPulseStore.getReviews(currentWorkspace?.id)
  );
  const [feedback, setFeedback] = useState<PrivateFeedback[]>(
    TrustPulseStore.getPrivateFeedback(currentWorkspace?.id)
  );

  // Filter & Search states
  const [filterPlatform, setFilterPlatform] = useState<"all" | "google" | "trustpilot" | "shield">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Add Review Modal State
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [newAuthorName, setNewAuthorName] = useState("");
  const [newAuthorRole, setNewAuthorRole] = useState("Verified Patient");
  const [newRating, setNewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState("");
  const [newPlatform, setNewPlatform] = useState<"google" | "trustpilot" | "direct">("google");
  const [submittingReview, setSubmittingReview] = useState(false);

  // AI Reply Modal State
  const [activeReviewForAI, setActiveReviewForAI] = useState<ReviewItem | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiOptions, setAiOptions] = useState<
    Array<{ type: string; title: string; description: string; content: string }>
  >([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);

  useEffect(() => {
    setReviewsList(TrustPulseStore.getReviews(currentWorkspace?.id));
    setFeedback(TrustPulseStore.getPrivateFeedback(currentWorkspace?.id));
  }, [selectedWsId, currentWorkspace?.id]);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthorName || !newReviewText) return;

    setSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId: currentWorkspace?.id,
          authorName: newAuthorName.trim(),
          authorRole: newAuthorRole.trim(),
          rating: newRating,
          reviewText: newReviewText.trim(),
          platform: newPlatform,
          isFeatured: true,
        }),
      });
      const data = await res.json();
      if (data.success && data.review) {
        setReviewsList((prev) => [data.review, ...prev]);
        setShowAddReviewModal(false);
        setNewAuthorName("");
        setNewReviewText("");
      }
    } catch (err) {
      console.error("Failed to add review:", err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleGenerateAI = async (rev: ReviewItem) => {
    setActiveReviewForAI(rev);
    setAiLoading(true);
    setAiOptions([]);
    try {
      const res = await fetch("/api/reviews/ai-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewId: rev.id,
          workspaceId: currentWorkspace?.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAiOptions(data.options);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const copyReply = (content: string, idx: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const filteredReviews = reviewsList.filter((r) => {
    if (filterPlatform !== "all" && r.platform !== filterPlatform) return false;
    if (
      searchQuery &&
      !r.authorName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !r.reviewText.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Welcome & Quick Action Banner */}
      <div className="bg-card border border-line rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Live Reputation Command
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            {currentWorkspace.name}
          </h1>
          <p className="text-xs sm:text-sm text-mute">
            {currentWorkspace.category} • Funnel slug:{" "}
            <Link
              href={`/r/${currentWorkspace.slug}`}
              target="_blank"
              className="text-emerald-600 dark:text-emerald-400 font-mono font-bold underline inline-flex items-center gap-1"
            >
              /r/{currentWorkspace.slug}
              <ExternalLink className="w-3 h-3" />
            </Link>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowAddReviewModal(true)}
            className="tp-btn-dark px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Add Verified Review</span>
          </button>
          <Link
            href="/dashboard/ai-replies"
            className="tp-btn-light px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>PulseMind™ AI</span>
          </Link>
          <Link
            href={`/r/${currentWorkspace.slug}`}
            target="_blank"
            className="tp-btn-light px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
          >
            <Smartphone className="w-4 h-4 text-mute" />
            <span>Test QR Funnel</span>
          </Link>
        </div>
      </div>

      {/* 4 Bento KPI Metric Cards (Kurzfilm / Company Inspiration) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Metric 1: Star Rating */}
        <div className="bg-card border border-line rounded-3xl p-5 sm:p-6 sp-card-shadow relative overflow-hidden group hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-mute uppercase tracking-wider">
              Google Rating
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-400/10 text-amber-500 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-ink tracking-tight">
              {currentWorkspace.stats?.averageRating || "4.94"}
            </span>
            <span className="text-xs font-bold text-amber-500">★★★★★</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+0.28 vs Local Competitors</span>
          </div>
        </div>

        {/* Metric 2: Total Reviews */}
        <div className="bg-card border border-line rounded-3xl p-5 sm:p-6 sp-card-shadow relative overflow-hidden group hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-mute uppercase tracking-wider">
              Total Reviews Synced
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-ink tracking-tight">
              {(currentWorkspace.stats?.totalReviews || 184).toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-mute">Across platforms</span>
          </div>
          <div className="mt-2 text-[11px] text-mute flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Google Maps, Trustpilot &amp; QR</span>
          </div>
        </div>

        {/* Metric 3: Negative Review Shield */}
        <div className="bg-card border border-rose-500/30 rounded-3xl p-5 sm:p-6 sp-card-shadow relative overflow-hidden group hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              Shielded Grievances
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-600 dark:text-rose-400 tracking-tight">
              {feedback.length || 1}
            </span>
            <span className="text-xs font-bold text-rose-500/80">Caught Privately</span>
          </div>
          <div className="mt-2 text-[11px] text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
            <span>0 Negative reviews leaked to Google</span>
          </div>
        </div>

        {/* Metric 4: Protected Annual Revenue */}
        <div className="bg-card border border-line rounded-3xl p-5 sm:p-6 sp-card-shadow relative overflow-hidden group hover:-translate-y-0.5 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-mute uppercase tracking-wider">
              Protected Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
              $34,800
            </span>
            <span className="text-xs font-semibold text-mute">/ year</span>
          </div>
          <div className="mt-2 text-[11px] text-mute flex items-center gap-1">
            <span>Estimated retained client LTV</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Reviews Management (Left 8 cols) + Side Panels (Right 4 cols) */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* REVIEWS STREAM & CONTROLS (8 cols) */}
        <div className="lg:col-span-8 bg-card rounded-3xl border border-line sp-card-shadow overflow-hidden space-y-4">
          {/* Header & Filter Controls */}
          <div className="p-5 sm:p-6 border-b border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-extrabold text-lg text-ink flex items-center gap-2">
                <span>Verified Customer Testimonials</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-stage text-mute border border-line">
                  {filteredReviews.length}
                </span>
              </h2>
              <p className="text-xs text-mute mt-0.5">
                Automatically pushed to embeddable widgets &amp; verified on Google
              </p>
            </div>

            {/* Search Input */}
            <div className="relative max-w-xs w-full">
              <Search className="w-3.5 h-3.5 text-mute absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-stage/50 border border-line rounded-xl pl-9 pr-3.5 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Platform Filter Pills */}
          <div className="px-6 flex items-center gap-2 overflow-x-auto pb-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => setFilterPlatform("all")}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                filterPlatform === "all"
                  ? "bg-slate-900 text-white dark:bg-emerald-600 shadow-xs"
                  : "bg-stage text-mute hover:text-ink"
              }`}
            >
              All Platforms ({reviewsList.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterPlatform("google")}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                filterPlatform === "google"
                  ? "bg-slate-900 text-white dark:bg-emerald-600 shadow-xs"
                  : "bg-stage text-mute hover:text-ink"
              }`}
            >
              Google Maps
            </button>
            <button
              type="button"
              onClick={() => setFilterPlatform("trustpilot")}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                filterPlatform === "trustpilot"
                  ? "bg-slate-900 text-white dark:bg-emerald-600 shadow-xs"
                  : "bg-stage text-mute hover:text-ink"
              }`}
            >
              Trustpilot
            </button>
          </div>

          {/* Reviews List */}
          <div className="divide-y divide-line">
            {filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 sm:p-6 space-y-3 hover:bg-stage/40 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-black text-sm flex items-center justify-center shrink-0">
                      {rev.authorName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-ink flex items-center gap-2">
                        <span>{rev.authorName}</span>
                        {rev.platform === "google" && <GoogleBadge />}
                        {rev.platform === "trustpilot" && <TrustpilotBadge />}
                        {rev.platform !== "google" && rev.platform !== "trustpilot" && (
                          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-stage text-mute">
                            {rev.platform}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-mute">
                        {rev.authorRole || "Verified Client"} {rev.authorLocation ? `• ${rev.authorLocation}` : ""}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="flex text-amber-400 gap-0.5">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleGenerateAI(rev)}
                      className="tp-btn-light px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Reply</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-ink leading-relaxed">
                  &ldquo;{rev.reviewText}&rdquo;
                </p>

                {rev.aiReply && (
                  <div className="p-3.5 rounded-2xl bg-stage/70 border border-line text-xs space-y-1">
                    <div className="font-bold text-ink flex items-center gap-1.5 text-[11px]">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Generated Response ({rev.aiReply.type}):</span>
                    </div>
                    <p className="text-mute italic leading-relaxed text-[11px]">
                      &ldquo;{rev.aiReply.content}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SIDE PANELS (Right 4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Panel 1: Negative Review Shield Alert Feed */}
          <div className="bg-card rounded-3xl border border-rose-500/30 sp-card-shadow overflow-hidden">
            <div className="p-5 border-b border-rose-500/20 bg-rose-500/10 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-rose-500" />
                  <span>Shielded Grievances</span>
                </h3>
                <p className="text-[11px] text-rose-600/80 mt-0.5">
                  Private feedback caught before reaching Google Maps
                </p>
              </div>
              <Link
                href="/dashboard/shield"
                className="text-xs font-bold text-rose-600 hover:underline"
              >
                Inbox ({feedback.length})
              </Link>
            </div>

            <div className="divide-y divide-line p-2">
              {feedback.slice(0, 2).map((fb) => (
                <div key={fb.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-ink">{fb.customerName}</span>
                    <span className="font-mono text-[10px] text-amber-500 font-bold">
                      {"★".repeat(fb.rating)} ({fb.rating} Stars)
                    </span>
                  </div>
                  <p className="text-xs text-mute line-clamp-2 leading-relaxed">
                    &ldquo;{fb.grievanceText}&rdquo;
                  </p>
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-mute">{fb.customerEmail}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                        fb.status === "resolved"
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                      }`}
                    >
                      {fb.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-stage/50 border-t border-line text-center">
              <Link
                href="/dashboard/shield"
                className="text-xs font-bold text-ink hover:text-emerald-500 transition-colors inline-flex items-center gap-1"
              >
                <span>Resolve in Shield Center</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Panel 2: Quick Widget Embed Snippet */}
          <div className="bg-card rounded-3xl border border-line sp-card-shadow p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-ink flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-emerald-500" />
                <span>1-Line Website Script</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `<script src="https://trustpulse-ai-phi.vercel.app/api/widget/script?id=widget-apex-toasts" defer></script>`
                  );
                  setCopiedScript(true);
                  setTimeout(() => setCopiedScript(false), 2000);
                }}
                className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                {copiedScript ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="p-3 bg-slate-950 text-emerald-400 font-mono text-[11px] rounded-xl border border-slate-800 break-all overflow-x-auto">
              &lt;script src=&quot;https://trustpulse-ai-phi.vercel.app/api/widget/script?id=widget-apex-toasts&quot; defer&gt;&lt;/script&gt;
            </div>
            <div className="flex items-center justify-between text-[11px] text-mute pt-1">
              <span>Works on WordPress, Shopify, Webflow</span>
              <Link href="/dashboard/widgets" className="font-bold text-ink hover:underline">
                Customize →
              </Link>
            </div>
          </div>

          {/* Panel 3: Counter Stand Print Shortcut */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-5 border border-emerald-500/30 space-y-3 shadow-xl">
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span className="font-extrabold text-xs text-white uppercase tracking-wider">
                In-Person QR Stand
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Place 4x6 acrylic counter stands at your reception checkout to turn in-person patients into verified Google reviews.
            </p>
            <Link
              href="/dashboard/qr-studio"
              className="w-full py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md"
            >
              <span>Open Print Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ADD VERIFIED REVIEW MODAL */}
      {showAddReviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-line rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl text-ink space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-base text-ink">
                  Add Verified Customer Review
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddReviewModal(false)}
                className="text-mute hover:text-ink p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAuthorName}
                    onChange={(e) => setNewAuthorName(e.target.value)}
                    placeholder="e.g. Rachel Higgins"
                    className="w-full text-xs rounded-xl border border-line bg-stage/50 px-3.5 py-2.5 text-ink focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-1">
                    Role / Subtitle
                  </label>
                  <input
                    type="text"
                    value={newAuthorRole}
                    onChange={(e) => setNewAuthorRole(e.target.value)}
                    placeholder="e.g. Verified Patient"
                    className="w-full text-xs rounded-xl border border-line bg-stage/50 px-3.5 py-2.5 text-ink focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-1">
                    Rating (Stars)
                  </label>
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                    className="w-full text-xs rounded-xl border border-line bg-stage/50 px-3.5 py-2.5 text-ink focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  >
                    <option value={5}>★★★★★ (5 Stars)</option>
                    <option value={4}>★★★★☆ (4 Stars)</option>
                    <option value={3}>★★★☆☆ (3 Stars)</option>
                    <option value={2}>★★☆☆☆ (2 Stars)</option>
                    <option value={1}>★☆☆☆☆ (1 Star)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-1">
                    Platform Source
                  </label>
                  <select
                    value={newPlatform}
                    onChange={(e) =>
                      setNewPlatform(e.target.value as "google" | "trustpilot" | "direct")
                    }
                    className="w-full text-xs rounded-xl border border-line bg-stage/50 px-3.5 py-2.5 text-ink focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                  >
                    <option value="google">Google Maps</option>
                    <option value="trustpilot">Trustpilot</option>
                    <option value="direct">Direct In-Person</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-1">
                  Customer Review Text *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  placeholder="Paste or write the authentic feedback..."
                  className="w-full text-xs rounded-xl border border-line bg-stage/50 p-3 text-ink focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddReviewModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-line text-xs font-bold text-mute hover:text-ink cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="tp-btn-dark px-5 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
                >
                  {submittingReview ? "Saving..." : "Save to Live Feed"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI REPLY MODAL */}
      {activeReviewForAI && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-line rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl text-ink space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-ink">
                    PulseMind™ AI Review Responder
                  </h3>
                  <span className="text-[10px] text-mute font-mono">
                    3 Strategic AI Response Angles
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveReviewForAI(null)}
                className="text-mute hover:text-ink p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Review summary */}
            <div className="p-4 rounded-2xl bg-stage border border-line text-xs space-y-1">
              <div className="font-bold text-ink">
                {activeReviewForAI.authorName} ({activeReviewForAI.rating}★ via {activeReviewForAI.platform})
              </div>
              <p className="text-mute italic leading-relaxed">
                &ldquo;{activeReviewForAI.reviewText}&rdquo;
              </p>
            </div>

            {aiLoading && (
              <div className="py-10 text-center space-y-3">
                <RefreshCw className="w-7 h-7 text-emerald-500 animate-spin mx-auto" />
                <p className="text-xs text-mute font-medium">
                  PulseMind™ Neural Engine is generating 3 strategic response angles...
                </p>
              </div>
            )}

            {!aiLoading && aiOptions.length > 0 && (
              <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                {aiOptions.map((opt, idx) => (
                  <div
                    key={opt.type}
                    className="p-4 rounded-2xl border border-line bg-stage/50 hover:border-emerald-500/40 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-extrabold text-xs text-ink block">
                          {opt.title}
                        </span>
                        <span className="text-[10px] text-mute">
                          {opt.description}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyReply(opt.content, idx)}
                        className="tp-btn-light px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 cursor-pointer"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Reply</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-ink leading-relaxed bg-card p-3 rounded-xl border border-line">
                      {opt.content}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 flex justify-end border-t border-line">
              <button
                type="button"
                onClick={() => setActiveReviewForAI(null)}
                className="tp-btn-light px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
