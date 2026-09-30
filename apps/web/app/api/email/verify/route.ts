import { NextResponse } from 'next/server';
import { verifyEmailOtp } from '../../../actions/otp';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const code = searchParams.get('code');

    if (!email || !code) {
      return NextResponse.redirect(
        new URL('/inquiries?error=' + encodeURIComponent('Invalid or missing verification parameters.'), request.url)
      );
    }

    const cleanEmail = decodeURIComponent(email).trim().toLowerCase();
    const cleanCode = decodeURIComponent(code).trim();

    const result = await verifyEmailOtp(cleanEmail, cleanCode);

    if (result.success) {
      return NextResponse.redirect(
        new URL(`/inquiries?email=${encodeURIComponent(cleanEmail)}&verified=true`, request.url)
      );
    } else {
      return NextResponse.redirect(
        new URL(`/inquiries?email=${encodeURIComponent(cleanEmail)}&error=${encodeURIComponent(result.message)}`, request.url)
      );
    }
  } catch (error: any) {
    console.error('API Error in GET email verification link:', error);
    return NextResponse.redirect(
      new URL('/inquiries?error=' + encodeURIComponent(error?.message || 'Verification failed.'), request.url)
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { success: false, message: 'Email and 6-digit verification code are required.' },
        { status: 400 }
      );
    }

    const result = await verifyEmailOtp(email, code);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error: any) {
    console.error('API Error in email verification:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
