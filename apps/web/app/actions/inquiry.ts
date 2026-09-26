'use server';

import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';
import {
  sendInquiryAcceptanceEmail,
  sendInquiryReceivedEmail,
  sendInquiryRejectionEmail,
} from '../../lib/email';
import { sendSmsNotification } from './sms';
import { isEmailVerifiedRecently } from './otp';
import { requireAdmin } from '../../lib/auth';

function safeRevalidate(path: string) {
  try {
    revalidatePath(path);
  } catch (e) {
    // Silently ignore when called in non-request contexts
  }
}

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
    // 1. Strict Input Validation
    if (
      !data.FAMILY_NAME?.trim() ||
      !data.email?.trim() ||
      !data.CONTACT?.trim() ||
      !data.reason?.trim()
    ) {
      return { success: false, message: 'Please fill in all required fields (Name, Email, Contact, Reason).' };
    }

    const emailClean = data.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailClean)) {
      return { success: false, message: 'Please provide a valid email address.' };
    }

    // 2. Strict Email Verification Enforcement (NO BYPASS ALLOWED)
    const isVerified = await isEmailVerifiedRecently(emailClean, 180); // 3-hour window
    if (!isVerified) {
      return {
        success: false,
        message: 'Your email address must be verified before submitting. Please click "Verify Email" to receive and enter a 6-digit code.',
      };
    }

    // 3. Double-booking prevention: check if an Accepted inquiry already occupies this slot
    if (data.BURIAL_DATE && data.TIME) {
      const targetDate = new Date(data.BURIAL_DATE + 'T00:00:00');
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      const conflicting = await prisma.inquiries.findFirst({
        where: {
          BURIAL_DATE: { gte: startOfDay, lte: endOfDay },
          TIME: data.TIME.trim(),
          STATUS: 'Accepted',
        },
        select: { id: true, APP_ID: true },
      });

      if (conflicting) {
        return {
          success: false,
          message: `This schedule is already booked (Ref: ${conflicting.APP_ID}). Please select another available date and time.`,
        };
      }
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
        STATUS: 'Pending',
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    });

    // 3. Dispatch immediate confirmation receipt email to the citizen
    try {
      const formattedDate = data.BURIAL_DATE
        ? new Date(data.BURIAL_DATE).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : null;

      await sendInquiryReceivedEmail({
        inquiryId: record.id,
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

    safeRevalidate('/admin/inquiries');
    return { success: true, record };
  } catch (error: any) {
    console.error('Failed to submit inquiry:', error);
    return { success: false, message: error.message || 'Failed to submit inquiry' };
  }
}

export async function getInquiries() {
  try {
    await requireAdmin();
    const records = await prisma.inquiries.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, records };
  } catch (error: any) {
    console.error('Failed to fetch inquiries:', error);
    return { success: false, message: error.message || 'Unauthorized or failed to fetch inquiries.' };
  }
}

/**
 * Accepts/approves an inquiry:
 * Requires verified administrator authentication.
 */
