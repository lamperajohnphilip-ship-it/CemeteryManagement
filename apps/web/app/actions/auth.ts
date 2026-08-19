'use server';

import { prisma } from '../../lib/prisma';
import { verifyPassword, hashPassword } from '../../lib/crypto';

export async function loginAdmin(email: string, password: string) {
  try {
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const isValid = verifyPassword(password, admin.password);
    if (!isValid) {
      return { success: false, error: 'Invalid email or password.' };
    }

    // Transparent auto-upgrade: Encrypt legacy un-hashed password upon successful sign-in
    if (!admin.password.startsWith('scrypt:')) {
      const encryptedPassword = hashPassword(password);
      await prisma.admin.update({
        where: { id: admin.id },
        data: { password: encryptedPassword },
      });
    }

    return { success: true, name: admin.name, email: admin.email };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'An error occurred during login.' };
  }
}

export async function verifyAdminPassword(password: string) {
  try {
    const admin = await prisma.admin.findUnique({
      where: { email: 'admin@jasaan.gov.ph' },
    });

    if (!admin) return { success: false };
    return { success: verifyPassword(password, admin.password) };
  } catch (error) {
    return { success: false };
  }
}
