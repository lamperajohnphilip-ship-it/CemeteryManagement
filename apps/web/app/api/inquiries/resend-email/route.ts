import { NextResponse } from 'next/server';
import { resendInquiryEmail } from '../../../actions/inquiry';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, type } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Inquiry ID is required.' },
        { status: 400 }
      );
    }

    const emailType = type === 'rejection' ? 'rejection' : type === 'receipt' ? 'receipt' : 'acceptance';
    const result = await resendInquiryEmail(Number(id), emailType);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error: any) {
    console.error('API Error in resend inquiry email endpoint:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
