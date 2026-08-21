'use server';

import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';

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

// Generate unique REF_NO
async function generateRefNo() {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  
  const randomStr = Math.floor(1000 + Math.random() * 9000).toString();
  let refNo = `REF-${yyyy}${mm}${dd}-${randomStr}`;
  
  let exists = await prisma.deceasedRecord.findUnique({ where: { REF_NO: refNo } });
  while (exists) {
    const newRandom = Math.floor(1000 + Math.random() * 9000).toString();
    refNo = `REF-${yyyy}${mm}${dd}-${newRandom}`;
    exists = await prisma.deceasedRecord.findUnique({ where: { REF_NO: refNo } });
  }
  return refNo;
}

export async function addDeceasedRecord(data: {
  PAYORS_NAME: string;
  CONTACT_NO: string;
  NAME_OF_DECEASED: string;
  ADDRESS: string;
  DATE_OF_BIRTH: string;
  DATE_OF_DEATH: string;
  YEAR: number;
  TOTAL_DUE: number;
  PAID: number;
  REMARKS?: string;
}) {
  try {
    // 1. Validation
    if (!data.PAYORS_NAME || !data.CONTACT_NO || !data.NAME_OF_DECEASED || !data.ADDRESS) {
      throw new Error("Missing required string fields.");
    }
    if (!data.DATE_OF_BIRTH || !data.DATE_OF_DEATH) {
      throw new Error("Missing dates.");
    }
    
    const totalDue = parseFloat(data.TOTAL_DUE as any) || 0;
    const paid = parseFloat(data.PAID as any) || 0;
    const year = parseInt(data.YEAR as any) || new Date().getFullYear();

    if (totalDue < 0 || paid < 0) {
      throw new Error("Payments cannot be negative.");
    }

    // 2. Calculations
    const { balance, status } = calculateStatusAndBalance(totalDue, paid);
    
    // 3. Generate REF_NO
    const refNo = await generateRefNo();

    // 4. Insert into database
    const record = await prisma.deceasedRecord.create({
      data: {
        REF_NO: refNo,
        PAYORS_NAME: data.PAYORS_NAME,
        CONTACT_NO: data.CONTACT_NO,
        NAME_OF_DECEASED: data.NAME_OF_DECEASED,
        ADDRESS: data.ADDRESS,
        DATE_OF_BIRTH: new Date(data.DATE_OF_BIRTH),
        DATE_OF_DEATH: new Date(data.DATE_OF_DEATH),
        YEAR: year,
        TOTAL_DUE: totalDue,
        PAID: paid,
        BALANCE: balance,
        STATUS: status,
        REMARKS: data.REMARKS || null,
      }
    });

    // 5. Auto-sync with GravePlot if plot remark was provided (e.g. "A-1", "Section A - Plot A-1")
    if (data.REMARKS) {
      const match = data.REMARKS.match(/([A-Ca-c])\s*[-–_]?\s*0*(\d+)/i);
      if (match) {
        const sec = match[1]!.toUpperCase();
        const num = parseInt(match[2]!, 10);
        const plotCode = `${sec}-${num}`;
        const targetPlot = await prisma.gravePlot.findUnique({ where: { plotNumber: plotCode } });
        if (targetPlot && !targetPlot.deceasedId) {
          await prisma.gravePlot.update({
            where: { plotNumber: plotCode },
            data: {
              status: 'Occupied',
              deceasedId: record.id
            }
          });
        }
      }
    }

    revalidatePath('/admin/deceased-information');
    revalidatePath('/admin/inventory');
    revalidatePath('/admin/grave-mapping');
    revalidatePath('/grave-mapping');
    return { success: true, record };
  } catch (error: any) {
    console.error("Error adding deceased record:", error);
    return { success: false, error: error.message };
  }
}

