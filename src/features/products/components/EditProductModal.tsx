import React, { useState, useEffect } from 'react';
import { FiX, FiEdit2 } from 'react-icons/fi';
import type { Product, ProductCategory } from '../types/product.types';

interface EditProductModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onSubmit: (product: Product) => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  product,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Product | null>(null);

  useEffect(() => {
    if (product) {
      setFormData({ ...product });
    }
  }, [product]);

  if (!isOpen || !formData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0c0c0c] border border-[#222] w-full max-w-lg rounded-3xl p-6 shadow-2xl">
        <div className="flex justify-between items-center pb-4 border-b border-[#1c1c1c] mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gym-neon/10 text-gym-neon border border-gym-neon/20">
              <FiEdit2 size={18} />
            </div>
            <div>
              <h3 className="text-base font-black italic tracking-wide uppercase m-0 text-white">CHỈNH SỬA SẢN PHẨM</h3>
              <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase m-0">MÃ: {formData.productCode}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white p-2 rounded-xl bg-[#141414] cursor-pointer">
            <FiX size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-[10px] font-mono tracking-widest text-gray-400 uppercase block mb-1.5">TÊN SẢN PHẨM</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
              className="w-full bg-[#050505] border border-[#1f1f1f] rounded-xl px-4 py-2.5 text-xs text-white uppercase font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono tracking-widest text-gray-400 uppercase block mb-1.5">DANH MỤC</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                className="w-full bg-[#050505] border border-[#1f1f1f] rounded-xl px-3 py-2.5 text-xs text-white font-mono cursor-pointer"
              >
                <option value="Thực phẩm bổ sung">Thực phẩm bổ sung</option>
                <option value="Đồ uống / Nước">Đồ uống / Nước</option>
                <option value="Phụ kiện tập luyện">Phụ kiện tập luyện</option>
                <option value="Trang phục">Trang phục</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-mono tracking-widest text-gray-400 uppercase block mb-1.5">GIÁ BÁN (VNĐ)</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full bg-[#050505] border border-[#1f1f1f] rounded-xl px-3 py-2.5 text-xs text-gym-neon font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono tracking-widest text-gray-400 uppercase block mb-1.5">SỐ LƯỢNG TỒN</label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="w-full bg-[#050505] border border-[#1f1f1f] rounded-xl px-3 py-2.5 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono tracking-widest text-gray-400 uppercase block mb-1.5">URL ẢNH</label>
              <input
                type="text"
                value={formData.image || ''}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full bg-[#050505] border border-[#1f1f1f] rounded-xl px-3 py-2.5 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-[#1c1c1c]">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl bg-[#141414] text-gray-400 text-xs font-bold cursor-pointer">
              HỦY
            </button>
            <button type="submit" className="px-6 py-2.5 rounded-xl bg-gym-neon text-black font-black uppercase text-xs tracking-wider cursor-pointer">
              CẬP NHẬT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};