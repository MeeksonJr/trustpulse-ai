"use client";

import React from "react";
import { Callout, LegalLayout, LegalSectionBlock } from "@/components/legal/LegalLayout";

const TERMS_SECTIONS = [
  { id: "acceptance", title: "1. Acceptance of Terms & Scope" },
  { id: "reselling", title: "2. Agency White-Label & Reselling License" },
  { id: "gatekeeper", title: "3. Review Funnels & FTC Compliance" },
  { id: "widgets", title: "4. Embed Script Usage & Cross-Origin SLA" },
  { id: "billing", title: "5. Stripe Subscriptions & Cancellation" },
  { id: "intellectual", title: "6. Intellectual Property & AI Content" },
  { id: "liability", title: "7. Disclaimers & Limitation of Liability" },
  { id: "governing", title: "8. Governing Law & Dispute Resolution" },
];

const PLANS = [
  ["Starter", "$19/mo"],
  ["Pro", "$49/mo"],
  ["Agency", "$129/mo"],
];

export default function TermsOfServicePage() {
  return (
    <LegalLayout
      eyebrow="Commercial Agency Licensing"
      title="Terms of Service"
      subtitle="The agreement that governs your use of TrustPulse AI funnels, widgets, PulseMind replies and the agency white-label hub."
      updated="Last updated: October 2026"
      badges={["Starter, Pro & Agency plans"]}
      sections={TERMS_SECTIONS}
    >
      <LegalSectionBlock id="acceptance" title="1. Acceptance of Terms & Scope">
        <p>
          By accessing or subscribing to TrustPulse AI, you agree to be bound by these Terms of Service. If you are an agency using TrustPulse AI on behalf of clients, you represent that you have full authorization to manage their reputation funnels.
        </p>
        <div className="grid grid-cols-3 gap-3">
          {PLANS.map(([n, p]) => (
            <div key={n} className="rounded-2xl border border-line bg-stage p-4 text-center">
              <div className="text-xs font-semibold uppercase tracking-wider text-mute">{n}</div>
              <div className="mt-1 text-xl font-extrabold tracking-[-0.03em] text-ink">{p}</div>
            </div>
          ))}
        </div>
      </LegalSectionBlock>

      <LegalSectionBlock id="reselling" title="2. Agency White-Label & Reselling License">
        <p>
          Subscribers to the Agency Plan ($129/mo) are granted a perpetual, royalty-free commercial license to resell TrustPulse reputation management, widgets, and monthly PDF reports to third-party clients under their own agency branding without attribution to TrustPulse AI.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="gatekeeper" title="3. Review Funnels & FTC Compliance">
        <p>
          TrustPulse AI provides feedback routing tools designed to ensure customer satisfaction. Merchants agree to treat private feedback in good faith and adhere to all FTC guidelines regarding authentic consumer sentiment and voluntary public endorsements.
        </p>
        <Callout tone="warn" title="Authentic reviews only">
          You may not use TrustPulse to fabricate reviews, offer prohibited incentives, or suppress customers&apos; ability to post public reviews on their own.
        </Callout>
      </LegalSectionBlock>

      <LegalSectionBlock id="widgets" title="4. Embed Script Usage & Cross-Origin SLA">
        <p>
          Our embed script endpoints (<code>/api/widget/script</code>) are served via edge CDN infrastructure with a targeted 99.9% uptime SLA. We maintain wildcard CORS headers so that your client websites load widgets without browser security warnings.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="billing" title="5. Stripe Subscriptions & Cancellation">
        <p>
          All billing is processed securely via Stripe. Subscriptions renew automatically on a monthly or annual cadence. You may cancel your subscription at any time via the Customer Portal without cancellation penalties.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="intellectual" title="6. Intellectual Property & AI Content">
        <p>
          You retain ownership of your reviews, branding and client data. TrustPulse retains ownership of the platform, widgets and software. Replies drafted by PulseMind™ are provided for you to review and publish; you are responsible for the content you post under your business name.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="liability" title="7. Disclaimers & Limitation of Liability">
        <p>
          The service is provided &ldquo;as is&rdquo;. We do not guarantee specific star ratings, rankings or revenue outcomes. To the maximum extent permitted by law, TrustPulse AI&apos;s aggregate liability is limited to the fees you paid in the twelve months before the claim.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="governing" title="8. Governing Law & Dispute Resolution">
        <p>
          These terms are governed by the laws of the State of Delaware, United States, without regard to conflict of law principles.
        </p>
      </LegalSectionBlock>
    </LegalLayout>
  );
}
