import { NextResponse } from 'next/server';
import { rejectInquiry } from '../../../actions/inquiry';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, reason } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Missing required inquiry id parameter.' },
        { status: 400 }
      );
    }

    const result = await rejectInquiry(Number(id), reason);
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error: any) {
    console.error('API Error in reject inquiry endpoint:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
