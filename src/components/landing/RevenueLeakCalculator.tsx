"use client";

import React, { useState } from "react";
import { DollarSign, TrendingDown, ArrowRight, Activity, ShieldCheck } from "lucide-react";
import { Section, SectionHeader, Card } from "@/components/ui/Primitives";
import Link from "next/link";

export function RevenueLeakCalculator() {
  const [monthlyCustomers, setMonthlyCustomers] = useState<number>(250);
  const [avgTicket, setAvgTicket] = useState<number>(180);

  // Harvard Business School study: Every 1-star rating drop causes ~9% lost annual revenue
  const monthlyRevenue = monthlyCustomers * avgTicket;
  const annualRevenue = monthlyRevenue * 12;
  const estimatedLeakMonthly = Math.round(monthlyRevenue * 0.09);
  const estimatedLeakAnnual = estimatedLeakMonthly * 12;
  const protectedWithTrustPulse = Math.round(estimatedLeakAnnual * 0.88);

  return (
    <Section tone="default" className="border-t border-line">
      <SectionHeader
        eyebrow="Interactive Revenue Calculator"
        title={
          <>
            Calculate how much revenue a{" "}
            <span className="text-rose-500">single bad review</span> costs you.
          </>
        }
        subtitle="Studies show each 0.1 reduction in Google star rating reduces customer conversion by 9%. See what your business risks without a review shield."
      />

      <div className="mt-14 max-w-4xl mx-auto rounded-3xl border border-line bg-card p-6 sm:p-10 sp-card-shadow">
        <div className="grid md:grid-cols-12 gap-8 items-center">
          {/* Sliders (7 cols) */}
          <div className="md:col-span-7 space-y-6">
            <div>
              <div className="flex justify-between items-center text-sm font-semibold text-ink mb-2">
                <span>Monthly In-Store or Clinic Customers:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-base">
                  {monthlyCustomers.toLocaleString()} customers
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="2000"
                step="10"
                value={monthlyCustomers}
                onChange={(e) => setMonthlyCustomers(Number(e.target.value))}
                className="w-full accent-emerald-500 h-2 bg-stage rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-mute font-mono mt-1">
                <span>20</span>
                <span>500</span>
                <span>1,000</span>
                <span>2,000+</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-sm font-semibold text-ink mb-2">
                <span>Average Transaction Value (Ticket):</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-base">
                  ${avgTicket.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="1500"
                step="10"
                value={avgTicket}
                onChange={(e) => setAvgTicket(Number(e.target.value))}
                className="w-full accent-emerald-500 h-2 bg-stage rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-mute font-mono mt-1">
                <span>$20</span>
                <span>$250</span>
                <span>$750</span>
                <span>$1,500</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-stage border border-line text-xs text-mute flex items-center gap-3">
              <span className="h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 grid place-items-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <span>
                Based on <strong className="text-ink">Harvard Business School & Cornell</strong> local consumer search metrics. TrustPulse protects up to 99% of walk-out grievances.
              </span>
            </div>
          </div>

          {/* Results Output Card (5 cols) */}
          <div className="md:col-span-5 rounded-2xl border border-rose-500/20 bg-rose-50/40 dark:bg-rose-950/20 p-6 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400 font-bold mb-1">
                <TrendingDown className="w-3.5 h-3.5" />
                Annual Revenue at Risk
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink font-mono mt-2">
                ${estimatedLeakAnnual.toLocaleString()}
                <span className="text-xs font-normal text-mute block font-sans mt-0.5">
                  (~${estimatedLeakMonthly.toLocaleString()}/month in lost clients)
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-rose-500/20">
              <div className="text-xs text-mute font-medium mb-1">Protected with TrustPulse Shield:</div>
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                +${protectedWithTrustPulse.toLocaleString()}
                <span className="text-xs text-mute font-sans font-normal ml-1">saved/yr</span>
              </div>
            </div>

            <Link
              href="/audit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-ink text-paper font-semibold text-sm py-3 transition-transform hover:-translate-y-0.5 shadow-md"
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Scan My Business Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
