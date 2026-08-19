import { NextResponse } from 'next/server';
import { getFeedback, saveFeedback, deleteFeedback } from '../../actions/feedback';

export async function GET() {
  try {
    const result = await getFeedback();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API Error fetching feedback:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, rating, comment } = body;

    if (rating === undefined || rating === null) {
      return NextResponse.json({ success: false, error: 'Rating is required' }, { status: 400 });
    }

    const result = await saveFeedback({
      user_id: user_id || 'User_' + Math.floor(Math.random() * 10000),
      rating,
      comment: comment || ''
    });

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error: any) {
    console.error('API Error saving feedback:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get('id');

    if (!idStr) {
      return NextResponse.json({ success: false, error: 'Feedback ID is required' }, { status: 400 });
    }

    const id = parseInt(idStr, 10);
    const result = await deleteFeedback(id);

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error: any) {
    console.error('API Error deleting feedback:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
