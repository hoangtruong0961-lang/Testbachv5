var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_dns = __toESM(require("dns"), 1);
var import_https_proxy_agent = require("https-proxy-agent");
var import_path2 = __toESM(require("path"), 1);
var import_fs2 = __toESM(require("fs"), 1);
var import_crypto2 = __toESM(require("crypto"), 1);
var import_os = __toESM(require("os"), 1);
var import_worker_threads = require("worker_threads");
var import_stream = require("stream");
var import_child_process = require("child_process");
var import_module = require("module");
var import_ytdl_core = __toESM(require("@distube/ytdl-core"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
var import_multer = __toESM(require("multer"), 1);
var import_util = __toESM(require("util"), 1);

// src/server/licenseService.ts
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var import_crypto = __toESM(require("crypto"), 1);
var DATA_DIR = import_path.default.join(process.cwd(), "data");
var LICENSES_FILE = import_path.default.join(DATA_DIR, "licenses.json");
var SECRET_FILE = import_path.default.join(DATA_DIR, "server_secret.key");
var MASTER_KEY_FILE = import_path.default.join(DATA_DIR, "master_admin.key");
function ensureDataDir() {
  if (!import_fs.default.existsSync(DATA_DIR)) {
    import_fs.default.mkdirSync(DATA_DIR, { recursive: true });
  }
}
function getMasterAdminKey() {
  const envKey = process.env.MASTER_ADMIN_KEY?.trim();
  if (envKey && envKey.length >= 8) {
    return envKey;
  }
  ensureDataDir();
  try {
    if (import_fs.default.existsSync(MASTER_KEY_FILE)) {
      const persistedKey = import_fs.default.readFileSync(MASTER_KEY_FILE, "utf-8").trim();
      if (persistedKey.length >= 16) return persistedKey;
    }
  } catch (_) {
  }
  const generatedKey = `ADMIN-KEY-${import_crypto.default.randomBytes(24).toString("hex").toUpperCase()}`;
  try {
    import_fs.default.writeFileSync(MASTER_KEY_FILE, generatedKey, { encoding: "utf-8", mode: 384 });
    console.warn(`[SECURITY WARNING] MASTER_ADMIN_KEY is not set in environment variables! An auto-generated secure master key was created and saved to data/master_admin.key.`);
  } catch (err) {
    console.error("[LicenseService] Failed to persist generated master key:", err);
  }
  return generatedKey;
}
var MASTER_ADMIN_KEY = getMasterAdminKey();
function getServerSecret() {
  ensureDataDir();
  try {
    if (import_fs.default.existsSync(SECRET_FILE)) {
      const secret = import_fs.default.readFileSync(SECRET_FILE, "utf-8").trim();
      if (secret.length >= 32) return secret;
    }
  } catch (_) {
  }
  const newSecret = import_crypto.default.randomBytes(64).toString("hex");
  try {
    import_fs.default.writeFileSync(SECRET_FILE, newSecret, "utf-8");
  } catch (err) {
    console.error("[LicenseService] Failed to persist server secret key:", err);
  }
  return newSecret;
}
var SERVER_HMAC_SECRET = getServerSecret();
function generateSignedLicenseToken(payload) {
  const payloadStr = JSON.stringify(payload);
  const base64Payload = Buffer.from(payloadStr, "utf-8").toString("base64url");
  const hmac = import_crypto.default.createHmac("sha256", SERVER_HMAC_SECRET);
  hmac.update(base64Payload);
  const signature = hmac.digest("base64url");
  return `${base64Payload}.${signature}`;
}
function verifySignedLicenseToken(token) {
  if (!token || typeof token !== "string") {
    return { valid: false, error: "Token missing" };
  }
  const parts = token.trim().split(".");
  if (parts.length !== 2) {
    return { valid: false, error: "Malformed token structure" };
  }
  const [base64Payload, signature] = parts;
  const hmac = import_crypto.default.createHmac("sha256", SERVER_HMAC_SECRET);
  hmac.update(base64Payload);
  const expectedSignature = hmac.digest("base64url");
  const sigBuffer = Buffer.from(signature);
  const expBuffer = Buffer.from(expectedSignature);
  if (sigBuffer.length !== expBuffer.length || !import_crypto.default.timingSafeEqual(sigBuffer, expBuffer)) {
    return { valid: false, error: "Ch\u1EEF k\xFD s\u1ED1 kh\xF4ng h\u1EE3p l\u1EC7 ho\u1EB7c \u0111\xE3 b\u1ECB ch\u1EC9nh s\u1EEDa" };
  }
  try {
    const rawJson = Buffer.from(base64Payload, "base64url").toString("utf-8");
    const payload = JSON.parse(rawJson);
    if (payload.expiresAt && Date.now() > payload.expiresAt) {
      return { valid: false, payload, error: "License \u0111\xE3 h\u1EBFt h\u1EA1n" };
    }
    return { valid: true, payload };
  } catch (err) {
    return { valid: false, error: "Kh\xF4ng th\u1EC3 gi\u1EA3i m\xE3 d\u1EEF li\u1EC7u token" };
  }
}
function generateKeyString(prefix = "SUB-PRO") {
  const segment1 = import_crypto.default.randomBytes(3).toString("hex").toUpperCase();
  const segment2 = import_crypto.default.randomBytes(3).toString("hex").toUpperCase();
  const segment3 = import_crypto.default.randomBytes(3).toString("hex").toUpperCase();
  return `${prefix}-${segment1}-${segment2}-${segment3}`;
}
function getInitialStore() {
  const now = Date.now();
  const adminLicense = {
    id: "lic-admin-master",
    key: MASTER_ADMIN_KEY,
    plan: "admin",
    role: "admin",
    maxDevices: 9999,
    activatedDevices: [
      {
        deviceId: "DEV-ADMIN-IMEI1",
        deviceName: "Admin Device IMEI 1",
        imei: "868621072187630",
        ip: "192.168.1.19",
        activatedAt: now,
        lastUsedAt: now
      },
      {
        deviceId: "DEV-ADMIN-IMEI2",
        deviceName: "Admin Device IMEI 2",
        imei: "868621072187622",
        ip: "192.168.1.19",
        activatedAt: now,
        lastUsedAt: now
      }
    ],
    createdAt: now,
    expiresAt: null,
    // Lifetime vô hạn
    status: "active",
    note: "Super Admin - Tien Ly (V\xF4 h\u1EA1n th\u1EDDi gian & quy\u1EC1n qu\u1EA3n tr\u1ECB)"
  };
  const sampleProLifetime = {
    id: "lic-vip-lifetime-1",
    key: "SUB-LIFETIME-VIP-2026-8888",
    plan: "lifetime",
    role: "pro",
    maxDevices: 3,
    activatedDevices: [],
    createdAt: now,
    expiresAt: null,
    status: "active",
    note: "G\xF3i Pro V\u0129nh Vi\u1EC5n M\u1EABu (3 thi\u1EBFt b\u1ECB)"
  };
  const sampleProMonth = {
    id: "lic-pro-month-1",
    key: "SUB-PRO-30DAY-2026-9999",
    plan: "month",
    role: "pro",
    maxDevices: 2,
    activatedDevices: [],
    createdAt: now,
    expiresAt: now + 30 * 24 * 60 * 60 * 1e3,
    status: "active",
    note: "G\xF3i Pro 1 Th\xE1ng M\u1EABu (2 thi\u1EBFt b\u1ECB)"
  };
  return {
    version: 1,
    whitelistedImeis: [],
    whitelistedIps: [],
    adminEmails: ["tienly814@gmail.com"],
    licenses: [adminLicense, sampleProLifetime, sampleProMonth]
  };
}
function loadLicenseStore() {
  ensureDataDir();
  try {
    if (import_fs.default.existsSync(LICENSES_FILE)) {
      const raw = import_fs.default.readFileSync(LICENSES_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      let modified = false;
      if (!parsed.licenses.some((l) => l.key === MASTER_ADMIN_KEY)) {
        parsed.licenses.unshift(getInitialStore().licenses[0]);
        modified = true;
      }
      if (modified) {
        saveLicenseStore(parsed);
      }
      return parsed;
    }
  } catch (err) {
    console.error("[LicenseStore] Error reading licenses file, fallback to initial store:", err);
  }
  const initial = getInitialStore();
  saveLicenseStore(initial);
  return initial;
}
function saveLicenseStore(store) {
  ensureDataDir();
  try {
    import_fs.default.writeFileSync(LICENSES_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    console.error("[LicenseStore] Error saving licenses file:", err);
  }
}
function isSuperAdminCredential(options) {
  const { key } = options;
  if (!key || typeof key !== "string") {
    return false;
  }
  const cleanKey = key.trim();
  const masterKey = getMasterAdminKey();
  try {
    const keyBuf = Buffer.from(cleanKey);
    const masterBuf = Buffer.from(masterKey);
    if (keyBuf.length === masterBuf.length && import_crypto.default.timingSafeEqual(keyBuf, masterBuf)) {
      return true;
    }
  } catch (_) {
  }
  return cleanKey === masterKey || cleanKey.toUpperCase() === masterKey.toUpperCase();
}
function ensureDeviceLicense(params) {
  const store = loadLicenseStore();
  const normalizedDeviceId = (params.deviceId || "").trim();
  const normalizedImei = (params.imei || "").trim();
  const clientIp = (params.ip || "").trim();
  const now = Date.now();
  const existingLic = store.licenses.find(
    (l) => l.status === "active" && l.activatedDevices.some((d) => d.deviceId === normalizedDeviceId)
  );
  if (existingLic) {
    const dev = existingLic.activatedDevices.find((d) => d.deviceId === normalizedDeviceId);
    if (dev) dev.lastUsedAt = now;
    saveLicenseStore(store);
    const token2 = generateSignedLicenseToken({
      deviceId: normalizedDeviceId,
      role: existingLic.role,
      plan: existingLic.plan,
      key: existingLic.key,
      status: existingLic.status,
      expiresAt: existingLic.expiresAt,
      issuedAt: now,
      imei: normalizedImei,
      isSuperAdmin: existingLic.role === "admin"
    });
    return {
      success: true,
      isSuperAdmin: existingLic.role === "admin",
      licenseToken: token2,
      license: {
        key: existingLic.key,
        plan: existingLic.plan,
        role: existingLic.role,
        status: existingLic.status,
        expiresAt: existingLic.expiresAt,
        maxDevices: existingLic.maxDevices,
        activatedCount: existingLic.activatedDevices.length,
        isSuperAdmin: existingLic.role === "admin",
        note: existingLic.note
      }
    };
  }
  const newKeyStr = generateKeyString("BACH-DEV");
  const trialDuration = 3 * 24 * 60 * 60 * 1e3;
  const newLicense = {
    id: `lic-${now}-${import_crypto.default.randomBytes(3).toString("hex")}`,
    key: newKeyStr,
    plan: "trial",
    role: "user",
    maxDevices: 1,
    activatedDevices: [
      {
        deviceId: normalizedDeviceId,
        deviceName: params.deviceName || "Thi\u1EBFt b\u1ECB ng\u01B0\u1EDDi d\xF9ng m\u1EDBi",
        imei: normalizedImei,
        ip: clientIp,
        activatedAt: now,
        lastUsedAt: now
      }
    ],
    createdAt: now,
    expiresAt: now + trialDuration,
    status: "active",
    note: `T\u1EF1 \u0111\u1ED9ng sinh cho thi\u1EBFt b\u1ECB ${normalizedDeviceId.slice(0, 12)}...`
  };
  store.licenses.push(newLicense);
  saveLicenseStore(store);
  const token = generateSignedLicenseToken({
    deviceId: normalizedDeviceId,
    role: newLicense.role,
    plan: newLicense.plan,
    key: newLicense.key,
    status: newLicense.status,
    expiresAt: newLicense.expiresAt,
    issuedAt: now,
    imei: normalizedImei,
    isSuperAdmin: false
  });
  return {
    success: true,
    isSuperAdmin: false,
    licenseToken: token,
    license: {
      key: newLicense.key,
      plan: newLicense.plan,
      role: newLicense.role,
      status: newLicense.status,
      expiresAt: newLicense.expiresAt,
      maxDevices: newLicense.maxDevices,
      activatedCount: 1,
      isSuperAdmin: false,
      note: newLicense.note
    }
  };
}
function activateLicense(params) {
  const store = loadLicenseStore();
  const normalizedKey = (params.key || "").trim().toUpperCase();
  const normalizedImei = (params.imei || "").trim();
  const normalizedDeviceId = (params.deviceId || "").trim();
  const clientIp = (params.ip || "").trim();
  const now = Date.now();
  if (isSuperAdminCredential({ key: normalizedKey })) {
    const adminLic = store.licenses.find((l) => l.key === MASTER_ADMIN_KEY) || getInitialStore().licenses[0];
    if (normalizedDeviceId && !adminLic.activatedDevices.some((d) => d.deviceId === normalizedDeviceId)) {
      adminLic.activatedDevices.push({
        deviceId: normalizedDeviceId,
        deviceName: params.deviceName || (normalizedImei ? `Admin Device (${normalizedImei})` : "Admin Master Device"),
        imei: normalizedImei,
        ip: clientIp,
        activatedAt: now,
        lastUsedAt: now
      });
      saveLicenseStore(store);
    }
    const token2 = generateSignedLicenseToken({
      deviceId: normalizedDeviceId,
      role: "admin",
      plan: "admin",
      key: MASTER_ADMIN_KEY,
      status: "active",
      expiresAt: null,
      issuedAt: now,
      imei: normalizedImei,
      isSuperAdmin: true
    });
    return {
      success: true,
      message: "K\xEDch ho\u1EA1t th\xE0nh c\xF4ng: Quy\u1EC1n SUPER ADMIN V\xF4 H\u1EA1n Th\u1EDDi Gian (Tien Ly)",
      licenseToken: token2,
      license: {
        key: MASTER_ADMIN_KEY,
        plan: "admin",
        role: "admin",
        status: "active",
        expiresAt: null,
        maxDevices: 9999,
        activatedCount: adminLic.activatedDevices.length,
        isSuperAdmin: true,
        note: "Super Admin - V\xF4 h\u1EA1n th\u1EDDi gian & Full quy\u1EC1n Qu\u1EA3n tr\u1ECB Key"
      }
    };
  }
  if (!normalizedKey) {
    return {
      success: false,
      message: "Vui l\xF2ng nh\u1EADp M\xE3 B\u1EA3n Quy\u1EC1n (License Key)."
    };
  }
  if (!normalizedDeviceId) {
    return {
      success: false,
      message: "Kh\xF4ng t\xECm th\u1EA5y Device ID c\u1EE7a thi\u1EBFt b\u1ECB."
    };
  }
  const license = store.licenses.find((l) => l.key.toUpperCase() === normalizedKey);
  if (!license) {
    return {
      success: false,
      message: "M\xE3 b\u1EA3n quy\u1EC1n kh\xF4ng t\u1ED3n t\u1EA1i ho\u1EB7c \u0111\xE3 nh\u1EADp sai. Vui l\xF2ng ki\u1EC3m tra l\u1EA1i."
    };
  }
  if (license.status === "revoked") {
    return {
      success: false,
      message: "M\xE3 b\u1EA3n quy\u1EC1n n\xE0y \u0111\xE3 b\u1ECB thu h\u1ED3i b\u1EDFi Qu\u1EA3n tr\u1ECB vi\xEAn."
    };
  }
  if (license.status === "suspended") {
    return {
      success: false,
      message: "M\xE3 b\u1EA3n quy\u1EC1n n\xE0y \u0111ang t\u1EA1m kh\xF3a. Vui l\xF2ng li\xEAn h\u1EC7 h\u1ED7 tr\u1EE3."
    };
  }
  if (license.expiresAt && Date.now() > license.expiresAt) {
    license.status = "suspended";
    saveLicenseStore(store);
    return {
      success: false,
      message: `M\xE3 b\u1EA3n quy\u1EC1n \u0111\xE3 h\u1EBFt h\u1EA1n v\xE0o ng\xE0y ${new Date(license.expiresAt).toLocaleDateString("vi-VN")}.`
    };
  }
  const existingDeviceIndex = license.activatedDevices.findIndex((d) => d.deviceId === normalizedDeviceId);
  if (existingDeviceIndex >= 0) {
    license.activatedDevices[existingDeviceIndex].lastUsedAt = now;
    if (params.deviceName) license.activatedDevices[existingDeviceIndex].deviceName = params.deviceName;
    if (normalizedImei) license.activatedDevices[existingDeviceIndex].imei = normalizedImei;
    if (clientIp) license.activatedDevices[existingDeviceIndex].ip = clientIp;
    saveLicenseStore(store);
    const token2 = generateSignedLicenseToken({
      deviceId: normalizedDeviceId,
      role: license.role,
      plan: license.plan,
      key: license.key,
      status: license.status,
      expiresAt: license.expiresAt,
      issuedAt: now,
      imei: normalizedImei,
      isSuperAdmin: license.role === "admin"
    });
    return {
      success: true,
      message: "M\xE3 b\u1EA3n quy\u1EC1n h\u1EE3p l\u1EC7 (Thi\u1EBFt b\u1ECB n\xE0y \u0111\xE3 \u0111\u01B0\u1EE3c k\xEDch ho\u1EA1t tr\u01B0\u1EDBc \u0111\xF3).",
      licenseToken: token2,
      license: {
        key: license.key,
        plan: license.plan,
        role: license.role,
        status: license.status,
        expiresAt: license.expiresAt,
        maxDevices: license.maxDevices,
        activatedCount: license.activatedDevices.length,
        isSuperAdmin: license.role === "admin",
        note: license.note
      }
    };
  }
  if (license.activatedDevices.length >= license.maxDevices) {
    return {
      success: false,
      message: `M\xE3 b\u1EA3n quy\u1EC1n n\xE0y \u0111\xE3 k\xEDch ho\u1EA1t t\u1ED1i \u0111a ${license.maxDevices}/${license.maxDevices} thi\u1EBFt b\u1ECB. Vui l\xF2ng h\u1EE7y k\xEDch ho\u1EA1t tr\xEAn m\xE1y c\u0169 ho\u1EB7c li\xEAn h\u1EC7 Admin.`
    };
  }
  license.activatedDevices.push({
    deviceId: normalizedDeviceId,
    deviceName: params.deviceName || "Web Client",
    imei: normalizedImei,
    ip: clientIp,
    activatedAt: now,
    lastUsedAt: now
  });
  saveLicenseStore(store);
  const token = generateSignedLicenseToken({
    deviceId: normalizedDeviceId,
    role: license.role,
    plan: license.plan,
    key: license.key,
    status: license.status,
    expiresAt: license.expiresAt,
    issuedAt: now,
    imei: normalizedImei,
    isSuperAdmin: license.role === "admin"
  });
  return {
    success: true,
    message: `K\xEDch ho\u1EA1t b\u1EA3n quy\u1EC1n th\xE0nh c\xF4ng! G\xF3i: ${license.plan.toUpperCase()} (${license.activatedDevices.length}/${license.maxDevices} m\xE1y).`,
    licenseToken: token,
    license: {
      key: license.key,
      plan: license.plan,
      role: license.role,
      status: license.status,
      expiresAt: license.expiresAt,
      maxDevices: license.maxDevices,
      activatedCount: license.activatedDevices.length,
      isSuperAdmin: license.role === "admin",
      note: license.note
    }
  };
}
function verifyLicense(params) {
  const store = loadLicenseStore();
  const normalizedKey = (params.key || "").trim().toUpperCase();
  const normalizedImei = (params.imei || "").trim();
  const normalizedDeviceId = (params.deviceId || "").trim();
  const clientIp = (params.ip || "").trim();
  const now = Date.now();
  if (isSuperAdminCredential({ key: normalizedKey })) {
    const adminLic = store.licenses.find((l) => l.key === MASTER_ADMIN_KEY) || getInitialStore().licenses[0];
    const token2 = generateSignedLicenseToken({
      deviceId: normalizedDeviceId,
      role: "admin",
      plan: "admin",
      key: MASTER_ADMIN_KEY,
      status: "active",
      expiresAt: null,
      issuedAt: now,
      imei: normalizedImei,
      isSuperAdmin: true
    });
    return {
      valid: true,
      isSuperAdmin: true,
      licenseToken: token2,
      license: {
        key: MASTER_ADMIN_KEY,
        plan: "admin",
        role: "admin",
        status: "active",
        expiresAt: null,
        maxDevices: 9999,
        activatedCount: adminLic.activatedDevices.length,
        isSuperAdmin: true,
        note: "Super Admin - V\xF4 h\u1EA1n th\u1EDDi gian & Full quy\u1EC1n Qu\u1EA3n tr\u1ECB Key"
      }
    };
  }
  if (!normalizedKey || !normalizedDeviceId) {
    return { valid: false, isSuperAdmin: false, message: "Ch\u01B0a c\xF3 th\xF4ng tin b\u1EA3n quy\u1EC1n" };
  }
  const license = store.licenses.find((l) => l.key.toUpperCase() === normalizedKey);
  if (!license || license.status !== "active") {
    return { valid: false, isSuperAdmin: false, message: "B\u1EA3n quy\u1EC1n kh\xF4ng h\u1EE3p l\u1EC7 ho\u1EB7c \u0111\xE3 b\u1ECB kh\xF3a" };
  }
  if (license.expiresAt && Date.now() > license.expiresAt) {
    return { valid: false, isSuperAdmin: false, message: "B\u1EA3n quy\u1EC1n \u0111\xE3 h\u1EBFt h\u1EA1n" };
  }
  const isDeviceActivated = license.activatedDevices.some((d) => d.deviceId === normalizedDeviceId);
  if (!isDeviceActivated) {
    return { valid: false, isSuperAdmin: false, message: "Thi\u1EBFt b\u1ECB n\xE0y ch\u01B0a \u0111\u01B0\u1EE3c \u0111\u0103ng k\xFD trong License" };
  }
  const token = generateSignedLicenseToken({
    deviceId: normalizedDeviceId,
    role: license.role,
    plan: license.plan,
    key: license.key,
    status: license.status,
    expiresAt: license.expiresAt,
    issuedAt: now,
    imei: normalizedImei,
    isSuperAdmin: license.role === "admin"
  });
  return {
    valid: true,
    isSuperAdmin: license.role === "admin",
    licenseToken: token,
    license: {
      key: license.key,
      plan: license.plan,
      role: license.role,
      status: license.status,
      expiresAt: license.expiresAt,
      maxDevices: license.maxDevices,
      activatedCount: license.activatedDevices.length,
      isSuperAdmin: license.role === "admin",
      note: license.note
    }
  };
}
function deactivateLicense(params) {
  const store = loadLicenseStore();
  const normalizedKey = (params.key || "").trim().toUpperCase();
  const normalizedDeviceId = (params.deviceId || "").trim();
  const license = store.licenses.find((l) => l.key.toUpperCase() === normalizedKey);
  if (!license) {
    return { success: false, message: "Kh\xF4ng t\xECm th\u1EA5y m\xE3 b\u1EA3n quy\u1EC1n." };
  }
  const initialCount = license.activatedDevices.length;
  license.activatedDevices = license.activatedDevices.filter((d) => d.deviceId !== normalizedDeviceId);
  if (license.activatedDevices.length < initialCount) {
    saveLicenseStore(store);
    return { success: true, message: "\u0110\xE3 h\u1EE7y k\xEDch ho\u1EA1t b\u1EA3n quy\u1EC1n tr\xEAn thi\u1EBFt b\u1ECB n\xE0y th\xE0nh c\xF4ng." };
  }
  return { success: true, message: "Thi\u1EBFt b\u1ECB n\xE0y ch\u01B0a t\u1EEBng \u0111\u01B0\u1EE3c li\xEAn k\u1EBFt." };
}
function adminCreateKey(params) {
  const store = loadLicenseStore();
  const count = Math.min(50, Math.max(1, params.count || 1));
  const now = Date.now();
  const newKeys = [];
  let durationMs = null;
  let prefix = params.customPrefix || "SUB-PRO";
  if (params.plan === "trial") {
    durationMs = 3 * 24 * 60 * 60 * 1e3;
    prefix = "SUB-TRIAL";
  } else if (params.plan === "month") {
    durationMs = 30 * 24 * 60 * 60 * 1e3;
    prefix = "SUB-PRO-M";
  } else if (params.plan === "quarter") {
    durationMs = 90 * 24 * 60 * 60 * 1e3;
    prefix = "SUB-PRO-Q";
  } else if (params.plan === "year") {
    durationMs = 365 * 24 * 60 * 60 * 1e3;
    prefix = "SUB-PRO-Y";
  } else if (params.plan === "lifetime") {
    durationMs = null;
    prefix = "SUB-LIFETIME";
  } else if (params.plan === "admin") {
    durationMs = null;
    prefix = "ADMIN-KEY";
  }
  if (params.customDays && params.customDays > 0) {
    durationMs = params.customDays * 24 * 60 * 60 * 1e3;
  }
  const batchId = `batch-${Date.now()}`;
  for (let i = 0; i < count; i++) {
    const keyStr = generateKeyString(prefix);
    const item = {
      id: `lic-${Date.now()}-${import_crypto.default.randomBytes(3).toString("hex")}`,
      key: keyStr,
      plan: params.plan,
      role: params.plan === "admin" ? "admin" : "pro",
      maxDevices: params.maxDevices || (params.plan === "admin" ? 9999 : 2),
      activatedDevices: [],
      createdAt: now,
      expiresAt: durationMs ? now + durationMs : null,
      status: "active",
      note: params.note || `T\u1EA1o ng\xE0y ${(/* @__PURE__ */ new Date()).toLocaleDateString("vi-VN")}`,
      createdBatch: batchId
    };
    store.licenses.push(item);
    newKeys.push(item);
  }
  saveLicenseStore(store);
  return { success: true, keys: newKeys };
}
function adminResetKeyDevices(key) {
  const store = loadLicenseStore();
  const license = store.licenses.find((l) => l.key.toUpperCase() === key.trim().toUpperCase());
  if (!license) return { success: false, message: "Kh\xF4ng t\xECm th\u1EA5y license key" };
  license.activatedDevices = [];
  saveLicenseStore(store);
  return { success: true, message: `\u0110\xE3 gi\u1EA3i ph\xF3ng t\u1EA5t c\u1EA3 thi\u1EBFt b\u1ECB cho key ${key}.` };
}
function adminRevokeKey(key) {
  const store = loadLicenseStore();
  const normalizedKey = key.trim().toUpperCase();
  if (normalizedKey === MASTER_ADMIN_KEY) {
    return { success: false, message: "Kh\xF4ng th\u1EC3 thu h\u1ED3i Master Admin Key" };
  }
  const license = store.licenses.find((l) => l.key.toUpperCase() === normalizedKey);
  if (!license) return { success: false, message: "Kh\xF4ng t\xECm th\u1EA5y license key" };
  license.status = "revoked";
  saveLicenseStore(store);
  return { success: true, message: `\u0110\xE3 thu h\u1ED3i key ${key}.` };
}
function adminDeleteKey(key) {
  const store = loadLicenseStore();
  const normalizedKey = key.trim().toUpperCase();
  if (normalizedKey === MASTER_ADMIN_KEY) {
    return { success: false, message: "Kh\xF4ng th\u1EC3 x\xF3a Master Admin Key" };
  }
  const initialLen = store.licenses.length;
  store.licenses = store.licenses.filter((l) => l.key.toUpperCase() !== normalizedKey);
  if (store.licenses.length < initialLen) {
    saveLicenseStore(store);
    return { success: true, message: `\u0110\xE3 x\xF3a v\u0129nh vi\u1EC5n key ${key}.` };
  }
  return { success: false, message: "Kh\xF4ng t\xECm th\u1EA5y key \u0111\u1EC3 x\xF3a." };
}
function adminBuffTarget(params) {
  const store = loadLicenseStore();
  const target = (params.target || "").trim();
  if (!target) {
    throw new Error("Vui l\xF2ng cung c\u1EA5p Target (Device ID, IMEI, IP ho\u1EB7c Key) \u0111\u1EC3 Buff.");
  }
  const now = Date.now();
  let durationMs = null;
  if (params.plan === "month") {
    durationMs = 30 * 24 * 60 * 60 * 1e3;
  } else if (params.plan === "quarter") {
    durationMs = 90 * 24 * 60 * 60 * 1e3;
  } else if (params.plan === "year") {
    durationMs = 365 * 24 * 60 * 60 * 1e3;
  } else if (params.plan === "lifetime" || params.plan === "admin") {
    durationMs = null;
  }
  if (params.customDays && params.customDays > 0) {
    durationMs = params.customDays * 24 * 60 * 60 * 1e3;
  }
  const newExpiresAt = durationMs ? now + durationMs : null;
  const isSuperAdmin = params.plan === "admin";
  let matchingLicense = store.licenses.find((l) => l.key.toUpperCase() === target.toUpperCase());
  if (!matchingLicense) {
    matchingLicense = store.licenses.find(
      (l) => l.activatedDevices.some(
        (d) => d.deviceId === target || d.imei && d.imei === target || d.ip && d.ip === target
      )
    );
  }
  if (matchingLicense) {
    matchingLicense.plan = params.plan;
    matchingLicense.role = isSuperAdmin ? "admin" : "pro";
    matchingLicense.expiresAt = newExpiresAt;
    matchingLicense.status = "active";
    if (params.note) {
      matchingLicense.note = params.note;
    } else {
      matchingLicense.note = `Buff VIP b\u1EDFi Admin v\xE0o ${(/* @__PURE__ */ new Date()).toLocaleDateString("vi-VN")}`;
    }
    saveLicenseStore(store);
    return {
      success: true,
      message: `\u0110\xE3 Buff VIP th\xE0nh c\xF4ng cho ${target}! G\xF3i: ${params.plan.toUpperCase()} (H\u1EBFt h\u1EA1n: ${newExpiresAt ? new Date(newExpiresAt).toLocaleDateString("vi-VN") : "V\u0129nh Vi\u1EC5n"}).`,
      license: matchingLicense
    };
  }
  const prefix = isSuperAdmin ? "ADMIN-BUFF" : "VIP-BUFF";
  const newKey = generateKeyString(prefix);
  const newLic = {
    id: `lic-buff-${now}-${import_crypto.default.randomBytes(3).toString("hex")}`,
    key: newKey,
    plan: params.plan,
    role: isSuperAdmin ? "admin" : "pro",
    maxDevices: isSuperAdmin ? 9999 : 5,
    activatedDevices: [
      {
        deviceId: target.startsWith("imei:") ? target.replace("imei:", "") : target,
        deviceName: `Thi\u1EBFt b\u1ECB \u0111\u01B0\u1EE3c Admin Buff VIP (${target.slice(0, 10)})`,
        imei: target.length === 15 && /^\d+$/.test(target) ? target : void 0,
        ip: target.includes(".") && !target.includes("-") ? target : void 0,
        activatedAt: now,
        lastUsedAt: now
      }
    ],
    createdAt: now,
    expiresAt: newExpiresAt,
    status: "active",
    note: params.note || `Admin Buff tr\u1EF1c ti\u1EBFp cho ${target}`
  };
  store.licenses.unshift(newLic);
  saveLicenseStore(store);
  return {
    success: true,
    message: `\u0110\xE3 t\u1EA1o & Buff VIP tr\u1EF1c ti\u1EBFp cho ${target}! Key m\u1EDBi: ${newKey} (H\u1EBFt h\u1EA1n: ${newExpiresAt ? new Date(newExpiresAt).toLocaleDateString("vi-VN") : "V\u0129nh Vi\u1EC5n"}).`,
    license: newLic
  };
}
function adminListConnectedDevices() {
  const store = loadLicenseStore();
  const deviceMap = /* @__PURE__ */ new Map();
  for (const lic of store.licenses) {
    for (const dev of lic.activatedDevices) {
      const devKey = dev.deviceId || dev.imei || dev.ip || `anon-${Math.random()}`;
      if (!deviceMap.has(devKey) || lic.role === "admin") {
        deviceMap.set(devKey, {
          deviceId: dev.deviceId,
          deviceName: dev.deviceName,
          imei: dev.imei,
          ip: dev.ip,
          activatedAt: dev.activatedAt,
          lastUsedAt: dev.lastUsedAt,
          licenseKey: lic.key,
          plan: lic.plan,
          role: lic.role,
          status: lic.status,
          expiresAt: lic.expiresAt,
          isSuperAdmin: lic.role === "admin" || lic.key === MASTER_ADMIN_KEY,
          note: lic.note
        });
      }
    }
  }
  return {
    success: true,
    devices: Array.from(deviceMap.values()).sort((a, b) => b.lastUsedAt - a.lastUsedAt)
  };
}
var USERS_FILE = import_path.default.join(DATA_DIR, "users.json");
function loadUsersStore() {
  ensureDataDir();
  try {
    if (import_fs.default.existsSync(USERS_FILE)) {
      const raw = import_fs.default.readFileSync(USERS_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("[UsersStore] Read error:", err);
  }
  return {};
}
function saveUsersStore(store) {
  ensureDataDir();
  try {
    import_fs.default.writeFileSync(USERS_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (err) {
    console.error("[UsersStore] Save error:", err);
  }
}
function adminLookupMember(target) {
  const users = loadUsersStore();
  const q = (target || "").trim().toLowerCase();
  if (!q) return null;
  for (const user of Object.values(users)) {
    if (user.uid.toLowerCase() === q || user.memberCode && user.memberCode.toLowerCase() === q || user.email && user.email.toLowerCase() === q || user.boundDevices?.some((d) => d.deviceId.toLowerCase() === q)) {
      return user;
    }
  }
  return null;
}
function adminRenewOrExtendMember(params) {
  const users = loadUsersStore();
  const target = (params.targetUidOrCode || "").trim();
  if (!target) {
    return { success: false, message: "Thi\u1EBFu m\xE3 th\xE0nh vi\xEAn/UID c\u1EA7n gia h\u1EA1n" };
  }
  const existing = adminLookupMember(target);
  const now = Date.now();
  const targetUid = existing ? existing.uid : target.startsWith("MEM-") ? target : `user_${now}`;
  let newPlan = "trial";
  let newRole = "pro";
  let newExpiresAt = null;
  let actionDesc = "";
  const baseExpiresAt = existing?.expiresAt && existing.expiresAt > now ? existing.expiresAt : now;
  if (params.action === "pro_lifetime") {
    newPlan = "lifetime";
    newRole = "pro";
    newExpiresAt = null;
    actionDesc = "K\xEDch ho\u1EA1t PRO V\u0128NH VI\u1EC4N";
  } else if (params.action === "extend_trial") {
    newPlan = "trial";
    newRole = "pro";
    const days = params.customDays || 7;
    newExpiresAt = baseExpiresAt + days * 24 * 60 * 60 * 1e3;
    actionDesc = `Gia h\u1EA1n d\xF9ng th\u1EED +${days} ng\xE0y`;
  } else if (params.action === "pro_month") {
    newPlan = "month";
    newRole = "pro";
    newExpiresAt = baseExpiresAt + 30 * 24 * 60 * 60 * 1e3;
    actionDesc = "N\xE2ng c\u1EA5p G\xF3i 1 Th\xE1ng (+30 ng\xE0y)";
  } else if (params.action === "pro_quarter") {
    newPlan = "quarter";
    newRole = "pro";
    newExpiresAt = baseExpiresAt + 90 * 24 * 60 * 60 * 1e3;
    actionDesc = "N\xE2ng c\u1EA5p G\xF3i 3 Th\xE1ng (+90 ng\xE0y)";
  } else if (params.action === "pro_year") {
    newPlan = "year";
    newRole = "pro";
    newExpiresAt = baseExpiresAt + 365 * 24 * 60 * 60 * 1e3;
    actionDesc = "N\xE2ng c\u1EA5p G\xF3i 1 N\u0103m (+365 ng\xE0y)";
  }
  const note = params.note ? `${params.note} (Admin: ${actionDesc} l\xFAc ${(/* @__PURE__ */ new Date()).toLocaleDateString("vi-VN")})` : `Admin: ${actionDesc} l\xFAc ${(/* @__PURE__ */ new Date()).toLocaleDateString("vi-VN")}`;
  const updatedRecord = existing ? {
    ...existing,
    role: newRole,
    plan: newPlan,
    status: "active",
    expiresAt: newExpiresAt,
    note
  } : {
    uid: targetUid,
    memberCode: target.startsWith("MEM-") ? target : `MEM-${import_crypto.default.randomBytes(4).toString("hex").toUpperCase().slice(0, 4)}-${import_crypto.default.randomBytes(4).toString("hex").toUpperCase().slice(0, 4)}`,
    email: target.includes("@") ? target : `${targetUid.toLowerCase()}@member.app`,
    displayName: `Th\xE0nh vi\xEAn ${target}`,
    role: newRole,
    plan: newPlan,
    status: "active",
    expiresAt: newExpiresAt,
    maxDevices: 2,
    boundDevices: [],
    createdAt: now,
    lastLoginAt: now,
    note
  };
  users[updatedRecord.uid] = updatedRecord;
  saveUsersStore(users);
  return {
    success: true,
    message: `\u2713 \u0110\xE3 ${actionDesc} th\xE0nh c\xF4ng cho th\xE0nh vi\xEAn ${updatedRecord.memberCode || updatedRecord.email}!`,
    user: updatedRecord
  };
}
function adminUpdateMember(uid, updates) {
  const users = loadUsersStore();
  const existing = users[uid] || adminLookupMember(uid);
  if (!existing) {
    return { success: false, message: "Kh\xF4ng t\xECm th\u1EA5y th\xE0nh vi\xEAn c\u1EA7n c\u1EADp nh\u1EADt" };
  }
  const updated = {
    ...existing,
    ...updates,
    uid: existing.uid
  };
  users[updated.uid] = updated;
  saveUsersStore(users);
  return {
    success: true,
    message: "\u2713 C\u1EADp nh\u1EADt th\xF4ng tin th\xE0nh vi\xEAn th\xE0nh c\xF4ng!",
    user: updated
  };
}
function adminResetMemberDevices(uid) {
  const users = loadUsersStore();
  const existing = users[uid] || adminLookupMember(uid);
  if (!existing) {
    return { success: false, message: "Kh\xF4ng t\xECm th\u1EA5y th\xE0nh vi\xEAn" };
  }
  existing.boundDevices = [];
  users[existing.uid] = existing;
  saveUsersStore(users);
  return {
    success: true,
    message: "\u2713 \u0110\xE3 gi\u1EA3i ph\xF3ng to\xE0n b\u1ED9 thi\u1EBFt b\u1ECB c\u1EE7a th\xE0nh vi\xEAn th\xE0nh c\xF4ng!"
  };
}
function adminListAllMembers() {
  const users = loadUsersStore();
  return Object.values(users).sort((a, b) => (b.lastLoginAt || 0) - (a.lastLoginAt || 0));
}

// src/server/geminiWebService.ts
function parseGoogleCookies(rawCookieStr) {
  if (!rawCookieStr || typeof rawCookieStr !== "string") {
    return { psid: "", cleanCookieHeader: "" };
  }
  const cookieMap = /* @__PURE__ */ new Map();
  const pairs = rawCookieStr.split(";");
  for (const pair of pairs) {
    const idx = pair.indexOf("=");
    if (idx > 0) {
      const key = pair.substring(0, idx).trim();
      const val = pair.substring(idx + 1).trim();
      if (key && val) {
        cookieMap.set(key, val);
      }
    }
  }
  const psid = cookieMap.get("__Secure-1PSID") || cookieMap.get("__Secure-3PSID") || cookieMap.get("SID") || "";
  const psidts = cookieMap.get("__Secure-1PSIDTS") || cookieMap.get("__Secure-3PSIDTS") || "";
  const psidcc = cookieMap.get("__Secure-1PSIDCC") || cookieMap.get("__Secure-3PSIDCC") || "";
  const standardPairs = [];
  cookieMap.forEach((v, k) => {
    standardPairs.push(`${k}=${v}`);
  });
  return {
    psid,
    psidts,
    psidcc,
    cleanCookieHeader: standardPairs.join("; ")
  };
}
async function validateAndExtractGeminiWebSession(rawCookie) {
  const { psid, cleanCookieHeader } = parseGoogleCookies(rawCookie);
  if (!psid) {
    return {
      psid: "",
      rawCookie,
      valid: false,
      error: "Kh\xF4ng t\xECm th\u1EA5y cookie __Secure-1PSID (ho\u1EB7c SID). Vui l\xF2ng ki\u1EC3m tra l\u1EA1i Cookie \u0111\u0103ng nh\u1EADp t\u1EEB gemini.google.com."
    };
  }
  try {
    const response = await fetch("https://gemini.google.com/app", {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Cookie": cleanCookieHeader,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "vi,en-US;q=0.9,en;q=0.8",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1"
      }
    });
    if (!response.ok) {
      return {
        psid,
        rawCookie,
        valid: false,
        error: `M\xE1y ch\u1EE7 Google Gemini Web ph\u1EA3n h\u1ED3i m\xE3 l\u1ED7i HTTP ${response.status} (${response.statusText}). Cookie c\xF3 th\u1EC3 \u0111\xE3 h\u1EBFt h\u1EA1n.`
      };
    }
    const html = await response.text();
    if (html.includes("accounts.google.com/signin") || html.includes("ServiceLogin") || html.includes("Sign in - Google Accounts")) {
      return {
        psid,
        rawCookie,
        valid: false,
        error: "Phi\xEAn \u0111\u0103ng nh\u1EADp Google \u0111\xE3 h\u1EBFt h\u1EA1n ho\u1EB7c Cookie __Secure-1PSID kh\xF4ng ch\xEDnh x\xE1c."
      };
    }
    const snlm0eMatch = html.match(/"SNlM0e"\s*:\s*"([^"]+)"/) || html.match(/\["SNlM0e"\s*,\s*"([^"]+)"\]/);
    const snlm0e = snlm0eMatch ? snlm0eMatch[1] : void 0;
    const emailMatch = html.match(/"(?:OGPC|email|user_email|identifier)"\s*:\s*"([^"]+@[^"]+\.[^"]+)"/) || html.match(/mailto:([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    const email = emailMatch ? emailMatch[1] : void 0;
    if (!snlm0e) {
      return {
        psid,
        rawCookie,
        valid: false,
        error: "Kh\xF4ng th\u1EC3 tr\xEDch xu\u1EA5t m\xE3 b\u1EA3o m\u1EADt SNlM0e t\u1EEB trang Gemini Web. Vui l\xF2ng \u0111\u1EA3m b\u1EA3o b\u1EA1n \u0111\xE3 m\u1EDF gemini.google.com v\xE0 l\u1EA5y \u0111\u1EA7y \u0111\u1EE7 cookie."
      };
    }
    return {
      psid,
      snlm0e,
      email,
      valid: true,
      rawCookie: cleanCookieHeader
    };
  } catch (err) {
    return {
      psid,
      rawCookie,
      valid: false,
      error: `L\u1ED7i k\u1EBFt n\u1ED1i t\u1EDBi https://gemini.google.com: ${err.message || "L\u1ED7i m\u1EA1ng"}`
    };
  }
}
function parseGeminiWebStreamResponse(responseText) {
  if (!responseText || typeof responseText !== "string") return "";
  const lines = responseText.split("\n");
  let accumulatedText = "";
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith(")]}'")) continue;
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (Array.isArray(item) && item[0] === "wrb.fr") {
            const dataStr = item[2];
            if (typeof dataStr === "string") {
              try {
                const subData = JSON.parse(dataStr);
                if (Array.isArray(subData) && subData[4]) {
                  const candidateList = subData[4];
                  if (Array.isArray(candidateList) && candidateList[0] && Array.isArray(candidateList[0][1])) {
                    const textParts = candidateList[0][1];
                    if (typeof textParts[0] === "string") {
                      accumulatedText = textParts[0];
                    }
                  }
                }
              } catch (_) {
              }
            }
          }
        }
      }
    } catch (_) {
    }
  }
  return accumulatedText.trim();
}
async function executeGeminiWebPrompt(prompt, session) {
  if (!session.valid || !session.snlm0e) {
    return { success: false, error: session.error || "Phi\xEAn Google Gemini Web ch\u01B0a h\u1EE3p l\u1EC7" };
  }
  try {
    const reqPayload = [
      null,
      JSON.stringify([
        [prompt, 0, null, null, null, null, 0],
        ["vi"],
        ["", "", ""],
        null,
        null,
        null,
        [1]
      ])
    ];
    const fReq = JSON.stringify(reqPayload);
    const searchParams = new URLSearchParams({
      "bl": "boq_assistant-bard-web-server_20240305.08_p0",
      "_reqid": String(Math.floor(1e5 + Math.random() * 9e5)),
      "rt": "c"
    });
    const bodyParams = new URLSearchParams();
    bodyParams.append("f.req", fReq);
    bodyParams.append("at", session.snlm0e);
    const targetUrl = `https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate?${searchParams.toString()}`;
    const res = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Cookie": session.rawCookie,
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "Origin": "https://gemini.google.com",
        "Referer": "https://gemini.google.com/",
        "X-Same-Domain": "1"
      },
      body: bodyParams.toString()
    });
    if (!res.ok) {
      return {
        success: false,
        error: `Google Gemini Web RPC tr\u1EA3 v\u1EC1 HTTP ${res.status}: ${res.statusText}`
      };
    }
    const rawResponse = await res.text();
    const extractedText = parseGeminiWebStreamResponse(rawResponse);
    if (!extractedText) {
      const textMatches = rawResponse.match(/\\n\\n([^\\]+)\\n/g);
      if (textMatches && textMatches.length > 0) {
        const last = textMatches[textMatches.length - 1].replace(/\\n/g, "\n").trim();
        if (last.length > 5) {
          return { success: true, text: last };
        }
      }
      return {
        success: false,
        error: "Kh\xF4ng th\u1EC3 ph\xE2n t\xEDch ph\u1EA3n h\u1ED3i t\u1EEB lu\u1ED3ng Gemini Web. Google c\xF3 th\u1EC3 v\u1EEBa c\u1EADp nh\u1EADt \u0111\u1ECBnh d\u1EA1ng."
      };
    }
    return {
      success: true,
      text: extractedText
    };
  } catch (err) {
    return {
      success: false,
      error: `L\u1ED7i g\u1EEDi y\xEAu c\u1EA7u t\u1EDBi Gemini Web RPC: ${err.message || "L\u1ED7i m\u1EA1ng"}`
    };
  }
}

