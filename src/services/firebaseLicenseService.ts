import {
  db,
  auth,
  googleProvider,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  signInWithPopup,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  User
} from '../firebase';
import { getDeviceFingerprint, getSavedUserImei, saveUserImei, DeviceInfo } from '../utils/deviceFingerprint';

export interface CloudLicenseRecord {
  id: string;
  key: string;
  plan: 'trial' | 'month' | 'quarter' | 'year' | 'lifetime' | 'admin';
  role: 'user' | 'pro' | 'admin';
  maxDevices: number;
  activatedDevices: Array<{
    deviceId: string;
    deviceName?: string;
    imei?: string;
    ip?: string;
    activatedAt: number;
    lastUsedAt: number;
  }>;
  createdAt: number;
  expiresAt: number | null;
  status: 'active' | 'suspended' | 'revoked';
  note?: string;
  ownerUid?: string;
  ownerEmail?: string;
}

export interface CloudDeviceRecord {
  deviceId: string;
  deviceName?: string;
  imei?: string;
  ip?: string;
  licenseKey?: string;
  plan?: string;
  role?: string;
  status?: string;
  expiresAt?: number | null;
  lastActiveAt: number;
  createdAt: number;
  userEmail?: string;
  userUid?: string;
  note?: string;
  isSuperAdmin?: boolean;
}

export interface ResolvedCloudLicenseState {
  isPro: boolean;
  isAdmin: boolean;
  plan: 'free' | 'trial' | 'month' | 'quarter' | 'year' | 'lifetime' | 'admin';
  role: 'user' | 'pro' | 'admin';
  key?: string;
  token?: string;
  status: 'inactive' | 'active' | 'expired' | 'suspended';
  expiresAt: number | null;
  remainingDays?: number;
  maxDevices: number;
  activatedCount: number;
  note?: string;
  deviceId: string;
  imei?: string;
  isWhitelistedAdmin?: boolean;
  cloudSynced: boolean;
}

const LICENSES_COLLECTION = 'licenses';
const DEVICES_COLLECTION = 'devices';

let isFirebaseConnected = false;
let authUser: User | null = null;

// Initialize Firebase Auth listener
export function initFirebaseAuthListener(onUserChange: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, (user) => {
    authUser = user;
    isFirebaseConnected = true;
    onUserChange(user);
  });
}

// Sign in with Google Popup
export async function signInWithGoogle(): Promise<User | null> {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    authUser = res.user;
    return res.user;
  } catch (err: any) {
    console.error('[Firebase Auth] Sign in with Google error:', err);
    throw err;
  }
}

// Sign out from Firebase
export async function logOutFirebase(): Promise<void> {
  try {
    await signOut(auth);
    authUser = null;
  } catch (err: any) {
    console.error('[Firebase Auth] Sign out error:', err);
    throw err;
  }
}

// Get current Firebase Auth User
export function getFirebaseUser(): User | null {
  return authUser || auth.currentUser;
}

/**
 * Fetch License from Cloud Firestore by Key
 */
export async function getCloudLicenseByKey(key: string): Promise<CloudLicenseRecord | null> {
  if (!key) return null;
  try {
    const cleanKey = key.trim().toUpperCase();
    const docRef = doc(db, LICENSES_COLLECTION, cleanKey);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as CloudLicenseRecord;
    }

    const q = query(collection(db, LICENSES_COLLECTION), where('key', '==', cleanKey));
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
      return querySnap.docs[0].data() as CloudLicenseRecord;
    }
  } catch (err) {
    console.warn('[Firebase Firestore] getCloudLicenseByKey error:', err);
  }
  return null;
}

/**
 * Sync and ensure device record on Firestore Cloud
 */
