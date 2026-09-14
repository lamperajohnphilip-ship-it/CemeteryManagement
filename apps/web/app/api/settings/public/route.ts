import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await prisma.systemSetting.findUnique({
      where: { id: 'default' },
      select: {
        systemName: true,
        systemDescription: true,
        contactNumber: true,
        officialEmail: true,
        officeAddress: true,
        timeZone: true,
        dateFormat: true,
        timeFormat: true,
        userAccessEnabled: true,
        mobileAppEnabled: true,
        inquiriesEnabled: true,
        announcementsEnabled: true,
        graveLocatorEnabled: true,
        maintenanceMode: true,
        maintenanceMessage: true,
      },
    });

    if (!settings) {
      return NextResponse.json({
        maintenanceMode: false,
        maintenanceMessage: '',
        userAccessEnabled: true,
        inquiriesEnabled: true,
        announcementsEnabled: true,
        graveLocatorEnabled: true,
      });
    }

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error('[Public Settings Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to retrieve public system settings' },
      { status: 500 }
    );
  }
}
