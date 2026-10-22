const nodemailer = require("nodemailer");

async function testSmtp() {
  require("dotenv").config({ path: ".env.local" });
  const user = process.env.GOOGLE_SMTP_USER || "d.mohamed1504@gmail.com";
  const pass = (process.env.GOOGLE_SMTP_APP_PASSWORD || "").replace(/\s+/g, "");

  if (!pass) {
    console.error("❌ Error: GOOGLE_SMTP_APP_PASSWORD not set in environment or .env.local");
    return;
  }

  console.log("Testing SMTP connection with account:", user);
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  try {
    await transporter.verify();
    console.log("✅ Google SMTP transporter verified successfully!");

    const info = await transporter.sendMail({
      from: `"TrustPulse AI Reputation Shield" <${user}>`,
      to: user,
      subject: "🛡️ TrustPulse AI — Live Google SMTP Relay Active",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 32px; background: #0f172a; color: #f8fafc; border-radius: 20px; max-width: 540px; margin: 0 auto; border: 1px solid rgba(16, 185, 129, 0.3);">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
            <div style="width: 36px; height: 36px; border-radius: 10px; background: #10b981; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; color: #fff; font-size: 18px; text-align: center; line-height: 36px;">TP</div>
            <span style="font-size: 16px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em;">TrustPulse AI</span>
          </div>
          <h2 style="color: #34d399; margin: 0 0 12px 0; font-size: 20px; font-weight: 700;">Google SMTP Relay Active &amp; Verified</h2>
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
            Your automated Google SMTP relay (<strong>${user}</strong>) has been verified. The Negative Review Shield™ and executive reputation reports will now be delivered with 100% inbox deliverability.
          </p>
          <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 16px; margin-bottom: 24px;">
            <div style="font-size: 11px; font-family: monospace; color: #94a3b8; text-transform: uppercase; margin-bottom: 6px;">Pipeline Status</div>
            <div style="color: #34d399; font-weight: 600; font-size: 13px;">✓ Google SMTP SSL Port 465 (Operational)</div>
            <div style="color: #34d399; font-weight: 600; font-size: 13px;">✓ 1-3★ Grievance Immediate Intercept Alert</div>
            <div style="color: #34d399; font-weight: 600; font-size: 13px;">✓ Patient Retention Apology Auto-Responder</div>
          </div>
          <p style="color: #64748b; font-size: 11px; margin: 0;">
            TrustPulse AI — Autonomous Reputation &amp; Review Shield Infrastructure
          </p>
        </div>
      `,
    });
    console.log("✅ Live test email dispatched to d.mohamed1504@gmail.com! Message ID:", info.messageId);
  } catch (err) {
    console.error("❌ SMTP Error:", err);
  }
}

testSmtp();
