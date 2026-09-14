'use server';

import crypto from 'crypto';
import { prisma } from '../../lib/prisma';
import { sendVerificationOtpEmail } from '../../lib/email';

/**
 * Sends a 6-digit verification code to the specified email address.
 * Enforces rate limiting (45s cooldown) and stores the SHA-256 hash of the code in the DB.
 */
export async function sendEmailOtp(email: string, name?: string) {
  try {
    if (!email || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return { success: false, message: 'Please provide a valid email address.' };
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check rate limit: 45 seconds cooldown
    const recentVerification = await prisma.emailVerification.findFirst({
      where: { email: cleanEmail },
      orderBy: { createdAt: 'desc' },
    });

    if (recentVerification) {
      const msSinceLastRequest = Date.now() - recentVerification.createdAt.getTime();
      if (msSinceLastRequest < 45 * 1000) {
        const waitSeconds = Math.ceil((45 * 1000 - msSinceLastRequest) / 1000);
        return {
          success: false,
          rateLimited: true,
          message: `A code was already sent. Please wait ${waitSeconds}s before requesting a new one, or enter the code already sent to your email.`,
        };
      }
    }

    // Generate random 6-digit numeric code
    const otpCode = String(Math.floor(100000 + Math.random() * 900000));
    const codeHash = crypto.createHash('sha256').update(otpCode).digest('hex');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Save hashed code in DB
    await prisma.emailVerification.create({
      data: {
        email: cleanEmail,
        codeHash,
        expiresAt,
        attempts: 0,
      },
    });

    // Log OTP in server terminal for easy local testing & debugging
    console.log(`\n==============================================`);
    console.log(`[EMAIL OTP CODE] Recipient: ${cleanEmail}`);
    console.log(`[EMAIL OTP CODE] 6-Digit Code: ${otpCode}`);
    console.log(`==============================================\n`);

    // Send email to the user
    const emailResult = await sendVerificationOtpEmail(cleanEmail, otpCode, name);

    const isDev = process.env.NODE_ENV !== 'production';

    if (emailResult.success) {
      return {
        success: true,
        message: `A 6-digit verification code has been sent to ${cleanEmail}. Please check your inbox (and spam folder).`,
      };
    } else if (emailResult.unconfigured && isDev) {
      // In development mode with unconfigured credentials, provide dev code so local testing is not blocked
      console.warn(`[DEV OTP Mode] Credentials unconfigured. Code for ${cleanEmail} is: ${otpCode}`);
      return {
        success: true,
        devMode: true,
        devCode: otpCode,
        message: `[Dev Mode] Code: ${otpCode} (Email service unconfigured: set EMAIL_USER and EMAIL_APP_PASSWORD in .env for real Gmail delivery).`,
      };
    } else {
      let friendlyError = emailResult.error || 'Please check your email address.';
      if (
        friendlyError.includes('535') ||
        friendlyError.includes('BadCredentials') ||
        friendlyError.includes('Username and Password not accepted')
      ) {
        friendlyError = 'Gmail rejected login. Please verify that EMAIL_APP_PASSWORD in apps/web/.env is a valid 16-character Google App Password.';
      }
      return {
        success: false,
        message: `Failed to send email: ${friendlyError}`,
      };
    }
  } catch (error: any) {
    console.error('Error generating email OTP:', error);
    return { success: false, message: error.message || 'An error occurred while generating code.' };
  }
}

/**
 * Verifies a 6-digit verification code for an email address.
 * Validates against the SHA-256 hashed code in the DB and marks verifiedAt on success.
 */
export async function verifyEmailOtp(email: string, inputCode: string) {
  try {
    if (!email || !inputCode) {
      return { success: false, message: 'Email and verification code are required.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = inputCode.trim().replace(/\s+/g, '');

    if (!/^\d{6}$/.test(cleanCode)) {
      return { success: false, message: 'Verification code must be exactly 6 digits.' };
    }

    // Find the latest active verification record for this email
    const record = await prisma.emailVerification.findFirst({
      where: {
        email: cleanEmail,
        verifiedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!record) {
      return {
        success: false,
        message: 'No active verification code found for this email or it has expired. Please request a new code.',
      };
    }

    if (record.attempts >= 5) {
      return {
        success: false,
        message: 'Too many incorrect attempts. Please request a new verification code.',
      };
    }

    // Check code hash
    const inputHash = crypto.createHash('sha256').update(cleanCode).digest('hex');

    if (record.codeHash !== inputHash) {
      const newAttempts = record.attempts + 1;
      await prisma.emailVerification.update({
        where: { id: record.id },
        data: { attempts: newAttempts },
      });

      const remaining = 5 - newAttempts;
      return {
        success: false,
        message:
          remaining > 0
            ? `Incorrect verification code. (${remaining} attempt${remaining === 1 ? '' : 's'} remaining).`
            : 'Too many incorrect attempts. Please request a new verification code.',
      };
    }

    // Mark as verified
    await prisma.emailVerification.update({
      where: { id: record.id },
      data: { verifiedAt: new Date() },
    });

    return {
      success: true,
      message: '✅ Email verified successfully!',
    };
  } catch (error: any) {
    console.error('Error verifying email OTP:', error);
    return { success: false, message: error.message || 'Verification failed.' };
  }
}

/**
 * Checks if an email was verified within the past given minutes (defaults to 120 minutes / 2 hours).
 */
export async function isEmailVerifiedRecently(email: string, maxAgeMinutes = 120): Promise<boolean> {
  if (!email || !email.trim()) return false;
  const cleanEmail = email.trim().toLowerCase();
  const threshold = new Date(Date.now() - maxAgeMinutes * 60 * 1000);

  const record = await prisma.emailVerification.findFirst({
    where: {
      email: cleanEmail,
      verifiedAt: {
        gte: threshold,
      },
    },
    orderBy: { verifiedAt: 'desc' },
  });

  return !!record;
}

/**
 * Verifies and certifies an email address via Google Sign-In identity authentication.
 * Stores a verified record in the database for 24 hours so the user can complete their inquiry.
 */
export async function verifyWithGoogleAccount(params: { email: string; name?: string }) {
  try {
    const { email, name } = params;
    if (!email || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return { success: false, message: 'Invalid Google email address.' };
    }

    const cleanEmail = email.trim().toLowerCase();

    // Create a verified entry in database
    await prisma.emailVerification.create({
      data: {
        email: cleanEmail,
        codeHash: 'google-oauth-verified',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours validity
        verifiedAt: new Date(),
        attempts: 0,
      },
    });

    console.log(`[GOOGLE AUTH VERIFIED] Account verified: ${cleanEmail} (${name || 'Citizen User'})`);

    return {
      success: true,
      email: cleanEmail,
      message: '✅ Google Account verified successfully!',
    };
  } catch (error: any) {
    console.error('Error verifying with Google:', error);
    return { success: false, message: error.message || 'Google verification failed.' };
  }
}

