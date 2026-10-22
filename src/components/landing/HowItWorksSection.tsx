"use client";

import React from "react";
import { QrCode, Filter, Sparkles, ArrowRight, ShieldCheck, Star } from "lucide-react";
import { Section, SectionHeader, Card } from "@/components/ui/Primitives";
import Link from "next/link";

const STEPS = [
  {
    step: "01",
    title: "Customer Scans Counter Stand",
    tagline: "Frictionless <0.4s scan",
    desc: "A sleek acrylic QR stand sits on your reception desk, bar counter, or check-out terminal. No app install required—customers tap or scan on iOS/Android.",
    icon: QrCode,
    badge: "Hardware Included",
  },
  {
    step: "02",
    title: "Star Gating Intercepts Bad Reviews",
    tagline: "4–5★ to Google, 1–3★ Private",
    desc: "Happy clients (4-5 stars) get routed directly to Google Maps to post their public review. Unhappy clients (1-3 stars) open a private feedback form delivered only to you.",
    icon: Filter,
    badge: "Automated Routing",
  },
  {
    step: "03",
    title: "Live Social Proof & AI Auto-Replies",
    tagline: "1-line embed everywhere",
    desc: "Verified 5-star Google reviews stream directly to your website in real-time widgets. PulseMind™ AI drafts SEO-boosted responses for public praise and de-escalates private feedback.",
    icon: Sparkles,
    badge: "Zero Manual Work",
  },
];

export function HowItWorksSection() {
  return (
    <Section tone="stage" className="border-t border-line">
      <SectionHeader
        eyebrow="3-Step Workflow"
        title="How the Negative Review Shield works in practice."
        subtitle="Turn offline customer satisfaction into online market dominance with zero employee training or manual effort."
      />

      <div className="mt-14 grid md:grid-cols-3 gap-6 lg:gap-8">
        {STEPS.map((s, idx) => {
          const Icon = s.icon;
          return (
            <Card key={idx} className="flex flex-col justify-between relative overflow-hidden group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-6">
                  <span className="h-10 w-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-base grid place-items-center">
                    {s.step}
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-mute px-2.5 py-1 rounded-full bg-stage border border-line">
                    {s.badge}
                  </span>
                </div>

                <div className="h-12 w-12 rounded-2xl bg-stage border border-line grid place-items-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-emerald-500" />
                </div>

                <h3 className="text-xl font-bold text-ink mb-2">{s.title}</h3>
                <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-3">{s.tagline}</div>
                <p className="text-sm text-mute leading-relaxed">{s.desc}</p>
              </div>

              <div className="mt-8 pt-4 border-t border-line/60 flex items-center justify-between text-xs text-mute font-medium">
                <span>Phase {idx + 1} of 3</span>
                <span className="text-ink font-semibold flex items-center gap-1 group-hover:text-emerald-500 transition-colors">
                  Learn more <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </Section>
  );
}
