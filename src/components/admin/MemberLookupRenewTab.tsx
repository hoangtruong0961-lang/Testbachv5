import React, { useState } from 'react';
import {
  Search,
  Zap,
  Crown,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  User,
  Mail,
  Smartphone,
  ShieldCheck,
  Sparkles,
  Copy,
  Check,
  X,
  RefreshCw,
  Plus
} from 'lucide-react';
import {
  lookupMemberInFirestore,
  renewOrExtendMemberInFirestore,
  CloudUserProfileRecord
} from '../../services/firebaseLicenseService';

interface MemberLookupRenewTabProps {
  onSelectForAdjust?: (member: CloudUserProfileRecord) => void;
}

export const MemberLookupRenewTab: React.FC<MemberLookupRenewTabProps> = ({ onSelectForAdjust }) => {
  const [queryText, setQueryText] = useState('');
  const [searching, setSearching] = useState(false);
  const [member, setMember] = useState<CloudUserProfileRecord | null>(null);
  const [searched, setSearched] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [customDays, setCustomDays] = useState('7');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!queryText.trim()) return;

    setSearching(true);
    setStatusMsg(null);
    try {
      const res = await lookupMemberInFirestore(queryText.trim());
      setMember(res);
      setSearched(true);
      if (!res) {
        setStatusMsg({
          type: 'error',
          text: `Không tìm thấy thành viên với mã/email: "${queryText}". Bạn vẫn có thể nhấn kích hoạt nhanh bên dưới để cấp quyền mới trực tiếp!`
        });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: 'Lỗi tra cứu: ' + (err.message || 'Lỗi mạng') });
    } finally {
      setSearching(false);
    }
  };

  const handleAction = async (
    action: 'extend_trial' | 'pro_lifetime' | 'pro_month' | 'pro_quarter' | 'pro_year',
    days?: number
  ) => {
    const target = member ? member.uid : queryText.trim();
    if (!target) {
      setStatusMsg({ type: 'error', text: 'Vui lòng nhập Mã thành viên hoặc Email trước khi thao tác.' });
      return;
    }

    setActionLoading(true);
    setActiveAction(action);
    setStatusMsg(null);
    try {
      const res = await renewOrExtendMemberInFirestore({
        targetUidOrCode: target,
        action,
        customDays: days || (action === 'extend_trial' ? parseInt(customDays) || 7 : undefined)
      });

      if (res.success && res.user) {
        setMember(res.user);
        setStatusMsg({ type: 'success', text: res.message });
      } else {
        setStatusMsg({ type: 'error', text: res.message });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: 'Lỗi thực hiện: ' + (err.message || 'Lỗi mạng') });
    } finally {
      setActionLoading(false);
      setActiveAction(null);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const calculateDaysRemaining = (expiresAt: number | null | undefined) => {
    if (!expiresAt) return null;
    const diff = expiresAt - Date.now();
    if (diff <= 0) return 0;
    return Math.ceil(diff / (24 * 60 * 60 * 1000));
  };

  const isExpired = member?.expiresAt ? Date.now() > member.expiresAt : false;
  const daysLeft = member ? calculateDaysRemaining(member.expiresAt) : null;

  return (
    <div id="member-lookup-renew-tab" className="space-y-4 sm:space-y-5">
      {/* Search Input Bar */}
      <div className="p-3 sm:p-4 rounded-2xl bg-slate-850/90 border border-slate-700/80 shadow-md">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4 text-amber-400" />
            </div>
            <input
              id="member-lookup-input"
              type="text"
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              placeholder="Nhập Mã thành viên (MEM-XXXX-XXXX), Email hoặc UID..."
              className="w-full pl-10 pr-9 py-2.5 sm:py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-xs sm:text-sm transition"
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
            id="member-lookup-search-btn"
            type="submit"
            disabled={searching || !queryText.trim()}
            className="w-full sm:w-auto px-5 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition shadow-md shadow-amber-500/10 min-h-[44px]"
          >
            {searching ? <Loader2 className="w-4 h-4 animate-spin text-slate-950" /> : <Search className="w-4 h-4 text-slate-950" />}
            <span>Tra Cứu</span>
          </button>
        </form>
        <p className="text-[11px] text-slate-400 mt-2 px-1">
          ✦ Mẹo: Nhập mã thành viên hoặc email người dùng để cấp VIP, gia hạn hoặc quản lý gói cước ngay lập tức.
        </p>
      </div>

      {/* Alert Notifications */}
      {statusMsg && (
        <div
          id="member-lookup-status-msg"
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

      {/* Member Result Info Card */}
      {member && (
        <div id="member-lookup-result-card" className="p-4 sm:p-5 rounded-2xl bg-slate-850 border border-slate-700/80 shadow-lg space-y-4">
          {/* Header of Result */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/70 pb-3.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm sm:text-base font-bold text-white truncate flex items-center gap-2">
                  <span>{member.displayName || member.email || 'Thành Viên'}</span>
                </h4>
                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                  <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                    {member.plan === 'lifetime'
                      ? 'PRO VĨNH VIỄN'
                      : member.plan === 'admin'
                      ? 'SUPER ADMIN'
                      : member.plan === 'trial'
                      ? 'DÙNG THỬ'
                      : `GÓI ${member.plan.toUpperCase()}`}
                  </span>
                  <span
                    className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${
                      isExpired
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : member.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-slate-700 text-slate-300 border-slate-600'
                    }`}
                  >
                    {isExpired ? 'HẾT HẠN' : member.status === 'active' ? 'ĐANG HOẠT ĐỘNG' : 'TẠM KHÓA'}
                  </span>
                </div>
              </div>
            </div>

            {/* Expiry Badge */}
            <div className="sm:text-right bg-slate-900/60 sm:bg-transparent p-2.5 sm:p-0 rounded-xl border border-slate-800 sm:border-none">
              <span className="text-[11px] text-slate-400 block">Thời Hạn Sử Dụng</span>
              <span className="text-xs sm:text-sm font-bold text-white flex items-center sm:justify-end gap-1.5 mt-0.5">
                {member.plan === 'lifetime' || member.plan === 'admin' ? (
                  <span className="text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Vĩnh Viễn (Lifetime)
                  </span>
                ) : member.expiresAt ? (
                  <span className={daysLeft === 0 ? 'text-rose-400' : 'text-slate-200'}>
                    {new Date(member.expiresAt).toLocaleDateString('vi-VN')} ({daysLeft} ngày còn lại)
                  </span>
                ) : (
                  <span className="text-slate-400">Không giới hạn</span>
                )}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            {/* Member Code */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-[11px] block">Mã Thành Viên</span>
                <span className="font-mono font-bold text-amber-400 text-sm">{member.memberCode || 'Chưa gán mã'}</span>
              </div>
              {member.memberCode && (
                <button
                  type="button"
                  onClick={() => copyToClipboard(member.memberCode!, 'code')}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  title="Sao chép mã"
                >
                  {copiedField === 'code' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>

            {/* Email / User Account */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <span className="text-slate-400 text-[11px] block">Email / Tài khoản</span>
                <span className="font-medium text-slate-200 truncate block">{member.email || member.uid}</span>
              </div>
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
            </div>

            {/* Devices Bound */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-[11px] block">Thiết Bị Đang Kết Nối</span>
                <span className="font-medium text-slate-200">
                  {member.boundDevices?.length || 0} / {member.maxDevices || 2} Thiết bị
                </span>
              </div>
              <Smartphone className="w-4 h-4 text-slate-400" />
            </div>

            {/* Created At */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-[11px] block">Ngày Đăng Ký</span>
                <span className="font-medium text-slate-200">
                  {member.createdAt ? new Date(member.createdAt).toLocaleDateString('vi-VN') : 'Mới tạo'}
                </span>
              </div>
              <Calendar className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {member.note && (
            <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-300">
              <span className="text-slate-500 font-medium">Ghi chú: </span>
              {member.note}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons Panel (Quick Grants & Extensions) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-850 border border-slate-700/80 shadow-lg space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Thao Tác Cấp Quyền & Gia Hạn Nhanh</span>
          </div>
          {member && onSelectForAdjust && (
            <button
              type="button"
              onClick={() => onSelectForAdjust(member)}
              className="text-xs text-amber-400 hover:text-amber-300 underline font-medium cursor-pointer"
            >
              Chỉnh sửa chi tiết →
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Lifetime PRO */}
          <button
            id="btn-action-lifetime"
            type="button"
            onClick={() => handleAction('pro_lifetime')}
            disabled={actionLoading}
            className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs flex flex-col items-center justify-center gap-1 shadow-md active:scale-98 transition disabled:opacity-50 min-h-[56px]"
          >
            {actionLoading && activeAction === 'pro_lifetime' ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
            ) : (
              <Crown className="w-4 h-4 text-slate-950" />
            )}
            <span>PRO VĨNH VIỄN (LIFETIME)</span>
          </button>

          {/* Month PRO */}
          <button
            id="btn-action-month"
            type="button"
            onClick={() => handleAction('pro_month')}
            disabled={actionLoading}
            className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-amber-500/50 text-white font-semibold text-xs flex flex-col items-center justify-center gap-1 active:scale-98 transition disabled:opacity-50 min-h-[56px]"
          >
            {actionLoading && activeAction === 'pro_month' ? (
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
            ) : (
              <Calendar className="w-4 h-4 text-amber-400" />
            )}
            <span>GIA HẠN 1 THÁNG (30 NGÀY)</span>
          </button>

          {/* Year PRO */}
          <button
            id="btn-action-year"
            type="button"
            onClick={() => handleAction('pro_year')}
            disabled={actionLoading}
            className="p-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-amber-500/50 text-white font-semibold text-xs flex flex-col items-center justify-center gap-1 active:scale-98 transition disabled:opacity-50 min-h-[56px]"
          >
            {actionLoading && activeAction === 'pro_year' ? (
              <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
            ) : (
              <Clock className="w-4 h-4 text-sky-400" />
            )}
            <span>GIA HẠN 1 NĂM (365 NGÀY)</span>
          </button>

          {/* Custom Trial Extension */}
          <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="365"
              value={customDays}
              onChange={(e) => setCustomDays(e.target.value)}
              className="w-14 px-2 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white font-bold text-center text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
              placeholder="7"
            />
            <button
              id="btn-action-custom-trial"
              type="button"
              onClick={() => handleAction('extend_trial', parseInt(customDays) || 7)}
              disabled={actionLoading}
              className="flex-1 py-2 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 active:scale-98 transition disabled:opacity-50"
            >
              {actionLoading && activeAction === 'extend_trial' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
              <span>+ {customDays || 7} Ngày Thử</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
