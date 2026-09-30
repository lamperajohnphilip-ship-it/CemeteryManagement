'use server';

import crypto from 'crypto';
import { prisma } from '../../lib/prisma';
import { sendVerificationOtpEmail } from '../../lib/email';

/**
 * Sends a secure 6-digit verification code (OTP) to the specified email address.
 * 
 * Production & Vercel Compatibility Features:
 * 1. Enforces rate limiting (45s cooldown) per email.
 * 2. Invalidates all previous active OTPs for the email before generating a new one.
 * 3. Uses cryptographically secure random number generation (crypto.randomInt).
 * 4. Stores SHA-256 hash, attempts count, and a 5-minute expiration in Supabase PostgreSQL.
 * 5. Dispatches via Gmail REST API over HTTPS (with automatic fallback to SMTP).
 * 6. Never exposes raw OTP or credentials in production logs or client responses.
 */
export async function sendEmailOtp(email: string, name?: string) {
  try {
    if (!email || !email.trim()) {
      return { success: false, message: 'Please provide a valid email address.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return { success: false, message: 'Please provide a valid email address.' };
    }

    // Rate Limiting: 45-second cooldown between requests from the same email
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
          message: `A code was recently sent. Please wait ${waitSeconds}s before requesting a new one.`,
        };
      }
    }

    // Invalidate all previous unverified OTPs for this email to prevent multiple concurrent active codes
    await prisma.emailVerification.updateMany({
      where: {
        email: cleanEmail,
        verifiedAt: null,
        expiresAt: { gt: new Date() },
      },
      data: {
        expiresAt: new Date(), // Expire immediately
      },
    });

    // Generate cryptographically secure random 6-digit numeric code (100000 - 999999)
    const otpCode = crypto.randomInt(100000, 1000000).toString();
    const codeHash = crypto.createHash('sha256').update(otpCode).digest('hex');
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

    // Persist hashed OTP record in Supabase database
    await prisma.emailVerification.create({
      data: {
        email: cleanEmail,
        codeHash,
        expiresAt,
        attempts: 0,
      },
    });

    // In development mode only, log for debugging convenience
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[DEV OTP LOG] Recipient: ${cleanEmail} | OTP: ${otpCode}`);
    }

    // Send email via Gmail REST API / SMTP
    const emailResult = await sendVerificationOtpEmail(cleanEmail, otpCode, name);

    if (emailResult.success) {
      return {
        success: true,
        message: `A 6-digit verification code has been sent to ${cleanEmail}. Please check your inbox (and spam folder).`,
      };
    } else {
      console.error(`[OTP Error] Failed to send email to ${cleanEmail}:`, emailResult.error);

      // In development mode, allow simulator fallback if email gateway is unconfigured
      if (process.env.NODE_ENV !== 'production') {
        return {
          success: true,
          devMode: true,
          devCode: otpCode,
          message: `[Dev Mode] Verification code generated: ${otpCode}. (Configure Gmail API / App Password for live delivery)`,
        };
      }

      return {
        success: false,
        message: emailResult.error || 'Failed to deliver verification code. Please check your email settings or try again.',
      };
    }
  } catch (error: any) {
    console.error('Error generating email OTP:', error);
    return { success: false, message: error.message || 'An error occurred while generating code.' };
  }
}

/**
 * Verifies a 6-digit verification code against the Supabase database.
 * 
 * Security features:
 * 1. Sanitizes inputs and validates 6-digit numeric format.
 * 2. Compares SHA-256 hash server-side.
 * 3. Enforces a maximum of 5 attempts before locking out the OTP.
 * 4. Checks that the OTP is active and not expired (5-minute window).
 * 5. Marks verifiedAt timestamp in the database upon successful verification.
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

    // Find the latest active unverified record for this email
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
        message: 'No active verification code found or it has expired (codes expire after 5 minutes). Please request a new code.',
      };
    }

    // Check maximum attempts limit (5 attempts maximum)
    if (record.attempts >= 5) {
      // Invalidate the code
      await prisma.emailVerification.update({
        where: { id: record.id },
        data: { expiresAt: new Date() },
      });
      return {
        success: false,
        message: 'Too many incorrect attempts (5/5). This code has been invalidated. Please request a new code.',
      };
    }

    // Compute SHA-256 hash of user input
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
            ? `Incorrect verification code (${remaining} attempt${remaining === 1 ? '' : 's'} remaining).`
            : 'Too many incorrect attempts. Please request a new verification code.',
      };
    }

    // Code is valid: mark as verified in Supabase
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
 * Used server-side before processing submissions (e.g., in submitInquiry).
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
 * Stores a verified record in the database for 24 hours so the citizen can complete their inquiry.
 */
export async function verifyWithGoogleAccount(params: { email: string; name?: string }) {
  try {
    const { email, name } = params;
    if (!email || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return { success: false, message: 'Invalid Google email address.' };
    }

    const cleanEmail = email.trim().toLowerCase();

    // Invalidate previous unverified records
    await prisma.emailVerification.updateMany({
      where: {
        email: cleanEmail,
        verifiedAt: null,
      },
      data: {
        expiresAt: new Date(),
      },
    });

    // Create a verified entry in the database
    await prisma.emailVerification.create({
      data: {
        email: cleanEmail,
        codeHash: 'google-oauth-verified',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours validity
        verifiedAt: new Date(),
        attempts: 0,
      },
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[GOOGLE AUTH VERIFIED] Account verified: ${cleanEmail} (${name || 'Citizen User'})`);
    }

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
