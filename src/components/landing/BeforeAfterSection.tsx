"use client";

import React from "react";
import { XCircle, CheckCircle2, ShieldCheck, AlertTriangle, ArrowRight } from "lucide-react";
import { Section, SectionHeader, Card } from "@/components/ui/Primitives";
import Link from "next/link";

export function BeforeAfterSection() {
  return (
    <Section tone="stage" className="border-t border-line">
      <SectionHeader
        eyebrow="Reputation Transformation"
        title={
          <>
            Stop losing revenue to{" "}
            <span className="text-rose-500 line-through decoration-rose-500/40">unfiltered</span> public complaints.
          </>
        }
        subtitle="See how TrustPulse intercepts unhappy walk-outs before they ever reach Google, while channeling your happiest clients into permanent social proof."
      />

      <div className="mt-14 grid lg:grid-cols-2 gap-8 items-stretch">
        {/* The Old Way */}
        <div className="rounded-3xl border border-rose-500/20 bg-card p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between sp-card-shadow">
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-semibold uppercase tracking-wider">
                <XCircle className="w-3.5 h-3.5" />
                Traditional Review Chaos
              </span>
              <span className="text-xs font-mono text-mute">Manual & Vulnerable</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-ink mb-4">
              1-star reviews go straight to Google Maps
            </h3>
            
            <p className="text-sm text-mute leading-relaxed mb-6">
              An upset customer has no private outlet to vent. Within 10 minutes, a single harsh review lowers your star rating from 4.8 to 4.3, costing thousands in lost bookings.
            </p>

            <ul className="space-y-3.5 text-sm text-mute">
              {[
                "Disgruntled customers vent publicly on Google & Yelp with zero recourse",
                "Happy clients forget to leave reviews once they walk out the door",
                "Average business loses 9% of annual revenue per 0.1 drop in star rating",
                "Zero automated replies — complaints sit unanswered for weeks",
                "Reviews stay locked on Google instead of converting website traffic",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-line/60 flex items-center justify-between text-xs text-rose-600 dark:text-rose-400 font-semibold">
            <span>Result: Lower Google rank & lost revenue</span>
            <span className="font-mono">Est. -$28,400/yr</span>
          </div>
        </div>

        {/* The TrustPulse Way */}
        <div className="rounded-3xl border border-emerald-500/30 bg-card p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between shadow-xl ring-1 ring-emerald-500/20">
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5" />
                The TrustPulse Shield Funnel
              </span>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">100% Autonomous</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-ink mb-4">
              99.2% of negative reviews caught privately
            </h3>
            
            <p className="text-sm text-mute leading-relaxed mb-6">
              Smart QR stand routes 4–5 star fans straight to your Google listing, while 1–3 star feedback is intercepted internally into your private grievance inbox for instant resolution.
            </p>

            <ul className="space-y-3.5 text-sm text-ink/90">
              {[
                "Smart Star Gatekeeper: 4–5★ to Google, 1–3★ to private internal inbox",
                "Fast mobile scan time (<0.4s) right at point of checkout or departure",
                "PulseMind™ AI drafts empathetic de-escalations before customers escalate",
                "Verified positive reviews automatically stream into 1-line website widgets",
                "Agency white-label: manage unlimited client businesses under your domain",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-line/60 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-bold">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Protected & Verified Growth
            </span>
            <Link href="/r/apex-dental" target="_blank" className="hover:underline flex items-center gap-1">
              Test Live Funnel ↗
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
