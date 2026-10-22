"use client";

import React, { useState } from "react";
import { Sparkles, Bot, Star, Copy, Check, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Section, SectionHeader, Card } from "@/components/ui/Primitives";
import Link from "next/link";

const ANGLES = {
  seo: {
    label: "SEO Keyword Boosted",
    icon: Zap,
    desc: "Mentions target local keywords naturally to boost Google Maps local 3-pack search ranking.",
    reply:
      "Thank you so much Sarah! Dr. Thorne and our cosmetic dental implant team in Austin are thrilled that your sedation procedure was completely painless. Enjoy your stunning new smile and thank you for trusting Apex Cosmetic Dentistry!",
    keywordsUsed: ["cosmetic dental implant", "Austin dental team", "Apex Cosmetic Dentistry"],
  },
  empathy: {
    label: "Empathetic De-escalation",
    icon: ShieldCheck,
    desc: "Defuses tension, acknowledges the customer experience, and offers immediate resolution.",
    reply:
      "Hello Sarah, thank you for sharing your experience. We are truly sorry to hear that the appointment wait time did not meet our standard of care. Our practice manager would love to reach out directly to make this right—please check your email for our follow-up.",
    keywordsUsed: ["immediate personal outreach", "service guarantee", "direct manager contact"],
  },
  loyalty: {
    label: "VIP Customer Loyalty",
    icon: Sparkles,
    desc: "Invites the customer back with a warm VIP referral perk or next-visit upgrade.",
    reply:
      "Sarah, thank you for being such a wonderful part of our practice family! We have credited your client profile with a complimentary annual enamel brightening polish for your next scheduled checkup. See you soon!",
    keywordsUsed: ["practice family", "VIP account credit", "patient appreciation"],
  },
};

export function AiRepliesSection() {
  const [angle, setAngle] = useState<"seo" | "empathy" | "loyalty">("seo");
  const [copied, setCopied] = useState(false);

  const activeData = ANGLES[angle];

  const copyReply = () => {
    navigator.clipboard.writeText(activeData.reply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Section id="ai-replies" tone="default" className="border-t border-line">
      <SectionHeader
        eyebrow="PulseMind™ AI Responder"
        title="Automate review replies with intelligent angles."
        subtitle="Replying to reviews boosts Google visibility by 14%. PulseMind™ automatically drafts on-brand responses in seconds with zero manual typing."
      />

      <div className="mt-14 max-w-4xl mx-auto grid md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Sample Review & Angle Selector (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="rounded-2xl border border-line bg-stage/60 p-4">
            <div className="flex items-center justify-between text-xs font-mono text-mute mb-2">
              <span>Incoming Google Review</span>
              <span className="text-emerald-500 font-bold">5.0 ★</span>
            </div>
            <div className="text-xs font-bold text-ink mb-1">Sarah Jenkins</div>
            <p className="text-xs text-mute leading-relaxed">
              &ldquo;Dr. Thorne is an absolute miracle worker. I was terrified of dental implants for 3 years, but their painless sedation and 3D imaging made the entire procedure seamless. My smile has never looked better!&rdquo;
            </p>
          </div>

          <div>
            <div className="text-xs font-semibold text-ink uppercase tracking-wider mb-2">Select Response Strategy:</div>
            <div className="space-y-2">
              {(Object.keys(ANGLES) as Array<"seo" | "empathy" | "loyalty">).map((k) => {
                const item = ANGLES[k];
                const Icon = item.icon;
                const active = angle === k;
                return (
                  <button
                    key={k}
                    onClick={() => setAngle(k)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      active
                        ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-ink shadow-sm font-semibold"
                        : "border-line bg-card text-mute hover:border-ink hover:text-ink"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 text-xs">
                      <Icon className={`w-4 h-4 ${active ? "text-emerald-500" : ""}`} />
                      <span>{item.label}</span>
                    </div>
                    {active && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Generated AI Reply Output (7 cols) */}
        <div className="md:col-span-7 rounded-2xl border border-line bg-card p-6 shadow-xl flex flex-col justify-between min-h-[320px]">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <Bot className="w-3.5 h-3.5" />
                PulseMind™ AI Drafted Reply
              </span>
              <span className="text-[11px] font-mono text-mute">{activeData.label}</span>
            </div>

            <div className="p-4 rounded-xl bg-stage border border-line/80 text-sm text-ink leading-relaxed mb-4">
              &ldquo;{activeData.reply}&rdquo;
            </div>

            <div className="space-y-1.5 mb-6">
              <div className="text-[11px] text-mute font-mono uppercase tracking-wider">Keywords & Intent Injected:</div>
              <div className="flex flex-wrap gap-1.5">
                {activeData.keywordsUsed.map((kw, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold"
                  >
                    +{kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-line flex items-center justify-between gap-4">
            <button
              onClick={copyReply}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-card hover:border-ink text-ink font-semibold text-xs px-4 py-2 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied Reply!" : "Copy Response"}</span>
            </button>

            <Link
              href="/dashboard/ai-replies"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              <span>Full AI Reply Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
