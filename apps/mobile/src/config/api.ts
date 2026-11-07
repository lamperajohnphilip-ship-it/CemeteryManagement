import { Platform } from 'react-native';
import Constants from 'expo-constants';

export const PRODUCTION_API_URL = 'https://cemetery-management-web.vercel.app';
export const DEFAULT_LOCAL_PORT = 3000;

// Runtime override (allows switching between local dev server and deployed production backend)
let runtimeApiUrlOverride: string | null = null;

export function setApiUrlOverride(url: string | null) {
  runtimeApiUrlOverride = url ? url.replace(/\/+$/, '') : null;
}

export function getApiUrlOverride(): string | null {
  return runtimeApiUrlOverride;
}

/**
 * Resolves the appropriate Base API URL for the current runtime environment.
 * Priority order:
 * 1. Runtime override (if user selected fallback or configured manual URL)
 * 2. EXPO_PUBLIC_API_URL environment variable
 * 3. Browser environment (Platform.OS === 'web')
 * 4. Expo Go / Dev Client host detection from Metro server IP
 * 5. Production deployed backend (cemetery-management-web.vercel.app)
 */
export function getBaseUrl(): string {
  if (runtimeApiUrlOverride) {
    return runtimeApiUrlOverride;
  }

  // 1. Explicit environment variable
  const envApiUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envApiUrl && envApiUrl.trim().length > 0) {
    return envApiUrl.trim().replace(/\/+$/, '');
  }

  // 2. Web browser platform
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `http://localhost:${DEFAULT_LOCAL_PORT}`;
    }
    if (window.location.origin && !window.location.origin.includes(':8081')) {
      return window.location.origin;
    }
  }

  // 3. Expo Go / Native Dev Client — extract dev machine IP from Expo host URI
  const rawHost =
    Constants.expoConfig?.hostUri ||
    (Constants as any).expoGoConfig?.debuggerHost ||
    (Constants as any).manifest2?.extra?.expoGo?.debuggerHost ||
    (Constants as any).manifest?.debuggerHost;

  let hostIp = '';
  if (rawHost && typeof rawHost === 'string') {
    hostIp = rawHost.split(':')[0] || '';
  } else if (Constants.linkingUri && typeof Constants.linkingUri === 'string') {
    // linkingUri can be "exp://192.168.1.13:8081"
    const match = Constants.linkingUri.match(/\/\/([^:/]+)/);
    if (match && match[1]) {
      hostIp = match[1];
    }
  }

  // Avoid VirtualBox / VMware host-only network (192.168.56.x is unreachable from physical phones)
  if (hostIp && !hostIp.startsWith('192.168.56.') && hostIp !== 'localhost' && hostIp !== '127.0.0.1') {
    return `http://${hostIp}:${DEFAULT_LOCAL_PORT}`;
  }

  // If host is localhost/127.0.0.1 (e.g. running on emulator)
  if (hostIp === 'localhost' || hostIp === '127.0.0.1') {
    // Android emulator special alias for host 127.0.0.1 is 10.0.2.2
    if (Platform.OS === 'android') {
      return `http://10.0.2.2:${DEFAULT_LOCAL_PORT}`;
    }
    return `http://localhost:${DEFAULT_LOCAL_PORT}`;
  }

  // 4. Default fallback to deployed production backend
  return PRODUCTION_API_URL;
}

export const BASE_URL = getBaseUrl();
