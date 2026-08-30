import React from 'react';
import { FiSearch, FiPlus, FiTrash2 } from 'react-icons/fi';
import type { MemberFilterType, MemberMetrics } from '../types/member.types';
import { useLanguage } from '../../../contexts/i18n/LanguageContext';

interface MemberFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeFilter: MemberFilterType;
  onFilterChange: (filter: MemberFilterType) => void;
  metrics: MemberMetrics;
  trashCount: number;
  onAddClick: () => void;
}

export const MemberFilterBar: React.FC<MemberFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  activeFilter,
  onFilterChange,
  metrics,
  trashCount,
  onAddClick,
}) => {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 my-2">
      {/* LEFT: SEARCH & TABS */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search input */}
        <div className="relative min-w-[260px] flex-grow sm:flex-grow-0">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
          <input
            type="text"
            placeholder={t.members.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#080808] border border-[#1a1a1a] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-gym-neon transition-colors font-mono tracking-wider"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 bg-[#080808] border border-[#161616] p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => onFilterChange('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer ${
              activeFilter === 'ALL'
                ? 'bg-gym-neon text-black shadow-[0_0_12px_rgba(204,255,0,0.3)]'
                : 'text-gray-400 hover:text-white hover:bg-[#121212]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${activeFilter === 'ALL' ? 'bg-black' : 'bg-gym-neon'}`}></span>
            {t.members.tabAll} <span className="text-[10px] font-mono opacity-80">{metrics.total}</span>
          </button>

          <button
            type="button"
            onClick={() => onFilterChange('ACTIVE')}
            className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer ${
              activeFilter === 'ACTIVE'
                ? 'bg-gym-neon text-black shadow-[0_0_12px_rgba(204,255,0,0.3)]'
                : 'text-gray-400 hover:text-white hover:bg-[#121212]'
            }`}
          >
            {t.members.tabActive} <span className="text-[10px] font-mono opacity-80">{metrics.active}</span>
          </button>

          <button
            type="button"
            onClick={() => onFilterChange('EXPIRED')}
            className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer ${
              activeFilter === 'EXPIRED'
                ? 'bg-gym-neon text-black shadow-[0_0_12px_rgba(204,255,0,0.3)]'
                : 'text-gray-400 hover:text-white hover:bg-[#121212]'
            }`}
          >
            {t.members.tabExpired} <span className="text-[10px] font-mono opacity-80">{metrics.expired}</span>
          </button>
        </div>
      </div>

      {/* RIGHT: BUTTONS */}
      <div className="flex items-center gap-3 self-end xl:self-auto">
        <button
          type="button"
          onClick={onAddClick}
          className="flex items-center gap-2 bg-gym-neon text-black font-black uppercase text-xs tracking-wider px-5 py-2.5 rounded-xl hover:bg-[#b3e600] transition-all shadow-[0_0_15px_rgba(204,255,0,0.25)] cursor-pointer"
        >
          <FiPlus size={16} /> {t.members.btnAdd}
        </button>

        <button
          type="button"
          onClick={() => onFilterChange(activeFilter === 'TRASH' ? 'ALL' : 'TRASH')}
          className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all border cursor-pointer ${
            activeFilter === 'TRASH'
              ? 'bg-red-600 text-white border-red-500'
              : 'bg-[#180909] text-red-400 border-[#381515] hover:border-red-500/60'
          }`}
        >
          <FiTrash2 size={14} /> {t.members.btnTrash} <span className="text-[10px] font-mono opacity-80">({trashCount})</span>
        </button>
      </div>
    </div>
  );
};
