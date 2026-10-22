"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  QrCode,
  Printer,
  Download,
  Sparkles,
  ShieldCheck,
  Star,
  Copy,
  Check,
  Sliders,
  ExternalLink,
  Smartphone,
  Eye,
} from "lucide-react";
import { TrustPulseStore } from "@/lib/storage/trustpulse-store";
import { Workspace } from "@/types/trustpulse";

export default function QRStudioPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(() => TrustPulseStore.getWorkspaces());
  const [selectedWsId, setSelectedWsId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("tp_active_workspace");
      if (stored) return stored;
    }
    return workspaces[0]?.id || "ws-apex-dental";
  });
  const ws = workspaces.find((w) => w.id === selectedWsId) || workspaces[0];

  const [heading, setHeading] = useState(ws?.customHeadline || "How was your visit today?");
  const [subheading, setSubheading] = useState(ws?.customSubheadline || "Scan with your phone camera to share feedback with our team");
  const [color, setColor] = useState(ws?.brandColor || "#059669");
  const [includeStars, setIncludeStars] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [origin, setOrigin] = useState("https://trustpulse-ai-phi.vercel.app");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
    const wsList = TrustPulseStore.getWorkspaces();
    setWorkspaces(wsList);
    const stored = localStorage.getItem("tp_active_workspace");
    if (stored && wsList.some((w) => w.id === stored)) {
      setSelectedWsId(stored);
    }

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

  useEffect(() => {
    if (ws) {
      setColor(ws.brandColor || "#059669");
      if (ws.customHeadline) setHeading(ws.customHeadline);
      if (ws.customSubheadline) setSubheading(ws.customSubheadline);
    }
  }, [ws]);

  const funnelUrl = `${origin}/r/${ws?.slug || "apex-dental"}`;

  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
    funnelUrl
  )}&color=${color.replace("#", "")}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(funnelUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-card border border-line rounded-3xl p-6 sm:p-7 sp-card-shadow flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Hardware &amp; Counter Print Studio
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Printable QR Counter Stand Studio
          </h1>
          <p className="text-xs sm:text-sm text-mute">
            Generate 4x6&quot; acrylic counter stands and table tents for front reception checkouts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handlePrint}
            className="tp-btn-dark px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Print 4x6 Stand Card</span>
          </button>
          <button
            type="button"
            onClick={copyUrl}
            className="tp-btn-light px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedLink ? "Copied Link!" : "Copy QR URL"}</span>
          </button>
        </div>
      </div>

      {/* Main Studio Body: Controls (5 cols) + Print Card Preview (7 cols) */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: CONTROLS */}
        <div className="lg:col-span-5 bg-card p-6 sm:p-7 rounded-3xl border border-line sp-card-shadow space-y-5 print:hidden">
          <div className="flex items-center gap-2 pb-3 border-b border-line">
            <Sliders className="w-4 h-4 text-emerald-500" />
            <h2 className="font-extrabold text-sm uppercase tracking-wider text-ink">
              Card Customizer
            </h2>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-1.5">
              Target Practice / Location
            </label>
            <select
              value={selectedWsId}
              onChange={(e) => {
                setSelectedWsId(e.target.value);
                const target = workspaces.find((w) => w.id === e.target.value);
                if (target) setColor(target.brandColor || "#059669");
              }}
              className="w-full text-xs font-bold bg-stage border border-line rounded-xl px-3.5 py-2.5 text-ink focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {workspaces.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-1.5">
              Headline Title
            </label>
            <input
              type="text"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              className="w-full text-xs font-bold border border-line bg-stage/50 rounded-xl px-3.5 py-2.5 text-ink focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-1.5">
              Subheadline / Instructions
            </label>
            <input
              type="text"
              value={subheading}
              onChange={(e) => setSubheading(e.target.value)}
              className="w-full text-xs border border-line bg-stage/50 rounded-xl px-3.5 py-2.5 text-ink focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-1.5">
              Brand Accent Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-9 h-9 rounded-xl cursor-pointer border border-line p-0.5 bg-transparent"
              />
              <span className="font-mono text-xs font-bold text-ink">{color}</span>
              <div className="flex gap-1.5 ml-auto">
                {["#059669", "#2563eb", "#7c3aed", "#e11d48", "#0f172a"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className="w-5 h-5 rounded-full border border-line cursor-pointer"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="includeStars"
              checked={includeStars}
              onChange={(e) => setIncludeStars(e.target.checked)}
              className="rounded accent-emerald-600 cursor-pointer"
            />
            <label htmlFor="includeStars" className="text-xs font-bold text-ink cursor-pointer">
              Include 5-Star Visual Accent
            </label>
          </div>

          {/* Tips Card */}
          <div className="p-4 rounded-2xl bg-stage border border-line text-xs space-y-1.5">
            <span className="font-bold text-ink flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Counter Stand Placement Tip</span>
            </span>
            <p className="text-mute text-[11px] leading-relaxed">
              Standard 4x6&quot; acrylic holders fit this exact template. Clinics experience a 340% increase in verified reviews when patients scan while waiting for receipt printout.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: 4x6 PHYSICAL CARD MOCKUP */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-sm p-8 sm:p-10 rounded-3xl border-2 border-line bg-card text-ink shadow-2xl text-center space-y-6 relative overflow-hidden">
            {/* Top Brand Stripe */}
            <div
              className="h-2.5 w-full rounded-full transition-colors"
              style={{ backgroundColor: color }}
            />

            <div>
              <div
                className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center text-white font-extrabold text-xl shadow-md ring-4 ring-card"
                style={{ backgroundColor: color }}
              >
                {ws?.name.charAt(0) || "A"}
              </div>
              <h3 className="font-black text-xl text-ink tracking-tight">
                {ws?.name || "Apex Cosmetic Dentistry"}
              </h3>
              <p className="text-[11px] text-mute uppercase tracking-wider font-semibold mt-0.5">
                {ws?.category || "Cosmetic & Orthodontic Care"}
              </p>
            </div>

            {includeStars && (
              <div className="flex justify-center text-amber-400 gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400" />
                ))}
              </div>
            )}

            {/* QR Code Container */}
            <div className="p-5 bg-stage/80 border border-line rounded-2xl inline-block shadow-inner">
              <img
                src={qrSvgUrl}
                alt="Patient Review QR Code"
                className="w-48 h-48 mx-auto object-contain rounded-xl"
              />
              <div className="text-[10px] font-mono font-bold text-mute uppercase tracking-widest mt-2.5 flex items-center justify-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
                <span>Open Camera &amp; Tap Screen</span>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-extrabold text-ink">
                {heading}
              </h4>
              <p className="text-xs text-mute max-w-xs mx-auto leading-relaxed">
                {subheading}
              </p>
            </div>

            <div className="pt-3 border-t border-line text-[10px] text-mute flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Protected by TrustPulse AI Negative Review Shield™</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
