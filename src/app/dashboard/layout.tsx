import React from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const metadata = {
  title: "TrustPulse AI — Reputation & Social Proof Command Center",
  description:
    "Autonomous review management, Negative Review Shield gatekeeper, Google 5-star acceleration, and embeddable widgets.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
