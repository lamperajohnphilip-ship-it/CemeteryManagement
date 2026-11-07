import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim();

    const where: any = {
      NOT: { isArchived: true }
    };

    if (q) {
      where.OR = [
        { NAME_OF_DECEASED: { contains: q, mode: 'insensitive' } },
        { PAYORS_NAME: { contains: q, mode: 'insensitive' } },
        { REF_NO: { contains: q, mode: 'insensitive' } },
        { REMARKS: { contains: q, mode: 'insensitive' } },
      ];
    }

    const records = await prisma.deceasedRecord.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, records });
  } catch (error: any) {
    console.error('API Error fetching deceased records:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
