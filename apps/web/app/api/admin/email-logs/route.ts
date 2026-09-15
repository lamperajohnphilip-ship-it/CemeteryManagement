import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { requireAdmin } from '../../../../lib/auth';

export async function GET(request: Request) {
  try {
    // Defense-in-depth: verify admin session even though middleware guards /api/admin/*
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const inquiryId = searchParams.get('inquiryId');
    const recipient = searchParams.get('recipient');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const where: any = {};
    if (inquiryId) {
      where.inquiryId = parseInt(inquiryId, 10);
    }
    if (recipient) {
      where.recipient = { contains: recipient.toLowerCase() };
    }

    const logs = await prisma.emailNotificationLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        inquiry: {
          select: {
            id: true,
            APP_ID: true,
            FAMILY_NAME: true,
            STATUS: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, logs });
  } catch (error: any) {
    console.error('API Error fetching email notification logs:', error);
    const status = error?.message?.includes('Unauthorized') ? 401 : 500;
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status }
    );
  }
}