export async function getDeceasedRecords() {
  try {
    const records = await prisma.deceasedRecord.findMany({
      where: { isArchived: false },
      include: {
        gravePlot: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, records };
  } catch (error: any) {
    console.error("Error fetching deceased records:", error);
    return { success: false, error: error.message };
  }
}

export async function getArchivedRecords() {
  try {
    const records = await prisma.deceasedRecord.findMany({
      where: { isArchived: true },
      include: {
        gravePlot: true
      },
      orderBy: { archivedAt: 'desc' }
    });
    return { success: true, records };
  } catch (error: any) {
    console.error("Error fetching archived records:", error);
    return { success: false, error: error.message };
  }
}

export async function updateDeceasedRecord(id: string, data: Partial<{
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
}>) {
  try {
    const existing = await prisma.deceasedRecord.findUnique({
      where: { id },
      include: { gravePlot: true }
    });
    if (!existing) throw new Error("Record not found");

    const totalDue = data.TOTAL_DUE !== undefined ? parseFloat(data.TOTAL_DUE as any) : existing.TOTAL_DUE;
    const paid = data.PAID !== undefined ? parseFloat(data.PAID as any) : existing.PAID;
    
    if (totalDue < 0 || paid < 0) {
      throw new Error("Payments cannot be negative.");
    }

    const { balance, status } = calculateStatusAndBalance(totalDue, paid);

    const updateData: any = {
      TOTAL_DUE: totalDue,
      PAID: paid,
      BALANCE: balance,
      STATUS: status,
    };

    if (data.PAYORS_NAME !== undefined) updateData.PAYORS_NAME = data.PAYORS_NAME;
    if (data.CONTACT_NO !== undefined) updateData.CONTACT_NO = data.CONTACT_NO;
    if (data.NAME_OF_DECEASED !== undefined) updateData.NAME_OF_DECEASED = data.NAME_OF_DECEASED;
    if (data.ADDRESS !== undefined) updateData.ADDRESS = data.ADDRESS;
    if (data.DATE_OF_BIRTH !== undefined) updateData.DATE_OF_BIRTH = new Date(data.DATE_OF_BIRTH);
    if (data.DATE_OF_DEATH !== undefined) updateData.DATE_OF_DEATH = new Date(data.DATE_OF_DEATH);
    if (data.YEAR !== undefined) updateData.YEAR = parseInt(data.YEAR as any);
    if (data.REMARKS !== undefined) updateData.REMARKS = data.REMARKS;

    const record = await prisma.deceasedRecord.update({
      where: { id },
      data: updateData,
    });

    // Sync GravePlot changes
    if (data.REMARKS !== undefined) {
      const newMatch = data.REMARKS.match(/([A-Ca-c])\s*[-–_]?\s*0*(\d+)/i);
      const newPlotCode = newMatch ? `${newMatch[1]!.toUpperCase()}-${parseInt(newMatch[2]!, 10)}` : null;

      const currentPlotCode = existing.gravePlot?.plotNumber;

      if (currentPlotCode && currentPlotCode !== newPlotCode) {
        // Vacate old plot
        await prisma.gravePlot.update({
          where: { plotNumber: currentPlotCode },
          data: { status: 'Available', deceasedId: null }
        });
      }

      if (newPlotCode && newPlotCode !== currentPlotCode) {
        // Occupy new plot
        const targetPlot = await prisma.gravePlot.findUnique({ where: { plotNumber: newPlotCode } });
        if (targetPlot) {
          await prisma.gravePlot.update({
            where: { plotNumber: newPlotCode },
            data: { status: 'Occupied', deceasedId: record.id }
          });
        }
      }
    }

    revalidatePath('/admin/deceased-information');
    revalidatePath('/admin/inventory');
    revalidatePath('/admin/grave-mapping');
    revalidatePath('/grave-mapping');
    return { success: true, record };
  } catch (error: any) {
    console.error("Error updating deceased record:", error);
    return { success: false, error: error.message };
  }
}

export async function archiveDeceasedRecord(id: string, reason?: string) {
  try {
    await prisma.deceasedRecord.update({
      where: { id },
      data: {
        isArchived: true,
        archivedAt: new Date(),
        archiveReason: reason || null,
      }
    });
    revalidatePath('/admin/inventory');
    revalidatePath('/admin/archive');
    return { success: true };
  } catch (error: any) {
    console.error("Error archiving deceased record:", error);
    return { success: false, error: error.message };
  }
}

export async function unarchiveDeceasedRecord(id: string) {
  try {
    await prisma.deceasedRecord.update({
      where: { id },
      data: {
        isArchived: false,
        archivedAt: null,
        archiveReason: null,
      }
    });
    revalidatePath('/admin/inventory');
    revalidatePath('/admin/archive');
    revalidatePath('/admin/archieve');
    return { success: true };
  } catch (error: any) {
    console.error("Error unarchiving deceased record:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteDeceasedRecord(id: string) {
  try {
    await prisma.deceasedRecord.delete({
      where: { id },
    });
    revalidatePath('/admin/inventory');
    revalidatePath('/admin/archive');
    revalidatePath('/admin/archieve');
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting deceased record:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteMultipleDeceasedRecords(ids: string[]) {
  try {
    await prisma.deceasedRecord.deleteMany({
      where: { id: { in: ids } },
    });
    revalidatePath('/admin/inventory');
    revalidatePath('/admin/archive');
    revalidatePath('/admin/archieve');
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting multiple deceased records:", error);
    return { success: false, error: error.message };
  }
}
