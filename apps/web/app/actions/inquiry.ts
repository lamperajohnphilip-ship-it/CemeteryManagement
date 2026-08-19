'use server';

import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';

export async function submitInquiry(data: {
  APP_ID: string;
  FAMILY_NAME: string;
  email: string;
  CONTACT: string;
  relationship: string;
  address?: string;
  reason: string;
  DECEASED?: string;
  REQUESTED_PLOT?: string;
  BURIAL_DATE?: string;
  TIME?: string;
  notes?: string;
}) {
  try {
    const record = await prisma.inquiries.create({
      data: {
        APP_ID: data.APP_ID,
        FAMILY_NAME: data.FAMILY_NAME,
        email: data.email,
        CONTACT: data.CONTACT,
        relationship: data.relationship,
        address: data.address,
        reason: data.reason,
        DECEASED: data.DECEASED,
        REQUESTED_PLOT: data.REQUESTED_PLOT,
        BURIAL_DATE: data.BURIAL_DATE ? new Date(data.BURIAL_DATE) : null,
        TIME: data.TIME,
        notes: data.notes,
        STATUS: "Pending",
      }
    });
    
    // Revalidate paths if necessary (e.g. admin inquiry list)
    revalidatePath('/admin/inquiries');
    
    return { success: true, record };
  } catch (error: any) {
    console.error("Failed to submit inquiry:", error);
    return { success: false, message: error.message || 'Failed to submit inquiry' };
  }
}

export async function getInquiries() {
  try {
    const records = await prisma.inquiries.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, records };
  } catch (error: any) {
    console.error("Failed to fetch inquiries:", error);
    return { success: false, message: error.message || 'Failed to fetch inquiries' };
  }
}

export async function updateInquiryStatus(id: number, status: string, remarks?: string) {
  try {
    const record = await prisma.inquiries.update({
      where: { id },
      data: { STATUS: status, remarks }
    });
    revalidatePath('/admin/inquiries');
    return { success: true, record };
  } catch (error: any) {
    console.error("Failed to update inquiry:", error);
    return { success: false, message: error.message || 'Failed to update inquiry' };
  }
}
