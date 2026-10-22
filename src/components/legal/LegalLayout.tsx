"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Info, Mail, Printer } from "lucide-react";
import { PublicFooter, PublicNavbar, usePublicTheme } from "@/components/ui/PublicChrome";
import { PageHero } from "@/components/ui/Primitives";

export interface LegalSection {
  id: string;
  title: string;
}

/** Highlighted note inside long-form legal copy. */
export function Callout({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "warn";
  title: string;
  children: React.ReactNode;
}) {
  const Icon = tone === "warn" ? AlertTriangle : Info;
  const cls =
    tone === "warn"
      ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
      : "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
  return (
    <div className={`flex gap-3 rounded-2xl border p-4 ${cls}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="text-sm leading-relaxed">
        <div className="font-bold">{title}</div>
        <div className="mt-1 text-mute">{children}</div>
      </div>
    </div>
  );
}

export function LegalSectionBlock({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 space-y-4 border-t border-line pt-8 first:border-t-0 first:pt-0">
      <h2 className="text-xl sm:text-2xl font-extrabold tracking-[-0.03em] text-ink">{title}</h2>
      <div className="space-y-4 text-[0.95rem] leading-relaxed text-mute [&_strong]:text-ink [&_code]:rounded [&_code]:bg-stage [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.8em] [&_code]:text-ink [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}

export function LegalLayout({
  eyebrow,
  title,
  subtitle,
  updated,
  sections,
  badges,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  updated: string;
  sections: LegalSection[];
  badges?: string[];
  children: React.ReactNode;
}) {
  const { isDark, toggleTheme } = usePublicTheme(false);
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => !!el);
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-100px 0px -65% 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [sections]);

  return (
    <div className="sp-page min-h-screen flex flex-col bg-paper text-ink overflow-x-hidden">
      <PublicNavbar isDark={isDark} onToggleTheme={toggleTheme} />

      <PageHero eyebrow={eyebrow} title={title} subtitle={subtitle}>
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="rounded-full border border-line bg-card px-3 py-1.5 font-semibold text-ink">{updated}</span>
          {badges?.map((b) => (
            <span key={b} className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
              {b}
            </span>
          ))}
        </div>
      </PageHero>

      <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-20 sm:pb-28">
        <div className="mx-auto grid max-w-6xl items-start gap-8 lg:grid-cols-12">
          <aside className="lg:col-span-4 lg:sticky lg:top-24">
            <nav className="rounded-2xl border border-line bg-card p-3 sp-card-shadow" aria-label="Table of contents">
              <div className="px-3 pb-2 pt-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-mute">On this page</div>
              <div className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
                {sections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    onClick={() => setActive(sec.id)}
                    className={`shrink-0 whitespace-nowrap rounded-xl px-3 py-2 text-xs transition-colors lg:whitespace-normal ${
                      active === sec.id
                        ? "bg-emerald-500/10 font-bold text-emerald-600 dark:text-emerald-400"
                        : "text-mute hover:bg-stage hover:text-ink"
                    }`}
                  >
                    {sec.title}
                  </a>
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-2 border-t border-line px-2 pt-3 text-xs">
                <Link href="/security" className="rounded-full border border-line px-3 py-1.5 font-semibold text-ink hover:bg-stage">
                  Trust center
                </Link>
                <a href="mailto:privacy@trustpulse-ai.vercel.app" className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1.5 font-semibold text-ink hover:bg-stage">
                  <Mail className="h-3 w-3" /> Contact
                </a>
                <button type="button" onClick={() => window.print()} className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-line px-3 py-1.5 font-semibold text-ink hover:bg-stage">
                  <Printer className="h-3 w-3" /> Print
                </button>
              </div>
            </nav>
          </aside>

          <article className="min-w-0 space-y-8 rounded-3xl border border-line bg-card p-6 sm:p-10 sp-card-shadow lg:col-span-8">
            {children}
          </article>
        </div>
      </main>

      <PublicFooter isDark={isDark} onToggleTheme={toggleTheme} />
    </div>
  );
}
