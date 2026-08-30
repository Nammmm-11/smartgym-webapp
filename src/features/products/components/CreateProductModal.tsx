import React, { useState } from 'react';
import { FiX, FiBox } from 'react-icons/fi';
import type { Product, ProductCategory } from '../types/product.types';

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Omit<Product, 'id' | 'productCode' | 'isDeleted'>) => void;
}

export const CreateProductModal: React.FC<CreateProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Thực phẩm bổ sung');
  const [price, setPrice] = useState<number>(0);
  const [costPrice, setCostPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(10);
  const [unit, setUnit] = useState('Hũ');
  const [image, setImage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || price <= 0) {
      alert('Vui lòng nhập tên sản phẩm và giá bán hợp lệ!');
      return;
    }
    onSubmit({
      name: name.toUpperCase(),
      category,
      price: Number(price),
      costPrice: Number(costPrice),
      stock: Number(stock),
      unit,
      image,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0c0c0c] border border-[#222] w-full max-w-lg rounded-3xl p-6 shadow-2xl">
        <div className="flex justify-between items-center pb-4 border-b border-[#1c1c1c] mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gym-neon/10 text-gym-neon border border-gym-neon/20">
              <FiBox size={18} />
            </div>
            <div>
              <h3 className="text-base font-black italic tracking-wide uppercase m-0 text-white">THÊM SẢN PHẨM MỚI</h3>
              <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase m-0">FIT.GYM // INVENTORY</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-white p-2 rounded-xl bg-[#141414] cursor-pointer">
            <FiX size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-[10px] font-mono tracking-widest text-gray-400 uppercase block mb-1.5">TÊN SẢN PHẨM *</label>
            <input
              type="text"
              required
              placeholder="VD: WHEY PROTEIN 2KG..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#050505] border border-[#1f1f1f] rounded-xl px-4 py-2.5 text-xs text-white uppercase font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono tracking-widest text-gray-400 uppercase block mb-1.5">DANH MỤC</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full bg-[#050505] border border-[#1f1f1f] rounded-xl px-3 py-2.5 text-xs text-white font-mono cursor-pointer"
              >
                <option value="Thực phẩm bổ sung">Thực phẩm bổ sung</option>
                <option value="Nước uống">Nước uống</option>
                <option value="Phụ kiện">Phụ kiện</option>
                <option value="Trang phục">Trang phục</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-mono tracking-widest text-gray-400 uppercase block mb-1.5">ĐƠN VỊ TÍNH</label>
              <input
                type="text"
                required
                placeholder="Hũ, Đôi, Cái, Chai..."
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full bg-[#050505] border border-[#1f1f1f] rounded-xl px-3 py-2.5 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono tracking-widest text-gray-400 uppercase block mb-1.5">GIÁ BÁN (VNĐ) *</label>
              <input
                type="number"
                required
                min={0}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-[#050505] border border-[#1f1f1f] rounded-xl px-3 py-2.5 text-xs text-gym-neon font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono tracking-widest text-gray-400 uppercase block mb-1.5">GIÁ VỐN (VNĐ)</label>
              <input
                type="number"
                min={0}
                value={costPrice}
                onChange={(e) => setCostPrice(Number(e.target.value))}
                className="w-full bg-[#050505] border border-[#1f1f1f] rounded-xl px-3 py-2.5 text-xs text-gray-300 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono tracking-widest text-gray-400 uppercase block mb-1.5">SỐ LƯỢNG TỒN *</label>
              <input
                type="number"
                required
                min={0}
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full bg-[#050505] border border-[#1f1f1f] rounded-xl px-3 py-2.5 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono tracking-widest text-gray-400 uppercase block mb-1.5">URL ẢNH</label>
              <input
                type="text"
                placeholder="https://..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full bg-[#050505] border border-[#1f1f1f] rounded-xl px-3 py-2.5 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-[#1c1c1c]">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl bg-[#141414] text-gray-400 text-xs font-bold cursor-pointer">
              HỦY
            </button>
            <button type="submit" className="px-6 py-2.5 rounded-xl bg-gym-neon text-black font-black uppercase text-xs tracking-wider cursor-pointer">
              LƯU SẢN PHẨM
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};