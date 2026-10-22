"use client";

import React from "react";
import {
  Star,
  ShieldCheck,
  TrendingUp,
  QrCode,
  Sparkles,
  CheckCircle2,
  LayoutDashboard,
  Inbox,
  Code2,
  Building2,
} from "lucide-react";

const REVIEWS = [
  {
    name: "Sarah J.",
    rating: 5,
    text: "Painless sedation and 3D imaging made the whole procedure seamless.",
    tag: "Google",
    tone: "emerald",
  },
  {
    name: "Marcus V.",
    rating: 5,
    text: "Courteous staff and a wonderful atmosphere. Highly recommended!",
    tag: "Google",
    tone: "emerald",
  },
  {
    name: "Daniel R.",
    rating: 2,
    text: "Waited 40 minutes past my appointment time.",
    tag: "Shielded",
    tone: "amber",
  },
];

function Stars({ n, size = 12 }: { n: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          className={i <= n ? "fill-amber-400 text-amber-400" : "text-line"}
        />
      ))}
    </span>
  );
}

/** Product-led hero visual: real browser window + floating phone & live toast (pure HTML/CSS, theme-aware). */
export function HeroShowcase() {
  return (
    <div className="relative mx-auto mt-14 sm:mt-16 max-w-5xl tp-pop" style={{ animationDelay: "0.25s" }}>
      {/* Browser window */}
      <div className="rounded-[26px] tp-glass p-2 sm:p-3 tp-window-shadow">
        <div className="rounded-2xl bg-card overflow-hidden border border-line">
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-line bg-stage/60">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <div className="mx-auto hidden sm:flex items-center gap-2 rounded-full bg-card border border-line px-3 py-1 text-[0.68rem] text-mute font-mono">
              <ShieldCheck className="h-3 w-3 text-emerald-500" />
              app.trustpulse.ai/dashboard
            </div>
          </div>

          <div className="grid md:grid-cols-[170px_1fr]">
            {/* Sidebar */}
            <aside className="hidden md:flex flex-col gap-1 border-r border-line p-3 text-[0.78rem] bg-stage/40">
              <div className="flex items-center gap-2 px-2 py-1.5 mb-2 font-semibold text-ink">
                <span className="h-5 w-5 rounded-md bg-emerald-500 text-white grid place-items-center text-[0.6rem] font-bold">
                  T
                </span>
                All clients
              </div>
              {[
                { icon: LayoutDashboard, label: "Overview", active: true },
                { icon: ShieldCheck, label: "Review Shield" },
                { icon: Inbox, label: "Private Inbox" },
                { icon: Sparkles, label: "AI Replies" },
                { icon: Code2, label: "Widgets" },
                { icon: QrCode, label: "QR Studio" },
                { icon: Building2, label: "Agency Hub" },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-2 rounded-lg px-2 py-1.5 ${
                    item.active
                      ? "bg-card border border-line text-ink font-semibold shadow-sm"
                      : "text-mute"
                  }`}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label}
                </div>
              ))}
            </aside>

            {/* Main */}
            <div className="p-4 sm:p-5 text-left">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-[0.7rem] text-mute">MJ&apos;s Tavern · Norfolk, VA</div>
                  <div className="text-sm font-bold text-ink">Reputation overview</div>
                </div>
                <div className="hidden sm:flex rounded-lg border border-line bg-stage/60 p-0.5 text-[0.68rem] font-semibold text-mute">
                  {["7D", "30D", "90D", "1Y"].map((p, i) => (
                    <span
                      key={p}
                      className={`px-2.5 py-1 rounded-md ${i === 1 ? "bg-card text-ink shadow-sm" : ""}`}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
                {[
                  { label: "Google rating", value: "4.9", sub: "+0.4 this month", icon: Star },
                  { label: "Total reviews", value: "2,418", sub: "+186 new", icon: TrendingUp },
                  { label: "Negative shielded", value: "99.2%", sub: "Routed privately", icon: ShieldCheck },
                  { label: "Revenue protected", value: "$28.4K", sub: "Est. this year", icon: Sparkles },
                ].map((k) => (
                  <div key={k.label} className="rounded-xl border border-line bg-card p-3 sp-card-shadow">
                    <div className="flex items-center justify-between text-[0.66rem] text-mute font-medium">
                      {k.label}
                      <k.icon className="h-3 w-3 text-emerald-500" />
                    </div>
                    <div className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-ink">{k.value}</div>
                    <div className="text-[0.64rem] text-emerald-600 dark:text-emerald-400 font-semibold">{k.sub}</div>
                  </div>
                ))}
              </div>

              {/* Chart + feed */}
              <div className="mt-3 grid lg:grid-cols-5 gap-3">
                <div className="lg:col-span-2 rounded-xl border border-line bg-card p-3">
                  <div className="text-[0.7rem] font-semibold text-ink mb-1">Rating trend</div>
                  <svg viewBox="0 0 200 80" className="w-full h-20" preserveAspectRatio="none" aria-hidden="true">
                    <defs>
                      <linearGradient id="tpFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0 62 C 25 58, 40 50, 60 46 S 100 40, 125 28 S 170 14, 200 8 L200 80 L0 80 Z" fill="url(#tpFill)" />
                    <path
                      d="M0 62 C 25 58, 40 50, 60 46 S 100 40, 125 28 S 170 14, 200 8"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                    <circle cx="200" cy="8" r="3.5" fill="#10b981" />
                  </svg>
                  <div className="flex justify-between text-[0.6rem] text-mute font-mono">
                    <span>Jan</span>
                    <span>Apr</span>
                    <span>Jul</span>
                    <span>Oct</span>
                  </div>
                </div>

                <div className="lg:col-span-3 rounded-xl border border-line bg-card divide-y divide-line">
                  {REVIEWS.map((r) => (
                    <div key={r.name} className="flex items-start gap-2.5 p-2.5">
                      <span className="h-7 w-7 shrink-0 rounded-full bg-stage border border-line grid place-items-center text-[0.65rem] font-bold text-ink">
                        {r.name[0]}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[0.72rem] font-semibold text-ink">{r.name}</span>
                          <Stars n={r.rating} size={10} />
                          <span
                            className={`ml-auto rounded-full px-2 py-0.5 text-[0.58rem] font-bold ${
                              r.tone === "emerald"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            }`}
                          >
                            {r.tag}
                          </span>
                        </div>
                        <p className="text-[0.68rem] text-mute truncate">{r.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating phone: QR funnel */}
      <div className="hidden md:block absolute -right-4 lg:-right-10 -bottom-12 w-[190px] tp-float">
        <div className="rounded-[2rem] border-[6px] border-slate-900 dark:border-zinc-700 bg-card shadow-2xl overflow-hidden">
          <div className="mx-auto mt-1.5 h-1.5 w-12 rounded-full bg-slate-900/80 dark:bg-zinc-700" />
          <div className="p-4 text-center">
            <div className="text-[0.6rem] font-mono uppercase tracking-wider text-mute">Scan &amp; rate</div>
            <div className="mt-1 text-sm font-bold text-ink leading-tight">How was your visit today?</div>
            <div className="mt-3 flex justify-center">
              <Stars n={5} size={20} />
            </div>
            <div className="mt-3 rounded-full bg-emerald-500 py-2 text-[0.7rem] font-bold text-white">
              Share on Google
            </div>
            <div className="mt-2 text-[0.56rem] text-mute">4-5★ go public · 1-3★ stay private</div>
          </div>
        </div>
      </div>

      {/* Floating live toast */}
      <div className="hidden sm:flex absolute right-6 lg:-right-8 -top-7 items-center gap-3 rounded-2xl tp-glass p-3 pr-5 shadow-xl tp-float-2">
        <span className="h-9 w-9 rounded-full bg-emerald-500/15 grid place-items-center">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        </span>
        <div className="text-left">
          <div className="text-[0.72rem] font-bold text-ink">Priya K. left 5★ on Google</div>
          <div className="text-[0.62rem] text-mute">Verified · just now</div>
        </div>
      </div>

      {/* Floating shield alert */}
      <div className="hidden lg:flex absolute -left-12 -bottom-10 items-center gap-3 rounded-2xl tp-glass p-3 pr-5 shadow-xl tp-float">
        <span className="h-9 w-9 rounded-full bg-amber-500/15 grid place-items-center">
          <ShieldCheck className="h-5 w-5 text-amber-500" />
        </span>
        <div className="text-left">
          <div className="text-[0.72rem] font-bold text-ink">1 complaint intercepted</div>
          <div className="text-[0.62rem] text-mute">Sent to private inbox</div>
        </div>
      </div>
    </div>
  );
}
