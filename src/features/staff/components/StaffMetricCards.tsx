import React from 'react';
import { FiBriefcase, FiActivity, FiUsers, FiAward, FiTrendingUp, FiDollarSign } from 'react-icons/fi';
import type { StaffMetrics } from '../types/staff.types';

interface StaffMetricCardsProps {
  metrics: StaffMetrics;
  type: 'receptionist' | 'trainer';
}

export const StaffMetricCards: React.FC<StaffMetricCardsProps> = ({ metrics, type }) => {
  if (type === 'trainer') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="relative bg-[#09090b] border border-[#1f1f23] rounded-2xl p-5 overflow-hidden flex flex-col justify-between group hover:border-[#2f2f35] transition-all">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 via-teal-400 to-gym-neon"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-gray-400 font-mono tracking-[0.2em] uppercase m-0">TOTAL INSTRUCTORS</p>
              <h3 className="text-3xl font-black tracking-tight text-white m-0 mt-2">{metrics.totalTrainers ?? 0}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#121216] border border-[#222228] flex items-center justify-center text-blue-400">
              <FiBriefcase size={18} />
            </div>
          </div>
          <p className="text-[11px] text-gray-500 font-mono italic mt-4 m-0">Đội ngũ có hồ sơ hoạt động</p>
        </div>

        {/* Card 2 */}
        <div className="relative bg-[#09090b] border border-[#1f1f23] rounded-2xl p-5 overflow-hidden flex flex-col justify-between group hover:border-[#2f2f35] transition-all">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-purple-600 via-pink-500 to-gym-neon"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-gray-400 font-mono tracking-[0.2em] uppercase m-0">HỘI VIÊN TIÊU BIỂU</p>
              <h3 className="text-3xl font-black tracking-tight text-white m-0 mt-2">{metrics.activeMembers ?? 0}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#121216] border border-[#222228] flex items-center justify-center text-purple-400">
              <FiUsers size={18} />
            </div>
          </div>
          <p className="text-[11px] text-gray-500 font-mono italic mt-4 m-0">Đang trong hợp đồng đào tạo</p>
        </div>

        {/* Card 3 */}
        <div className="relative bg-[#09090b] border border-[#1f1f23] rounded-2xl p-5 overflow-hidden flex flex-col justify-between group hover:border-[#2f2f35] transition-all">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-teal-500 via-gym-neon to-lime-400"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-gray-400 font-mono tracking-[0.2em] uppercase m-0">DOANH THU KHÓA TẬP</p>
              <h3 className="text-2xl font-black tracking-tight text-gym-neon m-0 mt-2">{metrics.ptRevenue ?? '0đ'}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#121216] border border-[#222228] flex items-center justify-center text-gym-neon">
              <FiTrendingUp size={18} />
            </div>
          </div>
          <p className="text-[11px] text-gym-neon font-mono italic mt-4 m-0">Tổng doanh thu PT đạt được</p>
        </div>

        {/* Card 4 */}
        <div className="relative bg-[#09090b] border border-[#1f1f23] rounded-2xl p-5 overflow-hidden flex flex-col justify-between group hover:border-[#2f2f35] transition-all">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-lime-400 via-green-500 to-emerald-400"></div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-gray-400 font-mono tracking-[0.2em] uppercase m-0">HOA HỒNG PHẢI TRẢ</p>
              <h3 className="text-2xl font-black tracking-tight text-teal-400 m-0 mt-2">{metrics.commission ?? '0đ'}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#121216] border border-[#222228] flex items-center justify-center text-teal-400">
              <FiDollarSign size={18} />
            </div>
          </div>
          <p className="text-[11px] text-gray-500 font-mono italic mt-4 m-0">Theo tỉ lệ trích xuất cá nhân</p>
        </div>
      </div>
    );
  }

  // Receptionist Metrics (Ảnh 1)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div className="relative bg-[#09090b] border border-[#1f1f23] rounded-2xl p-5 overflow-hidden flex flex-col justify-between group hover:border-[#2f2f35] transition-all">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-500 via-yellow-500 to-gym-neon"></div>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] text-gray-400 font-mono tracking-[0.2em] uppercase m-0">TỔNG NHẬN</p>
            <h3 className="text-2xl font-black tracking-tight text-gym-neon m-0 mt-2">{metrics.totalSalary}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#121216] border border-[#222228] flex items-center justify-center text-gym-neon">
            <FiDollarSign size={18} />
          </div>
        </div>
        <p className="text-[11px] text-gray-500 font-mono italic mt-4 m-0">Chi phí nhân sự tháng này</p>
      </div>

      <div className="relative bg-[#09090b] border border-[#1f1f23] rounded-2xl p-5 overflow-hidden flex flex-col justify-between group hover:border-[#2f2f35] transition-all">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-400 via-gym-neon to-lime-500"></div>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] text-gray-400 font-mono tracking-[0.2em] uppercase m-0">CHẤM CÔNG</p>
            <h3 className="text-3xl font-black tracking-tight text-white m-0 mt-2">{metrics.attendanceCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#121216] border border-[#222228] flex items-center justify-center text-gym-neon">
            <FiActivity size={18} />
          </div>
        </div>
        <p className="text-[11px] text-gray-500 font-mono italic mt-4 m-0">Nhân viên hiện có mặt trực ca</p>
      </div>

      <div className="relative bg-[#09090b] border border-[#1f1f23] rounded-2xl p-5 overflow-hidden flex flex-col justify-between group hover:border-[#2f2f35] transition-all">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400"></div>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] text-gray-400 font-mono tracking-[0.2em] uppercase m-0">TỔNG NHÂN SỰ</p>
            <h3 className="text-3xl font-black tracking-tight text-blue-400 m-0 mt-2">{metrics.totalStaff}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#121216] border border-[#222228] flex items-center justify-center text-blue-400">
            <FiUsers size={18} />
          </div>
        </div>
        <p className="text-[11px] text-gray-500 font-mono italic mt-4 m-0">Đội ngũ vận hành phòng máy</p>
      </div>

      <div className="relative bg-[#09090b] border border-[#1f1f23] rounded-2xl p-5 overflow-hidden flex flex-col justify-between group hover:border-[#2f2f35] transition-all">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-purple-500 via-fuchsia-500 to-gray-500"></div>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] text-gray-400 font-mono tracking-[0.2em] uppercase m-0">ĐÃ HOÀN THÀNH CA</p>
            <h3 className="text-3xl font-black tracking-tight text-purple-400 m-0 mt-2">{metrics.completedShifts}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#121216] border border-[#222228] flex items-center justify-center text-purple-400">
            <FiAward size={18} />
          </div>
        </div>
        <p className="text-[11px] text-gray-500 font-mono italic mt-4 m-0">Lượt trực hoàn tất hôm nay</p>
      </div>
    </div>
  );
};