'use server';

import { prisma } from '../../lib/prisma';
import { requireAdmin } from '../../lib/auth';

export interface BookedScheduleItem {
  date: string | null;
  time: string | null;
  status: string;
}

/**
 * Get booked schedules for a given month (public — no auth required).
 * Returns only date, time, and status (no personal data).
 */
export async function getBookedSchedules(month?: string): Promise<{ success: boolean; schedules: BookedScheduleItem[]; message?: string }> {
  try {
    let dateFilter: any = {};

    if (month) {
      const [year, mon] = month.split('-').map(Number);
      if (year && mon) {
        const startDate = new Date(year, mon - 1, 1);
        const endDate = new Date(year, mon, 0, 23, 59, 59, 999);
        dateFilter = {
          BURIAL_DATE: {
            gte: startDate,
            lte: endDate,
          },
        };
      }
    }

    const inquiries = await prisma.inquiries.findMany({
      where: {
        ...dateFilter,
        BURIAL_DATE: {
          ...dateFilter.BURIAL_DATE,
          not: null,
        },
        TIME: { not: null },
        STATUS: {
          in: ['Accepted', 'Pending', 'In Progress'],
        },
      },
      select: {
        BURIAL_DATE: true,
        TIME: true,
        STATUS: true,
      },
      orderBy: { BURIAL_DATE: 'asc' },
    });

    const schedules: BookedScheduleItem[] = inquiries.map((inq) => ({
      date: inq.BURIAL_DATE ? (inq.BURIAL_DATE.toISOString().split('T')[0] || null) : null,
      time: inq.TIME,
      status: inq.STATUS.toLowerCase(),
    }));

    return { success: true, schedules };
  } catch (error: any) {
    console.error('Failed to fetch booked schedules:', error);
    return { success: false, schedules: [], message: error.message };
  }
}

export interface CalendarEventItem {
  id: number;
  ref: string;
  fullName: string;
  email: string;
  phone: string;
  relation: string;
  address: string;
  deceased: string;
  plot: string;
  date: string;
  formattedDate: string;
  time: string;
  reason: string;
  notes: string;
  remarks: string;
  status: string;
  submittedAt: string;
}

/**
 * Get full calendar data for admin schedule calendar (admin-only).
 */
export async function getScheduleCalendarData(month?: string): Promise<{ success: boolean; events: CalendarEventItem[]; message?: string }> {
  try {
    await requireAdmin();

    let dateFilter: any = {};

    if (month) {
      const [year, mon] = month.split('-').map(Number);
      if (year && mon) {
        const startDate = new Date(year, mon - 1, 1);
        const endDate = new Date(year, mon, 0, 23, 59, 59, 999);
        dateFilter = {
          BURIAL_DATE: {
            gte: startDate,
            lte: endDate,
          },
        };
      }
    }

    const inquiries = await prisma.inquiries.findMany({
      where: {
        ...dateFilter,
        BURIAL_DATE: {
          ...dateFilter.BURIAL_DATE,
          not: null,
        },
      },
      orderBy: { BURIAL_DATE: 'asc' },
    });

    const events: CalendarEventItem[] = inquiries.map((inq) => ({
      id: inq.id,
      ref: inq.APP_ID,
      fullName: inq.FAMILY_NAME,
      email: inq.email,
      phone: inq.CONTACT,
      relation: inq.relationship,
      address: inq.address || '',
      deceased: inq.DECEASED || '',
      plot: inq.REQUESTED_PLOT || '',
      date: inq.BURIAL_DATE ? (inq.BURIAL_DATE.toISOString().split('T')[0] || '') : '',
      formattedDate: inq.BURIAL_DATE
        ? inq.BURIAL_DATE.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })
        : '',
      time: inq.TIME || '',
      reason: inq.reason,
      notes: inq.notes || '',
      remarks: inq.remarks || '',
      status: inq.STATUS.toLowerCase(),
      submittedAt: inq.createdAt.toISOString(),
    }));

    return { success: true, events };
  } catch (error: any) {
    console.error('Failed to fetch schedule calendar data:', error);
    return { success: false, events: [], message: error.message };
  }
}

/**
 * Check if a specific date+time slot is available.
 */
export async function checkSlotAvailability(date: string, time: string) {
  try {
    const targetDate = new Date(date + 'T00:00:00');
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const conflicting = await prisma.inquiries.findFirst({
      where: {
        BURIAL_DATE: {
          gte: startOfDay,
          lte: endOfDay,
        },
        TIME: time,
        STATUS: 'Accepted',
      },
      select: { id: true, APP_ID: true },
    });

    return {
      success: true,
      available: !conflicting,
      conflictRef: conflicting?.APP_ID || null,
    };
  } catch (error: any) {
    console.error('Failed to check slot availability:', error);
    return { success: false, available: false, message: error.message };
  }
}