export async function acceptInquiry(id: number, remarks?: string) {
  try {
    const admin = await requireAdmin();

    const existing = await prisma.inquiries.findUnique({
      where: { id },
    });

    if (!existing) {
      return { success: false, message: 'Inquiry not found.' };
    }

    if (existing.STATUS.toLowerCase() === 'accepted' || existing.STATUS.toLowerCase() === 'confirmed') {
      return {
        success: false,
        alreadyAccepted: true,
        emailSent: false,
        smsSent: false,
        message: `Inquiry ${existing.APP_ID} has already been accepted.`,
        record: existing,
      };
    }

    // Double-booking prevention: check if another Accepted inquiry already has same date+time
    if (existing.BURIAL_DATE && existing.TIME) {
      const startOfDay = new Date(existing.BURIAL_DATE);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(existing.BURIAL_DATE);
      endOfDay.setHours(23, 59, 59, 999);

      const conflicting = await prisma.inquiries.findFirst({
        where: {
          id: { not: id },
          BURIAL_DATE: { gte: startOfDay, lte: endOfDay },
          TIME: existing.TIME,
          STATUS: 'Accepted',
        },
        select: { id: true, APP_ID: true },
      });

      if (conflicting) {
        return {
          success: false,
          emailSent: false,
          smsSent: false,
          message: `Cannot accept — schedule conflict with already-accepted inquiry ${conflicting.APP_ID}. The same date and time is already booked.`,
        };
      }
    }

    // Atomic database update
    const updatedRecord = await prisma.inquiries.update({
      where: { id },
      data: {
        STATUS: 'Accepted',
        remarks: remarks?.trim() || existing.remarks,
      },
    });

    // Record audit log
    try {
      await prisma.adminAuditLog.create({
        data: {
          activity: `Inquiry ${existing.APP_ID} accepted by ${admin.name}`,
          category: 'INQUIRY_ACCEPTED',
          admin: admin.email,
          status: 'Success',
          details: `Applicant: ${existing.FAMILY_NAME}, Remarks: ${remarks || 'None'}`,
        },
      });
    } catch (logErr) {}

    const formattedDate = existing.BURIAL_DATE
      ? new Date(existing.BURIAL_DATE).toLocaleDateString('en-PH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : null;

    let emailSent = false;
    let emailError: string | undefined;

    if (existing.email && existing.email.trim()) {
      const emailResult = await sendInquiryAcceptanceEmail({
        inquiryId: existing.id,
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
    }

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
          sentBy: admin.name || 'System Administrator',
        });
        smsSent = smsResult.success;
        if (!smsResult.success) smsError = smsResult.error;
      } catch (smsErr: any) {
        smsError = smsErr?.message;
      }
    }

    safeRevalidate('/admin/inquiries');
    safeRevalidate('/admin/sms');

    const notifSummary = [];
    if (emailSent) notifSummary.push(`Email sent to ${existing.email}`);
    if (smsSent) notifSummary.push(`SMS sent to ${existing.CONTACT}`);

    return {
      success: true,
      emailSent,
      smsSent,
      emailError,
      smsError,
      record: updatedRecord,
      message: `Inquiry accepted successfully. ${notifSummary.length > 0 ? `(${notifSummary.join(', ')})` : ''}`,
    };
  } catch (error: any) {
    console.error('Failed to accept inquiry:', error);
    return {
      success: false,
      emailSent: false,
      smsSent: false,
      message: error.message || 'Failed to accept inquiry',
    };
  }
}

export async function rejectInquiry(id: number, reason?: string) {
  try {
    const admin = await requireAdmin();

    const existing = await prisma.inquiries.findUnique({
      where: { id },
    });

    if (!existing) {
      return { success: false, message: 'Inquiry not found.' };
    }

    if (existing.STATUS.toLowerCase() === 'rejected') {
      return {
        success: false,
        message: `Inquiry ${existing.APP_ID} has already been marked as Rejected.`,
        record: existing,
      };
    }

    const updatedRecord = await prisma.inquiries.update({
      where: { id },
      data: {
        STATUS: 'Rejected',
        remarks: reason?.trim() || existing.remarks,
      },
    });

    // Record audit log
    try {
      await prisma.adminAuditLog.create({
        data: {
          activity: `Inquiry ${existing.APP_ID} rejected by ${admin.name}`,
          category: 'INQUIRY_REJECTED',
          admin: admin.email,
          status: 'Success',
          details: `Applicant: ${existing.FAMILY_NAME}, Reason: ${reason || 'Schedule or requirements conflict'}`,
        },
      });
    } catch (logErr) {}

    let emailSent = false;
    let emailError: string | undefined;

    if (existing.email && existing.email.trim()) {
      const emailResult = await sendInquiryRejectionEmail({
        inquiryId: existing.id,
        appId: existing.APP_ID,
        recipientName: existing.FAMILY_NAME,
        recipientEmail: existing.email.trim(),
        requestType: existing.reason,
        deceasedName: existing.DECEASED,
        reason: reason?.trim() || existing.remarks || 'Requirements not met or schedule conflict.',
      });

      emailSent = emailResult.success;
      if (!emailResult.success) {
        emailError = emailResult.error;
      }
    }

    let smsSent = false;
    let smsError: string | undefined;

    if (existing.CONTACT && existing.CONTACT.trim()) {
      const rejectSms = `Hi ${existing.FAMILY_NAME}, your inquiry (${existing.APP_ID}) was not approved${reason ? ': ' + reason : ''}. Contact Jasaan Cemetery Office for details.`;
      try {
        const smsResult = await sendSmsNotification({
          recipient: existing.CONTACT.trim(),
          recipientName: existing.FAMILY_NAME,
          message: rejectSms,
          type: 'INQUIRY_REJECTED',
          sentBy: admin.name || 'System Administrator',
        });
        smsSent = smsResult.success;
        if (!smsResult.success) smsError = smsResult.error;
      } catch (smsErr: any) {
        smsError = smsErr?.message;
      }
    }

    safeRevalidate('/admin/inquiries');
    safeRevalidate('/admin/sms');

    return {
      success: true,
      emailSent,
      smsSent,
      emailError,
      smsError,
      record: updatedRecord,
      message: `Inquiry rejected. ${emailSent ? `Email sent to ${existing.email}.` : ''}`,
    };
  } catch (error: any) {
    console.error('Failed to reject inquiry:', error);
    return {
      success: false,
      emailSent: false,
      smsSent: false,
      message: error.message || 'Failed to reject inquiry',
    };
  }
}

