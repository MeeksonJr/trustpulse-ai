"use client";

import React from "react";
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
  Swords,
  Check,
  X,
  ShieldCheck,
  DollarSign,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Zap,
  Lock,
  Boxes,
  Layers,
  ChevronRight,
} from "lucide-react";

interface ComparisonRow {
  feature: string;
  category: string;
  trustpulse: string;
  birdeye: string;
  podium: string;
  generic: string;
  winner: boolean;
}

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    category: "Cost & Commercial Terms",
    feature: "Monthly Software Overhead",
    trustpulse: "$0 Starter / $29 Pro / $79 Agency",
    birdeye: "$399 / location / mo + Annual Lock",
    podium: "$449 / location / mo + Contract",
    generic: "$49 - $99 / mo basic",
    winner: true,
  },
  {
    category: "Cost & Commercial Terms",
    feature: "Agency White-Label Resale",
    trustpulse: "✓ Unlimited Client Workspaces ($79/mo)",
    birdeye: "✕ $200+ per location minimum",
    podium: "✕ No reseller program",
    generic: "Limited sub-accounts with upcharge",
    winner: true,
  },
  {
    category: "Core Interception & Funnel",
    feature: "Negative Review Shield Gatekeeper",
    trustpulse: "✓ Included (Routes 1-3★ to private form)",
    birdeye: "⚠️ Expensive Add-On",
    podium: "✕ Public only (No private gate)",
    generic: "✕ Basic star display only",
    winner: true,
  },
  {
    category: "Core Interception & Funnel",
    feature: "1-Tap Google Maps Deep Link",
    trustpulse: "✓ Pre-filled reviews with 1-click copy",
    birdeye: "SMS link requiring manual typing",
    podium: "Basic SMS invite link",
    generic: "✕ Static link only",
    winner: true,
  },
  {
    category: "AI & Automation",
    feature: "PulseMind™ AI Review Auto-Responder",
    trustpulse: "✓ 3 Strategic Angles (SEO, Empathy, VIP)",
    birdeye: "Generic canned templates",
    podium: "Manual snippet library",
    generic: "✕ No AI response engine",
    winner: true,
  },
  {
    category: "Integration & Footprint",
    feature: "1-Line Embed Script (< 15KB)",
    trustpulse: "✓ Vanilla JS (CORS wildcard enabled)",
    birdeye: "Heavy 450KB+ script bundle",
    podium: "Proprietary iframe widget",
    generic: "Third-party script dependency",
    winner: true,
  },
  {
    category: "In-Person Hardware / Print",
    feature: "Printable QR Counter Stand Studio",
    trustpulse: "✓ Instant SVG & 4x6 Acrylic Stand Print",
    birdeye: "✓ Included (Standard templates)",
    podium: "✓ Included",
    generic: "✕ Not available",
    winner: true,
  },
  {
    category: "Data & Architecture",
    feature: "Google Maps Auto-Onboarding (RapidAPI)",
    trustpulse: "✓ 1-Click extraction of ratings & details",
    birdeye: "Manual CSV upload / complex OAuth",
    podium: "Manual setup flow",
    generic: "Manual data entry",
    winner: true,
  },
];

