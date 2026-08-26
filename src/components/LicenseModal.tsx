import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Key,
  Crown,
  Sparkles,
  Copy,
  Check,
  X,
  RefreshCw,
  Laptop,
  Smartphone,
  Calendar,
  Layers,
  AlertCircle,
  Plus,
  Trash2,
  Lock,
  Unlock,
  Zap,
  Server,
  UserCheck,
  Search,
  Download,
  Flame,
  Activity,
  CheckCircle2,
  XCircle,
  Sliders,
  Cloud,
  Globe,
  LogIn,
  LogOut,
  User
} from 'lucide-react';
import {
  LicenseState,
  getCurrentLicenseState,
  getStoredLicenseToken
} from '../utils/licenseManager';
import { getDeviceFingerprint, DeviceInfo } from '../utils/deviceFingerprint';
import {
  initFirebaseAuthListener,
  signInWithGoogle,
  logOutFirebase,
  getFirebaseUser,
  createCloudLicenseRecord,
  syncDeviceToCloudFirestore,
  getAllCloudLicensesFromFirestore,
  getAllCloudDevicesFromFirestore,
  CloudLicenseRecord,
  CloudDeviceRecord
} from '../services/firebaseLicenseService';
import type { User as FirebaseUser } from '../firebase';

interface LicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AdminKeyItem {
  id: string;
  key: string;
  plan: string;
  role: string;
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
  status: string;
  note?: string;
}

interface ConnectedDeviceItem {
  deviceId: string;
  deviceName?: string;
  imei?: string;
  ip?: string;
  activatedAt: number;
  lastUsedAt: number;
  licenseKey: string;
  plan: string;
  role: string;
  status: string;
  expiresAt: number | null;
  isSuperAdmin: boolean;
  note?: string;
}

