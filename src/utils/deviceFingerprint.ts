import { Device } from '@capacitor/device';
import { Capacitor } from '@capacitor/core';
import NativeHardwareId from '../plugins/hardwareId';

/**
 * Client-Side Device Fingerprint Generator
 * Integrates Capacitor Native Device info for Mobile Apps (Android/iOS)
 * and WebGL/Canvas Fingerprinting for Web Browsers.
 */

const STORAGE_DEVICE_ID_KEY = 'bach_device_unique_id_v2';
const STORAGE_SAVED_IMEI_KEY = 'bach_device_saved_imei';

/**
 * Fast string hash using cyrb53
 */
function cyrb53(str: string, seed = 0): string {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).toUpperCase();
}

/**
 * Collects WebGL GPU Renderer & Vendor
 */
function getWebGLFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext;
    if (!gl) return 'no-webgl';
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return 'no-debug-info';
    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || '';
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
    return `${vendor}~${renderer}`;
  } catch (_) {
    return 'gl-error';
  }
}

/**
 * Canvas Render Fingerprint
 */
function getCanvasFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 240;
    canvas.height = 60;
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'no-2d';

    ctx.textBaseline = 'top';
    ctx.font = "14px 'Arial', sans-serif";
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('BachLicense, 👑 2026', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('BachLicense, 👑 2026', 4, 17);

    return canvas.toDataURL();
  } catch (_) {
    return 'canvas-error';
  }
}

export interface DeviceInfo {
  deviceId: string;
  deviceName: string;
  platform: string;
  screenRes: string;
  gpu: string;
  cores: number;
  imei?: string;
}

/**
 * Retrieves or generates the stable Device Fingerprint ID
 */
export async function getDeviceFingerprint(): Promise<DeviceInfo> {
  let persistentId = '';
  try {
    persistentId = localStorage.getItem(STORAGE_DEVICE_ID_KEY) || '';
  } catch (_) {}

  // 1. Check if Capacitor Native Plugin is available (Android / iOS)
  let nativeId = '';
  let nativeModel = '';
  let nativePlatform = '';
  let nativeManufacturer = '';

  try {
    if (Capacitor.isNativePlatform()) {
      // Ưu tiên 1: Lấy ANDROID_ID thực tế từ Custom Kotlin Plugin
      try {
        const customRes = await NativeHardwareId.getAndroidId();
        if (customRes && customRes.androidId) {
          nativeId = `DEV-${customRes.androidId.toUpperCase().slice(0, 16)}`;
        }
      } catch (customErr) {
        console.debug('[Custom HardwareId Plugin] fallback to standard device:', customErr);
      }

      // Ưu tiên 2: Fallback qua Device Plugin mặc định nếu chưa có
      if (!nativeId) {
        const devIdResult = await Device.getId();
        if (devIdResult && devIdResult.identifier) {
          nativeId = `DEV-${devIdResult.identifier.toUpperCase().slice(0, 16)}`;
        }
      }

      const infoResult = await Device.getInfo();
      if (infoResult) {
        nativeModel = infoResult.model || '';
        nativePlatform = `${infoResult.platform.toUpperCase()} ${infoResult.osVersion || ''}`;
        nativeManufacturer = infoResult.manufacturer || '';
      }
    }
  } catch (capErr) {
    console.debug('[Capacitor Device Plugin] fallback to web fingerprint:', capErr);
  }

  // Collect hardware signals
  const screenRes = `${window.screen?.width || 0}x${window.screen?.height || 0}@${window.devicePixelRatio || 1}`;
  const cores = navigator.hardwareConcurrency || 4;
  const platform = nativePlatform || navigator.platform || 'Unknown OS';
  const language = navigator.language || 'vi';
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Ho_Chi_Minh';
  const gpu = getWebGLFingerprint();
  const canvasData = getCanvasFingerprint();

  const rawFingerprint = [
    screenRes,
    cores,
    platform,
    language,
    timezone,
    gpu,
    canvasData.slice(0, 100)
  ].join('###');

  const hardwareHash = cyrb53(rawFingerprint);

  if (!persistentId) {
    if (nativeId) {
      persistentId = nativeId;
    } else {
      // Generate new unique ID with prefix DEV- using CSPRNG entropy + hardware hash
      let randomHex = '';
      if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
        const bytes = new Uint8Array(6);
        window.crypto.getRandomValues(bytes);
        randomHex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('').toUpperCase().slice(0, 8);
      } else {
        randomHex = Math.random().toString(36).substring(2, 10).toUpperCase();
      }
      persistentId = `DEV-${hardwareHash.slice(0, 8)}-${randomHex}`;
    }
    try {
      localStorage.setItem(STORAGE_DEVICE_ID_KEY, persistentId);
    } catch (_) {}
  }

  // Get user-saved IMEI if any
  let savedImei = '';
  try {
    savedImei = localStorage.getItem(STORAGE_SAVED_IMEI_KEY) || '';
  } catch (_) {}

  // Device friendly name
  let deviceName = 'Máy tính cá nhân';
  if (nativeManufacturer || nativeModel) {
    deviceName = `${nativeManufacturer} ${nativeModel}`.trim();
  } else if (/Android/i.test(navigator.userAgent)) {
    deviceName = 'Thiết bị Android';
  } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    deviceName = 'Thiết bị Apple iOS';
  } else if (/Mac/i.test(navigator.platform)) {
    deviceName = 'Máy tính Mac';
  } else if (/Win/i.test(navigator.platform)) {
    deviceName = 'Máy tính Windows';
  }

  return {
    deviceId: persistentId,
    deviceName,
    platform: `${platform} (${timezone})`,
    screenRes,
    gpu,
    cores,
    imei: savedImei || undefined
  };
}

export function saveUserImei(imei: string): void {
  try {
    if (imei && imei.trim()) {
      localStorage.setItem(STORAGE_SAVED_IMEI_KEY, imei.trim());
    } else {
      localStorage.removeItem(STORAGE_SAVED_IMEI_KEY);
    }
  } catch (_) {}
}

export function getSavedUserImei(): string {
  try {
    return localStorage.getItem(STORAGE_SAVED_IMEI_KEY) || '';
  } catch (_) {
    return '';
  }
}
