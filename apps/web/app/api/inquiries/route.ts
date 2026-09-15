import { NextResponse } from 'next/server';
import { getInquiries, submitInquiry, updateInquiryStatus } from '../../actions/inquiry';
import { verifyAdminSession } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const appId = searchParams.get('appId');
    const contactOrEmail = searchParams.get('email') || searchParams.get('contact');

    // Case 1: Admin-authenticated request — return all inquiries
    const auth = await verifyAdminSession();
    if (auth.success && auth.session) {
      const result = await getInquiries();
      return NextResponse.json(result);
    }

    // Case 2: Public lookup — only allow single inquiry status check by appId + email/contact
    if (appId && contactOrEmail) {
      const inquiry = await prisma.inquiries.findFirst({
        where: {
          APP_ID: appId,
          OR: [
            { email: { equals: contactOrEmail.toLowerCase(), mode: 'insensitive' } },
            { CONTACT: contactOrEmail },
          ],
        },
        select: {
          APP_ID: true,
          STATUS: true,
          FAMILY_NAME: true,
          DECEASED: true,
          BURIAL_DATE: true,
          TIME: true,
          REQUESTED_PLOT: true,
          remarks: true,
          createdAt: true,
        },
      });

      if (!inquiry) {
        return NextResponse.json(
          { success: false, message: 'No matching inquiry found. Please check your Application ID and email/contact.' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, inquiry });
    }

    // Case 3: Unauthenticated bare GET without lookup params — reject
    return NextResponse.json(
      { success: false, message: 'Unauthorized. Please sign in as an administrator or provide appId and email for status lookup.' },
      { status: 401 }
    );
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
