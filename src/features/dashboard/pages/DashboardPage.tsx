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
      const todayStr = new Date().toISOString().split('T')[0];
      let allMembers: Member[] = [];
      try {
        allMembers = await memberApi.getMembers();
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu dashboard:", error);
      }
      if (!Array.isArray(allMembers)) {
        allMembers = [];
      }

      // 1. Đọc danh sách ID hội viên đã checked hôm nay
      let checkedIds: string[] = [];
      try {
        const storedChecked = localStorage.getItem(`smartgym_checked_members_${todayStr}`);
        if (storedChecked) {
          checkedIds = JSON.parse(storedChecked);
        }
      } catch (e) {
        console.error(e);
      }

      // 2. Đọc lịch sử quét thẻ hôm nay
      let logs: any[] = [];
      try {
        const storedLogs = localStorage.getItem(`smartgym_checkin_logs_${todayStr}`);
        if (storedLogs) {
          logs = JSON.parse(storedLogs);
        }
      } catch (e) {
        console.error(e);
      }

      const activeNonDeletedMembers = allMembers.filter(m => !m.isDeleted);
      const calculated = memberApi.calculateMetrics(allMembers);

      // 3. Lấy danh sách hội viên tập hôm nay (đã checked)
      const checkedMembers = activeNonDeletedMembers.filter((m) => 
        checkedIds.includes(m.id) || (m.isCheckedToday && m.lastCheckInDate === todayStr)
      );

      const formattedRecords: AttendanceRecord[] = checkedMembers.map((member, index) => {
        const memberLog = logs.find(l => l.memberId === member.id);
        const fullName = (member.lastName && member.firstName) ? `${member.lastName} ${member.firstName}`.trim() : (member.fullName || '');
        const initial = fullName ? fullName.trim().charAt(0).toUpperCase() : 'M';
        const checkInTime = memberLog?.dateTime || member.lastCheckInTime || `${new Date().toLocaleTimeString('vi-VN')} ${new Date().toLocaleDateString('vi-VN')}`;

        return {
          no: index + 1,
          initial: initial,
          name: fullName,
          phone: member.phoneNumber,
          service: member.packageName || 'Gói tập',
          time: checkInTime,
          color: 'text-gym-neon'
        };
      });

      setAttendanceList(formattedRecords);

      // 4. Cập nhật 4 thẻ thống kê
      // - Hóa đơn mới: hiển thị số khi nhân viên tạo hội viên mới (tổng hội viên đang hoạt động)
      // - Hội viên hôm nay: hiển thị số những hội viên đã được checked
      setMetrics({
        expiringInvoicesTotal: calculated.expiring || 0,
        expiredInvoicesTotal: calculated.expired || 0,
        newInvoicesTotal: activeNonDeletedMembers.length,
        membersTodayTotal: checkedMembers.length
      });

      // 5. Lượt quét thẻ gần đây nhất
      if (logs.length > 0 || checkedMembers.length > 0) {
        let latestTarget: any = null;
        let latestLog: any = null;

        if (logs.length > 0) {
          latestLog = logs[logs.length - 1];
          latestTarget = allMembers.find(m => m.id === latestLog.memberId) || latestLog;
        } else {
          latestTarget = checkedMembers[checkedMembers.length - 1];
        }

        const fullName = (latestTarget.lastName && latestTarget.firstName) 
          ? `${latestTarget.lastName} ${latestTarget.firstName}`.trim() 
          : (latestTarget.fullName || latestTarget.name || '');

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let remainingDays = 30;
        const expiryDateStr = latestTarget.expiryDate || latestTarget.endDate;
        if (expiryDateStr) {
          let exp: Date | null = null;
          if (typeof expiryDateStr === 'string' && expiryDateStr.includes('/')) {
            const parts = expiryDateStr.split('/');
            if (parts.length === 3) {
              exp = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
            }
          } else {
            exp = new Date(expiryDateStr);
          }
          if (exp && !isNaN(exp.getTime())) {
            exp.setHours(0, 0, 0, 0);
            remainingDays = Math.max(0, Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
          }
        }

        const timeDisplay = latestLog?.time || new Date().toLocaleTimeString('vi-VN');
        const startDateDisplay = latestTarget.startDate ? new Date(latestTarget.startDate).toLocaleDateString('vi-VN') : new Date().toLocaleDateString('vi-VN');
        const endDateDisplay = expiryDateStr ? (expiryDateStr.includes('T') ? expiryDateStr.split('T')[0] : expiryDateStr) : '--';

        setLatestScan({
          name: fullName,
          phone: latestTarget.phoneNumber || latestTarget.phone || '',
          time: timeDisplay,
          service: latestTarget.packageName || latestTarget.service || 'Gói tập',
          isPaid: (latestTarget.status === 'ACTIVE' || latestTarget.status === 1 || !latestTarget.status),
          remainingDays: remainingDays,
          startDate: startDateDisplay,
          endDate: endDateDisplay
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
              <FrequencyChart records={attendanceList} />
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