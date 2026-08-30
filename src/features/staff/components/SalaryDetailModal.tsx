import React from 'react';
import { FiX, FiDollarSign, FiTrendingUp, FiUserCheck, FiCalendar, FiPackage, FiAward } from 'react-icons/fi';
import type { StaffMember } from '../types/staff.types';

export interface MemberRegistrationRecord {
  id: string;
  memberFullName: string;
  memberPhone: string;
  packageName: string;
  amount: number;
  date: string;
}

interface SalaryDetailModalProps {
  isOpen: boolean;
  staff: StaffMember | null;
  onClose: () => void;
}

export const SalaryDetailModal: React.FC<SalaryDetailModalProps> = ({
  isOpen,
  staff,
  onClose
}) => {
  if (!isOpen || !staff) return null;

  // Lấy lịch sử hội viên đã đăng ký qua nhân viên này từ localStorage
  const getStaffRegistrations = (): MemberRegistrationRecord[] => {
    try {
      const stored = localStorage.getItem(`smartgym_staff_sales_${staff.id}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  };

  const registrations = getStaffRegistrations();
  
  // Tính tổng doanh thu tích lũy từ danh sách hội viên đăng ký qua nhân viên này
  const accumulatedRevenueFromSales = registrations.reduce((acc, r) => acc + r.amount, 0);
  
  // Sử dụng doanh thu tích lũy thực tế hoặc ptRevenue hiện tại
  const totalRevenue = Math.max(staff.ptRevenue || 0, accumulatedRevenueFromSales);
  
  // Tính hoa hồng (10% doanh thu tích lũy nếu là Lễ tân/PT)
  const estimatedCommission = Math.round(totalRevenue * 0.10);
  
  // Tổng thu nhập thực nhận = Lương cứng + Doanh thu/Hoa hồng
  const totalIncome = staff.salary + (staff.role === 'TRAINER' ? totalRevenue : estimatedCommission);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#09090c] border border-[#1f1f26] rounded-3xl p-6 shadow-2xl relative my-8 text-white flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-[#1c1c24]">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gym-neon/10 text-gym-neon border border-gym-neon/20">
              <FiDollarSign size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black italic tracking-wide uppercase m-0 text-white">
                  CHI TIẾT LƯƠNG & DOANH THU TÍCH LŨY
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gym-neon/20 text-gym-neon border border-gym-neon/30 font-bold">
                  {staff.staffCode}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono tracking-widest uppercase m-0 mt-0.5">
                NHÂN VIÊN: <span className="text-white font-bold">{staff.fullName}</span> ({staff.role === 'RECEPTIONIST' ? 'NHÂN VIÊN QUẦY' : 'HUẤN LUYỆN VIÊN PT'})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#14141a] border border-[#22222d] flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Top 3 Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Lương cứng */}
          <div className="bg-[#0f0f14] border border-[#22222d] rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">LƯƠNG CỨNG</span>
              <FiAward size={16} className="text-blue-400" />
            </div>
            <p className="text-xl font-black text-white font-mono m-0 mt-2">
              {staff.salary.toLocaleString('vi-VN')} đ
            </p>
            <span className="text-[10px] text-gray-500 font-mono italic mt-1">Cố định hàng tháng</span>
          </div>

          {/* Doanh thu tích lũy */}
          <div className="bg-[#0f0f14] border border-[#22222d] rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">DOANH THU TÍCH LŨY</span>
              <FiTrendingUp size={16} className="text-gym-neon" />
            </div>
            <p className="text-xl font-black text-gym-neon font-mono m-0 mt-2">
              {totalRevenue.toLocaleString('vi-VN')} đ
            </p>
            <span className="text-[10px] text-gym-neon/80 font-mono italic mt-1">Từ {registrations.length} lượt đăng ký</span>
          </div>

          {/* Tổng thu nhập ước tính */}
          <div className="bg-[#0f0f14] border border-[#22222d] rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">TỔNG LƯƠNG NHẬN</span>
              <FiDollarSign size={16} className="text-teal-400" />
            </div>
            <p className="text-xl font-black text-teal-400 font-mono m-0 mt-2">
              {totalIncome.toLocaleString('vi-VN')} đ
            </p>
            <span className="text-[10px] text-gray-500 font-mono italic mt-1">Gồm lương + thưởng/doanh thu</span>
          </div>
        </div>

        {/* Bảng danh sách Hội viên đã đăng ký tạo doanh thu cho nhân viên này */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono uppercase tracking-widest text-gray-300 m-0 flex items-center gap-2">
              <FiUserCheck className="text-gym-neon" /> LỊCH SỬ ĐĂNG KÝ HỘI VIÊN TÍCH LŨY DOANH THU ({registrations.length})
            </h4>
          </div>

          <div className="bg-[#060608] border border-[#1a1a22] rounded-2xl max-h-56 overflow-y-auto p-2">
            {registrations.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-xs font-mono">
                Chưa có giao dịch đăng ký hội viên mới nào được ghi nhận cho nhân viên này.
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                {registrations.map((reg, index) => (
                  <div
                    key={reg.id || index}
                    className="bg-[#0d0d12] border border-[#181822] hover:border-gym-neon/30 rounded-xl p-3 flex items-center justify-between transition-colors text-xs font-mono"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-gym-neon/10 text-gym-neon font-black flex items-center justify-center text-xs">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-bold text-white uppercase m-0">{reg.memberFullName}</p>
                        <p className="text-[10px] text-gray-500 m-0 flex items-center gap-2">
                          <span>SĐT: {reg.memberPhone}</span>
                          <span className="flex items-center gap-1"><FiCalendar size={10} /> {reg.date}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-gym-neon font-black m-0">+{reg.amount.toLocaleString('vi-VN')} đ</p>
                      <p className="text-[10px] text-gray-400 uppercase italic m-0 flex items-center gap-1 justify-end">
                        <FiPackage size={10} /> {reg.packageName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-[#1c1c24]">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gym-neon text-black font-black uppercase text-xs tracking-wider hover:bg-[#b3e600] transition-colors cursor-pointer"
          >
            ĐÓNG
          </button>
        </div>

      </div>
    </div>
  );
};
