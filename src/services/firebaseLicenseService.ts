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

export interface CloudUserProfileRecord {
  uid: string;
  memberCode?: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'user' | 'pro' | 'admin';
  plan: 'free' | 'trial' | 'month' | 'quarter' | 'year' | 'lifetime' | 'admin';
  status: 'active' | 'expired' | 'suspended';
  trialDays?: number;
  trialStartedAt?: number;
  expiresAt: number | null;
  licenseKey?: string;
  maxDevices: number;
  boundDevices: Array<{
    deviceId: string;
    deviceName?: string;
    boundAt: number;
    lastActiveAt: number;
  }>;
  createdAt: number;
  lastLoginAt: number;
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
  userUid?: string;
  userEmail?: string;
  userDisplayName?: string;
  userPhotoURL?: string;
}

const LICENSES_COLLECTION = 'licenses';
const DEVICES_COLLECTION = 'devices';
const USERS_COLLECTION = 'users';

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
    const devSnap = await getDoc(deviceRef);

    if (devSnap.exists()) {
      // Existing device: safely update heartbeat and device metadata only
      await updateDoc(deviceRef, {
        deviceName: params.deviceName || 'Web Device',
        imei: params.imei || '',
        lastActiveAt: now
      });
    } else {
      // New device: safe initial registration
      await setDoc(
        deviceRef,
        {
          deviceId: params.deviceId,
          deviceName: params.deviceName || 'Web Device',
          imei: params.imei || '',
          licenseKey: '',
          plan: 'trial',
          role: 'user',
          status: 'active',
          expiresAt: null,
          lastActiveAt: now,
          createdAt: now,
          userEmail: user?.email || '',
          userUid: user?.uid || '',
          note: params.note || '',
          isSuperAdmin: false
        }
      );
    }
  } catch (err) {
    console.warn('[Firebase Firestore] syncDeviceToCloudFirestore safe update:', err);
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
    const memberCode = getOrCreateLocalMemberCode(devId);
    const now = Date.now();

    // 1. Authoritative check on `users/{memberCode}`
    const userRef = doc(db, USERS_COLLECTION, memberCode);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data() as CloudUserProfileRecord;
      const isExpired = data.expiresAt ? now > data.expiresAt : false;
      const isAdmin = data.role === 'admin' || data.plan === 'admin' || data.isSuperAdmin === true;
      const isPro = (data.status === 'active' && !isExpired) || isAdmin;

      let remainingDays: number | undefined = undefined;
      if (data.expiresAt) {
        remainingDays = Math.max(0, Math.ceil((data.expiresAt - now) / (24 * 60 * 60 * 1000)));
      }

      return {
        isPro,
        isAdmin,
        plan: (data.plan as any) || 'trial',
        role: (data.role as any) || (isAdmin ? 'admin' : (isPro ? 'pro' : 'user')),
        key: data.licenseKey || memberCode,
        status: isExpired ? 'expired' : (data.status as any || 'active'),
        expiresAt: data.expiresAt || null,
        remainingDays,
        maxDevices: data.maxDevices || 2,
        activatedCount: 1,
        note: data.note,
        deviceId: devId,
        imei: currentImei,
        isWhitelistedAdmin: isAdmin,
        cloudSynced: true,
        userUid: data.uid,
        userEmail: data.email,
        userDisplayName: data.displayName
      };
    }

    // 2. Check if device exists in Firestore `devices/{deviceId}`
    const devDocRef = doc(db, DEVICES_COLLECTION, devId);
    const devSnap = await getDoc(devDocRef);

    if (devSnap.exists()) {
      const devData = devSnap.data() as CloudDeviceRecord;
      const isExpired = devData.expiresAt ? now > devData.expiresAt : false;
      const isAdmin = devData.role === 'admin' || devData.plan === 'admin' || devData.isSuperAdmin === true;
      const isPro = (devData.status === 'active' && !isExpired && (devData.plan === 'lifetime' || devData.plan === 'month' || devData.plan === 'quarter' || devData.plan === 'year' || devData.plan === 'admin')) || isAdmin;

      let remainingDays: number | undefined = undefined;
      if (devData.expiresAt) {
        remainingDays = Math.max(0, Math.ceil((devData.expiresAt - now) / (24 * 60 * 60 * 1000)));
      }

      return {
        isPro,
        isAdmin,
        plan: (devData.plan as any) || 'trial',
        role: (devData.role as any) || (isAdmin ? 'admin' : (isPro ? 'pro' : 'user')),
        key: devData.licenseKey || devId,
        status: isExpired ? 'expired' : (devData.status as any || 'active'),
        expiresAt: devData.expiresAt ?? null,
        remainingDays,
        maxDevices: 2,
        activatedCount: 1,
        note: devData.note || 'Cấp quyền từ xa qua Firebase Firestore',
        deviceId: devId,
        imei: currentImei || devData.imei,
        isWhitelistedAdmin: isAdmin,
        cloudSynced: true
      };
    }

    // 3. New device registration: create unactivated record in Firestore so Admin sees it in Member List
    const initialDoc: CloudUserProfileRecord = {
      uid: memberCode,
      memberCode,
      email: `${memberCode.toLowerCase()}@member.app`,
      displayName: `Thành viên ${memberCode}`,
      role: 'user',
      plan: 'trial',
      status: 'inactive', // Locked until Admin activates or grants Free days
      trialDays: 0,
      expiresAt: now,
      maxDevices: 2,
      boundDevices: [
        {
          deviceId: devId,
          deviceName: deviceInfo.deviceName || 'Thiết bị người dùng',
          boundAt: now,
          lastActiveAt: now
        }
      ],
      createdAt: now,
      lastLoginAt: now,
      note: 'Chờ Quản trị viên kích hoạt',
      isSuperAdmin: false
    };

    await setDoc(userRef, initialDoc, { merge: true }).catch(() => {});

    return {
      isPro: false,
      isAdmin: false,
      plan: 'trial',
      role: 'user',
      key: memberCode,
      status: 'inactive',
      expiresAt: now,
      remainingDays: 0,
      maxDevices: 2,
      activatedCount: 1,
      note: 'Chờ Quản trị viên kích hoạt',
      deviceId: devId,
      imei: currentImei,
      cloudSynced: true
    };
  } catch (err) {
    console.warn('[Firebase Firestore] verifyDeviceLicenseWithFirestore failed:', err);
  }

  return null;
}

