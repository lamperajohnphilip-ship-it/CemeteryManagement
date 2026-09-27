import nodemailer from 'nodemailer';
import { prisma } from './prisma';

export interface InquiryEmailData {
  inquiryId?: number | null;
  appId: string;
  recipientName: string;
  recipientEmail: string;
  deceasedName?: string | null;
  requestType: string;
  requestedPlot?: string | null;
  burialDate?: string | null;
  burialTime?: string | null;
  remarks?: string | null;
}

export interface InquiryRejectionEmailData {
  inquiryId?: number | null;
  appId: string;
  recipientName: string;
  recipientEmail: string;
  requestType: string;
  deceasedName?: string | null;
  reason?: string | null;
}

/**
 * Escapes HTML characters in user input to prevent email injection & XSS attacks.
 */
function escapeHtml(str: string | null | undefined): string {
  if (!str) return 'N/A';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Checks if an SMTP error is due to Google invalid credentials or missing App Password.
 */
function isSmtpAuthError(err: any): boolean {
  const msg = `${err?.message || ''} ${err?.response || ''}`;
  return (
    msg.includes('535') ||
    msg.includes('534') ||
    msg.includes('BadCredentials') ||
    msg.includes('Username and Password not accepted') ||
    msg.includes('Application-specific password required') ||
    msg.includes('InvalidSecondFactor')
  );
}

/**
 * Persists an outgoing email audit entry to the database.
 */
export async function recordEmailLog(params: {
  inquiryId?: number | null;
  inquiryAppId?: string | null;
  recipient: string;
  emailType: string;
  subject: string;
  status: 'Pending' | 'Sent' | 'Failed';
  errorMessage?: string | null;
}) {
  try {
    return await prisma.emailNotificationLog.create({
      data: {
        inquiryId: params.inquiryId || null,
        inquiryAppId: params.inquiryAppId || null,
        recipient: params.recipient.trim().toLowerCase(),
        emailType: params.emailType,
        subject: params.subject,
        status: params.status,
        sentAt: params.status === 'Sent' ? new Date() : null,
        errorMessage: params.errorMessage || null,
      },
    });
  } catch (err) {
    console.warn('[Email Log Error]:', err);
    return null;
  }
}

/**
 * Creates and returns a Nodemailer transporter configured via environment variables.
 * Supports:
 * 1. Gmail OAuth2 API: GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN, GMAIL_SENDER_EMAIL
 * 2. Gmail SMTP (App Password): EMAIL_USER, EMAIL_APP_PASSWORD (or GMAIL_API_KEY)
 * 3. Custom SMTP servers
 */
function createTransporter() {
  const oauthUser = process.env.GMAIL_SENDER_EMAIL || process.env.EMAIL_USER;
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

  if (clientId && clientSecret && refreshToken && oauthUser) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: oauthUser.trim(),
        clientId: clientId.trim(),
        clientSecret: clientSecret.trim(),
        refreshToken: refreshToken.trim(),
      },
    });
  }

  const user = (process.env.EMAIL_USER || process.env.GMAIL_SENDER_EMAIL || process.env.SMTP_USER || 'lamperajohnphilip@gmail.com')?.trim();
  const pass = (process.env.EMAIL_APP_PASSWORD || process.env.EMAIL_PASSWORD || process.env.GMAIL_API_KEY || process.env.SMTP_PASS || 'ekkejcrefcsbofav')?.trim();
  const host = (process.env.EMAIL_HOST || process.env.SMTP_HOST || 'smtp.gmail.com')?.trim();
  const port = parseInt(process.env.EMAIL_PORT || process.env.SMTP_PORT || '465', 10);
  const secure = port === 465;

  if (!user || !pass) {
    return null;
  }

  // Gmail SMTP configuration (optimized for Vercel Serverless / AWS Lambda)
  if (host.includes('gmail.com') || !process.env.EMAIL_HOST) {
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: user.trim(),
        pass: pass.replace(/\s+/g, ''), // strip any accidental spaces from 16-char app passwords
      },
      tls: {
        rejectUnauthorized: false,
      },
      // Force IPv4 to prevent AWS Lambda / Vercel serverless environments hanging on IPv6 DNS resolution
      family: 4,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    } as any);
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: user.trim(),
      pass: pass.trim(),
    },
    tls: {
      rejectUnauthorized: false,
    },
    family: 4,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  } as any);
}

/**
 * Returns a properly formatted RFC 5322 "From" header: `"Display Name" <email@domain.com>`.
 */
