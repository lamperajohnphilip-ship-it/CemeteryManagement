import { NextResponse } from 'next/server';
import { getInquiries, submitInquiry, updateInquiryStatus } from '../../actions/inquiry';

export async function GET() {
  try {
    const result = await getInquiries();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API Error fetching inquiries:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

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

export async function PATCH(request: Request) {
  try {
    const data = await request.json();
    const { id, status, remarks } = data;
    if (!id || !status) {
      return NextResponse.json({ success: false, message: 'Missing inquiry ID or status' }, { status: 400 });
    }

    const result = await updateInquiryStatus(Number(id), status, remarks);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API Error updating inquiry status:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