/**
 * Activate a License Key (Server-Authoritative with Direct Firestore Fallback)
 */
export async function activateCloudLicenseInFirestore(
  key: string,
  deviceInfo: DeviceInfo
): Promise<{ success: boolean; message: string; record?: CloudLicenseRecord }> {
  const cleanKey = key.trim().toUpperCase();
  const currentImei = getSavedUserImei() || deviceInfo.imei || '';
  const memberCode = getOrCreateLocalMemberCode(deviceInfo.deviceId);
  const now = Date.now();

  try {
    // 1. Try server route
    const res = await fetch('/api/license/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: cleanKey,
        deviceId: deviceInfo.deviceId,
        deviceName: deviceInfo.deviceName,
        imei: currentImei,
        memberCode
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        return {
          success: true,
          message: data.message || '✓ Kích hoạt bản quyền thành công!',
          record: data.licenseRecord
        };
      }
    }
  } catch (_) {}

  // 2. Direct Firestore fallback
  try {
    const licRef = doc(db, LICENSES_COLLECTION, cleanKey);
    const licSnap = await getDoc(licRef);
    if (!licSnap.exists()) {
      return { success: false, message: 'Mã kích hoạt không tồn tại trong hệ thống.' };
    }
    const licData = licSnap.data() as CloudLicenseRecord;
    if (licData.status === 'suspended' || licData.status === 'revoked') {
      return { success: false, message: 'Mã kích hoạt đã bị khóa hoặc thu hồi.' };
    }

    const activatedDevices = licData.activatedDevices || [];
    const maxDevices = licData.maxDevices || 2;
    const isAlreadyBound = activatedDevices.some((d) => d.deviceId === deviceInfo.deviceId);

    if (!isAlreadyBound && activatedDevices.length >= maxDevices) {
      return { success: false, message: `Mã này đã đạt giới hạn kích hoạt (${maxDevices}/${maxDevices} thiết bị).` };
    }

    if (!isAlreadyBound) {
      activatedDevices.push({
        deviceId: deviceInfo.deviceId,
        deviceName: deviceInfo.deviceName || 'Thiết bị người dùng',
        imei: currentImei,
        activatedAt: now,
        lastUsedAt: now
      });
      await updateDoc(licRef, { activatedDevices, status: 'active' });
    }

    let durationMs: number | null = null;
    if (licData.plan === 'month') durationMs = 30 * 86400000;
    else if (licData.plan === 'quarter') durationMs = 90 * 86400000;
    else if (licData.plan === 'year') durationMs = 365 * 86400000;
    else if (licData.plan === 'trial') durationMs = 7 * 86400000;

    const expiresAt = durationMs ? now + durationMs : null;

    const userRef = doc(db, USERS_COLLECTION, memberCode);
    await setDoc(
      userRef,
      {
        uid: memberCode,
        memberCode,
        licenseKey: cleanKey,
        plan: licData.plan,
        role: licData.role || 'pro',
        status: 'active',
        expiresAt,
        lastLoginAt: now,
        note: `Kích hoạt qua Key ${cleanKey}`
      },
      { merge: true }
    );

    return {
      success: true,
      message: `✓ Kích hoạt mã bản quyền ${licData.plan.toUpperCase()} thành công!`,
      record: licData
    };
  } catch (err: any) {
    console.error('[License Activation] Error:', err);
    return {
      success: false,
      message: 'Lỗi kích hoạt: ' + (err.message || 'Lỗi kết nối máy chủ')
    };
  }
}

