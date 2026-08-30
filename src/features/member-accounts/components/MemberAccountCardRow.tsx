import React from 'react';
import type { MemberAccount } from '../types/member-account.types';

interface MemberAccountCardRowProps {
  account: MemberAccount;
  onToggleLock: (id: string, currentStatus: string) => void;
  onResetPassword: (id: string) => void;
}

export const MemberAccountCardRow: React.FC<MemberAccountCardRowProps> = ({
  account,
  onToggleLock,
  onResetPassword,
}) => {
  const getStatusBadge = (status: MemberAccount['status']) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="px-2.5 py-1 text-[10px] font-black uppercase rounded bg-green-950/40 text-[#22c55e] border border-green-900/50">Đã kích hoạt</span>;
      case 'LOCKED':
        return <span className="px-2.5 py-1 text-[10px] font-black uppercase rounded bg-red-950/40 text-red-400 border border-red-900/50">Đã khóa</span>;
      case 'PENDING':
      default:
        return <span className="px-2.5 py-1 text-[10px] font-black uppercase rounded bg-yellow-950/40 text-yellow-400 border border-yellow-900/50">Chờ duyệt</span>;
    }
  };

  const initial = account.fullName ? account.fullName.charAt(0).toUpperCase() : 'M';

  return (
    <div className="bg-[#090909] border border-[#161616] hover:border-[#2a2a2a] rounded-2xl p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4 transition-all duration-200 shadow-md">
      {/* Thông tin hội viên */}
      <div className="flex items-center gap-3 min-w-[220px]">
        <div className="w-10 h-10 rounded-xl border border-[#222] bg-[#121212] flex items-center justify-center font-black text-sm text-gym-neon flex-shrink-0">
          {initial}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-black italic tracking-wide text-white uppercase m-0">{account.fullName}</h4>
            <span className="text-[9px] font-mono font-bold text-gray-500 bg-[#141414] px-1.5 py-0.5 rounded border border-[#222]">
              {account.memberCode}
            </span>
          </div>
          <p className="text-[9px] text-gray-500 font-mono tracking-widest uppercase m-0 mt-0.5">
            SĐT: {account.phoneNumber} | Email: {account.email}
          </p>
        </div>
      </div>

      {/* Username / Tài khoản */}
      <div className="min-w-[170px]">
        <span className="text-[8px] font-mono tracking-widest text-gray-500 uppercase block mb-1">Tài khoản đăng nhập</span>
        <span className="text-xs font-mono font-bold text-white uppercase">{account.username || account.phoneNumber}</span>
      </div>

      {/* Trạng thái */}
      <div className="min-w-[130px]">
        <span className="text-[8px] font-mono tracking-widest text-gray-500 uppercase block mb-1">Trạng thái</span>
        {getStatusBadge(account.status)}
      </div>

      {/* Thao tác */}
      <div className="flex items-center gap-2 self-end xl:self-auto flex-shrink-0">
        <button
          type="button"
          onClick={() => onResetPassword(account.id)}
          className="bg-[#121212] border border-[#1f1f1f] hover:border-gym-neon text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          Đổi mật khẩu
        </button>
        <button
          type="button"
          onClick={() => onToggleLock(account.id, account.status)}
          className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-lg transition-colors cursor-pointer border ${
            account.status === 'ACTIVE'
              ? 'bg-red-950/30 border-red-800 text-red-400 hover:bg-red-900/40'
              : 'bg-green-950/30 border-green-800 text-[#22c55e] hover:bg-green-900/40'
          }`}
        >
          {account.status === 'ACTIVE' ? 'Khóa' : 'Mở khóa'}
        </button>
      </div>
    </div>
  );
};