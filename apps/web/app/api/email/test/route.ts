import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const testTo = body.to || process.env.EMAIL_USER;

    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_APP_PASSWORD || process.env.EMAIL_PASSWORD;
    const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.EMAIL_PORT || '465', 10);
    const secure = port === 465;

    if (!user || !pass) {
      return NextResponse.json({
        success: false,
        error: 'EMAIL_USER or EMAIL_APP_PASSWORD is not configured in .env',
        configured: false,
      }, { status: 400 });
    }

    if (!testTo) {
      return NextResponse.json({
        success: false,
        error: 'No recipient email provided for test.',
      }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: host.includes('gmail.com') ? 'gmail' : undefined,
      host: !host.includes('gmail.com') ? host : undefined,
      port: !host.includes('gmail.com') ? port : undefined,
      secure: !host.includes('gmail.com') ? secure : undefined,
      auth: {
        user: user.trim(),
        pass: pass.replace(/\s+/g, ''),
      },
    });

    const fromHeader = process.env.EMAIL_FROM || `"Municipality of Jasaan Cemetery Management" <${user}>`;

    const info = await transporter.sendMail({
      from: fromHeader,
      to: testTo.trim(),
      subject: '✅ Cemetery Management System - Email Test Successful',
      text: `Hello,\n\nThis is a test notification from the Municipality of Jasaan Cemetery Management System.\nYour Gmail SMTP configuration is working perfectly!\n\nTimestamp: ${new Date().toISOString()}`,
      html: `<div style="font-family: sans-serif; padding: 20px; background: #1a1814; color: #f5eedc; border-radius: 8px; border: 1px solid #c8a84b;">
        <h2 style="color: #c8a84b; margin-top: 0;">✅ Gmail SMTP Test Successful!</h2>
        <p>Your Municipality of Jasaan Cemetery Management System email notification service is active and ready to send acceptance emails to citizens.</p>
        <p style="font-size: 12px; color: #a09888;">Sender: ${user}<br>Recipient: ${testTo}<br>Sent at: ${new Date().toLocaleString()}</p>
      </div>`,
    });

    return NextResponse.json({
      success: true,
      message: `Test email sent successfully to ${testTo}`,
      messageId: info.messageId,
    });
  } catch (error: any) {
    console.error('Email test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to send test email.',
    }, { status: 500 });
  }
}
