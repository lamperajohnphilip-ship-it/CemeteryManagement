/**
 * SMS Utility Functions — Pure client-safe helpers (no 'use server').
 * These are used by both the client (sms/page.tsx) and the server (actions/sms.ts).
 */

/**
 * Normalizes Philippine mobile numbers to Semaphore's standard format (09XXXXXXXXX).
 * Accepts:
 *   '09171234567'      -> '09171234567'
 *   '+639171234567'    -> '09171234567'
 *   '639171234567'     -> '09171234567'
 *   '9171234567'       -> '09171234567'
 */
export function normalizePhilippineNumber(phone: string): string {
  if (!phone) return '';
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '').trim();

  if (cleaned.startsWith('+63')) {
    return '0' + cleaned.substring(3);
  }
  if (cleaned.startsWith('63') && cleaned.length === 12) {
    return '0' + cleaned.substring(2);
  }
  if (cleaned.startsWith('9') && cleaned.length === 10) {
    return '0' + cleaned;
  }
  return cleaned;
}

/**
 * Validates whether a phone number is a valid 11-digit Philippine mobile number starting with 09.
 */
export function isValidPhilippineNumber(phone: string): boolean {
  const normalized = normalizePhilippineNumber(phone);
  return /^09\d{9}$/.test(normalized);
}

/**
 * Calculates character count and GSM SMS segments.
 * 1 segment  = up to 160 characters (GSM 7-bit standard)
 * Multi-part = 153 characters per segment due to UDH header
 */
export function calculateSmsSegments(message: string): { chars: number; segments: number; maxChars: number } {
  const chars = (message || '').length;
  if (chars <= 160) {
    return { chars, segments: chars > 0 ? 1 : 0, maxChars: 160 };
  }
  const segments = Math.ceil(chars / 153);
  return { chars, segments, maxChars: segments * 153 };
}