export function getEmailSenderHeader(): string {
  const senderEmail = (process.env.EMAIL_USER || process.env.GMAIL_SENDER_EMAIL || process.env.SMTP_USER || 'lamperajohnphilip@gmail.com').trim();
  const rawFrom = (process.env.EMAIL_FROM || process.env.SMTP_FROM)?.trim();
  if (!rawFrom) {
    return `"Municipality of Jasaan Cemetery Management System" <${senderEmail}>`;
  }
  if (rawFrom.includes('@') && rawFrom.includes('<') && rawFrom.includes('>')) {
    return rawFrom;
  }
  if (rawFrom.includes('@')) {
    return `"Municipality of Jasaan Cemetery Management System" <${rawFrom}>`;
  }
  const cleanName = rawFrom.replace(/"/g, '').trim();
  return `"${cleanName}" <${senderEmail}>`;
}

/**
 * Sends a 6-digit security verification code (OTP) to the user's Gmail address to verify ownership.
 */
export async function sendVerificationOtpEmail(
  recipientEmail: string,
  otpCode: string,
  recipientName?: string
): Promise<{ success: boolean; messageId?: string; error?: string; unconfigured?: boolean }> {
  try {
    if (!recipientEmail || !recipientEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail.trim())) {
      return { success: false, error: 'Invalid recipient email address' };
    }

    const transporter = createTransporter();
    if (!transporter) {
      console.warn('[Email OTP] Email credentials not configured. In dev mode OTP is:', otpCode);
      return {
        success: false,
        unconfigured: true,
        error: 'Email service credentials not configured. Please set EMAIL_USER and EMAIL_APP_PASSWORD.',
      };
    }

    const fromHeader = getEmailSenderHeader();
    const displayName = recipientName ? escapeHtml(recipientName) : 'Applicant';
    const safeOtp = escapeHtml(otpCode);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'http://localhost:3000';
    const verifyLink = `${baseUrl}/api/email/verify?email=${encodeURIComponent(recipientEmail.trim().toLowerCase())}&code=${encodeURIComponent(otpCode.trim())}`;

    const textContent = `Dear ${recipientName || 'Applicant'},

Your 6-digit verification code for the Municipality of Jasaan Cemetery Inquiry Form is:

${otpCode}

Or click this secure one-click link to verify your email immediately:
${verifyLink}

This code and link will expire in 10 minutes. Please enter this code on the inquiry form or click the link above.

If you did not request this verification code, please ignore this email.

Thank you,
Municipality of Jasaan Cemetery Management System
`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Verify Your Email Address</title></head>
<body style="margin: 0; padding: 0; background-color: #12100e; font-family: 'Segoe UI', Roboto, sans-serif; color: #e8e0d0; line-height: 1.6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #12100e; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 540px; background-color: #1c1916; border: 1px solid #c8a84b; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.6);" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="background: linear-gradient(135deg, #2a241c 0%, #171410 100%); padding: 28px 24px; text-align: center; border-bottom: 2px solid #c8a84b;">
              <div style="font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #c8a84b; margin-bottom: 6px; font-weight: 600;">MUNICIPALITY OF JASAAN · CEMETERY OFFICE</div>
              <h1 style="margin: 0; color: #f5eedc; font-size: 20px;">Email Verification</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 24px; text-align: center;">
              <p style="margin: 0 0 14px 0; font-size: 15px; color: #f5eedc; text-align: left;">Dear <strong>${displayName}</strong>,</p>
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #d0c8b8; text-align: left;">
                Please confirm your email address to submit your cemetery inquiry. You can click the secure button below to verify instantly, or enter the 6-digit code manually.
              </p>

              <!-- One-Click Instant Verification Button -->
              <div style="margin: 0 auto 24px; text-align: center;">
                <a href="${verifyLink}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #c8a84b 0%, #9e7f27 100%); color: #12100e; font-weight: 700; font-size: 15px; padding: 14px 28px; border-radius: 8px; text-decoration: none; letter-spacing: 0.5px; box-shadow: 0 4px 15px rgba(200, 168, 75, 0.35);">
                  ✓ Click to Verify Email Address
                </a>
                <div style="font-size: 11px; color: #8a8274; margin-top: 8px;">
                  Secured One-Click Verification · Instant Confirmation
                </div>
              </div>

              <!-- Divider -->
              <div style="margin: 20px 0; text-align: center; position: relative;">
                <span style="background-color: #1c1916; padding: 0 12px; font-size: 11px; color: #8a8274; text-transform: uppercase; letter-spacing: 1px;">OR ENTER 6-DIGIT CODE</span>
              </div>

              <!-- OTP Code Box -->
              <div style="background-color: #24201a; border: 2px dashed #c8a84b; border-radius: 10px; padding: 18px; margin: 0 auto 24px; max-width: 280px; text-align: center;">
                <div style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #a09888; margin-bottom: 6px;">YOUR VERIFICATION CODE</div>
                <div style="font-family: monospace, Consolas, sans-serif; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #e2c97e;">
                  ${safeOtp}
                </div>
                <div style="font-size: 11px; color: #a09888; margin-top: 8px;">⏳ Expires in 10 minutes</div>
              </div>

              <p style="margin: 0 0 16px 0; font-size: 13px; color: #9c9588; text-align: left;">
                To protect against scams and spam, inquiries require a verified email address. If the button above does not work, copy and paste this link into your browser:<br />
                <a href="${verifyLink}" style="color: #c8a84b; word-break: break-all; font-size: 12px;">${verifyLink}</a>
              </p>

              <div style="border-top: 1px dashed rgba(200, 168, 75, 0.2); margin: 20px 0 16px 0;"></div>

              <p style="margin: 0; font-size: 12px; color: #7a7366; text-align: left;">
                Municipality of Jasaan Cemetery Management System · Jasaan, Misamis Oriental
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    const info = await transporter.sendMail({
      from: fromHeader,
      to: recipientEmail.trim(),
      subject: `Your Cemetery Inquiry Verification Code: ${otpCode}`,
      text: textContent,
      html: htmlContent,
    });

    await recordEmailLog({
      recipient: recipientEmail,
      emailType: 'Verification',
      subject: `Your Cemetery Inquiry Verification Code: ${otpCode}`,
      status: 'Sent',
    });

    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('[Email Service Error - OTP]', error);

    if (process.env.NODE_ENV !== 'production' && isSmtpAuthError(error)) {
      console.warn(`[DEV EMAIL SIMULATOR] OTP email simulated for ${recipientEmail}. OTP Code: ${otpCode}`);
      await recordEmailLog({
        recipient: recipientEmail,
        emailType: 'Verification',
        subject: `Your Cemetery Inquiry Verification Code: ${otpCode}`,
        status: 'Sent',
        errorMessage: '[Dev Mode Simulated] Set 16-character Google App Password in .env for real Gmail delivery.',
      });
      return { success: true, messageId: `dev-simulated-${Date.now()}` };
    }

    await recordEmailLog({
      recipient: recipientEmail,
      emailType: 'Verification',
      subject: 'Your Cemetery Inquiry Verification Code',
      status: 'Failed',
      errorMessage: error?.message || 'Failed to send OTP email',
    });

    return { success: false, error: error?.message || 'Failed to send OTP email' };
  }
}

