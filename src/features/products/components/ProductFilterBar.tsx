import React from 'react';
import { FiSearch, FiPlus, FiTrash2 } from 'react-icons/fi';
import type { ProductFilterType, ProductMetrics } from '../types/product.types';

interface ProductFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  activeFilter: ProductFilterType;
  onFilterChange: (filter: ProductFilterType) => void;
  metrics: ProductMetrics;
  trashCount: number;
  onAddClick: () => void;
}

export const ProductFilterBar: React.FC<ProductFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  activeFilter,
  onFilterChange,
  metrics,
  trashCount,
  onAddClick,
}) => {
  // Có thể sử dụng dữ liệu từ metrics ở đây nếu cần hiển thị thêm thống kê tổng quan
  console.log('Product metrics:', metrics);

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
      {/* 1. Ô TÌM KIẾM */}
      <div className="relative flex-grow">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
        <input
          type="text"
          placeholder="Tìm tên hoặc mã sản phẩm..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl pl-12 pr-4 py-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-gym-neon transition-colors font-mono tracking-wider shadow-inner"
        />
      </div>

      {/* 2. DROPDOWN LỌC DANH MỤC & NÚT THÊM / THÙNG RÁC */}
      <div className="flex items-center gap-3">
        <select
          value={activeFilter}
          onChange={(e) => onFilterChange(e.target.value as ProductFilterType)}
          className="bg-[#0a0a0a] border border-[#1f1f1f] text-white px-4 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-gym-neon cursor-pointer shadow-lg"
        >
          <option value="ALL">Tất cả danh mục</option>
          <option value="Thực phẩm bổ sung">Thực phẩm bổ sung</option>
          <option value="Nước uống">Nước uống</option>
          <option value="Phụ kiện">Phụ kiện</option>
          <option value="Trang phục">Trang phục</option>
        </select>

        <button
          type="button"
          onClick={onAddClick}
          className="flex items-center gap-2 bg-gym-neon text-black font-black uppercase text-xs tracking-wider px-5 py-3.5 rounded-2xl hover:bg-[#b3e600] transition-all shadow-[0_0_15px_rgba(204,255,0,0.2)] cursor-pointer whitespace-nowrap"
        >
          <FiPlus size={16} /> THÊM SP
        </button>

        <button
          type="button"
          onClick={() => onFilterChange(activeFilter === 'TRASH' ? 'ALL' : 'TRASH')}
          className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider px-4 py-3.5 rounded-2xl transition-all border cursor-pointer whitespace-nowrap ${
            activeFilter === 'TRASH' 
              ? 'bg-red-600 text-white border-red-500' 
              : 'bg-[#120808] text-red-400 border-[#2b1212] hover:border-red-500/60'
          }`}
        >
          <FiTrash2 size={15} /> THÙNG RÁC ({trashCount})
        </button>
      </div>
    </div>
  );
};