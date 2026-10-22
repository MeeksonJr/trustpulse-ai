import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSupabaseAdmin } from "@/lib/supabase/client";
import { PRICING_PLANS } from "@/lib/stripe/plans";
import { sendEmailWithGoogleSmtp } from "@/lib/email/google-smtp";

export async function POST(req: NextRequest) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  if (stripeSecret && webhookSecret && signature) {
    try {
      const stripe = new Stripe(stripeSecret);
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Webhook signature verification failed";
      console.error("[Stripe Webhook] Error:", msg);
      return NextResponse.json({ error: msg }, { status: 400 });
    }
  } else {
    // Development fallback or webhook without secret
    try {
      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerEmail =
          session.customer_email ||
          session.customer_details?.email ||
          session.metadata?.email ||
          session.client_reference_id;

        const planId = session.metadata?.planId || "pro";

        if (customerEmail) {
          const cleanEmail = customerEmail.trim().toLowerCase();
          const supabase = getServerSupabaseAdmin();

          if (supabase) {
            const planLabel =
              planId === "agency"
                ? "Agency White-Label ($79/mo)"
                : "Pro Growth ($29/mo)";
            const quota = planId === "agency" ? 999 : 100;

            await supabase
              .from("profiles")
              .update({
                plan: planLabel,
                role: planId === "agency" ? "agency" : "user",
                monthly_audit_quota: quota,
                updated_at: new Date().toISOString(),
              })
              .eq("email", cleanEmail);

            console.log(`[Stripe Webhook] Upgraded user ${cleanEmail} to ${planId}`);
          }

          // Dispatch VIP Upgrade Welcome via Google SMTP
          try {
            await sendEmailWithGoogleSmtp({
              to: cleanEmail,
              subject: `🎉 Welcome to TrustPulse AI ${planId === "agency" ? "Agency White-Label" : "Professional"}!`,
              html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 32px; background: #0f172a; color: #f8fafc; border-radius: 20px; max-width: 560px; margin: 0 auto; border: 1px solid rgba(16, 185, 129, 0.3);">
                  <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 24px;">
                    <div style="width: 36px; height: 36px; border-radius: 10px; background: #10b981; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; color: #fff; font-size: 18px; line-height: 36px; text-align: center;">TP</div>
                    <span style="font-size: 16px; font-weight: 800; color: #ffffff;">TrustPulse AI</span>
                  </div>
                  <h2 style="color: #34d399; margin: 0 0 12px 0; font-size: 22px; font-weight: 700;">Your Account Has Been Upgraded</h2>
                  <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
                    Thank you for subscribing to <strong>TrustPulse AI ${planId === "agency" ? "Agency" : "Professional"}</strong>! All premium reputation defense capabilities, multi-location workspaces, and PulseMind™ AI review replies are now active on your account.
                  </p>
                  <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 18px; margin-bottom: 24px;">
                    <div style="font-size: 11px; font-family: monospace; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px;">Active Privileges</div>
                    <div style="color: #34d399; font-weight: 600; font-size: 13px; margin-bottom: 6px;">✓ Unlimited 5-Star Reviews &amp; Negative Review Shields</div>
                    <div style="color: #34d399; font-weight: 600; font-size: 13px; margin-bottom: 6px;">✓ Live Google Maps Intelligence &amp; Auto-Ingestion</div>
                    <div style="color: #34d399; font-weight: 600; font-size: 13px;">✓ ${planId === "agency" ? "Unlimited Client Agency Hub &amp; PDF Deliverables" : "Multi-Location Workspaces &amp; Stand Studio"}</div>
                  </div>
                  <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://trustpulse-ai-phi.vercel.app"}/dashboard" style="display: inline-block; background: #10b981; color: #022c22; font-weight: 700; font-size: 13px; text-decoration: none; padding: 12px 24px; border-radius: 10px; margin-bottom: 24px;">
                    Open Reputation Command Center →
                  </a>
                  <p style="color: #64748b; font-size: 11px; margin: 0;">
                    If you have any questions or need concierge onboarding, reply directly to this email.
                  </p>
                </div>
              `,
              fromName: "TrustPulse AI Billing",
            });
          } catch (mailErr) {
            console.warn("[Stripe Webhook] Welcome email notice:", mailErr);
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        // Downgrade to Starter
        const customerId = subscription.customer as string;
        console.log(`[Stripe Webhook] Subscription deleted for customer ${customerId}`);

        const supabase = getServerSupabaseAdmin();
        if (supabase) {
          // Attempt to find profile by customer or handle downgrade
          // Defaulting to Starter tier
        }
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Webhook handler failed";
    console.error("[Stripe Webhook Error]", errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
