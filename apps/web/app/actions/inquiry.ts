'use server';

import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { sendInquiryAcceptanceEmail } from '../../lib/email';

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
    // 1. Strict Validation
    if (!data.FAMILY_NAME?.trim() || !data.email?.trim() || !data.CONTACT?.trim() || !data.reason?.trim()) {
      return { success: false, message: 'Please fill in all required fields (Name, Email, Contact, Reason).' };
    }

    const emailClean = data.email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailClean)) {
      return { success: false, message: 'Please provide a valid email address.' };
    }

    const record = await prisma.inquiries.create({
      data: {
        APP_ID: data.APP_ID,
        FAMILY_NAME: data.FAMILY_NAME.trim(),
        email: emailClean,
        CONTACT: data.CONTACT.trim(),
        relationship: data.relationship || 'Relative',
        address: data.address?.trim() || null,
        reason: data.reason.trim(),
        DECEASED: data.DECEASED?.trim() || null,
        REQUESTED_PLOT: data.REQUESTED_PLOT?.trim() || null,
        BURIAL_DATE: data.BURIAL_DATE ? new Date(data.BURIAL_DATE) : null,
        TIME: data.TIME?.trim() || null,
        notes: data.notes?.trim() || null,
        STATUS: "Pending",
      }
    });
    
    // Revalidate admin inquiries path
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

/**
 * Accepts/approves an inquiry:
 * 1. Validates the inquiry exists.
 * 2. Prevents duplicate emails if already accepted.
 * 3. Updates database status to 'Accepted'.
 * 4. Automatically sends acceptance email to user's stored email.
 * 5. Returns status and message to the Admin UI.
 */
export async function acceptInquiry(id: number, remarks?: string) {
  try {
    // 1. Fetch the inquiry
    const existing = await prisma.inquiries.findUnique({
      where: { id },
    });

    if (!existing) {
      return { success: false, message: 'Inquiry not found.' };
    }

    // 2. Prevent accidental duplicate actions & duplicate emails
    if (existing.STATUS.toLowerCase() === 'accepted' || existing.STATUS.toLowerCase() === 'confirmed') {
      return {
        success: false,
        alreadyAccepted: true,
        message: `Inquiry ${existing.APP_ID} has already been accepted.`,
        record: existing,
      };
    }

    // 3. Update status in database to 'Accepted'
    const updatedRecord = await prisma.inquiries.update({
      where: { id },
      data: {
        STATUS: 'Accepted',
        remarks: remarks || existing.remarks,
      },
    });

    // 4. Send acceptance email to the user's Gmail/email address
    let emailSent = false;
    let emailError: string | undefined;

    if (existing.email && existing.email.trim()) {
      const formattedDate = existing.BURIAL_DATE
        ? new Date(existing.BURIAL_DATE).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : null;

      const emailResult = await sendInquiryAcceptanceEmail({
        appId: existing.APP_ID,
        recipientName: existing.FAMILY_NAME,
        recipientEmail: existing.email.trim(),
        deceasedName: existing.DECEASED,
        requestType: existing.reason,
        requestedPlot: existing.REQUESTED_PLOT,
        burialDate: formattedDate,
        burialTime: existing.TIME,
        remarks: remarks || existing.remarks,
      });

      emailSent = emailResult.success;
      if (!emailResult.success) {
        emailError = emailResult.error;
      }
    } else {
      emailError = 'No email address found for this inquiry record.';
    }

    revalidatePath('/admin/inquiries');

    if (emailSent) {
      return {
        success: true,
        emailSent: true,
        record: updatedRecord,
        message: `Inquiry accepted successfully. An acceptance email has been sent to ${existing.email}.`,
      };
    } else {
      return {
        success: true,
        emailSent: false,
        emailError,
        record: updatedRecord,
        message: `Inquiry accepted successfully in database, but email notification could not be sent (${emailError}).`,
      };
    }
  } catch (error: any) {
    console.error("Failed to accept inquiry:", error);
    return { success: false, message: error.message || 'Failed to accept inquiry' };
  }
}

export async function updateInquiryStatus(id: number, status: string, remarks?: string) {
  try {
    // If status is being updated to Accepted, route through acceptInquiry for email handling
    if (status.toLowerCase() === 'accepted' || status.toLowerCase() === 'confirmed') {
      return await acceptInquiry(id, remarks);
    }

    const record = await prisma.inquiries.update({
      where: { id },
      data: { STATUS: status, remarks }
    });
    revalidatePath('/admin/inquiries');
    return { success: true, record, message: `Status updated to ${status}` };
  } catch (error: any) {
    console.error("Failed to update inquiry:", error);
    return { success: false, message: error.message || 'Failed to update inquiry' };
  }
}
