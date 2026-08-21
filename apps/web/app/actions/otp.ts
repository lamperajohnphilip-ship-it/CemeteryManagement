'use server';

import { sendVerificationOtpEmail } from '../../lib/email';

interface OtpEntry {
  code: string;
  expiresAt: number;
  attempts: number;
}

// In-memory OTP storage (global across server actions in same instance)
const otpStore = new Map<string, OtpEntry>();

// Clean up expired OTPs periodically
function cleanupExpiredOtps() {
  const now = Date.now();
  for (const [key, value] of otpStore.entries()) {
    if (value.expiresAt < now) {
      otpStore.delete(key);
    }
  }
}

/**
 * Sends a 6-digit verification code to the specified email address.
 */
export async function sendEmailOtp(email: string, name?: string) {
  try {
    cleanupExpiredOtps();

    if (!email || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return { success: false, message: 'Please provide a valid email address.' };
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check rate limit: if an active code was created less than 45 seconds ago
    const existing = otpStore.get(cleanEmail);
    if (existing && existing.expiresAt - Date.now() > 9 * 60 * 1000 + 15 * 1000) {
      return { success: false, message: 'Please wait 45 seconds before requesting another code.' };
    }

    // Generate random 6-digit numeric code
    const otpCode = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    otpStore.set(cleanEmail, {
      code: otpCode,
      expiresAt,
      attempts: 0,
    });

    const emailResult = await sendVerificationOtpEmail(cleanEmail, otpCode, name);

    if (emailResult.success) {
      return {
        success: true,
        message: `A 6-digit verification code has been sent to ${cleanEmail}. Please check your inbox.`,
      };
    } else if (emailResult.unconfigured) {
      // In dev or if unconfigured, also return a helpful fallback so development/testing is not blocked
      console.warn(`[DEV OTP Fallback] Code for ${cleanEmail} is: ${otpCode}`);
      return {
        success: true,
        devFallback: true,
        debugCode: otpCode,
        message: `Verification code generated (${otpCode}). (Email delivery paused: Gmail credentials not yet set in .env).`,
      };
    } else {
      return {
        success: false,
        message: `Failed to send email: ${emailResult.error || 'Please check your email address.'}`,
      };
    }
  } catch (error: any) {
    console.error('Error generating email OTP:', error);
    return { success: false, message: error.message || 'An error occurred while generating code.' };
  }
}

/**
 * Verifies a 6-digit verification code for an email address.
 */
export async function verifyEmailOtp(email: string, inputCode: string) {
  try {
    cleanupExpiredOtps();

    if (!email || !inputCode) {
      return { success: false, message: 'Email and verification code are required.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = inputCode.trim().replace(/\s+/g, '');

    const record = otpStore.get(cleanEmail);

    if (!record) {
      return {
        success: false,
        message: 'No verification code found for this email or it has expired. Please request a new code.',
      };
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(cleanEmail);
      return {
        success: false,
        message: 'Verification code has expired. Please request a new code.',
      };
    }

    if (record.attempts >= 5) {
      otpStore.delete(cleanEmail);
      return {
        success: false,
        message: 'Too many incorrect attempts. Please request a new verification code.',
      };
    }

    if (record.code !== cleanCode) {
      record.attempts += 1;
      return {
        success: false,
        message: `Incorrect verification code. (${5 - record.attempts} attempts remaining).`,
      };
    }

    // Success: Remove OTP to prevent reuse
    otpStore.delete(cleanEmail);

    return {
      success: true,
      message: '✅ Email verified successfully!',
    };
  } catch (error: any) {
    console.error('Error verifying email OTP:', error);
    return { success: false, message: error.message || 'Verification failed.' };
  }
}