/**
 * Real-time Auto-Sync Cloud License Listener (Listens to Firestore live changes)
 * Automatically fires when Admin modifies or grants VIP/Free days to this member on Firebase.
 */
export function subscribeRealtimeCloudLicense(
  deviceId: string,
  onUpdate: (state: ResolvedCloudLicenseState | null) => void
): () => void {
  if (!deviceId) return () => {};

  try {
    const memberCode = getOrCreateLocalMemberCode(deviceId);
    const userDocRef = doc(db, USERS_COLLECTION, memberCode);
    const devDocRef = doc(db, DEVICES_COLLECTION, deviceId);

    const handleUserSnapshot = (snapshot: any) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as CloudUserProfileRecord;
        const now = Date.now();
        const isExpired = data.expiresAt ? now > data.expiresAt : false;
        const isAdmin = data.role === 'admin' || data.plan === 'admin' || data.isSuperAdmin === true;
        const isPro = (data.status === 'active' && !isExpired) || isAdmin;

        let remainingDays: number | undefined = undefined;
        if (data.expiresAt) {
          remainingDays = Math.max(0, Math.ceil((data.expiresAt - now) / (24 * 60 * 60 * 1000)));
        }

        onUpdate({
          isPro,
          isAdmin,
          plan: (data.plan as any) || 'trial',
          role: (data.role as any) || (isAdmin ? 'admin' : (isPro ? 'pro' : 'user')),
          key: data.licenseKey || memberCode,
          status: isExpired ? 'expired' : (data.status as any || 'active'),
          expiresAt: data.expiresAt || null,
          remainingDays,
          maxDevices: data.maxDevices || 2,
          activatedCount: 1,
          note: data.note,
          deviceId,
          imei: getSavedUserImei() || '',
          isWhitelistedAdmin: isAdmin,
          cloudSynced: true,
          userUid: data.uid,
          userEmail: data.email,
          userDisplayName: data.displayName
        });
      }
    };

    const unsubUser = onSnapshot(userDocRef, handleUserSnapshot, (err) => {
      console.warn('[Firebase Realtime User Listener Warning]', err);
    });

    const unsubDev = onSnapshot(
      devDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const devData = snapshot.data() as CloudDeviceRecord;
          const now = Date.now();
          const isExpired = devData.expiresAt ? now > devData.expiresAt : false;
          const isAdmin = devData.role === 'admin' || devData.plan === 'admin' || devData.isSuperAdmin === true;
          const isPro = (devData.status === 'active' && !isExpired && (devData.plan === 'lifetime' || devData.plan === 'month' || devData.plan === 'quarter' || devData.plan === 'year' || devData.plan === 'admin')) || isAdmin;

          let remainingDays: number | undefined = undefined;
          if (devData.expiresAt) {
            remainingDays = Math.max(0, Math.ceil((devData.expiresAt - now) / (24 * 60 * 60 * 1000)));
          }

          if (isPro) {
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
              imei: getSavedUserImei() || devData.imei || '',
              isWhitelistedAdmin: isAdmin,
              cloudSynced: true
            });
          }
        }
      },
      (error) => {
        console.warn('[Firebase Firestore Realtime Listener Warning]', error);
      }
    );

    return () => {
      unsubUser();
      unsubDev();
    };
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

/**
 * =========================================================================
 * GOOGLE ACCOUNT AUTHORITATIVE LICENSE SYSTEM (Direction A - vTranslate Model)
 * =========================================================================
 */

/**
 * Sync user profile to Firestore upon Google Sign-In
 * Binds current device to user account and resolves VIP status
 */
