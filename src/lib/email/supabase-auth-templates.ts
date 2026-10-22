/**
 * TrustPulse AI — Branded Supabase Auth Email Templates
 *
 * Copy and paste these HTML snippets directly into:
 * Supabase Dashboard -> Authentication -> Email Templates
 *
 * Available Supabase Variables:
 * {{ .ConfirmationURL }} - The direct action URL
 * {{ .Token }}           - 6-digit verification code
 * {{ .Email }}           - Recipient email address
 * {{ .SiteURL }}         - Base application URL
 */

export const SUPABASE_CONFIRM_SIGNUP_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Your TrustPulse AI Account</title>
</head>
<body style="margin: 0; padding: 0; background-color: #090d16; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #090d16; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 560px; background-color: #0f172a; border-radius: 24px; overflow: hidden; border: 1px solid rgba(16, 185, 129, 0.25); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
          
          <!-- Top Accent Bar -->
          <tr>
            <td style="background: linear-gradient(90deg, #059669, #10b981, #34d399); height: 5px; line-height: 5px; font-size: 5px;">&nbsp;</td>
          </tr>

          <!-- Header & Brand Logo -->
          <tr>
            <td style="padding: 36px 36px 20px 36px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <div style="display: inline-flex; align-items: center; gap: 10px;">
                      <div style="width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, #059669, #10b981); display: inline-block; text-align: center; line-height: 40px; font-weight: 900; color: #ffffff; font-size: 19px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
                        TP
                      </div>
                      <span style="font-size: 18px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em; vertical-align: middle; margin-left: 8px;">
                        TrustPulse<span style="color: #34d399;">.ai</span>
                      </span>
                    </div>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; background-color: rgba(16, 185, 129, 0.12); color: #34d399; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; padding: 5px 12px; border-radius: 20px; border: 1px solid rgba(16, 185, 129, 0.3);">
                      Account Verification
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 10px 36px 36px 36px;">
              <h1 style="margin: 0 0 14px 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.3;">
                Verify your email address
              </h1>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #94a3b8;">
                Welcome to <strong>TrustPulse AI</strong>. Please confirm your email address (<strong style="color: #f1f5f9;">{{ .Email }}</strong>) to activate your reputation command center, negative review shield, and live embed widgets.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 28px 0;">
                <tr>
                  <td align="center">
                    <a href="{{ .ConfirmationURL }}" target="_blank" style="display: inline-block; width: 100%; box-sizing: border-box; text-align: center; background: linear-gradient(180deg, #10b981, #059669); color: #ffffff; font-size: 15px; font-weight: 700; text-decoration: none; padding: 15px 32px; border-radius: 14px; box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.4); border: 1px solid rgba(255, 255, 255, 0.15);">
                      Verify Email &amp; Launch Dashboard &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- What's included preview -->
              <div style="background-color: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 18px; margin: 24px 0;">
                <span style="font-size: 11px; font-family: ui-monospace, Menlo, Monaco, monospace; text-transform: uppercase; color: #64748b; letter-spacing: 0.8px; font-weight: 700; display: block; margin-bottom: 8px;">
                  Activated on your account:
                </span>
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-size: 13px; color: #cbd5e1; padding: 4px 0;">
                      <span style="color: #34d399; font-weight: bold; margin-right: 6px;">&#10003;</span> Smart QR Review Funnel (/r/[slug])
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size: 13px; color: #cbd5e1; padding: 4px 0;">
                      <span style="color: #34d399; font-weight: bold; margin-right: 6px;">&#10003;</span> Negative Review Shield™ (1&ndash;3&star; routing)
                    </td>
                  </tr>
                  <tr>
                    <td style="font-size: 13px; color: #cbd5e1; padding: 4px 0;">
                      <span style="color: #34d399; font-weight: bold; margin-right: 6px;">&#10003;</span> PulseMind&trade; AI Review Auto-Responder
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Fallback Plain Text Link -->
              <p style="margin: 24px 0 8px 0; font-size: 12px; color: #64748b; line-height: 1.5;">
                Button not working? Copy and paste this URL into your browser:
              </p>
              <div style="background-color: #020617; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 12px; font-size: 11px; font-family: ui-monospace, Menlo, Monaco, monospace; color: #94a3b8; word-break: break-all;">
                {{ .ConfirmationURL }}
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #020617; padding: 24px 36px; border-top: 1px solid rgba(255, 255, 255, 0.06); text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #475569;">
                This link expires in 24 hours. If you did not create this account, you can safely ignore this email.
              </p>
              <p style="margin: 0; font-size: 11px; color: #334155;">
                &copy; 2026 TrustPulse AI &bull; Autonomous B2B Reputation Defense Infrastructure
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

