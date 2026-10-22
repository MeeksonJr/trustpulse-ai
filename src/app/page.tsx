"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  PublicNavbar,
  PublicFooter,
  usePublicTheme,
} from "@/components/ui/PublicChrome";
import {
  ArrowRight,
  Sparkles,
  QrCode,
  Activity,
  CheckCircle2,
  X,
  Star,
} from "lucide-react";
import { HeroShowcase } from "@/components/ui/HeroShowcase";
import {
  GoogleBadge,
  TrustpilotBadge,
  ProductHuntBadge,
  YelpBadge,
} from "@/components/ui/PlatformBadges";

import { BeforeAfterSection } from "@/components/landing/BeforeAfterSection";
import { RevenueLeakCalculator } from "@/components/landing/RevenueLeakCalculator";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { InteractiveWidgetsSection } from "@/components/landing/InteractiveWidgetsSection";
import { ReviewShieldSimulator } from "@/components/landing/ReviewShieldSimulator";
import { AiRepliesSection } from "@/components/landing/AiRepliesSection";
import { AgencyRoiSection } from "@/components/landing/AgencyRoiSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FaqSection } from "@/components/landing/FaqSection";

export default function HomePage() {
  const { isDark, toggleTheme } = usePublicTheme(false);

  // Live Toast Simulation in Bottom Corner
  const [showLiveToast, setShowLiveToast] = useState(false);

  // Auto-trigger the live toast preview after 2.8 seconds to show interactive proof
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLiveToast(true);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink transition-colors duration-200">
      {/* Sticky Fixed Glassmorphic Navbar */}
      <PublicNavbar isDark={isDark} onToggleTheme={toggleTheme} />

      <main className="flex-1">
        {/* =========================================================================
            1. HERO SECTION: Antimetal + YowManage Soft Sky Gradient & Interactive Mockup
           ========================================================================= */}
        <section className="tp-hero-bg relative px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-20 sm:pb-28 overflow-hidden">
          {/* Engineered-grid nodes */}
          <span className="tp-node hidden md:block" style={{ left: "calc(50% - 480px)", top: "120px" }} />
          <span className="tp-node hidden md:block" style={{ left: "calc(50% + 460px)", top: "240px" }} />
          <span className="tp-node hidden lg:block" style={{ left: "calc(50% - 600px)", top: "360px" }} />
          <span className="tp-node hidden lg:block" style={{ left: "calc(50% + 590px)", top: "90px" }} />

          <div className="relative mx-auto max-w-6xl">
            <div className="text-center max-w-4xl mx-auto">
              <Link href="/dashboard/agency" className="tp-eyebrow-pill tp-pop hover:border-emerald-500/60 transition-colors">
                <span className="rounded-full bg-emerald-500 px-1.5 py-0.5 text-[0.6rem] font-bold text-white">NEW</span>
                Live Google Maps sync for every client
                <ArrowRight className="h-3 w-3" />
              </Link>

              <h1
                className="tp-pop mt-6 text-[clamp(2.6rem,7.2vw,5.6rem)] font-extrabold tracking-[-0.032em] leading-[1.02] text-ink"
                style={{ animationDelay: "0.08s" }}
              >
                Protect every star.
                <br />
                Turn happy customers into{" "}
                <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">proof.</span>
              </h1>

              <p
                className="tp-pop mt-6 text-base sm:text-xl text-mute max-w-2xl mx-auto leading-relaxed"
                style={{ animationDelay: "0.16s" }}
              >
                TrustPulse intercepts unhappy walk-outs before they post on Google, and streams verified 5-star praise to your
                website. One automated platform.
              </p>

              <div
                className="tp-pop mt-9 flex flex-wrap items-center justify-center gap-3"
                style={{ animationDelay: "0.22s" }}
              >
                <Link href="/dashboard" className="tp-btn-dark">
                  Launch live demo
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/audit" className="tp-btn-light">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  Free revenue-leak scan
                </Link>
                <Link
                  href="/r/apex-dental"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-3 py-3 text-sm font-semibold text-mute hover:text-ink transition-colors"
                >
                  <QrCode className="w-4 h-4" />
                  Try the QR funnel ↗
                </Link>
              </div>

              <div className="pt-8 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs">
                <span className="text-mute font-medium mr-1">Syncs with</span>
                <GoogleBadge />
                <TrustpilotBadge />
                <ProductHuntBadge />
                <YelpBadge />
              </div>
            </div>

            <HeroShowcase />
          </div>
        </section>

        {/* 2. Before vs After Review Shield Transformation */}
        <BeforeAfterSection />

        {/* 3. Interactive Revenue Leak Calculator */}
        <RevenueLeakCalculator />

        {/* 4. 3-Step Workflow */}
        <HowItWorksSection />

        {/* 5. #widgets - Interactive Social Proof Studio */}
        <InteractiveWidgetsSection />

        {/* 6. #shield - Live Review Shield Simulator */}
        <ReviewShieldSimulator />

        {/* 7. #ai-replies - PulseMind AI Responder */}
        <AiRepliesSection />

        {/* 8. #roi - Agency Retainer ROI Calculator */}
        <AgencyRoiSection />

        {/* 9. #pricing - Transparent Predictable Pricing */}
        <PricingSection />

        {/* 10. Frequently Asked Questions */}
        <FaqSection />
      </main>

      {/* Floating Corner Simulated Toast */}
      {showLiveToast && (
        <div className="fixed bottom-6 left-6 z-50 max-w-sm rounded-2xl border border-line bg-card/95 backdrop-blur-md p-4 shadow-2xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <span className="h-8 w-8 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 grid place-items-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1 mb-0.5">
              <span className="text-xs font-bold text-ink">Marcus V.</span>
              <span className="text-[10px] font-mono text-mute">Just now</span>
            </div>
            <div className="flex gap-0.5 mb-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-[11px] text-mute truncate">
              &ldquo;Down-to-earth bar with a great covered patio...&rdquo;
            </p>
            <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-mono mt-1 font-semibold">
              ✓ Verified Google Review via TrustPulse
            </div>
          </div>
          <button
            onClick={() => setShowLiveToast(false)}
            className="text-mute hover:text-ink cursor-pointer p-0.5"
            aria-label="Dismiss toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Footer */}
      <PublicFooter isDark={isDark} onToggleTheme={toggleTheme} />
    </div>
  );
}
