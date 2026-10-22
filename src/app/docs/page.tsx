"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  PublicFooter,
  PublicNavbar,
  usePublicTheme,
} from "@/components/ui/PublicChrome";
import {
  PageHero,
  Section,
  Card,
  Eyebrow,
} from "@/components/ui/Primitives";
import {
  Code2,
  Play,
  Check,
  Copy,
  Terminal,
  ShieldCheck,
  Sparkles,
  Search,
  ExternalLink,
  Send,
  Boxes,
} from "lucide-react";

interface EndpointDef {
  id: string;
  method: "GET" | "POST";
  path: string;
  title: string;
  description: string;
  defaultBody: string;
  queryParams?: string;
  sampleCurl: (origin: string) => string;
  sampleNode: (origin: string) => string;
  samplePython: (origin: string) => string;
}

const ENDPOINTS: EndpointDef[] = [
  {
    id: "places-lookup",
    method: "GET",
    path: "/api/places/lookup",
    queryParams: "?query=Hotels%20in%20San%20Francisco%2C%20USA&limit=5",
    title: "Google Maps RapidAPI Auto-Onboarding & Search",
    description:
      "Performs real-time local business discovery from Google Maps via RapidAPI. Pulls full business name, category, star rating, total review count, phone, address, and Google Maps place ID.",
    defaultBody: "",
    sampleCurl: (origin) =>
      `curl -X GET "${origin}/api/places/lookup?query=Hotels%20in%20San%20Francisco%2C%20USA&limit=5"`,
    sampleNode: (origin) =>
      `const res = await fetch("${origin}/api/places/lookup?query=Apex%20Dental&limit=1");\nconst data = await res.json();\nconsole.log(data.businesses);`,
    samplePython: (origin) =>
      `import requests\n\nres = requests.get("${origin}/api/places/lookup", params={"query": "Apex Dental", "limit": 1})\nprint(res.json())`,
  },
  {
    id: "shield-submit",
    method: "POST",
    path: "/api/shield/submit",
    title: "Negative Review Shield — Private Grievance Interception",
    description:
      "Captures 1–3 star ratings from the public customer QR funnel (/r/[slug]). Stores the grievance privately in PostgreSQL on Supabase, dispatches instant SMTP leadership alerts, and prevents public Google rating damage.",
    defaultBody: JSON.stringify(
      {
        workspaceId: "ws-apex-dental",
        rating: 2,
        customerName: "Alex Morgan",
        customerEmail: "alex.m@example.com",
        customerPhone: "(512) 555-8812",
        grievanceText:
          "Appointment started 20 minutes late due to unexpected delay in hygiene room.",
      },
      null,
      2
    ),
    sampleCurl: (origin) =>
      `curl -X POST "${origin}/api/shield/submit" \\\n  -H "Content-Type: application/json" \\\n  -d '{"workspaceId":"ws-apex-dental","rating":2,"customerName":"Alex Morgan","customerEmail":"alex.m@example.com","grievanceText":"Appointment was delayed by 20 minutes."}'`,
    sampleNode: (origin) =>
      `const res = await fetch("${origin}/api/shield/submit", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({\n    workspaceId: "ws-apex-dental",\n    rating: 2,\n    customerName: "Alex Morgan",\n    customerEmail: "alex.m@example.com",\n    grievanceText: "Appointment was delayed by 20 minutes."\n  })\n});\nconst result = await res.json();`,
    samplePython: (origin) =>
      `import requests\n\npayload = {\n    "workspaceId": "ws-apex-dental",\n    "rating": 2,\n    "customerName": "Alex Morgan",\n    "customerEmail": "alex.m@example.com",\n    "grievanceText": "Appointment was delayed by 20 minutes."\n}\nres = requests.post("${origin}/api/shield/submit", json=payload)\nprint(res.json())`,
  },
  {
    id: "widget-feed",
    method: "GET",
    path: "/api/widget/widget-apex-wall",
    title: "Public Widget Review Feed & Config (CORS Enabled)",
    description:
      "Returns approved customer reviews filtered by minRating and maximum count, along with workspace branding. Open wildcard CORS enabled for cross-domain embed consumption.",
    defaultBody: "",
    sampleCurl: (origin) =>
      `curl -X GET "${origin}/api/widget/widget-apex-wall"`,
    sampleNode: (origin) =>
      `const res = await fetch("${origin}/api/widget/widget-apex-wall");\nconst data = await res.json();\nconsole.log(data.reviews);`,
    samplePython: (origin) =>
      `import requests\n\nres = requests.get("${origin}/api/widget/widget-apex-wall")\nprint(res.json())`,
  },
  {
    id: "ai-reply",
    method: "POST",
    path: "/api/reviews/ai-reply",
    title: "PulseMind™ AI Review Responder & Sentiment Engine",
    description:
      "Analyzes customer sentiment and synthesizes 3 strategic reply angles (SEO-Boosted Gratitude, De-escalation & Empathy, Loyalty Reward) with local keyword injection.",
    defaultBody: JSON.stringify(
      {
        reviewId: "rev-1",
        workspaceId: "ws-apex-dental",
      },
      null,
      2
    ),
    sampleCurl: (origin) =>
      `curl -X POST "${origin}/api/reviews/ai-reply" \\\n  -H "Content-Type: application/json" \\\n  -d '{"reviewId":"rev-1","workspaceId":"ws-apex-dental"}'`,
    sampleNode: (origin) =>
      `const res = await fetch("${origin}/api/reviews/ai-reply", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({ reviewId: "rev-1", workspaceId: "ws-apex-dental" })\n});\nconst data = await res.json();`,
    samplePython: (origin) =>
      `import requests\n\nres = requests.post("${origin}/api/reviews/ai-reply", json={"reviewId": "rev-1", "workspaceId": "ws-apex-dental"})\nprint(res.json())`,
  },
  {
    id: "email-test",
    method: "POST",
    path: "/api/email/test",
    title: "Google SMTP Practice Alert Dispatch",
    description:
      "Sends a test responsive HTML practice alert email to verify Google SMTP credentials and inbox delivery under 5 seconds.",
    defaultBody: JSON.stringify(
      {
        to: "buyer-test@example.com",
        templateType: "shield_alert",
        customData: {
          businessName: "Apex Cosmetic Dentistry",
          rating: 2,
          customerName: "Buyer Test",
          grievanceText: "Hygiene appointment started late.",
        },
      },
      null,
      2
    ),
    sampleCurl: (origin) =>
      `curl -X POST "${origin}/api/email/test" \\\n  -H "Content-Type: application/json" \\\n  -d '{"to":"demo@example.com","templateType":"shield_alert"}'`,
    sampleNode: (origin) =>
      `const res = await fetch("${origin}/api/email/test", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({ to: "demo@example.com", templateType: "shield_alert" })\n});`,
    samplePython: (origin) =>
      `import requests\n\nres = requests.post("${origin}/api/email/test", json={"to": "demo@example.com", "templateType": "shield_alert"})\nprint(res.json())`,
  },
];

