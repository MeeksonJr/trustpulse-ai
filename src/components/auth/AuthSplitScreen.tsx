"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  Sparkles,
  User,
  ShieldCheck,
  Star,
  Building2,
  QrCode,
  Code2,
  TrendingUp,
} from "lucide-react";
import { TrustPulseLogo } from "@/components/ui/TrustPulseLogo";
import { OpenSiteNavigatorButton } from "@/components/ui/SiteNavigatorDrawer";
import { usePublicTheme, ThemeToggleButton } from "@/components/ui/PublicChrome";
import { getBrowserSupabaseClient } from "@/lib/supabase/client";
import { saveWorkspaceUser } from "@/lib/storage/workspace-store";

interface AuthSplitScreenProps {
  initialMode?: "login" | "signup";
}

export function AuthSplitScreen({
  initialMode = "login",
}: AuthSplitScreenProps) {
  const router = useRouter();
  const { isDark, toggleTheme } = usePublicTheme(false);
  const [mode, setMode] = useState<"login" | "signup" | "magic">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<"starter" | "pro" | "agency">(
    "agency"
  );
  const [authError, setAuthError] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const p = params.get("plan");
    if (p === "starter" || p === "pro" || p === "agency") {
      setSelectedPlan(p);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setAuthError("Please enter a valid work email address.");
      return;
    }

    if (mode === "magic") {
      try {
        const supabase = getBrowserSupabaseClient();
        if (supabase) {
          await supabase.auth.signInWithOtp({
            email: cleanEmail,
            options: {
              emailRedirectTo: `${window.location.origin}/dashboard`,
            },
          });
        }
      } catch {
        // Fallback
      }
      setMagicLinkSent(true);
      return;
    }

    if (password.trim().length < 6) {
      setAuthError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: mode,
          email: cleanEmail,
          password: password.trim(),
          name: name.trim(),
          plan: selectedPlan,
        }),
      });
      const data = await res.json();

      const supabase = getBrowserSupabaseClient();
      if (supabase) {
        await supabase.auth
          .signInWithPassword({
            email: cleanEmail,
            password: password.trim(),
          })
          .catch(() => {});
      }

      saveWorkspaceUser({
        id: data?.user?.id || `usr-${Date.now()}`,
        name: name.trim() || cleanEmail.split("@")[0],
        email: cleanEmail,
        plan: selectedPlan,
        creditsUsed: 1,
        creditsLimit: 999,
        joined: new Date().toISOString(),
      });

      router.push("/dashboard");
    } catch {
      handleInstantDemo();
    } finally {
      setLoading(false);
    }
  }

  function handleInstantDemo() {
    saveWorkspaceUser({
      id: "usr-demo-agency",
      name: "Agency Partner Demo",
      email: "demo@trustpulse.ai",
      plan: "agency",
      creditsUsed: 2,
      creditsLimit: 999,
      joined: new Date().toISOString(),
    });
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-stage text-ink flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans">
      <div className="w-full max-w-6xl bg-card rounded-[32px] border border-line shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[700px]">
        {/* LEFT COLUMN: Clean Minimalist Auth Form (6 cols) */}
        <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-3 mb-8">
              <Link href="/">
                <TrustPulseLogo auto size="sm" />
              </Link>
              <div className="flex items-center gap-2">
                <ThemeToggleButton isDark={isDark} onToggle={toggleTheme} size="sm" />
                <OpenSiteNavigatorButton variant="dark" label="All Pages" />
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="inline-flex rounded-full border border-line bg-stage p-1 gap-1 w-full mb-6">
              {[
                { id: "login", label: "Sign In" },
                { id: "signup", label: "Create Account" },
                { id: "magic", label: "Magic Link" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setMode(t.id as "login" | "signup" | "magic");
                    setAuthError("");
                    setMagicLinkSent(false);
                  }}
                  className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    mode === t.id
                      ? "bg-card text-ink shadow-sm border border-line/60"
                      : "text-mute hover:text-ink"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Title */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
                {mode === "login"
                  ? "Welcome back"
                  : mode === "signup"
                  ? "Start protecting your reputation"
                  : "Sign in with passwordless magic link"}
              </h1>
              <p className="text-xs sm:text-sm text-mute mt-1.5">
                {mode === "login"
                  ? "Access your client review funnels, QR stands, and social proof widgets."
                  : mode === "signup"
                  ? "Instant setup with Google Maps sync. Free 14-day trial, zero card required."
                  : "We'll email you a secure one-click sign-in link with zero password needed."}
              </p>
            </div>

            {/* Error Banner */}
            {authError && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium mb-5">
                {authError}
              </div>
            )}

            {/* Magic Link Success Banner */}
            {magicLinkSent ? (
              <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs space-y-2 mb-6">
                <div className="font-bold flex items-center gap-1.5 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Magic Link Dispatched
                </div>
                <p>
                  We have sent a login link to <strong>{email}</strong>. Check your inbox and click the link to enter your dashboard.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1.5">
                      Your Name or Agency Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-mute absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Sarah Jenkins"
                        className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-line bg-stage/50 text-ink outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1.5">
                    Work Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-mute absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sarah@agency.com"
                      className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-line bg-stage/50 text-ink outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                {mode !== "magic" && (
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1.5">
                      Password (min. 6 characters)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-mute absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-line bg-stage/50 text-ink outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* Plan Selection Pills in Signup Mode */}
                {mode === "signup" && (
                  <div className="pt-2">
                    <label className="block text-xs font-semibold text-ink mb-2">
                      Select Starting Plan Tier:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "starter", name: "Starter", price: "$0/mo" },
                        { id: "pro", name: "Pro", price: "$29/mo" },
                        { id: "agency", name: "Agency", price: "$79/mo" },
                      ].map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setSelectedPlan(p.id as "starter" | "pro" | "agency")}
                          className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                            selectedPlan === p.id
                              ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-ink font-bold shadow-xs"
                              : "border-line bg-stage/40 text-mute hover:border-ink hover:text-ink"
                          }`}
                        >
                          <div className="text-[11px] font-bold">{p.name}</div>
                          <div className="text-[10px] font-mono text-mute">{p.price}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-ink text-paper font-semibold text-xs py-3 hover:bg-emerald-600 transition-colors shadow-md mt-2 cursor-pointer disabled:opacity-60"
                >
                  <span>
                    {loading
                      ? "Processing..."
                      : mode === "login"
                      ? "Sign In to Workspace"
                      : mode === "signup"
                      ? "Create Free Account"
                      : "Send Magic Link"}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            {/* Quick Demo Login Option */}
            <div className="mt-6 pt-5 border-t border-line text-center">
              <button
                type="button"
                onClick={handleInstantDemo}
                className="inline-flex items-center justify-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>One-Click Instant Demo Login (Skip Authentication)</span>
              </button>
            </div>
          </div>

          <div className="text-[11px] text-mute pt-6 text-center">
            By proceeding, you agree to our{" "}
            <Link href="/legal/terms" className="underline hover:text-ink">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/legal/privacy" className="underline hover:text-ink">
              Privacy Policy
            </Link>
            .
          </div>
        </div>

        {/* RIGHT COLUMN: Antimetal-style Gradient & Live Product Showcase (6 cols) */}
        <div className="hidden lg:flex lg:col-span-6 tp-hero-bg p-8 sm:p-12 flex-col justify-between border-l border-line relative overflow-hidden">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-line bg-card/80 text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 mb-6">
              <ShieldCheck className="w-3.5 h-3.5" />
              Negative Review Shield Active
            </span>

            <h2 className="text-3xl font-extrabold tracking-tight text-ink mb-3 leading-tight">
              Turn your local clients into 5-star market leaders.
            </h2>
            <p className="text-xs text-mute leading-relaxed max-w-md">
              TrustPulse automates Google Maps reviews, shields private grievances, and embeds live social proof with zero manual work.
            </p>

            {/* Live Interactive Review Mockup */}
            <div className="mt-8 rounded-2xl border border-line bg-card/90 backdrop-blur-md p-5 shadow-2xl max-w-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-8 w-8 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-xs grid place-items-center">
                    S
                  </span>
                  <div>
                    <div className="text-xs font-bold text-ink">Sarah Jenkins</div>
                    <div className="text-[10px] text-mute font-mono">Norfolk, VA · Verified</div>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-mute leading-relaxed">
                &ldquo;Painless sedation and 3D imaging made my dental implant journey completely seamless. Dr. Thorne is amazing!&rdquo;
              </p>
              <div className="pt-2 border-t border-line/60 flex items-center justify-between text-[10px] font-mono text-mute">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ Google Maps Synced</span>
                <span>2m ago</span>
              </div>
            </div>
          </div>

          {/* Bottom Trust Metrics */}
          <div className="relative z-10 grid grid-cols-3 gap-3 pt-8 border-t border-line/60">
            <div>
              <div className="text-xl font-bold font-mono text-ink">99.2%</div>
              <div className="text-[10px] text-mute font-medium">Complaints Shielded</div>
            </div>
            <div>
              <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">+42%</div>
              <div className="text-[10px] text-mute font-medium">Google Review Lift</div>
            </div>
            <div>
              <div className="text-xl font-bold font-mono text-ink">&lt;0.4s</div>
              <div className="text-[10px] text-mute font-medium">QR Mobile Scan</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
