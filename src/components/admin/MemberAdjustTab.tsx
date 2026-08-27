import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Search,
  Save,
  RotateCcw,
  Smartphone,
  Shield,
  CheckCircle2,
  AlertCircle,
  Loader2,
  User,
  Mail,
  Calendar,
  Sparkles,
  Crown,
  Key,
  X
} from 'lucide-react';
import {
  lookupMemberInFirestore,
  updateMemberInFirestore,
  resetMemberDevicesInFirestore,
  CloudUserProfileRecord
} from '../../services/firebaseLicenseService';

interface MemberAdjustTabProps {
  initialMember?: CloudUserProfileRecord | null;
}

export const MemberAdjustTab: React.FC<MemberAdjustTabProps> = ({ initialMember }) => {
  const [queryText, setQueryText] = useState(initialMember?.memberCode || initialMember?.email || initialMember?.uid || '');
  const [searching, setSearching] = useState(false);
  const [member, setMember] = useState<CloudUserProfileRecord | null>(initialMember || null);
  const [saving, setSaving] = useState(false);
  const [resettingDevices, setResettingDevices] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  const [role, setRole] = useState<'user' | 'pro' | 'admin'>('user');
  const [plan, setPlan] = useState<'free' | 'trial' | 'month' | 'quarter' | 'year' | 'lifetime' | 'admin'>('trial');
  const [status, setStatus] = useState<'active' | 'expired' | 'suspended'>('active');
  const [maxDevices, setMaxDevices] = useState<number>(2);
  const [isLifetime, setIsLifetime] = useState<boolean>(false);
  const [expiryDateString, setExpiryDateString] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');

  const populateFormWithMember = (m: CloudUserProfileRecord) => {
    setMember(m);
    setRole(m.role || 'user');
    setPlan(m.plan || 'trial');
    setStatus(m.status || 'active');
    setMaxDevices(m.maxDevices || 2);
    setNote(m.note || '');
    setDisplayName(m.displayName || '');
    if (m.plan === 'lifetime' || m.plan === 'admin' || !m.expiresAt) {
      setIsLifetime(true);
      setExpiryDateString('');
    } else {
      setIsLifetime(false);
      const d = new Date(m.expiresAt);
      setExpiryDateString(d.toISOString().split('T')[0]);
    }
  };

  useEffect(() => {
    if (initialMember) {
      populateFormWithMember(initialMember);
      setQueryText(initialMember.memberCode || initialMember.email || initialMember.uid);
    }
  }, [initialMember]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!queryText.trim()) return;

    setSearching(true);
    setStatusMsg(null);
    try {
      const res = await lookupMemberInFirestore(queryText.trim());
      if (res) {
        populateFormWithMember(res);
      } else {
        setMember(null);
        setStatusMsg({ type: 'error', text: `Không tìm thấy thành viên: "${queryText}"` });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: 'Lỗi tra cứu: ' + (err.message || 'Lỗi mạng') });
    } finally {
      setSearching(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;

    setSaving(true);
    setStatusMsg(null);

    let expiresAt: number | null = null;
    if (!isLifetime && expiryDateString) {
      expiresAt = new Date(expiryDateString).getTime() + (23 * 60 + 59) * 60 * 1000;
    }

    try {
      const updates: Partial<CloudUserProfileRecord> = {
        displayName,
        role,
        plan: isLifetime && plan !== 'admin' ? 'lifetime' : plan,
        status,
        maxDevices: Number(maxDevices),
        expiresAt,
        note
      };

      const res = await updateMemberInFirestore(member.uid, updates);
      if (res.success) {
        setMember({ ...member, ...updates });
        setStatusMsg({ type: 'success', text: '✓ Đã cập nhật quyền hạn và thông tin thành viên thành công lên Firebase!' });
      } else {
        setStatusMsg({ type: 'error', text: res.message });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: 'Lỗi lưu thông tin: ' + (err.message || 'Lỗi mạng') });
    } finally {
      setSaving(false);
    }
  };

  const handleResetDevices = async () => {
    if (!member) return;
    if (!confirm(`Bạn có chắc muốn giải phóng tất cả thiết bị đang liên kết của thành viên ${member.memberCode || member.email}?`)) {
      return;
    }

    setResettingDevices(true);
    setStatusMsg(null);
    try {
      const res = await resetMemberDevicesInFirestore(member.uid);
      if (res.success) {
        setMember({ ...member, boundDevices: [] });
        setStatusMsg({ type: 'success', text: '✓ Đã giải phóng toàn bộ thiết bị liên kết của thành viên.' });
      } else {
        setStatusMsg({ type: 'error', text: res.message });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: 'Lỗi reset thiết bị: ' + (err.message || 'Lỗi mạng') });
    } finally {
      setResettingDevices(false);
    }
  };

  return (
    <div id="member-adjust-tab" className="space-y-4 sm:space-y-5">
      {/* Search Target Bar */}
      <div className="p-3 sm:p-4 rounded-2xl bg-slate-850/90 border border-slate-700/80 shadow-md">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4 text-amber-400" />
            </div>
            <input
              id="member-adjust-search-input"
              type="text"
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              placeholder="Nhập Mã thành viên, Email hoặc UID cần sửa..."
              className="w-full pl-10 pr-9 py-2.5 sm:py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-xs sm:text-sm transition"
            />
            {queryText && (
              <button
                type="button"
                onClick={() => {
                  setQueryText('');
                  setMember(null);
                  setStatusMsg(null);
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            id="member-adjust-search-btn"
            type="submit"
            disabled={searching || !queryText.trim()}
            className="w-full sm:w-auto px-5 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition shadow-md shadow-amber-500/10 min-h-[44px]"
          >
            {searching ? <Loader2 className="w-4 h-4 animate-spin text-slate-950" /> : <Search className="w-4 h-4 text-slate-950" />}
            <span>Chọn Thành Viên</span>
          </button>
        </form>
      </div>

      {/* Alert Notifications */}
      {statusMsg && (
        <div
          id="member-adjust-status-msg"
          className={`p-3.5 rounded-xl flex items-center gap-2.5 text-xs sm:text-sm text-left animate-in fade-in ${
            statusMsg.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          )}
          <span className="flex-1 font-medium">{statusMsg.text}</span>
        </div>
      )}

      {/* Adjustment Form */}
      {member ? (
        <form onSubmit={handleSave} className="space-y-4">
          {/* Member Overview Box */}
          <div className="p-4 rounded-2xl bg-slate-850 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Sliders className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-white text-sm sm:text-base truncate">
                  {member.displayName || member.email || 'Thành Viên'}
                </div>
                <div className="text-xs text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                  <span className="text-amber-400">{member.memberCode || 'N/A'}</span>
                  <span>•</span>
                  <span className="truncate max-w-[180px]">{member.email || member.uid}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetDevices}
              disabled={resettingDevices}
              className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition active:scale-98 disabled:opacity-50 min-h-[40px]"
              title="Giải phóng các thiết bị đã liên kết"
            >
              {resettingDevices ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RotateCcw className="w-3.5 h-3.5" />
              )}
              <span>Giải Phóng Thiết Bị ({member.boundDevices?.length || 0})</span>
            </button>
          </div>

          {/* Form Fields Grid */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-850 border border-slate-700/80 space-y-4 shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {/* Display Name */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Tên Hiển Thị
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Ví dụ: Anh Tuấn VIP"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              {/* Role */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Vai Trò (Role)
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                  <option value="user">User (Người dùng thường)</option>
                  <option value="pro">PRO (Thành viên VIP)</option>
                  <option value="admin">Super Admin (Quản trị viên tối cao)</option>
                </select>
              </div>

              {/* Plan */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Gói Dịch Vụ (Plan)
                </label>
                <select
                  value={plan}
                  onChange={(e) => {
                    const val = e.target.value as any;
                    setPlan(val);
                    if (val === 'lifetime' || val === 'admin') {
                      setIsLifetime(true);
                    }
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                  <option value="trial">Dùng Thử (Trial)</option>
                  <option value="month">Gói 1 Tháng (Month)</option>
                  <option value="quarter">Gói 3 Tháng (Quarter)</option>
                  <option value="year">Gói 1 Năm (Year)</option>
                  <option value="lifetime">Vĩnh Viễn (Lifetime VIP)</option>
                  <option value="admin">Super Admin Vô Hạn</option>
                  <option value="free">Miễn Phí (Free)</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Trạng Thái Tài Khoản
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                  <option value="active">Active (Hoạt động bình thường)</option>
                  <option value="expired">Expired (Hết hạn)</option>
                  <option value="suspended">Suspended (Tạm khóa / Thu hồi)</option>
                </select>
              </div>

              {/* Max Devices */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Số Thiết Bị Tối Đa
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={maxDevices}
                  onChange={(e) => setMaxDevices(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              {/* Lifetime Checkbox or Date Picker */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Hạn Sử Dụng
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-amber-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isLifetime}
                      onChange={(e) => {
                        setIsLifetime(e.target.checked);
                        if (e.target.checked) {
                          setPlan('lifetime');
                        }
                      }}
                      className="rounded accent-amber-500"
                    />
                    <span>Vĩnh viễn</span>
                  </label>
                </div>
                {!isLifetime ? (
                  <input
                    type="date"
                    value={expiryDateString}
                    onChange={(e) => setExpiryDateString(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                ) : (
                  <div className="w-full px-3 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Không giới hạn thời gian (Vĩnh viễn)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Ghi Chú Quản Trị
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ghi chú về khách hàng (ví dụ: Khách mua gói năm qua Zalo)..."
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>

            {/* Submit Save Button */}
            <div className="pt-2">
              <button
                id="member-adjust-save-btn"
                type="submit"
                disabled={saving}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition disabled:opacity-50 min-h-[44px]"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Đang Lưu Thay Đổi...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-slate-950" />
                    <span>Lưu Cập Nhật Quyền Hạn Lên Firebase</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="p-8 text-center bg-slate-850 rounded-2xl border border-slate-700/60 text-slate-400">
          <Sliders className="w-8 h-8 mx-auto text-slate-500 mb-2" />
          <p className="text-xs sm:text-sm">Vui lòng tra cứu hoặc chọn một thành viên để bắt đầu điều chỉnh thông tin và quyền hạn.</p>
        </div>
      )}
    </div>
  );
};