export async function syncDeviceToCloudFirestore(params: {
  deviceId: string;
  deviceName?: string;
  imei?: string;
  licenseKey?: string;
  plan?: string;
  role?: string;
  status?: string;
  expiresAt?: number | null;
  note?: string;
  isSuperAdmin?: boolean;
}): Promise<void> {
  if (!params.deviceId) return;
  try {
    const deviceRef = doc(db, DEVICES_COLLECTION, params.deviceId);
    const now = Date.now();
    const user = getFirebaseUser();

    await setDoc(
      deviceRef,
      {
        deviceId: params.deviceId,
        deviceName: params.deviceName || 'Web Device',
        imei: params.imei || '',
        licenseKey: params.licenseKey || '',
        plan: params.plan || 'trial',
        role: params.role || 'user',
        status: params.status || 'active',
        expiresAt: params.expiresAt ?? null,
        lastActiveAt: now,
        createdAt: now,
        userEmail: user?.email || '',
        userUid: user?.uid || '',
        note: params.note || '',
        isSuperAdmin: params.isSuperAdmin || false
      },
      { merge: true }
    );
    console.log('[Firebase Firestore] Device synced successfully:', params.deviceId);
  } catch (err) {
    console.warn('[Firebase Firestore] syncDeviceToCloudFirestore error:', err);
  }
}

/**
 * Direct Cloud Firestore License & Device Verification (Cloud-Authoritative)
 * Checks both the device record in Firestore and any bound license key.
 */
export async function verifyDeviceLicenseWithFirestore(
  deviceInfo: DeviceInfo
): Promise<ResolvedCloudLicenseState | null> {
  try {
    const devId = deviceInfo.deviceId;
    const currentImei = getSavedUserImei() || deviceInfo.imei || '';
    const now = Date.now();

    // 1. Check if device exists in Firestore `devices/{deviceId}`
    const devDocRef = doc(db, DEVICES_COLLECTION, devId);
    const devSnap = await getDoc(devDocRef);

    if (devSnap.exists()) {
      const devData = devSnap.data() as CloudDeviceRecord;

      // Update last active in background
      setDoc(devDocRef, { lastActiveAt: now }, { merge: true }).catch(() => {});

      // Check if device has an active licenseKey
      if (devData.licenseKey) {
        const licRecord = await getCloudLicenseByKey(devData.licenseKey);
        if (licRecord && (licRecord.status === 'active' || !licRecord.status)) {
          const isExpired = licRecord.expiresAt ? now > licRecord.expiresAt : false;
          if (!isExpired) {
            let remainingDays: number | undefined = undefined;
            if (licRecord.expiresAt) {
              remainingDays = Math.max(0, Math.ceil((licRecord.expiresAt - now) / (24 * 60 * 60 * 1000)));
            }

            const isAdmin = licRecord.role === 'admin' || devData.role === 'admin' || devData.isSuperAdmin === true;

            return {
              isPro: true,
              isAdmin,
              plan: licRecord.plan || (devData.plan as any) || 'lifetime',
              role: (licRecord.role || devData.role || 'user') as any,
              key: licRecord.key,
              status: 'active',
              expiresAt: licRecord.expiresAt,
              remainingDays,
              maxDevices: licRecord.maxDevices || 2,
              activatedCount: licRecord.activatedDevices?.length || 1,
              note: licRecord.note || devData.note,
              deviceId: devId,
              imei: currentImei || devData.imei,
              isWhitelistedAdmin: isAdmin,
              cloudSynced: true
            };
          }
        }
      }

      // Check if device was directly granted Pro/Admin/VIP in Firestore devices collection
      if (devData.status === 'active' && (devData.plan === 'lifetime' || devData.plan === 'month' || devData.plan === 'quarter' || devData.plan === 'year' || devData.plan === 'admin')) {
        const isExpired = devData.expiresAt ? now > devData.expiresAt : false;
        if (!isExpired) {
          let remainingDays: number | undefined = undefined;
          if (devData.expiresAt) {
            remainingDays = Math.max(0, Math.ceil((devData.expiresAt - now) / (24 * 60 * 60 * 1000)));
          }
          const isAdmin = devData.role === 'admin' || devData.plan === 'admin' || devData.isSuperAdmin === true;

          return {
            isPro: true,
            isAdmin,
            plan: (devData.plan as any) || 'lifetime',
            role: (devData.role as any) || (isAdmin ? 'admin' : 'pro'),
            key: devData.licenseKey || 'CLOUD-BUFF-ACTIVE',
            status: 'active',
            expiresAt: devData.expiresAt ?? null,
            remainingDays,
            maxDevices: 2,
            activatedCount: 1,
            note: devData.note || 'Cấp quyền trực tiếp qua Firebase Cloud Firestore',
            deviceId: devId,
            imei: currentImei || devData.imei,
            isWhitelistedAdmin: isAdmin,
            cloudSynced: true
          };
        }
      }
    }
  } catch (err) {
    console.warn('[Firebase Firestore] verifyDeviceLicenseWithFirestore failed:', err);
  }

  return null;
}