export default function ComparePage() {
  const { isDark, toggleTheme } = usePublicTheme(false);

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink transition-colors selection:bg-emerald-500 selection:text-white">
      <PublicNavbar isDark={isDark} onToggleTheme={toggleTheme} />

      <main className="flex-1">
        {/* Page Hero */}
        <PageHero
          eyebrow="Market Intelligence & ROI Comparison"
          title={
            <>
              TrustPulse AI vs.{" "}
              <span className="text-emerald-600 dark:text-emerald-400">
                Legacy Reputation SaaS
              </span>
            </>
          }
          subtitle="Why growth-minded local practices, marketing agencies, and investors choose TrustPulse's high-margin, automated reputation shield over $400+/mo legacy platforms."
        >
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/signup"
              className="tp-btn-dark px-6 py-3 rounded-full text-xs font-bold inline-flex items-center gap-2 shadow-lg"
            >
              <span>Start Free Shield Trial</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/audit"
              className="tp-btn-light px-5 py-3 rounded-full text-xs font-bold inline-flex items-center gap-2"
            >
              <span>Run Revenue Leak Audit</span>
            </Link>
          </div>
        </PageHero>

        {/* Highlight Stats Row */}
        <Section tone="stage" className="!py-12 border-y border-line">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
                92%
              </div>
              <p className="text-xs text-mute mt-1 font-medium">
                Lower annual software overhead
              </p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                340%
              </div>
              <p className="text-xs text-mute mt-1 font-medium">
                Higher in-person review conversion
              </p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-ink tracking-tight">
                &lt; 5s
              </div>
              <p className="text-xs text-mute mt-1 font-medium">
                Grievance email alert response
              </p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                100%
              </div>
              <p className="text-xs text-mute mt-1 font-medium">
                White-label agency margin capture
              </p>
            </div>
          </div>
        </Section>

        {/* Feature Comparison Matrix */}
        <Section>
          <div className="flex flex-col gap-4 text-center max-w-3xl mx-auto mb-12">
            <Eyebrow>Feature-By-Feature Breakdown</Eyebrow>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">
              Compare Side-by-Side
            </h2>
            <p className="text-base text-mute">
              See how TrustPulse stacks up against legacy platforms across features, pricing, and automation.
            </p>
          </div>

          <div className="bg-card rounded-3xl border border-line overflow-hidden sp-card-shadow">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-line bg-stage/80 text-mute">
                    <th className="py-4 px-6 font-bold uppercase tracking-wider text-[11px]">Feature / Metric</th>
                    <th className="py-4 px-6 font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-x border-emerald-500/20 text-[12px]">
                      TrustPulse AI
                    </th>
                    <th className="py-4 px-6 font-semibold text-[11px] uppercase tracking-wider">Birdeye</th>
                    <th className="py-4 px-6 font-semibold text-[11px] uppercase tracking-wider">Podium</th>
                    <th className="py-4 px-6 font-semibold text-[11px] uppercase tracking-wider">Generic Tools</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {COMPARISON_ROWS.map((row, i) => (
                    <tr key={i} className="hover:bg-stage/40 transition-colors">
                      <td className="py-4 px-6 font-semibold text-ink">
                        <div>{row.feature}</div>
                        <span className="text-[10px] text-mute uppercase font-mono tracking-wider">
                          {row.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/5 border-x border-emerald-500/10">
                        {row.trustpulse}
                      </td>
                      <td className="py-4 px-6 text-mute">
                        {row.birdeye}
                      </td>
                      <td className="py-4 px-6 text-mute">
                        {row.podium}
                      </td>
                      <td className="py-4 px-6 text-mute">
                        {row.generic}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        {/* 3 Core Architectural Pillars */}
        <Section tone="stage" className="border-t border-line">
          <div className="grid md:grid-cols-3 gap-6">
            <Card hover={true} className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-ink">
                Ultra-Low Operational Overhead
              </h3>
              <p className="text-xs text-mute leading-relaxed">
                Runs on modern serverless infrastructure (Next.js 15, Vercel Edge, Supabase). No bloated legacy servers or predatory annual contracts.
              </p>
            </Card>

            <Card hover={true} className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-ink">
                The Negative Review Shield
              </h3>
              <p className="text-xs text-mute leading-relaxed">
                Protects Google Maps star rating by intercepting sub-4 star grievances in a private inbox with instant SMTP email alerts to practice leadership.
              </p>
            </Card>

            <Card hover={true} className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-base text-ink">
                Built for High-Margin Agencies
              </h3>
              <p className="text-xs text-mute leading-relaxed">
                White-label client workspaces, custom brand colors, multi-tenant dashboards, and PDF reporting to charge clients $299–$499/mo retainers.
              </p>
            </Card>
          </div>
        </Section>

        {/* Bottom CTA Banner */}
        <Section>
          <div className="rounded-3xl bg-slate-950 text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-slate-800">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 text-center md:text-left max-w-lg">
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
                  Ready to Switch?
                </span>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                  Stop Overpaying for Legacy Reputation Tools
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Start collecting verified Google 5-star reviews and shielding customer grievances in under 3 minutes.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link
                  href="/signup"
                  className="px-6 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg text-center"
                >
                  Create Free Workspace →
                </Link>
                <Link
                  href="/demo/apex-dental-site"
                  className="px-6 py-3.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors border border-slate-700 text-center"
                >
                  View Client Demo
                </Link>
              </div>
            </div>
          </div>
        </Section>
      </main>

      <PublicFooter isDark={isDark} onToggleTheme={toggleTheme} />
    </div>
  );
}