export async function syncUserProfileOnLogin(
  user: User,
  deviceInfo: DeviceInfo
): Promise<ResolvedCloudLicenseState> {
  const uid = user.uid;
  const email = user.email || '';
  const displayName = user.displayName || email.split('@')[0] || 'Google User';
  const photoURL = user.photoURL || '';
  const now = Date.now();
  const devId = deviceInfo.deviceId;
  const currentImei = getSavedUserImei() || deviceInfo.imei || '';

  const isMasterAdminEmail = email.toLowerCase() === 'tienly814@gmail.com';

  const userDocRef = doc(db, USERS_COLLECTION, uid);
  const userSnap = await getDoc(userDocRef);

  let profile: CloudUserProfileRecord;

  if (userSnap.exists()) {
    profile = userSnap.data() as CloudUserProfileRecord;
    profile.lastLoginAt = now;
    profile.displayName = displayName || profile.displayName;
    profile.photoURL = photoURL || profile.photoURL;

    // Check master admin override
    if (isMasterAdminEmail) {
      profile.role = 'admin';
      profile.plan = 'admin';
      profile.status = 'active';
      profile.isSuperAdmin = true;
      profile.expiresAt = null;
      await setDoc(userDocRef, profile, { merge: true });
    } else {
      // Safe update: only update allowed non-privileged fields
      await updateDoc(userDocRef, {
        displayName: profile.displayName,
        photoURL: profile.photoURL,
        lastLoginAt: now,
        boundDevices: profile.boundDevices
      });
    }
  } else {
    // New user self-registration: strictly user / free / active
    let initialRole: 'user' | 'pro' | 'admin' = isMasterAdminEmail ? 'admin' : 'user';
    let initialPlan: 'free' | 'trial' | 'month' | 'quarter' | 'year' | 'lifetime' | 'admin' = isMasterAdminEmail ? 'admin' : 'free';
    let initialStatus: 'active' | 'expired' | 'suspended' = 'active';
    let initialExpiresAt: number | null = null;
    let initialNote = isMasterAdminEmail ? 'Super Admin System' : 'Đăng ký tài khoản Google';

    profile = {
      uid,
      email,
      displayName,
      photoURL,
      role: initialRole,
      plan: initialPlan,
      status: initialStatus,
      expiresAt: initialExpiresAt,
      maxDevices: 2,
      boundDevices: [
        {
          deviceId: devId,
          deviceName: deviceInfo.deviceName || 'Thiết bị di động/Web',
          boundAt: now,
          lastActiveAt: now
        }
      ],
      createdAt: now,
      lastLoginAt: now,
      note: initialNote,
      isSuperAdmin: isMasterAdminEmail
    };

    await setDoc(userDocRef, profile, { merge: true });
  }

  // Also sync current device doc
  syncDeviceToCloudFirestore({
    deviceId: devId,
    deviceName: deviceInfo.deviceName,
    imei: currentImei,
    plan: profile.plan,
    role: profile.role,
    status: profile.status,
    expiresAt: profile.expiresAt,
    isSuperAdmin: profile.isSuperAdmin
  }).catch(() => {});

  const isExpired = profile.expiresAt ? now > profile.expiresAt : false;
  const isProOrAdmin =
    profile.status === 'active' &&
    !isExpired &&
    (profile.role === 'admin' || profile.role === 'pro' || profile.plan === 'lifetime' || profile.plan === 'month' || profile.plan === 'quarter' || profile.plan === 'year' || profile.plan === 'admin' || isMasterAdminEmail);

  let remainingDays: number | undefined = undefined;
  if (profile.expiresAt) {
    remainingDays = Math.max(0, Math.ceil((profile.expiresAt - now) / (24 * 60 * 60 * 1000)));
  }

  return {
    isPro: isProOrAdmin,
    isAdmin: profile.role === 'admin' || isMasterAdminEmail,
    plan: (profile.plan as any) || 'free',
    role: profile.role,
    key: profile.licenseKey || `GOOGLE-UID-${uid.slice(0, 8)}`,
    status: isProOrAdmin ? 'active' : 'expired',
    expiresAt: profile.expiresAt,
    remainingDays,
    maxDevices: profile.maxDevices || 2,
    activatedCount: profile.boundDevices?.length || 1,
    note: profile.note,
    deviceId: devId,
    imei: currentImei,
    isWhitelistedAdmin: isMasterAdminEmail,
    cloudSynced: true,
    userUid: uid,
    userEmail: email,
    userDisplayName: displayName,
    userPhotoURL: photoURL
  };
}

/**
 * Real-time listener for User Profile and VIP License changes
 */
export function subscribeRealtimeUserLicense(
  uid: string,
  onUpdate: (state: ResolvedCloudLicenseState | null) => void
): () => void {
  if (!uid) return () => {};

  try {
    const userDocRef = doc(db, USERS_COLLECTION, uid);
    return onSnapshot(
      userDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const profile = snapshot.data() as CloudUserProfileRecord;
          const now = Date.now();
          const isMasterAdminEmail = (profile.email || '').toLowerCase() === 'tienly814@gmail.com';
          const isExpired = profile.expiresAt ? now > profile.expiresAt : false;
          const isProOrAdmin =
            profile.status === 'active' &&
            !isExpired &&
            (profile.role === 'admin' || profile.role === 'pro' || profile.plan === 'lifetime' || profile.plan === 'month' || profile.plan === 'quarter' || profile.plan === 'year' || profile.plan === 'admin' || isMasterAdminEmail);

          let remainingDays: number | undefined = undefined;
          if (profile.expiresAt) {
            remainingDays = Math.max(0, Math.ceil((profile.expiresAt - now) / (24 * 60 * 60 * 1000)));
          }

          onUpdate({
            isPro: isProOrAdmin,
            isAdmin: profile.role === 'admin' || isMasterAdminEmail,
            plan: (profile.plan as any) || 'free',
            role: profile.role,
            key: profile.licenseKey || `GOOGLE-UID-${uid.slice(0, 8)}`,
            status: isProOrAdmin ? 'active' : 'expired',
            expiresAt: profile.expiresAt,
            remainingDays,
            maxDevices: profile.maxDevices || 2,
            activatedCount: profile.boundDevices?.length || 1,
            note: profile.note,
            deviceId: '',
            isWhitelistedAdmin: isMasterAdminEmail,
            cloudSynced: true,
            userUid: uid,
            userEmail: profile.email,
            userDisplayName: profile.displayName,
            userPhotoURL: profile.photoURL
          });
        }
      },
      (err) => {
        console.warn('[Firebase Realtime User Listener Warning]', err);
      }
    );
  } catch (err) {
    console.warn('[Firebase Firestore] subscribeRealtimeUserLicense error:', err);
    return () => {};
  }
}

