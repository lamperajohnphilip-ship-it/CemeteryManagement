'use server';

import { prisma } from '../../lib/prisma';

export async function updateAdminProfile(email: string, newProfile: any) {
  try {
    const admin = await prisma.admin.update({
      where: { email },
      data: {
        name: newProfile.firstName + ' ' + newProfile.lastName,
      },
    });
    return { success: true };
  } catch (error) {
    console.error('Update profile error:', error);
    return { success: false, error: 'An error occurred while updating profile.' };
  }
}

export async function updateAdminPassword(email: string, currentPassword: string, newPassword: string) {
  try {
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin || admin.password !== currentPassword) {
      return { success: false, error: 'Current password is incorrect.' };
    }

    await prisma.admin.update({
      where: { email },
      data: {
        password: newPassword,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Update password error:', error);
    return { success: false, error: 'An error occurred while updating password.' };
  }
}
