'use server';

import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '../../lib/auth';

// Helper for status calculation
function calculateStatusAndBalance(totalDue: number, paid: number) {
  const balance = Math.max(0, totalDue - paid);
  let status = 'UNPAID';

  if (balance === 0 && totalDue > 0) {
    status = 'PAID';
  } else if (balance === 0 && totalDue === 0 && paid > 0) {
    status = 'PAID';
  } else if (paid > 0 && balance > 0) {
    status = 'PARTIAL';
  } else if (paid === 0) {
    status = 'UNPAID';
  }

  return { balance, status };
}

// Generate unique payment REF_NO
async function generatePaymentRefNo() {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  const randomStr = Math.floor(1000 + Math.random() * 9000).toString();
  let refNo = `PAY-${yyyy}${mm}${dd}-${randomStr}`;

  let exists = await (prisma as any).paymentRecord.findUnique({ where: { REF_NO: refNo } });
  while (exists) {
    const newRandom = Math.floor(1000 + Math.random() * 9000).toString();
    refNo = `PAY-${yyyy}${mm}${dd}-${newRandom}`;
    exists = await (prisma as any).paymentRecord.findUnique({ where: { REF_NO: refNo } });
  }
  return refNo;
}

export async function getPaymentRecords() {
  try {
    await requireAdmin();
    const records = await (prisma as any).paymentRecord.findMany({
      where: { NOT: { isArchived: true } },
      include: {
        deceasedRecord: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, records };
  } catch (error: any) {
    console.error('Error fetching payment records:', error);
    return { success: false, error: error.message };
  }
}

export async function addPaymentRecord(data: {
  PAYORS_NAME: string;
  CONTACT_NO?: string;
  NAME_OF_DECEASED: string;
  ADDRESS?: string;
  DATE_OF_BIRTH?: string;
  DATE_OF_DEATH?: string;
  YEAR: number;
  TOTAL_DUE: number;
  PAID: number;
  REMARKS?: string;
  OR_NO?: string;
  DATE_PAID?: string;
  METHOD?: string;
  DUE_DATE?: string;
  deceasedRecordId?: string;
}) {
  try {
    const admin = await requireAdmin();

    if (!data.PAYORS_NAME || !data.NAME_OF_DECEASED) {
      throw new Error('Payor name and deceased name are required.');
    }

    const totalDue = parseFloat(data.TOTAL_DUE as any) || 0;
    const paid = parseFloat(data.PAID as any) || 0;
    const year = parseInt(data.YEAR as any) || new Date().getFullYear();

    if (totalDue < 0 || paid < 0) {
      throw new Error('Payment amounts cannot be negative.');
    }

    // Check duplicate Official Receipt Number if supplied
    const cleanOR = data.OR_NO?.trim();
    if (cleanOR) {
      const existingOR = await (prisma as any).paymentRecord.findFirst({
        where: { OR_NO: cleanOR },
      });
      if (existingOR) {
        throw new Error(`Official Receipt (OR) No. "${cleanOR}" has already been issued and recorded.`);
      }
    }

    const { balance, status } = calculateStatusAndBalance(totalDue, paid);
    const refNo = await generatePaymentRefNo();

    // Atomic Database Transaction: Record payment and atomically sync deceased record
    const record = await prisma.$transaction(async (tx) => {
      if (data.deceasedRecordId) {
        const deceased = await tx.deceasedRecord.findUnique({
          where: { id: data.deceasedRecordId },
        });

        if (deceased) {
          const remaining = Math.max(0, deceased.TOTAL_DUE - deceased.PAID);
          if (paid > remaining && remaining > 0) {
            throw new Error(
              `Payment amount (₱${paid.toLocaleString()}) exceeds the remaining balance (₱${remaining.toLocaleString()}).`
            );
          }

          const updatedPaid = (deceased.PAID || 0) + paid;
          const { balance: decBal, status: decStatus } = calculateStatusAndBalance(
            deceased.TOTAL_DUE,
            updatedPaid
          );

          await tx.deceasedRecord.update({
            where: { id: data.deceasedRecordId },
            data: {
              PAID: updatedPaid,
              BALANCE: decBal,
              STATUS: decStatus,
            },
          });
        }
      }

      return await (tx as any).paymentRecord.create({
        data: {
          REF_NO: refNo,
          PAYORS_NAME: data.PAYORS_NAME.trim(),
          CONTACT_NO: data.CONTACT_NO?.trim() || null,
          NAME_OF_DECEASED: data.NAME_OF_DECEASED.trim(),
          ADDRESS: data.ADDRESS?.trim() || null,
          DATE_OF_BIRTH: data.DATE_OF_BIRTH ? new Date(data.DATE_OF_BIRTH) : null,
          DATE_OF_DEATH: data.DATE_OF_DEATH ? new Date(data.DATE_OF_DEATH) : null,
          YEAR: year,
          TOTAL_DUE: totalDue,
          PAID: paid,
          BALANCE: balance,
          STATUS: status,
          REMARKS: data.REMARKS?.trim() || null,
          OR_NO: cleanOR || null,
          DATE_PAID: data.DATE_PAID || new Date().toISOString().split('T')[0],
          METHOD: data.METHOD || 'Cash',
          DUE_DATE: data.DUE_DATE || null,
          deceasedRecordId: data.deceasedRecordId || null,
        },
      });
    });

    // Automatically send official payment receipt SMS to payor contact number
    if (data.CONTACT_NO && data.CONTACT_NO.trim()) {
      try {
        const { sendSmsNotification } = await import('./sms');
        const smsText = `Payment of P${paid.toLocaleString()} for ${data.NAME_OF_DECEASED} received. Balance: P${balance.toLocaleString()}. Ref: ${refNo}. - Jasaan Cemetery`;
        await sendSmsNotification({
          recipient: data.CONTACT_NO.trim(),
          recipientName: data.PAYORS_NAME,
          message: smsText,
          type: 'PAYMENT_RECEIVED',
          sentBy: admin.name || 'System Administrator',
        });
      } catch (smsErr) {
        console.warn('Could not send payment receipt SMS:', smsErr);
      }
    }

    revalidatePath('/admin/payment-records');
    revalidatePath('/admin/deceased-information');
    revalidatePath('/admin/cemetery-overview');
    revalidatePath('/admin/sms');
    return { success: true, record };
  } catch (error: any) {
    console.error('Error adding payment record:', error);
    return { success: false, error: error.message || 'Failed to record payment.' };
  }
}

export async function updatePaymentRecord(
  id: string,
  data: Partial<{
    PAYORS_NAME: string;
    CONTACT_NO: string;
    NAME_OF_DECEASED: string;
    ADDRESS: string;
    DATE_OF_BIRTH: string;
    DATE_OF_DEATH: string;
    YEAR: number;
    TOTAL_DUE: number;
    PAID: number;
    REMARKS: string;
    OR_NO: string;
    DATE_PAID: string;
    METHOD: string;
    DUE_DATE: string;
  }>
) {
  try {
    await requireAdmin();

    const existing = await (prisma as any).paymentRecord.findUnique({ where: { id } });
    if (!existing) throw new Error('Payment record not found');

    const totalDue = data.TOTAL_DUE !== undefined ? parseFloat(data.TOTAL_DUE as any) : existing.TOTAL_DUE;
    const paid = data.PAID !== undefined ? parseFloat(data.PAID as any) : existing.PAID;

    if (totalDue < 0 || paid < 0) {
      throw new Error('Amounts cannot be negative.');
    }

    if (data.OR_NO && data.OR_NO.trim() !== existing.OR_NO) {
      const existingOR = await (prisma as any).paymentRecord.findFirst({
        where: { OR_NO: data.OR_NO.trim() },
      });
      if (existingOR && existingOR.id !== id) {
        throw new Error(`Official Receipt (OR) No. "${data.OR_NO.trim()}" is already assigned to another record.`);
      }
    }

    const { balance, status } = calculateStatusAndBalance(totalDue, paid);

    const updateData: any = {
      TOTAL_DUE: totalDue,
      PAID: paid,
      BALANCE: balance,
      STATUS: status,
    };

    if (data.PAYORS_NAME !== undefined) updateData.PAYORS_NAME = data.PAYORS_NAME.trim();
    if (data.CONTACT_NO !== undefined) updateData.CONTACT_NO = data.CONTACT_NO.trim();
    if (data.NAME_OF_DECEASED !== undefined) updateData.NAME_OF_DECEASED = data.NAME_OF_DECEASED.trim();
    if (data.ADDRESS !== undefined) updateData.ADDRESS = data.ADDRESS.trim();
    if (data.DATE_OF_BIRTH !== undefined) updateData.DATE_OF_BIRTH = data.DATE_OF_BIRTH ? new Date(data.DATE_OF_BIRTH) : null;
    if (data.DATE_OF_DEATH !== undefined) updateData.DATE_OF_DEATH = data.DATE_OF_DEATH ? new Date(data.DATE_OF_DEATH) : null;
    if (data.YEAR !== undefined) updateData.YEAR = parseInt(data.YEAR as any);
    if (data.REMARKS !== undefined) updateData.REMARKS = data.REMARKS.trim();
    if (data.OR_NO !== undefined) updateData.OR_NO = data.OR_NO.trim();
    if (data.DATE_PAID !== undefined) updateData.DATE_PAID = data.DATE_PAID;
    if (data.METHOD !== undefined) updateData.METHOD = data.METHOD;
    if (data.DUE_DATE !== undefined) updateData.DUE_DATE = data.DUE_DATE;

    const record = await (prisma as any).paymentRecord.update({
      where: { id },
      data: updateData,
    });

    revalidatePath('/admin/payment-records');
    revalidatePath('/admin/deceased-information');
    revalidatePath('/admin/cemetery-overview');
    return { success: true, record };
  } catch (error: any) {
    console.error('Error updating payment record:', error);
    return { success: false, error: error.message };
  }
}

export async function archivePaymentRecord(id: string, reason?: string) {
  try {
    await requireAdmin();

    await (prisma as any).paymentRecord.update({
      where: { id },
      data: {
        isArchived: true,
        archivedAt: new Date(),
        archiveReason: reason ? reason.trim() : null,
      },
    });
    revalidatePath('/admin/payment-records');
    return { success: true };
  } catch (error: any) {
    console.error('Error archiving payment record:', error);
    return { success: false, error: error.message };
  }
}

export async function deletePaymentRecord(id: string) {
  try {
    await requireAdmin();

    await (prisma as any).paymentRecord.delete({
      where: { id },
    });
    revalidatePath('/admin/payment-records');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting payment record:', error);
    return { success: false, error: error.message };
  }
}
