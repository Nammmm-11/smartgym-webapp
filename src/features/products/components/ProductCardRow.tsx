import React from 'react';
import { FiEdit2, FiTrash2, FiRotateCcw, FiBox } from 'react-icons/fi';
import type { Product } from '../types/product.types';

interface ProductCardRowProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onRestore?: (id: string) => void;
}

export const ProductCardRow: React.FC<ProductCardRowProps> = ({
  product,
  onEdit,
  onDelete,
  onRestore,
}) => {
  return (
    <div className="bg-[#0b0b0b] border border-[#181818] hover:border-[#2a2a2a] rounded-3xl p-6 flex flex-col justify-between gap-6 transition-all duration-200 shadow-xl relative group">
      {/* Top Section: Image & Name */}
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl border border-[#222] bg-[#121212] overflow-hidden flex items-center justify-center flex-shrink-0 shadow-inner">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <FiBox className="text-gray-600" size={22} />
          )}
        </div>
        <div className="flex-grow min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">
              {product.productCode}
            </span>
          </div>
          <h4 className="text-sm font-black italic tracking-wide text-white uppercase mt-0.5 truncate">{product.name}</h4>
          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mt-0.5">
            {product.category} // Đơn vị: {product.unit}
          </p>
        </div>
      </div>

      {/* Middle Section: Prices & Stock */}
      <div className="grid grid-cols-2 gap-4 py-3 border-t border-b border-[#161616]">
        <div>
          {/* Đã đổi từ Giá mua thành Giá bán */}
          <span className="text-[9px] font-mono tracking-widest text-gray-500 uppercase block">Giá bán:</span>
          <span className="text-sm font-mono font-black text-gym-neon mt-0.5 block">
            {product.price.toLocaleString('vi-VN')}đ
          </span>
        </div>
        <div>
          <span className="text-[9px] font-mono tracking-widest text-gray-500 uppercase block">Giá vốn:</span>
          <span className="text-sm font-mono font-bold text-gray-300 mt-0.5 block">
            {product.costPrice ? `${product.costPrice.toLocaleString('vi-VN')}đ` : '0đ'}
          </span>
        </div>
      </div>

      {/* Bottom Section: Stock & Action Icons */}
      <div className="flex items-end justify-between">
        <div>
          <span className="text-[9px] font-mono tracking-widest text-gray-500 uppercase block">Mức tồn hiện tại:</span>
          <span className="text-xs font-mono font-bold text-white uppercase mt-0.5 block">
            {product.stock} {product.unit}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {product.isDeleted ? (
            <button
              type="button"
              onClick={() => onRestore && onRestore(product.id)}
              className="flex items-center gap-1 bg-[#15232d] border border-[#223d52] text-[#38bdf8] text-[10px] font-black uppercase px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              <FiRotateCcw size={12} /> Khôi phục
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onEdit(product)}
                className="p-2 rounded-xl bg-[#141414] border border-[#222] hover:border-gray-500 text-gray-400 hover:text-white transition-colors cursor-pointer"
                title="Chỉnh sửa"
              >
                <FiEdit2 size={14} />
              </button>
              <button
                type="button"
                onClick={() => onDelete(product.id)}
                className="p-2 rounded-xl bg-[#1c0c0c] border border-[#381515] hover:border-red-500 text-red-400 transition-colors cursor-pointer"
                title="Xóa / Thùng rác"
              >
                <FiTrash2 size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};