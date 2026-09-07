import { NextResponse } from 'next/server';
import { 
  getAnnouncements, 
  saveAnnouncement, 
  deleteAnnouncement, 
  toggleAnnouncementStatus
} from '../../actions/announcements';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const incViews = searchParams.get('incrementViews') === 'true';
    const result = await getAnnouncements(incViews);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API Error fetching announcements:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json({ success: false, error: 'Missing action field' }, { status: 400 });
    }

    let result;
    switch (action) {
      case 'save':
        result = await saveAnnouncement(body.announcement);
        break;
      case 'delete':
        result = await deleteAnnouncement(body.id);
        break;
      case 'toggleStatus':
        result = await toggleAnnouncementStatus(body.id);
        break;
      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }

    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error: any) {
    console.error(`API Error on action ${request.method}:`, error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
