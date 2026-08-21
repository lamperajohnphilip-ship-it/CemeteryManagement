'use server';

import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';

export interface GravePlotWithDeceased {
  id: string;
  plotNumber: string;
  section: string;
  row: number;
  column: number;
  status: string; // 'Available' | 'Occupied' | 'Reserved' | 'Maintenance' | 'Unavailable'
  plotType: string;
  notes: string | null;
  deceasedId: string | null;
  deceasedRecord: {
    id: string;
    REF_NO: string;
    NAME_OF_DECEASED: string;
    PAYORS_NAME: string;
    CONTACT_NO: string;
    ADDRESS: string;
    DATE_OF_BIRTH: Date;
    DATE_OF_DEATH: Date;
    YEAR: number;
    TOTAL_DUE: number;
    PAID: number;
    BALANCE: number;
    STATUS: string;
    REMARKS: string | null;
  } | null;
}

// ── Auto-seed 247 default plots if empty ────────────────────
async function seedDefaultPlots() {
  const plotsToCreate: any[] = [];

  // Section A: 80 plots (8 rows x 10 cols)
  for (let r = 1; r <= 8; r++) {
    for (let c = 1; c <= 10; c++) {
      const idx = (r - 1) * 10 + c;
      const numStr = String(idx).padStart(3, '0');
      plotsToCreate.push({
        plotNumber: `A-${numStr}`,
        section: 'A',
        row: r,
        column: c,
        status: 'Available',
        plotType: 'Standard Ground Plot',
        notes: null
      });
    }
  }

  // Section B: 80 plots (8 rows x 10 cols)
  for (let r = 1; r <= 8; r++) {
    for (let c = 1; c <= 10; c++) {
      const idx = (r - 1) * 10 + c;
      const numStr = String(idx).padStart(3, '0');
      plotsToCreate.push({
        plotNumber: `B-${numStr}`,
        section: 'B',
        row: r,
        column: c,
        status: 'Available',
        plotType: 'Lawn Lot',
        notes: null
      });
    }
  }

  // Section C: 87 plots (8 rows x 11 cols, minus 1)
  let cCount = 0;
  for (let r = 1; r <= 8; r++) {
    for (let c = 1; c <= 11; c++) {
      cCount++;
      if (cCount > 87) break;
      const numStr = String(cCount).padStart(3, '0');
      plotsToCreate.push({
        plotNumber: `C-${numStr}`,
        section: 'C',
        row: r,
        column: c,
        status: 'Available',
        plotType: 'Mausoleum / Family Estate',
        notes: null
      });
    }
  }

  await prisma.gravePlot.createMany({
    data: plotsToCreate,
    skipDuplicates: true
  });

  // Auto-link existing deceased records with matching remarks
  const existingDeceased = await prisma.deceasedRecord.findMany({
    where: { isArchived: false }
  });

  for (const d of existingDeceased) {
    if (!d.REMARKS) continue;
    // Look for plot codes like "A-012", "Section A - Plot 12", "B-005"
    let match = d.REMARKS.match(/([A-Ca-c])\s*[-–]?\s*0*(\d+)/i);
    if (!match) {
      match = d.REMARKS.match(/Section\s*([A-Ca-c]).*?Plot\s*0*(\d+)/i);
    }
    if (match) {
      const sec = match[1]?.toUpperCase() ?? 'A';
      const num = String(parseInt(match[2] ?? '1', 10)).padStart(3, '0');
      const targetPlot = `${sec}-${num}`;
      
      const plot = await prisma.gravePlot.findUnique({ where: { plotNumber: targetPlot } });
      if (plot && !plot.deceasedId) {
        await prisma.gravePlot.update({
          where: { plotNumber: targetPlot },
          data: {
            status: 'Occupied',
            deceasedId: d.id
          }
        });
      }
    }
  }
}

// ── 1. Fetch All Grave Plots ────────────────────────────────
export async function getGraveMapData() {
  try {
    const totalCount = await prisma.gravePlot.count();
    if (totalCount === 0) {
      await seedDefaultPlots();
    }

    const plots = await prisma.gravePlot.findMany({
      include: {
        deceasedRecord: true
      },
      orderBy: [
        { section: 'asc' },
        { row: 'asc' },
        { column: 'asc' }
      ]
    });

    return { success: true, plots: plots as GravePlotWithDeceased[] };
  } catch (error: any) {
    console.error('Failed to get grave map data:', error);
    return { success: false, error: error.message, plots: [] };
  }
}

