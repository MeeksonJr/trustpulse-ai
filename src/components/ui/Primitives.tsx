import React from "react";

/**
 * TrustPulse v2 design primitives. Every public page should compose these so the site feels like one product.
 * Tokens (bg-card, border-line, text-ink, text-mute, bg-stage, text-accent...) are theme-aware (day/night).
 */

export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-emerald-600 dark:text-emerald-400 ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      {children}
    </span>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className = "",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  const a = align === "center" ? "text-center mx-auto items-center" : "text-left items-start";
  return (
    <div className={`flex flex-col gap-4 max-w-3xl ${a} ${className}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="text-[clamp(2rem,4.6vw,3.4rem)] font-extrabold tracking-[-0.03em] leading-[1.05] text-ink">
        {title}
      </h2>
      {subtitle && <p className="text-base sm:text-lg text-mute leading-relaxed max-w-2xl">{subtitle}</p>}
    </div>
  );
}

/** Standard page section wrapper: consistent vertical rhythm and max width. */
export function Section({
  id,
  children,
  tone = "default",
  className = "",
  narrow = false,
}: {
  id?: string;
  children: React.ReactNode;
  tone?: "default" | "stage" | "dark";
  className?: string;
  narrow?: boolean;
}) {
  const bg =
    tone === "stage"
      ? "bg-stage"
      : tone === "dark"
      ? "bg-slate-950 text-slate-100"
      : "bg-paper";
  return (
    <section id={id} className={`relative px-4 sm:px-6 lg:px-8 py-20 sm:py-28 ${bg} ${className}`}>
      <div className={`mx-auto ${narrow ? "max-w-4xl" : "max-w-6xl"}`}>{children}</div>
    </section>
  );
}

/** Surface card with the v2 look: soft border, subtle shadow, hover lift. */
export function Card({
  children,
  className = "",
  hover = true,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-line bg-card p-5 sm:p-6 sp-card-shadow ${
        hover ? "transition-all duration-300 hover:-translate-y-1 hover:shadow-xl" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

/** Page hero for inner pages (login excluded): gradient grid backdrop + eyebrow + title + subtitle. */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="tp-hero-bg relative overflow-hidden px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 pb-16 sm:pb-20">
      <div className="relative mx-auto max-w-4xl text-center flex flex-col items-center gap-5">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1 className="text-[clamp(2.4rem,6vw,4.4rem)] font-extrabold tracking-[-0.035em] leading-[1.02] text-ink">
          {title}
        </h1>
        {subtitle && <p className="text-base sm:text-xl text-mute max-w-2xl leading-relaxed">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}
