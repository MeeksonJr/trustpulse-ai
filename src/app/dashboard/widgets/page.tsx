"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Code2,
  Copy,
  Check,
  Eye,
  Sliders,
  Sparkles,
  Star,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Layers,
  LayoutGrid,
  Bell,
  RefreshCw,
  BadgeCheck,
} from "lucide-react";
import { TrustPulseStore } from "@/lib/storage/trustpulse-store";
import { getWorkspaceUser, WorkspaceUser } from "@/lib/storage/workspace-store";
import { WidgetType, WidgetTheme, Workspace } from "@/types/trustpulse";
import { GoogleBadge, TrustpilotBadge } from "@/components/ui/PlatformBadges";

export default function WidgetStudioPage() {
  const [currentUser, setCurrentUser] = useState<WorkspaceUser | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>(() => TrustPulseStore.getWorkspaces());
  const [selectedWsId, setSelectedWsId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("tp_active_workspace");
      if (stored) return stored;
    }
    return workspaces[0]?.id || "ws-apex-dental";
  });
  const ws = workspaces.find((w) => w.id === selectedWsId) || workspaces[0];

  const [widgetType, setWidgetType] = useState<WidgetType>("toast_notification");
  const [theme, setTheme] = useState<WidgetTheme>("glassmorphism");
  const [position, setPosition] = useState<"bottom_left" | "bottom_right">("bottom_left");
  const [minRating, setMinRating] = useState<number>(4);
  const [loopInterval, setLoopInterval] = useState<number>(6);
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedIframe, setCopiedIframe] = useState(false);
  const [origin, setOrigin] = useState("https://trustpulse-ai-phi.vercel.app");
  const [testToastActive, setTestToastActive] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
    const user = getWorkspaceUser();
    setCurrentUser(user);
    const wsList = TrustPulseStore.getWorkspaces(user?.id);
    setWorkspaces(wsList);
    const stored = localStorage.getItem("tp_active_workspace");
    if (stored && wsList.some((w) => w.id === stored)) {
      setSelectedWsId(stored);
    } else if (wsList[0]) {
      setSelectedWsId(wsList[0].id);
    }

    fetch(`/api/workspaces?userId=${encodeURIComponent(user?.id || "demo")}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.workspaces) && data.workspaces.length > 0) {
          setWorkspaces(data.workspaces);
        }
      })
      .catch(() => {});

    const handleWsChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setSelectedWsId(customEvent.detail);
      }
    };

    window.addEventListener("trustpulse_ws_changed", handleWsChange);
    return () => {
      window.removeEventListener("trustpulse_ws_changed", handleWsChange);
    };
  }, []);

  const [reviewsList, setReviewsList] = useState<any[]>(() => TrustPulseStore.getReviews(ws?.id));

  useEffect(() => {
    if (!ws?.id) return;
    setReviewsList(TrustPulseStore.getReviews(ws.id));

    fetch(`/api/reviews?workspaceId=${encodeURIComponent(ws.id)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.reviews) && data.reviews.length > 0) {
          setReviewsList(data.reviews);
          for (const rev of data.reviews) {
            TrustPulseStore.addReview(rev);
          }
        }
      })
      .catch((err) => console.warn("[TrustPulse] Widget reviews sync notice:", err));
  }, [selectedWsId, ws?.id]);

  const sampleReviews = reviewsList.filter((r) => r.rating >= minRating);

  const widgetId = `widget-${ws?.slug || "apex-dental"}-${
    widgetType === "toast_notification"
      ? "toasts"
      : widgetType === "floating_pill"
      ? "badge"
      : "wall"
  }`;

  const scriptSnippet = `<script src="${origin}/api/widget/script?id=${widgetId}" defer></script>`;
  const iframeSnippet = `<iframe src="${origin}/embed/${widgetId}" width="100%" height="600" frameborder="0" loading="lazy"></iframe>`;

  const copyScript = () => {
    navigator.clipboard.writeText(scriptSnippet);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const copyIframe = () => {
    navigator.clipboard.writeText(iframeSnippet);
    setCopiedIframe(true);
    setTimeout(() => setCopiedIframe(false), 2000);
  };

  const triggerLiveTestToast = () => {
    setTestToastActive(true);
    setTimeout(() => setTestToastActive(false), 5000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-card border border-line rounded-3xl p-6 sm:p-7 sp-card-shadow flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Widget Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Embeddable Social Proof Studio
          </h1>
          <p className="text-xs sm:text-sm text-mute">
            Configure, preview, and copy 1-line async scripts for {ws?.name}.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={triggerLiveTestToast}
            className="tp-btn-dark px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>Test Toast In Browser</span>
          </button>
          <Link
            href="/demo/apex-dental-site"
            target="_blank"
            className="tp-btn-light px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
          >
            <span>Live Client Demo</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Main Studio Grid: Controls (5 cols) + Live Preview (7 cols) */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: CONTROLS */}
        <div className="lg:col-span-5 bg-card p-6 sm:p-7 rounded-3xl border border-line sp-card-shadow space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-line">
            <Sliders className="w-4 h-4 text-emerald-500" />
            <h2 className="font-extrabold text-sm uppercase tracking-wider text-ink">
              Widget Settings
            </h2>
          </div>

          {/* 1. Widget Type */}
          <div>
            <label className="block text-xs font-bold text-mute uppercase tracking-wider mb-2">
              Widget Layout Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "toast_notification", label: "Floating Toast", icon: Bell },
                { id: "wall_of_love", label: "Wall of Love", icon: LayoutGrid },
                { id: "floating_pill", label: "Rating Badge", icon: BadgeCheck },
              ].map((t) => {
                const Icon = t.icon;
                const isSelected = widgetType === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setWidgetType(t.id as WidgetType)}
                    className={`py-2.5 px-2 rounded-2xl text-xs font-bold transition-all border flex flex-col items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? "bg-slate-900 text-white dark:bg-emerald-600 border-slate-900 dark:border-emerald-600 shadow-md"
                        : "bg-stage/50 hover:bg-stage text-mute hover:text-ink border-line"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[11px]">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Visual Theme */}
          <div>
            <label className="block text-xs font-bold text-mute uppercase tracking-wider mb-2">
              Visual Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "glassmorphism", label: "Glassmorphism" },
                { id: "light", label: "Clean White" },
                { id: "dark", label: "Dark Mode" },
              ].map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => setTheme(th.id as WidgetTheme)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    theme === th.id
                      ? "bg-slate-900 text-white dark:bg-emerald-600 border-slate-900 dark:border-emerald-600 shadow-xs"
                      : "bg-stage/50 hover:bg-stage text-mute border-line"
                  }`}
                >
                  {th.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Screen Position */}
          {widgetType !== "wall_of_love" && (
            <div>
              <label className="block text-xs font-bold text-mute uppercase tracking-wider mb-2">
                Screen Position
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPosition("bottom_left")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    position === "bottom_left"
                      ? "bg-slate-900 text-white dark:bg-emerald-600 border-slate-900 dark:border-emerald-600 shadow-xs"
                      : "bg-stage/50 hover:bg-stage text-mute border-line"
                  }`}
                >
                  Bottom Left (Standard)
                </button>
                <button
                  type="button"
                  onClick={() => setPosition("bottom_right")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    position === "bottom_right"
                      ? "bg-slate-900 text-white dark:bg-emerald-600 border-slate-900 dark:border-emerald-600 shadow-xs"
                      : "bg-stage/50 hover:bg-stage text-mute border-line"
                  }`}
                >
                  Bottom Right
                </button>
              </div>
            </div>
          )}

          {/* 4. Minimum Rating Filter */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-mute uppercase tracking-wider">
                Minimum Rating to Display
              </label>
              <span className="text-xs font-bold text-amber-500 font-mono">
                {minRating} Stars &amp; Above
              </span>
            </div>
            <input
              type="range"
              min="3"
              max="5"
              step="1"
              value={minRating}
              onChange={(e) => setMinRating(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-mute font-mono mt-1">
              <span>3★+</span>
              <span>4★+ (Recommended)</span>
              <span>5★ Only</span>
            </div>
          </div>

          {/* Embed Snippets Box */}
          <div className="pt-4 border-t border-line space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-ink block">
              Embed Code Snippet
            </span>

            {/* Script Tag */}
            <div className="p-3.5 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-[11px] border border-slate-800 break-all space-y-2">
              <div>{scriptSnippet}</div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                <span className="text-[10px] text-slate-400 font-sans">
                  Under 15KB • CORS wildcard
                </span>
                <button
                  type="button"
                  onClick={copyScript}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] inline-flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedScript ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedScript ? "Copied!" : "Copy Script"}</span>
                </button>
              </div>
            </div>

            {/* iFrame alternative */}
            <div className="p-3 rounded-2xl bg-stage/70 border border-line text-xs flex items-center justify-between">
              <span className="text-mute text-[11px]">Need an iframe embed?</span>
              <button
                type="button"
                onClick={copyIframe}
                className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                {copiedIframe ? "Copied iFrame!" : "Copy iFrame Code"}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE VISUAL PREVIEW */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-card rounded-3xl border border-line sp-card-shadow p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-500" />
                <h3 className="font-extrabold text-sm text-ink uppercase tracking-wider">
                  Live Browser Preview
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                Interactive Preview
              </span>
            </div>

            {/* Mockup Client Browser Frame */}
            <div className="rounded-2xl border border-line bg-stage/60 overflow-hidden shadow-inner p-6 min-h-[380px] flex flex-col justify-between relative">
              {/* Fake Website Content */}
              <div className="space-y-3 opacity-60 pointer-events-none">
                <div className="h-4 w-32 bg-mute/20 rounded-md" />
                <div className="h-8 w-64 bg-mute/30 rounded-lg" />
                <div className="h-3 w-80 bg-mute/20 rounded-md" />
                <div className="h-3 w-72 bg-mute/20 rounded-md" />
              </div>

              {/* PREVIEW: 1. FLOATING TOAST NOTIFICATION */}
              {widgetType === "toast_notification" && (
                <div
                  className={`mt-auto ${
                    position === "bottom_right" ? "ml-auto" : "mr-auto"
                  } max-w-sm w-full p-4 rounded-2xl border transition-all duration-300 shadow-2xl ${
                    theme === "dark"
                      ? "bg-slate-900/95 text-white border-slate-800"
                      : theme === "glassmorphism"
                      ? "bg-card/90 backdrop-blur-xl text-ink border-line"
                      : "bg-card text-ink border-line"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {sampleReviews[0]?.authorName.charAt(0) || "J"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-extrabold text-xs text-ink truncate">
                          {sampleReviews[0]?.authorName || "Marcus Vance"}
                        </span>
                        <div className="flex text-amber-400 text-xs">★★★★★</div>
                      </div>
                      <p className="text-[11px] text-mute mt-1 line-clamp-2 leading-relaxed">
                        &ldquo;{sampleReviews[0]?.reviewText || "Painless sedation, luxurious clinic ambiance, and pristine hygiene. Highly recommend!"}&rdquo;
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-line text-[10px] text-mute font-medium">
                        <span>Verified Patient • Google Maps</span>
                        <span className="text-emerald-500 font-bold">✓ Verified</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PREVIEW: 2. WALL OF LOVE */}
              {widgetType === "wall_of_love" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-auto">
                  {sampleReviews.slice(0, 4).map((r) => (
                    <div
                      key={r.id}
                      className={`p-3.5 rounded-2xl border text-xs space-y-2 ${
                        theme === "dark"
                          ? "bg-slate-900 text-white border-slate-800"
                          : "bg-card text-ink border-line"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-ink">{r.authorName}</span>
                        <span className="text-amber-400 text-[10px]">★★★★★</span>
                      </div>
                      <p className="text-[11px] text-mute line-clamp-2 leading-relaxed italic">
                        &ldquo;{r.reviewText}&rdquo;
                      </p>
                      <div className="text-[9px] text-mute pt-1 border-t border-line">
                        {r.platform} • {r.authorRole || "Patient"}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* PREVIEW: 3. FLOATING STAR BADGE */}
              {widgetType === "floating_pill" && (
                <div
                  className={`mt-auto ${
                    position === "bottom_right" ? "ml-auto" : "mr-auto"
                  } p-3 rounded-full border inline-flex items-center gap-3 shadow-xl ${
                    theme === "dark"
                      ? "bg-slate-900 text-white border-slate-800"
                      : "bg-card text-ink border-line"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1 font-bold text-xs text-ink">
                      <span>4.94</span>
                      <span className="text-amber-400">★★★★★</span>
                    </div>
                    <span className="text-[10px] text-mute block leading-none">
                      184 Google Reviews
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-500 uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mr-1">
                    Verified
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Active Test Toast (when clicked) */}
      {testToastActive && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-900/95 backdrop-blur-md text-white border border-slate-700 rounded-2xl p-4 shadow-2xl max-w-sm animate-in fade-in slide-in-from-bottom-6 duration-200">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
              M
            </div>
            <div>
              <div className="flex items-center justify-between gap-4">
                <span className="font-bold text-xs text-white">Marcus Vance</span>
                <span className="text-amber-400 text-xs">★★★★★</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                &ldquo;Painless sedation, luxurious clinic ambiance, and pristine hygiene. My smile looks radiant!&rdquo;
              </p>
              <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                <span>Porcelain Veneers</span>
                <span className="text-emerald-400 font-bold">✓ Verified Google Patient</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
