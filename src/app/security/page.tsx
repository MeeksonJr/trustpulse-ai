"use client";

import React from "react";
import Link from "next/link";
import {
  PublicFooter,
  PublicNavbar,
  usePublicTheme,
} from "@/components/ui/PublicChrome";
import {
  ShieldCheck,
  Lock,
  Database,
  Bot,
  Globe,
  CheckCircle2,
  FileCheck,
  Server,
  ArrowRight,
} from "lucide-react";
import { PageHero, Section, SectionHeader, Card, Eyebrow } from "@/components/ui/Primitives";

const SECURITY_PILLARS = [
  {
    title: "PostgreSQL Row-Level Security (RLS)",
    badge: "Multi-Tenant Isolation",
    icon: Database,
    desc: "Every client workspace, review stream, and private grievance is strictly isolated by tenant ID and owner UUID. No agency or business can ever access another account's review records.",
  },
  {
    title: "Stripe PCI-DSS Level 1 Billing",
    badge: "Payment Security",
    icon: Lock,
    desc: "Payment transactions and subscriptions are tokenized directly through Stripe's certified PCI-DSS Level 1 infrastructure. TrustPulse servers never see or store raw credit card numbers.",
  },
  {
    title: "Zero-Retention PulseMind™ AI Safety",
    badge: "Enterprise AI Privacy",
    icon: Bot,
    desc: "Review text submitted for AI sentiment analysis and auto-reply drafting is processed ephemerally. Customer feedback is never retained or utilized to train public foundation models.",
  },
  {
    title: "Edge CDN Widget Sandboxing",
    badge: "Sub-12ms & Safe",
    icon: Globe,
    desc: "Our embed script is self-contained with zero tracking cookies or external libraries. It executes in an isolated sandbox, ensuring zero client page slowdown and strict CORS safety.",
  },
  {
    title: "Negative Review Shield Confidentiality",
    badge: "Encrypted Feedback",
    icon: ShieldCheck,
    desc: "1 to 3 star customer grievances collected via the QR funnel are encrypted in transit via TLS 1.3 and stored privately for direct executive review and customer resolution.",
  },
  {
    title: "Automated Daily Database Backups",
    badge: "Disaster Recovery",
    icon: Server,
    desc: "Database tables are backed up daily across geo-redundant AWS regions with point-in-time recovery, ensuring high durability for all customer reviews and client configurations.",
  },
];

export default function SecurityPage() {
  const { isDark, toggleTheme } = usePublicTheme(false);

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink transition-colors duration-200">
      <PublicNavbar isDark={isDark} onToggleTheme={toggleTheme} />

      <main className="flex-1">
        {/* Page Hero */}
        <PageHero
          eyebrow="SOC2 & GDPR Architectural Security"
          title="Enterprise Trust & Data Protection"
          subtitle="Engineered for medical practices, legal firms, and digital marketing agencies who demand strict tenant isolation, encrypted customer grievances, and zero data leakage."
        />

        {/* Security Controls Grid */}
        <Section tone="default" className="border-t border-line">
          <SectionHeader
            eyebrow="Core Security Pillars"
            title="Six layers of data defense built into every funnel."
            subtitle="How we safeguard your business reputation, client reviews, and internal grievances from unauthorized access."
          />

          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SECURITY_PILLARS.map((p, idx) => {
              const Icon = p.icon;
              return (
                <Card key={idx} className="flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 grid place-items-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-md bg-stage border border-line text-mute">
                        {p.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-ink mb-2">{p.title}</h3>
                    <p className="text-xs text-mute leading-relaxed">{p.desc}</p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-line/60 flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified Active</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </Section>

        {/* Compliance Standards & SLA Card */}
        <Section tone="stage" className="border-t border-line">
          <div className="rounded-3xl border border-line bg-card p-6 sm:p-10 sp-card-shadow max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">
                  Guaranteed Reliability
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-ink mt-1">
                  Operational SLA &amp; Zero-Cost Infrastructure
                </h2>
              </div>
              <Link
                href="/docs"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-ink hover:text-emerald-500 transition-colors"
              >
                <span>Read API Documentation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-stage border border-line space-y-1.5">
                <div className="text-xs font-bold text-ink">99.9% Uptime Target</div>
                <p className="text-xs text-mute leading-relaxed">
                  Served over Vercel Edge Network with automatic global failover and zero cold-start delay.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-stage border border-line space-y-1.5">
                <div className="text-xs font-bold text-ink">TLS 1.3 Encryption</div>
                <p className="text-xs text-mute leading-relaxed">
                  All traffic between clients, review funnels, and our API is encrypted with modern TLS ciphers.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-stage border border-line space-y-1.5">
                <div className="text-xs font-bold text-ink">FTC & GDPR Aligned</div>
                <p className="text-xs text-mute leading-relaxed">
                  Authentic review options provided for all clients with clear opt-out and data deletion workflows.
                </p>
              </div>
            </div>
          </div>
        </Section>
      </main>

      <PublicFooter isDark={isDark} onToggleTheme={toggleTheme} />
    </div>
  );
}
