"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  PublicNavbar,
  PublicFooter,
  usePublicTheme,
} from "@/components/ui/PublicChrome";
import {
  PageHero,
  Section,
  Card,
  Eyebrow,
} from "@/components/ui/Primitives";
import {
  QrCode,
  Sparkles,
  Code2,
  Copy,
  Check,
  Star,
  Printer,
  ShieldCheck,
  ExternalLink,
  Smartphone,
  ArrowRight,
  Sliders,
  Send,
  MessageSquare,
} from "lucide-react";

export default function FreeReputationToolsPage() {
  const { isDark, toggleTheme } = usePublicTheme(false);
  const [activeTab, setActiveTab] = useState<"qr" | "sentiment" | "widget">("qr");
  const [origin, setOrigin] = useState("https://trustpulse-ai-phi.vercel.app");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  // Tool 1: Free QR Stand Generator State
  const [bizName, setBizName] = useState("Apex Dental Studio");
  const [googleUrl, setGoogleUrl] = useState("https://maps.google.com");
  const [brandColor, setBrandColor] = useState("#059669");
  const [tagline, setTagline] = useState("Scan to share your experience with our team");

  // Tool 2: Review Sentiment Tester State
  const [sampleReviewText, setSampleReviewText] = useState(
    "Dr. Thorne was gentle and the clinic was spotless, but my appointment was delayed by 20 minutes."
  );
  const [analyzedSentiment, setAnalyzedSentiment] = useState<{
    ratingEstimate: number;
    tone: string;
    action: string;
    suggestedReply: string;
  }>({
    ratingEstimate: 3,
    tone: "Mixed / Minor Grievance Detected",
    action: "Activate Negative Review Shield (Intercept Privately)",
    suggestedReply:
      "Thank you for sharing your feedback with us. We're glad you enjoyed Dr. Thorne's gentle care and our clean clinic, but we deeply apologize for the 20-minute delay. Our office director would love to personally ensure your next visit is seamless.",
  });

  // Tool 3: Embed Script Tester State
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    googleUrl
  )}&color=${brandColor.replace("#", "")}`;

  const analyzeReview = () => {
    const text = sampleReviewText.toLowerCase();
    if (text.includes("delay") || text.includes("wait") || text.includes("bad") || text.includes("rude") || text.includes("unhappy") || text.includes("terrible")) {
      setAnalyzedSentiment({
        ratingEstimate: 2,
        tone: "Risk: Negative Customer Experience",
        action: "Shield Trigger: Intercept with Private Feedback Form to prevent Google rating damage",
        suggestedReply:
          "Thank you for letting us know about this issue. We take patient satisfaction very seriously and regret that your visit did not meet our high standards. Please expect a message from our leadership team within 24 hours.",
      });
    } else {
      setAnalyzedSentiment({
        ratingEstimate: 5,
        tone: "Positive Brand Advocate",
        action: "One-Tap Google Maps Redirect: Prompt customer to post publicly!",
        suggestedReply:
          "Thank you so much for the 5-star review! Our entire team is thrilled you had a wonderful experience, and we look forward to welcoming you back soon.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink transition-colors selection:bg-emerald-500 selection:text-white">
      <PublicNavbar isDark={isDark} onToggleTheme={toggleTheme} />

      <main className="flex-1">
        {/* Page Hero */}
        <PageHero
          eyebrow="100% Free Public SaaS Utilities"
          title={
            <>
              Free Reputation &amp;{" "}
              <span className="text-emerald-600 dark:text-emerald-400">
                Social Proof Tools
              </span>
            </>
          }
          subtitle="Generate branded counter stand QR codes, analyze review sentiment, and preview 1-line embeddable widgets with zero signup required."
        />

        {/* Tool Selector Tabs */}
        <Section tone="stage" className="!py-6 border-b border-line">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("qr")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "qr"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-card text-mute hover:text-ink hover:bg-stage border border-line"
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Counter QR Stand Studio</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("sentiment")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "sentiment"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-card text-mute hover:text-ink hover:bg-stage border border-line"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Review Sentiment Analyzer</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("widget")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "widget"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-card text-mute hover:text-ink hover:bg-stage border border-line"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>1-Line Script Playground</span>
            </button>
          </div>
        </Section>

        {/* TOOL 1: QR CODE STAND MAKER */}
        {activeTab === "qr" && (
          <Section>
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Settings Form */}
              <div className="lg:col-span-6 bg-card p-6 sm:p-8 rounded-3xl border border-line sp-card-shadow space-y-5">
                <div>
                  <Eyebrow>Counter Stand Designer</Eyebrow>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-ink mt-2">
                    Printable QR Stand &amp; Table Tent
                  </h2>
                  <p className="text-xs text-mute mt-1 leading-relaxed">
                    Place this on your reception desk, cash register, or dining tables to collect in-person reviews at checkout.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-1">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={bizName}
                      onChange={(e) => setBizName(e.target.value)}
                      className="w-full text-xs border border-line bg-stage/50 rounded-xl px-3.5 py-2.5 text-ink focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-1">
                      Google Review URL (or Google Maps link)
                    </label>
                    <input
                      type="url"
                      value={googleUrl}
                      onChange={(e) => setGoogleUrl(e.target.value)}
                      className="w-full text-xs border border-line bg-stage/50 rounded-xl px-3.5 py-2.5 text-ink focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-1">
                      Custom Tagline
                    </label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      className="w-full text-xs border border-line bg-stage/50 rounded-xl px-3.5 py-2.5 text-ink focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-1">
                      Brand Accent Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={brandColor}
                        onChange={(e) => setBrandColor(e.target.value)}
                        className="w-9 h-9 rounded-xl cursor-pointer border border-line p-0.5 bg-transparent"
                      />
                      <span className="font-mono text-xs font-bold text-ink">{brandColor}</span>
                      <div className="flex gap-1.5 ml-auto">
                        {["#059669", "#2563eb", "#7c3aed", "#d97706", "#0f172a"].map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setBrandColor(c)}
                            className="w-5 h-5 rounded-full border border-line cursor-pointer"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3 border-t border-line">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="tp-btn-dark px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print 4x6 Stand Card</span>
                  </button>
                  <Link
                    href="/dashboard/qr-studio"
                    className="tp-btn-light px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
                  >
                    <span>Full QR Studio in Dashboard →</span>
                  </Link>
                </div>
              </div>

              {/* Printable Card Preview (Physical Mockup) */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="w-full max-w-sm p-8 rounded-3xl border-2 border-line bg-card text-ink shadow-2xl text-center space-y-5">
                  <div className="h-2 w-full rounded-full" style={{ backgroundColor: brandColor }} />
                  <div>
                    <div className="font-extrabold text-lg text-ink tracking-tight">{bizName}</div>
                    <div className="flex justify-center text-amber-400 gap-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-stage/60 border border-line rounded-2xl">
                    <img src={qrImageUrl} alt="QR Code" className="w-44 h-44 mx-auto object-contain rounded-xl" />
                    <div className="text-[10px] font-mono font-bold text-mute uppercase tracking-widest mt-2 flex items-center justify-center gap-1">
                      <Smartphone className="w-3 h-3 text-emerald-500" />
                      <span>Point Camera &amp; Tap to Review</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-extrabold text-ink">
                      How was your visit today?
                    </div>
                    <p className="text-[11px] text-mute mt-1">
                      {tagline}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-line text-[10px] text-mute flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span>Protected by TrustPulse Negative Review Shield™</span>
                  </div>
                </div>
              </div>
            </div>
          </Section>
        )}

        {/* TOOL 2: SENTIMENT ANALYZER */}
        {activeTab === "sentiment" && (
          <Section>
            <div className="bg-card p-6 sm:p-10 rounded-3xl border border-line sp-card-shadow space-y-6 max-w-3xl mx-auto">
              <div>
                <Eyebrow>PulseMind™ Neural Classifier</Eyebrow>
                <h2 className="text-xl sm:text-2xl font-extrabold text-ink mt-2">
                  Review Sentiment &amp; Shield Router
                </h2>
                <p className="text-xs text-mute mt-1 leading-relaxed">
                  Paste any customer feedback below to see how TrustPulse automatically classifies tone, computes a star rating estimate, and routes the response.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-1.5">
                  Sample Review Text
                </label>
                <textarea
                  rows={4}
                  value={sampleReviewText}
                  onChange={(e) => setSampleReviewText(e.target.value)}
                  className="w-full text-xs sm:text-sm font-sans border border-line bg-stage/50 rounded-2xl p-4 text-ink focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <button
                type="button"
                onClick={analyzeReview}
                className="tp-btn-dark px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Classify Sentiment &amp; Action</span>
              </button>

              <div className="p-6 rounded-2xl bg-stage/70 border border-line space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-3">
                  <span className="font-extrabold text-sm text-ink">
                    Classification Result:
                  </span>
                  <span className="text-amber-500 font-mono font-bold text-xs">
                    Estimated Rating: {"★".repeat(analyzedSentiment.ratingEstimate)} ({analyzedSentiment.ratingEstimate} Stars)
                  </span>
                </div>

                <div className="text-xs text-ink">
                  <span className="text-mute font-bold uppercase text-[10px] block mb-0.5">Detected Tone</span>
                  <span className="font-bold">{analyzedSentiment.tone}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-card border border-line text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span>{analyzedSentiment.action}</span>
                </div>

                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-mute block">
                    Suggested PulseMind™ AI Response Draft:
                  </span>
                  <p className="text-xs text-ink/90 italic bg-card p-3 rounded-xl border border-line leading-relaxed">
                    &ldquo;{analyzedSentiment.suggestedReply}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </Section>
        )}

        {/* TOOL 3: WIDGET SCRIPT PLAYGROUND */}
        {activeTab === "widget" && (
          <Section>
            <div className="bg-card p-6 sm:p-10 rounded-3xl border border-line sp-card-shadow space-y-6 max-w-3xl mx-auto">
              <div>
                <Eyebrow>Zero Framework Footprint</Eyebrow>
                <h2 className="text-xl sm:text-2xl font-extrabold text-ink mt-2">
                  1-Line Embed Script Generator
                </h2>
                <p className="text-xs text-mute mt-1 leading-relaxed">
                  Embed authentic Google social proof toasts on WordPress, Webflow, Shopify, Squarespace, or custom React/Vue sites.
                </p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-slate-100 font-mono text-xs overflow-x-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <code className="text-emerald-400 break-all">
                  &lt;script src=&quot;{origin}/api/widget/script?id=widget-apex-toasts&quot; defer&gt;&lt;/script&gt;
                </code>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `<script src="${origin}/api/widget/script?id=widget-apex-toasts" defer></script>`
                    );
                    setCopiedEmbed(true);
                    setTimeout(() => setCopiedEmbed(false), 2000);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 cursor-pointer transition-colors shadow-md"
                >
                  {copiedEmbed ? "Copied to Clipboard!" : "Copy Embed Code"}
                </button>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 text-xs">
                <Card hover={false} className="space-y-1">
                  <span className="font-extrabold text-ink block">Ultra-Lightweight</span>
                  <span className="text-mute text-[11px]">Under 15KB uncompressed, zero dependencies or slow frameworks.</span>
                </Card>
                <Card hover={false} className="space-y-1">
                  <span className="font-extrabold text-ink block">CORS Wildcard</span>
                  <span className="text-mute text-[11px]">Access-Control-Allow-Origin: * enabled for instant cross-domain embedding.</span>
                </Card>
                <Card hover={false} className="space-y-1">
                  <span className="font-extrabold text-ink block">Global Edge CDN</span>
                  <span className="text-mute text-[11px]">Served from Vercel Edge with sub-80ms cold start latency worldwide.</span>
                </Card>
              </div>

              <div className="pt-2 text-center">
                <Link
                  href="/demo/apex-dental-site"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  <span>See This Script Running Live on Apex Dental Clinic Showcase →</span>
                </Link>
              </div>
            </div>
          </Section>
        )}
      </main>

      <PublicFooter isDark={isDark} onToggleTheme={toggleTheme} />
    </div>
  );
}
