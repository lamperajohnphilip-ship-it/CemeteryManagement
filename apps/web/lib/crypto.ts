import crypto from 'crypto';

/**
 * Hashes a password using Node.js crypto (scrypt algorithm + random 16-byte salt).
 * Output format: "scrypt:<salt>:<hash>"
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `scrypt:${salt}:${derivedKey.toString('hex')}`;
}

/**
 * Verifies a plaintext password against a stored password.
 * Supports:
 * - Scrypt salted hash ("scrypt:salt:hash")
 * - Plaintext fallback (for backwards compatibility / initial seeded accounts)
 */
export function verifyPassword(password: string, storedPassword: string): boolean {
  if (!storedPassword || !password) return false;

  // 1. Check if stored password is an scrypt hash
  if (storedPassword.startsWith('scrypt:')) {
    const parts = storedPassword.split(':');
    if (parts.length !== 3) return false;
    const salt = parts[1];
    const originalHash = parts[2];
    if (!salt || !originalHash) return false;

    const derivedKey = crypto.scryptSync(password, salt, 64);
    const keyBuffer = Buffer.from(derivedKey.toString('hex'), 'hex');
    const origBuffer = Buffer.from(originalHash, 'hex');

    if (keyBuffer.length !== origBuffer.length) return false;
    return crypto.timingSafeEqual(keyBuffer, origBuffer);
  }

  // 2. Fallback to constant-time plaintext comparison (for unhashed seed passwords)
  const bufA = Buffer.from(password);
  const bufB = Buffer.from(storedPassword);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}
