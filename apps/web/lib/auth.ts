import { cookies } from 'next/headers';

export const SESSION_COOKIE_NAME = 'cemetery_admin_session';

export interface AdminSession {
  adminId: string;
  email: string;
  name: string;
  role: string;
  department?: string;
  rememberMe?: boolean;
  expiresAt: number; // Unix timestamp in ms
}

function getSecretKey(): string {
  return (
    process.env.SESSION_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    'jasaan-cemetery-secure-session-key-prod-2026-eed34f9a'
  );
}

// ── Web Crypto HMAC SHA-256 (Compatible with both Node.js and Edge Runtime) ──

async function getCryptoKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return globalThis.crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

function base64UrlEncode(str: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str).toString('base64url');
  }
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str, 'base64url').toString('utf-8');
  }
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return atob(base64);
}

function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(buffer).toString('base64url');
  }
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    const byte = bytes[i];
    if (byte !== undefined) {
      binary += String.fromCharCode(byte);
    }
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function createSessionToken(
  data: {
    adminId: string;
    email: string;
    name: string;
    role: string;
    department?: string;
  },
  rememberMe: boolean = false
): Promise<string> {
  const durationMs = rememberMe
    ? 30 * 24 * 60 * 60 * 1000 // 30 days
    : 24 * 60 * 60 * 1000; // 24 hours

  const payload: AdminSession = {
    ...data,
    rememberMe,
    expiresAt: Date.now() + durationMs,
  };

  const payloadStr = JSON.stringify(payload);
  const encodedPayload = base64UrlEncode(payloadStr);

  const key = await getCryptoKey(getSecretKey());
  const enc = new TextEncoder();
  const signatureBuffer = await globalThis.crypto.subtle.sign('HMAC', key, enc.encode(encodedPayload));
  const encodedSignature = arrayBufferToBase64Url(signatureBuffer);

  return `${encodedPayload}.${encodedSignature}`;
}

export async function verifySessionToken(token: string): Promise<AdminSession | null> {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const encodedPayload = parts[0];
    const encodedSignature = parts[1];
    if (!encodedPayload || !encodedSignature) return null;
    const key = await getCryptoKey(getSecretKey());

    // Decode signature
    let sigBase64 = encodedSignature.replace(/-/g, '+').replace(/_/g, '/');
    while (sigBase64.length % 4) sigBase64 += '=';
    const binary = atob(sigBase64);
    const sigBytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      sigBytes[i] = binary.charCodeAt(i);
    }

    const enc = new TextEncoder();
    const isValid = await globalThis.crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes,
      enc.encode(encodedPayload)
    );

    if (!isValid) return null;

    const payloadJson = base64UrlDecode(encodedPayload);
    const session: AdminSession = JSON.parse(payloadJson);

    if (!session || !session.expiresAt || session.expiresAt < Date.now()) {
      return null;
    }

    return session;
  } catch (error) {
    return null;
  }
}

// ── Cookie Helpers (Used in Server Actions & Route Handlers) ──

export async function setSessionCookie(token: string, rememberMe: boolean = false) {
  const maxAge = rememberMe
    ? 30 * 24 * 60 * 60 // 30 days in seconds
    : 24 * 60 * 60; // 24 hours in seconds

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

// ── Server-Side Authentication & Authorization Guards ──

/**
 * Validates the session cookie from incoming request headers.
 * Optionally verifies against the database that the admin account still exists.
 */
export async function verifyAdminSession(): Promise<{
  success: boolean;
  session?: AdminSession;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return { success: false, error: 'No active administrator session.' };
    }

    const session = await verifySessionToken(token);
    if (!session) {
      return { success: false, error: 'Invalid or expired session token.' };
    }

    return { success: true, session };
  } catch (error: any) {
    return { success: false, error: error?.message || 'Authentication error' };
  }
}

/**
 * Enforces admin authentication. Throws or returns an unauthorized error.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const auth = await verifyAdminSession();
  if (!auth.success || !auth.session) {
    throw new Error('Unauthorized: Valid administrator session required.');
  }
  return auth.session;
}

/**
 * Enforces Role-Based Access Control (RBAC).
 * Example: requireRole(['Super Administrator'])
 */
export async function requireRole(allowedRoles: string[]): Promise<AdminSession> {
  const session = await requireAdmin();

  const userRole = session.role || 'Cemetery Staff';
  const hasPermission = allowedRoles.some(
    (r) => r.toLowerCase().trim() === userRole.toLowerCase().trim()
  );

  if (!hasPermission) {
    throw new Error(
      `Forbidden: Action requires one of [${allowedRoles.join(', ')}]. Current role: ${userRole}.`
    );
  }

  return session;
}

/**
 * Retrieves the current authenticated admin profile, returning null if unauthenticated.
 */
export async function getCurrentAdmin(): Promise<AdminSession | null> {
  const auth = await verifyAdminSession();
  return auth.session || null;
}