export const SUPABASE_MAGIC_LINK_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Magic Sign-In Link</title>
</head>
<body style="margin: 0; padding: 0; background-color: #090d16; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #090d16; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 560px; background-color: #0f172a; border-radius: 24px; overflow: hidden; border: 1px solid rgba(16, 185, 129, 0.25); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
          <tr>
            <td style="background: linear-gradient(90deg, #059669, #10b981, #34d399); height: 5px; line-height: 5px; font-size: 5px;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding: 36px 36px 20px 36px;">
              <div style="display: inline-flex; align-items: center; gap: 10px;">
                <div style="width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, #059669, #10b981); display: inline-block; text-align: center; line-height: 40px; font-weight: 900; color: #ffffff; font-size: 19px;">
                  TP
                </div>
                <span style="font-size: 18px; font-weight: 800; color: #ffffff; vertical-align: middle; margin-left: 8px;">
                  TrustPulse<span style="color: #34d399;">.ai</span>
                </span>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 36px 36px 36px;">
              <h1 style="margin: 0 0 14px 0; color: #ffffff; font-size: 24px; font-weight: 800;">
                Your Instant Login Link
              </h1>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #94a3b8;">
                Click below to sign in securely to your <strong>TrustPulse AI</strong> dashboard. No password required.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 28px 0;">
                <tr>
                  <td align="center">
                    <a href="{{ .ConfirmationURL }}" target="_blank" style="display: inline-block; width: 100%; box-sizing: border-box; text-align: center; background: linear-gradient(180deg, #10b981, #059669); color: #ffffff; font-size: 15px; font-weight: 700; text-decoration: none; padding: 15px 32px; border-radius: 14px; box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.4);">
                      Sign In to TrustPulse AI &rarr;
                    </a>
                  </td>
                </tr>
              </table>
              <div style="background-color: #020617; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 12px; font-size: 11px; font-family: ui-monospace, Menlo, Monaco, monospace; color: #94a3b8; word-break: break-all;">
                {{ .ConfirmationURL }}
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #020617; padding: 20px 36px; border-top: 1px solid rgba(255, 255, 255, 0.06); text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #475569;">
                Link expires in 15 minutes. If you did not request this login, you can safely ignore this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

export const SUPABASE_RESET_PASSWORD_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; background-color: #090d16; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #090d16; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 560px; background-color: #0f172a; border-radius: 24px; overflow: hidden; border: 1px solid rgba(245, 158, 11, 0.3); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
          <tr>
            <td style="background: linear-gradient(90deg, #d97706, #f59e0b, #fbbf24); height: 5px; line-height: 5px; font-size: 5px;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding: 36px 36px 20px 36px;">
              <div style="display: inline-flex; align-items: center; gap: 10px;">
                <div style="width: 40px; height: 40px; border-radius: 12px; background: linear-gradient(135deg, #d97706, #f59e0b); display: inline-block; text-align: center; line-height: 40px; font-weight: 900; color: #ffffff; font-size: 19px;">
                  TP
                </div>
                <span style="font-size: 18px; font-weight: 800; color: #ffffff; vertical-align: middle; margin-left: 8px;">
                  TrustPulse<span style="color: #f59e0b;">.ai</span>
                </span>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 36px 36px 36px;">
              <h1 style="margin: 0 0 14px 0; color: #ffffff; font-size: 24px; font-weight: 800;">
                Reset Your Password
              </h1>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #94a3b8;">
                We received a request to reset the password for your TrustPulse AI account (<strong>{{ .Email }}</strong>). Click below to choose a new password.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 28px 0;">
                <tr>
                  <td align="center">
                    <a href="{{ .ConfirmationURL }}" target="_blank" style="display: inline-block; width: 100%; box-sizing: border-box; text-align: center; background: linear-gradient(180deg, #f59e0b, #d97706); color: #0f172a; font-size: 15px; font-weight: 800; text-decoration: none; padding: 15px 32px; border-radius: 14px; box-shadow: 0 10px 20px -5px rgba(245, 158, 11, 0.4);">
                      Set New Password &rarr;
                    </a>
                  </td>
                </tr>
              </table>
              <div style="background-color: #020617; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 12px; font-size: 11px; font-family: ui-monospace, Menlo, Monaco, monospace; color: #94a3b8; word-break: break-all;">
                {{ .ConfirmationURL }}
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #020617; padding: 20px 36px; border-top: 1px solid rgba(255, 255, 255, 0.06); text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #475569;">
                If you did not request this password reset, please ignore this email or contact support immediately.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
