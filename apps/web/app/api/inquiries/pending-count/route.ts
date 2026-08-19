import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET() {
  try {
    const count = await prisma.inquiries.count({
      where: { STATUS: 'Pending' },
    });
    return NextResponse.json({ success: true, count });
  } catch (error: any) {
    console.error('API Error counting pending inquiries:', error);
    return NextResponse.json({ success: false, count: 0, error: error.message }, { status: 500 });
  }
}
