import { getBaseUrl, PRODUCTION_API_URL } from '../config/api';

export class ApiError extends Error {
  status?: number;
  url: string;
  isNetworkError: boolean;

  constructor(message: string, url: string, status?: number, isNetworkError = false) {
    super(message);
    this.name = 'ApiError';
    this.url = url;
    this.status = status;
    this.isNetworkError = isNetworkError;
  }
}

interface FetchOptions extends RequestInit {
  timeoutMs?: number;
  customBaseUrl?: string;
}

/**
 * Robust wrapper around fetch with timeout, network error diagnostics, and JSON parsing.
 */
export async function apiFetch<T = any>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { timeoutMs = 12000, customBaseUrl, ...fetchOptions } = options;
  const baseUrl = (customBaseUrl || getBaseUrl()).replace(/\/+$/, '');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const fullUrl = `${baseUrl}${cleanEndpoint}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      ...(fetchOptions.headers as Record<string, string> || {}),
    };

    if (fetchOptions.body && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(fullUrl, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type') || '';
    let responseData: any = null;

    if (contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      const text = await response.text();
      try {
        responseData = JSON.parse(text);
      } catch {
        responseData = { text };
      }
    }

    if (!response.ok) {
      const errorMsg =
        responseData?.error ||
        responseData?.message ||
        `Server returned status ${response.status} (${response.statusText || 'Error'})`;
      throw new ApiError(errorMsg, fullUrl, response.status, false);
    }

    return responseData as T;
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error.name === 'AbortError') {
      throw new ApiError(
        `Connection timed out (${timeoutMs / 1000}s). The cemetery server at ${baseUrl} took too long to respond.`,
        fullUrl,
        undefined,
        true
      );
    }

    // Network request failure (e.g. TypeError: Failed to fetch / Network request failed)
    const originalMsg = error?.message || 'Network request failed';
    throw new ApiError(
      `Unable to reach cemetery server at ${baseUrl}. Please check that the server is running and accessible over your network (${originalMsg}).`,
      fullUrl,
      undefined,
      true
    );
  }
}

// ─────────────────────────────────────────────────────────────────
// API Service Methods
// ─────────────────────────────────────────────────────────────────

export interface DeceasedRecord {
  id: string;
  ref: string;
  payor: string;
  contact: string;
  deceased: string;
  address: string;
  birthDate: string;
  deathDate: string;
  yearPaid: string;
  totalAmount: number;
  amountPaid: number;
  balance: number;
  paymentStatus: string;
  remarks: string;
  gender: string;
  civilStatus: string;
  nationality: string;
  [key: string]: any;
}

/**
 * Fetches deceased records from /api/deceased
 */
export async function getDeceasedRecords(baseUrl?: string): Promise<DeceasedRecord[]> {
  const data = await apiFetch<{ success: boolean; records: any[] }>('/api/deceased', {
    customBaseUrl: baseUrl,
  });

  if (!data || !data.records || !Array.isArray(data.records)) {
    return [];
  }

  return data.records.map((r: any) => ({
    id: r.id,
    ref: r.REF_NO || r.ref || '',
    payor: r.PAYORS_NAME || r.payor || '-',
    contact: r.CONTACT_NO || r.contact || '-',
    deceased: r.NAME_OF_DECEASED || r.deceased || 'Unknown',
    address: r.ADDRESS || r.address || '-',
    birthDate: r.DATE_OF_BIRTH ? (new Date(r.DATE_OF_BIRTH).toISOString().split('T')[0] || '') : '',
    deathDate: r.DATE_OF_DEATH ? (new Date(r.DATE_OF_DEATH).toISOString().split('T')[0] || '') : '',
    yearPaid: r.YEAR?.toString() || '',
    totalAmount: r.TOTAL_DUE ?? 0,
    amountPaid: r.PAID ?? 0,
    balance: r.BALANCE ?? 0,
    paymentStatus: (r.STATUS || 'pending').toLowerCase(),
    remarks: r.REMARKS || '',
    gender: 'Male', // Default fallback
    civilStatus: 'Single',
    nationality: 'Filipino',
  }));
}

/**
 * Fetches public system settings (maintenance mode, features enabled, etc.)
 */
export async function getPublicSettings(baseUrl?: string) {
  return await apiFetch<any>('/api/settings/public', {
    customBaseUrl: baseUrl,
    timeoutMs: 8000,
  });
}

/**
 * Fetches published announcements
 */
export async function getAnnouncements(incrementViews = false, baseUrl?: string) {
  const data = await apiFetch<{ success: boolean; announcements: any[] }>(
    `/api/announcements?incrementViews=${incrementViews}`,
    { customBaseUrl: baseUrl }
  );
  return data?.announcements || [];
}

/**
 * Tracks an inquiry by Application Reference ID and contact info
 */
export async function trackInquiry(appId: string, contact: string, baseUrl?: string) {
  const endpoint = `/api/inquiries?appId=${encodeURIComponent(appId.trim())}&email=${encodeURIComponent(contact.trim())}`;
  return await apiFetch<{ success: boolean; inquiry?: any; message?: string }>(endpoint, {
    customBaseUrl: baseUrl,
  });
}

/**
 * Fetches booked slots for a given month (YYYY-MM)
 */
export async function getScheduleSlots(month: string, baseUrl?: string) {
  const data = await apiFetch<{ success: boolean; schedules?: any[] }>(`/api/schedules?month=${month}`, {
    customBaseUrl: baseUrl,
  });
  return data?.schedules || [];
}

/**
 * Sends email verification OTP code
 */
export async function sendEmailVerification(email: string, baseUrl?: string) {
  return await apiFetch<{ success: boolean; message?: string }>('/api/email/send-verification', {
    method: 'POST',
    body: JSON.stringify({ email }),
    customBaseUrl: baseUrl,
  });
}

/**
 * Verifies email OTP code
 */
export async function verifyEmailCode(email: string, code: string, baseUrl?: string) {
  return await apiFetch<{ success: boolean; message?: string }>('/api/email/verify', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
    customBaseUrl: baseUrl,
  });
}

/**
 * Submits a new inquiry/burial application
 */
export async function submitInquiry(payload: any, baseUrl?: string) {
  return await apiFetch<{ success: boolean; inquiry?: any; message?: string }>('/api/inquiries', {
    method: 'POST',
    body: JSON.stringify(payload),
    customBaseUrl: baseUrl,
  });
}

/**
 * Submits citizen feedback / rating
 */
export async function submitFeedback(payload: any, baseUrl?: string) {
  return await apiFetch<{ success: boolean; message?: string }>('/api/feedback', {
    method: 'POST',
    body: JSON.stringify(payload),
    customBaseUrl: baseUrl,
  });
}

/**
 * Checks connectivity to the given API base URL
 */
export async function testApiConnectivity(urlToCheck?: string): Promise<{ ok: boolean; statusText: string; url: string }> {
  const target = (urlToCheck || getBaseUrl()).replace(/\/+$/, '');
  try {
    const res = await apiFetch('/api/settings/public', {
      customBaseUrl: target,
      timeoutMs: 6000,
    });
    return { ok: true, statusText: 'Online', url: target };
  } catch (e: any) {
    return { ok: false, statusText: e.message || 'Offline', url: target };
  }
}
