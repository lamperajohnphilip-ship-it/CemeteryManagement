import { NextRequest, NextResponse } from 'next/server';
import { sendSmsNotification, sendBulkSmsNotification } from '../../../../actions/sms';

/**
 * POST /api/admin/sms/send
 * 
 * Internal secure backend endpoint for dispatching SMS notifications via Semaphore.
 * Validates the payload, executes server-side SMS dispatch, logs to DB,
 * and returns safe responses without exposing API keys.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { recipient, recipients, recipientName, message, type = 'CUSTOM', sentBy = 'Admin' } = body;

    // Handle Bulk SMS if an array of recipients is provided
    if (Array.isArray(recipients) && recipients.length > 0) {
      if (!message && !recipients.some(r => r.message)) {
        return NextResponse.json(
          { success: false, error: 'SMS message content is required.' },
          { status: 400 }
        );
      }

      const result = await sendBulkSmsNotification({
        recipients,
        defaultMessage: message,
        type,
        sentBy,
      });

      return NextResponse.json(result, { status: result.success ? 200 : 400 });
    }

    // Handle Single SMS
    if (!recipient || !recipient.trim()) {
      return NextResponse.json(
        { success: false, error: 'Recipient phone number is required.' },
        { status: 400 }
      );
    }

    if (!message || !message.trim()) {
      return NextResponse.json(
        { success: false, error: 'SMS message content is required.' },
        { status: 400 }
      );
    }

    const result = await sendSmsNotification({
      recipient,
      recipientName,
      message,
      type,
      sentBy,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to send SMS.',
          unconfigured: (result as any).unconfigured || false,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'SMS dispatched successfully.',
      messageId: result.messageId,
      status: result.status,
      recipient: result.recipient,
      sentAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[API /api/admin/sms/send Error]', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal server error while processing SMS.' },
      { status: 500 }
    );
  }
}
