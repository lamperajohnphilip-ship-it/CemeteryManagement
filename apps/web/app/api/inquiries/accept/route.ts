import { NextResponse } from 'next/server';
import { acceptInquiry } from '../../../actions/inquiry';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, remarks } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Missing required inquiry id parameter.' },
        { status: 400 }
      );
    }

    const result = await acceptInquiry(Number(id), remarks);
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: result.alreadyAccepted ? 409 : 400 });
    }
  } catch (error: any) {
    console.error('API Error in accept inquiry endpoint:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
