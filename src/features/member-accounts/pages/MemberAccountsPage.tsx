import React, { useState, useEffect } from 'react';
import { FiUsers } from 'react-icons/fi';
import { MemberAccountMetricCards } from '../components/MemberAccountMetricCards';
import { MemberAccountFilterBar } from '../components/MemberAccountFilterBar';
import { MemberAccountCardRow } from '../components/MemberAccountCardRow';
import { memberAccountApi } from '../api/member-account.api';
import type { MemberAccount, AccountFilterType } from '../types/member-account.types';

export const MembersAccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<MemberAccount[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<AccountFilterType>('ALL');

  const loadData = async () => {
    const data = await memberAccountApi.getAccounts();
    setAccounts(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const metrics = memberAccountApi.calculateMetrics(accounts);

  const filteredAccounts = accounts.filter((acc) => {
    if (activeFilter !== 'ALL' && acc.status !== activeFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      return acc.fullName.toLowerCase().includes(q) || acc.email.toLowerCase().includes(q) || acc.phoneNumber.includes(q);
    }
    return true;
  });

  const handleToggleLock = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
    await memberAccountApi.updateAccountStatus(id, newStatus);
    loadData();
  };

  const handleResetPassword = async (id: string) => {
    if (window.confirm("Bạn có chắc muốn đặt lại mật khẩu cho tài khoản này?")) {
      await memberAccountApi.resetPassword(id);
      alert("Đặt lại mật khẩu thành công!");
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#050505] text-white">
      <div className="relative z-30 px-8 py-5 border-b border-[#141414] bg-[#070707] flex justify-between items-center flex-shrink-0">
        <div>
          <span className="text-[10px] text-gray-500 font-mono tracking-[0.25em] uppercase">FIT.GYM // SYSTEM_V4</span>
          <h1 className="text-2xl lg:text-3xl font-black italic tracking-wide uppercase m-0 mt-1 text-white">QUẢN LÝ TÀI KHOẢN HỘI VIÊN</h1>
        </div>
      </div>

      <div className="p-8 flex flex-col gap-6 flex-grow overflow-y-auto">
        <MemberAccountMetricCards metrics={metrics} />
        
        <MemberAccountFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        
        <div className="flex flex-col gap-3 pb-4">
          {filteredAccounts.length === 0 ? (
            <div className="bg-[#080808] border border-dashed border-[#1c1c1c] rounded-2xl p-12 text-center flex flex-col items-center justify-center">
              <FiUsers size={24} className="text-gray-600 mb-3" />
              <p className="text-xs font-mono text-gray-500 tracking-widest uppercase m-0">KHÔNG TÌM THẤY TÀI KHOẢN PHÙ HỢP</p>
            </div>
          ) : (
            filteredAccounts.map((acc) => (
              <MemberAccountCardRow
                key={acc.id}
                account={acc}
                onToggleLock={handleToggleLock}
                onResetPassword={handleResetPassword}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};