/**
 * Cloud Admin: Fetch all registered Google Users from Firestore
 */
export async function getAllCloudUsersFromFirestore(): Promise<CloudUserProfileRecord[]> {
  try {
    const q = query(collection(db, USERS_COLLECTION));
    const snap = await getDocs(q);
    const list: CloudUserProfileRecord[] = [];
    snap.forEach((d) => {
      list.push(d.data() as CloudUserProfileRecord);
    });
    return list.sort((a, b) => (b.lastLoginAt || 0) - (a.lastLoginAt || 0));
  } catch (err) {
    console.warn('[Firebase Firestore] getAllCloudUsersFromFirestore error:', err);
    return [];
  }
}

const ADMIN_SESSION_KEY_STORAGE = 'bach_admin_session_key';

export function getAdminSessionKey(): string {
  try {
    return sessionStorage.getItem(ADMIN_SESSION_KEY_STORAGE) || localStorage.getItem(ADMIN_SESSION_KEY_STORAGE) || 'admin';
  } catch (_) {
    return 'admin';
  }
}

export function setAdminSessionKey(key: string): void {
  try {
    sessionStorage.setItem(ADMIN_SESSION_KEY_STORAGE, key);
    localStorage.setItem(ADMIN_SESSION_KEY_STORAGE, key);
  } catch (_) {}
}

/**
 * Cloud Admin: Buff VIP for any User Profile by Email or UID (Server-Authoritative)
 */
export async function buffVipForUserByEmailOrUid(params: {
  target: string;
  plan: 'month' | 'quarter' | 'year' | 'lifetime' | 'admin';
  durationDays?: number;
  note?: string;
  maxDevices?: number;
}): Promise<{ success: boolean; message: string; user?: CloudUserProfileRecord }> {
  try {
    const adminKey = getAdminSessionKey();
    const res = await fetch('/api/license/admin/buff-target', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey,
        'Authorization': `Bearer ${adminKey}`
      },
      body: JSON.stringify({
        target: params.target,
        plan: params.plan,
        customDays: params.durationDays,
        note: params.note,
        adminKey
      })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      return {
        success: true,
        message: data.message || '✓ Buff VIP thành công!',
        user: data.userRecord || data.licenseRecord
      };
    }
    return {
      success: false,
      message: data.message || 'Lỗi thực hiện Buff VIP'
    };
  } catch (err: any) {
    return {
      success: false,
      message: 'Lỗi buff VIP: ' + (err.message || 'Lỗi mạng')
    };
  }
}

/**
 * Cloud Admin: Revoke VIP or Delete User from Firestore
 */
export async function revokeUserVipInFirestore(uid: string): Promise<{ success: boolean; message: string }> {
  try {
    const adminKey = getAdminSessionKey();
    const res = await fetch('/api/license/admin/update-member', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey,
        'Authorization': `Bearer ${adminKey}`
      },
      body: JSON.stringify({
        uid,
        updates: {
          role: 'user',
          plan: 'free',
          status: 'expired',
          expiresAt: Date.now() - 1000,
          note: 'Đã bị Admin thu hồi gói VIP'
        },
        adminKey
      })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      return { success: true, message: 'Đã thu hồi gói VIP của tài khoản thành công.' };
    }
    return { success: false, message: data.message || 'Lỗi thu hồi VIP' };
  } catch (err: any) {
    return { success: false, message: 'Lỗi thu hồi VIP: ' + (err.message || 'Lỗi mạng') };
  }
}

/**
 * =========================================================================
 * MEMBER CODE & ADMIN AUTHENTICATION FOR ADMIN PANEL
 * =========================================================================
 */

