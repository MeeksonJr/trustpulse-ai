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
  Code2,
  Copy,
  Check,
  Star,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Layers,
  LayoutGrid,
  Bell,
  BadgeCheck,
} from "lucide-react";
import { TrustPulseStore } from "@/lib/storage/trustpulse-store";
import { GoogleBadge, TrustpilotBadge } from "@/components/ui/PlatformBadges";

export default function PublicWidgetPage() {
  const { isDark, toggleTheme } = usePublicTheme(false);
  const workspaces = TrustPulseStore.getWorkspaces();
  const [selectedWsId, setSelectedWsId] = useState<string>("ws-apex-dental");
  const ws = workspaces.find((w) => w.id === selectedWsId) || workspaces[0];

  const reviews = TrustPulseStore.getReviews(ws.id);
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedIframe, setCopiedIframe] = useState(false);
  const [origin, setOrigin] = useState("https://trustpulse-ai-phi.vercel.app");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const scriptTag = `<script src="${origin}/api/widget/script?id=widget-apex-toasts" defer></script>`;
  const iframeTag = `<iframe src="${origin}/embed/widget-apex-wall" width="100%" height="600" frameborder="0" loading="lazy"></iframe>`;

  const copyScript = () => {
    navigator.clipboard.writeText(scriptTag);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const copyIframe = () => {
    navigator.clipboard.writeText(iframeTag);
    setCopiedIframe(true);
    setTimeout(() => setCopiedIframe(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink transition-colors selection:bg-emerald-500 selection:text-white">
      <PublicNavbar isDark={isDark} onToggleTheme={toggleTheme} />

      <main className="flex-1">
        {/* Page Hero */}
        <PageHero
          eyebrow="Social Proof Display Engine"
          title={
            <>
              Embed Authentic Social Proof on{" "}
              <span className="text-emerald-600 dark:text-emerald-400">
                Any Website
              </span>
            </>
          }
          subtitle="Showcase verified Google &amp; Trustpilot testimonials with lightweight floating toasts, responsive wall-of-love grids, or floating trust badges with a single <script> tag."
        >
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/signup"
              className="tp-btn-dark px-6 py-3 rounded-full text-xs font-bold inline-flex items-center gap-2 shadow-lg"
            >
              <span>Build Custom Widget</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
            <Link
              href="/demo/apex-dental-site"
              className="tp-btn-light px-5 py-3 rounded-full text-xs font-bold inline-flex items-center gap-2"
            >
              <span>See Live Client Demo</span>
            </Link>
          </div>
        </PageHero>

        {/* 2 Embed Methods Grid */}
        <Section tone="stage" className="border-y border-line !py-14">
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Snippet A */}
            <Card hover={true} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-ink">
                      A. 1-Line Async Script (Toasts)
                    </h3>
                    <span className="text-[10px] text-mute font-mono">Self-injecting vanilla JS</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={copyScript}
                  className="tp-btn-light px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript ? "Copied!" : "Copy"}</span>
                </button>
              </div>

              <div className="p-3.5 bg-slate-950 text-emerald-400 font-mono text-xs rounded-2xl border border-slate-800 break-all overflow-x-auto">
                {scriptTag}
              </div>

              <p className="text-[11px] text-mute leading-relaxed">
                Recommended for Webflow, Shopify, Squarespace, and custom HTML. Under 15KB with zero dependencies.
              </p>
            </Card>

            {/* Snippet B */}
            <Card hover={true} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
                    <LayoutGrid className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-ink">
                      B. Responsive iFrame Wall
                    </h3>
                    <span className="text-[10px] text-mute font-mono">Sandboxed masonry container</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={copyIframe}
                  className="tp-btn-light px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedIframe ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedIframe ? "Copied!" : "Copy"}</span>
                </button>
              </div>

              <div className="p-3.5 bg-slate-950 text-slate-200 font-mono text-xs rounded-2xl border border-slate-800 break-all overflow-x-auto">
                {iframeTag}
              </div>

              <p className="text-[11px] text-mute leading-relaxed">
                Best for WordPress Elementor, Divi, or Wix blocks that require a secure iframe block.
              </p>
            </Card>
          </div>
        </Section>

        {/* Live Preview Wall of Love */}
        <Section>
          <div className="bg-card rounded-3xl border border-line p-6 sm:p-10 sp-card-shadow space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-ink flex items-center gap-2.5">
                  <span>Wall of Love: {ws.name}</span>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Reviews
                  </span>
                </h2>
                <p className="text-xs text-mute mt-1">
                  Real-time verified client reviews formatted for maximum appointment conversion
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <select
                  value={selectedWsId}
                  onChange={(e) => setSelectedWsId(e.target.value)}
                  className="text-xs font-bold bg-stage border border-line rounded-xl px-3.5 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {workspaces.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
                <Link
                  href={`/embed/${ws.id === "ws-apex-dental" ? "widget-apex-wall" : "widget-bayview-badge"}`}
                  target="_blank"
                  className="tp-btn-light px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <span>Standalone View</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Reviews Masonry Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="p-5 rounded-2xl border border-line bg-stage/40 hover:bg-stage/80 transition-all duration-200 flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex text-amber-400 gap-0.5">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                      {r.platform === "google" && <GoogleBadge />}
                      {r.platform === "trustpilot" && <TrustpilotBadge />}
                      {r.platform !== "google" && r.platform !== "trustpilot" && (
                        <span className="text-[10px] uppercase font-bold text-mute">
                          {r.platform}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-ink leading-relaxed italic">
                      &ldquo;{r.reviewText}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-line">
                    <img
                      src={
                        r.authorAvatar ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                      }
                      alt={r.authorName}
                      className="w-8 h-8 rounded-full object-cover border border-line"
                    />
                    <div>
                      <div className="text-xs font-bold text-ink">
                        {r.authorName}
                      </div>
                      <div className="text-[10px] text-mute">
                        {r.authorRole || "Verified Client"} {r.authorLocation ? `• ${r.authorLocation}` : ""}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </main>

      <PublicFooter isDark={isDark} onToggleTheme={toggleTheme} />
    </div>
  );
}
