"use client";

import React, { useState } from "react";
import { Check, Sparkles, Building2, ShieldCheck, ArrowRight, Zap } from "lucide-react";
import { Section, SectionHeader, Card } from "@/components/ui/Primitives";
import Link from "next/link";
import { PRICING_PLANS } from "@/lib/stripe/plans";

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  return (
    <Section id="pricing" tone="default" className="border-t border-line">
      <SectionHeader
        eyebrow="Transparent Pricing"
        title="Predictable plans with zero per-review fees."
        subtitle="Start with a free trial or empower your entire marketing agency with white-labeled multi-client workspaces."
      />

      {/* Billing toggle */}
      <div className="mt-10 flex justify-center items-center gap-3">
        <span className={`text-xs font-semibold ${billingCycle === "monthly" ? "text-ink" : "text-mute"}`}>
          Monthly
        </span>
        <button
          type="button"
          onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
          className="relative inline-flex h-7 w-12 items-center rounded-full bg-stage border border-line cursor-pointer p-0.5 transition-colors"
          aria-label="Toggle annual billing"
        >
          <span
            className={`inline-block h-5 w-5 rounded-full bg-emerald-500 shadow-sm transition-transform ${
              billingCycle === "annual" ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
        <span className={`text-xs font-semibold flex items-center gap-1.5 ${billingCycle === "annual" ? "text-ink" : "text-mute"}`}>
          <span>Annual</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
            Save 20%
          </span>
        </span>
      </div>

      {/* Pricing Cards Grid */}
      <div className="mt-12 grid lg:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
        {/* Starter Plan */}
        <div className="rounded-3xl border border-line bg-card p-6 sm:p-8 flex flex-col justify-between sp-card-shadow transition-transform hover:-translate-y-1">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-mute font-bold">Starter Test</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stage border border-line text-mute">
                Free Forever
              </span>
            </div>
            <h3 className="text-2xl font-bold text-ink mb-2">Solo Business</h3>
            <p className="text-xs text-mute leading-relaxed mb-6">
              Essential review funnel & social proof toasts for a single location or store.
            </p>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-extrabold text-ink font-mono">$0</span>
              <span className="text-xs text-mute">/month free</span>
            </div>
            <ul className="space-y-3 text-xs text-mute mb-8">
              {[
                "1 Active Business Location",
                "Smart QR Star Gatekeeper (/r/[slug])",
                "Up to 25 Captured Reviews / month",
                "Floating Toast & Badge Widgets",
                "Manual AI Reply Drafts (10/mo)",
                "Standard Email Notifications",
              ].map((feat, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
          <Link
            href="/signup?plan=starter"
            className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-line bg-card hover:border-ink text-ink font-semibold text-xs py-3 transition-colors"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Pro Plan (Highlighted) */}
        <div className="rounded-3xl border-2 border-emerald-500 bg-card p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden transition-transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 transform translate-x-3 -translate-y-3 px-8 py-1 bg-emerald-500 text-white text-[10px] font-mono font-bold uppercase rotate-12 shadow-sm">
            Popular
          </div>
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
                Professional
              </span>
            </div>
            <h3 className="text-2xl font-bold text-ink mb-2">Pro Growth</h3>
            <p className="text-xs text-mute leading-relaxed mb-6">
              Full Google Maps sync, unlimited reviews, and automated PulseMind™ AI replies.
            </p>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-extrabold text-ink font-mono">
                {billingCycle === "monthly" ? "$29" : "$23"}
              </span>
              <span className="text-xs text-mute">/month {billingCycle === "annual" ? "billed annually" : ""}</span>
            </div>
            <ul className="space-y-3 text-xs text-ink/90 font-medium mb-8">
              {[
                "3 Active Business Locations",
                "Unlimited 5-Star Reviews & Funnels",
                "Live Google Maps Intelligence & Auto-Sync",
                "PulseMind™ AI Auto-Responder (Unlimited)",
                "Printable QR Stand Studio (Print Ready PDF)",
                "Private Grievance Inbox with Resolution Log",
                "All Embed Widgets (Wall of Love, Toasts, Badges)",
              ].map((feat, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 font-bold" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
          <Link
            href="/signup?plan=pro"
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-3 transition-colors shadow-md"
          >
            <span>Get Started with Pro</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Agency Plan */}
        <div className="rounded-3xl border border-line bg-card p-6 sm:p-8 flex flex-col justify-between sp-card-shadow transition-transform hover:-translate-y-1">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-mute font-bold">Multi-Client</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                Agency Tier
              </span>
            </div>
            <h3 className="text-2xl font-bold text-ink mb-2">Agency White-Label</h3>
            <p className="text-xs text-mute leading-relaxed mb-6">
              Turnkey agency engine to manage unlimited clients with custom branding & domains.
            </p>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-extrabold text-ink font-mono">
                {billingCycle === "monthly" ? "$79" : "$63"}
              </span>
              <span className="text-xs text-mute">/month {billingCycle === "annual" ? "billed annually" : ""}</span>
            </div>
            <ul className="space-y-3 text-xs text-mute mb-8">
              {[
                "Unlimited Client Workspaces",
                "100% White-Label: Your Domain, Logo & Brand",
                "Instant Client Google Maps Onboarding (2s)",
                "Client-Facing Login Portals & PDF Reports",
                "Priority CDN Edge Embed SLA (99.9%)",
                "Direct Google SMTP Notification Relays",
                "Dedicated Agency Strategy & Onboarding",
              ].map((feat, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
          <Link
            href="/signup?plan=agency"
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-ink text-paper font-semibold text-xs py-3 transition-transform hover:-translate-y-0.5"
          >
            <span>Launch Agency Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </Section>
  );
}
