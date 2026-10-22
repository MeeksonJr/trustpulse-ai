import { NextResponse } from "next/server";
import { TrustPulseStore } from "@/lib/storage/trustpulse-store";
import { getServerSupabaseAdmin } from "@/lib/supabase/client";
import {
  sendEmailWithGoogleSmtp,
  getGoogleSmtpConfig,
} from "@/lib/email/google-smtp";
import {
  renderShieldAlertEmailHtml,
  renderCustomerApologyEmailHtml,
} from "@/lib/email/email-templates";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      workspaceId,
      campaignId,
      rating,
      customerName,
      customerEmail,
      customerPhone,
      grievanceText,
    } = body;

    if (!workspaceId || !rating || !customerName || !customerEmail || !grievanceText) {
      return NextResponse.json(
        { success: false, error: "Please fill out all required fields" },
        { status: 400 }
      );
    }

    // 1. Store feedback in repository
    const feedback = TrustPulseStore.addPrivateFeedback({
      workspaceId,
      campaignId,
      rating: Number(rating),
      customerName,
      customerEmail,
      customerPhone: customerPhone || "",
      grievanceText,
      status: "new",
    });

    // 1b. Sync to Supabase PostgreSQL table
    try {
      const supabase = getServerSupabaseAdmin();
      if (supabase) {
        await supabase.from("trustpulse_grievances").insert({
          id: feedback.id,
          workspace_id: workspaceId,
          campaign_id: campaignId || null,
          rating: Number(rating),
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone || "",
          grievance_text: grievanceText,
          status: "new",
          created_at: new Date().toISOString(),
        });
      }
    } catch (dbErr) {
      console.warn("[TrustPulse] Supabase grievance sync notice:", dbErr);
    }

    // 2. Fetch workspace details for brand styling
    const workspace =
      TrustPulseStore.getWorkspaceById(workspaceId) ||
      TrustPulseStore.getWorkspaceBySlug(workspaceId);
    const businessName = workspace ? workspace.name : "Apex Cosmetic Dentistry";
    const brandColor = workspace?.brandColor || "#059669";

    // 3. Dispatch Email Alert to Practice Management (async / non-blocking)
    const smtpConfig = getGoogleSmtpConfig();
    const managerEmail =
      smtpConfig?.user ||
      process.env.ADMIN_ALERT_EMAIL ||
      "clinic-director@apexdentalcare.com";

    let emailAlertSent = false;
    let emailApologySent = false;
    let emailNote = "";

    try {
      // Alert to Manager
      const alertHtml = renderShieldAlertEmailHtml({
        businessName,
        brandColor,
        rating: Number(rating),
        customerName,
        customerEmail,
        customerPhone: customerPhone || undefined,
        grievanceText,
        dashboardShieldUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://trustpulse-ai-phi.vercel.app"}/dashboard/shield`,
      });

      const alertResult = await sendEmailWithGoogleSmtp({
        to: managerEmail,
        subject: `🚨 [Shield Alert] ${rating}-Star Review Intercepted Privately: ${businessName}`,
        html: alertHtml,
        fromName: `TrustPulse AI — ${businessName}`,
      });
      emailAlertSent = alertResult.success;

      // Apology Letter to Customer
      if (customerEmail && customerEmail.includes("@")) {
        const apologyHtml = renderCustomerApologyEmailHtml({
          customerName,
          businessName,
          brandColor,
        });

        const apologyResult = await sendEmailWithGoogleSmtp({
          to: customerEmail,
          subject: `A Personal Note from the Director of ${businessName}`,
          html: apologyHtml,
          fromName: `${businessName} Leadership`,
        });
        emailApologySent = apologyResult.success;
      }

      emailNote = alertResult.simulated
        ? "Emails simulated (Set GOOGLE_SMTP_USER and GOOGLE_SMTP_APP_PASSWORD for live dispatch)"
        : `Live emails dispatched via Google SMTP to ${managerEmail} and ${customerEmail}`;
    } catch (mailErr) {
      console.error("[Shield Submit] Email dispatch error:", mailErr);
      emailNote = "Email dispatch encountered non-fatal error; feedback saved securely.";
    }

    return NextResponse.json({
      success: true,
      message: "Grievance received privately. Our management team has been alerted.",
      feedback,
      emailAlertSent,
      emailApologySent,
      emailNote,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Failed to record feedback";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
