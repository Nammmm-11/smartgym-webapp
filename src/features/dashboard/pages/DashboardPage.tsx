import React, { useState, useEffect } from 'react';
import { AttendanceScanner, type ScannedMember } from '../components/AttendanceScanner';
import { MetricCards, type DashboardMetrics } from '../components/MetricCards';
import { FrequencyChart } from '../components/FrequencyChart';
import { AttendanceList, type AttendanceRecord } from '../components/AttendanceList';
import { memberApi } from '../../members/api/member.api';
import type { Member } from '../../members/types/member.types';

export const DashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    expiringInvoicesTotal: 0,
    expiredInvoicesTotal: 0,
    newInvoicesTotal: 0,
    membersTodayTotal: 0
  });
  const [latestScan, setLatestScan] = useState<ScannedMember | null>(null);
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      let allMembers: Member[] = [];
      try {
        allMembers = await memberApi.getMembers();
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu dashboard:", error);
      }
      if (!Array.isArray(allMembers)) {
        allMembers = [];
      }
      const calculated = memberApi.calculateMetrics(allMembers);
      const checkedMembers = allMembers.filter((m) => m.isCheckedToday && !m.isDeleted);
      const formattedRecords: AttendanceRecord[] = checkedMembers.map((member, index) => {
        const initial = member.fullName ? member.fullName.trim().charAt(0).toUpperCase() : 'M';
        return {
          no: index + 1,
          initial: initial,
          name: member.fullName,
          phone: member.phoneNumber,
          service: member.packageName || 'Chưa đăng ký',
          time: member.lastCheckInTime || '',
          color: 'text-gym-neon'
        };
      });
      setAttendanceList(formattedRecords);
      setMetrics({
        expiringInvoicesTotal: calculated.expiring || 0,
        expiredInvoicesTotal: calculated.expired || 0,
        newInvoicesTotal: calculated.newInvoices || 0,
        membersTodayTotal: checkedMembers.length
      });
      if (checkedMembers.length > 0) {
        const latest = checkedMembers[checkedMembers.length - 1];
        const timePart = latest.lastCheckInTime ? latest.lastCheckInTime.split(' ')[0] : '';
        setLatestScan({
          name: latest.fullName,
          phone: latest.phoneNumber,
          time: timePart,
          service: latest.packageName || '',
          isPaid: true,
          remainingDays: 365,
          startDate: "",
          endDate: latest.expiryDate || ''
        });
      } else {
        setLatestScan(null);
      }
    };
    loadDashboardData();
  }, []);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#050505] text-white">
      {/* Header */}
      <div className="relative z-30 flex justify-between items-center px-8 py-6 border-b border-[#161616] bg-[#070707] flex-shrink-0">
        <div>
          <span className="text-[10px] text-gym-neon font-mono tracking-[0.2em] uppercase mb-1 block">
            FIT.GYM &nbsp;&nbsp; // &nbsp;&nbsp; HỆ THỐNG_V4
          </span>
          <h2 className="text-3xl font-black italic tracking-wider uppercase m-0 mt-0.5 text-white">
            BẢNG ĐIỀU KHIỂN
          </h2>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="p-8 flex flex-col flex-grow overflow-y-auto gap-6">
        <MetricCards metrics={metrics} />
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-6">
          <div className="flex flex-col gap-6">
            <div className="h-[280px]">
              <AttendanceScanner member={latestScan} />
            </div>
            <div className="h-[280px]">
              <FrequencyChart />
            </div>
          </div>
          
          <div className="h-[584px]">
            <AttendanceList members={attendanceList} />
          </div>
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="px-8 py-3 bg-[#060606] border-t border-[#141414] text-[9px] font-mono tracking-widest text-gray-500 uppercase flex justify-between items-center mt-auto">
        <div className="flex gap-3">
          <span>STATION_ID //</span>
          <span>HỆ THỐNG NỘI BỘ // FIT.GYM //</span>
          <span>USER: <strong className="text-gym-neon">ADMIN@FIT.COM</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-gym-neon rounded-full animate-pulse"></span>
          <span>PHIÊN LÀM VIỆC: <strong className="text-white">QUẢN TRỊ VIÊN</strong></span>
          <span className="ml-2">ID: <strong className="text-gym-neon">34047</strong></span>
        </div>
      </div>
    </div>
  );
};