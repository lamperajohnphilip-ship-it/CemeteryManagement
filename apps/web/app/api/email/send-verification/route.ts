import { NextResponse } from 'next/server';
import { sendEmailOtp } from '../../../actions/otp';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, name } = body;

    if (!email || !email.trim()) {
      return NextResponse.json(
        { success: false, message: 'Email address is required.' },
        { status: 400 }
      );
    }

    const result = await sendEmailOtp(email, name);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error: any) {
    console.error('[API Error send-verification]:', error?.message || error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
