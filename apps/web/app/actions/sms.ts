'use server';

import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';
import {
  normalizePhilippineNumber,
  isValidPhilippineNumber,
  calculateSmsSegments,
} from '../../lib/sms-utils';
import { requireAdmin, requireRole } from '../../lib/auth';

// Re-export so existing imports from actions/sms keep working on the server side
export { normalizePhilippineNumber, isValidPhilippineNumber, calculateSmsSegments };

/**
 * SMS Notification Service — Powered by Semaphore (Philippines)
 *
 * Semaphore routes directly through Philippine telcos:
 * Globe, Smart, DITO, TNT, TM.
 *
 * API endpoint: POST https://api.semaphore.co/api/v4/messages
 * Parameters: apikey, number, message, sendername (optional)
 */


export interface SendSmsParams {
  recipient: string;
  recipientName?: string;
  message: string;
  type?: string;
  sentBy?: string;
}

/**
 * Sends a single SMS via Semaphore API and logs the transaction to the database.
 */
export async function sendSmsNotification(
  phoneOrParams: string | SendSmsParams,
  legacyMessage?: string,
  legacyType?: string,
  legacySentBy?: string
) {
  let recipient = '';
  let recipientName: string | undefined;
  let message = '';
  let type = 'CUSTOM';
  let sentBy = 'Admin';

  if (typeof phoneOrParams === 'object' && phoneOrParams !== null) {
    recipient = (phoneOrParams as SendSmsParams).recipient || '';
    recipientName = (phoneOrParams as SendSmsParams).recipientName;
    message = (phoneOrParams as SendSmsParams).message || '';
    type = (phoneOrParams as SendSmsParams).type || 'CUSTOM';
    sentBy = (phoneOrParams as SendSmsParams).sentBy || 'Admin';
  } else {
    recipient = (phoneOrParams as string) || '';
    message = legacyMessage || '';
    type = legacyType || 'CUSTOM';
    sentBy = legacySentBy || 'Admin';
  }

  try {
    if (!recipient?.trim()) {
      return { success: false, error: 'Recipient phone number is required.' };
    }
    if (!message?.trim()) {
      return { success: false, error: 'SMS message content is required.' };
    }

    const normalizedPhone = normalizePhilippineNumber(recipient);
    if (!isValidPhilippineNumber(normalizedPhone)) {
      return {
        success: false,
        error: `Invalid Philippine mobile number "${recipient}". Please use 11-digit format starting with 09 (e.g. 09171234567).`,
      };
    }

    const rawApiKey = process.env.SEMAPHORE_API_KEY || '';
    const rawSender = process.env.SEMAPHORE_SENDER_NAME || 'SEMAPHORE';

    const apiKey = rawApiKey.trim().replace(/^["']|["']$/g, '');
    const senderName = rawSender.trim().replace(/^["']|["']$/g, '');

    const isPlaceholder =
      !apiKey ||
      apiKey.toLowerCase() === 'your_semaphore_api_key_here' ||
      apiKey.toLowerCase() === 'your_new_semaphore_api_key' ||
      apiKey.toLowerCase() === 'your_registered_sender_name';

    if (isPlaceholder) {
      const devNotice =
        'SEMAPHORE_API_KEY is not configured in .env. Please add your Semaphore API key to enable SMS sending.';
      
      // Log attempt as Failed in database if model is ready
      try {
        await (prisma as any).smsNotification.create({
          data: {
            recipient: normalizedPhone,
            recipientName: recipientName || null,
            message: message.trim(),
            status: 'Failed',
            type,
            senderName: senderName || 'SEMAPHORE',
            sentBy,
            errorMessage: 'SEMAPHORE_API_KEY not configured.',
          },
        });
      } catch (dbErr) {
        console.warn('Could not log unconfigured SMS to DB:', dbErr);
      }

      return {
        success: false,
        unconfigured: true,
        error: devNotice,
      };
    }

    const payload: Record<string, string> = {
      apikey: apiKey.trim(),
      number: normalizedPhone,
      message: message.trim(),
    };

    if (senderName && senderName.trim()) {
      payload.sendername = senderName.trim();
    }

    // Call Semaphore API securely from server
    const response = await fetch('https://api.semaphore.co/api/v4/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // Semaphore sometimes returns plain text (e.g. "Your account has insufficient credits")
    // instead of JSON — safely read as text first, then parse.
    const rawBody = await response.text();
    let data: any;
    try {
      data = JSON.parse(rawBody);
    } catch {
      data = rawBody; // treat raw text as the error message
    }

    if (response.ok && Array.isArray(data) && data.length > 0) {
      const msg = data[0];
      const semaphoreId = msg.message_id ? String(msg.message_id) : null;
      // Semaphore statuses: 'Queued', 'Pending', 'Sent', 'Failed', 'Refunded'
      const status = msg.status ? (msg.status.charAt(0).toUpperCase() + msg.status.slice(1)) : 'Queued';

      // Save success log in database
      let dbRecord = null;
      try {
        dbRecord = await (prisma as any).smsNotification.create({
          data: {
            recipient: normalizedPhone,
            recipientName: recipientName || null,
            message: message.trim(),
            semaphoreId,
            status,
            type,
            senderName: senderName || 'SEMAPHORE',
            sentBy,
          },
        });
      } catch (dbErr) {
        console.warn('Could not save SMS log to DB:', dbErr);
      }

      revalidatePath('/admin/sms');

      return {
        success: true,
        messageId: semaphoreId,
        status,
        recipient: normalizedPhone,
        dbRecord,
        data,
      };
    }

    // Handle error returned by Semaphore API
    let errorMsg = 'Failed to send SMS via Semaphore.';
    if (typeof data === 'string') {
      errorMsg = data;
    } else if (data?.message) {
      errorMsg = Array.isArray(data.message) ? data.message.join(', ') : String(data.message);
    } else if (data?.error) {
      errorMsg = String(data.error);
    }

    // Log failed attempt in database
    try {
      await (prisma as any).smsNotification.create({
        data: {
          recipient: normalizedPhone,
          recipientName: recipientName || null,
          message: message.trim(),
          status: 'Failed',
          type,
          senderName: senderName || 'SEMAPHORE',
          sentBy,
          errorMessage: errorMsg,
        },
      });
    } catch (dbErr) {
      console.warn('Could not save failed SMS log:', dbErr);
    }

    revalidatePath('/admin/sms');
    return { success: false, error: errorMsg };
  } catch (error: any) {
    console.error('[Semaphore SMS Exception]', error);
    return {
      success: false,
      error: error?.message || 'An unexpected server error occurred while sending SMS.',
    };
  }
}

/**
 * Sends bulk SMS messages. Can send customized messages per recipient or a shared broadcast.
 */
export async function sendBulkSmsNotification(params: {
  recipients: Array<{ number: string; name?: string; message?: string }>;
  defaultMessage?: string;
  type?: string;
  sentBy?: string;
}) {
  // Bulk SMS requires Super Administrator privileges
  const admin = await requireRole(['Super Administrator']);
  const { recipients, defaultMessage = '', type = 'BULK', sentBy = admin.name || 'Admin' } = params;

  if (!recipients || recipients.length === 0) {
    return { success: false, error: 'Please provide at least one recipient.' };
  }

  const results: Array<{
    recipient: string;
    name?: string;
    success: boolean;
    messageId?: string;
    status?: string;
    error?: string;
  }> = [];

  let successCount = 0;
  let failCount = 0;

  for (const item of recipients) {
    const msgToSend = item.message || defaultMessage;
    if (!msgToSend.trim()) continue;

    const res = await sendSmsNotification({
      recipient: item.number,
      recipientName: item.name,
      message: msgToSend,
      type,
      sentBy,
    });

    if (res.success) {
      successCount++;
      results.push({
        recipient: item.number,
        name: item.name,
        success: true,
        messageId: res.messageId || undefined,
        status: res.status,
      });
    } else {
      failCount++;
      results.push({
        recipient: item.number,
        name: item.name,
        success: false,
        error: res.error,
      });
    }
  }

  revalidatePath('/admin/sms');

  return {
    success: successCount > 0,
    total: recipients.length,
    successCount,
    failCount,
    results,
  };
}

/**
 * Retrieves paginated SMS history from the database with search and status filtering.
 */
export async function getSmsHistory(options?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
}) {
  try {
    await requireAdmin();
    const page = Math.max(1, options?.page || 1);
    const limit = Math.max(1, Math.min(100, options?.limit || 10));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (options?.search && options.search.trim()) {
      const q = options.search.trim();
      where.OR = [
        { recipient: { contains: q, mode: 'insensitive' } },
        { recipientName: { contains: q, mode: 'insensitive' } },
        { message: { contains: q, mode: 'insensitive' } },
        { semaphoreId: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (options?.status && options.status !== 'all') {
      where.status = { equals: options.status, mode: 'insensitive' };
    }

    if (options?.type && options.type !== 'all') {
      where.type = { equals: options.type, mode: 'insensitive' };
    }

    if (options?.startDate || options?.endDate) {
      where.createdAt = {};
      if (options.startDate) {
        where.createdAt.gte = new Date(options.startDate);
      }
      if (options.endDate) {
        const end = new Date(options.endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    const [total, records] = await Promise.all([
      (prisma as any).smsNotification.count({ where }),
      (prisma as any).smsNotification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      success: true,
      records,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  } catch (error: any) {
    console.error('Error fetching SMS history:', error);
    return {
      success: false,
      records: [],
      pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
      error: error?.message || 'Failed to fetch SMS history.',
    };
  }
}

/**
 * Retrieves aggregate SMS delivery statistics for the admin dashboard.
 */
export async function getSmsStats() {
  try {
    await requireAdmin();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [total, delivered, queued, failed, todayCount] = await Promise.all([
      (prisma as any).smsNotification.count(),
      (prisma as any).smsNotification.count({ where: { status: { in: ['Sent', 'Delivered'] } } }),
      (prisma as any).smsNotification.count({ where: { status: { in: ['Queued', 'Pending'] } } }),
      (prisma as any).smsNotification.count({ where: { status: 'Failed' } }),
      (prisma as any).smsNotification.count({ where: { createdAt: { gte: today } } }),
    ]);

    return {
      success: true,
      stats: {
        total,
        delivered,
        queued,
        failed,
        todayCount,
      },
    };
  } catch (error: any) {
    console.error('Error fetching SMS stats:', error);
    return {
      success: false,
      stats: { total: 0, delivered: 0, queued: 0, failed: 0, todayCount: 0 },
      error: error?.message,
    };
  }
}

/**
 * Deletes an SMS log record from the database.
 */
export async function deleteSmsLog(id: string) {
  try {
    await requireAdmin();
    await (prisma as any).smsNotification.delete({
      where: { id },
    });
    revalidatePath('/admin/sms');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting SMS log:', error);
    return { success: false, error: error?.message || 'Failed to delete log entry.' };
  }
}
