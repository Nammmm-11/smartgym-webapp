import React, { useState, useEffect, useMemo } from 'react';
import { FiX, FiDollarSign, FiTrendingUp, FiUserCheck, FiCalendar, FiPackage, FiAward } from 'react-icons/fi';
import type { StaffMember } from '../types/staff.types';
import { memberApi } from '../../members/api/member.api';
import type { Member } from '../../members/types/member.types';
import { gymPackageService, type GymPackageDto } from '../../gymPackages/services/gymPackage.service';

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
  const [realMembers, setRealMembers] = useState<Member[]>([]);
  const [packages, setPackages] = useState<GymPackageDto[]>([]);

  useEffect(() => {
    if (isOpen && staff) {
      memberApi.getMembers().then((members) => {
        setRealMembers(members || []);
      }).catch((e) => console.error(e));

      gymPackageService.getAll().then((res) => {
        if (res?.data?.items) {
          setPackages(res.data.items);
        }
      }).catch((e) => console.error(e));
    }
  }, [isOpen, staff]);

  const registrations: MemberRegistrationRecord[] = useMemo(() => {
    if (!staff) return [];

    // 1. Khớp từ danh sách hội viên thực tế trong Database
    const matchedMembers = realMembers.filter((m) => {
      if (m.isDeleted) return false;
      if (m.assignedStaffId && (m.assignedStaffId === staff.id || (staff.userId && m.assignedStaffId === staff.userId))) return true;
      if (m.assignedStaff && m.assignedStaff.trim().toLowerCase() === staff.fullName.trim().toLowerCase()) return true;
      return false;
    });

    if (matchedMembers.length > 0) {
      return matchedMembers.map((m) => {
        let amount = 0;
        if (m.packageDiscount) {
          const parsed = parseInt(m.packageDiscount.replace(/\D/g, ''), 10);
          if (!isNaN(parsed) && parsed > 0) amount = parsed;
        }
        
        if (amount === 0) {
          const matchedPkg = packages.find(p => p.name?.trim().toLowerCase() === m.packageName?.trim().toLowerCase());
          if (matchedPkg && matchedPkg.price > 0) {
            amount = matchedPkg.price;
          } else if (m.packageName?.toLowerCase().includes('3 tháng')) {
            amount = 900000;
          } else {
            amount = 300000;
          }
        }

        return {
          id: m.id,
          memberFullName: m.fullName,
          memberPhone: m.phoneNumber,
          packageName: m.packageName || 'Gói tập',
          amount: amount,
          date: m.startDate ? new Date(m.startDate).toLocaleDateString('vi-VN') : (m.createdAt ? new Date(m.createdAt).toLocaleDateString('vi-VN') : '31/8/2026')
        };
      });
    }

    // 2. Kiểm tra localStorage và chỉ giữ các hội viên thực sự có trong Database
    try {
      const stored = localStorage.getItem(`smartgym_staff_sales_${staff.id}`);
      if (stored) {
        const localList: MemberRegistrationRecord[] = JSON.parse(stored);
        return localList.filter(l => realMembers.some(rm => !rm.isDeleted && (rm.fullName.toLowerCase() === l.memberFullName.toLowerCase() || rm.phoneNumber === l.memberPhone)));
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  }, [realMembers, packages, staff]);

  if (!isOpen || !staff) return null;
  
  // 1. Tính tổng doanh thu tích lũy thật từ danh sách hội viên do nhân viên phụ trách
  const totalRevenue = registrations.reduce((acc, r) => acc + r.amount, 0);
  
  // 2. Tỷ lệ hoa hồng 10% cho mỗi hội viên
  const commissionRate = 0.10;
  const commissionAmount = Math.round(totalRevenue * commissionRate);
  
  // 3. Tổng lương thực nhận = Lương cứng + Tiền hoa hồng 10%
  const totalIncome = staff.salary + commissionAmount;

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

          {/* Doanh thu tích lũy từ hội viên */}
          <div className="bg-[#0f0f14] border border-[#22222d] rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">DOANH THU TÍCH LŨY TỪ HỘI VIÊN</span>
              <FiTrendingUp size={16} className="text-gym-neon" />
            </div>
            <p className="text-xl font-black text-gym-neon font-mono m-0 mt-2">
              {totalRevenue.toLocaleString('vi-VN')} đ
            </p>
            <span className="text-[10px] text-gym-neon/80 font-mono italic mt-1">
              Từ {registrations.length} lượt đăng ký hội viên
            </span>
          </div>

          {/* Tổng thu nhập thực nhận */}
          <div className="bg-[#0f0f14] border border-[#22222d] rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">TỔNG LƯƠNG NHẬN</span>
              <FiDollarSign size={16} className="text-teal-400" />
            </div>
            <p className="text-xl font-black text-teal-400 font-mono m-0 mt-2">
              {totalIncome.toLocaleString('vi-VN')} đ
            </p>
            <span className="text-[10px] text-gray-500 font-mono italic mt-1">Lương cứng + 10% doanh thu tích lũy</span>
          </div>
        </div>

        {/* Bảng danh sách Hội viên đã đăng ký tạo doanh thu cho nhân viên này */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono uppercase tracking-widest text-gray-300 m-0 flex items-center gap-2">
              <FiUserCheck className="text-gym-neon" /> DANH SÁCH HỘI VIÊN PHỤ TRÁCH & DOANH THU ({registrations.length})
            </h4>
          </div>

          <div className="bg-[#060608] border border-[#1a1a22] rounded-2xl max-h-56 overflow-y-auto p-2">
            {registrations.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-xs font-mono">
                Chưa có giao dịch đăng ký hội viên mới nào được ghi nhận cho nhân viên này.
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                {registrations.map((reg, index) => {
                  const itemCommission = Math.round(reg.amount * commissionRate);
                  return (
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
                          <FiPackage size={10} /> {reg.packageName} &nbsp;•&nbsp; <span className="text-gym-neon font-bold tracking-wide">HH (10%): +{itemCommission.toLocaleString('vi-VN')} đ</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
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