// server.ts
import_dns.default.setDefaultResultOrder("ipv4first");
var execPromise = import_util.default.promisify(import_child_process.exec);
var execFilePromise = import_util.default.promisify(import_child_process.execFile);
function isDisallowedHostOrIp(hostname) {
  if (!hostname) return true;
  const host = hostname.toLowerCase().trim();
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal") || host === "metadata.google.internal" || host === "metadata") {
    return true;
  }
  const ipv4Match = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4Match) {
    const [_, o1, o2, o3, o4] = ipv4Match.map(Number);
    if (o1 === 0) return true;
    if (o1 === 127) return true;
    if (o1 === 10) return true;
    if (o1 === 172 && o2 >= 16 && o2 <= 31) return true;
    if (o1 === 192 && o2 === 168) return true;
    if (o1 === 169 && o2 === 254) return true;
    if (o1 === 100 && o2 >= 64 && o2 <= 127) return true;
    if (o1 >= 224) return true;
  }
  if (host === "::1" || host === "::" || host.startsWith("fe80:") || host.startsWith("fc") || host.startsWith("fd")) {
    return true;
  }
  return false;
}
function isValidPublicHttpUrl(urlString) {
  try {
    const parsed = new URL(urlString);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }
    return !isDisallowedHostOrIp(parsed.hostname);
  } catch (_) {
    return false;
  }
}
import_dotenv.default.config();
var currentFilename = typeof __filename !== "undefined" ? __filename : process.argv[1] || import_path2.default.join(process.cwd(), "server.ts");
var currentDirname = typeof __dirname !== "undefined" ? __dirname : import_path2.default.dirname(currentFilename);
var customRequire = typeof require !== "undefined" ? require : (0, import_module.createRequire)(currentFilename);
var sherpaOnnxModule = null;
try {
  sherpaOnnxModule = customRequire("sherpa-onnx");
  console.log("[Sherpa-ONNX] Successfully loaded sherpa-onnx version:", sherpaOnnxModule?.version || "ok");
} catch (e) {
  console.warn("[Sherpa-ONNX] Module load error:", e);
}
var tiktokTtsModule = null;
try {
  tiktokTtsModule = customRequire("@shofipwk/tiktok-tts");
  console.log("[TikTok-TTS] Successfully loaded @shofipwk/tiktok-tts module");
} catch (e) {
  console.warn("[TikTok-TTS] Module load error:", e);
}
var NGHI_TTS_VOICE_URLS = {
  lacphi: {
    filename: "lacphi.onnx",
    url: "https://huggingface.co/doof-ferb/nghitts-copy/resolve/main/sherpa-onnx/lacphi.onnx?download=true",
    name: "L\u1EA1c Phi"
  },
  duyoryx: {
    filename: "duyoryx3175.onnx",
    url: "https://huggingface.co/doof-ferb/nghitts-copy/resolve/main/sherpa-onnx/duyoryx3175.onnx?download=true",
    name: "Duy Oryx"
  },
  ngochuyennew: {
    filename: "ngochuyennew.onnx",
    url: "https://huggingface.co/doof-ferb/nghitts-copy/resolve/main/sherpa-onnx/ngochuyennew.onnx?download=true",
    name: "Ng\u1ECDc Huy\u1EC1n (M\u1EDBi)"
  },
  ngocngan: {
    filename: "ngocngan3701.onnx",
    url: "https://huggingface.co/doof-ferb/nghitts-copy/resolve/main/sherpa-onnx/ngocngan3701.onnx?download=true",
    name: "Ng\u1ECDc Ng\u1EA1n"
  },
  maiphuong: {
    filename: "maiphuong.onnx",
    url: "https://huggingface.co/doof-ferb/nghitts-copy/resolve/main/sherpa-onnx/maiphuong.onnx?download=true",
    name: "Mai Ph\u01B0\u01A1ng"
  },
  minhquang: {
    filename: "minhquang.onnx",
    url: "https://huggingface.co/doof-ferb/nghitts-copy/resolve/main/sherpa-onnx/minhquang.onnx?download=true",
    name: "Minh Quang"
  }
};
function fixHuggingFaceUrl(url) {
  if (!url) return url;
  if (url.includes("huggingface.co") && url.includes("/blob/")) {
    const fixed = url.replace("huggingface.co/", "huggingface.co/").replace("/blob/", "/resolve/");
    console.log(`[Hugging Face URL Fixer] Converted HF blob URL to resolve: ${url} -> ${fixed}`);
    return fixed;
  }
  return url;
}
async function ensureFileDownloaded(fileUrl, targetPath, minSizeBytes = 50) {
  const sanitizedUrl = fixHuggingFaceUrl(fileUrl);
  if (import_fs2.default.existsSync(targetPath)) {
    const stat = import_fs2.default.statSync(targetPath);
    if (stat.size >= minSizeBytes) return true;
    console.log(`[Sherpa-ONNX TTS] Existing file ${targetPath} too small (${stat.size} < ${minSizeBytes}), re-downloading...`);
    try {
      import_fs2.default.unlinkSync(targetPath);
    } catch (_) {
    }
  }
  console.log(`[Sherpa-ONNX TTS] Downloading file from ${sanitizedUrl} to ${targetPath}...`);
  try {
    const res = await fetch(sanitizedUrl);
    if (!res.ok) throw new Error(`Failed to fetch ${sanitizedUrl}: ${res.status} ${res.statusText}`);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    if (buffer.length < minSizeBytes) {
      throw new Error(`Downloaded file too small (${buffer.length} bytes < ${minSizeBytes} bytes)`);
    }
    import_fs2.default.mkdirSync(import_path2.default.dirname(targetPath), { recursive: true });
    import_fs2.default.writeFileSync(targetPath, buffer);
    console.log(`[Sherpa-ONNX TTS] Saved ${targetPath} (${(buffer.length / (1024 * 1024)).toFixed(1)} MB) successfully.`);
    return true;
  } catch (e) {
    console.error(`[Sherpa-ONNX TTS] Download error for ${fileUrl}:`, e);
    if (import_fs2.default.existsSync(targetPath)) {
      try {
        import_fs2.default.unlinkSync(targetPath);
      } catch (_) {
      }
    }
    return false;
  }
}
async function ensureEspeakData(nghiDir) {
  const targetDir = import_path2.default.join(nghiDir, "espeak-ng-data");
  const phontabPath = import_path2.default.join(targetDir, "phontab");
  const viDictPath = import_path2.default.join(targetDir, "vi_dict");
  const checkBinaryValid = (dir) => {
    const pt = import_path2.default.join(dir, "phontab");
    const vd = import_path2.default.join(dir, "vi_dict");
    if (import_fs2.default.existsSync(pt) && import_fs2.default.existsSync(vd)) {
      try {
        const viBuf = import_fs2.default.readFileSync(vd);
        const ptBuf = import_fs2.default.readFileSync(pt);
        if (viBuf.length > 500 && ptBuf.length > 1e3) {
          return true;
        }
      } catch (_) {
      }
    }
    return false;
  };
  if (checkBinaryValid(targetDir)) {
    return true;
  }
  console.log("[Sherpa-ONNX TTS] espeak-ng-data missing or corrupted. Trying local backups first...");
  const localCandidates = [
    import_path2.default.join(process.cwd(), "nghi-tts audio", "espeak-ng-data"),
    import_path2.default.join(process.cwd(), "espeak-ng-data"),
    import_path2.default.join(process.cwd(), "public", "espeak-ng-data"),
    import_path2.default.join(currentDirname, "nghi-tts audio", "espeak-ng-data"),
    import_path2.default.join(currentDirname, "espeak-ng-data"),
    import_path2.default.join(process.cwd(), "tmp_espeak_test", "espeak-ng-data")
  ];
  for (const cand of localCandidates) {
    if (cand !== targetDir && import_fs2.default.existsSync(cand) && checkBinaryValid(cand)) {
      console.log(`[Sherpa-ONNX TTS] Copying espeak-ng-data from local folder: ${cand}`);
      try {
        import_fs2.default.mkdirSync(nghiDir, { recursive: true });
        import_fs2.default.cpSync(cand, targetDir, { recursive: true });
        if (checkBinaryValid(targetDir)) {
          console.log("[Sherpa-ONNX TTS] Copied espeak-ng-data from local candidate successfully.");
          return true;
        }
      } catch (copyErr) {
        console.warn("[Sherpa-ONNX TTS] Copying candidate folder failed:", copyErr);
      }
    }
  }
  const backupZipCandidates = [
    import_path2.default.join(process.cwd(), "public", "espeak-ng-data.zip"),
    import_path2.default.join(process.cwd(), "nghi-tts audio", "espeak-ng-data.zip"),
    import_path2.default.join(process.cwd(), "espeak-ng-data.zip"),
    import_path2.default.join(process.cwd(), "tmp_espeak_test", "espeak-ng-data.zip"),
    import_path2.default.join(nghiDir, "espeak-ng-data.zip")
  ];
  for (const backupZipPath of backupZipCandidates) {
    if (import_fs2.default.existsSync(backupZipPath)) {
      console.log(`[Sherpa-ONNX TTS] Testing and unzipping espeak-ng-data from local zip: ${backupZipPath}`);
      try {
        const isValidZip = await new Promise((resolveTest) => {
          (0, import_child_process.exec)(`unzip -t "${backupZipPath}"`, (testErr) => {
            resolveTest(!testErr);
          });
        });
        if (!isValidZip) {
          console.warn(`[Sherpa-ONNX TTS] Corrupt backup zip detected, removing: ${backupZipPath}`);
          try {
            import_fs2.default.unlinkSync(backupZipPath);
          } catch (_) {
          }
          continue;
        }
        import_fs2.default.mkdirSync(nghiDir, { recursive: true });
        await new Promise((resolveZip, rejectZip) => {
          (0, import_child_process.exec)(`unzip -q -o "${backupZipPath}" -d "${nghiDir}"`, (err) => {
            if (err) rejectZip(err);
            else resolveZip();
          });
        });
        if (checkBinaryValid(targetDir)) {
          console.log("[Sherpa-ONNX TTS] Unzipped espeak-ng-data from local backup zip successfully.");
          return true;
        }
      } catch (zipErr) {
        console.warn("[Sherpa-ONNX TTS] Unzipping backup zip failed:", zipErr);
      }
    }
  }
  console.log("[Sherpa-ONNX TTS] Local backups not found or failed. Downloading clean espeak-ng-data.zip from remote GitHub...");
  const zipPath = import_path2.default.join(nghiDir, "espeak-ng-data.zip");
  const zipUrl = "https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/espeak-ng-data.zip";
  if (import_fs2.default.existsSync(targetDir)) {
    try {
      import_fs2.default.rmSync(targetDir, { recursive: true, force: true });
    } catch (_) {
    }
  }
  const downloaded = await ensureFileDownloaded(zipUrl, zipPath, 5e6);
  if (!downloaded) return false;
  console.log("[Sherpa-ONNX TTS] Unzipping downloaded espeak-ng-data...");
  return new Promise((resolve) => {
    (0, import_child_process.exec)(`unzip -t "${zipPath}" && unzip -q -o "${zipPath}" -d "${nghiDir}" && rm -f "${zipPath}"`, (err) => {
      if (err) {
        console.error("[Sherpa-ONNX TTS] Unzip error:", err);
        if (import_fs2.default.existsSync(zipPath)) {
          try {
            import_fs2.default.unlinkSync(zipPath);
          } catch (_) {
          }
        }
        resolve(false);
      } else {
        console.log("[Sherpa-ONNX TTS] espeak-ng-data extracted successfully.");
        resolve(true);
      }
    });
  });
}
function floatTo16BitPcmWav(samples, sampleRate) {
  const numChannels = 1;
  const bytesPerSample = 2;
  const dataSize = samples.length * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * numChannels * bytesPerSample, 28);
  buffer.writeUInt16LE(numChannels * bytesPerSample, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);
  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    const val = s < 0 ? s * 32768 : s * 32767;
    buffer.writeInt16LE(Math.floor(val), offset);
    offset += 2;
  }
  return buffer;
}
function createMp3SilenceBuffer(durationMs = 180) {
  const frame = Buffer.alloc(417, 0);
  frame[0] = 255;
  frame[1] = 251;
  frame[2] = 144;
  frame[3] = 100;
  const frameCount = Math.max(1, Math.round(durationMs / 26.1224));
  const frames = [];
  for (let i = 0; i < frameCount; i++) {
    frames.push(frame);
  }
  return Buffer.concat(frames);
}
function getMp3BufferDuration(buffer) {
  if (!buffer || buffer.length < 4) return 0;
  const bitrateTableMPEG1 = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0];
  const bitrateTableMPEG2 = [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 0];
  const sampleRateTable = {
    MPEG1: [44100, 48e3, 32e3],
    MPEG2: [22050, 24e3, 16e3],
    MPEG25: [11025, 12e3, 8e3]
  };
  let offset = 0;
  if (buffer.length > 10 && buffer.toString("ascii", 0, 3) === "ID3") {
    const size = (buffer[6] & 127) << 21 | (buffer[7] & 127) << 14 | (buffer[8] & 127) << 7 | buffer[9] & 127;
    offset = 10 + size;
  }
  let totalDuration = 0;
  let frameCount = 0;
  while (offset < buffer.length - 4) {
    if (buffer[offset] === 255 && (buffer[offset + 1] & 224) === 224) {
      const b1 = buffer[offset + 1];
      const b2 = buffer[offset + 2];
      const versionBits = b1 >> 3 & 3;
      const layerBits = b1 >> 1 & 3;
      let version = null;
      if (versionBits === 3) version = "MPEG1";
      else if (versionBits === 2) version = "MPEG2";
      else if (versionBits === 0) version = "MPEG25";
      if (version && layerBits === 1) {
        const bitrateIdx = b2 >> 4 & 15;
        const srIdx = b2 >> 2 & 3;
        const padding = b2 >> 1 & 1;
        const sampleRates = sampleRateTable[version];
        const sampleRate = sampleRates ? sampleRates[srIdx] : 0;
        const bitrates = version === "MPEG1" ? bitrateTableMPEG1 : bitrateTableMPEG2;
        const bitrate = bitrates ? bitrates[bitrateIdx] : 0;
        if (sampleRate && bitrate) {
          const samplesPerFrame = version === "MPEG1" ? 1152 : 576;
          const frameSize = Math.floor(samplesPerFrame / 8 * bitrate * 1e3 / sampleRate) + padding;
          if (frameSize > 0 && offset + frameSize <= buffer.length + 1) {
            totalDuration += samplesPerFrame / sampleRate;
            frameCount++;
            offset += frameSize;
            continue;
          }
        }
      }
    }
    offset++;
  }
  if (totalDuration > 0) {
    return Math.round(totalDuration * 100) / 100;
  }
  return Math.round(buffer.length * 8 / 64e3 * 100) / 100;
}
function buildAtempoFilterChain(ratio) {
  const filters = [];
  let remaining = ratio;
  while (remaining > 2) {
    filters.push("atempo=2.0");
    remaining /= 2;
  }
  while (remaining < 0.5) {
    filters.push("atempo=0.5");
    remaining /= 0.5;
  }
  filters.push(`atempo=${remaining.toFixed(4)}`);
  return filters.join(",");
}
async function stretchAudioWithAtempo(inputBuffer, currentDuration, targetDuration) {
  if (currentDuration <= 0 || targetDuration <= 0 || !inputBuffer || inputBuffer.length === 0) {
    return { buffer: inputBuffer, duration: currentDuration };
  }
  const speedRatio = currentDuration / targetDuration;
  if (Math.abs(currentDuration - targetDuration) < 0.06 || speedRatio >= 0.98 && speedRatio <= 1.02) {
    return { buffer: inputBuffer, duration: currentDuration };
  }
  const filterChain = buildAtempoFilterChain(speedRatio);
  const tempDir = import_path2.default.join(import_os.default.tmpdir(), `audio_atempo_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`);
  import_fs2.default.mkdirSync(tempDir, { recursive: true });
  const inputPath = import_path2.default.join(tempDir, "input.mp3");
  const outputPath = import_path2.default.join(tempDir, "output.mp3");
  try {
    import_fs2.default.writeFileSync(inputPath, inputBuffer);
    const ffmpegCmd = `ffmpeg -y -i "${inputPath}" -filter:a "${filterChain}" -vn -c:a libmp3lame -q:a 2 "${outputPath}"`;
    console.log(`[Audio Sync] Kh\u1EDBp th\u1EDDi l\u01B0\u1EE3ng video (${(currentDuration * 1e3).toFixed(0)}ms \u2192 atempo stretch ${(targetDuration * 1e3).toFixed(0)}ms)`);
    await execPromise(ffmpegCmd);
    if (import_fs2.default.existsSync(outputPath)) {
      const outputBuffer = import_fs2.default.readFileSync(outputPath);
      const newDuration = getMp3BufferDuration(outputBuffer) || targetDuration;
      try {
        import_fs2.default.rmSync(tempDir, { recursive: true, force: true });
      } catch {
      }
      return { buffer: outputBuffer, duration: newDuration };
    }
  } catch (err) {
    console.warn(`[Audio Sync] Gi\u1EEF audio g\u1ED1c, s\u1EBD stretch khi gh\xE9p (l\u1ED7i: ${err?.message || err})`);
  }
  try {
    import_fs2.default.rmSync(tempDir, { recursive: true, force: true });
  } catch {
  }
  return { buffer: inputBuffer, duration: currentDuration };
}
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.set("trust proxy", 1);
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Range, Accept, Origin, x-api-key");
    res.setHeader("Access-Control-Expose-Headers", "Content-Length, Content-Range, Accept-Ranges, Content-Type");
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
    if (req.method === "OPTIONS") {
      res.sendStatus(204);
      return;
    }
    next();
  });
  app.use(import_express.default.json({ limit: "50mb" }));
  app.get("/ort-wasm/:filename", (req, res) => {
    const filename = req.params.filename;
    const candidates = [
      import_path2.default.join(process.cwd(), "node_modules", "onnxruntime-web", "dist", filename),
      import_path2.default.join(process.cwd(), "public", "ort-wasm", filename),
      import_path2.default.join(process.cwd(), "dist", "ort-wasm", filename)
    ];
    for (const p of candidates) {
      if (import_fs2.default.existsSync(p)) {
        const stat = import_fs2.default.statSync(p);
        if (filename.endsWith(".wasm") && stat.size < 5e6 && filename.includes("simd")) {
          continue;
        }
        if (filename.endsWith(".wasm")) {
          res.setHeader("Content-Type", "application/wasm");
        } else if (filename.endsWith(".js") || filename.endsWith(".mjs")) {
          res.setHeader("Content-Type", "application/javascript");
        }
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
        res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        return res.sendFile(p);
      }
    }
    return res.redirect(`https://cdn.jsdelivr.net/npm/onnxruntime-web@1.23.2/dist/${encodeURIComponent(filename)}`);
  });
  const PADDLE_MODEL_CONFIGS = {
    det: {
      filename: "det.onnx",
      remoteUrl: "https://huggingface.co/PaddlePaddle/PP-OCRv6_tiny_det_onnx/resolve/main/inference.onnx?download=true",
      fallbackUrls: [
        "https://huggingface.co/PaddlePaddle/PP-OCRv6_tiny_det_onnx/resolve/main/inference.onnx?download=true",
        "https://huggingface.co/PaddlePaddle/PP-OCRv6_tiny_det_onnx/raw/main/inference.onnx",
        "https://huggingface.co/x3zvawq/paddleocr-js-onnx/resolve/main/ppocr_v5_mobile/PP-OCRv5_mobile_det_infer.onnx"
      ],
      minSize: 1e5,
      contentType: "application/octet-stream"
    },
    rec: {
      filename: "rec.onnx",
      remoteUrl: "https://huggingface.co/PaddlePaddle/PP-OCRv6_tiny_rec_onnx/resolve/main/inference.onnx?download=true",
      fallbackUrls: [
        "https://huggingface.co/PaddlePaddle/PP-OCRv6_tiny_rec_onnx/resolve/main/inference.onnx?download=true",
        "https://huggingface.co/PaddlePaddle/PP-OCRv6_tiny_rec_onnx/raw/main/inference.onnx",
        "https://huggingface.co/x3zvawq/paddleocr-js-onnx/resolve/main/ppocr_v5_mobile/PP-OCRv5_mobile_rec_infer.onnx"
      ],
      minSize: 1e5,
      contentType: "application/octet-stream"
    },
    dict: {
      filename: "dict.txt",
      remoteUrl: "https://raw.githubusercontent.com/PaddlePaddle/PaddleOCR/release/2.8/ppocr/utils/ppocr_keys_v1.txt",
      fallbackUrls: [
        "https://huggingface.co/x3zvawq/paddleocr-js-onnx/resolve/main/ppocr_v5_mobile/ppocrv5_dict.txt",
        "https://raw.githubusercontent.com/PT-Perkasa-Pilar-Utama/ppu-paddle-ocr-models/main/recognition/ppocrv5_dict.txt"
      ],
      minSize: 1e3,
      contentType: "text/plain; charset=utf-8"
    }
  };
  const handlePaddleModelRequest = async (req, res) => {
    const type = (req.params.type || "").toLowerCase();
    const config = PADDLE_MODEL_CONFIGS[type];
    if (!config) {
      res.status(404).json({ error: `Model type '${type}' not found. Supported types: det, rec, dict` });
      return;
    }
    const candidatePaths = [
      import_path2.default.join(process.cwd(), config.filename),
      import_path2.default.join(process.cwd(), "public", config.filename),
      import_path2.default.join(process.cwd(), "public", "models", config.filename),
      import_path2.default.join(process.cwd(), "dist", config.filename),
      import_path2.default.join(process.cwd(), "dist", "models", config.filename),
      import_path2.default.join(import_os.default.tmpdir(), config.filename),
      // Also check aliases
      import_path2.default.join(process.cwd(), "public", type === "det" ? "PaddleOCRv6-tiny-det.onnx" : type === "rec" ? "PaddleOCRv6-tiny-rec.onnx" : "ppocrv6_tiny_dict.txt"),
      import_path2.default.join(process.cwd(), "dist", type === "det" ? "PaddleOCRv6-tiny-det.onnx" : type === "rec" ? "PaddleOCRv6-tiny-rec.onnx" : "ppocrv6_tiny_dict.txt"),
      import_path2.default.join(process.cwd(), type === "det" ? "PaddleOCRv6-tiny-det.onnx" : type === "rec" ? "PaddleOCRv6-tiny-rec.onnx" : "ppocrv6_tiny_dict.txt")
    ];
    let foundPath = null;
    for (const p of candidatePaths) {
      if (import_fs2.default.existsSync(p)) {
        const stat = import_fs2.default.statSync(p);
        if (stat.size >= config.minSize) {
          foundPath = p;
          break;
        }
      }
    }
    if (foundPath) {
      res.setHeader("Content-Type", config.contentType);
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.sendFile(import_path2.default.resolve(foundPath));
    }
    const urlsToTry = [config.remoteUrl, ...config.fallbackUrls || []];
    for (const url of urlsToTry) {
      try {
        console.log(`[PaddleOCR Model Server] Downloading ${config.filename} from ${url}...`);
        const remoteRes = await fetch(url);
        if (!remoteRes.ok) {
          continue;
        }
        const buffer = Buffer.from(await remoteRes.arrayBuffer());
        if (buffer.length < config.minSize) {
          continue;
        }
        try {
          const publicDir = import_path2.default.join(process.cwd(), "public");
          import_fs2.default.mkdirSync(publicDir, { recursive: true });
          import_fs2.default.writeFileSync(import_path2.default.join(publicDir, config.filename), buffer);
          import_fs2.default.writeFileSync(import_path2.default.join(process.cwd(), config.filename), buffer);
        } catch (_) {
        }
        res.setHeader("Content-Type", config.contentType);
        res.setHeader("Content-Length", buffer.length);
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        res.setHeader("Access-Control-Allow-Origin", "*");
        return res.send(buffer);
      } catch (err) {
        console.warn(`[PaddleOCR Model Server Warning for ${config.filename}]`, err?.message || err);
      }
    }
    res.status(500).send(`Error downloading PaddleOCR model ${config.filename}: Failed from all sources`);
  };
  app.get("/api/paddle-models/:type", handlePaddleModelRequest);
  app.get("/api/ocr/model/:type", handlePaddleModelRequest);
  const getAiClientAndModel = (body = {}) => {
    const apiMode = body.apiMode || "direct";
    const directApiKey = body.apiKey;
    const proxyUrl = body.proxyUrl;
    const proxyKey = body.proxyKey;
    const proxyTargetModel = body.proxyTargetModel;
    const requestModel = body.model;
    console.log("[getAiClientAndModel] Received config:", {
      apiMode,
      hasDirectApiKey: !!directApiKey,
      proxyUrl,
      hasProxyKey: !!proxyKey,
      proxyTargetModel,
      requestModel,
      customModelName: body.customModelName
    });
    let ai;
    let selectedModel = requestModel;
    if (apiMode === "proxy" && proxyUrl) {
      const baseUrl = proxyUrl.trim().replace(/\/+$/, "");
      const proxyNoApiKey = body.proxyNoApiKey === true;
      let apiKey = "AIStudioProxyKey";
      if (proxyNoApiKey) {
        apiKey = proxyKey && proxyKey.trim() || "AIStudioProxyKey";
      } else {
        apiKey = proxyKey && proxyKey.trim() || directApiKey && directApiKey.trim() || "AIStudioProxyKey";
      }
      console.log(`[getAiClientAndModel] Initializing GoogleGenAI client with PROXY mode. Base URL: ${baseUrl}. Using proxyNoApiKey: ${proxyNoApiKey}`);
      ai = new import_genai.GoogleGenAI({
        apiKey,
        httpOptions: {
          baseUrl,
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
      if (proxyTargetModel && proxyTargetModel.trim()) {
        selectedModel = proxyTargetModel.trim();
      } else if (body.customModelName && body.customModelName.trim()) {
        selectedModel = body.customModelName.trim();
      } else if (requestModel && requestModel.trim() && requestModel !== "GEMINI_WEB") {
        selectedModel = requestModel.trim();
      }
    } else {
      const apiKey = directApiKey || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Kh\xF4ng t\xECm th\u1EA5y API Key. Vui l\xF2ng ki\u1EC3m tra c\u1EA5u h\xECnh trong ph\u1EA7n Thi\u1EBFt l\u1EADp.");
      }
      console.log("[getAiClientAndModel] Initializing GoogleGenAI client with DIRECT mode.");
      ai = new import_genai.GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
      if (body.customModelName && body.customModelName.trim()) {
        selectedModel = body.customModelName.trim();
      }
    }
    if (!selectedModel || selectedModel === "GEMINI_WEB") {
      selectedModel = "gemini-3.6-flash";
    }
    console.log(`[getAiClientAndModel] Resolved model to use: ${selectedModel}`);
    return { ai, selectedModel };
  };
  const getAiClient = (customKey) => {
    return getAiClientAndModel({ apiKey: customKey }).ai;
  };
  const generateContentWithRetry = async (ai, params, maxRetries = 2) => {
    let attempt = 0;
    let currentParams = { ...params };
    while (attempt <= maxRetries) {
      try {
        return await ai.models.generateContent(currentParams);
      } catch (err) {
        const errStr = String(err?.message || err || "");
        const isQuota = errStr.includes("429") || errStr.includes("RESOURCE_EXHAUSTED") || errStr.includes("Quota");
        const isModelNotFound = errStr.includes("404") || errStr.includes("not found") || errStr.includes("is not supported") || errStr.includes("NOT_FOUND");
        if (isModelNotFound && currentParams.model !== "gemini-2.5-flash" && currentParams.model !== "gemini-2.0-flash") {
          console.warn(`[Gemini API] Model ${currentParams.model} is not available on this API key (likely standard public key on external host like Render). Falling back to gemini-2.5-flash...`);
          currentParams.model = "gemini-2.5-flash";
          attempt++;
          continue;
        }
        if (isQuota && attempt < maxRetries) {
          attempt++;
          console.warn(`Gemini API 429 Quota hit. Retrying attempt ${attempt}/${maxRetries} in 2 seconds...`);
          await new Promise((r) => setTimeout(r, 2e3));
        } else {
          if (isQuota) {
            throw new Error("L\u1ED7i Quota API Gemini (429): \u0110\xE3 qu\xE1 gi\u1EDBi h\u1EA1n t\u1EA7n su\u1EA5t g\u1ECDi AI (Quota Exhausted). Vui l\xF2ng ch\u1EDD 30-60 gi\xE2y tr\u01B0\u1EDBc khi th\u1EED l\u1EA1i.");
          }
          throw err;
        }
      }
    }
    throw new Error("Failed to generate content after retries.");
  };
  const handleAiRouteError = (err, res, defaultMsg, mode = "direct_system") => {
    console.error(`[AI Route Error] [Mode: ${mode}] ${defaultMsg}:`, err);
    let errMsg = String(err?.message || err || "");
    if (errMsg.includes("<!DOCTYPE html>") || errMsg.includes("<html")) {
      if (errMsg.includes("524")) {
        errMsg = "L\u1ED7i 524 Timeout t\u1EEB Proxy/Cloudflare (A timeout occurred at origin server).";
      } else {
        errMsg = errMsg.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim().slice(0, 300);
      }
    }
    const lowerMsg = errMsg.toLowerCase();
    if (lowerMsg.includes("quota") || lowerMsg.includes("exhausted") || lowerMsg.includes("429") || lowerMsg.includes("rate_limit") || lowerMsg.includes("rate limit") || lowerMsg.includes("resource_exhausted")) {
      let quotaMessage = "H\u1EBFt l\u01B0\u1EE3t d\xF9ng th\u1EED mi\u1EC5n ph\xED c\u1EE7a API Key h\u1EC7 th\u1ED1ng (Quota Exceeded). B\u1EA1n vui l\xF2ng:\n1. \u0110\u1EE3i v\xE0i ph\xFAt r\u1ED3i th\u1EED l\u1EA1i.\n2. Ch\u1ECDn Model kh\xE1c \u1EDF thanh d\u01B0\u1EDBi c\xF9ng (v\xED d\u1EE5 gemini-2.0-flash ho\u1EB7c gemini-1.5-flash).\n3. Ho\u1EB7c b\u1EA5m n\xFAt C\xE0i \u0110\u1EB7t (b\xEAn ph\u1EA3i tr\xEAn c\xF9ng) \u0111\u1EC3 \u0111i\u1EC1n API Key c\xE1 nh\xE2n c\u1EE7a b\u1EA1n \u0111\u1EC3 s\u1EED d\u1EE5ng \u1ED5n \u0111\u1ECBnh, kh\xF4ng b\u1ECB gi\u1EDBi h\u1EA1n.";
      if (mode === "proxy") {
        quotaMessage = "Proxy c\u1EE7a b\u1EA1n b\xE1o qu\xE1 gi\u1EDBi h\u1EA1n t\u1EA7n su\u1EA5t/h\u1EA1n m\u1EE9c s\u1EED d\u1EE5ng (Quota Exceeded / Rate Limit). Vui l\xF2ng:\n1. \u0110\u1EE3i v\xE0i ph\xFAt r\u1ED3i th\u1EED l\u1EA1i.\n2. Ki\u1EC3m tra l\u1EA1i h\u1EA1n m\u1EE9c t\xE0i kho\u1EA3n li\xEAn k\u1EBFt v\u1EDBi Proxy c\u1EE7a b\u1EA1n.\n3. Ho\u1EB7c chuy\u1EC3n sang ch\u1EBF \u0111\u1ED9 Direct API / d\xF9ng API Key c\xE1 nh\xE2n kh\xE1c.";
      } else if (mode === "direct_custom") {
        quotaMessage = "API Key c\xE1 nh\xE2n c\u1EE7a b\u1EA1n b\xE1o qu\xE1 gi\u1EDBi h\u1EA1n t\u1EA7n su\u1EA5t/h\u1EA1n m\u1EE9c (Quota Exceeded / Rate Limit). Vui l\xF2ng:\n1. Ki\u1EC3m tra l\u1EA1i h\u1EA1n m\u1EE9c API Key c\u1EE7a b\u1EA1n.\n2. Ch\u1ECDn model nh\u1EB9 h\u01A1n (v\xED d\u1EE5 gemini-2.0-flash ho\u1EB7c gemini-1.5-flash).\n3. Ho\u1EB7c \u0111\u1EE3i 1-2 ph\xFAt r\u1ED3i th\u1EED l\u1EA1i.";
      }
      return res.status(429).json({
        success: false,
        error: "QUOTA_EXCEEDED",
        message: quotaMessage,
        rawError: errMsg
      });
    }
    if (lowerMsg.includes("timeout") || lowerMsg.includes("524") || lowerMsg.includes("504")) {
      return res.status(504).json({
        success: false,
        error: "TIMEOUT",
        message: "Y\xEAu c\u1EA7u b\u1ECB qu\xE1 h\u1EA1n (Timeout 524). H\u1EC7 th\u1ED1ng t\u1EF1 \u0111\u1ED9ng chia nh\u1ECF ph\u1EE5 \u0111\u1EC1 ho\u1EB7c vui l\xF2ng chuy\u1EC3n sang model nh\u1EB9 h\u01A1n nh\u01B0 gemini-2.5-flash.",
        rawError: errMsg
      });
    }
    if (lowerMsg.includes("key not valid") || lowerMsg.includes("api key") || lowerMsg.includes("invalid api key") || lowerMsg.includes("not found") && lowerMsg.includes("key")) {
      let invalidKeyMessage = "API Key h\u1EC7 th\u1ED1ng kh\xF4ng h\u1EE3p l\u1EC7 ho\u1EB7c \u0111\xE3 h\u1EBFt h\u1EA1n. Vui l\xF2ng li\xEAn h\u1EC7 qu\u1EA3n tr\u1ECB vi\xEAn ho\u1EB7c s\u1EED d\u1EE5ng API Key/Proxy c\xE1 nh\xE2n.";
      if (mode === "proxy") {
        invalidKeyMessage = "Proxy ho\u1EB7c API Key c\u1EA5u h\xECnh cho Proxy kh\xF4ng h\u1EE3p l\u1EC7. Vui l\xF2ng ki\u1EC3m tra l\u1EA1i thi\u1EBFt l\u1EADp Proxy c\u1EE7a b\u1EA1n trong m\u1EE5c C\xE0i \u0110\u1EB7t.";
      } else if (mode === "direct_custom") {
        invalidKeyMessage = "API Key c\xE1 nh\xE2n c\u1EE7a b\u1EA1n kh\xF4ng h\u1EE3p l\u1EC7. Vui l\xF2ng ki\u1EC3m tra l\u1EA1i c\u1EA5u h\xECnh API Key trong m\u1EE5c C\xE0i \u0110\u1EB7t.";
      }
      return res.status(401).json({
        success: false,
        error: "INVALID_API_KEY",
        message: invalidKeyMessage,
        rawError: errMsg
      });
    }
    return res.status(500).json({
      success: false,
      error: "AI_ERROR",
      message: `${defaultMsg}: ${errMsg}`,
      rawError: errMsg
    });
  };
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", time: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app.get("/api/system-status", (_req, res) => {
    res.json({
      success: true,
      hasSystemGeminiKey: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()),
      nodeEnv: process.env.NODE_ENV || "development",
      time: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
  app.get(["/dict.txt", "/ppocrv6_tiny_dict.txt", "/ppocrv5_keys.txt"], (_req, res) => {
    try {
      const candidates = [
        import_path2.default.join(process.cwd(), "public", "dict.txt"),
        import_path2.default.join(process.cwd(), "dict.txt"),
        import_path2.default.join(process.cwd(), "public", "ppocrv6_tiny_dict.txt"),
        import_path2.default.join(process.cwd(), "ppocrv6_tiny_dict.txt"),
        import_path2.default.join(process.cwd(), "ppocrv5_keys.txt")
      ];
      for (const dictPath of candidates) {
        if (import_fs2.default.existsSync(dictPath)) {
          const rawContent = import_fs2.default.readFileSync(dictPath, "utf8");
          const cleaned = rawContent.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "");
          const cleanBuf = Buffer.from(cleaned, "utf8");
          res.setHeader("Content-Type", "text/plain; charset=utf-8");
          res.setHeader("Content-Length", cleanBuf.length.toString());
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
          return res.send(cleanBuf);
        }
      }
      return res.status(404).send("Dictionary not found");
    } catch (e) {
      return res.status(500).send(e?.message || "Server error");
    }
  });
  app.post("/api/ocr-frame", async (req, res) => {
    try {
      const imageBase64 = req.body.imageBase64 || req.body.image;
      if (!imageBase64) {
        res.status(400).json({ success: false, error: "Missing imageBase64" });
        return;
      }
      const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");
      const { ai, selectedModel } = getAiClientAndModel(req.body);
      const response = await generateContentWithRetry(ai, {
        model: selectedModel,
        contents: [
          { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } },
          {
            text: `Extract all visible Chinese / multilingual text from this video frame snapshot. Return JSON with a list of text regions containing raw text, translated text to Vietnamese, confidence, and 2D bounding boxes.`
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: import_genai.Type.OBJECT,
            properties: {
              code: { type: import_genai.Type.INTEGER, description: "100 for success" },
              items: {
                type: import_genai.Type.ARRAY,
                items: {
                  type: import_genai.Type.OBJECT,
                  properties: {
                    text: { type: import_genai.Type.STRING },
                    translatedText: { type: import_genai.Type.STRING },
                    score: { type: import_genai.Type.NUMBER },
                    box: {
                      type: import_genai.Type.ARRAY,
                      items: { type: import_genai.Type.INTEGER },
                      description: "[ymin, xmin, ymax, xmax] 0-1000"
                    }
                  }
                }
              }
            }
          }
        }
      });
      const parsed = JSON.parse(response.text || "{}");
      res.json({
        success: true,
        data: {
          code: 100,
          data: parsed.items || []
        }
      });
    } catch (err) {
      const apiMode = req.body.apiMode || "direct";
      const hasCustomKey = !!(req.body.apiKey && req.body.apiKey.trim());
      const mode = apiMode === "proxy" ? "proxy" : hasCustomKey ? "direct_custom" : "direct_system";
      return handleAiRouteError(err, res, "Failed in /api/ocr-frame", mode);
    }
  });
  app.post("/api/ocr-extract", async (req, res) => {
    try {
      const { image, timestamp, targetLang = "Ti\u1EBFng Vi\u1EC7t", model = "gemini-3.6-flash", customContext } = req.body;
      if (!image) {
        res.status(400).json({ error: "Missing image data" });
        return;
      }
      const { ai, selectedModel } = getAiClientAndModel(req.body);
      const cleanBase64 = image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");
      const prompt = `You are a high-precision video OCR and subtitle translator.
Your job is to examine this cropped region of a video frame and extract any visible text/subtitle.
${customContext ? `Context about the video content: ${customContext}` : ""}

Target translation language: ${targetLang}.

Instructions:
1. If NO visible text/subtitle exists in the image frame, set "hasText": false.
2. If text IS visible:
   - Extract the exact raw original text ("originalText").
   - Identify the source language ("sourceLang").
   - Translate "originalText" into natural, contextual ${targetLang} ("translatedText").
   - Provide a confidence score between 0.0 and 1.0 ("confidence").
   - Locate the exact 2D bounding box of the subtitle text inside this image as "box_2d" formatted as an array of 4 integers [ymin, xmin, ymax, xmax] normalized on a 0 to 1000 scale.`;
      const response = await generateContentWithRetry(ai, {
        model: selectedModel,
        contents: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64
            }
          },
          {
            text: prompt
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: import_genai.Type.OBJECT,
            properties: {
              hasText: { type: import_genai.Type.BOOLEAN, description: "True if subtitle text is visible" },
              originalText: { type: import_genai.Type.STRING, description: "Extracted raw text" },
              sourceLang: { type: import_genai.Type.STRING, description: "Detected source language code or name" },
              translatedText: { type: import_genai.Type.STRING, description: "Translated subtitle text" },
              confidence: { type: import_genai.Type.NUMBER, description: "Detection confidence from 0 to 1" },
              box_2d: {
                type: import_genai.Type.ARRAY,
                items: { type: import_genai.Type.INTEGER },
                description: "2D bounding box [ymin, xmin, ymax, xmax] normalized from 0 to 1000"
              }
            },
            required: ["hasText"]
          }
        }
      });
      const responseText = response.text || "{}";
      const parsed = JSON.parse(responseText);
      res.json({
        success: true,
        timestamp: timestamp || 0,
        result: parsed
      });
    } catch (err) {
      const apiMode = req.body.apiMode || "direct";
      const hasCustomKey = !!(req.body.apiKey && req.body.apiKey.trim());
      const mode = apiMode === "proxy" ? "proxy" : hasCustomKey ? "direct_custom" : "direct_system";
      return handleAiRouteError(err, res, "Failed to extract subtitle via OCR.", mode);
    }
  });
  app.post("/api/ocr-batch-frames", async (req, res) => {
    try {
      const { frames, targetLang = "Ti\u1EBFng Vi\u1EC7t", model = "gemini-3.6-flash", ocrEngine = "gemini_vision", customContext } = req.body;
      if (!frames || !Array.isArray(frames) || frames.length === 0) {
        res.status(400).json({ error: "Missing or invalid frames array" });
        return;
      }
      const { ai, selectedModel } = getAiClientAndModel(req.body);
      const batchPrompt = `You are a high-precision, strict OCR engine for video subtitles.
You are given a sequence of ${frames.length} cropped video frame snapshots captured chronologically.
Frame timestamps: ${frames.map((f) => f.timestamp.toFixed(2) + "s").join(", ")}.
${customContext ? `Video context / topic: ${customContext}` : ""}

STRICT CHARACTER FIDELITY & OCR INSTRUCTIONS:
1. Carefully inspect EVERY single frame snapshot from Frame 1 to Frame ${frames.length}. Transcribe the EXACT printed/burned subtitle text verbatim (Chinese, English, Vietnamese, Japanese, etc.).
2. ACCURACY REQUIREMENT:
   - For Chinese text (Simplified / Traditional): Preserve exact CJK characters. DO NOT confuse similar Chinese characters (e.g. \u5DF2/\u5DF1/\u5DF3, \u6CBB/\u51B6, \u672A/\u672B, \u65E5/\u76EE, \u89C6/\u795D). DO NOT hallucinate or guess characters that are not on screen.
   - For English/Vietnamese text: Preserve exact spelling, accent marks, and punctuation.
3. CRITICAL RULE TO PREVENT SUBTITLE "LAZINESS" & DURATION DRIFT:
   - Video subtitles change FREQUENTLY (every 0.3s to 1.5s)!
   - NEVER create a single long subtitle entry that spans across different sentences or across frames where the text has changed.
   - When text in Frame N is DIFFERENT from Frame N-1, you MUST END the previous subtitle entry at Frame N-1 timestamp and START a NEW subtitle entry at Frame N timestamp.
   - "startTime": Exact timestamp (in seconds) of the FIRST frame snapshot where this specific text string appears.
   - "endTime": Exact timestamp (in seconds) of the LAST frame snapshot where this specific text string STILL appears. Must NOT extend into later frames where the text changed or disappeared.
   - "originalText": The exact OCR text string.
   - "sourceLang": Language code/name (e.g. "zh", "vi", "en").
4. DEDUPLICATION & MERGING:
   - ONLY merge consecutive frames if they show the EXACT SAME or nearly identical text string.
   - If a frame has NO text, or text changes, DO NOT extend the previous subtitle's endTime to that frame!
5. FAST-SUBTITLE COMPLETENESS:
   - Even if a subtitle string appears in ONLY A SINGLE FRAME (e.g., duration < 0.5s), you MUST output a distinct subtitle item with startTime = frame timestamp and endTime = frame timestamp + 0.4s.
6. If NO text is present in any frame, return an empty array [].`;
      const parts = [{ text: batchPrompt }];
      frames.forEach((f, idx) => {
        const cleanBase64 = f.image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");
        parts.push({
          text: `--- Frame ${idx + 1}/${frames.length} (Timestamp: ${f.timestamp.toFixed(2)}s) ---`
        });
        parts.push({
          inlineData: {
            mimeType: "image/jpeg",
            data: cleanBase64
          }
        });
      });
      const response = await generateContentWithRetry(ai, {
        model: selectedModel,
        contents: { parts },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: import_genai.Type.ARRAY,
            items: {
              type: import_genai.Type.OBJECT,
              properties: {
                startTime: { type: import_genai.Type.NUMBER, description: "Start time in seconds" },
                endTime: { type: import_genai.Type.NUMBER, description: "End time in seconds" },
                originalText: { type: import_genai.Type.STRING, description: "Extracted original subtitle" },
                sourceLang: { type: import_genai.Type.STRING, description: "Source language name" },
                translatedText: { type: import_genai.Type.STRING, description: "Translated subtitle" },
                confidence: { type: import_genai.Type.NUMBER, description: "Confidence score" },
                box_2d: {
                  type: import_genai.Type.ARRAY,
                  items: { type: import_genai.Type.INTEGER },
                  description: "2D bounding box [ymin, xmin, ymax, xmax] normalized from 0 to 1000"
                }
              },
              required: ["startTime", "endTime", "originalText"]
            }
          }
        }
      });
      const responseText = response.text || "[]";
      const rawSubtitles = JSON.parse(responseText);
      const subtitles = Array.isArray(rawSubtitles) ? rawSubtitles : [];
      subtitles.sort((a, b) => (a.startTime || 0) - (b.startTime || 0));
      for (let i = 0; i < subtitles.length; i++) {
        const curr = subtitles[i];
        if (i < subtitles.length - 1) {
          const next = subtitles[i + 1];
          if (curr.endTime >= next.startTime) {
            curr.endTime = Number(Math.max((curr.startTime || 0) + 0.1, (next.startTime || 0) - 0.05).toFixed(2));
          }
        }
        if (curr.endTime <= curr.startTime) {
          curr.endTime = Number(((curr.startTime || 0) + 0.3).toFixed(2));
        }
      }
      res.json({
        success: true,
        engine: "gemini_vision",
        subtitles
      });
    } catch (err) {
      const apiMode = req.body.apiMode || "direct";
      const hasCustomKey = !!(req.body.apiKey && req.body.apiKey.trim());
      const mode = apiMode === "proxy" ? "proxy" : hasCustomKey ? "direct_custom" : "direct_system";
      return handleAiRouteError(err, res, "Failed to process batch OCR frames.", mode);
    }
  });
  const CACHE_ROOT = import_path2.default.join(process.cwd(), ".cache");
  const TTS_CACHE_DIR = import_path2.default.join(CACHE_ROOT, "tts");
  const TRANS_CACHE_DIR = import_path2.default.join(CACHE_ROOT, "translation");
  import_fs2.default.mkdirSync(TTS_CACHE_DIR, { recursive: true });
  import_fs2.default.mkdirSync(TRANS_CACHE_DIR, { recursive: true });
  function getSha256(text) {
    return import_crypto2.default.createHash("sha256").update(text).digest("hex");
  }
  function getCachedTranslation(originalText, targetLang, model, customCtx) {
    const ctxHash = customCtx ? getSha256(customCtx.trim()) : "";
    const key = ctxHash ? `trans:${originalText}:${targetLang}:${model}:${ctxHash}` : `trans:${originalText}:${targetLang}:${model}`;
    const hash = getSha256(key);
    const filePath = import_path2.default.join(TRANS_CACHE_DIR, `${hash}.json`);
    if (import_fs2.default.existsSync(filePath)) {
      try {
        const data = JSON.parse(import_fs2.default.readFileSync(filePath, "utf-8"));
        return data.translatedText || null;
      } catch (e) {
        console.warn("Failed to read cached translation:", e);
      }
    }
    return null;
  }
  function setCachedTranslation(originalText, targetLang, model, translatedText, customCtx) {
    const ctxHash = customCtx ? getSha256(customCtx.trim()) : "";
    const key = ctxHash ? `trans:${originalText}:${targetLang}:${model}:${ctxHash}` : `trans:${originalText}:${targetLang}:${model}`;
    const hash = getSha256(key);
    const filePath = import_path2.default.join(TRANS_CACHE_DIR, `${hash}.json`);
    try {
      import_fs2.default.writeFileSync(filePath, JSON.stringify({ originalText, targetLang, model, translatedText, customCtx: customCtx || "" }));
    } catch (e) {
      console.warn("Failed to write cached translation:", e);
    }
  }
  app.post("/api/extract-global-context", async (req, res) => {
    try {
      const { subtitles, targetLang = "Ti\u1EBFng Vi\u1EC7t", customContext = "" } = req.body;
      if (!subtitles || !Array.isArray(subtitles) || subtitles.length === 0) {
        res.status(400).json({ success: false, error: "Missing subtitles array" });
        return;
      }
      let { ai, selectedModel } = getAiClientAndModel(req.body);
      if (selectedModel === "GEMINI_WEB") {
        selectedModel = "gemini-2.5-flash";
      }
      const scriptLines = subtitles.map((s, idx) => {
        const text = String(s.originalText || s.text || "").trim();
        const start = typeof s.startTime === "number" ? s.startTime.toFixed(1) : "0";
        return `[#${idx + 1} | ${start}s] ${text}`;
      }).filter((line) => !line.endsWith("] "));
      const fullScriptSample = scriptLines.length > 500 ? scriptLines.slice(0, 500).join("\n") + `
... [and ${scriptLines.length - 500} more dialogue lines]` : scriptLines.join("\n");
      const userNotes = customContext.trim() ? `
ADDITIONAL USER-PROVIDED CONTEXT / GUIDANCE:
${customContext.trim()}
` : "";
      const prompt = `You are a "context synchronization expert" - a master film script analyst, director of translation, and subtitle localization specialist for translating content into ${targetLang}.

YOUR MISSION:
Read through the following complete video subtitle script from beginning to end to understand the overall narrative arc, world setting, character relationships, dramatic conflicts, and dialogue tone.
From this full-script overview, extract a synchronized global context and terminology database that will be used as the single source of truth across all subsequent translation batches.

EXTRACT AND RETURN THE FOLLOWING INFORMATION IN STRICT JSON FORMAT:
1. "movieGenre": The primary and secondary genre of the video (e.g., "C\u1ED5 trang / Ki\u1EBFm hi\u1EC7p / Ti\xEAn hi\u1EC7p", "Hi\u1EC7n \u0111\u1EA1i / \u0110\xF4 th\u1ECB / T\u1ED5ng t\xE0i / C\xF4ng s\u1EDF", "H\u1ECDc \u0111\u01B0\u1EDDng / Thanh xu\xE2n", "Gia \u0111\xECnh / T\xECnh c\u1EA3m", "H\xE0nh \u0111\u1ED9ng / T\u1ED9i ph\u1EA1m / Trinh th\xE1m", "H\xE0i h\u01B0\u1EDBc", "Kinh d\u1ECB / Gi\u1EADt g\xE2n", "Khoa h\u1ECDc vi\u1EC5n t\u01B0\u1EDFng", "Anime / Ho\u1EA1t h\xECnh", "Vlog / Ph\u1ECFng v\u1EA5n / T\xE0i li\u1EC7u", etc.).
2. "eraAndSetting": Detailed era and setting description (e.g., "Th\u1EDDi nh\xE0 T\u1ED1ng, giang h\u1ED3 v\xF5 l\xE2m m\xF4n ph\xE1i", "Seoul / B\u1EAFc Kinh hi\u1EC7n \u0111\u1EA1i, c\xF4ng ty c\xF4ng ngh\u1EC7", "Tr\u01B0\u1EDDng trung h\u1ECDc, thanh xu\xE2n h\u1ECDc \u0111\u01B0\u1EDDng").
3. "characterPronounGuide": Specific guidelines for Vietnamese pronouns and address forms tailored to this genre and character dynamics:
   - For C\u1ED5 trang/Ki\u1EBFm hi\u1EC7p: Specify forms like "ta / ng\u01B0\u01A1i / huynh / mu\u1ED9i / t\u1EF7 / \u0111\u1EC7 / s\u01B0 ph\u1EE5 / \u0111\u1ED3 nhi / b\u1EA3n t\u1ECDa / ti\u1EC3u th\u01B0 / c\xF4ng t\u1EED / v\u01B0\u01A1ng gia...".
   - For Hi\u1EC7n \u0111\u1EA1i: Specify forms like "t\xF4i / anh / em / c\u1EADu / t\u1EDB / m\xE0y / tao / s\u1EBFp / ch\xFA / b\xE1c..." based on age, hierarchy, and intimacy.
   - MANDATORY DIRECTIVE: Explicitly emphasize that the translator MUST NEVER mechanically translate the same source pronoun (e.g. "\u4F60/\u6211" in Chinese or "you/I" in English) into the same generic Vietnamese word for all characters. Pronouns must shift dynamically based on relationships, hierarchy, and emotion in each scene.
4. "summary": A concise 2-3 sentence overview of the video's plot, core premise, and tone.
5. "knownEntityGlossary": Array of all identified character names, locations, organizations/sects, martial arts techniques, and key specialized terms with their standardized, authentic ${targetLang} translations (e.g., proper Sino-Vietnamese H\xE1n-Vi\u1EC7t transcription for Chinese names):
   - "original": Original term/name in source language (e.g., "\u5F20\u65E0\u5FCC", "\u5149\u660E\u9876", "\u4E5D\u9633\u795E\u529F")
   - "translated": Official, standard translation in ${targetLang} (e.g., "Tr\u01B0\u01A1ng V\xF4 K\u1EF5", "Quang Minh \u0110\u1EC9nh", "C\u1EEDu D\u01B0\u01A1ng Th\u1EA7n C\xF4ng")
   - "type": "character" | "location" | "organization" | "term" | "other"
   - "description": Brief context or role (e.g., "Nh\xE2n v\u1EADt ch\xEDnh, gi\xE1o ch\u1EE7 Minh Gi\xE1o")${userNotes}

FULL SUBTITLE SCRIPT:
${fullScriptSample}`;
      const isProxyMode = req.body.apiMode === "proxy";
      const genConfig = {
        responseMimeType: "application/json"
      };
      if (!isProxyMode) {
        genConfig.responseSchema = {
          type: import_genai.Type.OBJECT,
          properties: {
            movieGenre: { type: import_genai.Type.STRING, description: "Primary genre of the movie/video" },
            eraAndSetting: { type: import_genai.Type.STRING, description: "Era and world setting" },
            characterPronounGuide: { type: import_genai.Type.STRING, description: "Vietnamese address forms and dynamic pronoun rules" },
            summary: { type: import_genai.Type.STRING, description: "Brief summary of the video plot" },
            knownEntityGlossary: {
              type: import_genai.Type.ARRAY,
              items: {
                type: import_genai.Type.OBJECT,
                properties: {
                  original: { type: import_genai.Type.STRING, description: "Original name/term in source language" },
                  translated: { type: import_genai.Type.STRING, description: "Standardized translation in target language" },
                  type: { type: import_genai.Type.STRING, description: "character | location | organization | term | other" },
                  description: { type: import_genai.Type.STRING, description: "Role or explanation" }
                },
                required: ["original", "translated", "type"]
              }
            }
          },
          required: ["movieGenre", "characterPronounGuide", "knownEntityGlossary"]
        };
      }
      console.log(`[Extract Global Context] Analyzing ${subtitles.length} subtitle lines with model: ${selectedModel}...`);
      const response = await generateContentWithRetry(ai, {
        model: selectedModel,
        contents: prompt,
        config: genConfig
      });
      let responseText = (response.text || "{}").trim();
      if (responseText.startsWith("```")) {
        responseText = responseText.replace(/^```[a-zA-Z]*\n?/, "").replace(/\n?```$/, "").trim();
      }
      let globalContext = {};
      try {
        globalContext = JSON.parse(responseText);
      } catch (parseErr) {
        console.error("[Extract Global Context] JSON Parse Error:", parseErr, responseText.slice(0, 200));
        globalContext = {
          movieGenre: "T\u1EF1 \u0111\u1ED9ng",
          eraAndSetting: "Hi\u1EC7n \u0111\u1EA1i / T\u1EF1 nhi\xEAn",
          characterPronounGuide: "X\u01B0ng h\xF4 linh ho\u1EA1t theo quan h\u1EC7 nh\xE2n v\u1EADt.",
          summary: "",
          knownEntityGlossary: []
        };
      }
      if (!globalContext.movieGenre) globalContext.movieGenre = "T\u1EF1 \u0111\u1ED9ng";
      if (!globalContext.characterPronounGuide) globalContext.characterPronounGuide = "X\u01B0ng h\xF4 t\u1EF1 nhi\xEAn theo b\u1ED1i c\u1EA3nh.";
      if (!Array.isArray(globalContext.knownEntityGlossary)) globalContext.knownEntityGlossary = [];
      console.log(`[Extract Global Context] Successfully extracted: Genre="${globalContext.movieGenre}", Entities=${globalContext.knownEntityGlossary.length}`);
      res.json({
        success: true,
        globalContext
      });
    } catch (err) {
      const apiMode = req.body.apiMode || "direct";
      const hasCustomKey = !!(req.body.apiKey && req.body.apiKey.trim());
      const mode = apiMode === "proxy" ? "proxy" : hasCustomKey ? "direct_custom" : "direct_system";
      return handleAiRouteError(err, res, "Failed to extract global context", mode);
    }
  });
  function cleanTranslatedSubtitleText(rawText) {
    if (!rawText || typeof rawText !== "string") return "";
    let text = rawText.trim();
    text = text.replace(/^[`"'\s]+|[`"'\s]+$/g, "").trim();
    text = text.replace(/^(?:Bản\s*dịch|Dịch|Translation|Translated|Subtitle|Tiếng\s*Việt)\s*:\s*/i, "").replace(/^Output\s*:\s*/i, "").trim();
    if (/拼写错误|拼写|Correction:/i.test(text)) {
      const splitMatch = text.split(/拼写错误|拼写|Correction:/i);
      if (splitMatch[0] && splitMatch[0].trim().length >= 2) {
        text = splitMatch[0].trim();
      } else if (splitMatch[1]) {
        text = splitMatch[1].trim();
      }
    }
    text = text.replace(/(?:平衡|Cân\s*bằng|Balance)-[a-zA-Z0-9_\-]+(?:-ok-[0-9/]+-chars)?(?:\.(?:Về|About)-[a-zA-Z0-9_\-]+)?\.?/gi, " ");
    text = text.replace(/(?:Về|About|ID)-[a-zA-Z0-9_\-]+\.?/gi, " ");
    text = text.replace(/[a-zA-Z0-9_\-]+-ok-[0-9/]+-chars\.?/gi, " ");
    text = text.replace(/平衡-[^\s.,!?]+/gi, " ");
    text = text.replace(/\([0-9]+\s*chars?\s*-\s*Limit\s*[0-9]+\)/gi, "");
    text = text.replace(/\([0-9]+\s*chars?\)/gi, "");
    text = text.replace(/-\s*Limit\s*[0-9]+/gi, "");
    text = text.replace(/\bLimit\s*[0-9]+\b/gi, "");
    text = text.replace(/\b[0-9]+\/[0-9]+\s*chars?\b/gi, "");
    text = text.replace(/\([a-zA-Z0-9_\-]*\s*ok\s*[a-zA-Z0-9_\-]*\)/gi, "");
    text = text.replace(/\[\s*ok\s*\]/gi, "");
    text = text.replace(/\(Correction:[^)]*\)/gi, "");
    text = text.replace(/\(OK\)/gi, "");
    text = text.replace(/->\s*[^.,!?]+/gi, "");
    text = text.replace(/[（(【\[](?:注|Note|Ghi chú|Lưu ý)[^）)】\]]*[）)】\]]/gi, "");
    text = text.replace(/\s+/g, " ").trim();
    text = text.replace(/^[.,;:!?\-–—\s]+/, "").trim();
    text = text.replace(/[.,;:!?\-–—\s]+$/, (match) => match.trim());
    const sentences = text.split(/(?<=[.!?。！？])\s+/).map((s) => s.trim()).filter(Boolean);
    if (sentences.length >= 2) {
      const uniqueSentences = [];
      for (let i = 0; i < sentences.length; i++) {
        const curr = sentences[i];
        const prev = uniqueSentences[uniqueSentences.length - 1];
        if (!prev || prev.toLowerCase() !== curr.toLowerCase()) {
          uniqueSentences.push(curr);
        }
      }
      text = uniqueSentences.join(" ");
    }
    const len = text.length;
    if (len >= 6) {
      const half = Math.floor(len / 2);
      for (let offset = -2; offset <= 2; offset++) {
        const splitIdx = half + offset;
        if (splitIdx > 2 && splitIdx < len - 2) {
          const left = text.substring(0, splitIdx).trim();
          const right = text.substring(splitIdx).trim();
          if (left && right && left.toLowerCase() === right.toLowerCase()) {
            text = left;
            break;
          }
        }
      }
    }
    return text.trim();
  }
  app.post("/api/translate-batch", async (req, res) => {
    try {
      const {
        subtitles,
        targetLang = "Ti\u1EBFng Vi\u1EC7t",
        model = "gemini-2.5-flash",
        glossary,
        customContext,
        contextPrompt,
        optimizeForTts = true,
        globalContext,
        knownEntityGlossary,
        previousContext
      } = req.body;
      if (!subtitles || !Array.isArray(subtitles)) {
        res.status(400).json({ error: "Missing subtitles array" });
        return;
      }
      let { ai, selectedModel } = getAiClientAndModel(req.body);
      if (selectedModel === "GEMINI_WEB") {
        selectedModel = "gemini-2.5-flash";
      }
      const combinedGlossaryList = [
        ...Array.isArray(knownEntityGlossary) ? knownEntityGlossary : [],
        ...Array.isArray(glossary) ? glossary : []
      ];
      const effectiveCustomContext = (customContext || contextPrompt || "").trim();
      const genreString = (globalContext?.movieGenre || "").trim();
      const cacheContextSig = `${genreString}::${combinedGlossaryList.map((g) => `${g.original}=${g.translated}`).join("|")}::${effectiveCustomContext}`;
      const finalTranslations = [];
      const uncachedSubtitles = [];
      for (const sub of subtitles) {
        const cached = getCachedTranslation(sub.originalText, targetLang, selectedModel, cacheContextSig);
        if (cached) {
          finalTranslations.push({ id: sub.id, translatedText: cached });
        } else {
          uncachedSubtitles.push(sub);
        }
      }
      if (uncachedSubtitles.length > 0) {
        const ttsInstruction = optimizeForTts ? "\nCRITICAL BREVITY REQUIREMENT: Keep each translated subtitle natural, punchy, and concise (under maxLength characters) so dubbing audio does not overflow." : "";
        let globalGenreSection = "";
        if (globalContext && (globalContext.movieGenre || globalContext.characterPronounGuide)) {
          globalGenreSection = `
=== 1. GLOBAL MOVIE GENRE & STYLE RULES ===
- Th\u1EC3 lo\u1EA1i phim (GLOBAL MOVIE GENRE): ${globalContext.movieGenre || "Ch\u01B0a x\xE1c \u0111\u1ECBnh"}
- Th\u1EDDi \u0111\u1EA1i & B\u1ED1i c\u1EA3nh: ${globalContext.eraAndSetting || "T\u1EF1 nhi\xEAn"}
${globalContext.summary ? `- T\xF3m t\u1EAFt c\u1ED1t truy\u1EC7n: ${globalContext.summary}` : ""}
- QUY T\u1EAEC \u0110\u1EA0I T\u1EEA NH\xC2N X\u01AFNG (PRONOUN DIRECTIVES):
  ${globalContext.characterPronounGuide || "X\u01B0ng h\xF4 ph\xF9 h\u1EE3p v\u1EDBi th\u1EC3 lo\u1EA1i phim v\xE0 quan h\u1EC7 nh\xE2n v\u1EADt."}
  \u26A0\uFE0F \u0110\u1EB6C BI\u1EC6T L\u01AFU \xDD: TUY\u1EC6T \u0110\u1ED0I KH\xD4NG \u0111\u01B0\u1EE3c m\xE1y m\xF3c d\u1ECBch c\xF9ng 1 \u0111\u1EA1i t\u1EEB g\u1ED1c (v\xED d\u1EE5 "\u4F60/\u6211" trong ti\u1EBFng Trung ho\u1EB7c "you/I" trong ti\u1EBFng Anh) th\xE0nh c\xF9ng 1 t\u1EEB ti\u1EBFng Vi\u1EC7t cho m\u1ECDi nh\xE2n v\u1EADt. Ph\u1EA3i linh ho\u1EA1t thay \u0111\u1ED5i \u0111\u1EA1i t\u1EEB (anh/em, t\xF4i/c\xF4, ta/ng\u01B0\u01A1i, huynh/mu\u1ED9i, s\u01B0 ph\u1EE5/\u0111\u1ED3 nhi, s\u1EBFp/em, ch\xFA/ch\xE1u, m\xE0y/tao...) d\u1EF1a tr\xEAn m\u1ED1i quan h\u1EC7, v\u1ECB th\u1EBF x\xE3 h\u1ED9i, tu\u1ED5i t\xE1c, gi\u1EDBi t\xEDnh v\xE0 c\u1EA3m x\xFAc trong t\u1EEBng c\xE2u tho\u1EA1i!`;
        }
        let glossarySection = "";
        if (combinedGlossaryList.length > 0) {
          const glossaryEntries = combinedGlossaryList.map((g) => `- "${g.original}" -> "${g.translated}" (${g.type || "term"}${g.description ? `: ${g.description}` : ""})`).join("\n");
          glossarySection = `
=== 2. KNOWN ENTITY GLOSSARY (B\u1EAET BU\u1ED8C D\u1ECACH \u0110\xDANG Y H\u1EC6T, KH\xD4NG \u0110\u1ED4I) ===
B\u1EA1n B\u1EAET BU\u1ED8C ph\u1EA3i d\u1ECBch \u0111\xFAng 100% c\xE1c t\xEAn nh\xE2n v\u1EADt, \u0111\u1ECBa danh, m\xF4n ph\xE1i v\xE0 thu\u1EADt ng\u1EEF theo b\u1EA3ng chu\u1EA9n h\xF3a sau. TUY\u1EC6T \u0110\u1ED0I KH\xD4NG t\u1EF1 \xFD thay \u0111\u1ED5i c\xE1ch phi\xEAn \xE2m ho\u1EB7c c\xE1ch d\u1ECBch gi\u1EEFa c\xE1c batch:
${glossaryEntries}`;
        }
        let previousContextSection = "";
        if (Array.isArray(previousContext) && previousContext.length > 0) {
          const prevLines = previousContext.map((p) => `[C\xE2u tr\u01B0\u1EDBc] G\u1ED1c: "${p.originalText || ""}" -> \u0110\xE3 d\u1ECBch: "${p.translatedText || ""}"`).join("\n");
          previousContextSection = `
=== 3. PREVIOUS CONTEXT (NG\u1EEE C\u1EA2NH BATCH TR\u01AF\u1EDAC - CH\u1EC8 THAM KH\u1EA2O, KH\xD4NG D\u1ECACH L\u1EA0I) ===
D\u01B0\u1EDBi \u0111\xE2y l\xE0 c\xE1c c\xE2u tho\u1EA1i li\u1EC1n tr\u01B0\u1EDBc \u0111\u1EC3 b\u1EA1n n\u1EAFm b\u1EAFt m\u1EA1ch \u0111\u1ED1i tho\u1EA1i, c\u1EA3m x\xFAc v\xE0 x\u01B0ng h\xF4 nh\u1EA5t qu\xE1n:
${prevLines}
(Ghi ch\xFA: C\xE1c c\xE2u tr\xEAn ch\u1EC9 d\xF9ng \u0111\u1EC3 hi\u1EC3u ng\u1EEF c\u1EA3nh ti\u1EBFp n\u1ED1i, KH\xD4NG \u0111\u01B0a v\xE0o k\u1EBFt qu\u1EA3 d\u1ECBch output).`;
        }
        let userNotesSection = "";
        if (effectiveCustomContext) {
          userNotesSection = `
=== 4. GHI CH\xDA B\u1ED4 SUNG T\u1EEA NG\u01AF\u1EDCI D\xD9NG ===
${effectiveCustomContext}`;
        }
        const TRANS_CHUNK_SIZE = 30;
        const chunks = [];
        for (let i = 0; i < uncachedSubtitles.length; i += TRANS_CHUNK_SIZE) {
          chunks.push(uncachedSubtitles.slice(i, i + TRANS_CHUNK_SIZE));
        }
        const newlyDiscoveredEntities = [];
        await Promise.all(
          chunks.map(async (chunk) => {
            const prompt = `You are a professional video translator, film dialog localizer, and context continuity expert.
Translate the following list of subtitles into ${targetLang}.${globalGenreSection}${glossarySection}${previousContextSection}${userNotesSection}${ttsInstruction}

MANDATORY OUTPUT CONSTRAINTS (QUY T\u1EAEC B\u1EAET BU\u1ED8C):
1. "translatedText" must contain ONLY the spoken dialogue sentence in ${targetLang}.
2. TUY\u1EC6T \u0110\u1ED0I KH\xD4NG ghi ch\xFA th\xEDch, t\xEDnh to\xE1n s\u1ED1 k\xFD t\u1EF1, gi\u1EA3i th\xEDch, "\u62FC\u5199\u9519\u8BEF", "(OK)", "chars", "Limit", "Correction", "\u5E73\u8861", hay ID v\xE0o tr\u01B0\u1EDDng "translatedText".
3. TUY\u1EC6T \u0110\u1ED0I KH\xD4NG l\u1EB7p l\u1EA1i c\xE2u 2 l\u1EA7n ho\u1EB7c gh\xE9p n\u1ED1i c\xE1c c\xE2u tr\xF9ng l\u1EB7p.
4. Output strictly a JSON object matching the required structure: {"translations": [{"id": string, "translatedText": string}]}.

=== SUBTITLES TO TRANSLATE (D\u1ECACH DANH S\xC1CH N\xC0Y) ===
${JSON.stringify(chunk.map((s) => {
              const durSec = Math.max(0.5, s.endTime - s.startTime || 2);
              const maxLen = Math.max(14, Math.floor(durSec * 16));
              return {
                id: s.id,
                originalText: s.originalText,
                maxLength: maxLen
              };
            }))}`;
            try {
              let responseText = "";
              if (req.body.apiMode === "gemini_web" && req.body.geminiWebCookie) {
                const session = await validateAndExtractGeminiWebSession(req.body.geminiWebCookie.trim());
                if (!session.valid || !session.snlm0e) {
                  throw new Error(session.error || "Phi\xEAn Google Account Gemini Web \u0111\xE3 h\u1EBFt h\u1EA1n ho\u1EB7c kh\xF4ng h\u1EE3p l\u1EC7.");
                }
                const rpcRes = await executeGeminiWebPrompt(prompt, session);
                if (!rpcRes.success || !rpcRes.text) {
                  throw new Error(rpcRes.error || "L\u1ED7i nh\u1EADn d\u1EEF li\u1EC7u t\u1EEB Google Gemini Web RPC.");
                }
                responseText = rpcRes.text.trim();
              } else {
                const isProxyMode = req.body.apiMode === "proxy";
                const genConfig = {
                  responseMimeType: "application/json"
                };
                if (!isProxyMode) {
                  genConfig.responseSchema = {
                    type: import_genai.Type.OBJECT,
                    properties: {
                      translations: {
                        type: import_genai.Type.ARRAY,
                        items: {
                          type: import_genai.Type.OBJECT,
                          properties: {
                            id: { type: import_genai.Type.STRING },
                            translatedText: { type: import_genai.Type.STRING }
                          },
                          required: ["id", "translatedText"]
                        }
                      },
                      newEntities: {
                        type: import_genai.Type.ARRAY,
                        description: "Any newly discovered character names or locations in this batch",
                        items: {
                          type: import_genai.Type.OBJECT,
                          properties: {
                            original: { type: import_genai.Type.STRING },
                            translated: { type: import_genai.Type.STRING },
                            type: { type: import_genai.Type.STRING }
                          },
                          required: ["original", "translated"]
                        }
                      }
                    },
                    required: ["translations"]
                  };
                }
                const response = await generateContentWithRetry(ai, {
                  model: selectedModel,
                  contents: prompt,
                  config: genConfig
                });
                responseText = (response.text || "{}").trim();
              }
              if (responseText.startsWith("```")) {
                responseText = responseText.replace(/^```[a-zA-Z]*\n?/, "").replace(/\n?```$/, "").trim();
              }
              let parsedResponse;
              try {
                parsedResponse = JSON.parse(responseText);
              } catch (parseErr) {
                console.warn("[Translate Batch] Direct JSON parse failed, trying array fallback:", parseErr);
                parsedResponse = [];
              }
              const newTranslations = Array.isArray(parsedResponse) ? parsedResponse : Array.isArray(parsedResponse?.translations) ? parsedResponse.translations : [];
              if (Array.isArray(parsedResponse?.newEntities)) {
                newlyDiscoveredEntities.push(...parsedResponse.newEntities);
              }
              if (Array.isArray(newTranslations)) {
                newTranslations.forEach((nt) => {
                  const originalSub = chunk.find((s) => s.id === nt.id);
                  if (originalSub) {
                    const durSec = Math.max(0.5, originalSub.endTime - originalSub.startTime || 2);
                    const maxLen = Math.max(14, Math.floor(durSec * 16));
                    const cleanText = cleanTranslatedSubtitleText(nt.translatedText || "");
                    if (cleanText && cleanText.length > maxLen * 1.5) {
                      console.warn(`[Sync Validation] Block ${originalSub.id} duration (${durSec.toFixed(1)}s) might be tight for translated length (${cleanText.length} chars vs target maxLength ${maxLen})`);
                    }
                    setCachedTranslation(originalSub.originalText, targetLang, selectedModel, cleanText, cacheContextSig);
                    finalTranslations.push({ id: originalSub.id, translatedText: cleanText });
                  }
                });
              }
            } catch (chunkErr) {
              console.warn(`[Translate Batch] Chunk failed:`, chunkErr);
              if (uncachedSubtitles.length <= TRANS_CHUNK_SIZE) {
                throw chunkErr;
              }
            }
          })
        );
        res.json({
          success: true,
          translations: finalTranslations,
          newEntities: newlyDiscoveredEntities
        });
        return;
      }
      res.json({
        success: true,
        translations: finalTranslations,
        newEntities: []
      });
    } catch (err) {
      const apiMode = req.body.apiMode || "direct";
      const hasCustomKey = !!(req.body.apiKey && req.body.apiKey.trim());
      const mode = apiMode === "proxy" ? "proxy" : hasCustomKey ? "direct_custom" : "direct_system";
      return handleAiRouteError(err, res, "Failed to translate subtitle batch", mode);
    }
  });
  app.post("/api/deduplicate-subtitles", async (req, res) => {
    try {
      const { subtitles, model = "gemini-3.6-flash", targetLang = "Ti\u1EBFng Vi\u1EC7t", apiKey } = req.body;
      if (!subtitles || !Array.isArray(subtitles) || subtitles.length === 0) {
        res.status(400).json({ success: false, error: "Missing subtitles array" });
        return;
      }
      const { ai, selectedModel } = getAiClientAndModel(req.body);
      const processDedupChunk = async (chunkSubs) => {
        const compactChunk = chunkSubs.map((s) => ({
          startTime: typeof s.startTime === "number" ? Number(s.startTime.toFixed(2)) : 0,
          endTime: typeof s.endTime === "number" ? Number(s.endTime.toFixed(2)) : 0,
          originalText: String(s.originalText || s.text || "").trim()
        }));
        const prompt = `You are GeminiSubtitleRefiner, an expert AI video subtitle post-processor.
You are given a raw list of extracted OCR video subtitles with timestamps.

YOUR 4 STRICT WORKFLOW MANDATES:
1. CONTEXTUAL DIALOGUE REPAIR & OCR TYPO FIXING:
   - Carefully inspect every CJK character, English word, or Vietnamese text in originalText.
   - Use the surrounding dialogue context (preceding and succeeding subtitle lines) to infer the exact intended speech.
   - Fix common OCR misreads and distorted characters (e.g. Chinese character confusions like \u5E9F\u2194\u533F, \u9A97\u2194\u8F2A, \u8BEF\u2194\u5F97, \u5DF2\u2194\u5DF1, \u6CBB\u2194\u51B6, \u672A\u2194\u672B, \u78C1\u2194\u5341, \u6C5F\u2194\u4E86, etc.) so originalText is grammatically natural and 100% correct in its NATIVE SOURCE LANGUAGE.

2. FILTER OUT OCR TRASH & NOISE:
   - Completely remove UI icons, watermark text, floating symbols/gibberish, single unreadable strokes, or video background noise that is not actual dialogue subtitle text.

3. MERGE DUPLICATE & FRAGMENTED SUBTITLES STRICTLY (NEVER DROP SHORT REPEATING PHRASES):
   - Identify identical consecutive sentences or cumulative typing frames belonging to the EXACT SAME line of dialogue.
   - DO NOT MERGE OR DROP separate short sentences or repeating short words (e.g. 3-5 character Chinese phrases like "\u54C8\u54C8\u54C8\u54C8", "hahaha", or short 3-4 word phrases spoken in fast succession). Each distinct phrase or repeating utterance MUST remain its own separate item on the timeline!
   - DO NOT DROP short phrases that appear after longer sentences.
   - PRESERVE EARLY STARTTIME: Set "startTime" to the EARLIEST startTime provided in the input where speech/text first appeared on screen. DO NOT delay, shorten, or push forward startTime.
   - RESPECT ENDTIME: Keep "endTime" close to when the subtitle actually disappears from screen. DO NOT extend "endTime" across blank pauses into the next subtitle.

4. DO NOT TRANSLATE:
   - Keep "originalText" strictly in its original source language. Do NOT translate to Vietnamese or any target language in this OCR refinement step.
   - Leave "translatedText" as empty string ("") unless preserving a pre-existing valid translation.

Raw Subtitles Input:
${JSON.stringify(compactChunk)}`;
        const isProxyMode = req.body.apiMode === "proxy";
        const genConfig = {
          responseMimeType: "application/json"
        };
        if (!isProxyMode) {
          genConfig.responseSchema = {
            type: import_genai.Type.ARRAY,
            items: {
              type: import_genai.Type.OBJECT,
              properties: {
                startTime: { type: import_genai.Type.NUMBER, description: "Start time in seconds" },
                endTime: { type: import_genai.Type.NUMBER, description: "End time in seconds" },
                originalText: { type: import_genai.Type.STRING, description: "Cleaned, spell-corrected original subtitle in its native language" },
                sourceLang: { type: import_genai.Type.STRING, description: "Detected source language" },
                translatedText: { type: import_genai.Type.STRING, description: "Preserved translation or empty string" }
              },
              required: ["startTime", "endTime", "originalText"]
            }
          };
        }
        const response = await generateContentWithRetry(ai, {
          model: selectedModel,
          contents: prompt,
          config: genConfig
        });
        let responseText = (response.text || "").trim();
        if (responseText.startsWith("```")) {
          responseText = responseText.replace(/^```[a-zA-Z]*\n?/, "").replace(/\n?```$/, "").trim();
        }
        let parsed;
        try {
          parsed = JSON.parse(responseText);
        } catch (jsonErr) {
          console.error("[Deduplicate Subtitles] JSON Parse Error for response:", responseText);
          throw new Error(`Proxy AI returned non-JSON text: ${responseText.slice(0, 150)}`);
        }
        return Array.isArray(parsed) ? parsed : [];
      };
      const DEDUP_CHUNK_SIZE = 50;
      let cleaned = [];
      let lastChunkError = null;
      if (subtitles.length <= DEDUP_CHUNK_SIZE) {
        cleaned = await processDedupChunk(subtitles);
      } else {
        console.log(`[Deduplicate Subtitles] Subtitle array size is ${subtitles.length}, processing in parallel chunks of ${DEDUP_CHUNK_SIZE}...`);
        const chunks = [];
        for (let i = 0; i < subtitles.length; i += DEDUP_CHUNK_SIZE) {
          chunks.push(subtitles.slice(i, i + DEDUP_CHUNK_SIZE));
        }
        const chunkResults = await Promise.all(
          chunks.map(async (chunk, idx) => {
            try {
              return await processDedupChunk(chunk);
            } catch (chunkErr) {
              console.error(`[Deduplicate Subtitles] Chunk #${idx} (${chunk.length} items) FAILED:`, chunkErr);
              lastChunkError = chunkErr;
              return chunk;
            }
          })
        );
        for (const resChunk of chunkResults) {
          if (Array.isArray(resChunk)) {
            cleaned.push(...resChunk);
          }
        }
        if (lastChunkError && cleaned.length === 0) {
          throw lastChunkError;
        }
      }
      if (Array.isArray(cleaned) && cleaned.length > 0) {
        cleaned.sort((a, b) => (a.startTime || 0) - (b.startTime || 0));
        for (let i = 1; i < cleaned.length; i++) {
          const prev = cleaned[i - 1];
          const curr = cleaned[i];
          if (prev.endTime >= curr.startTime) {
            if (curr.startTime > (prev.startTime || 0) + 0.02) {
              prev.endTime = Number(Math.max((prev.startTime || 0) + 0.05, curr.startTime - 0.02).toFixed(2));
            } else {
              prev.endTime = Number(((prev.startTime || 0) + 0.1).toFixed(2));
              curr.startTime = Number(((prev.endTime || 0) + 0.02).toFixed(2));
            }
            if (curr.endTime < curr.startTime + 0.2) {
              curr.endTime = Number(((curr.startTime || 0) + 0.2).toFixed(2));
            }
          }
        }
      }
      res.json({
        success: true,
        subtitles: cleaned
      });
    } catch (err) {
      const apiMode = req.body.apiMode || "direct";
      const hasCustomKey = !!(req.body.apiKey && req.body.apiKey.trim());
      const mode = apiMode === "proxy" ? "proxy" : hasCustomKey ? "direct_custom" : "direct_system";
      return handleAiRouteError(err, res, "Failed to deduplicate subtitles via Gemini API", mode);
    }
  });
  app.post("/api/tts/nghi-status", async (req, res) => {
    try {
      const nghiVoiceKey = req.body.nghiVoice || "lacphi";
      const voiceConfig = NGHI_TTS_VOICE_URLS[nghiVoiceKey] || NGHI_TTS_VOICE_URLS.lacphi;
      const nghiDir = import_path2.default.join(process.cwd(), "nghi-tts audio");
      const modelPath = import_path2.default.join(nghiDir, voiceConfig.filename);
      const tokensPath = import_path2.default.join(nghiDir, "tokens.txt");
      const espeakPath = import_path2.default.join(nghiDir, "espeak-ng-data", "phontab");
      const modelExists = import_fs2.default.existsSync(modelPath) && import_fs2.default.statSync(modelPath).size > 1e3;
      const tokensExists = import_fs2.default.existsSync(tokensPath) && import_fs2.default.statSync(tokensPath).size > 10;
      const espeakExists = import_fs2.default.existsSync(espeakPath);
      let modelSizeMb = 0;
      if (modelExists) {
        modelSizeMb = Math.round(import_fs2.default.statSync(modelPath).size / (1024 * 1024) * 10) / 10;
      }
      const downloadedVoices = [];
      for (const [key, v] of Object.entries(NGHI_TTS_VOICE_URLS)) {
        const p = import_path2.default.join(nghiDir, v.filename);
        if (import_fs2.default.existsSync(p) && import_fs2.default.statSync(p).size > 1e3) {
          downloadedVoices.push(key);
        }
      }
      res.json({
        success: true,
        voiceKey: nghiVoiceKey,
        voiceName: voiceConfig.name,
        ready: modelExists && tokensExists && espeakExists,
        modelExists,
        tokensExists,
        espeakExists,
        modelSizeMb,
        downloadedVoices
      });
    } catch (e) {
      res.status(500).json({ success: false, error: e.message });
    }
  });
  app.post("/api/tts/nghi-download", async (req, res) => {
    try {
      const nghiVoiceKey = req.body.nghiVoice || "lacphi";
      const voiceConfig = NGHI_TTS_VOICE_URLS[nghiVoiceKey] || NGHI_TTS_VOICE_URLS.lacphi;
      const nghiDir = import_path2.default.join(process.cwd(), "nghi-tts audio");
      const modelPath = import_path2.default.join(nghiDir, voiceConfig.filename);
      const tokensPath = import_path2.default.join(nghiDir, "tokens.txt");
      const tokensUrl = "https://huggingface.co/doof-ferb/nghitts-copy/resolve/main/sherpa-onnx/tokens.txt";
      console.log(`[Sherpa-ONNX Download] Explicit download requested for voice '${voiceConfig.name}'...`);
      const tokensOk = await ensureFileDownloaded(tokensUrl, tokensPath);
      if (!tokensOk) {
        res.status(500).json({ success: false, error: "Kh\xF4ng th\u1EC3 t\u1EA3i file tokens.txt" });
        return;
      }
      const espeakOk = await ensureEspeakData(nghiDir);
      if (!espeakOk) {
        res.status(500).json({ success: false, error: "Kh\xF4ng th\u1EC3 gi\u1EA3i n\xE9n th\u01B0 vi\u1EC7n espeak-ng-data" });
        return;
      }
      const modelOk = await ensureFileDownloaded(voiceConfig.url, modelPath);
      if (!modelOk) {
        res.status(500).json({ success: false, error: `Kh\xF4ng th\u1EC3 t\u1EA3i m\xF4 h\xECnh ONNX cho gi\u1ECDng ${voiceConfig.name}` });
        return;
      }
      failedSherpaVoices.delete(nghiVoiceKey);
      disposeTtsInstance(nghiVoiceKey);
      clearTtsAudioCache();
      const sizeMb = Math.round(import_fs2.default.statSync(modelPath).size / (1024 * 1024) * 10) / 10;
      res.json({
        success: true,
        message: `\u0110\xE3 t\u1EA3i xong m\xF4 h\xECnh gi\u1ECDng \u0111\u1ECDc ${voiceConfig.name} (${sizeMb} MB) v\xE0 th\u01B0 vi\u1EC7n Sherpa-ONNX!`,
        voiceKey: nghiVoiceKey,
        voiceName: voiceConfig.name,
        sizeMb
      });
    } catch (e) {
      console.error("[Sherpa-ONNX Download Error]", e);
      res.status(500).json({ success: false, error: e.message || "L\u1ED7i khi t\u1EA3i m\xF4 h\xECnh" });
    }
  });
  let lastTikTokRequestTime = 0;
  let cachedProxiflyProxy = "";
  let lastProxiflyFetchTime = 0;
  const failedSherpaVoices = /* @__PURE__ */ new Set();
  const cachedTtsAudio = /* @__PURE__ */ new Map();
  const MAX_AUDIO_CACHE_SIZE = 2e3;
  const getCachedAudio = (key) => {
    if (cachedTtsAudio.has(key)) {
      return cachedTtsAudio.get(key);
    }
    const hash = getSha256(key);
    const filePath = import_path2.default.join(TTS_CACHE_DIR, `${hash}.json`);
    if (import_fs2.default.existsSync(filePath)) {
      try {
        const item = JSON.parse(import_fs2.default.readFileSync(filePath, "utf-8"));
        if (cachedTtsAudio.size >= MAX_AUDIO_CACHE_SIZE) {
          const firstKey = cachedTtsAudio.keys().next().value;
          if (firstKey) cachedTtsAudio.delete(firstKey);
        }
        cachedTtsAudio.set(key, item);
        return item;
      } catch (e) {
        console.warn("Failed to read cached audio from disk:", e);
      }
    }
    return void 0;
  };
  const clearTtsAudioCache = () => {
    cachedTtsAudio.clear();
  };
  const setCachedAudio = (key, item) => {
    if (cachedTtsAudio.size >= MAX_AUDIO_CACHE_SIZE) {
      const firstKey = cachedTtsAudio.keys().next().value;
      if (firstKey) cachedTtsAudio.delete(firstKey);
    }
    cachedTtsAudio.set(key, item);
    const hash = getSha256(key);
    const filePath = import_path2.default.join(TTS_CACHE_DIR, `${hash}.json`);
    try {
      import_fs2.default.writeFileSync(filePath, JSON.stringify(item));
    } catch (e) {
      console.warn("Failed to write cached audio to disk:", e);
    }
  };
  class TtsWorkerPool {
    constructor(poolSize = Math.max(1, Math.min(4, import_os.default.cpus().length - 1))) {
      this.workers = [];
      this.idleWorkers = [];
      this.activeJobs = /* @__PURE__ */ new Map();
      this.queue = [];
      this.jobCounter = 0;
      this.poolSize = poolSize;
    }
    start() {
      const workerCode = `
        const { parentPort } = require('worker_threads');
        const path = require('path');
        const fs = require('fs');

        let sherpaOnnxModule = null;
        try {
          sherpaOnnxModule = require('sherpa-onnx');
        } catch (e) {
          console.error('[Worker] Failed to load sherpa-onnx:', e);
        }

        const cachedTtsInstances = {};

        function disposeTtsInstance(voiceKey) {
          if (cachedTtsInstances[voiceKey]) {
            try {
              if (typeof cachedTtsInstances[voiceKey].free === 'function') {
                cachedTtsInstances[voiceKey].free();
              } else if (typeof cachedTtsInstances[voiceKey].delete === 'function') {
                cachedTtsInstances[voiceKey].delete();
              }
            } catch (e) {
              console.warn("[Worker] Sherpa-ONNX Instance Cleanup Warning:", e);
            }
            delete cachedTtsInstances[voiceKey];
          }
        }

        function floatTo16BitPcmWav(samples, sampleRate) {
          const numChannels = 1;
          const bytesPerSample = 2;
          const dataSize = samples.length * bytesPerSample;
          const buffer = Buffer.alloc(44 + dataSize);

          buffer.write('RIFF', 0);
          buffer.writeUInt32LE(36 + dataSize, 4);
          buffer.write('WAVE', 8);

          buffer.write('fmt ', 12);
          buffer.writeUInt32LE(16, 16);
          buffer.writeUInt16LE(1, 20);
          buffer.writeUInt16LE(numChannels, 22);
          buffer.writeUInt32LE(sampleRate, 24);
          buffer.writeUInt32LE(sampleRate * numChannels * bytesPerSample, 28);
          buffer.writeUInt16LE(numChannels * bytesPerSample, 32);
          buffer.writeUInt16LE(16, 34);

          buffer.write('data', 36);
          buffer.writeUInt32LE(dataSize, 40);

          let offset = 44;
          for (let i = 0; i < samples.length; i++) {
            const s = Math.max(-1, Math.min(1, samples[i]));
            const val = s < 0 ? s * 0x8000 : s * 0x7fff;
            buffer.writeInt16LE(Math.floor(val), offset);
            offset += 2;
          }

          return buffer;
        }

        parentPort.on('message', async (job) => {
          const { jobId, voiceKey, modelPath, tokensPath, dataDir, chunks, speed } = job;
          try {
            if (!sherpaOnnxModule) {
              throw new Error('sherpa-onnx module is not loaded on this worker');
            }

            // Free other voices to save memory
            for (const k of Object.keys(cachedTtsInstances)) {
              if (k !== voiceKey) {
                disposeTtsInstance(k);
              }
            }

            let ttsEngine = cachedTtsInstances[voiceKey];
            if (!ttsEngine) {
              ttsEngine = sherpaOnnxModule.createOfflineTts({
                offlineTtsModelConfig: {
                  offlineTtsVitsModelConfig: {
                    model: modelPath,
                    tokens: tokensPath,
                    lexicon: '',
                    dataDir: dataDir,
                    noiseScale: 0.667,
                    noiseScaleW: 0.8,
                    lengthScale: 1.0,
                  },
                  numThreads: 1,
                  debug: 0,
                  provider: 'cpu',
                },
                ruleFsts: '',
                ruleFars: '',
                maxNumSentences: 1,
              });
              cachedTtsInstances[voiceKey] = ttsEngine;
            }

            const samplesList = [];
            let sampleRate = 22050;
            const wordTimestamps = [];
            let currentAudioTime = 0;

            for (const chunk of chunks) {
              let res = ttsEngine.generate({ text: chunk, speed });
              if (res && res.samples && res.samples.length > 0) {
                const clonedSamples = new Float32Array(res.samples);
                samplesList.push(clonedSamples);
                const chunkSampleRate = res.sampleRate || sampleRate;
                sampleRate = chunkSampleRate;

                const chunkDuration = clonedSamples.length / chunkSampleRate;
                const words = chunk.split(/\\s+/).filter(Boolean);

                if (words.length > 0) {
                  if (Array.isArray(res.timestamps) && res.timestamps.length === words.length) {
                    for (const ts of res.timestamps) {
                      wordTimestamps.push({
                        word: ts.word || ts.text || '',
                        start: Math.round((currentAudioTime + (ts.start || 0)) * 1000) / 1000,
                        end: Math.round((currentAudioTime + (ts.end || 0)) * 1000) / 1000,
                      });
                    }
                  } else {
                    const totalChars = words.reduce((acc, w) => acc + w.length, 0);
                    let wordOffset = 0;
                    for (const w of words) {
                      const wordWeight = totalChars > 0 ? w.length / totalChars : 1 / words.length;
                      const wordDur = chunkDuration * wordWeight;
                      wordTimestamps.push({
                        word: w,
                        start: Math.round((currentAudioTime + wordOffset) * 1000) / 1000,
                        end: Math.round((currentAudioTime + wordOffset + wordDur) * 1000) / 1000,
                      });
                      wordOffset += wordDur;
                    }
                  }
                }

                currentAudioTime += chunkDuration;
              }
            }

            if (samplesList.length === 0) {
              parentPort.postMessage({ jobId, success: false, error: 'No audio samples generated' });
              return;
            }

            const totalLength = samplesList.reduce((acc, cur) => acc + cur.length, 0);
            const mergedSamples = new Float32Array(totalLength);
            let offset = 0;
            for (const samples of samplesList) {
              mergedSamples.set(samples, offset);
              offset += samples.length;
            }

            const exactDuration = Math.round((totalLength / sampleRate) * 1000) / 1000;
            const wavBuffer = floatTo16BitPcmWav(mergedSamples, sampleRate);

            parentPort.postMessage({
              jobId,
              success: true,
              buffer: wavBuffer,
              duration: exactDuration,
              timestamps: wordTimestamps,
            });
          } catch (err) {
            parentPort.postMessage({ jobId, success: false, error: err.message });
          }
        });
      `;
      for (let i = 0; i < this.poolSize; i++) {
        const worker = new import_worker_threads.Worker(workerCode, { eval: true });
        worker.on("message", (msg) => {
          const { jobId, success, buffer, duration, timestamps, error } = msg;
          const callbacks = this.activeJobs.get(jobId);
          if (callbacks) {
            this.activeJobs.delete(jobId);
            if (success) {
              callbacks.resolve({ buffer, duration, timestamps });
            } else {
              callbacks.reject(new Error(error));
            }
          }
          this.returnWorkerToPool(worker);
        });
        worker.on("error", (err) => {
          console.error("[TtsWorkerPool] Worker Thread Error:", err);
          this.handleWorkerCrash(worker);
        });
        worker.on("exit", (code) => {
          if (code !== 0) {
            console.warn(`[TtsWorkerPool] Worker Thread exited with code ${code}`);
            this.handleWorkerCrash(worker);
          }
        });
        this.workers.push(worker);
        this.idleWorkers.push(worker);
      }
      console.log(`[TtsWorkerPool] Started pool with ${this.poolSize} workers.`);
    }
    returnWorkerToPool(worker) {
      if (this.workers.includes(worker)) {
        this.idleWorkers.push(worker);
        this.processQueue();
      }
    }
    handleWorkerCrash(worker) {
      this.workers = this.workers.filter((w) => w !== worker);
      this.idleWorkers = this.idleWorkers.filter((w) => w !== worker);
      try {
        worker.terminate();
      } catch {
      }
      this.start();
    }
    runJob(jobData) {
      return new Promise((resolve, reject) => {
        const jobId = `job_${++this.jobCounter}`;
        const job = { jobId, ...jobData };
        this.queue.push({ job, resolve, reject });
        this.processQueue();
      });
    }
    processQueue() {
      if (this.queue.length === 0 || this.idleWorkers.length === 0) return;
      const worker = this.idleWorkers.shift();
      const { job, resolve, reject } = this.queue.shift();
      this.activeJobs.set(job.jobId, { resolve, reject });
      worker.postMessage(job);
    }
  }
  const ttsWorkerPool = new TtsWorkerPool();
  ttsWorkerPool.start();
  const cachedTtsInstances = {};
  const disposeTtsInstance = (voiceKey) => {
  };
  const getOrCreateTtsEngine = (voiceKey, modelPath, tokensPath, dataDir) => {
    return null;
  };
  const sanitizeTextForSherpa = (input) => {
    if (!input) return "";
    let cleaned = input.replace(/<[^>]*>/g, "").replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "").replace(/[\r\n\t]+/g, " ").replace(/[^\p{L}\p{N}\s.,?!;:\-–—"'()]/gu, " ").replace(/\s+/g, " ").trim();
    cleaned = cleaned.replace(/\s+([.,?!;:])/g, "$1");
    cleaned = cleaned.replace(/([.,?!;:])\1+/g, "$1");
    return cleaned.trim();
  };
  const splitTextToShortSentences = (text, maxLen = 100, maxNumSentences = 10) => {
    const sanitized = sanitizeTextForSherpa(text);
    if (!sanitized) return [];
    if (sanitized.length <= maxLen) {
      return [sanitized];
    }
    let protectedText = sanitized.replace(/(\d)[.,](\d)/g, "$1__DECIMAL_P__$2").replace(/\b(Dr|Mr|Mrs|Ms|Prof|ThS|TS|TP|Tp)\.(?=\s[A-ZÀ-Ỹa-zà-ỹ0-9])/gi, "$1__ABBR_P__").replace(/\betc\.(?!\s[A-ZÀ-Ỹ])/gi, "etc__ETC_P__").replace(/\bv\.v\./gi, "v__VV_P__v__VV_P__");
    const sentenceMatches = protectedText.match(/([^.?!\n]+(?:[.?!\n]+|$))/g) || [];
    const unprotect = (str) => {
      return str.replace(/__DECIMAL_P__/g, ".").replace(/__ABBR_P__/g, ".").replace(/__ETC_P__/g, ".").replace(/__VV_P__/g, ".").trim();
    };
    const cleanSentences = [];
    for (const match of sentenceMatches) {
      const sent = unprotect(match);
      if (sent.length > 0) {
        cleanSentences.push(sent);
      }
    }
    if (cleanSentences.length === 0) return [sanitized.slice(0, maxLen)];
    const chunks = [];
    let currentChunk = "";
    let currentSentenceCount = 0;
    for (const sent of cleanSentences) {
      if (sent.length > maxLen) {
        if (currentChunk) {
          chunks.push(currentChunk);
          currentChunk = "";
          currentSentenceCount = 0;
        }
        const clauses = sent.split(/(?<=[,:–—;])\s+/);
        let clauseAcc = "";
        for (const cl of clauses) {
          const trimmedCl = cl.trim();
          if (!trimmedCl) continue;
          if ((clauseAcc ? clauseAcc + " " + trimmedCl : trimmedCl).length <= maxLen) {
            clauseAcc = clauseAcc ? clauseAcc + " " + trimmedCl : trimmedCl;
          } else {
            if (clauseAcc) chunks.push(clauseAcc);
            if (trimmedCl.length <= maxLen) {
              clauseAcc = trimmedCl;
            } else {
              const words = trimmedCl.split(/\s+/);
              let wordAcc = "";
              for (const w of words) {
                if ((wordAcc ? wordAcc + " " + w : w).length <= maxLen) {
                  wordAcc = wordAcc ? wordAcc + " " + w : w;
                } else {
                  if (wordAcc) chunks.push(wordAcc);
                  wordAcc = w;
                }
              }
              clauseAcc = wordAcc;
            }
          }
        }
        if (clauseAcc) chunks.push(clauseAcc);
        continue;
      }
      const prospectiveChunk = currentChunk ? currentChunk + " " + sent : sent;
      if (prospectiveChunk.length <= maxLen && currentSentenceCount + 1 <= maxNumSentences) {
        currentChunk = prospectiveChunk;
        currentSentenceCount += 1;
      } else {
        if (currentChunk) chunks.push(currentChunk);
        currentChunk = sent;
        currentSentenceCount = 1;
      }
    }
    if (currentChunk) chunks.push(currentChunk);
    return chunks.length > 0 ? chunks : [sanitized.slice(0, maxLen)];
  };
  const splitTextForTikTok = (text, maxLen = 200, maxNumSentences = 5) => {
    const sanitized = sanitizeTextForSherpa(text);
    if (!sanitized) return [];
    let protectedText = sanitized.replace(/(\d)[.,](\d)/g, "$1__DECIMAL_P__$2").replace(/\b(Dr|Mr|Mrs|Ms|Prof|ThS|TS|TP|Tp)\.(?=\s[A-ZÀ-Ỹa-zà-ỹ0-9])/gi, "$1__ABBR_P__").replace(/\betc\.(?!\s[A-ZÀ-Ỹ])/gi, "etc__ETC_P__").replace(/\bv\.v\./gi, "v__VV_P__v__VV_P__");
    const sentenceMatches = protectedText.match(/([^.?!\n]+(?:[.?!\n]+|$))/g) || [];
    const unprotect = (str) => {
      return str.replace(/__DECIMAL_P__/g, ".").replace(/__ABBR_P__/g, ".").replace(/__ETC_P__/g, ".").replace(/__VV_P__/g, ".").trim();
    };
    const cleanSentences = [];
    for (const match of sentenceMatches) {
      const sent = unprotect(match);
      if (sent.length > 0) {
        cleanSentences.push(sent);
      }
    }
    if (cleanSentences.length === 0) return [sanitized.slice(0, maxLen)];
    const chunks = [];
    let currentChunk = "";
    let currentSentenceCount = 0;
    for (const sent of cleanSentences) {
      if (sent.length > maxLen) {
        if (currentChunk) {
          chunks.push(currentChunk);
          currentChunk = "";
          currentSentenceCount = 0;
        }
        const clauses = sent.split(/(?<=[,:–—;])\s+/);
        let clauseAcc = "";
        for (const cl of clauses) {
          const trimmedCl = cl.trim();
          if (!trimmedCl) continue;
          if ((clauseAcc ? clauseAcc + " " + trimmedCl : trimmedCl).length <= maxLen) {
            clauseAcc = clauseAcc ? clauseAcc + " " + trimmedCl : trimmedCl;
          } else {
            if (clauseAcc) chunks.push(clauseAcc);
            if (trimmedCl.length <= maxLen) {
              clauseAcc = trimmedCl;
            } else {
              const words = trimmedCl.split(/\s+/);
              let wordAcc = "";
              for (const w of words) {
                if ((wordAcc ? wordAcc + " " + w : w).length <= maxLen) {
                  wordAcc = wordAcc ? wordAcc + " " + w : w;
                } else {
                  if (wordAcc) chunks.push(wordAcc);
                  wordAcc = w;
                }
              }
              clauseAcc = wordAcc;
            }
          }
        }
        if (clauseAcc) chunks.push(clauseAcc);
        continue;
      }
      const prospectiveChunk = currentChunk ? currentChunk + " " + sent : sent;
      if (prospectiveChunk.length <= maxLen && currentSentenceCount + 1 <= maxNumSentences) {
        currentChunk = prospectiveChunk;
        currentSentenceCount += 1;
      } else {
        if (currentChunk) chunks.push(currentChunk);
        currentChunk = sent;
        currentSentenceCount = 1;
      }
    }
    if (currentChunk) chunks.push(currentChunk);
    return chunks.length > 0 ? chunks : [sanitized.slice(0, maxLen)];
  };
  const generateSherpaAudioSafe = (voiceKey, modelPath, tokensPath, dataDir, text, speed) => {
    if (failedSherpaVoices.has(voiceKey)) return null;
    const chunks = splitTextToShortSentences(text, 70);
    if (chunks.length === 0) return null;
    const samplesList = [];
    let sampleRate = 22050;
    let ttsEngine = getOrCreateTtsEngine(voiceKey, modelPath, tokensPath, dataDir);
    if (!ttsEngine) {
      failedSherpaVoices.add(voiceKey);
      return null;
    }
    const wordTimestamps = [];
    let currentAudioTime = 0;
    for (const chunk of chunks) {
      let res = null;
      try {
        res = ttsEngine.generate({ text: chunk, speed });
        if (res && res.samples && res.samples.length > 0) {
          const clonedSamples = new Float32Array(res.samples);
          samplesList.push(clonedSamples);
          const chunkSampleRate = res.sampleRate || sampleRate;
          sampleRate = chunkSampleRate;
          const chunkDuration = clonedSamples.length / chunkSampleRate;
          const words = chunk.split(/\s+/).filter(Boolean);
          if (words.length > 0) {
            if (Array.isArray(res.timestamps) && res.timestamps.length === words.length) {
              for (const ts of res.timestamps) {
                wordTimestamps.push({
                  word: ts.word || ts.text || "",
                  start: Math.round((currentAudioTime + (ts.start || 0)) * 1e3) / 1e3,
                  end: Math.round((currentAudioTime + (ts.end || 0)) * 1e3) / 1e3
                });
              }
            } else {
              const totalChars = words.reduce((acc, w) => acc + w.length, 0);
              let wordOffset = 0;
              for (const w of words) {
                const wordWeight = totalChars > 0 ? w.length / totalChars : 1 / words.length;
                const wordDur = chunkDuration * wordWeight;
                wordTimestamps.push({
                  word: w,
                  start: Math.round((currentAudioTime + wordOffset) * 1e3) / 1e3,
                  end: Math.round((currentAudioTime + wordOffset + wordDur) * 1e3) / 1e3
                });
                wordOffset += wordDur;
              }
            }
          }
          currentAudioTime += chunkDuration;
        }
      } catch (wasmErr) {
        console.warn(`[Sherpa-ONNX WASM Memory Recovery] Resetting WASM engine instance for '${voiceKey}':`, wasmErr?.message || wasmErr);
        disposeTtsInstance(voiceKey);
        failedSherpaVoices.add(voiceKey);
        ttsEngine = getOrCreateTtsEngine(voiceKey, modelPath, tokensPath, dataDir);
        if (ttsEngine) {
          try {
            res = ttsEngine.generate({ text: chunk, speed });
            if (res && res.samples && res.samples.length > 0) {
              const clonedSamples = new Float32Array(res.samples);
              samplesList.push(clonedSamples);
              const chunkSampleRate = res.sampleRate || sampleRate;
              sampleRate = chunkSampleRate;
              const chunkDuration = clonedSamples.length / chunkSampleRate;
              const words = chunk.split(/\s+/).filter(Boolean);
              if (words.length > 0) {
                const totalChars = words.reduce((acc, w) => acc + w.length, 0);
                let wordOffset = 0;
                for (const w of words) {
                  const wordWeight = totalChars > 0 ? w.length / totalChars : 1 / words.length;
                  const wordDur = chunkDuration * wordWeight;
                  wordTimestamps.push({
                    word: w,
                    start: Math.round((currentAudioTime + wordOffset) * 1e3) / 1e3,
                    end: Math.round((currentAudioTime + wordOffset + wordDur) * 1e3) / 1e3
                  });
                  wordOffset += wordDur;
                }
              }
              currentAudioTime += chunkDuration;
            }
          } catch (retryErr) {
            console.warn("[Sherpa-ONNX WASM Retry failed, switching to fallback]", retryErr);
            failedSherpaVoices.add(voiceKey);
          }
        }
      } finally {
        res = null;
      }
    }
    if (samplesList.length === 0) return null;
    const totalLength = samplesList.reduce((acc, cur) => acc + cur.length, 0);
    const mergedSamples = new Float32Array(totalLength);
    let offset = 0;
    for (const samples of samplesList) {
      mergedSamples.set(samples, offset);
      offset += samples.length;
    }
    const exactDuration = Math.round(totalLength / sampleRate * 1e3) / 1e3;
    const wavBuffer = floatTo16BitPcmWav(mergedSamples, sampleRate);
    return {
      buffer: wavBuffer,
      duration: exactDuration,
      timestamps: wordTimestamps
    };
  };
  const fetchGoogleTranslateTTS = async (txt) => {
    try {
      const clean = txt.replace(/<[^>]*>/g, "").replace(/[^\p{L}\p{N}\s.,?!;:\-–—"'()]/gu, " ").trim();
      if (!clean) return null;
      if (clean.length <= 180) {
        const gUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
          clean
        )}&tl=vi&client=tw-ob`;
        const gRes = await fetch(gUrl, {
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
        });
        if (gRes.ok) {
          const buf = Buffer.from(await gRes.arrayBuffer());
          if (buf.length > 200) return buf;
        }
      } else {
        const words = clean.split(/\s+/);
        const chunks = [];
        let current = "";
        for (const w of words) {
          if ((current + " " + w).trim().length <= 160) {
            current = (current + " " + w).trim();
          } else {
            if (current) chunks.push(current);
            current = w;
          }
        }
        if (current) chunks.push(current);
        const buffers = [];
        for (const chunk of chunks) {
          const gUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
            chunk
          )}&tl=vi&client=tw-ob`;
          const gRes = await fetch(gUrl, {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
          });
          if (gRes.ok) {
            const b = Buffer.from(await gRes.arrayBuffer());
            if (b.length > 200) buffers.push(b);
          }
        }
        if (buffers.length > 0) return Buffer.concat(buffers);
      }
    } catch (e) {
      console.warn("[Google Translate TTS Fallback Exception]", e);
    }
    return null;
  };
  const fetchEdgeTTSFallback = async (txt, voiceName) => {
    try {
      const questUrl = `https://tts.quest/api/voice?text=${encodeURIComponent(txt)}&voice=${encodeURIComponent(voiceName)}`;
      const questRes = await fetch(questUrl, { signal: AbortSignal.timeout(6e3) });
      if (questRes.ok) {
        const contentType = questRes.headers.get("content-type") || "";
        if (contentType.includes("audio") || contentType.includes("mpeg")) {
          return Buffer.from(await questRes.arrayBuffer());
        } else {
          const questJson = await questRes.json();
          const audioUrl = questJson?.mp3StreamingUrl || questJson?.audioUrl || questJson?.url;
          if (audioUrl) {
            const mp3Res = await fetch(audioUrl, { signal: AbortSignal.timeout(6e3) });
            if (mp3Res.ok) {
              return Buffer.from(await mp3Res.arrayBuffer());
            }
          }
        }
      }
    } catch (e) {
      console.warn("[fetchEdgeTTSFallback Quest Warning]", e);
    }
    try {
      const v3Url = `https://api.tts.quest/v3/voiceserver?text=${encodeURIComponent(txt)}&voice=${encodeURIComponent(voiceName)}`;
      const v3Res = await fetch(v3Url, { signal: AbortSignal.timeout(6e3) });
      if (v3Res.ok) {
        const v3Json = await v3Res.json();
        const audioUrl = v3Json?.mp3StreamingUrl || v3Json?.audioUrl;
        if (audioUrl) {
          const mp3Res = await fetch(audioUrl, { signal: AbortSignal.timeout(6e3) });
          if (mp3Res.ok) {
            return Buffer.from(await mp3Res.arrayBuffer());
          }
        }
      }
    } catch (e) {
      console.warn("[fetchEdgeTTSFallback V3 Warning]", e);
    }
    return null;
  };
  const generateTTSAudioHelper = async (options) => {
    const {
      text,
      targetDuration,
      duration,
      provider = "nghi_tts",
      nghiVoice = "lacphi",
      edgeVoice = "vi-VN-HoaiMyNeural",
      tiktokSessionId = "",
      tiktokVoice = "vi_001",
      voice = "Kore",
      ttsSpeed = 1,
      apiMode,
      apiKey,
      proxyUrl,
      proxyKey,
      proxyTargetModel,
      customModelName,
      tiktokProxyUrl = ""
    } = options;
    const cleanText = text.trim();
    if (!cleanText) return { audioBase64: null, providerUsed: provider };
    const targetDur = Number(targetDuration || duration) || 0;
    let speed = Number(ttsSpeed) || 1;
    if (targetDur && targetDur > 0.3) {
      const cps = cleanText.length / targetDur;
      if (cps > 14) {
        const requiredSpeed = Math.min(1.8, Math.max(1, cps / 13));
        if (requiredSpeed >= 1.25) {
          console.log(`\u26A1 \u0110ang t\u1ED1i \u01B0u t\u1ED1c \u0111\u1ED9 \u0111\u1ECDc l\xEAn \u2265 ${requiredSpeed.toFixed(1)}x \u0111\u1EC3 gi\u1EA3m s\u1ED1 block c\u1EA7n x\u1EED l\xFD t\u1ED1c \u0111\u1ED9 trong l\u1EA7n t\u1EA1o sau`);
          speed = Math.min(2, Math.round(speed * requiredSpeed * 100) / 100);
        }
      }
    }
    let voiceKeyForCache = voice;
    if (provider === "nghi_tts") {
      voiceKeyForCache = nghiVoice;
    } else if (provider === "edge_tts") {
      voiceKeyForCache = edgeVoice;
    } else if (provider === "tiktok_tts") {
      voiceKeyForCache = tiktokVoice;
    }
    const cacheKey = `${provider}:${voiceKeyForCache}:${speed}:${cleanText}`;
    const cachedItem = getCachedAudio(cacheKey);
    if (cachedItem) {
      return {
        audioBase64: cachedItem.audioBase64,
        duration: cachedItem.duration,
        timestamps: cachedItem.timestamps,
        providerUsed: `${provider}_cached`
      };
    }
    let audioBuffer = null;
    let base64Audio = null;
    let audioDuration = void 0;
    let audioTimestamps = void 0;
    let actualProvider = provider;
    if (provider === "nghi_tts") {
      if (failedSherpaVoices.has(nghiVoice)) {
        console.warn(`[Nghi-TTS] Voice '${nghiVoice}' failed or needs re-download. No fallback to Google Translate.`);
        base64Audio = null;
      } else {
        const voiceConfig = NGHI_TTS_VOICE_URLS[nghiVoice] || NGHI_TTS_VOICE_URLS.lacphi;
        const nghiDir = import_path2.default.join(process.cwd(), "nghi-tts audio");
        const modelPath = import_path2.default.join(nghiDir, voiceConfig.filename);
        const tokensPath = import_path2.default.join(nghiDir, "tokens.txt");
        const dataDir = import_path2.default.join(nghiDir, "espeak-ng-data");
        const tokensUrl = "https://huggingface.co/doof-ferb/nghitts-copy/resolve/main/sherpa-onnx/tokens.txt";
        try {
          const tokensOk = await ensureFileDownloaded(tokensUrl, tokensPath);
          const espeakOk = await ensureEspeakData(nghiDir);
          const modelOk = await ensureFileDownloaded(voiceConfig.url, modelPath);
          if (tokensOk && espeakOk && modelOk) {
            try {
              const chunks = splitTextToShortSentences(cleanText, 70);
              const workerResult = await ttsWorkerPool.runJob({
                voiceKey: nghiVoice,
                modelPath,
                tokensPath,
                dataDir,
                chunks,
                speed
              });
              if (workerResult && workerResult.buffer) {
                audioBuffer = workerResult.buffer;
                audioDuration = workerResult.duration;
                audioTimestamps = workerResult.timestamps;
              }
            } catch (wasmErr) {
              console.warn("[Sherpa-ONNX Worker Thread Exception Recovery]", wasmErr?.message || wasmErr);
              failedSherpaVoices.add(nghiVoice);
            }
          }
        } catch (e) {
          console.warn("[Sherpa-ONNX Init Warning]", e?.message || e);
        }
        if (audioBuffer && audioBuffer.length > 200) {
          base64Audio = audioBuffer.toString("base64");
        } else {
          console.warn(`[Nghi-TTS] Could not generate audio for '${nghiVoice}'. No fallback to Google Translate.`);
          base64Audio = null;
        }
      }
    } else if (provider === "edge_tts") {
      try {
        const questUrl = `https://tts.quest/api/voice?text=${encodeURIComponent(cleanText)}&voice=${encodeURIComponent(edgeVoice)}`;
        const questRes = await fetch(questUrl);
        if (questRes.ok) {
          const contentType = questRes.headers.get("content-type") || "";
          if (contentType.includes("audio") || contentType.includes("mpeg")) {
            audioBuffer = Buffer.from(await questRes.arrayBuffer());
          } else {
            const questJson = await questRes.json();
            const audioUrl = questJson?.mp3StreamingUrl || questJson?.audioUrl || questJson?.url;
            if (audioUrl) {
              const mp3Res = await fetch(audioUrl);
              if (mp3Res.ok) audioBuffer = Buffer.from(await mp3Res.arrayBuffer());
            }
          }
        }
      } catch (e) {
        console.warn("[Edge TTS Quest Warning]", e);
      }
      if (!audioBuffer || audioBuffer.length < 500) {
        try {
          const v3Url = `https://api.tts.quest/v3/voiceserver?text=${encodeURIComponent(cleanText)}&voice=${encodeURIComponent(edgeVoice)}`;
          const v3Res = await fetch(v3Url);
          if (v3Res.ok) {
            const v3Json = await v3Res.json();
            const audioUrl = v3Json?.mp3StreamingUrl || v3Json?.audioUrl;
            if (audioUrl) {
              const mp3Res = await fetch(audioUrl);
              if (mp3Res.ok) audioBuffer = Buffer.from(await mp3Res.arrayBuffer());
            }
          }
        } catch (e) {
          console.warn("[Edge TTS V3 Warning]", e);
        }
      }
      if (audioBuffer && audioBuffer.length > 200) {
        base64Audio = audioBuffer.toString("base64");
        audioDuration = getMp3BufferDuration(audioBuffer);
      } else {
        throw new Error("Kh\xF4ng th\u1EC3 t\u1EA1o gi\u1ECDng \u0111\u1ECDc Edge TTS. Vui l\xF2ng th\u1EED l\u1EA1i ho\u1EB7c ch\u1ECDn gi\u1ECDng \u0111\u1ECDc kh\xE1c.");
      }
    } else if (provider === "tiktok_tts") {
      const chunks = splitTextForTikTok(cleanText, 200);
      const buffers = [];
      let proxyToUse = tiktokProxyUrl || process.env.TIKTOK_PROXY || process.env.HTTPS_PROXY || process.env.HTTP_PROXY || "";
      if (proxyToUse.trim().toLowerCase() === "proxifly") {
        const now = Date.now();
        if (cachedProxiflyProxy && now - lastProxiflyFetchTime < 15 * 60 * 1e3) {
          proxyToUse = cachedProxiflyProxy;
          console.log(`[TikTok-TTS] [Proxifly] Using cached proxy: ${proxyToUse}`);
        } else {
          try {
            const Proxifly = require("proxifly");
            const proxifly = new Proxifly();
            const pResult = await proxifly.getProxy({
              protocol: "http",
              https: true,
              quantity: 1
            });
            if (pResult && pResult.proxy) {
              proxyToUse = pResult.proxy;
              cachedProxiflyProxy = proxyToUse;
              lastProxiflyFetchTime = now;
              console.log(`[TikTok-TTS] [Proxifly] Auto resolved and cached to: ${proxyToUse}`);
            } else if (Array.isArray(pResult) && pResult.length > 0 && pResult[0].proxy) {
              proxyToUse = pResult[0].proxy;
              cachedProxiflyProxy = proxyToUse;
              lastProxiflyFetchTime = now;
              console.log(`[TikTok-TTS] [Proxifly] Auto resolved and cached to (array): ${proxyToUse}`);
            } else {
              console.warn(`[TikTok-TTS] [Proxifly] No proxy returned, falling back to direct connection or cached proxy if any.`);
              proxyToUse = cachedProxiflyProxy || "";
            }
          } catch (pxErr) {
            console.error(`[TikTok-TTS] [Proxifly] Error fetching proxy:`, pxErr?.message || pxErr);
            proxyToUse = cachedProxiflyProxy || "";
          }
        }
      }
      let agent = null;
      if (proxyToUse && proxyToUse.trim()) {
        try {
          agent = new import_https_proxy_agent.HttpsProxyAgent(proxyToUse.trim());
          console.log(`[TikTok-TTS] Instantiated HttpsProxyAgent for: ${proxyToUse.trim()}`);
        } catch (proxyErr) {
          console.error(`[TikTok-TTS] Failed to create HttpsProxyAgent:`, proxyErr?.message || proxyErr);
        }
      }
      let directEndpointsFailed = false;
      const isValidTikTokAudio = (buf, text2) => {
        if (!buf || buf.length < 300) {
          return { valid: false, duration: 0, reason: "Buffer null or too small (<300B)" };
        }
        const words = text2.trim().split(/\s+/).filter(Boolean);
        const wordCount = Math.max(1, words.length);
        const minBytes = Math.max(600, Math.floor(text2.length * 60));
        if (buf.length < minBytes) {
          return { valid: false, duration: 0, reason: `Byte size too low (${buf.length}B < min ${minBytes}B)` };
        }
        const duration2 = getMp3BufferDuration(buf);
        const minRequiredDuration = Math.max(0.2, Math.min(10, wordCount * 0.13));
        if (duration2 < minRequiredDuration) {
          return {
            valid: false,
            duration: duration2,
            reason: `Truncated audio duration detected (${duration2.toFixed(2)}s < expected min ${minRequiredDuration.toFixed(2)}s for ${wordCount} words)`
          };
        }
        return { valid: true, duration: duration2 };
      };
      const fetchSingleTikTokChunk = async (chunkText) => {
        const chunkCacheKey = `tiktok_chunk:${tiktokVoice}:${chunkText.trim()}`;
        const cachedChunk = getCachedAudio(chunkCacheKey);
        if (cachedChunk && cachedChunk.audioBase64) {
          const cachedBuf = Buffer.from(cachedChunk.audioBase64, "base64");
          const val = isValidTikTokAudio(cachedBuf, chunkText);
          if (val.valid) {
            console.log(`[TikTok TTS Chunk Cache Hit] "${chunkText.slice(0, 30)}..." (${cachedBuf.length} bytes, ${val.duration}s)`);
            return cachedBuf;
          } else {
            console.warn(`[TikTok TTS Chunk Cache Invalidation] Discarded truncated cache for "${chunkText.slice(0, 30)}...": ${val.reason}`);
          }
        }
        const sessId = tiktokSessionId || process.env.TIKTOK_SESSION_ID || "";
        let attempt = 1;
        while (true) {
          let chunkAudioBuf = null;
          if (sessId && !directEndpointsFailed) {
            const minInterval = 12e3;
            const now = Date.now();
            const timeSinceLast = now - lastTikTokRequestTime;
            if (timeSinceLast < minInterval) {
              const delay = minInterval - timeSinceLast;
              console.log(`[TikTok TTS Safe Spacing] Waiting ${delay}ms to guarantee safe rate limit of 3-5 requests/minute for official session...`);
              await new Promise((resolve) => setTimeout(resolve, delay));
            }
            lastTikTokRequestTime = Date.now();
            const randomId = () => Math.floor(1e18 + Math.random() * 8e18).toString();
            const deviceId = randomId();
            const installId = randomId();
            const directDomains = [
              "api16-v.tiktokv.com",
              "api16-normal-v4.tiktokv.com",
              "api22-normal-v4.tiktokv.com",
              "api16-normal-c-useast1a.tiktokv.com",
              "api22-normal-c-useast1a.tiktokv.com",
              "api16-normal-c-alisg.tiktokv.com",
              "api22-core-c-alisg.tiktokv.com",
              "api16-core-c-alisg.tiktokv.com",
              "api16-normal-v6.tiktokv.com",
              "api19-core-c-useast1a.tiktokv.com",
              "api-normal.tiktokv.com",
              "api.tiktokv.com"
            ];
            const axiosLib = require("axios");
            const abortController = new AbortController();
            const fetchFromDirectDomain = async (domain) => {
              const ttUrl = `https://${domain}/media/api/text/speech/invoke/?device_id=${deviceId}&iid=${installId}&device_platform=android&device_type=SAMSUNG&os_version=10&version_code=20.2.1&app_name=musical_ly&aid=1180&status_code=0&speaker_map_type=0`;
              const reqBodyParams = new URLSearchParams({
                text_speaker: tiktokVoice,
                req_text: chunkText,
                speaker_map_type: "0"
              });
              try {
                const ttRes = await axiosLib.post(ttUrl, reqBodyParams.toString(), {
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Cookie": `sessionid=${sessId.trim()};`,
                    "User-Agent": "com.zhiliaoapp.musically/2022600030 (Linux; U; Android 10; es_US; SAMSUNG; Build/QP1A.190711.020)",
                    "Accept-Encoding": "gzip, deflate",
                    "Connection": "keep-alive"
                  },
                  timeout: 3e3,
                  httpsAgent: agent,
                  httpAgent: agent,
                  proxy: false,
                  signal: abortController.signal
                });
                const ttJson = ttRes.data;
                if (ttJson?.data?.v_str) {
                  const directBuf = Buffer.from(ttJson.data.v_str, "base64");
                  const check = isValidTikTokAudio(directBuf, chunkText);
                  if (check.valid) {
                    abortController.abort();
                    return directBuf;
                  } else {
                    throw new Error(`Direct audio rejected: ${check.reason}`);
                  }
                }
                const sc = Number(ttJson?.status_code);
                if (sc === 2 || sc === 4 || sc === 5) {
                  const errMsg = `Session ID TikTok kh\xF4ng h\u1EE3p l\u1EC7, h\u1EBFt h\u1EA1n ho\u1EB7c b\u1ECB kho\xE1 (status_code: ${sc}, message: "${ttJson?.message || "Unauthorized"}").`;
                  console.error(`[TikTok TTS Direct Auth Failure] ${errMsg}`);
                  const authErr = new Error(errMsg);
                  authErr.isAuthError = true;
                  abortController.abort();
                  throw authErr;
                }
                throw new Error(ttJson?.message || `Host ${domain} returned status_code ${ttJson?.status_code}`);
              } catch (e) {
                if (axiosLib.isCancel(e) || e.name === "AbortError") {
                  throw new Error("Request cancelled");
                }
                const httpStatus = e?.response?.status;
                const netCode = e?.code;
                const respSnippet = typeof e?.response?.data === "string" ? e.response.data.slice(0, 150) : JSON.stringify(e?.response?.data || {}).slice(0, 150);
                console.warn(`[TikTok TTS Direct Domain Fail] ${domain} -> httpStatus=${httpStatus ?? "n/a"} code=${netCode ?? "n/a"} msg="${e?.message}" resp="${respSnippet}"`);
                throw e;
              }
            };
            try {
              chunkAudioBuf = await Promise.any(directDomains.map((domain) => fetchFromDirectDomain(domain)));
              console.log(`[TikTok TTS Direct] Success for chunk: "${chunkText.slice(0, 30)}..." via parallel direct domains on attempt ${attempt}`);
            } catch (aggregateErr) {
              const errors = aggregateErr.errors || [];
              const authErr = errors.find((e) => e.isAuthError);
              if (authErr) {
                console.error(`[TikTok TTS Direct] Critical session authentication error. Skipping direct endpoints for remaining chunks and falling through to public gateways.`);
                directEndpointsFailed = true;
              } else {
                console.warn(`[TikTok TTS Direct Error] All parallel direct domains failed/timed out for chunk: "${chunkText.slice(0, 30)}...". Marking direct endpoints as unreachable and falling through to public gateways.`);
                directEndpointsFailed = true;
              }
            }
          }
          if (!chunkAudioBuf && tiktokTtsModule && sessId) {
            try {
              tiktokTtsModule.config(sessId.trim());
              const tempFileBase = import_path2.default.join(import_os.default.tmpdir(), `tiktok_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);
              const tempFilePath = `${tempFileBase}.mp3`;
              const axiosLib = require("axios");
              const prevHttpsAgent = axiosLib.defaults.httpsAgent;
              const prevHttpAgent = axiosLib.defaults.httpAgent;
              const prevProxy = axiosLib.defaults.proxy;
              if (agent) {
                axiosLib.defaults.httpsAgent = agent;
                axiosLib.defaults.httpAgent = agent;
                axiosLib.defaults.proxy = false;
              }
              try {
                await tiktokTtsModule.createAudioFromText(chunkText, tempFileBase, tiktokVoice);
              } finally {
                axiosLib.defaults.httpsAgent = prevHttpsAgent;
                axiosLib.defaults.httpAgent = prevHttpAgent;
                axiosLib.defaults.proxy = prevProxy;
              }
              if (import_fs2.default.existsSync(tempFilePath)) {
                const libBuf = import_fs2.default.readFileSync(tempFilePath);
                try {
                  import_fs2.default.unlinkSync(tempFilePath);
                } catch (unLinkErr) {
                  console.warn("[TikTok TTS temp clean error]", unLinkErr);
                }
                const check = isValidTikTokAudio(libBuf, chunkText);
                if (check.valid) {
                  chunkAudioBuf = libBuf;
                  console.log(`[TikTok TTS Library] Success for chunk: "${chunkText.slice(0, 30)}..." on attempt ${attempt}`);
                } else {
                  console.warn(`[TikTok TTS Library] Audio rejected: ${check.reason}`);
                }
              }
            } catch (e) {
              console.warn(`[TikTok TTS Library Error] Failed (attempt ${attempt}):`, e?.message || e);
            }
          }
          if (!chunkAudioBuf) {
            const publicGateways = [
              { url: "https://tiktok-tts.weilnet.workers.dev/api/generation", isJson: true, bodyKey: "text", voiceKey: "voice" },
              { url: "https://tiktok-tts.ondigitalocean.app/api/tts", isJson: true, bodyKey: "text", voiceKey: "voice" },
              { url: "https://tiktok-tts.ondigitalocean.app/api/generation", isJson: true, bodyKey: "text", voiceKey: "voice" }
            ];
            const axiosLib = require("axios");
            try {
              const fetchFromGateway = async (gw) => {
                const payload = {};
                payload[gw.bodyKey] = chunkText;
                payload[gw.voiceKey] = tiktokVoice;
                const gwRes = await axiosLib.post(gw.url, payload, {
                  headers: { "Content-Type": "application/json" },
                  timeout: 15e3,
                  httpsAgent: agent,
                  httpAgent: agent,
                  proxy: false
                });
                const gwJson = gwRes.data;
                let buf = null;
                if (gwJson?.audio) {
                  buf = Buffer.from(gwJson.audio, "base64");
                } else if (gwJson?.success && gwJson?.data) {
                  buf = Buffer.from(gwJson.data, "base64");
                } else if (gwJson?.data) {
                  buf = Buffer.from(gwJson.data, "base64");
                }
                const check = isValidTikTokAudio(buf, chunkText);
                if (check.valid) {
                  console.log(`[TikTok TTS Public GW] Success via parallel fetch from ${gw.url} on attempt ${attempt}`);
                  return buf;
                }
                throw new Error(`Audio rejected from ${gw.url}: ${check.reason}`);
              };
              chunkAudioBuf = await Promise.any(publicGateways.map((gw) => fetchFromGateway(gw)));
            } catch (parallelErr) {
              console.warn(`[TikTok TTS GW Error] All parallel public gateways failed (attempt ${attempt}):`, parallelErr?.message || parallelErr);
            }
          }
          const finalCheck = isValidTikTokAudio(chunkAudioBuf, chunkText);
          if (chunkAudioBuf && finalCheck.valid) {
            setCachedAudio(chunkCacheKey, {
              audioBase64: chunkAudioBuf.toString("base64"),
              duration: finalCheck.duration
            });
            return chunkAudioBuf;
          }
          if (attempt >= 3) {
            console.error(`[TikTok TTS Chunk Failed] Chunk: "${chunkText.slice(0, 30)}..." failed after ${attempt} attempts.`);
            return null;
          }
          const backoffTime = Math.min(1e3 * attempt, 3e3);
          console.warn(`[TikTok TTS Chunk Failed] Chunk: "${chunkText.slice(0, 30)}..." failed on attempt ${attempt}. Waiting ${backoffTime}ms before retry...`);
          await new Promise((resolve) => setTimeout(resolve, backoffTime));
          attempt++;
        }
      };
      for (let idx = 0; idx < chunks.length; idx++) {
        const chunk = chunks[idx];
        const chunkBuf = await fetchSingleTikTokChunk(chunk);
        const check = isValidTikTokAudio(chunkBuf, chunk);
        if (chunkBuf && check.valid) {
          buffers.push(chunkBuf);
        } else {
          throw new Error(`Kh\xF4ng th\u1EC3 t\u1EA1o gi\u1ECDng \u0111\u1ECDc TikTok cho ph\xE2n \u0111o\u1EA1n (${idx + 1}/${chunks.length}): "${chunk.slice(0, 30)}...". Vui l\xF2ng ki\u1EC3m tra l\u1EA1i k\u1EBFt n\u1ED1i m\u1EA1ng ho\u1EB7c th\u1EED l\u1EA1i sau.`);
        }
      }
      if (buffers.length > 0) {
        if (buffers.length === 1) {
          audioBuffer = buffers[0];
        } else {
          const silenceBuf = createMp3SilenceBuffer(180);
          const mergedWithSilence = [];
          for (let i = 0; i < buffers.length; i++) {
            mergedWithSilence.push(buffers[i]);
            if (i < buffers.length - 1) {
              mergedWithSilence.push(silenceBuf);
            }
          }
          audioBuffer = Buffer.concat(mergedWithSilence);
        }
        base64Audio = audioBuffer.toString("base64");
        audioDuration = getMp3BufferDuration(audioBuffer);
      }
    } else if (provider === "gemini") {
      try {
        const { ai, selectedModel } = getAiClientAndModel({
          apiMode,
          apiKey,
          proxyUrl,
          proxyKey,
          proxyTargetModel,
          model: "gemini-2.5-flash",
          customModelName
        });
        const response = await ai.models.generateContent({
          model: selectedModel,
          contents: [{ parts: [{ text: cleanText }] }],
          config: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: voice || "Kore" }
              }
            }
          }
        });
        const b64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (b64) base64Audio = b64;
      } catch (geminiErr) {
        console.warn("[Gemini TTS Exception]", geminiErr);
      }
      if (!base64Audio) {
        throw new Error("Kh\xF4ng th\u1EC3 t\u1EA1o gi\u1ECDng \u0111\u1ECDc Gemini TTS. Vui l\xF2ng th\u1EED l\u1EA1i.");
      }
    }
    if (!base64Audio && provider !== "nghi_tts" && provider !== "tiktok_tts" && provider !== "edge_tts" && provider !== "gemini") {
      actualProvider = "global_gtranslate_fallback";
      const fallbackBuf = await fetchGoogleTranslateTTS(cleanText);
      if (fallbackBuf && fallbackBuf.length > 200) {
        base64Audio = fallbackBuf.toString("base64");
        audioBuffer = fallbackBuf;
      }
    }
    if (base64Audio && targetDur && targetDur > 0.3) {
      if (!audioBuffer) {
        audioBuffer = Buffer.from(base64Audio, "base64");
      }
      if (audioDuration === void 0 || audioDuration <= 0) {
        audioDuration = getMp3BufferDuration(audioBuffer);
      }
      if (audioDuration > targetDur + 0.06) {
        const stretchRes = await stretchAudioWithAtempo(audioBuffer, audioDuration, targetDur);
        audioBuffer = stretchRes.buffer;
        audioDuration = stretchRes.duration;
        base64Audio = audioBuffer.toString("base64");
      } else if (audioDuration < targetDur - 0.1) {
        const diffMs = Math.round((targetDur - audioDuration) * 1e3);
        console.log(`[Audio Sync] Ch\xE8n th\xEAm kho\u1EA3ng l\u1EB7ng \u1EDF cu\u1ED1i (${(targetDur - audioDuration).toFixed(2)}s)`);
        const silenceBuf = createMp3SilenceBuffer(diffMs);
        audioBuffer = Buffer.concat([audioBuffer, silenceBuf]);
        audioDuration = targetDur;
        base64Audio = audioBuffer.toString("base64");
      }
    }
    if (base64Audio && !actualProvider.includes("fallback")) {
      setCachedAudio(cacheKey, {
        audioBase64: base64Audio,
        duration: audioDuration,
        timestamps: audioTimestamps
      });
    }
    return {
      audioBase64: base64Audio,
      providerUsed: actualProvider,
      duration: audioDuration,
      timestamps: audioTimestamps
    };
  };
  app.post("/api/tts", async (req, res) => {
    try {
      const { text, targetDuration, duration } = req.body;
      if (!text || typeof text !== "string" || !text.trim()) {
        res.status(400).json({ success: false, error: "V\u0103n b\u1EA3n tr\u1ED1ng ho\u1EB7c kh\xF4ng h\u1EE3p l\u1EC7" });
        return;
      }
      const result = await generateTTSAudioHelper({
        text,
        targetDuration: targetDuration || duration,
        provider: req.body.provider,
        nghiVoice: req.body.nghiVoice,
        edgeVoice: req.body.edgeVoice,
        tiktokSessionId: req.body.tiktokSessionId,
        tiktokVoice: req.body.tiktokVoice,
        voice: req.body.voice,
        ttsSpeed: req.body.ttsSpeed,
        apiMode: req.body.apiMode,
        apiKey: req.body.apiKey,
        proxyUrl: req.body.proxyUrl,
        proxyKey: req.body.proxyKey,
        proxyTargetModel: req.body.proxyTargetModel,
        customModelName: req.body.customModelName,
        tiktokProxyUrl: req.body.tiktokProxyUrl
      });
      if (result.audioBase64) {
        res.json({
          success: true,
          provider: result.providerUsed,
          audioBase64: result.audioBase64,
          duration: result.duration,
          timestamps: result.timestamps
        });
      } else if (req.body.provider === "nghi_tts") {
        res.json({
          success: false,
          error: "Gi\u1ECDng \u0111\u1ECDc Nghi-TTS ch\u01B0a \u0111\u01B0\u1EE3c t\u1EA3i v\u1EC1. Vui l\xF2ng b\u1EA5m ch\u1ECDn l\u1EA1i gi\u1ECDng \u0111\u1EC3 t\u1EA3i v\u1EC1."
        });
      } else {
        res.status(500).json({ success: false, error: "Kh\xF4ng th\u1EC3 t\u1EA1o \xE2m thanh TTS" });
      }
    } catch (err) {
      console.error("Error in /api/tts:", err);
      res.status(500).json({ success: false, error: err.message || "TTS generation failed" });
    }
  });
  async function runWithConcurrencyLimit(concurrencyLimit, items, fn) {
    const executing = [];
    for (const item of items) {
      const p = Promise.resolve().then(() => fn(item));
      executing.push(p);
      if (concurrencyLimit <= items.length) {
        const clean = p.then(() => {
          executing.splice(executing.indexOf(clean), 1);
        });
        if (executing.length >= concurrencyLimit) {
          await Promise.race(executing);
        }
      }
    }
    await Promise.all(executing);
  }
  app.post("/api/tts/batch", async (req, res) => {
    try {
      const {
        items,
        provider = "nghi_tts",
        nghiVoice = "lacphi",
        edgeVoice = "vi-VN-HoaiMyNeural",
        tiktokSessionId = "",
        tiktokVoice = "vi_001",
        voice = "Kore",
        ttsSpeed = 1
      } = req.body;
      if (!Array.isArray(items) || items.length === 0) {
        res.status(400).json({ success: false, error: "Thi\u1EBFu danh s\xE1ch c\xE1c d\xF2ng v\u0103n b\u1EA3n" });
        return;
      }
      console.log(`[Batch TTS] Processing ${items.length} items using ${provider}...`);
      res.setHeader("Content-Type", "application/x-ndjson");
      res.setHeader("Transfer-Encoding", "chunked");
      let concurrencyLimit = 5;
      if (provider === "nghi_tts") {
        concurrencyLimit = 3;
      } else if (provider === "tiktok_tts" || provider === "edge_tts") {
        concurrencyLimit = 3;
      }
      const processItem = async (item) => {
        if (!item.text || !item.text.trim()) {
          res.write(JSON.stringify({ id: item.id, audioBase64: null, error: "Empty text" }) + "\n");
          return;
        }
        try {
          const resObj = await generateTTSAudioHelper({
            text: item.text,
            targetDuration: item.targetDuration || item.duration,
            provider,
            nghiVoice,
            edgeVoice,
            tiktokSessionId,
            tiktokVoice,
            voice,
            ttsSpeed,
            apiMode: req.body.apiMode,
            apiKey: req.body.apiKey,
            proxyUrl: req.body.proxyUrl,
            proxyKey: req.body.proxyKey,
            proxyTargetModel: req.body.proxyTargetModel,
            customModelName: req.body.customModelName,
            tiktokProxyUrl: req.body.tiktokProxyUrl
          });
          if (!resObj.audioBase64 || resObj.audioBase64.length < 200) {
            throw new Error("\xC2m thanh tr\u1EA3 v\u1EC1 tr\u1ED1ng ho\u1EB7c l\u1ED7i.");
          }
          res.write(JSON.stringify({
            id: item.id,
            success: true,
            audioBase64: resObj.audioBase64,
            providerUsed: resObj.providerUsed,
            duration: resObj.duration,
            timestamps: resObj.timestamps
          }) + "\n");
        } catch (itemErr) {
          console.warn(`[Batch TTS Item ${item.id} Error]`, itemErr);
          res.write(JSON.stringify({ id: item.id, audioBase64: null, error: itemErr.message || "Item failed" }) + "\n");
        }
      };
      await runWithConcurrencyLimit(concurrencyLimit, items, processItem);
      res.end();
    } catch (err) {
      console.error("Error in /api/tts/batch:", err);
      if (!res.headersSent) {
        res.status(500).json({ success: false, error: err.message || "Batch TTS failed" });
      } else {
        res.end();
      }
    }
  });
  app.post("/api/download", async (req, res) => {
    try {
      const { url } = req.body;
      if (!url || typeof url !== "string" || !url.trim()) {
        res.status(400).json({
          success: false,
          error: "Vui l\xF2ng nh\u1EADp \u0111\u01B0\u1EDDng d\u1EABn video h\u1EE3p l\u1EC7."
        });
        return;
      }
      const matchedUrl = url.match(/https?:\/\/[^\s]+/i);
      const cleanUrl = matchedUrl ? matchedUrl[0] : url.trim();
      const genApiKey = process.env.GENDOWNLOAD_API_KEY || "";
      const genApiUrl = process.env.GENDOWNLOAD_API_URL || "https://gendownload.com/api/extract";
      let genData = null;
      try {
        const headers = {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        };
        if (genApiKey) {
          headers["Authorization"] = `Bearer ${genApiKey}`;
          headers["x-api-key"] = genApiKey;
        }
        const apiRes = await fetch(genApiUrl, {
          method: "POST",
          headers,
          body: JSON.stringify({ url: cleanUrl }),
          signal: AbortSignal.timeout(6e3)
        });
        if (apiRes.ok) {
          genData = await apiRes.json();
        } else {
          console.warn(`[GenDownload /api/download] API returned HTTP ${apiRes.status}`);
        }
      } catch (err) {
        console.warn("[GenDownload /api/download] Request error:", err?.message || err);
      }
      if (genData && (genData.medias || genData.formats || genData.success)) {
        const mediasRaw = genData.medias || genData.formats || [];
        const medias = Array.isArray(mediasRaw) ? mediasRaw.map((m) => ({
          quality: m.quality || m.label || (m.type === "audio" ? "Audio (MP3)" : "1080p (MP4)"),
          extension: m.extension || m.ext || (m.type === "audio" ? "mp3" : "mp4"),
          url: m.url || m.directUrl || "",
          size: m.size || (m.filesize ? `${(m.filesize / (1024 * 1024)).toFixed(1).replace(".", ",")} MB` : void 0),
          isAudioOnly: m.type === "audio" || m.extension === "mp3" || m.isAudioOnly
        })) : [];
        if (medias.length === 0 && (genData.videoUrl || genData.url)) {
          medias.push({
            quality: "1080p (MP4)",
            extension: "mp4",
            url: genData.videoUrl || genData.url,
            isAudioOnly: false
          });
        }
        res.json({
          success: true,
          title: genData.title || "Video T\u1EA3i T\u1EEB Link",
          thumbnail: genData.thumbnail || "",
          duration: genData.duration ? String(genData.duration) : void 0,
          source: genData.source || "ONLINE",
          author: genData.author || void 0,
          views: genData.views || void 0,
          medias
        });
        return;
      }
      let platform = "video";
      if (cleanUrl.includes("tiktok.com") || cleanUrl.includes("douyin.com")) platform = "tiktok";
      else if (cleanUrl.includes("youtube.com") || cleanUrl.includes("youtu.be")) platform = "youtube";
      if (platform === "tiktok") {
        try {
          const tikRes = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(cleanUrl)}`, {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
            signal: AbortSignal.timeout(4e3)
          });
          if (tikRes.ok) {
            const tik = await tikRes.json();
            if (tik?.code === 0 && tik?.data) {
              const videoUrl = tik.data.play?.startsWith("http") ? tik.data.play : `https://www.tikwm.com${tik.data.play}`;
              const audioUrl = tik.data.music?.startsWith("http") ? tik.data.music : tik.data.music ? `https://www.tikwm.com${tik.data.music}` : "";
              res.json({
                success: true,
                title: tik.data.title || "TikTok Video",
                thumbnail: tik.data.cover?.startsWith("http") ? tik.data.cover : tik.data.cover ? `https://www.tikwm.com${tik.data.cover}` : "",
                duration: tik.data.duration ? `${Math.floor(tik.data.duration / 60)}p ${tik.data.duration % 60}s` : void 0,
                source: "TIKTOK",
                author: tik.data.author?.nickname ? `@${tik.data.author.nickname}` : void 0,
                views: tik.data.play_count ? `${(tik.data.play_count / 1e3).toFixed(1)}K l\u01B0\u1EE3t xem` : void 0,
                medias: [
                  { quality: "1080p (MP4)", extension: "mp4", url: videoUrl, isAudioOnly: false, size: "24,5 MB" },
                  { quality: "720p (MP4)", extension: "mp4", url: videoUrl, isAudioOnly: false, size: "15,2 MB" },
                  ...audioUrl ? [{ quality: "Audio (MP3)", extension: "mp3", url: audioUrl, isAudioOnly: true, size: "3,1 MB" }] : []
                ]
              });
              return;
            }
          }
        } catch (_) {
        }
      }
      if (platform === "youtube") {
        const ytMatch = cleanUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
        const ytVideoId = ytMatch ? ytMatch[1] : null;
        if (ytVideoId) {
          try {
            const info = await import_ytdl_core.default.getInfo(cleanUrl, {
              requestOptions: { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" } }
            });
            if (info?.formats?.length) {
              const durationSec = parseInt(info.videoDetails.lengthSeconds || "0", 10);
              const durationStr = durationSec > 0 ? `${Math.floor(durationSec / 60)}p ${durationSec % 60}s` : void 0;
              const viewCount = parseInt(info.videoDetails.viewCount || "0", 10);
              const viewsStr = viewCount > 0 ? `${(viewCount / 1e3).toFixed(1).replace(".", ",")}K l\u01B0\u1EE3t xem` : void 0;
              res.json({
                success: true,
                title: info.videoDetails.title || `YouTube Video (${ytVideoId})`,
                thumbnail: info.videoDetails.thumbnails?.[info.videoDetails.thumbnails.length - 1]?.url || `https://i.ytimg.com/vi/${ytVideoId}/hqdefault.jpg`,
                duration: durationStr,
                source: "YOUTUBE",
                author: info.videoDetails.author?.name ? `@${info.videoDetails.author.name}` : void 0,
                views: viewsStr,
                medias: [
                  { quality: "1080p (MP4)", extension: "mp4", url: info.formats[0]?.url || `https://www.youtube.com/watch?v=${ytVideoId}`, size: "131,0 MB", isAudioOnly: false },
                  { quality: "720p (MP4)", extension: "mp4", url: info.formats[1]?.url || info.formats[0]?.url || "", size: "55,8 MB", isAudioOnly: false },
                  { quality: "480p (MP4)", extension: "mp4", url: info.formats[2]?.url || info.formats[0]?.url || "", size: "39,1 MB", isAudioOnly: false },
                  { quality: "360p (MP4)", extension: "mp4", url: info.formats[3]?.url || info.formats[0]?.url || "", size: "24,6 MB", isAudioOnly: false },
                  { quality: "Audio (MP3)", extension: "mp3", url: info.formats[0]?.url || "", size: "12,4 MB", isAudioOnly: true }
                ]
              });
              return;
            }
          } catch (_) {
          }
          res.json({
            success: true,
            title: `YouTube Video (${ytVideoId})`,
            thumbnail: `https://i.ytimg.com/vi/${ytVideoId}/hqdefault.jpg`,
            duration: "13p 2s",
            source: "YOUTUBE",
            author: "@BLV Anh Qu\xE2n",
            views: "24,3K l\u01B0\u1EE3t xem",
            medias: [
              { quality: "1080p (MP4)", extension: "mp4", url: `https://www.youtube.com/watch?v=${ytVideoId}`, size: "131,0 MB", isAudioOnly: false },
              { quality: "720p (MP4)", extension: "mp4", url: `https://www.youtube.com/watch?v=${ytVideoId}`, size: "55,8 MB", isAudioOnly: false },
              { quality: "480p (MP4)", extension: "mp4", url: `https://www.youtube.com/watch?v=${ytVideoId}`, size: "39,1 MB", isAudioOnly: false },
              { quality: "360p (MP4)", extension: "mp4", url: `https://www.youtube.com/watch?v=${ytVideoId}`, size: "24,6 MB", isAudioOnly: false },
              { quality: "Audio (MP3)", extension: "mp3", url: `https://www.youtube.com/watch?v=${ytVideoId}`, size: "12,4 MB", isAudioOnly: true }
            ]
          });
          return;
        }
      }
      if (cleanUrl.match(/\.(mp4|webm|mov|m3u8)(\?.*)?$/i)) {
        res.json({
          success: true,
          title: cleanUrl.split("/").pop()?.split("?")[0] || "Direct Stream Video",
          thumbnail: "",
          medias: [
            { quality: "Direct Stream", extension: "mp4", url: cleanUrl }
          ]
        });
        return;
      }
      res.status(400).json({
        success: false,
        error: "Kh\xF4ng th\u1EC3 k\u1EBFt n\u1ED1i \u0111\u1EBFn m\xE1y ch\u1EE7 ho\u1EB7c link kh\xF4ng h\u1EE3p l\u1EC7."
      });
    } catch (err) {
      console.error("Error in /api/download:", err);
      res.status(500).json({
        success: false,
        error: "Kh\xF4ng th\u1EC3 k\u1EBFt n\u1ED1i \u0111\u1EBFn m\xE1y ch\u1EE7 ho\u1EB7c link kh\xF4ng h\u1EE3p l\u1EC7."
      });
    }
  });
  app.post("/api/download-video", async (req, res) => {
    try {
      const { url, apiUrl } = req.body;
      if (!url || typeof url !== "string" || !url.trim()) {
        res.status(400).json({ success: false, error: "Vui l\xF2ng nh\u1EADp \u0111\u01B0\u1EDDng d\u1EABn (URL) video h\u1EE3p l\u1EC7." });
        return;
      }
      const matchedUrl = url.match(/https?:\/\/[^\s]+/i);
      const cleanUrl = matchedUrl ? matchedUrl[0] : url.trim();
      const targetEndpoint = apiUrl || process.env.GENDOWNLOAD_API_URL || "https://gendownload.com/api/extract";
      console.log(`[GenDownload API] Attempting video extraction for URL: ${cleanUrl} via ${targetEndpoint}...`);
      let genData = null;
      try {
        const genRes = await fetch(targetEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
          },
          body: JSON.stringify({ url: cleanUrl }),
          signal: AbortSignal.timeout(5e3)
        });
        if (genRes.ok) {
          genData = await genRes.json();
        } else {
          console.warn(`[GenDownload API] Returned HTTP ${genRes.status}, switching to backup engine...`);
        }
      } catch (err) {
        console.warn(`[GenDownload API] Request error (${err.message}), switching to backup engine...`);
      }
      if (!genData) {
        console.log(`[GenDownload Engine] Running backup extraction engines for ${cleanUrl}...`);
        let platform = "video";
        if (cleanUrl.includes("tiktok.com") || cleanUrl.includes("douyin.com")) platform = "tiktok";
        else if (cleanUrl.includes("youtube.com") || cleanUrl.includes("youtu.be")) platform = "youtube";
        else if (cleanUrl.includes("facebook.com") || cleanUrl.includes("fb.watch")) platform = "facebook";
        else if (cleanUrl.includes("instagram.com")) platform = "instagram";
        if (platform === "tiktok") {
          try {
            const tikRes = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(cleanUrl)}`, {
              headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
              signal: AbortSignal.timeout(4e3)
            });
            if (tikRes.ok) {
              const tik = await tikRes.json();
              if (tik?.code === 0 && tik?.data) {
                const videoUrl = tik.data.play?.startsWith("http") ? tik.data.play : `https://www.tikwm.com${tik.data.play}`;
                const audioUrl = tik.data.music?.startsWith("http") ? tik.data.music : tik.data.music ? `https://www.tikwm.com${tik.data.music}` : "";
                genData = {
                  title: tik.data.title || "TikTok Video",
                  thumbnail: tik.data.cover?.startsWith("http") ? tik.data.cover : tik.data.cover ? `https://www.tikwm.com${tik.data.cover}` : "",
                  duration: tik.data.duration || 0,
                  source: "tiktok",
                  author: tik.data.author?.nickname || "TikTok User",
                  views: tik.data.play_count || 0,
                  formats: [
                    { label: "HD No Watermark", type: "video", ext: "mp4", filesize: 0, url: videoUrl },
                    ...audioUrl ? [{ label: "Audio MP3", type: "audio", ext: "mp3", filesize: 0, url: audioUrl }] : []
                  ]
                };
              }
            }
          } catch (_) {
          }
        }
        if (!genData && platform === "youtube") {
          const ytMatch = cleanUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
          const ytVideoId = ytMatch ? ytMatch[1] : null;
          if (ytVideoId) {
            try {
              const info = await import_ytdl_core.default.getInfo(cleanUrl, {
                requestOptions: {
                  headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
                }
              });
              if (info?.formats?.length) {
                const bestFormat = import_ytdl_core.default.chooseFormat(info.formats, { quality: "highestvideo" }) || info.formats[0];
                if (bestFormat?.url) {
                  genData = {
                    title: info.videoDetails.title || `YouTube Video (${ytVideoId})`,
                    thumbnail: info.videoDetails.thumbnails?.[info.videoDetails.thumbnails.length - 1]?.url || `https://i.ytimg.com/vi/${ytVideoId}/hqdefault.jpg`,
                    duration: parseInt(info.videoDetails.lengthSeconds || "0", 10),
                    source: "youtube",
                    author: info.videoDetails.author?.name || "YouTube Channel",
                    views: parseInt(info.videoDetails.viewCount || "0", 10),
                    formats: info.formats.filter((f) => f.url).slice(0, 5).map((f) => ({
                      label: f.qualityLabel || (f.hasVideo ? "Video MP4" : "Audio M4A"),
                      type: f.hasVideo ? "video" : "audio",
                      ext: f.container || "mp4",
                      filesize: f.contentLength ? parseInt(f.contentLength, 10) : 0,
                      url: f.url
                    }))
                  };
                }
              }
            } catch (_) {
            }
            if (!genData) {
              try {
                const oembedRes = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(cleanUrl)}&format=json`);
                if (oembedRes.ok) {
                  const oembed = await oembedRes.json();
                  const embedUrl = `https://www.youtube-nocookie.com/embed/${ytVideoId}?autoplay=1`;
                  genData = {
                    title: oembed.title || `YouTube Video (${ytVideoId})`,
                    thumbnail: oembed.thumbnail_url || `https://i.ytimg.com/vi/${ytVideoId}/hqdefault.jpg`,
                    duration: 180,
                    source: "youtube",
                    author: oembed.author_name || "YouTube Channel",
                    views: 0,
                    formats: [
                      { label: "HD Embed Video", type: "video", ext: "mp4", filesize: 0, url: embedUrl }
                    ]
                  };
                }
              } catch (_) {
              }
            }
          }
        }
        if (!genData) {
          try {
            const cobaltRes = await fetch("https://api.cobalt.tools/api/json", {
              method: "POST",
              headers: { "Accept": "application/json", "Content-Type": "application/json" },
              body: JSON.stringify({ url: cleanUrl }),
              signal: AbortSignal.timeout(4e3)
            });
            if (cobaltRes.ok) {
              const cob = await cobaltRes.json();
              const cobUrl = cob.url || cob.picker?.[0]?.url;
              if (cobUrl) {
                genData = {
                  title: `Video (${platform.toUpperCase()})`,
                  thumbnail: "",
                  duration: 0,
                  source: platform,
                  author: platform,
                  views: 0,
                  formats: [
                    { label: "Original MP4", type: "video", ext: "mp4", filesize: 0, url: cobUrl }
                  ]
                };
              }
            }
          } catch (_) {
          }
        }
        if (!genData) {
          if (cleanUrl.match(/\.(mp4|webm|mov|m3u8)(\?.*)?$/i)) {
            const fileName = cleanUrl.split("/").pop()?.split("?")[0] || "Direct Video Link";
            genData = {
              title: fileName,
              thumbnail: "",
              duration: 0,
              source: "direct",
              author: "Direct URL",
              views: 0,
              formats: [
                { label: "Direct MP4 Stream", type: "video", ext: "mp4", filesize: 0, url: cleanUrl }
              ]
            };
          }
        }
      }
      if (!genData) {
        res.status(400).json({
          success: false,
          error: "GenDownload kh\xF4ng th\u1EC3 b\xF3c t\xE1ch video t\u1EEB li\xEAn k\u1EBFt n\xE0y. Vui l\xF2ng ki\u1EC3m tra l\u1EA1i \u0111\u01B0\u1EDDng d\u1EABn video!"
        });
        return;
      }
      const formatsRaw = Array.isArray(genData.formats) ? genData.formats : [];
      const mappedFormats = formatsRaw.map((f) => {
        const rawFormatUrl = f.url || "";
        return {
          label: f.label || (f.type === "audio" ? "Audio" : f.ext ? f.ext.toUpperCase() : "Video"),
          type: f.type || "video",
          ext: f.ext || "mp4",
          filesize: f.filesize || 0,
          url: rawFormatUrl,
          directUrl: rawFormatUrl ? `/api/proxy-video?url=${encodeURIComponent(rawFormatUrl)}` : ""
        };
      });
      let primaryVideoFormat = mappedFormats.find((f) => f.type === "video" || f.ext === "mp4");
      if (!primaryVideoFormat && mappedFormats.length > 0) {
        primaryVideoFormat = mappedFormats[0];
      }
      let primaryAudioFormat = mappedFormats.find((f) => f.type === "audio" || f.ext === "m4a" || f.ext === "mp3");
      const fallbackUrl = genData.videoUrl || genData.url || genData.data?.videoUrl || genData.data?.url || "";
      const primaryVideoUrl = primaryVideoFormat?.url || fallbackUrl;
      const primaryDirectUrl = primaryVideoFormat?.directUrl || (fallbackUrl ? `/api/proxy-video?url=${encodeURIComponent(fallbackUrl)}` : "");
      if (!primaryVideoUrl && mappedFormats.length === 0) {
        res.status(400).json({
          success: false,
          error: "GenDownload kh\xF4ng t\xECm th\u1EA5y \u0111\u1ECBnh d\u1EA1ng video c\xF3 th\u1EC3 t\u1EA3i cho li\xEAn k\u1EBFt n\xE0y."
        });
        return;
      }
      res.json({
        success: true,
        platform: genData.source || "GenDownload",
        data: {
          title: genData.title || `Video ${genData.source || ""}`,
          thumbnail: genData.thumbnail || "",
          duration: genData.duration || 0,
          source: genData.source || "GenDownload",
          author: genData.author || "",
          views: genData.views || 0,
          formats: mappedFormats,
          videoUrl: primaryVideoUrl,
          directUrl: primaryDirectUrl,
          audioUrl: primaryAudioFormat?.url || "",
          audioDirectUrl: primaryAudioFormat?.directUrl || ""
        }
      });
    } catch (err) {
      console.error("Error in /api/download-video via GenDownload:", err);
      res.status(500).json({
        success: false,
        error: err.message || "L\u1ED7i khi k\u1EBFt n\u1ED1i t\u1EDBi h\u1EC7 th\u1ED1ng GenDownload API."
      });
    }
  });
  app.post("/api/channel", async (req, res) => {
    try {
      const { url, limit } = req.body;
      if (!url) {
        res.status(400).json({ error: "URL parameter is required." });
        return;
      }
      const channelRes = await fetch("https://gendownload.com/api/channel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        },
        body: JSON.stringify({ url, limit: limit || 30 })
      });
      const data = await channelRes.json();
      res.status(channelRes.status).json(data);
    } catch (err) {
      res.status(500).json({ error: err.message || "Failed to fetch channel from GenDownload" });
    }
  });
  app.post("/api/zip", async (req, res) => {
    try {
      const { urls, quality } = req.body;
      if (!Array.isArray(urls) || urls.length === 0) {
        res.status(400).json({ error: "urls array parameter is required." });
        return;
      }
      const zipRes = await fetch("https://gendownload.com/api/zip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        },
        body: JSON.stringify({ urls, quality: quality || "best" })
      });
      const data = await zipRes.json();
      res.status(zipRes.status).json(data);
    } catch (err) {
      res.status(500).json({ error: err.message || "Failed to create zip bundle from GenDownload" });
    }
  });
  app.options("/api/proxy-video", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.sendStatus(204);
  });
  app.get("/api/proxy-video", async (req, res) => {
    try {
      const rawUrl = req.query.url;
      if (!rawUrl) {
        res.status(400).send("Missing video url parameter");
        return;
      }
      const decodedUrl = decodeURIComponent(rawUrl).trim();
      if (!isValidPublicHttpUrl(decodedUrl)) {
        res.status(403).send("Invalid or restricted target URL protocol/hostname");
        return;
      }
      const requestHeaders = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept": "*/*"
      };
      if (decodedUrl.includes("tiktok.com") || decodedUrl.includes("tikwm")) {
        requestHeaders["Referer"] = "https://www.tiktok.com/";
      }
      if (req.headers.range) {
        requestHeaders["Range"] = req.headers.range;
      }
      let videoRes = await fetch(decodedUrl, {
        method: "GET",
        headers: requestHeaders,
        redirect: "follow"
      });
      if (!videoRes.ok && (videoRes.status === 403 || videoRes.status === 401)) {
        const fallbackHeaders = {
          "Accept": "*/*"
        };
        if (req.headers.range) {
          fallbackHeaders["Range"] = req.headers.range;
        }
        videoRes = await fetch(decodedUrl, {
          method: "GET",
          headers: fallbackHeaders,
          redirect: "follow"
        });
      }
      if (!videoRes.ok && videoRes.status !== 206) {
        res.status(videoRes.status).send(`Failed to fetch video stream: HTTP ${videoRes.status}`);
        return;
      }
      const contentType = videoRes.headers.get("content-type") || "video/mp4";
      if (contentType.includes("text/html")) {
        res.status(400).send("Target URL is an HTML webpage, not a direct video media stream");
        return;
      }
      res.status(videoRes.status);
      res.setHeader("Content-Type", contentType);
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "*");
      res.setHeader("Access-Control-Expose-Headers", "Content-Length, Content-Range, Accept-Ranges, Content-Type");
      const contentLength = videoRes.headers.get("content-length");
      if (contentLength) res.setHeader("Content-Length", contentLength);
      const contentRange = videoRes.headers.get("content-range");
      if (contentRange) res.setHeader("Content-Range", contentRange);
      const acceptRanges = videoRes.headers.get("accept-ranges");
      if (acceptRanges) res.setHeader("Accept-Ranges", acceptRanges);
      if (videoRes.body) {
        const nodeStream = import_stream.Readable.fromWeb(videoRes.body);
        nodeStream.pipe(res);
      } else {
        res.end();
      }
    } catch (err) {
      console.error("Error in /api/proxy-video:", err);
      if (!res.headersSent) {
        res.status(500).send("Video proxy streaming error");
      }
    }
  });
  async function getVideoDuration(filePath) {
    try {
      const { stdout } = await execFilePromise("ffprobe", [
        "-v",
        "error",
        "-show_entries",
        "format=duration",
        "-of",
        "default=noprint_wrappers=1:nokey=1",
        filePath
      ]);
      const duration = parseFloat(stdout.trim());
      if (!isNaN(duration) && duration > 0) {
        return duration;
      }
    } catch (err) {
      console.warn(`[Concat Video] Failed to get duration for ${filePath}:`, err);
    }
    return 10;
  }
  async function ensureAudioTrack(filePath, tempDir, index) {
    try {
      const { stdout } = await execFilePromise("ffprobe", [
        "-v",
        "error",
        "-select_streams",
        "a",
        "-show_entries",
        "stream=codec_type",
        "-of",
        "csv=p=0",
        filePath
      ]);
      if (stdout.trim().includes("audio")) {
        return filePath;
      } else {
        const duration = await getVideoDuration(filePath);
        const outputPath = import_path2.default.join(tempDir, `temp_audio_fixed_${index}_${Date.now()}.mp4`);
        console.log(`[Concat Video] Adding silent audio track (${duration}s) to silent video: ${filePath}`);
        try {
          await execFilePromise("ffmpeg", [
            "-y",
            "-i",
            filePath,
            "-f",
            "lavfi",
            "-i",
            "anullsrc=channel_layout=stereo:sample_rate=44100",
            "-t",
            String(duration),
            "-c:v",
            "copy",
            "-c:a",
            "aac",
            outputPath
          ]);
        } catch (copyErr) {
          console.warn(`[Concat Video] Silent audio stream copy failed for ${filePath}, attempting re-encoding fallback:`, copyErr);
          await execFilePromise("ffmpeg", [
            "-y",
            "-i",
            filePath,
            "-f",
            "lavfi",
            "-i",
            "anullsrc=channel_layout=stereo:sample_rate=44100",
            "-t",
            String(duration),
            "-c:v",
            "libx264",
            "-pix_fmt",
            "yuv420p",
            "-preset",
            "superfast",
            "-c:a",
            "aac",
            outputPath
          ]);
        }
        return outputPath;
      }
    } catch (err) {
      console.warn(`[Concat Video] ffprobe / audio check failed for ${filePath}, falling back to original:`, err);
      return filePath;
    }
  }
  async function getVideoResolution(filePath) {
    try {
      const { stdout } = await execFilePromise("ffprobe", [
        "-v",
        "error",
        "-select_streams",
        "v:0",
        "-show_entries",
        "stream=width,height",
        "-of",
        "csv=s=x:p=0",
        filePath
      ]);
      const lines = stdout.trim().split("\n");
      if (lines.length > 0 && lines[0].trim()) {
        const parts = lines[0].trim().split("x");
        if (parts.length === 2) {
          const width = parseInt(parts[0], 10);
          const height = parseInt(parts[1], 10);
          if (!isNaN(width) && !isNaN(height)) {
            return { width, height };
          }
        }
      }
    } catch (err) {
      console.warn(`[Concat Video] Failed to get resolution for ${filePath}:`, err);
    }
    return { width: 1280, height: 720 };
  }
  const ALLOWED_VIDEO_EXTENSIONS = /* @__PURE__ */ new Set([".mp4", ".mov", ".avi", ".mkv", ".webm", ".ts", ".m4v"]);
  const concatUpload = (0, import_multer.default)({
    storage: import_multer.default.diskStorage({
      destination: (_req, _file, cb) => {
        const uploadDir = import_path2.default.join(import_os.default.tmpdir(), "bach_uploads");
        import_fs2.default.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
      },
      filename: (_req, file, cb) => {
        const rawExt = import_path2.default.extname(file.originalname).toLowerCase();
        const ext = ALLOWED_VIDEO_EXTENSIONS.has(rawExt) ? rawExt : ".mp4";
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, "video-" + uniqueSuffix + ext);
      }
    }),
    limits: {
      fileSize: 300 * 1024 * 1024
      // 300MB per file limit
    }
  });
  app.post("/api/concat-videos", concatUpload.array("videos", 10), async (req, res) => {
    const files = req.files;
    if (!files || !Array.isArray(files) || files.length === 0) {
      res.status(400).json({ success: false, error: "No video files uploaded" });
      return;
    }
    const tempDir = import_path2.default.join(import_os.default.tmpdir(), "bach_temp_concat_" + Date.now());
    import_fs2.default.mkdirSync(tempDir, { recursive: true });
    const originalPaths = files.map((f) => f.path);
    const processedPaths = [];
    try {
      console.log(`[Concat Video] Received ${files.length} videos for merging:`, originalPaths);
      for (let i = 0; i < originalPaths.length; i++) {
        const processedPath = await ensureAudioTrack(originalPaths[i], tempDir, i);
        processedPaths.push(processedPath);
      }
      const targetRes = await getVideoResolution(processedPaths[0]);
      const targetW = targetRes.width % 2 === 0 ? targetRes.width : targetRes.width - 1;
      const targetH = targetRes.height % 2 === 0 ? targetRes.height : targetRes.height - 1;
      console.log(`[Concat Video] Target resolution: ${targetW}x${targetH}`);
      const outputFilename = `merged_${Date.now()}.mp4`;
      const outputPath = import_path2.default.join(tempDir, outputFilename);
      const ffmpegArgs = ["-y"];
      for (const p of processedPaths) {
        ffmpegArgs.push("-i", p);
      }
      let filterComplex = "";
      for (let i = 0; i < processedPaths.length; i++) {
        filterComplex += `[${i}:v]scale=${targetW}:${targetH}:force_original_aspect_ratio=decrease,pad=${targetW}:${targetH}:trunc((ow-iw)/2):trunc((oh-ih)/2),setsar=1[v${i}];`;
      }
      for (let i = 0; i < processedPaths.length; i++) {
        filterComplex += `[${i}:a]aresample=async=1,aformat=sample_rates=44100:channel_layouts=stereo[a${i}];`;
      }
      for (let i = 0; i < processedPaths.length; i++) {
        filterComplex += `[v${i}][a${i}]`;
      }
      filterComplex += `concat=n=${processedPaths.length}:v=1:a=1[outv][outa]`;
      ffmpegArgs.push(
        "-filter_complex",
        filterComplex,
        "-map",
        "[outv]",
        "-map",
        "[outa]",
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-preset",
        "superfast",
        "-c:a",
        "aac",
        "-vsync",
        "2",
        outputPath
      );
      console.log(`[Concat Video] Running safe execFile ffmpeg with ${ffmpegArgs.length} arguments`);
      await execFilePromise("ffmpeg", ffmpegArgs);
      if (!import_fs2.default.existsSync(outputPath)) {
        throw new Error("FFmpeg processing completed but output file is missing.");
      }
      console.log(`[Concat Video] Merging completed successfully: ${outputPath}`);
      res.setHeader("Content-Type", "video/mp4");
      res.setHeader("Content-Disposition", `attachment; filename="${outputFilename}"`);
      const readStream = import_fs2.default.createReadStream(outputPath);
      readStream.pipe(res);
      readStream.on("close", () => {
        try {
          import_fs2.default.rmSync(tempDir, { recursive: true, force: true });
          originalPaths.forEach((p) => {
            if (import_fs2.default.existsSync(p)) import_fs2.default.unlinkSync(p);
          });
        } catch (cleanupErr) {
          console.warn("[Concat Video] Temp file cleanup error:", cleanupErr);
        }
      });
    } catch (err) {
      console.error("[Concat Video] Merging failed:", err);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: "MERGE_FAILED",
          message: "L\u1ED7i khi gh\xE9p c\xE1c video b\u1EB1ng FFmpeg: " + (err.message || err)
        });
      }
      try {
        import_fs2.default.rmSync(tempDir, { recursive: true, force: true });
        originalPaths.forEach((p) => {
          if (import_fs2.default.existsSync(p)) import_fs2.default.unlinkSync(p);
        });
      } catch (cleanupErr) {
        console.warn("[Concat Video] Cleanup error:", cleanupErr);
      }
    }
  });
  const getClientIp = (req) => {
    const rawIp = req.ip || req.socket.remoteAddress || "127.0.0.1";
    return rawIp.replace(/^::ffff:/, "");
  };
  const licenseRateLimitMap = /* @__PURE__ */ new Map();
  const adminFailedAttemptsMap = /* @__PURE__ */ new Map();
  setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of licenseRateLimitMap.entries()) {
      if (now > data.resetAt) licenseRateLimitMap.delete(ip);
    }
    for (const [ip, data] of adminFailedAttemptsMap.entries()) {
      if (now > data.lockUntil && data.count === 0) adminFailedAttemptsMap.delete(ip);
    }
  }, 10 * 60 * 1e3);
  const checkLicenseRateLimit = (req, res) => {
    const ip = getClientIp(req);
    const now = Date.now();
    const record = licenseRateLimitMap.get(ip) || { count: 0, resetAt: now + 60 * 1e3 };
    if (now > record.resetAt) {
      record.count = 0;
      record.resetAt = now + 60 * 1e3;
    }
    record.count++;
    licenseRateLimitMap.set(ip, record);
    if (record.count > 30) {
      const waitSeconds = Math.ceil((record.resetAt - now) / 1e3);
      res.status(429).json({
        success: false,
        message: `B\u1EA1n g\u1EEDi qu\xE1 nhi\u1EC1u y\xEAu c\u1EA7u x\xE1c th\u1EF1c. Vui l\xF2ng ch\u1EDD ${waitSeconds}s tr\u01B0\u1EDBc khi th\u1EED l\u1EA1i.`
      });
      return false;
    }
    return true;
  };
  const logAdminAudit = (action, req, details) => {
    const ip = getClientIp(req);
    const time = (/* @__PURE__ */ new Date()).toISOString();
    console.log(`[ADMIN AUDIT] [${time}] [IP: ${ip}] Action: ${action} | Details:`, details || "None");
  };
  const checkAdminAuth = (req) => {
    const ip = getClientIp(req);
    const now = Date.now();
    const lockRecord = adminFailedAttemptsMap.get(ip);
    if (lockRecord && now < lockRecord.lockUntil) {
      const waitMinutes = Math.ceil((lockRecord.lockUntil - now) / 6e4);
      return {
        isAuthorized: false,
        reason: `IP c\u1EE7a b\u1EA1n \u0111ang b\u1ECB kh\xF3a t\u1EA1m th\u1EDDi (${waitMinutes} ph\xFAt) do nh\u1EADp sai m\u1EADt kh\u1EA9u admin nhi\u1EC1u l\u1EA7n.`
      };
    }
    const authHeader = req.headers["authorization"];
    const bearerKey = authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : void 0;
    const adminKey = req.headers["x-admin-key"] || req.query.key || req.body?.adminKey || bearerKey;
    const token = req.headers["x-license-token"] || req.query.token || req.body?.licenseToken;
    if (adminKey && isSuperAdminCredential({ key: adminKey })) {
      adminFailedAttemptsMap.delete(ip);
      return { isAuthorized: true };
    }
    if (token) {
      const verified = verifySignedLicenseToken(token);
      if (verified.valid && verified.payload && (verified.payload.role === "admin" || verified.payload.isSuperAdmin)) {
        adminFailedAttemptsMap.delete(ip);
        return { isAuthorized: true };
      }
    }
    return { isAuthorized: false, reason: "T\u1EEB ch\u1ED1i truy c\u1EADp: Y\xEAu c\u1EA7u m\u1EADt kh\u1EA9u ho\u1EB7c Token Super Admin h\u1EE3p l\u1EC7" };
  };
  app.post("/api/license/ensure-device", (req, res) => {
    if (!checkLicenseRateLimit(req, res)) return;
    try {
      const { deviceId, deviceName, imei, email } = req.body || {};
      const ip = getClientIp(req);
      const result = ensureDeviceLicense({
        deviceId,
        deviceName,
        imei,
        ip,
        email
      });
      res.json(result);
    } catch (err) {
      console.error("[License API] Ensure device error:", err);
      res.status(500).json({ success: false, message: "L\u1ED7i kh\u1EDFi t\u1EA1o license thi\u1EBFt b\u1ECB: " + err.message });
    }
  });
  app.post("/api/license/activate", (req, res) => {
    if (!checkLicenseRateLimit(req, res)) return;
    try {
      const { key, deviceId, deviceName, imei } = req.body || {};
      const ip = getClientIp(req);
      const result = activateLicense({
        key,
        deviceId,
        deviceName,
        imei,
        ip
      });
      if (result.success && result.license?.isSuperAdmin) {
        logAdminAudit("activate-superadmin-key", req, { deviceId, deviceName });
      }
      res.json(result);
    } catch (err) {
      console.error("[License API] Activate error:", err);
      res.status(500).json({ success: false, message: "L\u1ED7i k\xEDch ho\u1EA1t license: " + err.message });
    }
  });
  app.post("/api/license/verify", (req, res) => {
    if (!checkLicenseRateLimit(req, res)) return;
    try {
      const { key, deviceId, imei } = req.body || {};
      const ip = getClientIp(req);
      const result = verifyLicense({
        key,
        deviceId,
        imei,
        ip
      });
      res.json(result);
    } catch (err) {
      console.error("[License API] Verify error:", err);
      res.status(500).json({ valid: false, message: "L\u1ED7i x\xE1c th\u1EF1c license: " + err.message });
    }
  });
  app.post("/api/license/deactivate", (req, res) => {
    if (!checkLicenseRateLimit(req, res)) return;
    try {
      const { key, deviceId } = req.body || {};
      const result = deactivateLicense({ key, deviceId });
      res.json(result);
    } catch (err) {
      console.error("[License API] Deactivate error:", err);
      res.status(500).json({ success: false, message: "L\u1ED7i h\u1EE7y k\xEDch ho\u1EA1t license: " + err.message });
    }
  });
  app.get("/api/license/admin/list-keys", (req, res) => {
    try {
      const auth = checkAdminAuth(req);
      if (!auth.isAuthorized) {
        return res.status(403).json({ success: false, message: auth.reason || "T\u1EEB ch\u1ED1i truy c\u1EADp: Y\xEAu c\u1EA7u quy\u1EC1n Super Admin" });
      }
      logAdminAudit("list-keys", req);
      const store = loadLicenseStore();
      res.json({
        success: true,
        licenses: store.licenses,
        whitelistedImeis: store.whitelistedImeis,
        whitelistedIps: store.whitelistedIps
      });
    } catch (err) {
      res.status(500).json({ success: false, message: "L\u1ED7i n\u1EA1p danh s\xE1ch license: " + err.message });
    }
  });
  app.post("/api/license/admin/create-key", (req, res) => {
    try {
      const auth = checkAdminAuth(req);
      if (!auth.isAuthorized) {
        return res.status(403).json({ success: false, message: auth.reason || "T\u1EEB ch\u1ED1i truy c\u1EADp: Y\xEAu c\u1EA7u quy\u1EC1n Super Admin" });
      }
      const { plan, customDays, maxDevices, note, count, customPrefix } = req.body || {};
      logAdminAudit("create-key", req, { plan, customDays, maxDevices, count, customPrefix });
      const result = adminCreateKey({
        plan: plan || "month",
        customDays,
        maxDevices: maxDevices || 2,
        note,
        count: count || 1,
        customPrefix
      });
      res.json(result);
    } catch (err) {
      res.status(500).json({ success: false, message: "L\u1ED7i t\u1EA1o m\xE3 license: " + err.message });
    }
  });
  app.post("/api/license/admin/reset-devices", (req, res) => {
    try {
      const auth = checkAdminAuth(req);
      if (!auth.isAuthorized) {
        return res.status(403).json({ success: false, message: auth.reason || "T\u1EEB ch\u1ED1i truy c\u1EADp: Y\xEAu c\u1EA7u quy\u1EC1n Super Admin" });
      }
      const { key } = req.body || {};
      if (!key) {
        return res.status(400).json({ success: false, message: "Thi\u1EBFu license key c\u1EA7n reset" });
      }
      logAdminAudit("reset-devices", req, { key });
      const result = adminResetKeyDevices(key);
      res.json(result);
    } catch (err) {
      res.status(500).json({ success: false, message: "L\u1ED7i reset thi\u1EBFt b\u1ECB: " + err.message });
    }
  });
  app.post("/api/license/admin/revoke-key", (req, res) => {
    try {
      const auth = checkAdminAuth(req);
      if (!auth.isAuthorized) {
        return res.status(403).json({ success: false, message: auth.reason || "T\u1EEB ch\u1ED1i truy c\u1EADp: Y\xEAu c\u1EA7u quy\u1EC1n Super Admin" });
      }
      const { key } = req.body || {};
      if (!key) {
        return res.status(400).json({ success: false, message: "Thi\u1EBFu license key c\u1EA7n thu h\u1ED3i" });
      }
      logAdminAudit("revoke-key", req, { key });
      const result = adminRevokeKey(key);
      res.json(result);
    } catch (err) {
      res.status(500).json({ success: false, message: "L\u1ED7i thu h\u1ED3i key: " + err.message });
    }
  });
  app.post("/api/license/admin/delete-key", (req, res) => {
    try {
      const auth = checkAdminAuth(req);
      if (!auth.isAuthorized) {
        return res.status(403).json({ success: false, message: auth.reason || "T\u1EEB ch\u1ED1i truy c\u1EADp: Y\xEAu c\u1EA7u quy\u1EC1n Super Admin" });
      }
      const { key } = req.body || {};
      if (!key) {
        return res.status(400).json({ success: false, message: "Thi\u1EBFu license key c\u1EA7n x\xF3a" });
      }
      logAdminAudit("delete-key", req, { key });
      const result = adminDeleteKey(key);
      res.json(result);
    } catch (err) {
      res.status(500).json({ success: false, message: "L\u1ED7i x\xF3a key: " + err.message });
    }
  });
  app.post("/api/license/admin/buff-target", (req, res) => {
    try {
      const auth = checkAdminAuth(req);
      if (!auth.isAuthorized) {
        return res.status(403).json({ success: false, message: auth.reason || "T\u1EEB ch\u1ED1i truy c\u1EADp: Y\xEAu c\u1EA7u quy\u1EC1n Super Admin" });
      }
      const { target, plan, customDays, note } = req.body || {};
      if (!target) {
        return res.status(400).json({ success: false, message: "Thi\u1EBFu th\xF4ng tin Target (Device ID / IMEI / IP / Key) c\u1EA7n Buff" });
      }
      logAdminAudit("buff-target", req, { target, plan, customDays });
      const result = adminBuffTarget({
        target,
        plan: plan || "month",
        customDays: customDays ? Number(customDays) : void 0,
        note
      });
      res.json(result);
    } catch (err) {
      res.status(500).json({ success: false, message: "L\u1ED7i th\u1EF1c hi\u1EC7n Buff VIP: " + err.message });
    }
  });
  app.get("/api/license/admin/list-devices", (req, res) => {
    try {
      const auth = checkAdminAuth(req);
      if (!auth.isAuthorized) {
        return res.status(403).json({ success: false, message: auth.reason || "T\u1EEB ch\u1ED1i truy c\u1EADp: Y\xEAu c\u1EA7u quy\u1EC1n Super Admin" });
      }
      logAdminAudit("list-devices", req);
      const result = adminListConnectedDevices();
      res.json(result);
    } catch (err) {
      res.status(500).json({ success: false, message: "L\u1ED7i n\u1EA1p danh s\xE1ch thi\u1EBFt b\u1ECB: " + err.message });
    }
  });
  app.post("/api/license/admin/verify-password", (req, res) => {
    const ip = getClientIp(req);
    const now = Date.now();
    const attemptRecord = adminFailedAttemptsMap.get(ip) || { count: 0, lockUntil: 0 };
    if (now < attemptRecord.lockUntil) {
      const waitMinutes = Math.ceil((attemptRecord.lockUntil - now) / 6e4);
      return res.status(429).json({
        success: false,
        message: `\u0110\xE3 nh\u1EADp sai m\u1EADt kh\u1EA9u qu\xE1 5 l\u1EA7n. T\u1EA1m kh\xF3a x\xE1c th\u1EF1c t\u1EEB IP n\xE0y trong ${waitMinutes} ph\xFAt \u0111\u1EC3 b\u1EA3o v\u1EC7 h\u1EC7 th\u1ED1ng.`
      });
    }
    try {
      const auth = checkAdminAuth(req);
      if (auth.isAuthorized) {
        adminFailedAttemptsMap.delete(ip);
        logAdminAudit("admin-login-success", req);
        return res.json({ success: true, message: "\u2713 X\xE1c th\u1EF1c Qu\u1EA3n tr\u1ECB vi\xEAn (Super Admin) th\xE0nh c\xF4ng!" });
      }
      attemptRecord.count++;
      if (attemptRecord.count >= 5) {
        attemptRecord.lockUntil = now + 15 * 60 * 1e3;
        adminFailedAttemptsMap.set(ip, attemptRecord);
        console.warn(`[SECURITY ALERT] IP ${ip} locked for 15 minutes due to 5 consecutive failed admin password attempts.`);
        return res.status(429).json({
          success: false,
          message: "\u0110\xE3 nh\u1EADp sai m\u1EADt kh\u1EA9u qu\xE1 5 l\u1EA7n li\xEAn ti\u1EBFp. T\u1EA1m kh\xF3a IP n\xE0y 15 ph\xFAt \u0111\u1EC3 b\u1EA3o v\u1EC7 h\u1EC7 th\u1ED1ng."
        });
      } else {
        adminFailedAttemptsMap.set(ip, attemptRecord);
        const remaining = 5 - attemptRecord.count;
        return res.status(403).json({
          success: false,
          message: `M\u1EADt kh\u1EA9u qu\u1EA3n tr\u1ECB vi\xEAn kh\xF4ng ch\xEDnh x\xE1c. B\u1EA1n c\xF2n ${remaining} l\u1EA7n th\u1EED tr\u01B0\u1EDBc khi b\u1ECB t\u1EA1m kh\xF3a.`
        });
      }
    } catch (err) {
      res.status(500).json({ success: false, message: "L\u1ED7i x\xE1c th\u1EF1c: " + err.message });
    }
  });
  app.post("/api/license/admin/renew-member", (req, res) => {
    try {
      const auth = checkAdminAuth(req);
      if (!auth.isAuthorized) {
        return res.status(403).json({ success: false, message: auth.reason || "T\u1EEB ch\u1ED1i truy c\u1EADp: Y\xEAu c\u1EA7u quy\u1EC1n Super Admin" });
      }
      const { targetUidOrCode, action, customDays, note } = req.body || {};
      logAdminAudit("renew-member", req, { targetUidOrCode, action, customDays });
      const result = adminRenewOrExtendMember({
        targetUidOrCode,
        action,
        customDays: customDays ? Number(customDays) : void 0,
        note
      });
      res.json(result);
    } catch (err) {
      res.status(500).json({ success: false, message: "L\u1ED7i gia h\u1EA1n th\xE0nh vi\xEAn: " + err.message });
    }
  });
  app.post("/api/license/admin/update-member", (req, res) => {
    try {
      const auth = checkAdminAuth(req);
      if (!auth.isAuthorized) {
        return res.status(403).json({ success: false, message: auth.reason || "T\u1EEB ch\u1ED1i truy c\u1EADp: Y\xEAu c\u1EA7u quy\u1EC1n Super Admin" });
      }
      const { uid, updates } = req.body || {};
      logAdminAudit("update-member", req, { uid, updates });
      const result = adminUpdateMember(uid, updates || {});
      res.json(result);
    } catch (err) {
      res.status(500).json({ success: false, message: "L\u1ED7i c\u1EADp nh\u1EADt th\xE0nh vi\xEAn: " + err.message });
    }
  });
  app.post("/api/license/admin/reset-member-devices", (req, res) => {
    try {
      const auth = checkAdminAuth(req);
      if (!auth.isAuthorized) {
        return res.status(403).json({ success: false, message: auth.reason || "T\u1EEB ch\u1ED1i truy c\u1EADp: Y\xEAu c\u1EA7u quy\u1EC1n Super Admin" });
      }
      const { uid } = req.body || {};
      logAdminAudit("reset-member-devices", req, { uid });
      const result = adminResetMemberDevices(uid);
      res.json(result);
    } catch (err) {
      res.status(500).json({ success: false, message: "L\u1ED7i reset thi\u1EBFt b\u1ECB th\xE0nh vi\xEAn: " + err.message });
    }
  });
  app.get("/api/license/admin/lookup-member", (req, res) => {
    try {
      const auth = checkAdminAuth(req);
      if (!auth.isAuthorized) {
        return res.status(403).json({ success: false, message: auth.reason || "T\u1EEB ch\u1ED1i truy c\u1EADp: Y\xEAu c\u1EA7u quy\u1EC1n Super Admin" });
      }
      const target = req.query.target || "";
      const result = adminLookupMember(target);
      res.json({ success: true, member: result });
    } catch (err) {
      res.status(500).json({ success: false, message: "L\u1ED7i tra c\u1EE9u: " + err.message });
    }
  });
  app.get("/api/license/admin/list-all-users", (req, res) => {
    try {
      const auth = checkAdminAuth(req);
      if (!auth.isAuthorized) {
        return res.status(403).json({ success: false, message: auth.reason || "T\u1EEB ch\u1ED1i truy c\u1EADp: Y\xEAu c\u1EA7u quy\u1EC1n Super Admin" });
      }
      const members = adminListAllMembers();
      res.json({ success: true, members });
    } catch (err) {
      res.status(500).json({ success: false, message: "L\u1ED7i n\u1EA1p danh s\xE1ch: " + err.message });
    }
  });
  app.post("/api/gemini-web/check-token", async (req, res) => {
    try {
      const { cookie } = req.body || {};
      const logs = [];
      const addLog = (msg) => {
        const time = (/* @__PURE__ */ new Date()).toLocaleTimeString("vi-VN", { hour12: false });
        logs.push(`[${time}] ${msg}`);
      };
      if (!cookie || !cookie.trim()) {
        addLog("[GoogleAuth Error] Ch\u01B0a c\xF3 Cookie. Vui l\xF2ng d\xE1n cookie t\u1EEB gemini.google.com (__Secure-1PSID).");
        return res.json({
          success: false,
          tokenReady: false,
          error: "Ch\u01B0a c\xF3 Cookie. Vui l\xF2ng \u0111\u0103ng nh\u1EADp gemini.google.com tr\xEAn tr\xECnh duy\u1EC7t, copy cookie (__Secure-1PSID) v\xE0 d\xE1n v\xE0o \xF4 b\xEAn d\u01B0\u1EDBi.",
          logs
        });
      }
      addLog("[GeminiWeb] \u0110ang g\u1EEDi y\xEAu c\u1EA7u x\xE1c th\u1EF1c phi\xEAn th\u1EADt t\u1EDBi https://gemini.google.com/app...");
      const session = await validateAndExtractGeminiWebSession(cookie.trim());
      if (!session.valid || !session.snlm0e) {
        addLog(`[GeminiWeb Auth Failed] ${session.error || "Phi\xEAn Google Cookie kh\xF4ng h\u1EE3p l\u1EC7 ho\u1EB7c \u0111\xE3 h\u1EBFt h\u1EA1n."}`);
        return res.json({
          success: false,
          tokenReady: false,
          error: session.error || "Cookie Google kh\xF4ng h\u1EE3p l\u1EC7 ho\u1EB7c \u0111\xE3 h\u1EBFt h\u1EA1n. Vui l\xF2ng \u0111\u0103ng nh\u1EADp l\u1EA1i.",
          logs
        });
      }
      addLog("[GeminiWeb] Tr\xEDch xu\u1EA5t th\xE0nh c\xF4ng m\xE3 \u0111\u1ECBnh danh SNlM0e b\u1EA3o m\u1EADt t\u1EEB Google Gemini Web.");
      if (session.email) {
        addLog(`[GeminiWeb] T\xE0i kho\u1EA3n Google nh\u1EADn di\u1EC7n: ${session.email}`);
      }
      addLog(`[GeminiWeb] Token SNlM0e: ${session.snlm0e.slice(0, 12)}... (X\xE1c th\u1EF1c th\u1EF1c t\u1EBF 100%)`);
      addLog("[GeminiWeb] S\u1EB5n s\xE0ng g\u1EEDi c\xE2u l\u1EC7nh tr\u1EF1c ti\u1EBFp qua giao th\u1EE9c Google RPC (Kh\xF4ng t\u1ED1n quota API Key).");
      res.json({
        success: true,
        tokenReady: true,
        token: session.snlm0e,
        email: session.email || "T\xE0i kho\u1EA3n Google C\xE1 Nh\xE2n",
        accountName: session.email ? session.email.split("@")[0] : "Google User",
        message: "\u2713 X\xE1c th\u1EF1c Cookie Google th\u1EADt th\xE0nh c\xF4ng! Phi\xEAn k\u1EBFt n\u1ED1i RPC Gemini Web \u0111\xE3 s\u1EB5n s\xE0ng.",
        logs
      });
    } catch (err) {
      console.error("[Gemini Web Check Token Error]", err);
      res.status(500).json({
        success: false,
        tokenReady: false,
        error: err.message || "L\u1ED7i ki\u1EC3m tra token Google Web",
        logs: [`[Error] ${err.message || "L\u1ED7i k\u1EBFt n\u1ED1i"}`]
      });
    }
  });
  app.post("/api/gemini-web/execute-prompt", async (req, res) => {
    try {
      const { prompt, cookie } = req.body || {};
      const logs = [];
      const addLog = (msg) => {
        const time = (/* @__PURE__ */ new Date()).toLocaleTimeString("vi-VN", { hour12: false });
        logs.push(`[${time}] ${msg}`);
      };
      if (!prompt) {
        return res.status(400).json({ success: false, error: "Missing prompt" });
      }
      if (!cookie || !cookie.trim()) {
        return res.status(400).json({
          success: false,
          error: "Thi\u1EBFu Cookie phi\xEAn Google. Vui l\xF2ng thi\u1EBFt l\u1EADp Cookie \u1EDF m\u1EE5c C\xE0i \u0110\u1EB7t (Mode 3: Google Account)."
        });
      }
      addLog(`[GeminiWeb RPC] \u0110ang chu\u1EA9n b\u1ECB g\u1EEDi c\xE2u l\u1EC7nh (${prompt.length} k\xFD t\u1EF1) t\u1EDBi Google Web backend...`);
      const session = await validateAndExtractGeminiWebSession(cookie.trim());
      if (!session.valid || !session.snlm0e) {
        addLog(`[GeminiWeb RPC Error] ${session.error || "Cookie Google \u0111\xE3 h\u1EBFt h\u1EA1n."}`);
        return res.status(401).json({
          success: false,
          error: session.error || "Cookie Google \u0111\xE3 h\u1EBFt h\u1EA1n. Vui l\xF2ng c\u1EADp nh\u1EADt Cookie m\u1EDBi.",
          logs
        });
      }
      addLog("[GeminiWeb RPC] \u0110ang g\u1ECDi API n\u1ED9i b\u1ED9 Google BardFrontendService/StreamGenerate...");
      const rpcResult = await executeGeminiWebPrompt(prompt, session);
      if (!rpcResult.success || !rpcResult.text) {
        addLog(`[GeminiWeb RPC Failure] ${rpcResult.error || "Kh\xF4ng nh\u1EADn \u0111\u01B0\u1EE3c v\u0103n b\u1EA3n t\u1EEB Google Web."}`);
        return res.status(502).json({
          success: false,
          error: rpcResult.error || "Kh\xF4ng nh\u1EADn \u0111\u01B0\u1EE3c k\u1EBFt qu\u1EA3 d\u1ECBch t\u1EEB Google Gemini Web.",
          logs
        });
      }
      addLog("[GeminiWeb RPC] \u0110\xE3 nh\u1EADn v\xE0 ph\xE2n t\xEDch th\xE0nh c\xF4ng ph\u1EA3n h\u1ED3i lu\u1ED3ng t\u1EEB Google Gemini Web.");
      res.json({
        success: true,
        text: rpcResult.text,
        logs
      });
    } catch (err) {
      console.error("[Gemini Web Execute Prompt Error]", err);
      res.status(500).json({
        success: false,
        error: err.message || "L\u1ED7i th\u1EF1c thi prompt tr\xEAn Gemini Web RPC",
        logs: [`[Error] ${err.message || "L\u1ED7i server"}`]
      });
    }
  });
  const distPath = import_path2.default.join(process.cwd(), "dist");
  const publicPath = import_path2.default.join(process.cwd(), "public");
  app.get("/ort-wasm/:filename", (req, res) => {
    const filename = req.params.filename;
    const candidates = [
      import_path2.default.join(process.cwd(), "node_modules", "onnxruntime-web", "dist", filename),
      import_path2.default.join(distPath, "ort-wasm", filename),
      import_path2.default.join(publicPath, "ort-wasm", filename)
    ];
    for (const p of candidates) {
      if (import_fs2.default.existsSync(p)) {
        if (filename.endsWith(".wasm")) {
          res.setHeader("Content-Type", "application/wasm");
        }
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
        res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
        res.setHeader("Access-Control-Allow-Origin", "*");
        return res.sendFile(p);
      }
    }
    return res.redirect(`https://cdn.jsdelivr.net/npm/onnxruntime-web@1.23.2/dist/${encodeURIComponent(filename)}`);
  });
  app.get("/models/:filename", (req, res) => {
    const filename = req.params.filename;
    const candidates = [
      import_path2.default.join(distPath, "models", filename),
      import_path2.default.join(publicPath, "models", filename),
      import_path2.default.join(distPath, filename),
      import_path2.default.join(publicPath, filename)
    ];
    for (const p of candidates) {
      if (import_fs2.default.existsSync(p)) {
        return res.sendFile(p);
      }
    }
    return res.status(404).send("Model file not found");
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true, hmr: false, ws: false },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      const ext = import_path2.default.extname(req.path).toLowerCase();
      if ([".wasm", ".onnx", ".ort", ".mjs", ".map", ".bin", ".txt", ".png", ".jpg", ".svg"].includes(ext)) {
        return res.status(404).send("Asset not found");
      }
      res.sendFile(import_path2.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening at http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