/**
 * Sends an immediate submission receipt email when the user files an inquiry.
 */
export async function sendInquiryReceivedEmail(
  data: InquiryEmailData
): Promise<{ success: boolean; messageId?: string; error?: string; unconfigured?: boolean }> {
  try {
    const {
      appId,
      recipientName,
      recipientEmail,
      deceasedName,
      requestType,
      requestedPlot,
      burialDate,
      burialTime,
    } = data;

    if (!recipientEmail || !recipientEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail.trim())) {
      return { success: false, error: 'Invalid recipient email address' };
    }

    const transporter = createTransporter();
    if (!transporter) {
      return {
        success: false,
        unconfigured: true,
        error: 'Email service credentials (EMAIL_USER and EMAIL_APP_PASSWORD) not configured.',
      };
    }

    const fromHeader = getEmailSenderHeader();

    const safeAppId = escapeHtml(appId);
    const safeName = escapeHtml(recipientName);
    const safeDeceased = escapeHtml(deceasedName);
    const safePlot = escapeHtml(requestedPlot);
    const safeDate = escapeHtml(burialDate);
    const safeTime = escapeHtml(burialTime);
    const safeReason = escapeHtml(requestType);

    const formattedDeceased = deceasedName?.trim() || 'N/A';
    const formattedPlot = requestedPlot?.trim() || 'N/A';
    const formattedDate = burialDate?.trim() || 'N/A';
    const formattedTime = burialTime?.trim() || 'N/A';
    const formattedReason = requestType?.trim() || 'General Inquiry / Service';

    const textContent = `Dear ${recipientName},

Thank you for submitting your inquiry to the Municipality of Jasaan Cemetery Management System. We have received your request and it is currently pending review by our administration.

Inquiry Reference Details:
• Reference ID: ${appId}
• Name: ${recipientName}
• Deceased: ${formattedDeceased}
• Request Type: ${formattedReason}
• Requested Plot: ${formattedPlot}
• Preferred Date: ${formattedDate}
• Preferred Time: ${formattedTime}
• Status: PENDING REVIEW

You will receive an official acceptance email once the cemetery office reviews and approves your inquiry.

Thank you,
Municipality of Jasaan Cemetery Management System
`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Inquiry Received</title></head>
<body style="margin: 0; padding: 0; background-color: #12100e; font-family: 'Segoe UI', Roboto, sans-serif; color: #e8e0d0; line-height: 1.6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #12100e; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #1c1916; border: 1px solid #c8a84b; border-radius: 12px; overflow: hidden;" cellspacing="0" cellpadding="0" border="0">
          <tr>
            <td style="background: linear-gradient(135deg, #2a241c 0%, #171410 100%); padding: 28px 24px; text-align: center; border-bottom: 2px solid #c8a84b;">
              <div style="font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #c8a84b; margin-bottom: 6px;">MUNICIPALITY OF JASAAN · CEMETERY OFFICE</div>
              <h1 style="margin: 0; color: #f5eedc; font-size: 20px;">Inquiry Received &amp; Under Review</h1>
              <div style="margin-top: 10px; display: inline-block; background-color: rgba(200, 168, 75, 0.15); border: 1px solid rgba(200, 168, 75, 0.4); color: #e2c97e; padding: 4px 14px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                REFERENCE ID: ${safeAppId}
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px 24px;">
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #f5eedc;">Dear <strong>${safeName}</strong>,</p>
              <p style="margin: 0 0 20px 0; font-size: 14px; color: #d0c8b8;">We have received your cemetery inquiry. Our administrative office is currently reviewing your schedule and details.</p>
              
              <table role="presentation" width="100%" cellspacing="0" cellpadding="6" border="0" style="background-color: #24201a; border: 1px solid rgba(200, 168, 75, 0.25); border-radius: 8px; font-size: 13px; margin-bottom: 20px;">
                <tr><td width="40%" style="color: #9c9588;">Reference No:</td><td style="color: #c8a84b; font-weight: bold; font-family: monospace;">${safeAppId}</td></tr>
                <tr><td style="color: #9c9588;">Applicant:</td><td style="color: #f5eedc;">${safeName}</td></tr>
                <tr><td style="color: #9c9588;">Deceased:</td><td style="color: #f5eedc;">${safeDeceased}</td></tr>
                <tr><td style="color: #9c9588;">Request Type:</td><td style="color: #f5eedc;">${safeReason}</td></tr>
                <tr><td style="color: #9c9588;">Requested Plot:</td><td style="color: #f5eedc;">${safePlot}</td></tr>
                <tr><td style="color: #9c9588;">Schedule:</td><td style="color: #f5eedc;">${safeDate} at ${safeTime}</td></tr>
                <tr><td style="color: #9c9588;">Status:</td><td><span style="background-color: rgba(200, 132, 58, 0.2); color: #e6b064; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 11px;">PENDING REVIEW</span></td></tr>
              </table>

              <p style="margin: 0 0 16px 0; font-size: 13px; color: #b8b0a0;">You will receive an official approval email once our cemetery administrator accepts your booking.</p>
              <p style="margin: 0; font-size: 13px; color: #d0c8b8;">Thank you,<br><strong style="color: #c8a84b;">Municipality of Jasaan Cemetery Management System</strong></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    const info = await transporter.sendMail({
      from: fromHeader,
      to: recipientEmail.trim(),
      subject: `Inquiry Received - ${appId} | Municipality of Jasaan Cemetery Office`,
      text: textContent,
      html: htmlContent,
    });

    await recordEmailLog({
      inquiryId: data.inquiryId,
      inquiryAppId: appId,
      recipient: recipientEmail,
      emailType: 'Inquiry Received',
      subject: `Inquiry Received - ${appId} | Municipality of Jasaan Cemetery Office`,
      status: 'Sent',
    });

    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('[Email Service Error - Inquiry Received]', error);

    if (process.env.NODE_ENV !== 'production' && isSmtpAuthError(error)) {
      console.warn(`[DEV EMAIL SIMULATOR] Inquiry Received email simulated for ${data.recipientEmail}.`);
      await recordEmailLog({
        inquiryId: data.inquiryId,
        inquiryAppId: data.appId,
        recipient: data.recipientEmail,
        emailType: 'Inquiry Received',
        subject: `Inquiry Received - ${data.appId} | Municipality of Jasaan Cemetery Office`,
        status: 'Sent',
        errorMessage: '[Dev Mode Simulated] Set 16-character Google App Password in .env for real Gmail delivery.',
      });
      return { success: true, messageId: `dev-simulated-${Date.now()}` };
    }

    await recordEmailLog({
      inquiryId: data.inquiryId,
      inquiryAppId: data.appId,
      recipient: data.recipientEmail,
      emailType: 'Inquiry Received',
      subject: `Inquiry Received - ${data.appId} | Municipality of Jasaan Cemetery Office`,
      status: 'Failed',
      errorMessage: error?.message || 'Failed to send inquiry received email',
    });

    return { success: false, error: error?.message || 'Failed to send inquiry received email' };
  }
}

