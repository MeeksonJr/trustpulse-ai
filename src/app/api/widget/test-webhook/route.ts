import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { webhookUrl } = await req.json();

    if (!webhookUrl || typeof webhookUrl !== "string" || !/^https?:\/\//i.test(webhookUrl)) {
      return NextResponse.json(
        { error: "Invalid webhook URL. Must start with http:// or https://" },
        { status: 400 }
      );
    }

    const isDiscord = /discord(?:app)?\.com\/api\/webhooks/i.test(webhookUrl);
    const isSlack = /hooks\.slack\.com/i.test(webhookUrl);

    let payload: Record<string, unknown>;

    if (isDiscord) {
      payload = {
        username: "TrustPulse AI Reputation Engine",
        avatar_url: "https://trustpulse-ai-phi.vercel.app/favicon.ico",
        embeds: [
          {
            title: "🎯 New Inbound Reputation Lead Captured!",
            description: "A high-intent business prospect just audited their reputation via your embedded TrustPulse widget.",
            color: 0x10b981, // Emerald accent
            fields: [
              { name: "Prospect Name", value: "Marcus Vance", inline: true },
              { name: "Work Email", value: "marcus@luminahealth.co", inline: true },
              { name: "Audited Business", value: "Lumina Health & Wellness", inline: false },
              { name: "Current Rating", value: "3.8★ (Harvard benchmark leak: $24,800/yr)", inline: true },
              { name: "Est. Reputation Retainer", value: "$1,500/mo", inline: true },
            ],
            footer: {
              text: "TrustPulse AI Dispatcher • Discord Webhook Active",
            },
            timestamp: new Date().toISOString(),
          },
        ],
      };
    } else if (isSlack) {
      payload = {
        text: "🎯 *New Inbound Reputation Lead Captured!*\n*Prospect:* Marcus Vance (marcus@luminahealth.co)\n*Business:* Lumina Health & Wellness\n*Rating:* 3.8★\n*Estimated Retainer:* $1,500/mo",
      };
    } else {
      // Generic Webhook payload (Zapier, Make, HubSpot, webhook.site)
      payload = {
        event: "lead.created",
        timestamp: new Date().toISOString(),
        lead: {
          id: `lead-test-${Date.now()}`,
          name: "Marcus Vance",
          email: "marcus@luminahealth.co",
          websiteUrl: "https://luminahealth.co",
          businessName: "Lumina Health & Wellness",
          rating: 3.8,
          status: "New",
          estimatedPipelineValue: 1500,
        },
        source: "trustpulse-lead-widget",
      };
    }

    const start = Date.now();
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const latencyMs = Date.now() - start;

    if (!res.ok && res.status !== 204) {
      return NextResponse.json(
        {
          error: `Webhook destination returned HTTP ${res.status}: ${res.statusText}`,
          status: res.status,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      latencyMs,
      provider: isDiscord ? "Discord" : isSlack ? "Slack" : "Custom Webhook / Zapier",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to dispatch webhook";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
