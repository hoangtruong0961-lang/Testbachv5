import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Crown,
  Sparkles,
  X,
  Search,
  Sliders,
  Users,
  Lock,
  LogOut,
  Zap,
  RefreshCw
} from 'lucide-react';
import {
  LicenseState,
  ensureAndSyncDeviceLicense,
  subscribeLicenseState
} from '../utils/licenseManager';
import { AdminAuthGate } from './admin/AdminAuthGate';
import { MemberLookupRenewTab } from './admin/MemberLookupRenewTab';
import { MemberAdjustTab } from './admin/MemberAdjustTab';
import { MemberListTab } from './admin/MemberListTab';
import { CloudUserProfileRecord } from '../services/firebaseLicenseService';

interface LicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AdminTab = 'lookup_renew' | 'adjust' | 'manage_all';

export const LicenseModal: React.FC<LicenseModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('lookup_renew');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [licenseState, setLicenseState] = useState<LicenseState | null>(null);
  const [selectedMemberForAdjust, setSelectedMemberForAdjust] = useState<CloudUserProfileRecord | null>(null);

  // Sync state and check auto admin unlock
  const syncState = async () => {
    try {
      const state = await ensureAndSyncDeviceLicense();
      setLicenseState(state);
      if (state.userEmail && state.userEmail.toLowerCase() === 'tienly814@gmail.com') {
        setIsAdminAuthenticated(true);
      }
    } catch (err) {
      console.error('[AdminPanel] sync error:', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      syncState();
    }
  }, [isOpen]);

  useEffect(() => {
    const unsub = subscribeLicenseState((newState) => {
      setLicenseState(newState);
      if (newState.userEmail && newState.userEmail.toLowerCase() === 'tienly814@gmail.com') {
        setIsAdminAuthenticated(true);
      }
    });
    return unsub;
  }, []);

  const handleSelectMemberForAdjust = (m: CloudUserProfileRecord) => {
    setSelectedMemberForAdjust(m);
    setActiveTab('adjust');
  };

  if (!isOpen) return null;

  return (
    <div
      id="admin-panel-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="admin-panel-modal-container"
        className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 text-slate-100 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-md shadow-amber-500/10">
              <Crown className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-extrabold text-white tracking-tight truncate">
                  Admin Control Panel
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wide flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>SUPER ADMIN</span>
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                Bảng quản trị hệ thống thành viên & bản quyền đám mây Firebase
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {isAdminAuthenticated && (
              <button
                type="button"
                onClick={() => setIsAdminAuthenticated(false)}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition flex items-center gap-1 cursor-pointer"
                title="Khóa Admin Panel"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Khóa Admin</span>
              </button>
            )}
            <button
              id="admin-panel-close-btn"
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SUB-TABS (When Authenticated) */}
        {isAdminAuthenticated && (
          <div className="flex items-center gap-1 px-3 sm:px-6 py-2 bg-slate-950 border-b border-slate-800 overflow-x-auto shrink-0 no-scrollbar">
            <button
              id="admin-tab-lookup"
              type="button"
              onClick={() => setActiveTab('lookup_renew')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap min-h-[38px] ${
                activeTab === 'lookup_renew'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Tra Cứu & Cấp VIP</span>
            </button>

            <button
              id="admin-tab-adjust"
              type="button"
              onClick={() => setActiveTab('adjust')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap min-h-[38px] ${
                activeTab === 'adjust'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Điều Chỉnh Quyền Hạn</span>
            </button>

            <button
              id="admin-tab-manage"
              type="button"
              onClick={() => setActiveTab('manage_all')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition whitespace-nowrap min-h-[38px] ${
                activeTab === 'manage_all'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Danh Sách Thành Viên</span>
            </button>
          </div>
        )}

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 bg-slate-900">
          {!isAdminAuthenticated ? (
            <AdminAuthGate
              onSuccess={() => setIsAdminAuthenticated(true)}
              onCancel={onClose}
            />
          ) : (
            <div>
              {activeTab === 'lookup_renew' && (
                <MemberLookupRenewTab onSelectForAdjust={handleSelectMemberForAdjust} />
              )}
              {activeTab === 'adjust' && (
                <MemberAdjustTab initialMember={selectedMemberForAdjust} />
              )}
              {activeTab === 'manage_all' && (
                <MemberListTab onSelectMemberForAdjust={handleSelectMemberForAdjust} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