export default function DocsPage() {
  const { isDark, toggleTheme } = usePublicTheme(false);
  const [activeEndpoint, setActiveEndpoint] = useState<EndpointDef>(ENDPOINTS[0]);
  const [requestBody, setRequestBody] = useState<string>(ENDPOINTS[0].defaultBody);
  const [responseOutput, setResponseOutput] = useState<string>("// Click 'Execute Request' to test this endpoint live");
  const [loading, setLoading] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<"curl" | "node" | "python">("curl");
  const [copiedScript, setCopiedScript] = useState(false);
  const [origin, setOrigin] = useState("https://trustpulse-ai-phi.vercel.app");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const handleSelectEndpoint = (ep: EndpointDef) => {
    setActiveEndpoint(ep);
    setRequestBody(ep.defaultBody);
    setResponseOutput("// Ready to test " + ep.path);
  };

  const handleExecute = async () => {
    setLoading(true);
    const targetUrl = activeEndpoint.queryParams
      ? `${activeEndpoint.path}${activeEndpoint.queryParams}`
      : activeEndpoint.path;

    setResponseOutput("// Executing request to " + targetUrl + "...");
    try {
      let res: Response;
      if (activeEndpoint.method === "GET") {
        res = await fetch(targetUrl);
      } else {
        res = await fetch(targetUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: requestBody || "{}",
        });
      }
      const data = await res.json();
      setResponseOutput(JSON.stringify(data, null, 2));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setResponseOutput("// Error executing request:\n" + msg);
    } finally {
      setLoading(false);
    }
  };

  const copyEmbedScript = () => {
    navigator.clipboard.writeText(
      `<script src="${origin}/api/widget/script?id=widget-apex-toasts" defer></script>`
    );
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const getActiveCode = () => {
    switch (activeCodeTab) {
      case "curl":
        return activeEndpoint.sampleCurl(origin);
      case "node":
        return activeEndpoint.sampleNode(origin);
      case "python":
        return activeEndpoint.samplePython(origin);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink transition-colors selection:bg-emerald-500 selection:text-white">
      <PublicNavbar isDark={isDark} onToggleTheme={toggleTheme} />

      <main className="flex-1">
        {/* Page Hero */}
        <PageHero
          eyebrow="Developer Documentation & REST API"
          title={
            <>
              API Reference &amp;{" "}
              <span className="text-emerald-600 dark:text-emerald-400">
                Embed Specification
              </span>
            </>
          }
          subtitle="Explore the complete TrustPulse REST endpoints: RapidAPI Google Places lookups, the Negative Review Shield pipeline, PulseMind™ AI replies, and embed scripts."
        />

        {/* 1-Line Embed Callout Banner */}
        <Section tone="stage" className="!py-6 border-b border-line">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-line">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-ink block">
                  Quick Embed: 1-Line HTML Widget Script
                </span>
                <span className="text-[11px] text-mute font-mono">
                  &lt;script src=&quot;{origin}/api/widget/script?id=widget-apex-toasts&quot; defer&gt;&lt;/script&gt;
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={copyEmbedScript}
              className="tp-btn-dark px-4 py-2 rounded-xl text-xs font-bold shrink-0 inline-flex items-center gap-1.5 cursor-pointer"
            >
              {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedScript ? "Copied!" : "Copy Script Tag"}</span>
            </button>
          </div>
        </Section>

        {/* Interactive Endpoint Explorer */}
        <Section>
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Sidebar Endpoint List (4 cols) */}
            <div className="lg:col-span-4 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-mute px-1 block">
                Available REST Endpoints
              </span>
              <div className="space-y-1.5">
                {ENDPOINTS.map((ep) => {
                  const isSelected = activeEndpoint.id === ep.id;
                  return (
                    <button
                      key={ep.id}
                      type="button"
                      onClick={() => handleSelectEndpoint(ep)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-1 ${
                        isSelected
                          ? "bg-card border-emerald-500 shadow-md ring-1 ring-emerald-500/20"
                          : "bg-stage/40 border-line hover:bg-stage/80"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded ${
                            ep.method === "GET"
                              ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20"
                              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          }`}
                        >
                          {ep.method}
                        </span>
                        <span className="font-mono text-xs font-bold text-ink truncate">
                          {ep.path}
                        </span>
                      </div>
                      <span className="text-xs text-mute line-clamp-1">
                        {ep.title}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="p-4 rounded-2xl bg-stage/60 border border-line space-y-2 mt-4 text-xs">
                <span className="font-bold text-ink flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Authentication</span>
                </span>
                <p className="text-[11px] text-mute leading-relaxed">
                  Public endpoints (/api/widget/*, /api/shield/submit) require no authorization headers. Management endpoints require an authenticated workspace session.
                </p>
              </div>
            </div>

            {/* Main Interactive Sandbox & Code Examples (8 cols) */}
            <div className="lg:col-span-8 bg-card rounded-3xl border border-line p-6 sm:p-8 sp-card-shadow space-y-6">
              {/* Endpoint Header */}
              <div className="border-b border-line pb-4">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span
                    className={`text-xs font-mono font-black uppercase px-2.5 py-1 rounded-lg ${
                      activeEndpoint.method === "GET"
                        ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20"
                        : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    }`}
                  >
                    {activeEndpoint.method}
                  </span>
                  <span className="font-mono text-sm sm:text-base font-bold text-ink">
                    {activeEndpoint.path}
                    {activeEndpoint.queryParams && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-normal">
                        {activeEndpoint.queryParams}
                      </span>
                    )}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-ink">
                  {activeEndpoint.title}
                </h3>
                <p className="text-xs sm:text-sm text-mute mt-1 leading-relaxed">
                  {activeEndpoint.description}
                </p>
              </div>

              {/* Code Snippet Tabs */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-1 p-1 bg-stage rounded-xl border border-line text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setActiveCodeTab("curl")}
                      className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                        activeCodeTab === "curl"
                          ? "bg-card text-ink shadow-xs"
                          : "text-mute hover:text-ink"
                      }`}
                    >
                      cURL
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveCodeTab("node")}
                      className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                        activeCodeTab === "node"
                          ? "bg-card text-ink shadow-xs"
                          : "text-mute hover:text-ink"
                      }`}
                    >
                      Node.js
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveCodeTab("python")}
                      className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                        activeCodeTab === "python"
                          ? "bg-card text-ink shadow-xs"
                          : "text-mute hover:text-ink"
                      }`}
                    >
                      Python
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(getActiveCode());
                    }}
                    className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </button>
                </div>

                <div className="bg-slate-950 text-slate-200 font-mono text-xs p-4 rounded-2xl border border-slate-800 overflow-x-auto whitespace-pre">
                  {getActiveCode()}
                </div>
              </div>

              {/* Live Request Body Editor (for POST) */}
              {activeEndpoint.method === "POST" && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-1.5">
                    Editable Request Payload (JSON):
                  </label>
                  <textarea
                    rows={6}
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    className="w-full text-xs font-mono bg-slate-950 text-emerald-400 p-4 rounded-2xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                </div>
              )}

              {/* Execute Button */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleExecute}
                  disabled={loading}
                  className="tp-btn-dark px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  <Play className={`w-3.5 h-3.5 ${loading ? "animate-spin" : "fill-current"}`} />
                  <span>{loading ? "Sending Request..." : "Execute Request in Browser"}</span>
                </button>
                <span className="text-[11px] text-mute font-mono">
                  Origin: {origin}
                </span>
              </div>

              {/* Live JSON Response Output */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-1.5">
                  Server Response:
                </label>
                <div className="bg-slate-950 text-emerald-300 font-mono text-xs p-4 rounded-2xl border border-slate-800 overflow-x-auto max-h-72 whitespace-pre shadow-inner">
                  {responseOutput}
                </div>
              </div>
            </div>
          </div>
        </Section>
      </main>

      <PublicFooter isDark={isDark} onToggleTheme={toggleTheme} />
    </div>
  );
}
