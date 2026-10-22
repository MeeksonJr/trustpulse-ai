"use client";

import React, { useState } from "react";
import { Building2, TrendingUp, DollarSign, CheckCircle2, ArrowRight } from "lucide-react";
import { Section, SectionHeader, Card } from "@/components/ui/Primitives";
import Link from "next/link";

export function AgencyRoiSection() {
  const [clients, setClients] = useState<number>(12);
  const [retainerFee, setRetainerFee] = useState<number>(199);

  const mrr = clients * retainerFee;
  const arr = mrr * 12;
  const platformCost = 79 * 12; // Agency plan cost
  const netProfit = arr - platformCost;

  return (
    <Section id="roi" tone="stage" className="border-t border-line">
      <SectionHeader
        eyebrow="Agency White-Label ROI"
        title="Charge $199–$499/mo per client on 98% margins."
        subtitle="Manage all your client dental clinics, law firms, and restaurants from one white-labeled dashboard. Zero hosting costs for you."
      />

      <div className="mt-14 max-w-4xl mx-auto rounded-3xl border border-line bg-card p-6 sm:p-10 sp-card-shadow">
        <div className="grid md:grid-cols-12 gap-8 items-center">
          {/* Sliders (7 cols) */}
          <div className="md:col-span-7 space-y-6">
            <div>
              <div className="flex justify-between items-center text-sm font-semibold text-ink mb-2">
                <span>Active Local Business Clients:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-base">
                  {clients} clients
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="50"
                step="1"
                value={clients}
                onChange={(e) => setClients(Number(e.target.value))}
                className="w-full accent-emerald-500 h-2 bg-stage rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-mute font-mono mt-1">
                <span>2</span>
                <span>15</span>
                <span>30</span>
                <span>50+</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-sm font-semibold text-ink mb-2">
                <span>Monthly Retainer Charged per Client:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-base">
                  ${retainerFee}/mo
                </span>
              </div>
              <input
                type="range"
                min="99"
                max="500"
                step="10"
                value={retainerFee}
                onChange={(e) => setRetainerFee(Number(e.target.value))}
                className="w-full accent-emerald-500 h-2 bg-stage rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-mute font-mono mt-1">
                <span>$99/mo</span>
                <span>$199/mo</span>
                <span>$349/mo</span>
                <span>$500/mo</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              {[
                "Unlimited client workspaces under your custom agency brand",
                "Automated Google Maps onboarding: extracts full client profile in 2 seconds",
                "Zero per-seat or per-review costs—your cost stays flat at $79/mo",
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-mute font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Card (5 cols) */}
          <div className="md:col-span-5 rounded-2xl border border-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-950/20 p-6 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold mb-1">
                <TrendingUp className="w-3.5 h-3.5" />
                Projected Agency Retainer MRR
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink font-mono mt-2">
                ${mrr.toLocaleString()}
                <span className="text-xs font-normal text-mute block font-sans mt-0.5">
                  /month recurring agency retainer
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-emerald-500/20 space-y-2 text-xs">
              <div className="flex justify-between text-mute">
                <span>Annual Gross Revenue:</span>
                <span className="font-mono font-bold text-ink">${arr.toLocaleString()}/yr</span>
              </div>
              <div className="flex justify-between text-mute">
                <span>TrustPulse Agency Cost:</span>
                <span className="font-mono font-bold text-ink">-$948/yr</span>
              </div>
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold pt-1 border-t border-emerald-500/10">
                <span>Net Annual Agency Profit:</span>
                <span className="font-mono text-sm">+${netProfit.toLocaleString()}/yr</span>
              </div>
            </div>

            <Link
              href="/dashboard/agency"
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm py-3 transition-transform hover:-translate-y-0.5 shadow-md"
            >
              <Building2 className="w-4 h-4" />
              <span>Open Agency Command Hub</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
