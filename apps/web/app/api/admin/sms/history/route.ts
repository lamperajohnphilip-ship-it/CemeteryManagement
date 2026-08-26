import { NextRequest, NextResponse } from 'next/server';
import { getSmsHistory, getSmsStats } from '../../../../actions/sms';

/**
 * GET /api/admin/sms/history
 * 
 * Retrieves paginated SMS log entries, filters, and delivery statistics.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const type = searchParams.get('type') || 'all';
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    const includeStats = searchParams.get('includeStats') === 'true';

    const historyResult = await getSmsHistory({
      page,
      limit,
      search,
      status,
      type,
      startDate,
      endDate,
    });

    let statsResult = null;
    if (includeStats) {
      statsResult = await getSmsStats();
    }

    return NextResponse.json({
      success: historyResult.success,
      records: historyResult.records,
      pagination: historyResult.pagination,
      stats: statsResult?.stats || null,
      error: historyResult.error,
    });
  } catch (error: any) {
    console.error('[API /api/admin/sms/history Error]', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch SMS history.' },
      { status: 500 }
    );
  }
}
