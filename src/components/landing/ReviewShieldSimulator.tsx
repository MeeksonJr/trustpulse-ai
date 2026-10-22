"use client";

import React, { useState } from "react";
import { Star, ShieldCheck, ExternalLink, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import { Section, SectionHeader, Card } from "@/components/ui/Primitives";
import Link from "next/link";

export function ReviewShieldSimulator() {
  const [selectedRating, setSelectedRating] = useState<number>(5);

  const isPositive = selectedRating >= 4;

  return (
    <Section id="shield" tone="stage" className="border-t border-line">
      <SectionHeader
        eyebrow="Live Shield Simulator"
        title="Test the Star Gatekeeper in real-time."
        subtitle="Click any star below to see how TrustPulse dynamically separates happy customers from unhappy customers before anything goes public."
      />

      <div className="mt-12 max-w-3xl mx-auto rounded-3xl border border-line bg-card p-6 sm:p-10 sp-card-shadow text-center">
        <div className="text-xs font-mono uppercase tracking-wider text-mute mb-2">Interactive Demo</div>
        <h3 className="text-xl sm:text-2xl font-bold text-ink mb-6">
          &ldquo;How would you rate your visit today?&rdquo;
        </h3>

        {/* Star Selector Buttons */}
        <div className="flex justify-center items-center gap-2 sm:gap-4 mb-8">
          {[1, 2, 3, 4, 5].map((star) => {
            const active = star <= selectedRating;
            return (
              <button
                key={star}
                type="button"
                onClick={() => setSelectedRating(star)}
                className={`group p-2 sm:p-3 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  active
                    ? "border-amber-400 bg-amber-500/10 scale-105"
                    : "border-line bg-stage hover:border-amber-400/50"
                }`}
              >
                <Star
                  className={`w-7 h-7 sm:w-10 sm:h-10 transition-colors ${
                    active ? "fill-amber-400 text-amber-400" : "text-line group-hover:text-amber-300"
                  }`}
                />
                <span className="block text-[11px] font-mono font-bold text-mute mt-1">{star}★</span>
              </button>
            );
          })}
        </div>

        {/* Condition 1: 4 or 5 Stars (Google Public Review) */}
        {isPositive ? (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 p-6 text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold mb-2">
              <CheckCircle2 className="w-4 h-4" />
              Condition: 4 or 5 Stars Selected → Public Review Booster
            </div>
            <h4 className="text-lg font-bold text-ink mb-1">
              &ldquo;We are so glad you loved it! Could you share this on Google?&rdquo;
            </h4>
            <p className="text-xs text-mute leading-relaxed mb-4">
              TrustPulse directly presents a 1-tap deep link opening the native Google Maps review modal with 5 stars pre-selected, boosting your public rating and local SEO rank.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://search.google.com/local/reviews?placeid=ChIJ9WnWkNKZuokRug64HswBosE"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-5 py-2.5 transition-colors shadow-sm"
              >
                <span>Write a 5★ Review on Google</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <span className="text-xs font-mono text-mute">Direct deep link • Zero friction</span>
            </div>
          </div>
        ) : (
          /* Condition 2: 1, 2, or 3 Stars (Negative Review Shield Intercept) */
          <div className="rounded-2xl border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 p-6 text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold mb-2">
              <ShieldCheck className="w-4 h-4" />
              Condition: 1–3 Stars Selected → Negative Review Shield Triggered
            </div>
            <h4 className="text-lg font-bold text-ink mb-1">
              &ldquo;We are so sorry we missed the mark. How can we make it right?&rdquo;
            </h4>
            <p className="text-xs text-mute leading-relaxed mb-4">
              Instead of directing the client to Google, TrustPulse opens a compassionate private feedback box. The customer vents directly to the owner/manager, avoiding an irreversible 1-star public hit.
            </p>
            <div className="space-y-3">
              <textarea
                readOnly
                value="The wait time was over 40 minutes and the front desk staff seemed rushed..."
                className="w-full text-xs p-3 rounded-xl bg-card border border-line text-mute resize-none outline-none"
                rows={2}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-mute font-mono">Delivered to Private Grievance Inbox</span>
                <Link
                  href="/dashboard/shield"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                >
                  <span>View Grievance Inbox</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}
