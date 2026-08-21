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

  // Gmail SMTP specific configuration or generic SMTP
  if (host.includes('gmail.com') || !process.env.EMAIL_HOST) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      },
    });
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
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
                INQUIRY REF: ${appId}
              </div>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding: 32px 28px;">
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #f5eedc;">
                Dear <strong>${recipientName}</strong>,
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
                        <td style="color: #c8a84b; font-weight: 700; font-family: monospace;">${appId}</td>
                      </tr>
                      <tr>
                        <td style="color: #9c9588; font-weight: 500;">Name:</td>
                        <td style="color: #f5eedc; font-weight: 600;">${recipientName}</td>
                      </tr>
                      <tr>
                        <td style="color: #9c9588; font-weight: 500;">Deceased:</td>
                        <td style="color: #f5eedc;">${formattedDeceased}</td>
                      </tr>
                      <tr>
                        <td style="color: #9c9588; font-weight: 500;">Request Type:</td>
                        <td style="color: #f5eedc;">${formattedReason}</td>
                      </tr>
                      <tr>
                        <td style="color: #9c9588; font-weight: 500;">Requested Plot:</td>
                        <td style="color: #f5eedc;">${formattedPlot}</td>
                      </tr>
                      <tr>
                        <td style="color: #9c9588; font-weight: 500;">Burial Date:</td>
                        <td style="color: #f5eedc;">${formattedDate}</td>
                      </tr>
                      <tr>
                        <td style="color: #9c9588; font-weight: 500;">Burial Time:</td>
                        <td style="color: #f5eedc;">${formattedTime}</td>
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
    console.error('[Email Service Error]', error);
    return {
      success: false,
      error: error?.message || 'Failed to send acceptance email through SMTP.',
    };
  }
}
