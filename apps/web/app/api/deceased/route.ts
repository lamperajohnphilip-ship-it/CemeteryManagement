import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const records = await prisma.deceasedRecord.findMany({
      where: { NOT: { isArchived: true } },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, records });
  } catch (error: any) {
    console.error('API Error fetching deceased records:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