export const LicenseModal: React.FC<LicenseModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'buff' | 'devices' | 'keys' | 'cloud' | 'info'>('buff');
  const [licenseState, setLicenseState] = useState<LicenseState | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Firebase Auth & Cloud States
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [isSyncingCloud, setIsSyncingCloud] = useState<boolean>(false);
  const [cloudLicensesList, setCloudLicensesList] = useState<CloudLicenseRecord[]>([]);
  const [cloudDevicesList, setCloudDevicesList] = useState<CloudDeviceRecord[]>([]);
  const [isLoadingCloud, setIsLoadingCloud] = useState<boolean>(false);

  // Buff Target State
  const [buffTarget, setBuffTarget] = useState<string>('');
  const [buffPlan, setBuffPlan] = useState<'month' | 'quarter' | 'year' | 'lifetime' | 'admin'>('lifetime');
  const [buffCustomDays, setBuffCustomDays] = useState<string>('');
  const [buffNote, setBuffNote] = useState<string>('');
  const [isBuffing, setIsBuffing] = useState<boolean>(false);
  const [buffResult, setBuffResult] = useState<any | null>(null);

  // Connected Devices List State
  const [devicesList, setDevicesList] = useState<ConnectedDeviceItem[]>([]);
  const [isLoadingDevices, setIsLoadingDevices] = useState<boolean>(false);
  const [searchDeviceQuery, setSearchDeviceQuery] = useState<string>('');

  // Keys List State
  const [adminKeysList, setAdminKeysList] = useState<AdminKeyItem[]>([]);
  const [isLoadingKeys, setIsLoadingKeys] = useState<boolean>(false);
  const [searchKeyQuery, setSearchKeyQuery] = useState<string>('');

  // Key Generator State
  const [genPlan, setGenPlan] = useState<'month' | 'quarter' | 'year' | 'lifetime' | 'admin'>('month');
  const [genMaxDevices, setGenMaxDevices] = useState<number>(2);
  const [genCustomerNote, setGenCustomerNote] = useState<string>('');
  const [genCount, setGenCount] = useState<number>(1);
  const [createdKeysResult, setCreatedKeysResult] = useState<AdminKeyItem[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  useEffect(() => {
    // Listen to Firebase Auth
    const unsubAuth = initFirebaseAuthListener((user) => {
      setFirebaseUser(user);
    });

    return () => {
      unsubAuth();
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadInitialData();
    }
  }, [isOpen]);

  const loadInitialData = async () => {
    const dev = await getDeviceFingerprint();
    setDeviceInfo(dev);
    const state = await getCurrentLicenseState();
    setLicenseState(state);

    if (state.isAdmin) {
      loadConnectedDevices();
      loadAdminKeys();
      loadCloudData();
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setStatusMessage(null);
    try {
      const user = await signInWithGoogle();
      if (user) {
        setFirebaseUser(user);
        setStatusMessage({
          type: 'success',
          text: `Đăng nhập Google thành công: ${user.displayName || user.email}`
        });

        // Mirror device to Firestore
        if (deviceInfo && licenseState) {
          await syncDeviceToCloudFirestore({
            deviceId: deviceInfo.deviceId,
            deviceName: deviceInfo.deviceName,
            imei: deviceInfo.imei,
            licenseKey: licenseState.key,
            plan: licenseState.plan,
            role: licenseState.role,
            status: licenseState.status,
            expiresAt: licenseState.expiresAt
          });
        }
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Lỗi đăng nhập Google: ' + err.message });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogout = async () => {
    try {
      await logOutFirebase();
      setFirebaseUser(null);
      setStatusMessage({ type: 'info', text: 'Đã đăng xuất tài khoản Google khỏi Firebase.' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Lỗi đăng xuất: ' + err.message });
    }
  };

  const loadCloudData = async () => {
    setIsLoadingCloud(true);
    try {
      const [licenses, devices] = await Promise.all([
        getAllCloudLicensesFromFirestore(),
        getAllCloudDevicesFromFirestore()
      ]);
      setCloudLicensesList(licenses);
      setCloudDevicesList(devices);
    } catch (err) {
      console.warn('[CloudData] Load error:', err);
    } finally {
      setIsLoadingCloud(false);
    }
  };

  const handleSyncAllToFirestore = async () => {
    setIsSyncingCloud(true);
    setStatusMessage(null);
    try {
      let syncedCount = 0;
      for (const lic of adminKeysList) {
        await createCloudLicenseRecord({
          id: lic.id,
          key: lic.key,
          plan: lic.plan as any,
          role: lic.role as any,
          maxDevices: lic.maxDevices,
          activatedDevices: lic.activatedDevices,
          createdAt: lic.createdAt,
          expiresAt: lic.expiresAt,
          status: lic.status as any,
          note: lic.note
        });
        syncedCount++;
      }

      await loadCloudData();
      setStatusMessage({
        type: 'success',
        text: `✓ Đã đồng bộ thành công ${syncedCount} License Keys lên Firebase Firestore Cloud Database!`
      });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Lỗi đồng bộ Firebase: ' + err.message });
    } finally {
      setIsSyncingCloud(false);
    }
  };

  const getAuthHeaders = (): Record<string, string> => {
    const token = licenseState?.token || getStoredLicenseToken();
    return {
      'Content-Type': 'application/json',
      'x-license-token': token
    };
  };

  const loadConnectedDevices = async () => {
    setIsLoadingDevices(true);
    try {
      const res = await fetch('/api/license/admin/list-devices', {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.devices)) {
        setDevicesList(data.devices);
      }
    } catch (err) {
      console.warn('[AdminDevices] Load error:', err);
    } finally {
      setIsLoadingDevices(false);
    }
  };

  const loadAdminKeys = async () => {
    setIsLoadingKeys(true);
    try {
      const res = await fetch('/api/license/admin/list-keys', {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.licenses)) {
        setAdminKeysList(data.licenses);
      }
    } catch (err) {
      console.warn('[AdminKeys] Load error:', err);
    } finally {
      setIsLoadingKeys(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyCustom = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Perform Buff VIP for any Target
  const handleExecuteBuff = async (targetOverride?: string, planOverride?: 'month' | 'quarter' | 'year' | 'lifetime' | 'admin') => {
    const targetToUse = (targetOverride || buffTarget).trim();
    const planToUse = planOverride || buffPlan;

    if (!targetToUse) {
      setStatusMessage({ type: 'error', text: 'Vui lòng nhập Device ID, IMEI, IP hoặc Key để Buff VIP.' });
      return;
    }

    setIsBuffing(true);
    setStatusMessage(null);
    setBuffResult(null);

    try {
      const res = await fetch('/api/license/admin/buff-target', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          target: targetToUse,
          plan: planToUse,
          customDays: buffCustomDays ? parseInt(buffCustomDays) : undefined,
          note: buffNote.trim() || undefined
        })
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage({ type: 'success', text: data.message });
        setBuffResult(data.license);
        loadConnectedDevices();
        loadAdminKeys();

        // Also sync target device or key directly to Firebase Firestore
        if (data.license) {
          createCloudLicenseRecord({
            id: data.license.id || data.license.key,
            key: data.license.key,
            plan: data.license.plan,
            role: data.license.role,
            maxDevices: data.license.maxDevices || 2,
            activatedDevices: data.license.activatedDevices || [],
            createdAt: data.license.createdAt || Date.now(),
            expiresAt: data.license.expiresAt,
            status: data.license.status || 'active',
            note: data.license.note
          }).catch(() => {});
        }

        // If target looks like a device ID, update device doc in Firestore
        if (targetToUse.startsWith('WEB-') || targetToUse.startsWith('DEV-')) {
          syncDeviceToCloudFirestore({
            deviceId: targetToUse,
            plan: planToUse,
            role: planToUse === 'admin' ? 'admin' : 'pro',
            status: 'active',
            expiresAt: data.license?.expiresAt,
            note: buffNote.trim() || 'Buff từ Admin Panel'
          }).catch(() => {});
        }

        loadCloudData();
      } else {
        setStatusMessage({ type: 'error', text: data.message || 'Buff thất bại.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Lỗi mạng khi gọi API Buff: ' + err.message });
    } finally {
      setIsBuffing(false);
    }
  };

  // Create Batch Keys
  const handleCreateKeys = async () => {
    setIsGenerating(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/license/admin/create-key', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          plan: genPlan,
          maxDevices: genMaxDevices,
          note: genCustomerNote.trim() || undefined,
          count: genCount
        })
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.keys)) {
        setCreatedKeysResult(data.keys);
        setStatusMessage({ type: 'success', text: `Đã sinh thành công ${data.keys.length} mã bản quyền mới!` });
        loadAdminKeys();

        // Push new keys to Firebase Firestore
        for (const k of data.keys) {
          createCloudLicenseRecord({
            id: k.id || k.key,
            key: k.key,
            plan: k.plan,
            role: k.role || 'pro',
            maxDevices: k.maxDevices || genMaxDevices,
            activatedDevices: [],
            createdAt: k.createdAt || Date.now(),
            expiresAt: k.expiresAt || null,
            status: 'active',
            note: k.note
          }).catch(() => {});
        }
        loadCloudData();
      } else {
        setStatusMessage({ type: 'error', text: data.message || 'Lỗi khi tạo mã.' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Lỗi server: ' + err.message });
    } finally {
      setIsGenerating(false);
    }
  };

  // Reset Devices for Key
  const handleResetDevices = async (key: string) => {
    if (!confirm(`Giải phóng toàn bộ thiết bị đang liên kết với key ${key}?`)) return;
    try {
      const res = await fetch('/api/license/admin/reset-devices', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ key })
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({ type: 'success', text: data.message });
        loadAdminKeys();
        loadConnectedDevices();
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
    }
  };

  // Revoke Key
  const handleRevokeKey = async (key: string) => {
    if (!confirm(`Thu hồi và vô hiệu hóa vĩnh viễn key ${key}?`)) return;
    try {
      const res = await fetch('/api/license/admin/revoke-key', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ key })
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({ type: 'success', text: data.message });
        loadAdminKeys();
        loadConnectedDevices();
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
    }
  };

  // Delete Key Permanently
  const handleDeleteKey = async (key: string) => {
    if (!confirm(`Xóa vĩnh viễn key ${key} khỏi hệ thống database?`)) return;
    try {
      const res = await fetch('/api/license/admin/delete-key', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ key })
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({ type: 'success', text: data.message });
        loadAdminKeys();
        loadConnectedDevices();
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
    }
  };

  const handleExportTxt = (keysToExport: AdminKeyItem[]) => {
    if (keysToExport.length === 0) return;
    const content = keysToExport
      .map(
        (k) =>
          `Key: ${k.key}\nGói: ${k.plan.toUpperCase()}\nSố máy: ${k.maxDevices}\nHạn dùng: ${
            k.expiresAt ? new Date(k.expiresAt).toLocaleDateString('vi-VN') : 'VĨNH VIỄN'
          }\nGhi chú: ${k.note || 'Không có'}\n------------------------------------------\n`
      )
      .join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BachTranslate_Keys_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  // Filtered devices
  const filteredDevices = devicesList.filter((d) => {
    if (!searchDeviceQuery.trim()) return true;
    const q = searchDeviceQuery.toLowerCase();
    return (
      d.deviceId.toLowerCase().includes(q) ||
      (d.deviceName && d.deviceName.toLowerCase().includes(q)) ||
      (d.imei && d.imei.toLowerCase().includes(q)) ||
      (d.ip && d.ip.toLowerCase().includes(q)) ||
      d.licenseKey.toLowerCase().includes(q) ||
      (d.note && d.note.toLowerCase().includes(q))
    );
  });

  // Filtered keys
  const filteredKeys = adminKeysList.filter((k) => {
    if (!searchKeyQuery.trim()) return true;
    const q = searchKeyQuery.toLowerCase();
    return (
      k.key.toLowerCase().includes(q) ||
      k.plan.toLowerCase().includes(q) ||
      (k.note && k.note.toLowerCase().includes(q)) ||
      k.activatedDevices.some((d) => d.deviceId.toLowerCase().includes(q) || (d.imei && d.imei.includes(q)))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#121217] border border-amber-500/40 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#181820] via-[#1f1a10] to-[#181820] border-b border-amber-500/30 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950">
              <Crown className="w-6 h-6 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-wide">
                  TRUNG TÂM QUẢN TRỊ ADMIN & BUFF VIP
                </h2>
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  TIEN LY AUTHORIZED
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Toàn quyền Buff VIP, cấp phép thiết bị, quản lý mã bản quyền & kiểm soát người dùng
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center px-6 pt-3 border-b border-slate-800 bg-[#15151c] gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('buff')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 cursor-pointer ${
              activeTab === 'buff'
                ? 'bg-[#1e1a12] text-amber-300 border-amber-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <span>⚡ Buff VIP Trực Tiếp</span>
          </button>

          <button
            onClick={() => setActiveTab('devices')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 cursor-pointer ${
              activeTab === 'devices'
                ? 'bg-[#1e1a12] text-amber-300 border-amber-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Smartphone className="w-4 h-4 text-sky-400" />
            <span>📱 Thiết Bị Đang Dùng ({devicesList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('keys')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 cursor-pointer ${
              activeTab === 'keys'
                ? 'bg-[#1e1a12] text-amber-300 border-amber-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Key className="w-4 h-4 text-emerald-400" />
            <span>🔑 Kho Mã & Tạo Key ({adminKeysList.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('cloud');
              loadCloudData();
            }}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 cursor-pointer ${
              activeTab === 'cloud'
                ? 'bg-[#1e1a12] text-amber-300 border-amber-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Cloud className="w-4 h-4 text-amber-400" />
            <span>☁️ Firebase Cloud Database</span>
          </button>

          <button
            onClick={() => setActiveTab('info')}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 cursor-pointer ${
              activeTab === 'info'
                ? 'bg-[#1e1a12] text-amber-300 border-amber-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>👑 Quyền Admin Của Bạn</span>
          </button>
        </div>

        {/* Notifications */}
        {statusMessage && (
          <div
            className={`mx-6 mt-4 p-3 rounded-2xl text-xs flex items-center justify-between border ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                : statusMessage.type === 'error'
                ? 'bg-rose-950/40 text-rose-300 border-rose-500/40'
                : 'bg-sky-950/40 text-sky-300 border-sky-500/40'
            }`}
          >
            <div className="flex items-center space-x-2">
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : statusMessage.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              ) : (
                <Zap className="w-4 h-4 text-sky-400 flex-shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-white ml-2">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* ============================================================ */}
          {/* TAB 1: ⚡ BUFF VIP TRỰC TIẾP */}
          {/* ============================================================ */}
          {activeTab === 'buff' && (
            <div className="space-y-6">
              <div className="bg-[#181820] border border-amber-500/30 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Flame className="w-5 h-5 text-amber-400" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      CÔNG CỤ BUFF VIP ĐA NĂNG
                    </h3>
                  </div>
                  <span className="text-[11px] text-amber-300 font-semibold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
                    Kích hoạt tức thì 1-chạm
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Nhập bất kỳ <b className="text-white">Device ID</b>, <b className="text-white">IMEI</b>, <b className="text-white">Địa chỉ IP</b>, hoặc <b className="text-white">Mã License</b> của người dùng để nâng cấp VIP ngay lập tức mà không cần họ phải thao tác gì.
                </p>

                {/* Input Target */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>Mục Tiêu Cần Buff (Device ID / IMEI / IP / Key):</span>
                    {deviceInfo && (
                      <button
                        onClick={() => setBuffTarget(deviceInfo.deviceId)}
                        className="text-[10px] text-amber-400 hover:underline cursor-pointer"
                      >
                        [Lấy Device ID máy này]
                      </button>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ví dụ: dev-7c2a9e... hoặc 868621072187630 hoặc 192.168.1.19"
                      value={buffTarget}
                      onChange={(e) => setBuffTarget(e.target.value)}
                      className="w-full bg-[#101014] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                </div>

                {/* Plan Selection Buttons */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Chọn Gói Buff:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { id: 'month', label: '1 Tháng (30 Ngày)', icon: Calendar },
                      { id: 'quarter', label: '3 Tháng (90 Ngày)', icon: Calendar },
                      { id: 'year', label: '1 Năm (365 Ngày)', icon: Sparkles },
                      { id: 'lifetime', label: '👑 Vĩnh Viễn (Lifetime)', icon: Crown },
                      { id: 'admin', label: '🛡️ Super Admin', icon: ShieldCheck }
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setBuffPlan(p.id as any);
                          setBuffCustomDays('');
                        }}
                        className={`p-3 rounded-xl text-xs font-bold text-left border transition flex flex-col justify-between cursor-pointer ${
                          buffPlan === p.id && !buffCustomDays
                            ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-400 text-amber-200 shadow-md'
                            : 'bg-[#121216] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <p.icon className="w-4 h-4 mb-2 text-amber-400" />
                        <span>{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Days & Note */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Hoặc số ngày tùy chỉnh:
                    </label>
                    <input
                      type="number"
                      placeholder="VD: 15, 60, 180..."
                      value={buffCustomDays}
                      onChange={(e) => setBuffCustomDays(e.target.value)}
                      className="w-full bg-[#101014] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      Ghi chú khách hàng (Tên/Zalo):
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Khách hàng VIP Tuấn Anh Zalo..."
                      value={buffNote}
                      onChange={(e) => setBuffNote(e.target.value)}
                      className="w-full bg-[#101014] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Execute Button */}
                <button
                  type="button"
                  onClick={() => handleExecuteBuff()}
                  disabled={isBuffing || !buffTarget.trim()}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 active:scale-95 disabled:opacity-50 text-slate-950 font-black text-xs transition shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {isBuffing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>ĐANG THỰC HIỆN BUFF VIP...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-slate-950" />
                      <span>⚡ THỰC HIỆN BUFF VIP NGAY</span>
                    </>
                  )}
                </button>
              </div>

              {/* Buff Result Card */}
              {buffResult && (
                <div className="bg-[#121814] border border-emerald-500/50 rounded-2xl p-4 space-y-3 animate-fade-in">
                  <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wide">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>KẾT QUẢ BUFF VIP THÀNH CÔNG</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-black/30 p-2.5 rounded-xl">
                      <span className="text-slate-400 block text-[10px]">License Key:</span>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="font-mono font-bold text-white">{buffResult.key}</span>
                        <button
                          onClick={() => handleCopy(buffResult.key, 'buff-res')}
                          className="text-amber-400 hover:text-amber-300 text-[10px]"
                        >
                          {copiedKey === 'buff-res' ? 'Đã chép!' : 'Copy'}
                        </button>
                      </div>
                    </div>
                    <div className="bg-black/30 p-2.5 rounded-xl">
                      <span className="text-slate-400 block text-[10px]">Gói & Hạn Sử Dụng:</span>
                      <span className="font-bold text-amber-300">
                        {buffResult.plan.toUpperCase()} •{' '}
                        {buffResult.expiresAt
                          ? new Date(buffResult.expiresAt).toLocaleDateString('vi-VN')
                          : 'VĨNH VIỄN'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: 📱 DANH SÁCH THIẾT BỊ ĐÃ KẾT NỐI */}
          {/* ============================================================ */}
          {activeTab === 'devices' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Tìm theo Device ID, IMEI, IP, Gói, Tên..."
                    value={searchDeviceQuery}
                    onChange={(e) => setSearchDeviceQuery(e.target.value)}
                    className="w-full bg-[#181820] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <button
                  onClick={loadConnectedDevices}
                  disabled={isLoadingDevices}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs text-slate-200 font-bold flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingDevices ? 'animate-spin' : ''}`} />
                  <span>Làm mới</span>
                </button>
              </div>

              {isLoadingDevices ? (
                <div className="py-12 text-center text-xs text-slate-400 flex flex-col items-center justify-center space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
                  <span>Đang tải danh sách thiết bị...</span>
                </div>
              ) : filteredDevices.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                  Chưa có thiết bị nào kết nối hoặc không tìm thấy kết quả phù hợp.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredDevices.map((dev) => (
                    <div
                      key={dev.deviceId}
                      className="bg-[#181820] border border-slate-800 hover:border-amber-500/40 rounded-2xl p-3.5 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center space-x-2 flex-wrap">
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${
                              dev.isSuperAdmin
                                ? 'bg-amber-400 text-slate-950'
                                : dev.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {dev.isSuperAdmin ? 'ADMIN' : dev.plan.toUpperCase()}
                          </span>
                          <span className="text-xs font-bold text-white font-mono truncate">
                            {dev.deviceId}
                          </span>
                          {dev.imei && (
                            <span className="text-[10px] text-amber-300 bg-amber-500/10 px-1.5 py-0.2 rounded font-mono">
                              IMEI: {dev.imei}
                            </span>
                          )}
                          {dev.ip && (
                            <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded font-mono">
                              IP: {dev.ip}
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-slate-400 flex items-center space-x-3 flex-wrap">
                          <span>Key: <b className="text-slate-300 font-mono">{dev.licenseKey}</b></span>
                          <span>
                            Hạn:{' '}
                            <b className="text-amber-300">
                              {dev.expiresAt ? new Date(dev.expiresAt).toLocaleDateString('vi-VN') : 'VĨNH VIỄN'}
                            </b>
                          </span>
                          <span>
                            Hoạt động:{' '}
                            <b className="text-slate-300">
                              {new Date(dev.lastUsedAt).toLocaleString('vi-VN')}
                            </b>
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-1.5 flex-shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => {
                            setBuffTarget(dev.deviceId);
                            setActiveTab('buff');
                          }}
                          className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-[11px] font-bold transition cursor-pointer"
                          title="Đi tới form Buff cho thiết bị này"
                        >
                          ⚡ Buff VIP
                        </button>
                        <button
                          onClick={() => handleExecuteBuff(dev.deviceId, 'lifetime')}
                          className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-[11px] font-bold transition cursor-pointer"
                          title="Buff Vĩnh Viễn ngay 1-chạm"
                        >
                          👑 Vĩnh Viễn
                        </button>
                        <button
                          onClick={() => handleRevokeKey(dev.licenseKey)}
                          className="p-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-[11px] transition cursor-pointer"
                          title="Khóa / Thu hồi key này"
                        >
                          <Lock className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 3: 🔑 KHO MÃ & TẠO KEY HÀNG LOẠT */}
          {/* ============================================================ */}
          {activeTab === 'keys' && (
            <div className="space-y-6">
              {/* Generator Box */}
              <div className="bg-[#181820] border border-emerald-500/30 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    <Plus className="w-4 h-4" />
                    <span>TẠO MÃ BẢN QUYỀN MỚI</span>
                  </div>
                  {createdKeysResult.length > 0 && (
                    <button
                      onClick={() => handleExportTxt(createdKeysResult)}
                      className="text-[11px] font-bold text-emerald-300 hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Tải file .txt ({createdKeysResult.length} key)</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Gói bản quyền:</label>
                    <select
                      value={genPlan}
                      onChange={(e) => setGenPlan(e.target.value as any)}
                      className="w-full bg-[#101014] border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                    >
                      <option value="month">1 Tháng (30 Ngày)</option>
                      <option value="quarter">3 Tháng (90 Ngày)</option>
                      <option value="year">1 Năm (365 Ngày)</option>
                      <option value="lifetime">👑 Vĩnh Viễn (Lifetime)</option>
                      <option value="admin">🛡️ Super Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Số máy tối đa:</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={genMaxDevices}
                      onChange={(e) => setGenMaxDevices(parseInt(e.target.value) || 1)}
                      className="w-full bg-[#101014] border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Số lượng tạo:</label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={genCount}
                      onChange={(e) => setGenCount(parseInt(e.target.value) || 1)}
                      className="w-full bg-[#101014] border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Ghi chú:</label>
                    <input
                      type="text"
                      placeholder="VD: Đại lý Hà Nội..."
                      value={genCustomerNote}
                      onChange={(e) => setGenCustomerNote(e.target.value)}
                      className="w-full bg-[#101014] border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCreateKeys}
                  disabled={isGenerating}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition shadow-md flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Key className="w-4 h-4" />
                  <span>{isGenerating ? 'ĐANG TẠO KEY...' : `TẠO ${genCount} KEY MỚI NGAY`}</span>
                </button>
              </div>

              {/* Search & Export All Keys */}
              <div className="flex items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Tìm theo Key, Gói, Ghi chú, Máy..."
                    value={searchKeyQuery}
                    onChange={(e) => setSearchKeyQuery(e.target.value)}
                    className="w-full bg-[#181820] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <button
                  onClick={() => handleExportTxt(filteredKeys)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Xuất Txt ({filteredKeys.length})</span>
                </button>
              </div>

              {/* Table of Keys */}
              <div className="space-y-2">
                {filteredKeys.map((k) => (
                  <div
                    key={k.id}
                    className="bg-[#181820] border border-slate-800 rounded-2xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <span className="font-mono font-bold text-white text-sm">{k.key}</span>
                        <button
                          onClick={() => handleCopy(k.key, k.id)}
                          className="text-amber-400 hover:text-amber-300"
                        >
                          {copiedKey === k.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            k.role === 'admin'
                              ? 'bg-amber-400 text-slate-950'
                              : k.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-rose-500/20 text-rose-300'
                          }`}
                        >
                          {k.plan.toUpperCase()}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {k.activatedDevices.length}/{k.maxDevices} Máy
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center space-x-3 flex-wrap">
                        <span>
                          Hết hạn:{' '}
                          <b className="text-amber-300">
                            {k.expiresAt ? new Date(k.expiresAt).toLocaleDateString('vi-VN') : 'VĨNH VIỄN'}
                          </b>
                        </span>
                        {k.note && <span>Ghi chú: {k.note}</span>}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 flex-shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => handleResetDevices(k.key)}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold transition"
                        title="Giải phóng thiết bị"
                      >
                        Reset Máy
                      </button>
                      <button
                        onClick={() => handleRevokeKey(k.key)}
                        className="px-2 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg text-[10px] font-bold transition"
                        title="Thu hồi key"
                      >
                        Khóa
                      </button>
                      <button
                        onClick={() => handleDeleteKey(k.key)}
                        className="p-1 text-slate-500 hover:text-rose-400 rounded-lg transition"
                        title="Xóa vĩnh viễn"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 4: ☁️ FIREBASE CLOUD DATABASE & GOOGLE AUTH */}
          {/* ============================================================ */}
          {activeTab === 'cloud' && (
            <div className="space-y-6">
              {/* Firebase Cloud Header Status */}
              <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/30 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 p-0.5 flex items-center justify-center text-slate-950 font-bold">
                      <Cloud className="w-6 h-6 fill-slate-950" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                          FIREBASE CLOUD FIRESTORE
                        </h3>
                        <span className="flex items-center space-x-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-0.5" />
                          <span>Connected</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Project ID: <b className="text-amber-300">gen-lang-client-0654611478</b>
                      </p>
                    </div>
                  </div>

                  {/* Sync Button */}
                  <button
                    onClick={handleSyncAllToFirestore}
                    disabled={isSyncingCloud}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-md flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isSyncingCloud ? 'animate-spin' : ''}`} />
                    <span>{isSyncingCloud ? 'Đang đồng bộ Cloud...' : 'Đồng Bộ Lên Cloud'}</span>
                  </button>
                </div>

                {/* Google Auth Integration Section */}
                <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#111115] p-3 rounded-xl">
                  <div className="flex items-center space-x-3">
                    {firebaseUser?.photoURL ? (
                      <img
                        src={firebaseUser.photoURL}
                        alt="Avatar"
                        className="w-9 h-9 rounded-full border border-amber-400/40"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      {firebaseUser ? (
                        <div>
                          <p className="text-xs font-bold text-white flex items-center space-x-1.5">
                            <span>{firebaseUser.displayName || 'Tài khoản Google'}</span>
                            <span className="text-[10px] bg-sky-500/20 text-sky-300 px-1.5 py-0.2 rounded">Google</span>
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">{firebaseUser.email}</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs font-bold text-slate-200">Liên kết tài khoản Google</p>
                          <p className="text-[11px] text-slate-400">Đăng nhập để tự động lưu & đồng bộ bản quyền của bạn</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    {firebaseUser ? (
                      <button
                        onClick={handleGoogleLogout}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Đăng Xuất</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleGoogleLogin}
                        disabled={isLoggingIn}
                        className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold rounded-lg flex items-center space-x-2 transition shadow-sm cursor-pointer disabled:opacity-50"
                      >
                        <LogIn className="w-4 h-4 text-rose-600" />
                        <span>{isLoggingIn ? 'Đang kết nối...' : 'Đăng Nhập Google'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Cloud Collections View */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Cloud className="w-4 h-4 text-sky-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Dữ Liệu Bản Quyền Trên Firebase Firestore ({cloudLicensesList.length} Bản Ghi)
                    </h4>
                  </div>
                  <button
                    onClick={loadCloudData}
                    disabled={isLoadingCloud}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center space-x-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingCloud ? 'animate-spin' : ''}`} />
                    <span>Làm mới</span>
                  </button>
                </div>

                {isLoadingCloud ? (
                  <div className="p-8 text-center text-xs text-slate-500 flex flex-col items-center justify-center space-y-2">
                    <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
                    <span>Đang tải dữ liệu từ Firestore Cloud...</span>
                  </div>
                ) : cloudLicensesList.length === 0 ? (
                  <div className="p-8 bg-[#181820] border border-slate-800 rounded-2xl text-center text-xs text-slate-400 space-y-3">
                    <p>Chưa có License nào được đồng bộ lên Firebase Cloud.</p>
                    <button
                      onClick={handleSyncAllToFirestore}
                      className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs"
                    >
                      Bấm vào đây để Đồng Bộ Tất Cả Lên Cloud Ngay
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {cloudLicensesList.map((cLic) => (
                      <div
                        key={cLic.id || cLic.key}
                        className="bg-[#181820] border border-slate-800 rounded-2xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-white text-sm">{cLic.key}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                              {cLic.plan.toUpperCase()}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {cLic.activatedDevices?.length || 0}/{cLic.maxDevices} Máy
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Hết hạn: <b className="text-amber-300">{cLic.expiresAt ? new Date(cLic.expiresAt).toLocaleDateString('vi-VN') : 'VĨNH VIỄN'}</b>
                            {cLic.note && <span className="ml-2">({cLic.note})</span>}
                          </div>
                        </div>
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          Cloud Synced
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 5: 👑 THÔNG TIN ĐẶC QUYỀN ADMIN */}
          {/* ============================================================ */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 border border-amber-400/40 rounded-2xl p-5 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-400/20">
                    <Crown className="w-7 h-7 fill-slate-950" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">TÀI KHOẢN SUPER ADMIN TOÀN QUYỀN</h3>
                    <p className="text-xs text-amber-300">
                      Chủ sở hữu: <b>Tien Ly (tienly814@gmail.com)</b>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="bg-[#121216] border border-slate-800 rounded-xl p-3 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Xác Thực Server:</span>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-emerald-400 font-bold">Đã ký số HMAC-SHA256</span>
                      <span className="text-emerald-400 text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">Hợp Lệ</span>
                    </div>
                  </div>

                  <div className="bg-[#121216] border border-slate-800 rounded-xl p-3 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Cấp Độ Bản Quyền:</span>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-amber-300 font-bold truncate pr-2">SUPER ADMIN (Vĩnh Viễn)</span>
                      <Crown className="w-4 h-4 text-amber-400" />
                    </div>
                  </div>

                  <div className="bg-[#121216] border border-slate-800 rounded-xl p-3 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Trạng Thái Admin:</span>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-white font-bold">Toàn Quyền Quản Trị Hệ Thống</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                  </div>

                  <div className="bg-[#121216] border border-slate-800 rounded-xl p-3 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Thiết Bị Kích Hoạt:</span>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-white font-bold">Vô Hạn (Không Giới Hạn)</span>
                      <Zap className="w-4 h-4 text-amber-400" />
                    </div>
                  </div>
                </div>

                {deviceInfo && (
                  <div className="bg-black/30 rounded-xl p-3 text-xs text-slate-400 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Phần Cứng Máy Hiện Tại:</span>
                    <p className="font-mono text-[11px] text-slate-300 break-all">{deviceInfo.deviceId}</p>
                    <p className="text-[10px] text-slate-400">{deviceInfo.deviceName}</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#15151c] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Hệ thống License Engine: <b>Online (Active)</b></span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition cursor-pointer"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
