import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/admin/sms/test
 * Diagnostic endpoint to verify Semaphore API key connectivity and account credits.
 */
export async function GET(_req: NextRequest) {
  const rawKey = process.env.SEMAPHORE_API_KEY || '';
  const apiKey = rawKey.trim().replace(/^["']|["']$/g, '');
  const senderName = (process.env.SEMAPHORE_SENDER_NAME || 'SEMAPHORE').trim().replace(/^["']|["']$/g, '');

  if (!apiKey || apiKey.toLowerCase() === 'your_semaphore_api_key_here') {
    return NextResponse.json({
      success: false,
      configured: false,
      message: 'SEMAPHORE_API_KEY is not configured in .env or Vercel Environment Variables.',
    }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.semaphore.co/api/v4/account?apikey=${apiKey}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({
        success: false,
        configured: true,
        httpStatus: res.status,
        error: data,
        message: 'Semaphore API key was rejected by the gateway. Please verify your key on semaphore.co.',
      }, { status: res.status });
    }

    return NextResponse.json({
      success: true,
      configured: true,
      senderName,
      account: data,
      message: 'Semaphore API connected successfully!',
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      configured: true,
      error: error?.message || 'Failed to connect to Semaphore gateway.',
    }, { status: 500 });
  }
}
