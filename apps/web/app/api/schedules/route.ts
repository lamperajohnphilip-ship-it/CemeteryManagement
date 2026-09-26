import { NextResponse } from 'next/server';
import { getBookedSchedules } from '../../actions/schedule';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month') || undefined;

    const result = await getBookedSchedules(month);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API Error fetching schedules:', error);
    return NextResponse.json(
      { success: false, schedules: [], message: error.message },
      { status: 500 }
    );
  }
}
