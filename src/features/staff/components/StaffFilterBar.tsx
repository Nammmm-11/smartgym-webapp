import React from 'react';
import { FiSearch, FiPlus, FiTrash2 } from 'react-icons/fi';
import type { StaffFilterType } from '../types/staff.types';

interface StaffFilterBarProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  activeFilter: StaffFilterType;
  onFilterChange: (filter: StaffFilterType) => void;
  trashCount: number;
  onAddClick: () => void;
  onOpenTrashModal: () => void; // Thêm sự kiện mở modal thùng rác
}

export const StaffFilterBar: React.FC<StaffFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  activeFilter,
  onFilterChange,
  trashCount,
  onAddClick,
  onOpenTrashModal,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#08080a] border border-[#1c1c20] p-4 rounded-2xl">
      <div className="flex items-center gap-2 w-full md:w-96 bg-[#040405] border border-[#1f1f24] rounded-xl px-4 py-2.5">
        <FiSearch size={16} className="text-gray-500 flex-shrink-0" />
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, mã nhân viên, SĐT..."
          className="bg-transparent text-xs text-white placeholder-gray-600 focus:outline-none w-full font-mono"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end flex-wrap">
        <div className="flex items-center gap-1.5 bg-[#040405] border border-[#1f1f24] p-1 rounded-xl">
          {(['ALL', 'ACTIVE', 'ON_LEAVE'] as StaffFilterType[]).map((filter) => {
            const label = filter === 'ALL' ? 'TẤT CẢ' : filter === 'ACTIVE' ? 'ĐANG LÀM' : 'NGHỈ PHÉP';
            return (
              <button
                key={filter}
                onClick={() => onFilterChange(filter)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wider transition-all cursor-pointer ${
                  activeFilter === filter
                    ? 'bg-gym-neon text-black shadow-[0_0_10px_rgba(204,255,0,0.2)]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <button
          onClick={onAddClick}
          className="flex items-center gap-2 bg-gym-neon text-black px-4 py-2.5 rounded-xl text-xs font-black italic tracking-wider hover:bg-[#b3e600] transition-colors cursor-pointer shadow-[0_0_15px_rgba(204,255,0,0.2)]"
        >
          <FiPlus size={16} /> THÊM NHÂN SỰ
        </button>

        {/* Nút mở Popup Thùng rác */}
        <button
          type="button"
          onClick={onOpenTrashModal}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all border cursor-pointer bg-[#180909] text-red-400 border-[#381515] hover:border-red-500/60"
        >
          <FiTrash2 size={14} /> THÙNG RÁC <span className="text-[10px] font-mono opacity-80">({trashCount})</span>
        </button>
      </div>
    </div>
  );
};