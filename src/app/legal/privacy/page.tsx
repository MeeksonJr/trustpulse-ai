"use client";

import React from "react";
import { Callout, LegalLayout, LegalSectionBlock } from "@/components/legal/LegalLayout";

const PRIVACY_SECTIONS = [
  { id: "overview", title: "1. Executive Privacy Summary" },
  { id: "shield-privacy", title: "2. Negative Review Shield Confidentiality" },
  { id: "collection", title: "3. Information & Review Data Collected" },
  { id: "ai-policy", title: "4. PulseMind™ AI Zero-Retention Policy" },
  { id: "subprocessors", title: "5. Authorized Subprocessors & Infrastructure" },
  { id: "retention", title: "6. Data Retention & Deletion Protocols" },
  { id: "gdpr-ccpa", title: "7. GDPR, UK-GDPR & CCPA Subject Rights" },
  { id: "cookies", title: "8. Cookies, LocalStorage & Embed Scripts" },
  { id: "contact", title: "9. Data Protection Officer (DPO) & Contact" },
];

const SUBPROCESSORS = [
  {
    name: "Supabase (PostgreSQL + RLS)",
    purpose: "Encrypted relational storage for customer reviews, private grievances & agency workspaces",
    location: "United States (AWS us-east-1)",
    compliance: "SOC2 Type II, HIPAA & GDPR DPA",
  },
  {
    name: "Stripe, Inc.",
    purpose: "Subscription billing, checkout sessions, customer portal & invoice processing",
    location: "United States / Global Edge",
    compliance: "PCI-DSS Level 1 Certified",
  },
  {
    name: "Vercel Inc.",
    purpose: "Edge serverless application hosting, TLS termination & global CDN widget delivery",
    location: "Global Edge Network (US Primary)",
    compliance: "SOC2 Type II & ISO 27001",
  },
  {
    name: "PulseMind™ Neural Processing Cluster",
    purpose: "Zero-retention sentiment analysis and response generation for customer reviews",
    location: "United States (Encrypted TLS 1.3)",
    compliance: "Enterprise AI Security & SOC2 Compliant",
  },
];

const RIGHTS = [
  ["Access", "Request a copy of the personal data we hold about you."],
  ["Rectification", "Correct inaccurate or incomplete account or feedback data."],
  ["Erasure", "Ask us to delete your data (\"right to be forgotten\")."],
  ["Portability", "Export your reviews and workspace data in a machine-readable format."],
  ["Opt-out of sale", "We do not sell personal data, so there is nothing to opt out of under CCPA."],
  ["Objection", "Object to or restrict processing based on legitimate interests."],
];

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      eyebrow="GDPR & CCPA Compliant"
      title="Privacy Policy & Data Protection"
      subtitle="Plain-language rules for how TrustPulse AI collects, protects and deletes review data across funnels, widgets and agency workspaces."
      updated="Last updated: October 2026"
      badges={["Effective for all accounts, widgets & review funnels", "We never sell data"]}
      sections={PRIVACY_SECTIONS}
    >
      <LegalSectionBlock id="overview" title="1. Executive Privacy Summary">
        <p>
          TrustPulse AI operates an autonomous social proof, multi-source review aggregator, and negative review shield platform. We prioritize end-user privacy, merchant confidentiality, and full transparency. We do not sell personal data, nor do we train public AI models on private customer complaints.
        </p>
        <Callout title="The short version">
          Private feedback stays private, AI replies are processed ephemerally, and you can export or delete your data at any time.
        </Callout>
      </LegalSectionBlock>

      <LegalSectionBlock id="shield-privacy" title="2. Negative Review Shield Confidentiality">
        <p>
          When a consumer submits a 1 to 3 star grievance through our smart review funnel (<code>/r/[slug]</code>), this information is classified as <strong>Confidential Private Feedback</strong>. It is never broadcast publicly, never indexed in search engines, and delivered exclusively to authorized business administrators for customer resolution.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="collection" title="3. Information & Review Data Collected">
        <p>
          We collect account registration credentials (name, email), public Google Places / Trustpilot review attribution data (reviewer name, star rating, published text), and consumer resolution details (customer email, phone number provided voluntarily for de-escalation).
        </p>
        <ul>
          <li><strong>Account data:</strong> name, work email, plan selection.</li>
          <li><strong>Public review data:</strong> reviewer name, rating and text from Google Places and Trustpilot.</li>
          <li><strong>Private feedback:</strong> grievance text and optional contact details a customer chooses to share.</li>
          <li><strong>Business data:</strong> locations imported via Google Maps auto-onboarding and QR stand settings.</li>
        </ul>
      </LegalSectionBlock>

      <LegalSectionBlock id="ai-policy" title="4. PulseMind™ AI Zero-Retention Policy">
        <p>
          Our AI auto-responder utilizes dedicated PulseMind™ Neural Engine processing endpoints. Review text submitted for reply synthesis is processed ephemerally and is not retained or utilized to train general foundation models, conforming to enterprise data boundary agreements.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="subprocessors" title="5. Authorized Subprocessors & Infrastructure">
        <div className="grid gap-3 sm:grid-cols-2">
          {SUBPROCESSORS.map((sub) => (
            <div key={sub.name} className="rounded-2xl border border-line bg-stage p-4">
              <div className="font-bold text-ink">{sub.name}</div>
              <p className="mt-1 text-sm">{sub.purpose}</p>
              <div className="mt-3 text-xs">{sub.location}</div>
              <div className="mt-2 inline-flex rounded-full bg-emerald-500/10 px-2.5 py-1 text-[0.7rem] font-semibold text-emerald-600 dark:text-emerald-400">
                {sub.compliance}
              </div>
            </div>
          ))}
        </div>
      </LegalSectionBlock>

      <LegalSectionBlock id="retention" title="6. Data Retention & Deletion Protocols">
        <p>
          We retain workspace data for as long as your account is active. When you delete a workspace or client location, associated reviews, private grievances and widget configuration are removed from production systems, and from backups on their normal rotation cycle.
        </p>
        <Callout title="Deletion on request">
          Email the address in section 9 and we will confirm deletion of your account data within 30 days.
        </Callout>
      </LegalSectionBlock>

      <LegalSectionBlock id="gdpr-ccpa" title="7. GDPR, UK-GDPR & CCPA Subject Rights">
        <p>Depending on where you live, you have the following rights over your personal data:</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {RIGHTS.map(([t, d]) => (
            <div key={t} className="rounded-2xl border border-line bg-stage p-4">
              <div className="font-bold text-ink">{t}</div>
              <p className="mt-1 text-sm">{d}</p>
            </div>
          ))}
        </div>
      </LegalSectionBlock>

      <LegalSectionBlock id="cookies" title="8. Cookies, LocalStorage & Embed Scripts">
        <p>
          The dashboard uses essential session storage and LocalStorage to keep you signed in and remember your theme. Our embed script (<code>/api/widget/script</code>) is self-contained: it sets no tracking cookies and loads no third-party analytics on your clients&apos; websites.
        </p>
      </LegalSectionBlock>

      <LegalSectionBlock id="contact" title="9. Data Protection Officer (DPO) & Contact">
        <p>For GDPR data subject requests (DSAR), deletion mandates, or agency subprocessor agreements, please contact:</p>
        <div className="break-words rounded-2xl border border-line bg-stage p-4 font-mono text-xs text-ink">
          privacy@trustpulse-ai.vercel.app • Attention: Data Protection Officer
        </div>
      </LegalSectionBlock>
    </LegalLayout>
  );
}
