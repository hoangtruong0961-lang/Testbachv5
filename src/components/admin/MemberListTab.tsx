import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  RefreshCw,
  Crown,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Shield,
  Smartphone,
  Calendar,
  Lock,
  Trash2,
  Loader2,
  Filter,
  Sliders,
  User,
  Zap,
  Mail
} from 'lucide-react';
import {
  getAllCloudUsersFromFirestore,
  renewOrExtendMemberInFirestore,
  revokeUserVipInFirestore,
  CloudUserProfileRecord
} from '../../services/firebaseLicenseService';

interface MemberListTabProps {
  onSelectMemberForAdjust?: (member: CloudUserProfileRecord) => void;
}

export const MemberListTab: React.FC<MemberListTabProps> = ({ onSelectMemberForAdjust }) => {
  const [members, setMembers] = useState<CloudUserProfileRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'trial' | 'pro' | 'expired'>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const list = await getAllCloudUsersFromFirestore();
      setMembers(list);
    } catch (err) {
      console.error('[MemberListTab] fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleQuickAction = async (
    member: CloudUserProfileRecord,
    action: 'extend_trial' | 'pro_lifetime' | 'revoke'
  ) => {
    setActionLoadingId(member.uid);
    setToastMsg(null);
    try {
      if (action === 'revoke') {
        if (!confirm(`Bạn có chắc muốn thu hồi quyền VIP của ${member.displayName || member.email}?`)) {
          setActionLoadingId(null);
          return;
        }
        const res = await revokeUserVipInFirestore(member.uid);
        if (res.success) {
          setToastMsg({ type: 'success', text: res.message });
          fetchMembers();
        } else {
          setToastMsg({ type: 'error', text: res.message });
        }
      } else {
        const res = await renewOrExtendMemberInFirestore({
          targetUidOrCode: member.uid,
          action,
          customDays: action === 'extend_trial' ? 7 : undefined
        });
        if (res.success) {
          setToastMsg({ type: 'success', text: res.message });
          fetchMembers();
        } else {
          setToastMsg({ type: 'error', text: res.message });
        }
      }
    } catch (err: any) {
      setToastMsg({ type: 'error', text: 'Lỗi: ' + (err.message || 'Lỗi mạng') });
    } finally {
      setActionLoadingId(null);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const now = Date.now();

  // Filtered members
  const filtered = members.filter((m) => {
    const isExpired = m.expiresAt ? now > m.expiresAt : false;
    const isPro = m.plan === 'lifetime' || m.plan === 'admin' || m.plan === 'month' || m.plan === 'quarter' || m.plan === 'year' || (m.status === 'active' && !isExpired && m.role === 'pro');
    const isTrial = m.plan === 'trial';

    if (filterTab === 'trial' && !isTrial) return false;
    if (filterTab === 'pro' && !isPro) return false;
    if (filterTab === 'expired' && (!isExpired && m.status !== 'expired' && m.status !== 'suspended')) return false;

    if (!search.trim()) return true;
    const s = search.toLowerCase();
    return (
      (m.memberCode && m.memberCode.toLowerCase().includes(s)) ||
      (m.email && m.email.toLowerCase().includes(s)) ||
      (m.displayName && m.displayName.toLowerCase().includes(s)) ||
      m.uid.toLowerCase().includes(s) ||
      m.boundDevices?.some((b) => b.deviceId.toLowerCase().includes(s))
    );
  });

  const totalMembers = members.length;
  const trialCount = members.filter((m) => m.plan === 'trial').length;
  const proCount = members.filter((m) => m.plan === 'lifetime' || m.plan === 'admin' || m.plan === 'month' || m.plan === 'quarter' || m.plan === 'year' || m.role === 'pro').length;
  const expiredCount = members.filter((m) => (m.expiresAt && now > m.expiresAt) || m.status === 'expired' || m.status === 'suspended').length;

  return (
    <div id="member-list-tab" className="space-y-4 sm:space-y-5">
      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-850 border border-slate-700/80 shadow-md">
          <div className="text-[11px] sm:text-xs text-slate-400 font-medium">Tổng Thành Viên</div>
          <div className="text-lg sm:text-2xl font-black text-white mt-1">{totalMembers}</div>
        </div>
        <div className="p-3 sm:p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 shadow-md">
          <div className="text-[11px] sm:text-xs text-indigo-300 font-medium">Đang Dùng Thử</div>
          <div className="text-lg sm:text-2xl font-black text-indigo-400 mt-1">{trialCount}</div>
        </div>
        <div className="p-3 sm:p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 shadow-md">
          <div className="text-[11px] sm:text-xs text-amber-300 font-medium">Thành Viên PRO</div>
          <div className="text-lg sm:text-2xl font-black text-amber-400 mt-1">{proCount}</div>
        </div>
        <div className="p-3 sm:p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 shadow-md">
          <div className="text-[11px] sm:text-xs text-rose-300 font-medium">Hết Hạn / Khóa</div>
          <div className="text-lg sm:text-2xl font-black text-rose-400 mt-1">{expiredCount}</div>
        </div>
      </div>

      {/* Control Bar: Search & Filter Tabs */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4 text-amber-400" />
          </div>
          <input
            id="member-list-search-input"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo Mã, Email, Tên..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700 text-xs shrink-0">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                filterTab === 'all' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tất Cả ({totalMembers})
            </button>
            <button
              onClick={() => setFilterTab('trial')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                filterTab === 'trial' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Dùng Thử ({trialCount})
            </button>
            <button
              onClick={() => setFilterTab('pro')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                filterTab === 'pro' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              PRO ({proCount})
            </button>
            <button
              onClick={() => setFilterTab('expired')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                filterTab === 'expired' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Hết Hạn ({expiredCount})
            </button>
          </div>

          <button
            onClick={fetchMembers}
            disabled={loading}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 transition shrink-0"
            title="Làm mới danh sách"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Toast message */}
      {toastMsg && (
        <div
          className={`p-3 rounded-xl flex items-center gap-2 text-xs sm:text-sm animate-in fade-in ${
            toastMsg.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
          }`}
        >
          {toastMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* MOBILE CARDS VIEW (Visible on small screens) */}
      <div className="block lg:hidden space-y-3">
        {loading && members.length === 0 ? (
          <div className="p-8 text-center bg-slate-850 rounded-2xl border border-slate-700/60 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-400 mb-2" />
            <span className="text-xs">Đang tải danh sách thành viên...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center bg-slate-850 rounded-2xl border border-slate-700/60 text-slate-400 text-xs">
            Không tìm thấy thành viên nào phù hợp.
          </div>
        ) : (
          filtered.map((m) => {
            const isExp = m.expiresAt ? now > m.expiresAt : false;
            const isLoadingThis = actionLoadingId === m.uid;
            let daysRemaining = null;
            if (m.expiresAt) {
              daysRemaining = Math.max(0, Math.ceil((m.expiresAt - now) / (24 * 60 * 60 * 1000)));
            }

            return (
              <div
                key={m.uid}
                className="p-4 rounded-2xl bg-slate-850 border border-slate-700/80 shadow-md space-y-3"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm truncate">
                        {m.displayName || m.email || 'Thành Viên'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono font-bold mt-0.5">
                      <span>{m.memberCode || 'MEM-N/A'}</span>
                      {m.memberCode && (
                        <button
                          type="button"
                          onClick={() => copyCode(m.memberCode!)}
                          className="p-1 hover:bg-slate-750 rounded text-slate-400 hover:text-white"
                          title="Sao chép"
                        >
                          {copiedCode === m.memberCode ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                    {m.email && <div className="text-[11px] text-slate-400 truncate">{m.email}</div>}
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                        m.plan === 'lifetime'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : m.plan === 'admin'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : m.plan === 'trial'
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : 'bg-slate-700 text-slate-300 border border-slate-600'
                      }`}
                    >
                      {m.plan === 'lifetime' ? 'VĨNH VIỄN' : m.plan === 'admin' ? 'ADMIN' : m.plan?.toUpperCase()}
                    </span>

                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                        isExp
                          ? 'bg-rose-500/20 text-rose-300'
                          : m.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {isExp ? 'HẾT HẠN' : m.status === 'active' ? 'ACTIVE' : 'KHÓA'}
                    </span>
                  </div>
                </div>

                {/* Expiry & Devices info */}
                <div className="flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-slate-700/60">
                  <div className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {m.plan === 'lifetime' || m.plan === 'admin' ? (
                        <span className="text-amber-400 font-semibold">Vĩnh Viễn</span>
                      ) : m.expiresAt ? (
                        <span>
                          {new Date(m.expiresAt).toLocaleDateString('vi-VN')} ({daysRemaining} ngày)
                        </span>
                      ) : (
                        <span>Chưa thiết lập</span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>
                      {m.boundDevices?.length || 0}/{m.maxDevices || 2} Thiết bị
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-700/60">
                  <button
                    type="button"
                    onClick={() => handleQuickAction(m, 'pro_lifetime')}
                    disabled={isLoadingThis}
                    className="py-2 px-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[11px] font-bold flex items-center justify-center gap-1 transition disabled:opacity-50"
                  >
                    <Crown className="w-3 h-3" />
                    <span>Cấp VIP</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectMemberForAdjust && onSelectMemberForAdjust(m)}
                    className="py-2 px-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-300 text-[11px] font-bold flex items-center justify-center gap-1 transition"
                  >
                    <Sliders className="w-3 h-3" />
                    <span>Sửa Quyền</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickAction(m, 'revoke')}
                    disabled={isLoadingThis}
                    className="py-2 px-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-[11px] font-bold flex items-center justify-center gap-1 transition disabled:opacity-50"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Thu Hồi</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DESKTOP TABLE VIEW (Visible on lg+ screens) */}
      <div className="hidden lg:block rounded-2xl border border-slate-700 overflow-hidden bg-slate-850 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-700">
              <tr>
                <th className="py-3 px-4 font-semibold">MÃ THÀNH VIÊN</th>
                <th className="py-3 px-4 font-semibold">TÀI KHOẢN / EMAIL</th>
                <th className="py-3 px-4 font-semibold">GÓI CƯỚC</th>
                <th className="py-3 px-4 font-semibold">TRẠNG THÁI</th>
                <th className="py-3 px-4 font-semibold">HẠN SỬ DỤNG</th>
                <th className="py-3 px-4 font-semibold">THIẾT BỊ</th>
                <th className="py-3 px-4 font-semibold text-right">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {loading && members.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-400 mb-2" />
                    <span>Đang tải danh sách thành viên từ Firebase Firestore...</span>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Không tìm thấy thành viên nào phù hợp.
                  </td>
                </tr>
              ) : (
                filtered.map((m) => {
                  const isExp = m.expiresAt ? now > m.expiresAt : false;
                  const isLoadingThis = actionLoadingId === m.uid;
                  let daysRemaining = null;
                  if (m.expiresAt) {
                    daysRemaining = Math.max(0, Math.ceil((m.expiresAt - now) / (24 * 60 * 60 * 1000)));
                  }

                  return (
                    <tr key={m.uid} className="hover:bg-slate-800/80 transition">
                      {/* Member Code */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 font-mono font-bold text-amber-400">
                          <span>{m.memberCode || 'MEM-N/A'}</span>
                          {m.memberCode && (
                            <button
                              type="button"
                              onClick={() => copyCode(m.memberCode!)}
                              className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition"
                              title="Sao chép mã"
                            >
                              {copiedCode === m.memberCode ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Account & Email */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-200">{m.displayName || 'Khách hàng'}</div>
                        <div className="text-slate-400 text-[11px] truncate max-w-[180px]">{m.email || m.uid}</div>
                      </td>

                      {/* Plan */}
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                            m.plan === 'lifetime'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : m.plan === 'admin'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : m.plan === 'trial'
                              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                              : 'bg-slate-700 text-slate-300 border border-slate-600'
                          }`}
                        >
                          {m.plan === 'lifetime' ? 'VĨNH VIỄN' : m.plan === 'admin' ? 'ADMIN' : m.plan?.toUpperCase()}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                            isExp
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : m.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-700 text-slate-400'
                          }`}
                        >
                          {isExp ? 'HẾT HẠN' : m.status === 'active' ? 'ACTIVE' : 'KHÓA'}
                        </span>
                      </td>

                      {/* Expiry */}
                      <td className="py-3 px-4">
                        {m.plan === 'lifetime' || m.plan === 'admin' ? (
                          <span className="text-amber-400 font-semibold flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Vĩnh Viễn
                          </span>
                        ) : m.expiresAt ? (
                          <span className={daysRemaining === 0 ? 'text-rose-400 font-semibold' : 'text-slate-300'}>
                            {new Date(m.expiresAt).toLocaleDateString('vi-VN')}{' '}
                            <span className="text-[10px] text-slate-400">({daysRemaining}d)</span>
                          </span>
                        ) : (
                          <span className="text-slate-500">Chưa đặt</span>
                        )}
                      </td>

                      {/* Devices */}
                      <td className="py-3 px-4">
                        <span className="text-slate-300">
                          {m.boundDevices?.length || 0} / {m.maxDevices || 2}
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleQuickAction(m, 'pro_lifetime')}
                            disabled={isLoadingThis}
                            className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition"
                            title="Cấp VIP Lifetime"
                          >
                            <Crown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onSelectMemberForAdjust && onSelectMemberForAdjust(m)}
                            className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 transition"
                            title="Sửa quyền hạn"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickAction(m, 'revoke')}
                            disabled={isLoadingThis}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition"
                            title="Thu hồi quyền"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