// ── 2. Assign Deceased to Grave Plot ────────────────────────
export async function assignDeceasedToGrave(data: {
  plotNumber: string;
  deceasedId: string;
  notes?: string;
}) {
  try {
    const { plotNumber, deceasedId, notes } = data;

    if (!plotNumber || !deceasedId) {
      return { success: false, error: 'Plot number and deceased record are required.' };
    }

    // 1. Check if grave exists
    const plot = await prisma.gravePlot.findUnique({
      where: { plotNumber },
      include: { deceasedRecord: true }
    });

    if (!plot) {
      return { success: false, error: `Grave plot ${plotNumber} does not exist.` };
    }

    // 2. Check if deceased exists
    const deceased = await prisma.deceasedRecord.findUnique({
      where: { id: deceasedId },
      include: { gravePlot: true }
    });

    if (!deceased) {
      return { success: false, error: 'Deceased record was not found.' };
    }

    // 3. Duplicate Assignment Guard: Check if deceased is already assigned elsewhere
    if (deceased.gravePlot && deceased.gravePlot.plotNumber !== plotNumber) {
      return {
        success: false,
        error: `Duplicate Assignment Error: ${deceased.NAME_OF_DECEASED} is already assigned to Plot ${deceased.gravePlot.plotNumber}. Vacate that plot first before reassigning.`
      };
    }

    // 4. If another deceased is currently on this plot, unassign them first
    if (plot.deceasedId && plot.deceasedId !== deceasedId) {
      return {
        success: false,
        error: `Plot ${plotNumber} is already occupied by ${plot.deceasedRecord?.NAME_OF_DECEASED || 'another deceased'}. Vacate this plot first.`
      };
    }

    // 5. Atomic Update
    await prisma.$transaction([
      prisma.gravePlot.update({
        where: { plotNumber },
        data: {
          status: 'Occupied',
          deceasedId: deceased.id,
          notes: notes || plot.notes || null
        }
      }),
      prisma.deceasedRecord.update({
        where: { id: deceased.id },
        data: {
          REMARKS: `Plot ${plotNumber}`
        }
      })
    ]);

    revalidatePath('/admin/grave-mapping');
    revalidatePath('/grave-mapping');
    revalidatePath('/admin/deceased-information');

    return {
      success: true,
      message: `Successfully assigned ${deceased.NAME_OF_DECEASED} to Plot ${plotNumber}.`
    };
  } catch (error: any) {
    console.error('Failed to assign deceased to grave:', error);
    return { success: false, error: error.message || 'Failed to complete assignment.' };
  }
}

// ── 3. Unassign / Vacate Grave Plot ─────────────────────────
export async function unassignGrave(plotNumber: string) {
  try {
    const plot = await prisma.gravePlot.findUnique({
      where: { plotNumber },
      include: { deceasedRecord: true }
    });

    if (!plot) {
      return { success: false, error: `Grave plot ${plotNumber} not found.` };
    }

    const previousDeceasedId = plot.deceasedId;

    await prisma.$transaction(async (tx) => {
      await tx.gravePlot.update({
        where: { plotNumber },
        data: {
          status: 'Available',
          deceasedId: null,
          notes: null
        }
      });

      if (previousDeceasedId) {
        await tx.deceasedRecord.update({
          where: { id: previousDeceasedId },
          data: {
            REMARKS: null
          }
        });
      }
    });

    revalidatePath('/admin/grave-mapping');
    revalidatePath('/grave-mapping');
    revalidatePath('/admin/deceased-information');

    return { success: true, message: `Plot ${plotNumber} has been vacated and is now Available.` };
  } catch (error: any) {
    console.error('Failed to unassign grave plot:', error);
    return { success: false, error: error.message };
  }
}

// ── 4. Update Grave Plot Status (Reserved, Maintenance, etc.)
export async function updateGraveStatus(data: {
  plotNumber: string;
  status: 'Available' | 'Occupied' | 'Reserved' | 'Maintenance' | 'Unavailable';
  plotType?: string;
  notes?: string;
}) {
  try {
    const { plotNumber, status, plotType, notes } = data;

    const plot = await prisma.gravePlot.findUnique({ where: { plotNumber } });
    if (!plot) {
      return { success: false, error: `Plot ${plotNumber} not found.` };
    }

    const updateData: any = {
      status,
      notes: notes !== undefined ? notes : plot.notes
    };

    if (plotType) updateData.plotType = plotType;

    // If changing away from Occupied, detach deceasedId
    if (status !== 'Occupied' && plot.deceasedId) {
      updateData.deceasedId = null;
    }

    await prisma.gravePlot.update({
      where: { plotNumber },
      data: updateData
    });

    revalidatePath('/admin/grave-mapping');
    revalidatePath('/grave-mapping');

    return { success: true, message: `Plot ${plotNumber} status updated to ${status}.` };
  } catch (error: any) {
    console.error('Failed to update grave status:', error);
    return { success: false, error: error.message };
  }
}

// ── 5. Search Unassigned Deceased Records ───────────────────
export async function searchDeceasedForAssignment(query: string = '') {
  try {
    const term = query.trim().toLowerCase();

    const records = await prisma.deceasedRecord.findMany({
      where: {
        isArchived: false,
        gravePlot: null, // Only return deceased without an existing plot
        ...(term
          ? {
              OR: [
                { NAME_OF_DECEASED: { contains: term, mode: 'insensitive' } },
                { REF_NO: { contains: term, mode: 'insensitive' } },
                { PAYORS_NAME: { contains: term, mode: 'insensitive' } }
              ]
            }
          : {})
      },
      orderBy: { NAME_OF_DECEASED: 'asc' },
      take: 20
    });

    return { success: true, records };
  } catch (error: any) {
    console.error('Failed to search deceased for assignment:', error);
    return { success: false, error: error.message, records: [] };
  }
}