/**
 * Sends an official acceptance email to the user when their cemetery inquiry is approved.
 */
export async function sendInquiryAcceptanceEmail(
  data: InquiryEmailData
): Promise<{ success: boolean; messageId?: string; error?: string; unconfigured?: boolean }> {
  try {
    const {
      inquiryId,
      appId,
      recipientName,
      recipientEmail,
      deceasedName,
      requestType,
      requestedPlot,
      burialDate,
      burialTime,
    } = data;

    // Validate recipient email address
    if (!recipientEmail || !recipientEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail.trim())) {
      return {
        success: false,
        error: `Invalid or missing recipient email address: "${recipientEmail}"`,
      };
    }

    const transporter = createTransporter();
    if (!transporter) {
      console.warn(
        '[Email Service] EMAIL_USER and EMAIL_APP_PASSWORD / EMAIL_PASSWORD are not configured in environment variables.'
      );
      await recordEmailLog({
        inquiryId,
        inquiryAppId: appId,
        recipient: recipientEmail,
        emailType: 'Inquiry Accepted',
        subject: 'Cemetery Inquiry Successfully Accepted',
        status: 'Failed',
        errorMessage: 'Email credentials not configured',
      });
      return {
        success: false,
        unconfigured: true,
        error:
          'Email service credentials not configured. Please set EMAIL_USER and EMAIL_APP_PASSWORD in environment variables.',
      };
    }

    const fromHeader = getEmailSenderHeader();

    const safeAppId = escapeHtml(appId);
    const safeName = escapeHtml(recipientName);
    const safeDeceased = escapeHtml(deceasedName);
    const safePlot = escapeHtml(requestedPlot);
    const safeDate = escapeHtml(burialDate);
    const safeTime = escapeHtml(burialTime);
    const safeReason = escapeHtml(requestType);

    const formattedDeceased = deceasedName?.trim() || 'N/A';
    const formattedPlot = requestedPlot?.trim() || 'N/A';
    const formattedDate = burialDate?.trim() || 'N/A';
    const formattedTime = burialTime?.trim() || 'N/A';
    const formattedReason = requestType?.trim() || 'General Inquiry / Service';

    // Plain text content
    const textContent = `Dear ${recipientName},

We are pleased to inform you that your inquiry submitted to the Municipality of Jasaan Cemetery Management System has been successfully accepted.

Inquiry Details:
• Inquiry ID: ${appId}
• Name: ${recipientName}
• Deceased: ${formattedDeceased}
• Request Type: ${formattedReason}
• Requested Plot: ${formattedPlot}
• Burial Date: ${formattedDate}
• Burial Time: ${formattedTime}
• Status: ACCEPTED

Please keep this email for your records. If you have any questions or need further assistance, please contact the cemetery administration.

Thank you.

Municipality of Jasaan Cemetery Management System
Jasaan, Misamis Oriental
cemetery@jasaan.gov.ph
`;

    // Rich HTML email template
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cemetery Inquiry Successfully Accepted</title>
</head>
<body style="margin: 0; padding: 0; background-color: #12100e; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e8e0d0; line-height: 1.6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #12100e; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #1c1916; border: 1px solid #c8a84b; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.6);" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #2a241c 0%, #171410 100%); padding: 30px 24px; text-align: center; border-bottom: 2px solid #c8a84b;">
              <div style="font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #c8a84b; margin-bottom: 8px; font-weight: 600;">
                MUNICIPALITY OF JASAAN · CEMETERY OFFICE
              </div>
              <h1 style="margin: 0; color: #f5eedc; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">
                Cemetery Inquiry Successfully Accepted
              </h1>
              <div style="margin-top: 10px; display: inline-block; background-color: rgba(200, 168, 75, 0.15); border: 1px solid rgba(200, 168, 75, 0.4); color: #e2c97e; padding: 4px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; letter-spacing: 1px;">
                INQUIRY REF: ${safeAppId}
              </div>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding: 32px 28px;">
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #f5eedc;">
                Dear <strong>${safeName}</strong>,
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #d0c8b8; line-height: 1.7;">
                We are pleased to inform you that your inquiry submitted to the <strong>Municipality of Jasaan Cemetery Management System</strong> has been successfully accepted by the administration.
              </p>

              <!-- Details Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #24201a; border: 1px solid rgba(200, 168, 75, 0.25); border-radius: 8px; margin-bottom: 24px; overflow: hidden;">
                <tr>
                  <td style="padding: 14px 18px; background-color: rgba(200, 168, 75, 0.1); border-bottom: 1px solid rgba(200, 168, 75, 0.2);">
                    <strong style="font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase; color: #c8a84b;">
                      📋 Inquiry Summary
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 18px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="6" border="0" style="font-size: 13px;">
                      <tr>
                        <td width="38%" style="color: #9c9588; font-weight: 500;">Inquiry ID:</td>
                        <td style="color: #c8a84b; font-weight: 700; font-family: monospace;">${safeAppId}</td>
                      </tr>
                      <tr>
                        <td style="color: #9c9588; font-weight: 500;">Name:</td>
                        <td style="color: #f5eedc; font-weight: 600;">${safeName}</td>
                      </tr>
                      <tr>
                        <td style="color: #9c9588; font-weight: 500;">Deceased:</td>
                        <td style="color: #f5eedc;">${safeDeceased}</td>
                      </tr>
                      <tr>
                        <td style="color: #9c9588; font-weight: 500;">Request Type:</td>
                        <td style="color: #f5eedc;">${safeReason}</td>
                      </tr>
                      <tr>
                        <td style="color: #9c9588; font-weight: 500;">Requested Plot:</td>
                        <td style="color: #f5eedc;">${safePlot}</td>
                      </tr>
                      <tr>
                        <td style="color: #9c9588; font-weight: 500;">Burial Date:</td>
                        <td style="color: #f5eedc;">${safeDate}</td>
                      </tr>
                      <tr>
                        <td style="color: #9c9588; font-weight: 500;">Burial Time:</td>
                        <td style="color: #f5eedc;">${safeTime}</td>
                      </tr>
                      <tr>
                        <td style="color: #9c9588; font-weight: 500;">Status:</td>
                        <td><span style="background-color: rgba(46, 125, 50, 0.25); color: #a5d6a7; border: 1px solid rgba(46, 125, 50, 0.4); padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 11px;">ACCEPTED</span></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 16px 0; font-size: 13px; color: #b8b0a0; line-height: 1.6;">
                Please keep this email for your records. If you have any questions, wish to follow up on your requested date, or need further assistance, please contact the cemetery administration office.
              </p>

              <div style="border-top: 1px dashed rgba(200, 168, 75, 0.25); margin: 24px 0 18px 0;"></div>

              <p style="margin: 0; font-size: 13px; color: #d0c8b8;">
                Thank you,<br />
                <strong style="color: #c8a84b;">Municipality of Jasaan Cemetery Management System</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #14120f; padding: 20px 24px; text-align: center; font-size: 11px; color: #7a7366; border-top: 1px solid rgba(200, 168, 75, 0.15);">
              <div>Official Communication from the Municipality of Jasaan Cemetery Administration Office</div>
              <div style="margin-top: 6px;">Jasaan, Misamis Oriental · cemetery@jasaan.gov.ph</div>
              <div style="margin-top: 8px; color: #5a554c;">This is an automated notification. Please do not reply directly to this email.</div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    const info = await transporter.sendMail({
      from: fromHeader,
      to: recipientEmail.trim(),
      subject: 'Cemetery Inquiry Successfully Accepted',
      text: textContent,
      html: htmlContent,
    });

    await recordEmailLog({
      inquiryId,
      inquiryAppId: appId,
      recipient: recipientEmail,
      emailType: 'Inquiry Accepted',
      subject: 'Cemetery Inquiry Successfully Accepted',
      status: 'Sent',
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error: any) {
    console.error('[Email Service Error - Inquiry Acceptance]', error);

    if (process.env.NODE_ENV !== 'production' && isSmtpAuthError(error)) {
      console.warn(`[DEV EMAIL SIMULATOR] Inquiry Acceptance email simulated for ${data.recipientEmail}.`);
      await recordEmailLog({
        inquiryId: data.inquiryId,
        inquiryAppId: data.appId,
        recipient: data.recipientEmail,
        emailType: 'Inquiry Accepted',
        subject: 'Cemetery Inquiry Successfully Accepted',
        status: 'Sent',
        errorMessage: '[Dev Mode Simulated] Set 16-character Google App Password in .env for real Gmail delivery.',
      });
      return {
        success: true,
        messageId: `dev-simulated-${Date.now()}`,
      };
    }

    await recordEmailLog({
      inquiryId: data.inquiryId,
      inquiryAppId: data.appId,
      recipient: data.recipientEmail,
      emailType: 'Inquiry Accepted',
      subject: 'Cemetery Inquiry Successfully Accepted',
      status: 'Failed',
      errorMessage: error?.message || 'Failed to send acceptance email through SMTP.',
    });

    return {
      success: false,
      error: error?.message || 'Failed to send acceptance email through SMTP.',
    };
  }
}

/**
 * Sends an official rejection notification email to the user when their cemetery inquiry cannot be approved.
 */
export async function sendInquiryRejectionEmail(
  data: InquiryRejectionEmailData
): Promise<{ success: boolean; messageId?: string; error?: string; unconfigured?: boolean }> {
  try {
    const { inquiryId, appId, recipientName, recipientEmail, requestType, deceasedName, reason } = data;

    if (!recipientEmail || !recipientEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail.trim())) {
      return {
        success: false,
        error: `Invalid or missing recipient email address: "${recipientEmail}"`,
      };
    }

    const transporter = createTransporter();
    if (!transporter) {
      await recordEmailLog({
        inquiryId,
        inquiryAppId: appId,
        recipient: recipientEmail,
        emailType: 'Inquiry Rejected',
        subject: `Update Regarding Your Cemetery Inquiry - ${appId}`,
        status: 'Failed',
        errorMessage: 'Email credentials not configured',
      });
      return {
        success: false,
        unconfigured: true,
        error:
          'Email service credentials not configured. Please set EMAIL_USER and EMAIL_APP_PASSWORD in environment variables.',
      };
    }

    const fromHeader = getEmailSenderHeader();

    const safeAppId = escapeHtml(appId);
    const safeName = escapeHtml(recipientName);
    const safeDeceased = escapeHtml(deceasedName);
    const safeReason = escapeHtml(requestType);
    const safeRejectionReason = escapeHtml(reason || 'Requirements not met or schedule conflict. Please contact the office for details.');

    const subject = `Update Regarding Your Cemetery Inquiry - ${appId}`;

    const textContent = `Dear ${recipientName},

We are writing to update you regarding your inquiry (${appId}) submitted to the Municipality of Jasaan Cemetery Management System.

After administrative review, we regret to inform you that your inquiry has been REJECTED.

Details:
• Inquiry ID: ${appId}
• Applicant: ${recipientName}
• Request Type: ${requestType || 'General Inquiry'}
• Deceased: ${deceasedName || 'N/A'}
• Status: REJECTED
• Reason / Remarks: ${reason || 'Requirements not met or schedule conflict.'}

If you would like to clarify this decision, submit missing documentation, or apply for an alternate schedule, please contact the Cemetery Administration Office directly at cemetery@jasaan.gov.ph or visit our municipal office.

Sincerely,
Municipality of Jasaan Cemetery Management System
Jasaan, Misamis Oriental
`;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Update Regarding Your Cemetery Inquiry</title>
</head>
<body style="margin: 0; padding: 0; background-color: #12100e; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e8e0d0; line-height: 1.6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #12100e; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #1c1916; border: 1px solid #c8a84b; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.6);" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #2a1c1c 0%, #171010 100%); padding: 30px 24px; text-align: center; border-bottom: 2px solid #b91c1c;">
              <div style="font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #f87171; margin-bottom: 8px; font-weight: 600;">
                MUNICIPALITY OF JASAAN · CEMETERY OFFICE
              </div>
              <h1 style="margin: 0; color: #fecaca; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">
                Inquiry Status Update: Rejected
              </h1>
              <div style="margin-top: 10px; display: inline-block; background-color: rgba(185, 28, 28, 0.2); border: 1px solid rgba(185, 28, 28, 0.5); color: #fca5a5; padding: 4px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; letter-spacing: 1px;">
                INQUIRY REF: ${safeAppId}
              </div>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding: 32px 28px;">
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #f5eedc;">
                Dear <strong>${safeName}</strong>,
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #d0c8b8; line-height: 1.7;">
                Thank you for reaching out to the <strong>Municipality of Jasaan Cemetery Management System</strong>. After administrative review, we regret to inform you that your inquiry could not be approved at this time.
              </p>

              <!-- Details Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #24201a; border: 1px solid rgba(200, 168, 75, 0.25); border-radius: 8px; margin-bottom: 24px; overflow: hidden;">
                <tr>
                  <td style="padding: 14px 18px; background-color: rgba(185, 28, 28, 0.15); border-bottom: 1px solid rgba(185, 28, 28, 0.25);">
                    <strong style="font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase; color: #fca5a5;">
                      📋 Inquiry Review Details
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 16px 18px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="6" border="0" style="font-size: 13px;">
                      <tr>
                        <td width="38%" style="color: #9c9588; font-weight: 500;">Inquiry ID:</td>
                        <td style="color: #c8a84b; font-weight: 700; font-family: monospace;">${safeAppId}</td>
                      </tr>
                      <tr>
                        <td style="color: #9c9588; font-weight: 500;">Applicant:</td>
                        <td style="color: #f5eedc; font-weight: 600;">${safeName}</td>
                      </tr>
                      <tr>
                        <td style="color: #9c9588; font-weight: 500;">Request Type:</td>
                        <td style="color: #f5eedc;">${safeReason}</td>
                      </tr>
                      <tr>
                        <td style="color: #9c9588; font-weight: 500;">Deceased:</td>
                        <td style="color: #f5eedc;">${safeDeceased}</td>
                      </tr>
                      <tr>
                        <td style="color: #9c9588; font-weight: 500;">Status:</td>
                        <td><span style="background-color: rgba(185, 28, 28, 0.25); color: #fca5a5; border: 1px solid rgba(185, 28, 28, 0.4); padding: 2px 8px; border-radius: 4px; font-weight: 700; font-size: 11px;">REJECTED</span></td>
                      </tr>
                      <tr>
                        <td style="color: #9c9588; font-weight: 500; vertical-align: top;">Reason / Remarks:</td>
                        <td style="color: #fca5a5; font-weight: 500; line-height: 1.5;">${safeRejectionReason}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 16px 0; font-size: 13px; color: #b8b0a0; line-height: 1.6;">
                If you believe this was an error, need to supply additional documents, or wish to schedule on an alternative date, please contact the Cemetery Administration Office directly.
              </p>

              <div style="border-top: 1px dashed rgba(200, 168, 75, 0.25); margin: 24px 0 18px 0;"></div>

              <p style="margin: 0; font-size: 13px; color: #d0c8b8;">
                Sincerely,<br />
                <strong style="color: #c8a84b;">Municipality of Jasaan Cemetery Management System</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #14120f; padding: 20px 24px; text-align: center; font-size: 11px; color: #7a7366; border-top: 1px solid rgba(200, 168, 75, 0.15);">
              <div>Official Communication from the Municipality of Jasaan Cemetery Administration Office</div>
              <div style="margin-top: 6px;">Jasaan, Misamis Oriental · cemetery@jasaan.gov.ph</div>
              <div style="margin-top: 8px; color: #5a554c;">This is an automated notification. Please do not reply directly to this email.</div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    const info = await transporter.sendMail({
      from: fromHeader,
      to: recipientEmail.trim(),
      subject,
      text: textContent,
      html: htmlContent,
    });

    await recordEmailLog({
      inquiryId,
      inquiryAppId: appId,
      recipient: recipientEmail,
      emailType: 'Inquiry Rejected',
      subject,
      status: 'Sent',
    });

    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('[Email Service Error - Inquiry Rejection]', error);

    if (process.env.NODE_ENV !== 'production' && isSmtpAuthError(error)) {
      console.warn(`[DEV EMAIL SIMULATOR] Inquiry Rejection email simulated for ${data.recipientEmail}.`);
      await recordEmailLog({
        inquiryId: data.inquiryId,
        inquiryAppId: data.appId,
        recipient: data.recipientEmail,
        emailType: 'Inquiry Rejected',
        subject: `Update Regarding Your Cemetery Inquiry - ${data.appId}`,
        status: 'Sent',
        errorMessage: '[Dev Mode Simulated] Set 16-character Google App Password in .env for real Gmail delivery.',
      });
      return {
        success: true,
        messageId: `dev-simulated-${Date.now()}`,
      };
    }

    await recordEmailLog({
      inquiryId: data.inquiryId,
      inquiryAppId: data.appId,
      recipient: data.recipientEmail,
      emailType: 'Inquiry Rejected',
      subject: `Update Regarding Your Cemetery Inquiry - ${data.appId}`,
      status: 'Failed',
      errorMessage: error?.message || 'Failed to send rejection email',
    });

    return {
      success: false,
      error: error?.message || 'Failed to send rejection email through SMTP.',
    };
  }
}

