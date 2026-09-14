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

function safeRevalidate(path: string) {
  try {
    revalidatePath(path);
  } catch (e) {
    // Silently ignore when called in non-request contexts (tests, scripts)
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
  skipVerification?: boolean;
}) {
  try {
    // 1. Strict Validation
    if (!data.FAMILY_NAME?.trim() || !data.email?.trim() || !data.CONTACT?.trim() || !data.reason?.trim()) {
      return { success: false, message: 'Please fill in all required fields (Name, Email, Contact, Reason).' };
    }

    const emailClean = data.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailClean)) {
      return { success: false, message: 'Please provide a valid email address.' };
    }

    // 2. Email verification check
    const isVerified = await isEmailVerifiedRecently(emailClean, 180); // 3 hours window
    if (!isVerified && !data.skipVerification) {
      return {
        success: false,
        message: 'Your email address must be verified before submitting. Please click "Verify Email" to get a 6-digit code.',
      };
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
        emailVerified: isVerified || !!data.skipVerification,
        emailVerifiedAt: (isVerified || data.skipVerification) ? new Date() : null,
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

    // Revalidate admin inquiries path
    safeRevalidate('/admin/inquiries');

    return { success: true, record };
  } catch (error: any) {
    console.error('Failed to submit inquiry:', error);
    return { success: false, message: error.message || 'Failed to submit inquiry' };
  }
}

export async function getInquiries() {
  try {
    const records = await prisma.inquiries.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, records };
  } catch (error: any) {
    console.error('Failed to fetch inquiries:', error);
    return { success: false, message: error.message || 'Failed to fetch inquiries' };
  }
}

/**
 * Accepts/approves an inquiry:
 * 1. Validates the inquiry exists.
 * 2. Prevents duplicate acceptance.
 * 3. Updates database status to 'Accepted'.
 * 4. Automatically sends acceptance email to user's verified email.
 * 5. Automatically sends acceptance SMS to user's contact number.
 * 6. Returns status, notification states, and friendly message to the Admin UI.
 */
export async function acceptInquiry(id: number, remarks?: string) {
  try {
    const existing = await prisma.inquiries.findUnique({
      where: { id },
    });

    if (!existing) {
      return { success: false, message: 'Inquiry not found.' };
    }

    // Prevent duplicate actions
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

    // Update status in database to 'Accepted'
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

    // Send official acceptance email to the user's email address
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
    } else {
      emailError = 'No email address found for this inquiry record.';
    }

    // Send automated SMS Notification to citizen's contact number
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

    safeRevalidate('/admin/inquiries');
    safeRevalidate('/admin/sms');

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
    console.error('Failed to accept inquiry:', error);
    return {
      success: false,
      emailSent: false,
      smsSent: false,
      emailError: error.message,
      message: error.message || 'Failed to accept inquiry',
    };
  }
}

/**
 * Rejects an inquiry:
 * 1. Validates the inquiry exists.
 * 2. Updates database status to 'Rejected' with reason/remarks.
 * 3. Sends rejection notification email with full details and office contact.
 * 4. Sends rejection SMS if contact number is present.
 */
export async function rejectInquiry(id: number, reason?: string) {
  try {
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
        remarks: reason || existing.remarks,
      },
    });

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
        reason: reason || existing.remarks || 'Requirements not met or schedule conflict.',
      });

      emailSent = emailResult.success;
      if (!emailResult.success) {
        emailError = emailResult.error;
      }
    } else {
      emailError = 'No email address found for this inquiry.';
    }

    // Send SMS
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
          sentBy: 'System Automation',
        });
        smsSent = smsResult.success;
        if (!smsResult.success) smsError = smsResult.error;
      } catch (smsErr: any) {
        console.warn('Inquiry rejection SMS failed:', smsErr);
        smsError = smsErr?.message;
      }
    }

    safeRevalidate('/admin/inquiries');
    safeRevalidate('/admin/sms');

    return {
      success: true,
      emailSent,
      smsSent,
      emailError: emailError || undefined,
      smsError: smsError || undefined,
      record: updatedRecord,
      message: `Inquiry rejected. ${emailSent ? `Email sent to ${existing.email}.` : ''}`,
    };
  } catch (error: any) {
    console.error('Failed to reject inquiry:', error);
    return {
      success: false,
      emailSent: false,
      smsSent: false,
      emailError: error.message,
      message: error.message || 'Failed to reject inquiry',
    };
  }
}

/**
 * Resends an acceptance, rejection, or receipt email for an inquiry.
 */
export async function resendInquiryEmail(id: number, type: 'acceptance' | 'rejection' | 'receipt') {
  try {
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

      const isDevSimulated = res.messageId?.startsWith('dev-simulated-');

      return {
        success: res.success,
        message: res.success
          ? isDevSimulated
            ? `[Dev Mode] Acceptance email simulated for ${existing.email}. (To receive in real Gmail, set 16-char Google App Password in .env).`
            : `Acceptance email resent successfully to ${existing.email}.`
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

      const isDevSimulated = res.messageId?.startsWith('dev-simulated-');

      return {
        success: res.success,
        message: res.success
          ? isDevSimulated
            ? `[Dev Mode] Rejection email simulated for ${existing.email}. (To receive in real Gmail, set 16-char Google App Password in .env).`
            : `Rejection email resent successfully to ${existing.email}.`
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

      const isDevSimulated = res.messageId?.startsWith('dev-simulated-');

      return {
        success: res.success,
        message: res.success
          ? isDevSimulated
            ? `[Dev Mode] Receipt email simulated for ${existing.email}. (To receive in real Gmail, set 16-char Google App Password in .env).`
            : `Receipt email resent successfully to ${existing.email}.`
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
    // If status is being updated to Accepted, route through acceptInquiry
    if (status.toLowerCase() === 'accepted' || status.toLowerCase() === 'confirmed') {
      return await acceptInquiry(id, remarks);
    }

    // If status is being updated to Rejected, route through rejectInquiry
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


