export interface PricingPlan {
  id: "starter" | "pro" | "agency";
  name: string;
  badge?: string;
  tagline: string;
  monthlyPrice: number;
  annualPricePerMonth: number;
  annualTotal: number;
  monthlyPriceId: string;
  annualPriceId: string;
  monthlyPaymentLink: string;
  annualPaymentLink: string;
  locationsOrWorkspaces?: string;
  auditsPerMonth?: string;
  highlighted?: boolean;
  features: string[];
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Essential review funnel & social proof toasts for a single location or store.",
    monthlyPrice: 0,
    annualPricePerMonth: 0,
    annualTotal: 0,
    monthlyPriceId: "",
    annualPriceId: "",
    monthlyPaymentLink: "/signup?plan=starter",
    annualPaymentLink: "/signup?plan=starter",
    locationsOrWorkspaces: "1 Location",
    auditsPerMonth: "1 Location Workspace",
    features: [
      "1 Active Business Location",
      "Smart QR Star Gatekeeper (/r/[slug])",
      "Negative Review Shield (1-3★ routing)",
      "Up to 25 Verified Customer Reviews",
      "Floating Toast & Badge Social Proof Widgets",
      "Manual AI Reply Drafts (10/mo)",
      "Standard Email Notifications",
    ],
  },
  {
    id: "pro",
    name: "Professional",
    badge: "Most Popular",
    tagline: "Full Google Maps sync, unlimited reviews, and automated PulseMind™ AI replies.",
    monthlyPrice: 29,
    annualPricePerMonth: 23,
    annualTotal: 276,
    monthlyPriceId:
      process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID ||
      "price_1UT5vaFZKCl4K7QEY7LlKX4v",
    annualPriceId:
      process.env.NEXT_PUBLIC_STRIPE_PRO_ANNUAL_PRICE_ID ||
      "price_1UT5vgFZKCl4K7QEF7p1hCNn",
    monthlyPaymentLink:
      process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_LINK ||
      "https://buy.stripe.com/4gM28reqk2tFaj7ctH9k400",
    annualPaymentLink:
      process.env.NEXT_PUBLIC_STRIPE_PRO_ANNUAL_LINK ||
      "https://buy.stripe.com/7sYdR96XS2tF2QF2T79k401",
    locationsOrWorkspaces: "3 Locations",
    auditsPerMonth: "3 Location Workspaces",
    highlighted: true,
    features: [
      "3 Active Business Locations",
      "Unlimited 5-Star Reviews & Funnels",
      "Live Google Maps Intelligence & Auto-Sync",
      "PulseMind™ AI Auto-Responder (Unlimited)",
      "Printable QR Stand Studio (Print Ready PDF)",
      "Private Grievance Inbox with Resolution Log",
      "All Embed Widgets (Wall of Love, Toasts, Badges)",
      "Priority Email & Live Chat Support",
    ],
  },
  {
    id: "agency",
    name: "Agency White-Label",
    badge: "Unlimited + CRM",
    tagline: "Turnkey agency engine to manage unlimited clients with custom branding & domains.",
    monthlyPrice: 79,
    annualPricePerMonth: 63,
    annualTotal: 756,
    monthlyPriceId:
      process.env.NEXT_PUBLIC_STRIPE_AGENCY_MONTHLY_PRICE_ID ||
      "price_1UT5vnFZKCl4K7QE3bSWBV22",
    annualPriceId:
      process.env.NEXT_PUBLIC_STRIPE_AGENCY_ANNUAL_PRICE_ID ||
      "price_1UT5vpFZKCl4K7QEBvJ79Uju",
    monthlyPaymentLink:
      process.env.NEXT_PUBLIC_STRIPE_AGENCY_MONTHLY_LINK ||
      "https://buy.stripe.com/3cI6oH3LG6JVdvj2T79k402",
    annualPaymentLink:
      process.env.NEXT_PUBLIC_STRIPE_AGENCY_ANNUAL_LINK ||
      "https://buy.stripe.com/aFafZh81Wb0bezn1P39k403",
    locationsOrWorkspaces: "Unlimited Workspaces",
    auditsPerMonth: "Unlimited Workspaces",
    features: [
      "Unlimited Client Workspaces",
      "100% White-Label: Your Domain, Logo & Brand",
      "Instant Client Google Maps Onboarding (2s)",
      "Client-Facing Login Portals & PDF Reports",
      "Priority CDN Edge Embed SLA (99.9%)",
      "Direct Google SMTP Notification Relays",
      "Dedicated Agency Strategy & Onboarding",
    ],
  },
];
