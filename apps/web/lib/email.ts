import nodemailer from 'nodemailer';

export interface InquiryEmailData {
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
 * Creates and returns a Nodemailer transporter configured via environment variables.
 * Supports Gmail SMTP (App Password) as well as custom SMTP servers.
 */
function createTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_APP_PASSWORD || process.env.EMAIL_PASSWORD;
  const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.EMAIL_PORT || '465', 10);
  const secure = port === 465;

  if (!user || !pass) {
    return null;
  }

  // Gmail SMTP configuration
  if (host.includes('gmail.com') || !process.env.EMAIL_HOST) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: user.trim(),
        pass: pass.replace(/\s+/g, ''), // strip any accidental spaces from 16-char app passwords
      },
    });
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: user.trim(),
      pass: pass.trim(),
    },
  });
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

    const senderEmail = process.env.EMAIL_USER;
    const fromHeader = process.env.EMAIL_FROM || `"Municipality of Jasaan Cemetery Management System" <${senderEmail}>`;
    const displayName = recipientName ? escapeHtml(recipientName) : 'Applicant';
    const safeOtp = escapeHtml(otpCode);

    const textContent = `Dear ${recipientName || 'Applicant'},

Your 6-digit verification code for the Municipality of Jasaan Cemetery Inquiry Form is:

${otpCode}

This code will expire in 10 minutes. Please enter this code on the inquiry form to verify your email address.

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
              <h1 style="margin: 0; color: #f5eedc; font-size: 20px;">Email Verification Code</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 24px; text-align: center;">
              <p style="margin: 0 0 14px 0; font-size: 15px; color: #f5eedc; text-align: left;">Dear <strong>${displayName}</strong>,</p>
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #d0c8b8; text-align: left;">
                Please use the following 6-digit verification code to confirm your email address and submit your cemetery inquiry.
              </p>

              <!-- OTP Code Box -->
              <div style="background-color: #24201a; border: 2px dashed #c8a84b; border-radius: 10px; padding: 20px; margin: 0 auto 24px; max-width: 280px; text-align: center;">
                <div style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #a09888; margin-bottom: 6px;">YOUR VERIFICATION CODE</div>
                <div style="font-family: monospace, Consolas, sans-serif; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #e2c97e;">
                  ${safeOtp}
                </div>
                <div style="font-size: 11px; color: #a09888; margin-top: 8px;">⏳ Expires in 10 minutes</div>
              </div>

              <p style="margin: 0 0 16px 0; font-size: 13px; color: #9c9588; text-align: left;">
                To protect against scams and spam, inquiries require a verified email address. Never share this code with anyone.
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

    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('[Email Service Error - OTP]', error);
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

    const senderEmail = process.env.EMAIL_USER;
    const fromHeader = process.env.EMAIL_FROM || `"Municipality of Jasaan Cemetery Management System" <${senderEmail}>`;

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

    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('[Email Service Error - Inquiry Received]', error);
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
      return {
        success: false,
        unconfigured: true,
        error:
          'Email service credentials not configured. Please set EMAIL_USER and EMAIL_APP_PASSWORD in environment variables.',
      };
    }

    const senderEmail = process.env.EMAIL_USER;
    const fromHeader =
      process.env.EMAIL_FROM || `"Municipality of Jasaan Cemetery Management System" <${senderEmail}>`;

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

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error: any) {
    console.error('[Email Service Error - Inquiry Acceptance]', error);
    return {
      success: false,
      error: error?.message || 'Failed to send acceptance email through SMTP.',
    };
  }
}