/**
 * Sends a test email to verify SMTP gateway configuration.
 */
export async function sendTestSystemEmail(
  recipientEmail: string,
  customSenderName?: string
): Promise<{ success: boolean; messageId?: string; error?: string; unconfigured?: boolean }> {
  try {
    if (!recipientEmail || !recipientEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail.trim())) {
      return { success: false, error: 'Please provide a valid recipient email address.' };
    }

    const transporter = createTransporter();
    if (!transporter) {
      return {
        success: false,
        unconfigured: true,
        error: 'SMTP credentials are not configured in .env (EMAIL_USER / EMAIL_APP_PASSWORD missing).',
      };
    }

    const fromHeader = customSenderName?.trim()
      ? `"${customSenderName.trim().replace(/"/g, '')}" <${(process.env.EMAIL_USER || process.env.SMTP_USER || 'cemetery@jasaan.gov.ph').trim()}>`
      : getEmailSenderHeader();

    const htmlContent = `
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; background-color: #0f0d0a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #f0ede6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0f0d0a; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #1a1814; border: 1px solid rgba(200, 168, 75, 0.35); border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.6);">
          <tr>
            <td style="background: linear-gradient(135deg, #1f1b14 0%, #15130f 100%); padding: 26px 30px; border-bottom: 2px solid #C8A84B; text-align: center;">
              <h1 style="margin: 0; color: #E2C97E; font-size: 20px; letter-spacing: 1.5px; text-transform: uppercase;">Jasaan Cemetery Management</h1>
              <p style="margin: 6px 0 0 0; color: #a19a8e; font-size: 13px;">SMTP Test Notification</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <div style="background: rgba(74, 103, 65, 0.15); border: 1px solid rgba(74, 103, 65, 0.4); border-radius: 8px; padding: 16px; margin-bottom: 20px; text-align: center;">
                <span style="font-size: 24px;">✓</span>
                <h3 style="margin: 8px 0 4px 0; color: #86efac; font-size: 16px;">Email Gateway Connection Successful</h3>
                <p style="margin: 0; color: #cbd5e1; font-size: 13px;">Your email notification settings are operating properly.</p>
              </div>
              <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin: 0 0 12px 0;">
                This test message confirms that the <strong>Municipality of Jasaan Cemetery Management System</strong> is capable of dispatching automated transactional and inquiry emails.
              </p>
              <table width="100%" style="font-size: 12px; color: #94a3b8; border-top: 1px solid #2e2a22; margin-top: 20px; padding-top: 14px;">
                <tr>
                  <td><strong>Timestamp:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })} (PHT)</td>
                </tr>
                <tr>
                  <td><strong>Target Recipient:</strong> ${recipientEmail}</td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color: #12100d; padding: 18px; text-align: center; font-size: 11px; color: #6b7280; border-top: 1px solid rgba(200, 168, 75, 0.15);">
              © 2026 Municipality of Jasaan · Cemetery Administration Portal
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const info = await transporter.sendMail({
      from: fromHeader,
      to: recipientEmail.trim(),
      subject: '✓ [Test Email] Cemetery Management System SMTP Notification',
      text: 'This is a test notification from the Jasaan Cemetery Management System. Your SMTP configuration is working properly.',
      html: htmlContent,
    });

    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('[Email Service Error - Test Email]', error);
    return {
      success: false,
      error: error?.message || 'Failed to dispatch test email through SMTP.',
    };
  }
}

/**
 * Sends a generic system email notification (e.g., password recovery codes).
 */
export async function sendSystemEmail(
  to: string,
  subject: string,
  htmlContent: string
): Promise<boolean> {
  try {
    if (!to || !to.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to.trim())) {
      console.warn('[sendSystemEmail] Invalid recipient email address:', to);
      return false;
    }

    const transporter = createTransporter();
    if (!transporter) {
      console.warn('[sendSystemEmail] SMTP transporter unconfigured.');
      return false;
    }

    const fromHeader = getEmailSenderHeader();

    await transporter.sendMail({
      from: fromHeader,
      to: to.trim(),
      subject,
      html: htmlContent,
    });

    return true;
  } catch (err) {
    console.error('[sendSystemEmail Error]:', err);
    return false;
  }
}
