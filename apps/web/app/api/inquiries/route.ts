import { NextResponse } from 'next/server';
import { submitInquiry } from '../../actions/inquiry';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const result = await submitInquiry(data);
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error: any) {
    console.error('API Error submitting inquiry:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