/**
 * Activate a License Key in Firestore Cloud
 */
export async function activateCloudLicenseInFirestore(
  key: string,
  deviceInfo: DeviceInfo
): Promise<{ success: boolean; message: string; record?: CloudLicenseRecord }> {
  try {
    const cleanKey = key.trim().toUpperCase();
    const licRecord = await getCloudLicenseByKey(cleanKey);

    if (!licRecord) {
      return { success: false, message: 'Mã License Key không tồn tại trên hệ thống Firebase Cloud.' };
    }

    if (licRecord.status === 'revoked' || licRecord.status === 'suspended') {
      return { success: false, message: 'Mã License Key này đã bị khóa hoặc thu hồi trên Cloud.' };
    }

    if (licRecord.expiresAt && Date.now() > licRecord.expiresAt) {
      return { success: false, message: 'Mã License Key này đã hết hạn sử dụng trên Cloud.' };
    }

    const devId = deviceInfo.deviceId;
    const now = Date.now();
    const existingDevIndex = (licRecord.activatedDevices || []).findIndex((d) => d.deviceId === devId);

    if (existingDevIndex >= 0) {
      licRecord.activatedDevices[existingDevIndex].lastUsedAt = now;
    } else {
      if ((licRecord.activatedDevices || []).length >= licRecord.maxDevices) {
        return {
          success: false,
          message: `Mã này đã đạt giới hạn kích hoạt tối đa (${licRecord.maxDevices} thiết bị). Vui lòng gỡ bớt máy cũ hoặc liên hệ Admin.`,
        };
      }

      if (!licRecord.activatedDevices) {
        licRecord.activatedDevices = [];
      }

      licRecord.activatedDevices.push({
        deviceId: devId,
        deviceName: deviceInfo.deviceName || 'Web Device',
        imei: getSavedUserImei() || deviceInfo.imei || '',
        ip: '',
        activatedAt: now,
        lastUsedAt: now,
      });
    }

    // Save to Firestore
    const docRef = doc(db, LICENSES_COLLECTION, cleanKey);
    await setDoc(docRef, licRecord, { merge: true });

    // Sync device record
    await syncDeviceToCloudFirestore({
      deviceId: devId,
      deviceName: deviceInfo.deviceName,
      imei: getSavedUserImei() || deviceInfo.imei,
      licenseKey: cleanKey,
      plan: licRecord.plan,
      role: licRecord.role,
      status: licRecord.status || 'active',
      expiresAt: licRecord.expiresAt,
    });

    return {
      success: true,
      message: '✓ Kích hoạt bản quyền Firebase Cloud thành công!',
      record: licRecord,
    };
  } catch (err: any) {
    console.error('[Firebase Firestore] activateCloudLicenseInFirestore error:', err);
    return {
      success: false,
      message: 'Lỗi kích hoạt Firebase: ' + (err.message || 'Lỗi mạng'),
    };
  }
}

/**
 * Real-time Auto-Sync Cloud License Listener (Listens to Firestore live changes)
 * Automatically fires when Admin modifies or grants VIP to this device on Firebase.
 */
