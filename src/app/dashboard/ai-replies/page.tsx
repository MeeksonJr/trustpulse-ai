"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bot,
  Sparkles,
  Copy,
  Check,
  Star,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  Search,
  Sliders,
} from "lucide-react";
import { TrustPulseStore } from "@/lib/storage/trustpulse-store";
import { getWorkspaceUser, WorkspaceUser } from "@/lib/storage/workspace-store";
import { ReviewItem, AIReplyOption, Workspace } from "@/types/trustpulse";
import { GoogleBadge, TrustpilotBadge } from "@/components/ui/PlatformBadges";

export default function AIReplyStudioPage() {
  const [currentUser, setCurrentUser] = useState<WorkspaceUser | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>(() => TrustPulseStore.getWorkspaces());
  const [selectedWsId, setSelectedWsId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("tp_active_workspace");
      if (stored) return stored;
    }
    return workspaces[0]?.id || "ws-apex-dental";
  });
  const ws = workspaces.find((w) => w.id === selectedWsId) || workspaces[0];

  const [reviews, setReviews] = useState<ReviewItem[]>(() => TrustPulseStore.getReviews(ws?.id));
  const [filterRating, setFilterRating] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "oldest" | "rating_desc" | "rating_asc">("recent");
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(() => reviews[0] || null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [options, setOptions] = useState<AIReplyOption[]>([]);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  useEffect(() => {
    const user = getWorkspaceUser();
    setCurrentUser(user);
    const wsList = TrustPulseStore.getWorkspaces(user?.id);
    setWorkspaces(wsList);
    const stored = localStorage.getItem("tp_active_workspace");
    if (stored && wsList.some((w) => w.id === stored)) {
      setSelectedWsId(stored);
    } else if (wsList[0]) {
      setSelectedWsId(wsList[0].id);
    }

    fetch(`/api/workspaces?userId=${encodeURIComponent(user?.id || "demo")}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.workspaces) && data.workspaces.length > 0) {
          setWorkspaces(data.workspaces);
        }
      })
      .catch(() => {});

    const handleWsChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setSelectedWsId(customEvent.detail);
      }
    };

    window.addEventListener("trustpulse_ws_changed", handleWsChange);
    return () => {
      window.removeEventListener("trustpulse_ws_changed", handleWsChange);
    };
  }, []);

  useEffect(() => {
    if (!ws?.id) return;
    const list = TrustPulseStore.getReviews(ws.id);
    setReviews(list);
    setSelectedReview(list[0] || null);
    setOptions([]);

    fetch(`/api/reviews?workspaceId=${encodeURIComponent(ws.id)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.reviews) && data.reviews.length > 0) {
          setReviews(data.reviews);
          setSelectedReview(data.reviews[0] || null);
          for (const rev of data.reviews) {
            TrustPulseStore.addReview(rev);
          }
        }
      })
      .catch((err) => console.warn("[TrustPulse] AI replies sync notice:", err));
  }, [selectedWsId, ws?.id]);

  const generateReplies = async (review: ReviewItem) => {
    setSelectedReview(review);
    setLoadingAI(true);
    setOptions([]);
    try {
      const res = await fetch("/api/reviews/ai-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewId: review.id,
          reviewData: review,
          workspaceId: ws?.id,
          businessName: ws?.name,
          businessCategory: ws?.category,
        }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.options)) {
        setOptions(data.options);
      } else {
        console.warn("AI reply notice:", data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAI(false);
    }
  };

  const copyReply = (content: string, type: string) => {
    navigator.clipboard.writeText(content);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const ratingCounts = React.useMemo(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    for (const r of reviews) {
      const star = Math.max(1, Math.min(5, Math.floor(r.rating || 5)));
      counts[star] = (counts[star] || 0) + 1;
    }
    return counts;
  }, [reviews]);

  const filteredReviews = React.useMemo(() => {
    return reviews
      .filter((r) => {
        if (filterRating !== "all") {
          const star = Math.max(1, Math.min(5, Math.floor(r.rating || 5)));
          if (star !== Number(filterRating)) return false;
        }
        if (
          searchQuery &&
          !r.authorName.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !r.reviewText.toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "recent") {
          return new Date(b.reviewDate).getTime() - new Date(a.reviewDate).getTime();
        }
        if (sortBy === "oldest") {
          return new Date(a.reviewDate).getTime() - new Date(b.reviewDate).getTime();
        }
        if (sortBy === "rating_desc") {
          return b.rating - a.rating;
        }
        if (sortBy === "rating_asc") {
          return a.rating - b.rating;
        }
        return 0;
      });
  }, [reviews, filterRating, searchQuery, sortBy]);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-card border border-line rounded-3xl p-6 sm:p-7 sp-card-shadow flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              PulseMind™ Neural Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight flex items-center gap-2">
            <span>AI Review Auto-Responder</span>
          </h1>
          <p className="text-xs sm:text-sm text-mute">
            Synthesizes 3 strategic response angles with local Google Maps keyword insertion.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => selectedReview && generateReplies(selectedReview)}
            disabled={loadingAI || !selectedReview}
            className="tp-btn-dark px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Regenerate Angles</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid: Review Queue (5 cols) + Response Generator (7 cols) */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: REVIEW SELECTOR */}
        <div className="lg:col-span-5 bg-card rounded-3xl border border-line sp-card-shadow overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-line space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-xs uppercase tracking-wider text-mute">
                Reviews Queue ({filteredReviews.length} of {reviews.length})
              </h2>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-stage border border-line rounded-lg px-2 py-0.5 text-[11px] font-semibold text-ink focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="recent">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="rating_desc">Highest (5★)</option>
                <option value="rating_asc">Lowest (1★)</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-mute absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-stage/50 border border-line rounded-xl pl-8 pr-3 py-1.5 text-ink focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Star Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setFilterRating("all")}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer shrink-0 ${
                  filterRating === "all"
                    ? "bg-slate-900 text-white dark:bg-emerald-600"
                    : "bg-stage text-mute hover:text-ink"
                }`}
              >
                All ({reviews.length})
              </button>
              {[5, 4, 3, 2, 1].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFilterRating(filterRating === String(s) ? "all" : String(s))}
                  className={`px-2 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-0.5 shrink-0 ${
                    filterRating === String(s)
                      ? "bg-amber-500 text-slate-950 font-black"
                      : "bg-stage text-mute hover:text-ink"
                  }`}
                >
                  <span>{s}★</span>
                  <span className="opacity-75 text-[10px]">({ratingCounts[s] || 0})</span>
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-line max-h-[580px] overflow-y-auto">
            {filteredReviews.length === 0 ? (
              <div className="p-8 text-center text-xs text-mute space-y-2">
                <p>No reviews found matching filters.</p>
                <button
                  type="button"
                  onClick={() => {
                    setFilterRating("all");
                    setSearchQuery("");
                  }}
                  className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              filteredReviews.map((r) => {
                const isSelected = selectedReview?.id === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => generateReplies(r)}
                    className={`p-4 sm:p-5 cursor-pointer transition-all ${
                      isSelected
                        ? "bg-emerald-500/10 border-l-4 border-emerald-500"
                        : "hover:bg-stage/60"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-extrabold text-xs text-ink">
                        {r.authorName}
                      </span>
                      <div className="flex text-amber-400 text-xs gap-0.5">
                        {Array.from({ length: Math.min(5, Math.max(0, Math.floor(r.rating || 0))) }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-mute line-clamp-2 leading-relaxed">
                      &ldquo;{r.reviewText}&rdquo;
                    </p>
                    <div className="mt-2.5 flex items-center justify-between text-[10px]">
                      <span className="uppercase font-bold text-mute">{r.platform}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        {isSelected ? "Active Review" : "Tap to Generate AI →"}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: GENERATED RESPONSES */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-card rounded-3xl border border-line sp-card-shadow p-6 sm:p-7 space-y-6">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                  Target Customer Feedback
                </span>
                <h3 className="font-extrabold text-base text-ink mt-0.5">
                  {selectedReview ? `${selectedReview.authorName} (${selectedReview.rating}★)` : "Select a review"}
                </h3>
              </div>
              {selectedReview?.platform === "google" && <GoogleBadge />}
              {selectedReview?.platform === "trustpilot" && <TrustpilotBadge />}
            </div>

            {selectedReview && (
              <div className="p-4 rounded-2xl bg-stage border border-line text-xs italic text-ink leading-relaxed">
                &ldquo;{selectedReview.reviewText}&rdquo;
              </div>
            )}

            {/* AI Generator Loading State */}
            {loadingAI && (
              <div className="py-14 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin mx-auto" />
                <p className="text-xs text-mute font-medium">
                  PulseMind™ Neural Engine is generating 3 strategic response angles...
                </p>
              </div>
            )}

            {/* AI Options Generated */}
            {!loadingAI && options.length > 0 && (
              <div className="space-y-4">
                {options.map((opt) => {
                  const isCopied = copiedType === opt.type;
                  return (
                    <div
                      key={opt.type}
                      className="p-5 rounded-2xl border border-line bg-stage/40 hover:border-emerald-500/40 transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="font-extrabold text-sm text-ink block">
                            {opt.title}
                          </span>
                          <span className="text-[11px] text-mute">
                            {opt.description}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyReply(opt.content, opt.type)}
                          className="tp-btn-light px-3.5 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 self-start sm:self-auto cursor-pointer"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Response</span>
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-xs sm:text-sm text-ink leading-relaxed bg-card p-4 rounded-xl border border-line">
                        {opt.content}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {!loadingAI && options.length === 0 && (
              <div className="py-12 text-center text-xs text-mute space-y-2">
                <Sparkles className="w-8 h-8 text-emerald-500 mx-auto" />
                <p>Click on any review from the queue or tap &ldquo;Regenerate Angles&rdquo; to draft replies.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
