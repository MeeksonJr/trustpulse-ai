"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  LayoutDashboard,
  QrCode,
  LayoutGrid,
  Sparkles,
  Building2,
  AlertTriangle,
  Menu,
  X,
  ExternalLink,
  Sun,
  Moon,
  ChevronDown,
  Bell,
  Search,
  CheckCircle2,
  Smartphone,
  Star,
  Activity,
  Code2,
  Sliders,
  Send,
  Plus,
} from "lucide-react";
import { TrustPulseLogo } from "@/components/ui/TrustPulseLogo";
import { TrustPulseStore } from "@/lib/storage/trustpulse-store";
import { Workspace } from "@/types/trustpulse";

interface DashboardShellProps {
  children: React.ReactNode;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  external?: boolean;
  badge?: string;
  badgeColor?: string;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWsId, setSelectedWsId] = useState<string>("ws-apex-dental");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [unreadGrievanceCount, setUnreadGrievanceCount] = useState(1);
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);

  useEffect(() => {
    // Check dark mode
    if (typeof window !== "undefined") {
      const isDarkMode =
        document.documentElement.classList.contains("dark") ||
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(isDarkMode);
    }

    // Load workspaces & feedback
    const wsList = TrustPulseStore.getWorkspaces();
    setWorkspaces(wsList);
    if (wsList.length > 0) {
      setSelectedWsId(wsList[0].id);
      const grievances = TrustPulseStore.getPrivateFeedback(wsList[0].id);
      const newCount = grievances.filter((g) => g.status === "new").length;
      setUnreadGrievanceCount(newCount > 0 ? newCount : 1);
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (typeof document !== "undefined") {
      if (nextDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  const currentWorkspace =
    workspaces.find((w) => w.id === selectedWsId) || workspaces[0] || {
      id: "ws-apex-dental",
      name: "Apex Cosmetic Dentistry",
      category: "Cosmetic Dentistry",
      slug: "apex-dental",
      brandColor: "#059669",
    };

  const navGroups: NavGroup[] = [
    {
      group: "Core Reputation",
      items: [
        {
          label: "Command Overview",
          href: "/dashboard",
          icon: LayoutDashboard,
          exact: true,
        },
        {
          label: "Negative Review Shield",
          href: "/dashboard/shield",
          icon: ShieldCheck,
          badge: unreadGrievanceCount > 0 ? `${unreadGrievanceCount} New` : undefined,
          badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20",
        },
      ],
    },
    {
      group: "Growth & Marketing",
      items: [
        {
          label: "Counter QR Studio",
          href: "/dashboard/qr-studio",
          icon: QrCode,
        },
        {
          label: "Embeddable Widgets",
          href: "/dashboard/widgets",
          icon: LayoutGrid,
        },
        {
          label: "PulseMind™ AI Replies",
          href: "/dashboard/ai-replies",
          icon: Sparkles,
        },
      ],
    },
    {
      group: "Agency & Operations",
      items: [
        {
          label: "Agency Multi-Client Hub",
          href: "/dashboard/agency",
          icon: Building2,
        },
        {
          label: "Revenue Leak Audit",
          href: "/audit",
          icon: Activity,
          external: true,
        },
        {
          label: "REST API Docs",
          href: "/docs",
          icon: Code2,
          external: true,
        },
      ],
    },
  ];

  const getBreadcrumbTitle = () => {
    if (pathname === "/dashboard") return "Overview";
    if (pathname === "/dashboard/shield") return "Negative Review Shield";
    if (pathname === "/dashboard/qr-studio") return "Counter QR Stand Studio";
    if (pathname === "/dashboard/widgets") return "Embeddable Widgets";
    if (pathname === "/dashboard/ai-replies") return "PulseMind™ AI Replies";
    if (pathname === "/dashboard/agency") return "Agency Multi-Client Hub";
    return "Dashboard";
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-card border-r border-line select-none">
      {/* Brand & Version Header */}
      <div className="p-5 border-b border-line flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex-shrink-0">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-extrabold text-base text-ink tracking-tight leading-none flex items-center gap-1.5">
              <span>TrustPulse</span>
              <span className="text-emerald-500 font-black">.ai</span>
            </div>
            <span className="text-[10px] text-mute font-mono">Autonomous Social Proof</span>
          </div>
        </Link>

        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          v2.4
        </span>
      </div>

      {/* Workspace Switcher Card */}
      <div className="p-4 border-b border-line">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
            className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-stage/70 hover:bg-stage border border-line text-left transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-xs shrink-0 shadow-sm"
                style={{ backgroundColor: currentWorkspace.brandColor || "#059669" }}
              >
                {currentWorkspace.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-ink truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {currentWorkspace.name}
                </div>
                <div className="text-[10px] text-mute truncate flex items-center gap-1">
                  <span>{currentWorkspace.category || "Local Practice"}</span>
                  <span>•</span>
                  <span className="text-amber-500 font-semibold flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-amber-400" />
                    4.94
                  </span>
                </div>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-mute shrink-0 ml-1.5 group-hover:text-ink transition-transform duration-200" />
          </button>

          {/* Dropdown Menu */}
          {showWorkspaceMenu && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-card border border-line rounded-2xl shadow-2xl p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
              <span className="text-[10px] font-bold uppercase tracking-wider text-mute px-2 py-1 block">
                Select Client Workspace
              </span>
              {workspaces.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => {
                    setSelectedWsId(w.id);
                    setShowWorkspaceMenu(false);
                  }}
                  className={`w-full flex items-center gap-2 p-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                    w.id === currentWorkspace.id
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold"
                      : "hover:bg-stage text-ink"
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px] font-bold"
                    style={{ backgroundColor: w.brandColor || "#059669" }}
                  >
                    {w.name.charAt(0)}
                  </div>
                  <span className="truncate flex-1">{w.name}</span>
                  {w.id === currentWorkspace.id && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  )}
                </button>
              ))}

              <div className="pt-1 border-t border-line">
                <Link
                  href="/dashboard/agency"
                  onClick={() => setShowWorkspaceMenu(false)}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Connect Google Maps Business</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grouped Navigation Links */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-mute px-3">
              {group.group}
            </span>
            <div className="space-y-1 mt-1">
              {group.items.map((item, iIdx) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href) && !item.external;
                const Icon = item.icon;

                return (
                  <Link
                    key={iIdx}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all group ${
                      isActive
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20 shadow-xs"
                        : "text-mute hover:text-ink hover:bg-stage/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-mute group-hover:text-ink"
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          item.badgeColor || "bg-emerald-500/10 text-emerald-600"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {item.external && (
                      <ExternalLink className="w-3 h-3 text-mute/60 group-hover:text-mute shrink-0" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Status Card: Negative Review Shield */}
      <div className="p-4 border-t border-line space-y-3">
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Shield Active
            </span>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              99.2%
            </span>
          </div>
          <p className="text-[11px] text-mute leading-snug">
            All sub-4★ ratings are intercepted and emailed privately to management.
          </p>
          <Link
            href={`/r/${currentWorkspace.slug || "apex-dental"}`}
            target="_blank"
            className="mt-2.5 w-full py-1.5 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <Smartphone className="w-3 h-3" />
            <span>Test Customer QR Funnel</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </Link>
        </div>

        {/* User Profile Pill */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center font-bold text-xs ring-1 ring-line">
              DT
            </div>
            <div>
              <div className="font-bold text-ink text-xs leading-none">
                Dr. Thorne
              </div>
              <span className="text-[10px] text-mute">Practice Owner</span>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-mute hover:text-ink hover:bg-stage border border-line transition-colors cursor-pointer"
            title="Toggle Theme"
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stage text-ink font-sans flex antialiased">
      {/* DESKTOP SIDEBAR (Constant 260px) */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* MOBILE DRAWER (Slide-over) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* MAIN APPLICATION CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Top App Header */}
        <header className="sticky top-0 z-20 h-16 bg-card/90 backdrop-blur-md border-b border-line px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-mute hover:text-ink hover:bg-stage border border-line cursor-pointer"
              aria-label="Open Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb / Title */}
            <div>
              <div className="flex items-center gap-1.5 text-xs text-mute">
                <Link href="/dashboard" className="hover:text-ink transition-colors">
                  Dashboard
                </Link>
                <span>/</span>
                <span className="text-ink font-semibold">{getBreadcrumbTitle()}</span>
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Live SMTP Connection Pill */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Google SMTP: Live</span>
            </div>

            {/* Test Customer Funnel Button */}
            <Link
              href={`/r/${currentWorkspace.slug || "apex-dental"}`}
              target="_blank"
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stage hover:bg-card border border-line text-ink text-xs font-bold transition-colors"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
              <span>Patient QR View</span>
              <ExternalLink className="w-3 h-3 text-mute" />
            </Link>

            {/* Notifications / Shield Bell */}
            <Link
              href="/dashboard/shield"
              className="relative p-2 rounded-xl text-mute hover:text-ink hover:bg-stage border border-line transition-colors"
              title="Negative Review Shield Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadGrievanceCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-card" />
              )}
            </Link>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="hidden sm:flex p-2 rounded-xl text-mute hover:text-ink hover:bg-stage border border-line transition-colors cursor-pointer"
              title="Toggle Day/Night Mode"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Active Workspace Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-line">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black shrink-0"
                style={{ backgroundColor: currentWorkspace.brandColor || "#059669" }}
              >
                {currentWorkspace.name.charAt(0)}
              </div>
              <span className="hidden sm:inline text-xs font-bold text-ink max-w-[120px] truncate">
                {currentWorkspace.name}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
