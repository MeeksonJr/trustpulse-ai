"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  HeartHandshake,
  ArrowRight,
  Copy,
  Check,
  MessageSquareWarning,
  Sparkles,
  Lock,
  ThumbsUp,
  MapPin,
  Clock,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { TrustPulseStore } from "@/lib/storage/trustpulse-store";
import { Workspace } from "@/types/trustpulse";

const SUGGESTED_TAGS = [
  "Friendly Staff",
  "Super Clean",
  "On Time",
  "Gentle & Thorough",
  "Great Communication",
  "Highly Recommend",
];

export default function ReviewFunnelPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "apex-dental";

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // Positive flow state
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [positiveComment, setPositiveComment] = useState("");
  const [copied, setCopied] = useState(false);

  // Private feedback (Shield) state
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [grievanceText, setGrievanceText] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    // 1. Try local TrustPulse store first (immediate)
    const local = TrustPulseStore.getWorkspaceBySlug(slug);
    if (local) {
      setWorkspace(local);
      setLoading(false);
    }

    // 2. Query API to ensure server-persisted workspaces are fresh
    fetch(`/api/workspaces?slug=${encodeURIComponent(slug)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.workspace) {
          setWorkspace(data.workspace);
        } else if (!local) {
          const formattedName = slug
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
          setWorkspace({
            id: `ws-${slug}`,
            name: formattedName,
            slug: slug,
            category: "Verified Local Practice",
            brandColor: "#10b981",
            googleReviewUrl: "https://maps.google.com",
            starThreshold: 4,
            customHeadline: `How was your visit to ${formattedName}?`,
            customSubheadline: "Tap a star to share your genuine experience with our team.",
            createdAt: new Date().toISOString(),
            stats: {
              averageRating: 5.0,
              totalReviews: 128,
              shieldedReviews: 0,
              positiveRedirects: 128,
            },
          });
        }
      })
      .catch(() => {
        if (!local) {
          const formattedName = slug
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
          setWorkspace({
            id: `ws-${slug}`,
            name: formattedName,
            slug: slug,
            category: "Verified Local Practice",
            brandColor: "#10b981",
            googleReviewUrl: "https://maps.google.com",
            starThreshold: 4,
            customHeadline: "How was your experience today?",
            customSubheadline: "Tap a star to share your genuine experience with our team.",
            createdAt: new Date().toISOString(),
            stats: {
              averageRating: 5.0,
              totalReviews: 128,
              shieldedReviews: 0,
              positiveRedirects: 128,
            },
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  const toggleTag = (tag: string) => {
    const nextTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(nextTags);

    // Auto-update review suggestion with selected tags
    if (nextTags.length > 0) {
      const tagSentence = `Everything was great! Loved the ${nextTags.join(", ").toLowerCase()}.`;
      if (!positiveComment || SUGGESTED_TAGS.some((st) => positiveComment.includes(st.toLowerCase()))) {
        setPositiveComment(tagSentence);
      }
    }
  };

  const handleCopyAndRedirect = () => {
    const textToCopy = positiveComment.trim() || "Had an exceptional visit! Friendly staff, prompt service, and wonderful care.";
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
    }
    setCopied(true);
    setTimeout(() => {
      window.open(workspace?.googleReviewUrl || "https://maps.google.com", "_blank");
      setCopied(false);
    }, 600);
  };

  const handlePrivateFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !grievanceText) return;

    setSubmittingFeedback(true);
    try {
      await fetch("/api/shield/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId: workspace?.id,
          rating: selectedRating,
          customerName,
          customerEmail,
          customerPhone,
          grievanceText,
        }),
      });

      TrustPulseStore.addPrivateFeedback({
        workspaceId: workspace?.id || `ws-${slug}`,
        rating: Number(selectedRating) || 2,
        customerName,
        customerEmail,
        customerPhone,
        grievanceText,
        status: "new",
      });

      setFeedbackSubmitted(true);
    } catch (err) {
      console.error(err);
      setFeedbackSubmitted(true);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading || !workspace) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent" />
          <span className="text-xs font-mono tracking-widest uppercase text-slate-400">
            Connecting Secure Gatekeeper...
          </span>
        </div>
      </div>
    );
  }

  const isPositive = selectedRating !== null && selectedRating >= workspace.starThreshold;
  const isNegative = selectedRating !== null && selectedRating < workspace.starThreshold;
  const brandColor = workspace.brandColor || "#10b981";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans selection:bg-emerald-500 selection:text-white">
      {/* Background Glow Mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[350px] rounded-full blur-[100px] opacity-20"
          style={{ backgroundColor: brandColor }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* Main Container */}
      <div className="max-w-md w-full relative z-10">
        {/* Verification Pill */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Verified Customer Direct Channel
          </span>
        </div>

        {/* Card */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl shadow-black/60 overflow-hidden transition-all duration-300">
          {/* Top Brand Accent Line */}
          <div className="h-1.5 w-full" style={{ backgroundColor: brandColor }} />

          <div className="p-6 sm:p-8">
            {/* Business Brand Header */}
            <div className="text-center mb-6">
              <div
                className="w-16 h-16 rounded-2xl mx-auto mb-3.5 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg ring-4 ring-slate-800"
                style={{ backgroundColor: brandColor }}
              >
                {workspace.name.charAt(0)}
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {workspace.name}
              </h1>
              <p className="text-xs font-medium text-slate-400 mt-1 flex items-center justify-center gap-1.5">
                <span>{workspace.category}</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                  <Star className="w-3 h-3 fill-emerald-400" />
                  {workspace.stats?.averageRating || "4.9"} ({(workspace.stats?.totalReviews || 120).toLocaleString()}+)
                </span>
              </p>
            </div>

            {/* STATE 0: INITIAL STAR RATING SELECTOR */}
            {selectedRating === null && (
              <div className="text-center py-2 animate-in fade-in zoom-in-95 duration-200">
                <h2 className="text-lg font-bold text-white mb-2 leading-snug">
                  {workspace.customHeadline || "How was your experience today?"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mb-6 max-w-xs mx-auto leading-relaxed">
                  {workspace.customSubheadline || "Tap a star to share your genuine experience with our team:"}
                </p>

                {/* 5 Big Touch Stars */}
                <div className="flex items-center justify-center gap-2 sm:gap-3 py-4">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = (hoverRating || 0) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        onClick={() => setSelectedRating(star)}
                        className="p-1 sm:p-2 rounded-2xl transition-all duration-150 transform hover:scale-125 focus:outline-none cursor-pointer group"
                        aria-label={`Rate ${star} out of 5 stars`}
                      >
                        <Star
                          className={`w-10 h-10 sm:w-12 sm:h-12 transition-all duration-150 ${
                            active
                              ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)] scale-110"
                              : "text-slate-700 fill-slate-800/80 group-hover:text-amber-400/50"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] font-medium text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Takes less than 15 seconds • No account needed</span>
                </div>
              </div>
            )}

            {/* STATE 1: POSITIVE FLOW (4 or 5 Stars -> Direct Google Redirect with 1-click Review Copy) */}
            {isPositive && (
              <div className="text-center py-2 animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
                <div className="w-14 h-14 bg-amber-400/10 rounded-2xl border border-amber-400/20 flex items-center justify-center mx-auto shadow-inner">
                  <div className="flex text-amber-400">
                    {Array.from({ length: selectedRating || 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight">
                    Thank You! That Means The World. 🎉
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed max-w-sm mx-auto">
                    Would you share your {selectedRating}-star rating on Google? It takes 1 click and helps other locals discover {workspace.name}.
                  </p>
                </div>

                {/* Quick Highlight Tags */}
                <div className="text-left bg-slate-800/50 p-4 rounded-2xl border border-slate-700/60">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                      Tap what you loved (optional):
                    </span>
                    <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Quick Prep
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {SUGGESTED_TAGS.map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className={`text-xs px-2.5 py-1 rounded-lg transition-all cursor-pointer font-medium ${
                            isSelected
                              ? "bg-emerald-500 text-white font-semibold shadow-xs"
                              : "bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white"
                          }`}
                        >
                          {isSelected ? `✓ ${tag}` : `+ ${tag}`}
                        </button>
                      );
                    })}
                  </div>

                  <textarea
                    value={positiveComment}
                    onChange={(e) => setPositiveComment(e.target.value)}
                    placeholder="Add any specific shout-out for the team..."
                    rows={2}
                    className="w-full text-xs sm:text-sm rounded-xl border border-slate-700 bg-slate-900/90 p-3 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-white placeholder-slate-500 resize-none"
                  />
                </div>

                {/* Main Action Button */}
                <button
                  type="button"
                  onClick={handleCopyAndRedirect}
                  className="w-full py-4 px-6 rounded-2xl font-bold text-sm text-white shadow-xl transition-all flex items-center justify-center gap-2 hover:opacity-95 transform active:scale-[0.98] cursor-pointer"
                  style={{ backgroundColor: brandColor }}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied! Opening Google Reviews...</span>
                    </>
                  ) : (
                    <>
                      <span>{positiveComment ? "Copy Review & Open Google Maps" : "Continue to Google Reviews"}</span>
                      <ExternalLink className="w-4 h-4 ml-0.5" />
                    </>
                  )}
                </button>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedRating(null)}
                    className="text-xs font-semibold text-slate-400 hover:text-slate-200 underline cursor-pointer"
                  >
                    ← Change rating
                  </button>
                </div>
              </div>
            )}

            {/* STATE 2: NEGATIVE FLOW (1-3 Stars -> Negative Review Shield / Private Form) */}
            {isNegative && !feedbackSubmitted && (
              <div className="py-2 animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
                <div className="flex items-start gap-3 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-left">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 flex-shrink-0 mt-0.5">
                    <MessageSquareWarning className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-rose-200">
                      We are sincerely sorry your visit fell short.
                    </h3>
                    <p className="text-xs text-rose-300/80 mt-0.5 leading-relaxed">
                      Your candid feedback will go straight to our clinic director so we can immediately address and rectify this.
                    </p>
                  </div>
                </div>

                <form onSubmit={handlePrivateFeedbackSubmit} className="space-y-3.5 text-left">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full text-xs sm:text-sm rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none text-white placeholder-slate-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="sarah@example.com"
                        className="w-full text-xs sm:text-sm rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none text-white placeholder-slate-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Phone (Optional)
                      </label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="(555) 000-0000"
                        className="w-full text-xs sm:text-sm rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none text-white placeholder-slate-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                      What went wrong and how can we make it right? *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={grievanceText}
                      onChange={(e) => setGrievanceText(e.target.value)}
                      placeholder="Please let us know what happened during your visit..."
                      className="w-full text-xs sm:text-sm rounded-xl border border-slate-700 bg-slate-900/90 p-3.5 focus:ring-2 focus:ring-rose-500 focus:outline-none text-white placeholder-slate-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingFeedback}
                    className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-950/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    <HeartHandshake className="w-4 h-4 text-white" />
                    <span>
                      {submittingFeedback ? "Delivering to Director..." : "Send Private Feedback to Leadership"}
                    </span>
                  </button>
                </form>

                <div className="pt-1 text-center">
                  <button
                    type="button"
                    onClick={() => setSelectedRating(null)}
                    className="text-xs font-semibold text-slate-400 hover:text-slate-200 underline cursor-pointer"
                  >
                    ← Change rating
                  </button>
                </div>
              </div>
            )}

            {/* STATE 3: NEGATIVE FLOW SUBMITTED STATE */}
            {isNegative && feedbackSubmitted && (
              <div className="text-center py-6 animate-in fade-in zoom-in-95 duration-200 space-y-4">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400 shadow-inner">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight">
                    Thank You for Your Direct Candor
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed max-w-xs mx-auto">
                    Your grievance has been submitted directly to the leadership team of {workspace.name}. We will review the details and reach out within 24 hours to resolve this.
                  </p>
                </div>
                <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/80 text-[11px] text-slate-400 flex items-center justify-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Confidential: Stored securely, never posted publicly on Google.</span>
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="bg-slate-950/80 border-t border-slate-800/80 py-3 px-6 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <span>Powered by</span>
            <Link href="/" className="font-semibold text-slate-300 hover:text-emerald-400 transition-colors">
              TrustPulse AI
            </Link>
            <span>• Negative Review Shield™</span>
          </div>
        </div>
      </div>
    </div>
  );
}
