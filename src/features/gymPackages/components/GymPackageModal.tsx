import React, { useState, useEffect } from 'react';
import type { GymPackageDto } from '../services/gymPackage.service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GymPackageDto) => void;
  initialData?: GymPackageDto | null;
}

export const GymPackageModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [durationInMonths, setDurationInMonths] = useState(1);
  const [priceDisplay, setPriceDisplay] = useState('0'); // Dùng chuỗi để quản lý định dạng dấu phẩy
  const [isActive, setIsActive] = useState(true);

  // Hàm định dạng chuỗi số có dấu phẩy ngăn cách và loại bỏ số 0 thừa ở đầu
  const formatCurrency = (val: string | number) => {
    const raw = String(val).replace(/\D/g, '');
    if (!raw) return '';
    return Number(raw).toLocaleString('en-US');
  };

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
      setDurationInMonths(initialData.durationInMonths || 1);
      setPriceDisplay(formatCurrency(initialData.price || 0));
      setIsActive(initialData.isActive);
    } else {
      setName('');
      setDescription('');
      setDurationInMonths(1);
      setPriceDisplay('0');
      setIsActive(true);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setPriceDisplay(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Chuyển đổi chuỗi có dấu phẩy về kiểu số nguyên trước khi submit
    const numericPrice = Number(priceDisplay.replace(/,/g, '')) || 0;

    onSubmit({
      id: initialData?.id,
      name,
      description,
      durationInMonths: Number(durationInMonths),
      price: numericPrice,
      isActive
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#161618] border border-zinc-800 rounded-2xl w-full max-w-md p-6 text-white shadow-2xl">
        <h2 className="text-xl font-black mb-4">{initialData ? 'CẬP NHẬT GÓI TẬP' : 'THÊM GÓI TẬP MỚI'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-zinc-400 font-semibold block mb-1">Tên gói tập</label>
            <input 
              type="text" 
              required
              value={name} 
              onChange={e => setName(e.target.value)}
              className="w-full bg-[#0f0f11] border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:border-[#ccff00] outline-none"
              placeholder="VD: GÓI CƠ BẢN"
            />
          </div>

          <div>
            <label className="text-xs text-zinc-400 font-semibold block mb-1">Mô tả</label>
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-[#0f0f11] border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:border-[#ccff00] outline-none"
              placeholder="Mô tả chi tiết gói tập..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-zinc-400 font-semibold block mb-1">Thời hạn (Tháng)</label>
              <input 
                type="number" 
                min={1}
                required
                value={durationInMonths} 
                onChange={e => setDurationInMonths(Number(e.target.value))}
                className="w-full bg-[#0f0f11] border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:border-[#ccff00] outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400 font-semibold block mb-1">Giá tiền (VNĐ)</label>
              <input 
                type="text" // Chuyển từ number sang text để hỗ trợ dấu phẩy và loại bỏ số 0 ở đầu
                required
                value={priceDisplay} 
                onChange={handlePriceChange}
                className="w-full bg-[#0f0f11] border border-zinc-800 rounded-xl px-4 py-2.5 text-white focus:border-[#ccff00] outline-none font-mono"
                placeholder="VD: 500,000"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input 
              type="checkbox" 
              id="isActive"
              checked={isActive} 
              onChange={e => setIsActive(e.target.checked)}
              className="w-4 h-4 accent-[#ccff00]"
            />
            <label htmlFor="isActive" className="text-sm font-medium cursor-pointer">Mở bán ngay</label>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 font-bold text-sm transition cursor-pointer"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="px-5 py-2.5 rounded-xl bg-[#ccff00] text-black hover:opacity-90 font-black text-sm transition cursor-pointer"
            >
              Lưu lại
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};