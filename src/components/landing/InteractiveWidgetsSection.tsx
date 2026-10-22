"use client";

import React, { useState } from "react";
import { Code2, Copy, Check, Star, CheckCircle2, MessageSquare, LayoutGrid, Bell } from "lucide-react";
import { Section, SectionHeader, Card } from "@/components/ui/Primitives";
import Link from "next/link";

const SAMPLES = [
  {
    name: "Sarah Jenkins",
    role: "Verified Patient",
    time: "2 hours ago",
    stars: 5,
    source: "Google",
    text: "Painless sedation and 3D imaging made my dental implant journey completely seamless. Dr. Thorne is amazing!",
    tag: "Dental Care",
  },
  {
    name: "Marcus Vance",
    role: "Local Guide",
    time: "Yesterday",
    stars: 5,
    source: "Google",
    text: "Down-to-earth bar with a great covered patio, cold craft beers, and welcoming staff. Easily a Norfolk gem.",
    tag: "Dining & Bar",
  },
  {
    name: "Elena Rostova",
    role: "Verified Buyer",
    time: "3 days ago",
    stars: 5,
    source: "Trustpilot",
    text: "Saved our engineering team over 14 hours per week on AWS cost management. Super clean UI.",
    tag: "B2B SaaS",
  },
];

export function InteractiveWidgetsSection() {
  const [tab, setTab] = useState<"toast" | "wall" | "badge">("toast");
  const [copied, setCopied] = useState(false);

  const embedScript = `<script src="https://trustpulse-ai-phi.vercel.app/api/widget/script?id=widget-apex-toasts" defer></script>`;

  const copyCode = () => {
    navigator.clipboard.writeText(embedScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Section id="widgets" tone="default" className="border-t border-line">
      <SectionHeader
        eyebrow="Social Proof Studio"
        title="1-Line embeddable widgets that boost conversions."
        subtitle="Zero npm dependencies. Works natively on Webflow, WordPress, Shopify, Next.js, and custom HTML. Loads under 12ms via global Edge CDN."
      />

      {/* Tabs */}
      <div className="mt-12 flex justify-center">
        <div className="inline-flex rounded-full border border-line bg-stage p-1.5 gap-1 sp-card-shadow">
          {[
            { id: "toast", label: "Floating Social Proof Toasts", icon: Bell },
            { id: "wall", label: "Wall of Love Masonry Grid", icon: LayoutGrid },
            { id: "badge", label: "Floating Rating Badge", icon: MessageSquare },
          ].map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id as "toast" | "wall" | "badge")}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  active
                    ? "bg-card text-ink shadow-sm border border-line/80"
                    : "text-mute hover:text-ink"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? "text-emerald-500" : ""}`} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Interactive Preview Box */}
      <div className="mt-8 rounded-3xl border border-line bg-stage/50 p-6 sm:p-10 relative overflow-hidden min-h-[380px] flex flex-col justify-between">
        {/* Toast View */}
        {tab === "toast" && (
          <div className="max-w-xl mx-auto my-auto w-full">
            <div className="text-center text-xs text-mute font-mono uppercase tracking-wider mb-4">
              Live Toast Widget Preview (Bottom-Left on Client Site)
            </div>
            <div className="rounded-2xl border border-line bg-card p-4 sm:p-5 shadow-2xl flex items-start gap-4 animate-in fade-in zoom-in-95 duration-300">
              <span className="h-10 w-10 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 grid place-items-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="text-sm font-bold text-ink">Sarah Jenkins</div>
                  <div className="flex items-center gap-1 text-[11px] text-mute font-mono">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Verified Google Review
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-1.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs text-mute ml-1 font-semibold">5.0</span>
                </div>
                <p className="text-xs text-mute leading-relaxed">
                  &ldquo;Painless sedation and 3D imaging made my dental implant journey completely seamless. Dr. Thorne is amazing!&rdquo;
                </p>
                <div className="mt-2 text-[10px] text-mute/80 font-mono">2 minutes ago · Verified Patient</div>
              </div>
            </div>
          </div>
        )}

        {/* Wall of Love Grid */}
        {tab === "wall" && (
          <div className="grid md:grid-cols-3 gap-4 my-auto">
            {SAMPLES.map((s, idx) => (
              <div key={idx} className="rounded-2xl border border-line bg-card p-4 shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="text-xs font-bold text-ink">{s.name}</div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stage border border-line text-mute">
                      {s.source}
                    </span>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-mute leading-relaxed">&ldquo;{s.text}&rdquo;</p>
                </div>
                <div className="mt-3 pt-2 border-t border-line/60 text-[10px] text-mute font-mono flex justify-between">
                  <span>{s.role}</span>
                  <span>{s.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Floating Badge */}
        {tab === "badge" && (
          <div className="max-w-sm mx-auto my-auto w-full text-center">
            <div className="text-xs text-mute font-mono uppercase tracking-wider mb-4">
              Fixed Bottom-Right Corner Badge
            </div>
            <div className="inline-flex items-center gap-3 rounded-full border border-line bg-card px-5 py-3 shadow-2xl">
              <span className="h-8 w-8 rounded-full bg-emerald-500/15 grid place-items-center">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </span>
              <div className="text-left">
                <div className="text-xs font-bold text-ink">4.9 / 5.0 Star Rating</div>
                <div className="text-[11px] text-mute font-medium">Based on 1,318 Google Reviews</div>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse ml-2" />
            </div>
          </div>
        )}

        {/* Embed Code Bar */}
        <div className="mt-8 pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-mute">
            <Code2 className="w-4 h-4 text-emerald-500" />
            <span className="text-ink font-semibold">1-Line Embed Code:</span>
            <code className="hidden md:inline-block px-2 py-1 rounded bg-stage border border-line text-[11px] truncate max-w-md">
              {embedScript}
            </code>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={copyCode}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-full bg-card border border-line hover:border-ink text-ink font-semibold text-xs px-4 py-2 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied Script!" : "Copy Embed Script"}</span>
            </button>
            <Link
              href="/dashboard/widgets"
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-ink text-paper font-semibold text-xs px-4 py-2 hover:bg-emerald-600 transition-colors"
            >
              <span>Widget Studio</span>
              <span>↗</span>
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
