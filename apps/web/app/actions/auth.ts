'use server';

import crypto from 'crypto';
import { prisma } from '../../lib/prisma';
import { verifyPassword, hashPassword } from '../../lib/crypto';
import {
  createSessionToken,
  setSessionCookie,
  clearSessionCookie,
  verifyAdminSession,
  getCurrentAdmin,
  AdminSession,
} from '../../lib/auth';
import { sendSystemEmail } from '../../lib/email';

export async function loginAdmin(
  email: string,
  password: string,
  rememberMe: boolean = false
) {
  try {
    if (!email || !password) {
      return { success: false, error: 'Please provide both email and password.' };
    }

    const cleanEmail = email.trim().toLowerCase();

    const admin = await prisma.admin.findUnique({
      where: { email: cleanEmail },
    });

    if (!admin) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const isValid = verifyPassword(password, admin.password);
    if (!isValid) {
      // Audit log failed login attempt
      try {
        await prisma.adminAuditLog.create({
          data: {
            activity: `Failed login attempt for ${cleanEmail}`,
            category: 'LOGIN',
            admin: cleanEmail,
            status: 'Failed',
            details: 'Incorrect password entered',
          },
        });
      } catch (logErr) {}

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

    // Generate secure session token and set HTTP-only cookie
    const token = await createSessionToken(
      {
        adminId: admin.id,
        email: admin.email,
        name: admin.name || 'Administrator',
        role: admin.role || 'Super Administrator',
        department: admin.department || undefined,
      },
      rememberMe
    );

    await setSessionCookie(token, rememberMe);

    // Record successful login in audit log
    try {
      await prisma.adminAuditLog.create({
        data: {
          activity: `Administrator ${admin.name || admin.email} logged in`,
          category: 'LOGIN',
          admin: admin.email,
          status: 'Success',
          details: `Session initiated. Remember me: ${rememberMe ? 'Yes (30 days)' : 'No (24 hours)'}`,
        },
      });
    } catch (logErr) {}

    return {
      success: true,
      admin: {
        id: admin.id,
        name: admin.name || 'Administrator',
        email: admin.email,
        role: admin.role,
        department: admin.department,
      },
    };
  } catch (error: any) {
    console.error('Login error:', error);
    return { success: false, error: 'An error occurred during login. Please try again.' };
  }
}

export async function logoutAdmin() {
  try {
    const auth = await verifyAdminSession();
    if (auth.success && auth.session) {
      try {
        await prisma.adminAuditLog.create({
          data: {
            activity: `Administrator ${auth.session.name} logged out`,
            category: 'LOGOUT',
            admin: auth.session.email,
            status: 'Success',
            details: 'Session ended voluntarily',
          },
        });
      } catch (logErr) {}
    }

    await clearSessionCookie();
    return { success: true };
  } catch (error: any) {
    console.error('Logout error:', error);
    await clearSessionCookie();
    return { success: true };
  }
}

export async function getAdminSessionProfile(): Promise<AdminSession | null> {
  return await getCurrentAdmin();
}

export async function verifyAdminPassword(password: string) {
  try {
    const current = await getCurrentAdmin();
    const targetEmail = current?.email || 'admin@jasaan.gov.ph';

    const admin = await prisma.admin.findUnique({
      where: { email: targetEmail },
    });

    if (!admin) return { success: false };
    return { success: verifyPassword(password, admin.password) };
  } catch (error) {
    return { success: false };
  }
}

// ── Password Reset Flow ─────────────────────────────────────────────────────

export async function requestPasswordReset(email: string) {
  try {
    if (!email || !email.trim()) {
      return { success: false, message: 'Please provide an administrator email.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    const admin = await prisma.admin.findUnique({
      where: { email: cleanEmail },
    });

    // To prevent account enumeration, return positive status even if not found
    if (!admin) {
      return {
        success: true,
        message: 'If the email matches an authorized administrator, a 6-digit recovery code has been sent.',
      };
    }

    // Rate-limit check: allow only 1 request per 2 minutes per email
    const recentReset = await prisma.passwordReset.findFirst({
      where: {
        email: cleanEmail,
        createdAt: { gte: new Date(Date.now() - 2 * 60 * 1000) },
      },
    });

    if (recentReset) {
      return {
        success: false,
        message: 'A recovery code was recently sent. Please check your inbox or wait 2 minutes.',
      };
    }

    // Generate random 6-digit recovery token
    const recoveryCode = String(Math.floor(100000 + Math.random() * 900000));
    const tokenHash = crypto.createHash('sha256').update(recoveryCode).digest('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await prisma.passwordReset.create({
      data: {
        email: cleanEmail,
        tokenHash,
        expiresAt,
      },
    });

    // Log to console for dev testing
    console.log(`\n==============================================`);
    console.log(`[ADMIN PASSWORD RESET CODE] Recipient: ${cleanEmail}`);
    console.log(`[ADMIN PASSWORD RESET CODE] Code: ${recoveryCode}`);
    console.log(`==============================================\n`);

    // Dispatch email
    try {
      await sendSystemEmail(
        cleanEmail,
        'Cemetery Administration Account Password Recovery Code',
        `
        <div style="font-family: sans-serif; padding: 20px; background: #0A0800; color: #FFFFFF;">
          <h2 style="color: #D4AF37;">Eternal Rest - Admin Account Recovery</h2>
          <p>A password reset was requested for your administrator account.</p>
          <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px; padding: 15px; background: #1A1710; border: 1px solid #D4AF37; text-align: center; color: #D4AF37; margin: 20px 0;">
            ${recoveryCode}
          </div>
          <p>This code expires in 15 minutes. If you did not initiate this request, please contact MEEDO municipal authorities immediately.</p>
        </div>
        `
      );
    } catch (mailErr) {
      console.warn('Password recovery email sending failed:', mailErr);
    }

    return {
      success: true,
      message: 'If the email matches an authorized administrator, a 6-digit recovery code has been sent.',
    };
  } catch (error: any) {
    console.error('Password reset request error:', error);
    return { success: false, message: 'Failed to process password recovery request.' };
  }
}

export async function resetPasswordWithToken(
  email: string,
  recoveryCode: string,
  newPassword: string
) {
  try {
    if (!email || !recoveryCode || !newPassword) {
      return { success: false, message: 'All fields are required.' };
    }

    if (newPassword.length < 8) {
      return { success: false, message: 'New password must be at least 8 characters long.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    const tokenHash = crypto.createHash('sha256').update(recoveryCode.trim()).digest('hex');

    const resetRecord = await prisma.passwordReset.findFirst({
      where: {
        email: cleanEmail,
        tokenHash,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (!resetRecord) {
      return { success: false, message: 'Invalid or expired recovery code. Please request a new one.' };
    }

    const hashedPassword = hashPassword(newPassword);

    await prisma.admin.update({
      where: { email: cleanEmail },
      data: { password: hashedPassword },
    });

    // Invalidate reset code
    await prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { usedAt: new Date() },
    });

    // Record in audit log
    try {
      await prisma.adminAuditLog.create({
        data: {
          activity: `Password reset via recovery code for ${cleanEmail}`,
          category: 'PASSWORD_CHANGED',
          admin: cleanEmail,
          status: 'Success',
          details: 'Password was successfully reset using a single-use verified token.',
        },
      });
    } catch (logErr) {}

    return {
      success: true,
      message: 'Your administrator password has been updated successfully. Please sign in.',
    };
  } catch (error: any) {
    console.error('Reset password with token error:', error);
    return { success: false, message: 'Failed to reset password. Please try again.' };
  }
}
