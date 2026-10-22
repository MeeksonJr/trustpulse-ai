"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, ShieldCheck } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Primitives";

const FAQS = [
  {
    q: "Is review routing and star gatekeeping compliant with Google & FTC rules?",
    a: "Yes. TrustPulse complies with FTC guidelines by providing genuine customer feedback channels. We never block or prevent any customer from writing a public Google review—we simply provide a prompt, high-priority private resolution channel for unhappy customers so their grievances are addressed immediately before they feel the need to escalate publicly.",
  },
  {
    q: "How does the Google Maps client auto-onboarding work?",
    a: "You paste any Google Maps URL or search the business name and city. Our intelligence engine parses the pin coordinates, verifies the Google Place ID / CID, and automatically extracts their live rating, review count, address, phone, and direct review URL in under 2 seconds.",
  },
  {
    q: "Will the embeddable widgets slow down my client's website?",
    a: "Not at all. TrustPulse widgets load asynchronously from our edge CDN with a footprint under 14KB (no jQuery or heavy libraries). They execute in less than 12ms and do not impact Google Core Web Vitals or PageSpeed scores.",
  },
  {
    q: "Can I resell TrustPulse to my local business clients under my agency brand?",
    a: "Yes! Our Agency White-Label tier allows you to connect your custom agency domain, upload your logo, set your agency brand colors, and deliver branded printable QR stands and live review widgets without any TrustPulse attribution.",
  },
  {
    q: "What is the physical QR counter stand made of and how do clients get it?",
    a: "We include our Printable QR Stand Studio directly inside the dashboard. You can download print-ready 300 DPI high-resolution PDF inserts for standard 4x6 or 5x7 acrylic table tents from Amazon, or print branded counter cards with 1 click.",
  },
  {
    q: "How does the AI review responder work?",
    a: "PulseMind™ AI reads incoming reviews and drafts custom responses tailored to your chosen strategy: SEO Keyword Boosted (incorporates local search keywords), Empathetic De-escalation (resolves customer issues), or VIP Loyalty (rewards returning clients).",
  },
];

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <Section tone="stage" className="border-t border-line">
      <SectionHeader
        eyebrow="Frequently Asked Questions"
        title="Everything you need to know about TrustPulse."
        subtitle="Clear answers on compliance, agency operations, Google Maps sync, and website performance."
      />

      <div className="mt-14 max-w-3xl mx-auto space-y-3.5">
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? "border-emerald-500/40 bg-card shadow-sm"
                  : "border-line bg-card/60 hover:bg-card"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-bold text-ink cursor-pointer gap-4"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-mute shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-emerald-500" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-mute leading-relaxed border-t border-line/40 animate-in fade-in duration-200">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}