export function subscribeRealtimeCloudLicense(
  deviceId: string,
  onUpdate: (state: ResolvedCloudLicenseState | null) => void
): () => void {
  if (!deviceId) return () => {};

  try {
    const devDocRef = doc(db, DEVICES_COLLECTION, deviceId);

    const unsubscribe = onSnapshot(
      devDocRef,
      async (snapshot) => {
        if (snapshot.exists()) {
          const devData = snapshot.data() as CloudDeviceRecord;
          const now = Date.now();
          const currentImei = getSavedUserImei() || devData.imei || '';

          // If linked with license key, fetch that license
          if (devData.licenseKey) {
            const lic = await getCloudLicenseByKey(devData.licenseKey);
            if (lic && (lic.status === 'active' || !lic.status)) {
              const isExpired = lic.expiresAt ? now > lic.expiresAt : false;
              if (!isExpired) {
                let remainingDays: number | undefined = undefined;
                if (lic.expiresAt) {
                  remainingDays = Math.max(0, Math.ceil((lic.expiresAt - now) / (24 * 60 * 60 * 1000)));
                }
                const isAdmin = lic.role === 'admin' || devData.role === 'admin' || devData.isSuperAdmin === true;

                onUpdate({
                  isPro: true,
                  isAdmin,
                  plan: lic.plan || (devData.plan as any) || 'lifetime',
                  role: (lic.role || devData.role || 'user') as any,
                  key: lic.key,
                  status: 'active',
                  expiresAt: lic.expiresAt,
                  remainingDays,
                  maxDevices: lic.maxDevices || 2,
                  activatedCount: lic.activatedDevices?.length || 1,
                  note: lic.note || devData.note,
                  deviceId,
                  imei: currentImei,
                  isWhitelistedAdmin: isAdmin,
                  cloudSynced: true
                });
                return;
              }
            }
          }

          // Direct device grant
          if (devData.status === 'active' && (devData.plan === 'lifetime' || devData.plan === 'month' || devData.plan === 'quarter' || devData.plan === 'year' || devData.plan === 'admin')) {
            const isExpired = devData.expiresAt ? now > devData.expiresAt : false;
            if (!isExpired) {
              let remainingDays: number | undefined = undefined;
              if (devData.expiresAt) {
                remainingDays = Math.max(0, Math.ceil((devData.expiresAt - now) / (24 * 60 * 60 * 1000)));
              }
              const isAdmin = devData.role === 'admin' || devData.plan === 'admin' || devData.isSuperAdmin === true;

              onUpdate({
                isPro: true,
                isAdmin,
                plan: (devData.plan as any) || 'lifetime',
                role: (devData.role as any) || (isAdmin ? 'admin' : 'pro'),
                key: devData.licenseKey || 'CLOUD-ACTIVE',
                status: 'active',
                expiresAt: devData.expiresAt ?? null,
                remainingDays,
                maxDevices: 2,
                activatedCount: 1,
                note: devData.note || 'Cấp quyền từ xa qua Firebase Firestore',
                deviceId,
                imei: currentImei,
                isWhitelistedAdmin: isAdmin,
                cloudSynced: true
              });
              return;
            }
          }
        }
      },
      (error) => {
        console.warn('[Firebase Firestore Realtime Listener Warning]', error);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('[Firebase Firestore] subscribeRealtimeCloudLicense error:', err);
    return () => {};
  }
}

/**
 * Cloud Admin: Create or update license on Firebase Firestore
 */
export async function createCloudLicenseRecord(record: CloudLicenseRecord): Promise<void> {
  const cleanKey = record.key.trim().toUpperCase();
  const docRef = doc(db, LICENSES_COLLECTION, cleanKey);
  await setDoc(docRef, record, { merge: true });
}

/**
 * Cloud Admin: Fetch all licenses from Firestore
 */
export async function getAllCloudLicensesFromFirestore(): Promise<CloudLicenseRecord[]> {
  try {
    const q = query(collection(db, LICENSES_COLLECTION));
    const snap = await getDocs(q);
    const list: CloudLicenseRecord[] = [];
    snap.forEach((d) => {
      list.push(d.data() as CloudLicenseRecord);
    });
    return list;
  } catch (err) {
    console.warn('[Firebase Firestore] getAllCloudLicensesFromFirestore error:', err);
    return [];
  }
}

/**
 * Cloud Admin: Fetch all registered devices from Firestore
 */
export async function getAllCloudDevicesFromFirestore(): Promise<CloudDeviceRecord[]> {
  try {
    const q = query(collection(db, DEVICES_COLLECTION));
    const snap = await getDocs(q);
    const list: CloudDeviceRecord[] = [];
    snap.forEach((d) => {
      list.push(d.data() as CloudDeviceRecord);
    });
    return list;
  } catch (err) {
    console.warn('[Firebase Firestore] getAllCloudDevicesFromFirestore error:', err);
    return [];
  }
}
