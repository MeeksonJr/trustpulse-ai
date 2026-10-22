"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  Save,
  Check,
  Sparkles,
  RefreshCw,
  ExternalLink,
  MessageSquareWarning,
  PlusCircle,
  Send,
  X,
  FileText,
  Inbox,
  CheckCircle,
} from "lucide-react";
import { TrustPulseStore } from "@/lib/storage/trustpulse-store";
import { getWorkspaceUser, WorkspaceUser } from "@/lib/storage/workspace-store";
import { PrivateFeedback, FeedbackStatus, Workspace } from "@/types/trustpulse";

export default function ShieldInboxPage() {
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

  const [feedbackList, setFeedbackList] = useState<PrivateFeedback[]>(() =>
    TrustPulseStore.getPrivateFeedback(ws?.id)
  );
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "new" | "contacted" | "resolved">("all");
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesText, setNotesText] = useState("");
  const [savedSuccessId, setSavedSuccessId] = useState<string | null>(null);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
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

  useEffect(() => {
    if (ws?.id) {
      setFeedbackList(TrustPulseStore.getPrivateFeedback(ws.id));
    }
  }, [selectedWsId, ws?.id]);

  // Email Test Modal State
  const [testEmailModalOpen, setTestEmailModalOpen] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState("");
  const [testEmailType, setTestEmailType] = useState<
    "shield_alert" | "customer_apology" | "weekly_digest"
  >("shield_alert");
  const [selectedFeedbackForEmail, setSelectedFeedbackForEmail] = useState<PrivateFeedback | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailResult, setEmailResult] = useState<{
    success: boolean;
    messageId?: string;
    simulated?: boolean;
    configUsed?: string;
    note?: string;
    error?: string;
  } | null>(null);

  const fetchFreshFeedback = async (workspaceId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/shield?workspaceId=${encodeURIComponent(workspaceId)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.feedback)) {
        setFeedbackList(data.feedback);
      } else {
        setFeedbackList(TrustPulseStore.getPrivateFeedback(workspaceId));
      }
    } catch {
      setFeedbackList(TrustPulseStore.getPrivateFeedback(workspaceId));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreshFeedback(selectedWsId);
  }, [selectedWsId]);

  const filtered = feedbackList.filter((f) => {
    if (filter === "all") return true;
    return f.status === filter;
  });

  const handleStatusChange = async (id: string, newStatus: FeedbackStatus) => {
    TrustPulseStore.updatePrivateFeedback(id, newStatus);
    setFeedbackList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );

    try {
      await fetch("/api/shield", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
    } catch (err) {
      console.error("Failed to patch feedback status on server:", err);
    }
  };

  const handleSaveNotes = async (id: string) => {
    const currentFb = feedbackList.find((f) => f.id === id);
    if (!currentFb) return;

    TrustPulseStore.updatePrivateFeedback(id, currentFb.status, notesText);
    setFeedbackList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, resolutionNotes: notesText } : item))
    );
    setEditingNotesId(null);
    setSavedSuccessId(id);
    setTimeout(() => setSavedSuccessId(null), 2500);

    try {
      await fetch("/api/shield", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status: currentFb.status,
          resolutionNotes: notesText,
        }),
      });
    } catch (err) {
      console.error("Failed to save resolution notes on server:", err);
    }
  };

  const handleSimulateGrievance = async () => {
    setSimulating(true);
    const mockNames = ["David Miller", "Elena Rostova", "Marcus Vance", "Chloe Bennett", "Arthur Pendelton"];
    const mockGrievances = [
      "Front desk receptionist seemed rushed and didn't validate my parking ticket.",
      "Waiting room TV was playing loud news, and my appointment was delayed 15 minutes.",
      "Hygiene cleaning felt somewhat rushed compared to my previous appointment with Dr. Thorne.",
      "Pharmacy prescription was sent to the wrong branch, causing a 30-minute delay.",
      "The anesthetic injection pinched more than usual and I was left in chair for 20 minutes without check-in.",
    ];
    const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
    const randomGrievance = mockGrievances[Math.floor(Math.random() * mockGrievances.length)];
    const randomRating = Math.floor(Math.random() * 3) + 1;

    try {
      const res = await fetch("/api/shield/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId: ws.id,
          rating: randomRating,
          customerName: randomName,
          customerEmail: `${randomName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
          customerPhone: "(512) 555-0144",
          grievanceText: randomGrievance,
        }),
      });
      const data = await res.json();
      if (data.success && data.feedback) {
        TrustPulseStore.addPrivateFeedback(data.feedback);
        setFeedbackList((prev) => [data.feedback, ...prev]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSimulating(false);
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmailAddress || !testEmailAddress.includes("@")) return;

    setSendingEmail(true);
    setEmailResult(null);

    try {
      const res = await fetch("/api/email/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: testEmailAddress,
          templateType: testEmailType,
          customData: {
            businessName: ws.name,
            brandColor: ws.brandColor,
            rating: selectedFeedbackForEmail ? selectedFeedbackForEmail.rating : 2,
            customerName: selectedFeedbackForEmail ? selectedFeedbackForEmail.customerName : "Marcus Vance (Test)",
            customerPhone: selectedFeedbackForEmail ? selectedFeedbackForEmail.customerPhone : "(512) 555-0199",
            grievanceText: selectedFeedbackForEmail
              ? selectedFeedbackForEmail.grievanceText
              : "Wait time was 25 minutes past appointment time and staff was rushed.",
          },
        }),
      });

      const data = await res.json();
      setEmailResult(data);
    } catch (err: unknown) {
      setEmailResult({
        success: false,
        error: err instanceof Error ? err.message : "Failed to connect to email API",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner & Action Controls */}
      <div className="bg-card border border-rose-500/30 rounded-3xl p-6 sm:p-7 sp-card-shadow flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Private Feedback Interception
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight flex items-center gap-2">
            <span>Negative Review Shield Inbox</span>
          </h1>
          <p className="text-xs sm:text-sm text-mute">
            Customer feedback rated 1–3 stars intercepted before public damage on Google Maps.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              setSelectedFeedbackForEmail(null);
              setEmailResult(null);
              setTestEmailModalOpen(true);
            }}
            className="tp-btn-dark px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Send className="w-3.5 h-3.5 text-emerald-400" />
            <span>Send Test Alert Email</span>
          </button>

          <button
            type="button"
            onClick={handleSimulateGrievance}
            disabled={simulating}
            className="tp-btn-light px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <PlusCircle className="w-3.5 h-3.5 text-rose-500" />
            <span>{simulating ? "Simulating..." : "Simulate Incoming Grievance"}</span>
          </button>

          <button
            type="button"
            onClick={() => fetchFreshFeedback(selectedWsId)}
            className="p-2.5 rounded-xl border border-line text-mute hover:text-ink hover:bg-stage cursor-pointer transition-colors"
            title="Refresh Inbox"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-emerald-500" : ""}`} />
          </button>
        </div>
      </div>

      {/* 4 Shield KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-card border border-line rounded-3xl p-5 sm:p-6 sp-card-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-mute uppercase tracking-wider">
              Intercepted Ratings
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-ink tracking-tight">
            {feedbackList.length}
          </div>
          <div className="mt-1 text-[11px] text-rose-600 dark:text-rose-400 font-bold">
            0 Leaked to Google Maps
          </div>
        </div>

        <div className="bg-card border border-line rounded-3xl p-5 sm:p-6 sp-card-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-mute uppercase tracking-wider">
              Needs Follow-Up
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-rose-600 dark:text-rose-400 tracking-tight">
            {feedbackList.filter((f) => f.status === "new").length}
          </div>
          <div className="mt-1 text-[11px] text-mute font-medium">
            Pending management response
          </div>
        </div>

        <div className="bg-card border border-line rounded-3xl p-5 sm:p-6 sp-card-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-mute uppercase tracking-wider">
              Resolution Rate
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
            {feedbackList.length > 0
              ? Math.round(
                  (feedbackList.filter((f) => f.status === "resolved").length / feedbackList.length) * 100
                )
              : 100}
            %
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
            Turned into loyal clients
          </div>
        </div>

        <div className="bg-card border border-line rounded-3xl p-5 sm:p-6 sp-card-shadow bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
              Protected Star Average
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
              4.94 ★
            </span>
          </div>
          <div className="text-2xl font-black text-white">
            Saved 0.53 Stars
          </div>
          <p className="text-[11px] text-slate-300 mt-1">
            Without Shield, rating would drop to <span className="text-rose-400 font-bold">4.41 ★</span>
          </p>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-line sp-card-shadow">
        <div className="flex items-center gap-1.5 p-1 bg-stage rounded-xl text-xs font-bold overflow-x-auto">
          {(["all", "new", "contacted", "resolved"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-lg capitalize transition-all cursor-pointer whitespace-nowrap ${
                filter === tab
                  ? "bg-slate-900 text-white dark:bg-emerald-600 shadow-xs font-bold"
                  : "text-mute hover:text-ink"
              }`}
            >
              {tab === "all" ? "All Interceptions" : tab}
              <span className="ml-1.5 text-[10px] font-mono py-0.5 px-1.5 rounded-full bg-card text-mute border border-line">
                {tab === "all"
                  ? feedbackList.length
                  : feedbackList.filter((f) => f.status === tab).length}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-mute">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            Google SMTP Alerts: <strong className="text-ink">Dispatched within 5s of 1-3★</strong>
          </span>
        </div>
      </div>

      {/* Grievance Feed */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-card rounded-3xl border border-line sp-card-shadow space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-ink">
            No grievances in this view
          </h3>
          <p className="text-xs text-mute max-w-md mx-auto">
            All intercepted customer feedback has been resolved. You can use &ldquo;Simulate Incoming Grievance&rdquo; above to test the automated alert pipeline.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => {
            const isEditing = editingNotesId === item.id;
            const isSaved = savedSuccessId === item.id;

            return (
              <div
                key={item.id}
                className={`bg-card rounded-3xl border transition-all p-5 sm:p-6 sp-card-shadow ${
                  item.status === "new"
                    ? "border-rose-500/40 bg-rose-500/5 ring-1 ring-rose-500/20"
                    : item.status === "contacted"
                    ? "border-amber-500/30"
                    : "border-line"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Customer & Rating Information */}
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-sm ${
                        item.rating <= 2
                          ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                          : "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {item.rating}★
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-extrabold text-ink text-base">{item.customerName}</h4>
                        <span
                          className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full ${
                            item.status === "new"
                              ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                              : item.status === "contacted"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          }`}
                        >
                          {item.status}
                        </span>
                        <span className="text-[11px] text-mute flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(item.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      {/* Contact details */}
                      <div className="flex items-center gap-4 text-xs text-mute mt-1.5 flex-wrap">
                        <a
                          href={`mailto:${item.customerEmail}`}
                          className="inline-flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        >
                          <Mail className="w-3 h-3" />
                          <span>{item.customerEmail}</span>
                        </a>
                        {item.customerPhone && (
                          <a
                            href={`tel:${item.customerPhone}`}
                            className="inline-flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{item.customerPhone}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action buttons & Status selector */}
                  <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFeedbackForEmail(item);
                        setTestEmailType("shield_alert");
                        setEmailResult(null);
                        setTestEmailModalOpen(true);
                      }}
                      className="tp-btn-light px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                      title="Send this exact grievance alert to your inbox"
                    >
                      <Send className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Email Alert</span>
                    </button>

                    <select
                      value={item.status}
                      onChange={(e) =>
                        handleStatusChange(item.id, e.target.value as FeedbackStatus)
                      }
                      className="text-xs font-bold bg-stage border border-line rounded-xl px-3 py-1.5 text-ink focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                      <option value="new">Mark New (Unread)</option>
                      <option value="contacted">Mark Contacted</option>
                      <option value="resolved">Mark Resolved</option>
                    </select>

                    {item.customerPhone && (
                      <a
                        href={`tel:${item.customerPhone}`}
                        className="tp-btn-dark px-3.5 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call Patient</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Intercepted Grievance Statement */}
                <div className="mt-4 pl-3.5 border-l-2 border-rose-500 bg-rose-500/5 rounded-r-2xl p-3.5 text-xs sm:text-sm leading-relaxed text-ink">
                  <p className="italic font-medium">
                    &ldquo;{item.grievanceText}&rdquo;
                  </p>
                </div>

                {/* Resolution Notes area */}
                <div className="mt-3.5 pt-3.5 border-t border-line">
                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        value={notesText}
                        onChange={(e) => setNotesText(e.target.value)}
                        placeholder="Record resolution notes (e.g. Spoke with patient, offered priority check-in, issued apology)..."
                        className="w-full text-xs p-3 rounded-xl border border-line bg-stage/50 text-ink focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        rows={2}
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingNotesId(null)}
                          className="text-xs text-mute hover:text-ink px-3 py-1 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveNotes(item.id)}
                          className="tp-btn-dark px-3.5 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Notes</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="text-mute">
                        <strong className="text-ink">Resolution Notes: </strong>
                        {item.resolutionNotes ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                            {item.resolutionNotes}
                          </span>
                        ) : (
                          <span className="italic text-mute/60">No notes recorded yet</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {isSaved && (
                          <span className="inline-flex items-center gap-1 text-emerald-500 font-bold text-xs">
                            <Check className="w-3.5 h-3.5" />
                            <span>Saved!</span>
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingNotesId(item.id);
                            setNotesText(item.resolutionNotes || "");
                          }}
                          className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                        >
                          {item.resolutionNotes ? "Edit Notes" : "+ Add Resolution Notes"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Test Email Dispatch Modal */}
      {testEmailModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-line rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl text-ink relative animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <button
              type="button"
              onClick={() => setTestEmailModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-mute hover:text-ink hover:bg-stage transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-ink">
                  Send Test Email to Inbox
                </h3>
                <p className="text-xs text-mute">
                  Test TrustPulse AI&apos;s Google SMTP responsive HTML templates live
                </p>
              </div>
            </div>

            <form onSubmit={handleSendTestEmail} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-mute mb-1.5 uppercase tracking-wider">
                  Select Email Template
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTestEmailType("shield_alert")}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      testEmailType === "shield_alert"
                        ? "border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold"
                        : "border-line bg-stage/50 text-mute hover:bg-stage"
                    }`}
                  >
                    🚨 Shield Alert
                    <span className="block text-[10px] font-normal text-mute mt-0.5">
                      Clinic director
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTestEmailType("customer_apology")}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      testEmailType === "customer_apology"
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold"
                        : "border-line bg-stage/50 text-mute hover:bg-stage"
                    }`}
                  >
                    💌 Patient Note
                    <span className="block text-[10px] font-normal text-mute mt-0.5">
                      Apology letter
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTestEmailType("weekly_digest")}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      testEmailType === "weekly_digest"
                        ? "border-sky-500 bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold"
                        : "border-line bg-stage/50 text-mute hover:bg-stage"
                    }`}
                  >
                    📊 Weekly Digest
                    <span className="block text-[10px] font-normal text-mute mt-0.5">
                      Performance
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-mute mb-1.5 uppercase tracking-wider">
                  Recipient Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. practice-owner@example.com"
                  value={testEmailAddress}
                  onChange={(e) => setTestEmailAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-line bg-stage/50 text-ink text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {selectedFeedbackForEmail && (
                <div className="p-3 rounded-2xl bg-stage border border-line text-xs">
                  <span className="font-bold text-ink block mb-0.5">
                    Using data from {selectedFeedbackForEmail.customerName}&apos;s grievance:
                  </span>
                  <p className="text-mute italic line-clamp-2">
                    &ldquo;{selectedFeedbackForEmail.grievanceText}&rdquo;
                  </p>
                </div>
              )}

              {emailResult && (
                <div
                  className={`p-3.5 rounded-2xl border text-xs leading-relaxed ${
                    emailResult.success
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                      : "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400"
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    {emailResult.success ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span>Email Dispatched Successfully!</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-rose-500" />
                        <span>Dispatch Error</span>
                      </>
                    )}
                  </div>
                  <p className="mt-1">{emailResult.note || emailResult.error}</p>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setTestEmailModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-mute hover:text-ink cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={sendingEmail || !testEmailAddress}
                  className="tp-btn-dark px-5 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {sendingEmail ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending Email...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Alert Now</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