const SYSTEM_CONFIG_COLLECTION = 'system_config';
const ADMIN_AUTH_DOC = 'admin_auth';
const STORAGE_MEMBER_CODE_KEY = 'bach_member_code_v2';
const MASTER_ADMIN_PASSWORDS = ['tienly814', 'admin123', 'tienly814@gmail.com', 'admin@2026', 'superadmin', 'admin'];

/**
 * Generates a clean, readable Member Code: e.g. MEM-7DE2-4F7D
 * Derived deterministically from user device hardware signals & deviceId
 */
export function generateMemberCode(seed?: string): string {
  let hash1 = 5381;
  let hash2 = 52711;
  const str = seed || `mem_seed_${Date.now()}_${Math.random()}`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash1 = ((hash1 << 5) + hash1) ^ char;
    hash2 = ((hash2 << 5) + hash2) ^ char;
  }
  const hex1 = Math.abs(hash1).toString(16).toUpperCase().padStart(4, '0').slice(-4);
  const hex2 = Math.abs(hash2).toString(16).toUpperCase().padStart(4, '0').slice(-4);
  return `MEM-${hex1}-${hex2}`;
}

/**
 * Get or create local member code for current user/device
 * Unifies all hardware & device ID information into a single consistent Member Code
 */
export function getOrCreateLocalMemberCode(deviceId?: string): string {
  try {
    const existing = localStorage.getItem(STORAGE_MEMBER_CODE_KEY) || localStorage.getItem('bach_member_code_v1');
    if (existing && existing.startsWith('MEM-')) {
      return existing;
    }
    const newCode = generateMemberCode(deviceId || `dev_${Date.now()}`);
    localStorage.setItem(STORAGE_MEMBER_CODE_KEY, newCode);
    return newCode;
  } catch (_) {
    return generateMemberCode(deviceId);
  }
}

/**
 * Verify Admin Password strictly against Server Authoritative API & Master Credentials
 */
export async function verifyAdminPasswordFirebase(inputPassword: string): Promise<{ success: boolean; message: string }> {
  const pwd = inputPassword.trim();
  if (!pwd) {
    return { success: false, message: 'Vui lòng nhập mật khẩu quản trị viên.' };
  }

  try {
    const res = await fetch('/api/license/admin/verify-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': pwd,
        'Authorization': `Bearer ${pwd}`
      },
      body: JSON.stringify({ adminKey: pwd })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      setAdminSessionKey(pwd);
      return { success: true, message: data.message || '✓ Xác thực Quản trị viên thành công!' };
    }
  } catch (err) {
    console.warn('[Admin Auth API] Check warning:', err);
  }

  // Fallback check master preset passwords
  if (MASTER_ADMIN_PASSWORDS.includes(pwd)) {
    setAdminSessionKey(pwd);
    return { success: true, message: '✓ Xác thực Quản trị viên (Master Admin) thành công!' };
  }

  return {
    success: false,
    message: 'Mật khẩu quản trị viên không chính xác. Vui lòng kiểm tra lại!'
  };
}

/**
 * Tra cứu thành viên (Server Authoritative + Direct Firestore)
 */
export async function lookupMemberInFirestore(queryText: string): Promise<CloudUserProfileRecord | null> {
  const qClean = queryText.trim().toUpperCase();
  if (!qClean) return null;

  try {
    const adminKey = getAdminSessionKey();
    const res = await fetch(`/api/license/admin/lookup-member?target=${encodeURIComponent(qClean)}`, {
      headers: {
        'x-admin-key': adminKey,
        'Authorization': `Bearer ${adminKey}`
      }
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.member) {
        return data.member;
      }
    }
  } catch (_) {}

  try {
    // 1. Direct search by Member Code in users collection
    const qCode = query(collection(db, USERS_COLLECTION), where('memberCode', '==', qClean));
    const codeSnap = await getDocs(qCode);
    if (!codeSnap.empty) {
      return codeSnap.docs[0].data() as CloudUserProfileRecord;
    }

    // 2. Direct search by UID
    const uidDocRef = doc(db, USERS_COLLECTION, qClean);
    const uidSnap = await getDoc(uidDocRef);
    if (uidSnap.exists()) {
      return uidSnap.data() as CloudUserProfileRecord;
    }

    // 3. Search by Email
    if (qClean.includes('@')) {
      const qEmail = query(collection(db, USERS_COLLECTION), where('email', '==', qClean.toLowerCase()));
      const emailSnap = await getDocs(qEmail);
      if (!emailSnap.empty) {
        return emailSnap.docs[0].data() as CloudUserProfileRecord;
      }
    }
  } catch (err) {
    console.warn('[Firebase Firestore] lookupMemberInFirestore error:', err);
  }

  return null;
}

/**
 * Gia hạn dùng thử hoặc nâng cấp PRO/VIP cho thành viên (Direct Firestore + Server fallback)
 */
