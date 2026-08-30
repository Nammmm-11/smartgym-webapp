import React from 'react';
import { FiSearch } from 'react-icons/fi';
import type { AccountFilterType } from '../types/member-account.types';

interface MemberAccountFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeFilter: AccountFilterType;
  onFilterChange: (filter: AccountFilterType) => void;
}

export const MemberAccountFilterBar: React.FC<MemberAccountFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  activeFilter,
  onFilterChange,
}) => {
  return (
    <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 my-2">
      <div className="relative min-w-[260px] flex-grow">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, email, SĐT..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-[#080808] border border-[#1a1a1a] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gym-neon transition-colors font-mono tracking-wider"
        />
      </div>

      <div className="flex items-center gap-2 bg-[#080808] border border-[#161616] p-1 rounded-2xl">
        {(['ALL', 'ACTIVE', 'LOCKED', 'PENDING'] as AccountFilterType[]).map((filter) => {
          const labels: Record<AccountFilterType, string> = {
            ALL: 'Tất cả',
            ACTIVE: 'Hoạt động',
            LOCKED: 'Đã khóa',
            PENDING: 'Chờ duyệt',
          };
          const isActive = activeFilter === filter;
          return (
            <button
              key={filter}
              type="button"
              onClick={() => onFilterChange(filter)}
              className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-all cursor-pointer ${
                isActive
                  ? 'bg-gym-neon text-black shadow-[0_0_12px_rgba(204,255,0,0.3)]'
                  : 'text-gray-400 hover:text-white hover:bg-[#121212]'
              }`}
            >
              {labels[filter]}
            </button>
          );
        })}
      </div>
    </div>
  );
};