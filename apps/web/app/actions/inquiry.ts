'use server';

import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { sendInquiryAcceptanceEmail, sendInquiryReceivedEmail } from '../../lib/email';
import { sendSmsNotification } from './sms';

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

    // 2. Dispatch immediate confirmation receipt email to the citizen
    try {
      const formattedDate = data.BURIAL_DATE
        ? new Date(data.BURIAL_DATE).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : null;

      await sendInquiryReceivedEmail({
        appId: data.APP_ID,
        recipientName: data.FAMILY_NAME.trim(),
        recipientEmail: emailClean,
        deceasedName: data.DECEASED,
        requestType: data.reason,
        requestedPlot: data.REQUESTED_PLOT,
        burialDate: formattedDate,
        burialTime: data.TIME,
        remarks: data.notes,
      });
    } catch (emailErr) {
      console.warn('Initial receipt email dispatch warning:', emailErr);
    }
    
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
 * 2. Prevents duplicate emails/SMS if already accepted.
 * 3. Updates database status to 'Accepted'.
 * 4. Automatically sends acceptance email to user's stored email.
 * 5. Automatically sends acceptance SMS to user's contact number.
 * 6. Returns status and message to the Admin UI.
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

    // 2. Prevent accidental duplicate actions & duplicate notifications
    if (existing.STATUS.toLowerCase() === 'accepted' || existing.STATUS.toLowerCase() === 'confirmed') {
      return {
        success: false,
        alreadyAccepted: true,
        emailSent: false,
        smsSent: false,
        emailError: undefined as string | undefined,
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

    const formattedDate = existing.BURIAL_DATE
      ? new Date(existing.BURIAL_DATE).toLocaleDateString('en-PH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : null;

    // 4. Send acceptance email to the user's Gmail/email address
    let emailSent = false;
    let emailError: string | undefined;

    if (existing.email && existing.email.trim()) {
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

    // 5. Send automated SMS Notification to citizen's contact number
    let smsSent = false;
    let smsError: string | undefined;

    if (existing.CONTACT && existing.CONTACT.trim()) {
      const dateSnippet = formattedDate ? ` on ${formattedDate}${existing.TIME ? ' at ' + existing.TIME : ''}` : '';
      const smsMessage = `Hi ${existing.FAMILY_NAME}, your inquiry (Ref: ${existing.APP_ID}) has been APPROVED. Please visit the Jasaan Cemetery Office${dateSnippet}.`;

      try {
        const smsResult = await sendSmsNotification({
          recipient: existing.CONTACT.trim(),
          recipientName: existing.FAMILY_NAME,
          message: smsMessage,
          type: 'INQUIRY_APPROVED',
          sentBy: 'System Automation',
        });
        smsSent = smsResult.success;
        if (!smsResult.success) smsError = smsResult.error;
      } catch (smsErr: any) {
        console.warn('Inquiry acceptance SMS failed:', smsErr);
        smsError = smsErr?.message;
      }
    }

    revalidatePath('/admin/inquiries');
    revalidatePath('/admin/sms');

    const notifSummary = [];
    if (emailSent) notifSummary.push(`Email sent to ${existing.email}`);
    if (smsSent) notifSummary.push(`SMS sent to ${existing.CONTACT}`);

    return {
      success: true,
      emailSent,
      smsSent,
      emailError: emailError || undefined,
      smsError: smsError || undefined,
      record: updatedRecord,
      message: `Inquiry accepted successfully. ${notifSummary.length > 0 ? `(${notifSummary.join(', ')})` : ''}`,
    };
  } catch (error: any) {
    console.error("Failed to accept inquiry:", error);
    return { success: false, emailSent: false, smsSent: false, emailError: error.message, message: error.message || 'Failed to accept inquiry' };
  }
}

export async function updateInquiryStatus(id: number, status: string, remarks?: string) {
  try {
    // If status is being updated to Accepted, route through acceptInquiry for email & SMS handling
    if (status.toLowerCase() === 'accepted' || status.toLowerCase() === 'confirmed') {
      return await acceptInquiry(id, remarks);
    }

    const existing = await prisma.inquiries.findUnique({ where: { id } });

    const record = await prisma.inquiries.update({
      where: { id },
      data: { STATUS: status, remarks }
    });

    // If status is Rejected, notify citizen via SMS
    if (status.toLowerCase() === 'rejected' && existing?.CONTACT) {
      const rejectSms = `Hi ${existing.FAMILY_NAME}, your inquiry (${existing.APP_ID}) was not approved. Contact the Jasaan Cemetery Office for assistance.`;
      try {
        await sendSmsNotification({
          recipient: existing.CONTACT,
          recipientName: existing.FAMILY_NAME,
          message: rejectSms,
          type: 'INQUIRY_REJECTED',
          sentBy: 'System Automation',
        });
      } catch (smsErr) {
        console.warn('Inquiry rejection SMS warning:', smsErr);
      }
    }

    revalidatePath('/admin/inquiries');
    revalidatePath('/admin/sms');
    return { success: true, record, message: `Status updated to ${status}` };
  } catch (error: any) {
    console.error("Failed to update inquiry:", error);
    return { success: false, message: error.message || 'Failed to update inquiry' };
  }
}