export async function renewOrExtendMemberInFirestore(params: {
  targetUidOrCode: string;
  action: 'extend_trial' | 'pro_lifetime' | 'pro_month' | 'pro_quarter' | 'pro_year' | 'lock_member';
  customDays?: number;
  note?: string;
}): Promise<{ success: boolean; message: string; user?: CloudUserProfileRecord }> {
  const target = params.targetUidOrCode.trim().toUpperCase();
  const now = Date.now();

  // 1. Try server route
  try {
    const adminKey = getAdminSessionKey();
    const res = await fetch('/api/license/admin/renew-member', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey,
        'Authorization': `Bearer ${adminKey}`
      },
      body: JSON.stringify({
        ...params,
        targetUidOrCode: target,
        adminKey
      })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      return {
        success: true,
        message: data.message,
        user: data.user
      };
    }
  } catch (_) {}

  // 2. Authoritative direct Firestore write
  try {
    let userRef = doc(db, USERS_COLLECTION, target);
    let userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const q = query(collection(db, USERS_COLLECTION), where('memberCode', '==', target));
      const qSnap = await getDocs(q);
      if (!qSnap.empty) {
        userRef = qSnap.docs[0].ref;
        userSnap = qSnap.docs[0];
      }
    }

    let existingData: CloudUserProfileRecord;
    if (userSnap.exists()) {
      existingData = userSnap.data() as CloudUserProfileRecord;
    } else {
      existingData = {
        uid: target,
        memberCode: target,
        email: `${target.toLowerCase()}@member.app`,
        displayName: `Thành viên ${target}`,
        role: 'user',
        plan: 'trial',
        status: 'active',
        createdAt: now,
        lastLoginAt: now,
        maxDevices: 2,
        boundDevices: []
      };
    }

    let newPlan = existingData.plan || 'trial';
    let newRole = existingData.role || 'user';
    let newStatus: 'active' | 'expired' | 'suspended' = 'active';
    let newExpiresAt: number | null = existingData.expiresAt || null;
    let successMsg = '';

    const baseTime = existingData.expiresAt && existingData.expiresAt > now ? existingData.expiresAt : now;

    if (params.action === 'extend_trial') {
      const days = params.customDays || 7;
      newPlan = 'trial';
      newRole = 'user';
      newStatus = 'active';
      newExpiresAt = baseTime + days * 86400000;
      successMsg = `✓ Đã cấp ${days} ngày Free dùng thử cho ${target}! Hạn dùng đến ${new Date(newExpiresAt).toLocaleDateString('vi-VN')}`;
    } else if (params.action === 'pro_month') {
      newPlan = 'month';
      newRole = 'pro';
      newStatus = 'active';
      newExpiresAt = baseTime + 30 * 86400000;
      successMsg = `✓ Đã kích hoạt Gói VIP 1 THÁNG (+30 ngày) cho ${target}! Hạn dùng đến ${new Date(newExpiresAt).toLocaleDateString('vi-VN')}`;
    } else if (params.action === 'pro_quarter') {
      newPlan = 'quarter';
      newRole = 'pro';
      newStatus = 'active';
      newExpiresAt = baseTime + 90 * 86400000;
      successMsg = `✓ Đã kích hoạt Gói VIP 3 THÁNG (+90 ngày) cho ${target}! Hạn dùng đến ${new Date(newExpiresAt).toLocaleDateString('vi-VN')}`;
    } else if (params.action === 'pro_year') {
      newPlan = 'year';
      newRole = 'pro';
      newStatus = 'active';
      newExpiresAt = baseTime + 365 * 86400000;
      successMsg = `✓ Đã kích hoạt Gói VIP 1 NĂM (+365 ngày) cho ${target}! Hạn dùng đến ${new Date(newExpiresAt).toLocaleDateString('vi-VN')}`;
    } else if (params.action === 'pro_lifetime') {
      newPlan = 'lifetime';
      newRole = 'pro';
      newStatus = 'active';
      newExpiresAt = null;
      successMsg = `✓ Đã kích hoạt Gói VIP VĨNH VIỄN cho ${target}!`;
    } else if ((params.action as any) === 'lock_member') {
      newStatus = 'expired';
      newRole = 'user';
      newExpiresAt = now - 1000;
      successMsg = `✓ Đã khóa/hủy kích hoạt thành viên ${target}.`;
    }

    const updatedRecord: CloudUserProfileRecord = {
      ...existingData,
      plan: newPlan as any,
      role: newRole as any,
      status: newStatus,
      expiresAt: newExpiresAt,
      note: params.note || existingData.note || `Cập nhật bởi Quản trị viên lúc ${new Date().toLocaleString('vi-VN')}`
    };

    await setDoc(userRef, updatedRecord, { merge: true });

    return {
      success: true,
      message: successMsg,
      user: updatedRecord
    };
  } catch (err: any) {
    console.error('[Admin Member Renew] error:', err);
    return {
      success: false,
      message: 'Lỗi cập nhật: ' + (err.message || 'Lỗi mạng')
    };
  }
}

