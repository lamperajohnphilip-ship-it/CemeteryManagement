import { NextResponse } from 'next/server';
import { sendOutgoingEmail } from '../../../../lib/email';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const testTo = body.to || process.env.EMAIL_USER || process.env.GMAIL_SENDER_EMAIL;

    if (!testTo) {
      return NextResponse.json(
        {
          success: false,
          error: 'No recipient email provided for test. Provide { "to": "your-email@gmail.com" } in the request body.',
        },
        { status: 400 }
      );
    }

    const result = await sendOutgoingEmail({
      to: testTo.trim(),
      subject: '✅ Cemetery Management System - Email Service Online Test',
      text: `Hello,\n\nThis is a test notification from the Municipality of Jasaan Cemetery Management System.\nYour email dispatch service is active and working properly!\n\nTimestamp: ${new Date().toISOString()}`,
      html: `
        <div style="font-family: sans-serif; padding: 24px; background: #1a1814; color: #f5eedc; border-radius: 8px; border: 1px solid #c8a84b;">
          <h2 style="color: #c8a84b; margin-top: 0;">✅ Cemetery Management System - Email Test Successful!</h2>
          <p>Your notification gateway is online, healthy, and ready to dispatch OTP codes and inquiry confirmations to citizens.</p>
          <hr style="border: none; border-top: 1px solid rgba(200, 168, 75, 0.3); margin: 16px 0;" />
          <p style="font-size: 13px; color: #a09888; margin: 4px 0;"><strong>Recipient:</strong> ${testTo}</p>
          <p style="font-size: 13px; color: #a09888; margin: 4px 0;"><strong>Dispatched At:</strong> ${new Date().toLocaleString()}</p>
        </div>
      `,
      emailType: 'Test',
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Test email dispatched successfully to ${testTo}`,
        messageId: result.messageId,
        method: result.method,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to dispatch test email',
          unconfigured: result.unconfigured,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Email test error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal error while sending test email.',
      },
      { status: 500 }
    );
  }
}