export async function resendInquiryEmail(id: number, type: 'acceptance' | 'rejection' | 'receipt') {
  try {
    await requireAdmin();

    const existing = await prisma.inquiries.findUnique({
      where: { id },
    });

    if (!existing) {
      return { success: false, message: 'Inquiry record not found.' };
    }

    if (!existing.email || !existing.email.trim()) {
      return { success: false, message: 'No email address registered for this inquiry.' };
    }

    const formattedDate = existing.BURIAL_DATE
      ? new Date(existing.BURIAL_DATE).toLocaleDateString('en-PH', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : null;

    if (type === 'acceptance') {
      const res = await sendInquiryAcceptanceEmail({
        inquiryId: existing.id,
        appId: existing.APP_ID,
        recipientName: existing.FAMILY_NAME,
        recipientEmail: existing.email.trim(),
        deceasedName: existing.DECEASED,
        requestType: existing.reason,
        requestedPlot: existing.REQUESTED_PLOT,
        burialDate: formattedDate,
        burialTime: existing.TIME,
        remarks: existing.remarks,
      });

      return {
        success: res.success,
        message: res.success
          ? `Acceptance email resent successfully to ${existing.email}.`
          : `Failed to resend: ${res.error}`,
      };
    } else if (type === 'rejection') {
      const res = await sendInquiryRejectionEmail({
        inquiryId: existing.id,
        appId: existing.APP_ID,
        recipientName: existing.FAMILY_NAME,
        recipientEmail: existing.email.trim(),
        requestType: existing.reason,
        deceasedName: existing.DECEASED,
        reason: existing.remarks,
      });

      return {
        success: res.success,
        message: res.success
          ? `Rejection email resent successfully to ${existing.email}.`
          : `Failed to resend: ${res.error}`,
      };
    } else {
      const res = await sendInquiryReceivedEmail({
        inquiryId: existing.id,
        appId: existing.APP_ID,
        recipientName: existing.FAMILY_NAME,
        recipientEmail: existing.email.trim(),
        deceasedName: existing.DECEASED,
        requestType: existing.reason,
        requestedPlot: existing.REQUESTED_PLOT,
        burialDate: formattedDate,
        burialTime: existing.TIME,
        remarks: existing.remarks,
      });

      return {
        success: res.success,
        message: res.success
          ? `Receipt email resent successfully to ${existing.email}.`
          : `Failed to resend: ${res.error}`,
      };
    }
  } catch (error: any) {
    console.error('Error resending inquiry email:', error);
    return { success: false, message: error.message || 'Failed to resend email' };
  }
}

export async function updateInquiryStatus(id: number, status: string, remarks?: string) {
  try {
    await requireAdmin();

    if (status.toLowerCase() === 'accepted' || status.toLowerCase() === 'confirmed') {
      return await acceptInquiry(id, remarks);
    }

    if (status.toLowerCase() === 'rejected') {
      return await rejectInquiry(id, remarks);
    }

    const record = await prisma.inquiries.update({
      where: { id },
      data: { STATUS: status, remarks },
    });

    safeRevalidate('/admin/inquiries');
    return { success: true, record, message: `Status updated to ${status}` };
  } catch (error: any) {
    console.error('Failed to update inquiry:', error);
    return { success: false, message: error.message || 'Failed to update inquiry' };
  }
}

export async function getPendingInquiriesCount() {
  try {
    const count = await prisma.inquiries.count({
      where: { STATUS: 'Pending' },
    });
    return { success: true, count };
  } catch (error: any) {
    console.error('Failed to get pending inquiries count:', error);
    return { success: false, count: 0, message: error.message };
  }
}