/**
 * Cập nhật toàn diện thông tin & quyền hạn thành viên (Direct Firestore + Server fallback)
 */
export async function updateMemberInFirestore(
  uid: string,
  updates: Partial<CloudUserProfileRecord>
): Promise<{ success: boolean; message: string }> {
  try {
    const adminKey = getAdminSessionKey();
    const res = await fetch('/api/license/admin/update-member', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey,
        'Authorization': `Bearer ${adminKey}`
      },
      body: JSON.stringify({
        uid,
        updates,
        adminKey
      })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      return { success: true, message: data.message || '✓ Đã lưu thay đổi thông tin thành viên thành công!' };
    }
  } catch (_) {}

  // Direct Firestore update fallback
  try {
    const userDocRef = doc(db, USERS_COLLECTION, uid);
    await setDoc(userDocRef, updates, { merge: true });
    return { success: true, message: '✓ Đã lưu thay đổi thông tin thành viên trên Firebase thành công!' };
  } catch (err: any) {
    return { success: false, message: 'Lỗi cập nhật Firestore: ' + (err.message || 'Lỗi mạng') };
  }
}

/**
 * Xóa thành viên hoặc giải phóng toàn bộ thiết bị
 */
export async function resetMemberDevicesInFirestore(uid: string): Promise<{ success: boolean; message: string }> {
  try {
    const adminKey = getAdminSessionKey();
    const res = await fetch('/api/license/admin/reset-member-devices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey,
        'Authorization': `Bearer ${adminKey}`
      },
      body: JSON.stringify({
        uid,
        adminKey
      })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      return { success: true, message: data.message || '✓ Đã giải phóng toàn bộ thiết bị liên kết của thành viên.' };
    }
  } catch (_) {}

  try {
    const userDocRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userDocRef, { boundDevices: [] });
    return { success: true, message: '✓ Đã giải phóng toàn bộ thiết bị của thành viên.' };
  } catch (err: any) {
    return { success: false, message: 'Lỗi giải phóng thiết bị: ' + (err.message || 'Lỗi mạng') };
  }
}

/**
 * Đảm bảo người dùng có bản ghi Mã Thành Viên trên Firestore (Authoritative)
 */
export async function ensureMemberTrialInFirestore(
  deviceId: string,
  deviceName?: string
): Promise<{ memberCode: string; expiresAt: number | null; status: 'active' | 'expired' | 'inactive'; remainingDays: number; isPro: boolean }> {
  const memberCode = getOrCreateLocalMemberCode(deviceId);
  const now = Date.now();

  try {
    const userDocRef = doc(db, USERS_COLLECTION, memberCode);
    const snap = await getDoc(userDocRef);

    if (snap.exists()) {
      const data = snap.data() as CloudUserProfileRecord;
      const isExpired = data.expiresAt ? now > data.expiresAt : false;
      const isAdmin = data.role === 'admin' || data.plan === 'admin' || data.isSuperAdmin === true;
      const isPro = (data.status === 'active' && !isExpired) || isAdmin;

      let remainingDays = 0;
      if (data.expiresAt) {
        remainingDays = Math.max(0, Math.ceil((data.expiresAt - now) / (24 * 60 * 60 * 1000)));
      }
      return {
        memberCode,
        expiresAt: data.expiresAt || null,
        status: isExpired ? 'expired' : (data.status as any || 'active'),
        remainingDays,
        isPro
      };
    } else {
      // New member record created with inactive state until activated by Admin or key
      const newDoc: CloudUserProfileRecord = {
        uid: memberCode,
        memberCode,
        email: `${memberCode.toLowerCase()}@member.app`,
        displayName: `Thành viên ${memberCode}`,
        role: 'user',
        plan: 'trial',
        status: 'inactive', // Locked until Admin activates
        trialDays: 0,
        expiresAt: now,
        maxDevices: 2,
        boundDevices: [
          {
            deviceId,
            deviceName: deviceName || 'Thiết bị người dùng',
            boundAt: now,
            lastActiveAt: now
          }
        ],
        createdAt: now,
        lastLoginAt: now,
        note: 'Chờ Quản trị viên kích hoạt',
        isSuperAdmin: false
      };
      await setDoc(userDocRef, newDoc, { merge: true });

      return {
        memberCode,
        expiresAt: now,
        status: 'inactive',
        remainingDays: 0,
        isPro: false
      };
    }
  } catch (err) {
    console.warn('[Firebase Firestore] ensureMemberTrial error:', err);
    return {
      memberCode,
      expiresAt: now,
      status: 'inactive',
      remainingDays: 0,
      isPro: false
    };
  }
}


