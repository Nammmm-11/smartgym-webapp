import React, { useEffect, useState } from 'react';
import { gymPackageService, type GymPackageDto } from '../services/gymPackage.service';
import { GymPackageModal } from '../components/GymPackageModal';

export const GymPackageManagerPage: React.FC = () => {
  const [packages, setPackages] = useState<GymPackageDto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<GymPackageDto | null>(null);
  
  const fetchPackages = async () => {
    try {
      const res = await gymPackageService.getAll(1, 20);
      if (res.isSuccess) { // Sửa từ res.succeeded thành res.isSuccess
        setPackages(res.data.items);
      }
    } catch (error) {
      console.error("Lỗi tải dữ liệu gói tập:", error);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleOpenCreate = () => {
    setSelectedPackage(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pkg: GymPackageDto) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (window.confirm("Bạn có chắc chắn muốn xóa gói tập này không?")) {
      try {
        const res = await gymPackageService.delete(id);
        if (res.isSuccess) { // <-- Sửa từ res.succeeded thành res.isSuccess
          fetchPackages();
        }
      } catch (error) {
        console.error("Lỗi khi xóa:", error);
      }
    }
  };

  const handleFormSubmit = async (data: GymPackageDto) => {
    try {
      if (data.id) {
        await gymPackageService.update(data.id, data);
      } else {
        await gymPackageService.create(data);
      }
      setIsModalOpen(false);
      fetchPackages();
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white p-8 font-sans">
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs tracking-widest text-zinc-400 font-semibold">FIT.GYM — SYSTEM_V4</span>
        <h1 className="text-3xl font-black tracking-wider text-white mt-1">QUẢN LÝ GÓI TẬP</h1>
      </div>

      {/* Grid danh sách */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. NÚT THÊM GÓI MỚI */}
        <div 
          onClick={handleOpenCreate}
          className="bg-[#ccff00] rounded-2xl p-6 flex flex-col items-center justify-center text-black cursor-pointer hover:opacity-95 transition min-h-[220px] shadow-lg select-none"
        >
          <div className="w-12 h-12 bg-black text-[#ccff00] rounded-xl flex items-center justify-center text-2xl font-bold mb-3 shadow">
            +
          </div>
          <h2 className="text-lg font-black tracking-wide">THÊM GÓI MỚI</h2>
          <span className="text-xs font-semibold text-zinc-800 mt-1">MÔ-ĐUN: CẤU HÌNH GÓI</span>
        </div>

        {/* 2. NÚT ĐỒNG BỘ GÓI TẬP */}
        <div 
          onClick={() => alert("Tính năng đồng bộ giá & tên gói cho hội viên đã kích hoạt!")}
          className="border-2 border-dashed border-[#ccff00]/60 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#ccff00] transition min-h-[220px] bg-[#161618]/50 select-none"
        >
          <div className="w-12 h-12 bg-[#1c1c1e] text-[#ccff00] rounded-xl flex items-center justify-center text-xl mb-3 border border-zinc-800">
            🔄
          </div>
          <h2 className="text-lg font-bold tracking-wide text-white">ĐỒNG BỘ GÓI TẬP</h2>
          <p className="text-xs text-zinc-400 text-center mt-2 px-4 leading-relaxed">
            Cập nhật các thay đổi về tên & đơn giá gói tập đến toàn bộ hội viên đã đăng ký...
          </p>
        </div>

        {/* 3. DANH SÁCH THẺ GÓI TẬP LẤY TỪ BACKEND */}
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-[#161618] border border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-between relative shadow-xl hover:border-zinc-700 transition">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="bg-[#ccff00] text-black text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  {pkg.isActive ? "MỞ BÁN" : "TẠM DỪNG"}
                </span>
                <span className="text-xs text-zinc-400 flex items-center gap-1 bg-zinc-900 px-2.5 py-1 rounded-full border border-zinc-800">
                  ⏱ {pkg.durationInMonths} THÁNG
                </span>
              </div>

              <h2 className="text-lg font-black tracking-wide text-white uppercase italic">{pkg.name}</h2>
              <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{pkg.description}</p>
            </div>

            <div>
              <div className="border-t border-zinc-800 my-4"></div>
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">Mô hình định giá</span>
                  <span className="text-xl font-black text-white tracking-tight">
                    {formatCurrency(pkg.price)} <span className="text-xs text-[#ccff00] font-bold">VNĐ</span>
                  </span>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleOpenEdit(pkg)}
                    className="w-9 h-9 bg-[#222225] hover:bg-zinc-700 text-zinc-300 rounded-xl flex items-center justify-center transition border border-zinc-800"
                    title="Chỉnh sửa"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => handleDelete(pkg.id)}
                    className="w-9 h-9 bg-[#222225] hover:bg-red-950/50 text-red-400 rounded-xl flex items-center justify-center transition border border-zinc-800"
                    title="Xóa"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

      </div>

      {/* Modal Thêm / Sửa */}
      <GymPackageModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedPackage}
      />
    </div>
  );
};