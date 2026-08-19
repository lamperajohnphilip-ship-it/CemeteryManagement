'use server';

import fs from 'fs';
import path from 'path';
import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';

// Helper to seed from legacy JSON if DB is empty
async function seedFromLegacy() {
  const dataFilePath = path.join(process.cwd(), 'data', 'announcements.json');
  if (fs.existsSync(dataFilePath)) {
    const raw = fs.readFileSync(dataFilePath, 'utf8');
    try {
      const list = JSON.parse(raw);
      for (const ann of list) {
        await prisma.announcement.create({
          data: {
            title: ann.title,
            content: ann.content,
            category: ann.category,
            badge: ann.badge || null,
            visibility: ann.visibility,
            status: ann.status || 'active',
            date: new Date(ann.date || Date.now()),
            validFrom: ann.validFrom || null,
            validUntil: ann.validUntil || null,
            views: ann.views || 0,
            reactions: {
              create: Object.entries(ann.reactions || {}).flatMap(([type, count]) => 
                Array(count as number).fill({ type })
              )
            },
            comments: {
              create: (ann.comments || []).map((c: any) => ({
                author: c.author,
                avatar: c.avatar,
                text: c.text,
                date: new Date(c.date || Date.now()),
                likes: c.likes || 0
              }))
            }
          }
        });
      }
      // Rename file to prevent re-seeding
      fs.renameSync(dataFilePath, dataFilePath + '.migrated');
      console.log('Migrated legacy announcements to PostgreSQL');
    } catch (e) {
      console.error('Error seeding legacy announcements:', e);
    }
  }
}

export async function getAnnouncements(incrementViews = false) {
  try {
    const count = await prisma.announcement.count();
    if (count === 0) {
      await seedFromLegacy();
    }

    if (incrementViews) {
      await prisma.announcement.updateMany({
        where: { status: 'active', visibility: 'Public (Visible to all)' },
        data: { views: { increment: 1 } }
      });
    }

    const records = await prisma.announcement.findMany({
      include: {
        reactions: true,
        comments: true
      },
      orderBy: { date: 'desc' }
    });

    const formatted = records.map(record => {
      // Aggregate reactions
      const reactionCounts = { like: 0, heart: 0, pray: 0 };
      record.reactions.forEach(r => {
        if (r.type === 'like') reactionCounts.like++;
        else if (r.type === 'heart') reactionCounts.heart++;
        else if (r.type === 'pray') reactionCounts.pray++;
      });

      return {
        id: record.id,
        title: record.title,
        content: record.content,
        category: record.category,
        badge: record.badge,
        visibility: record.visibility,
        status: record.status,
        date: record.date.toISOString(),
        validFrom: record.validFrom,
        validUntil: record.validUntil,
        views: record.views,
        reactions: reactionCounts,
        comments: record.comments.map(c => ({
          id: c.id,
          author: c.author,
          avatar: c.avatar,
          text: c.text,
          date: c.date.toISOString(),
          likes: c.likes
        }))
      };
    });

    return { success: true, announcements: formatted };
  } catch (error: any) {
    console.error('Failed to get announcements from DB:', error);
    return { success: false, error: error.message, announcements: [] };
  }
}

export async function saveAnnouncement(ann: any) {
  try {
    // Only treat as an update when a valid positive integer id is provided.
    // Reject anything that looks like a Date.now() timestamp (> 9_999_999).
    const rawId = ann.id !== undefined && ann.id !== null ? parseInt(ann.id.toString(), 10) : null;
    let recordId: number | null =
      rawId && !isNaN(rawId) && rawId > 0 && rawId < 9_000_000 ? rawId : null;

    if (recordId) {
      // Use findFirst – safe for any field; id is @id so it's inherently unique.
      const exists = await prisma.announcement.findFirst({ where: { id: recordId } });
      if (!exists) recordId = null;
    }

    if (recordId) {
      await prisma.announcement.update({
        where: { id: recordId },
        data: {
          title: ann.title,
          content: ann.content,
          category: ann.category,
          badge: ann.badge || ann.category.toUpperCase().substring(0, 6),
          visibility: ann.visibility,
          status: ann.status || 'active',
          validFrom: ann.validFrom || null,
          validUntil: ann.validUntil || null,
        }
      });
    } else {
      await prisma.announcement.create({
        data: {
          title: ann.title,
          content: ann.content,
          category: ann.category,
          badge: ann.badge || ann.category.toUpperCase().substring(0, 6),
          visibility: ann.visibility,
          status: ann.status || 'active',
          date: new Date(),
          validFrom: ann.validFrom || new Date().toISOString().split('T')[0],
          validUntil: ann.validUntil || null,
          views: 0
        }
      });
    }

    revalidatePath('/admin/announcements');
    revalidatePath('/announcements');
    return { success: true };
  } catch (error: any) {
    // Log the full error server-side only; never expose stack traces to the client.
    console.error('Failed to save announcement:', error);
    return { success: false, error: 'Failed to save announcement. Please try again.' };
  }
}

export async function deleteAnnouncement(id: number) {
  try {
    await prisma.announcement.delete({ where: { id } });
    revalidatePath('/admin/announcements');
    revalidatePath('/announcements');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete announcement:', error);
    return { success: false, error: error.message };
  }
}

export async function toggleAnnouncementStatus(id: number) {
  try {
    const ann = await prisma.announcement.findFirst({ where: { id } });
    if (!ann) throw new Error("Announcement not found");
    await prisma.announcement.update({
      where: { id },
      data: { status: ann.status === 'active' ? 'archived' : 'active' }
    });
    revalidatePath('/admin/announcements');
    revalidatePath('/announcements');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to toggle status:', error);
    return { success: false, error: 'Failed to update announcement status. Please try again.' };
  }
}

export async function addReaction(id: number, type: 'like' | 'heart' | 'pray') {
  try {
    await prisma.announcementReaction.create({
      data: {
        type,
        announcementId: id
      }
    });
    revalidatePath('/announcements');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to add reaction:', error);
    return { success: false, error: error.message };
  }
}

export async function addComment(id: number, comment: { author: string; avatar: string; text: string }) {
  try {
    await prisma.announcementComment.create({
      data: {
        author: comment.author,
        avatar: comment.avatar,
        text: comment.text,
        announcementId: id,
        date: new Date()
      }
    });
    revalidatePath('/announcements');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to add comment:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteComment(annId: number, commentId: number) {
  try {
    await prisma.announcementComment.delete({ where: { id: commentId } });
    revalidatePath('/admin/announcements');
    revalidatePath('/announcements');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to delete comment:', error);
    return { success: false, error: error.message };
  }
}

export async function likeComment(annId: number, commentId: number) {
  try {
    await prisma.announcementComment.update({
      where: { id: commentId },
      data: { likes: { increment: 1 } }
    });
    revalidatePath('/announcements');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to like comment:', error);
    return { success: false, error: error.message };
  }
}
