import React, { useState, useEffect } from 'react';
import { MemberMetricCards } from '../components/MemberMetricCards';
import { MemberFilterBar } from '../components/MemberFilterBar';
import { MemberCardRow } from '../components/MemberCardRow';
import { CreateMemberModal } from '../components/CreateMemberModal';
import { EditMemberModal } from '../components/EditMemberModal';
import { TrashModal } from '../components/TrashModal';
import { MemberDetailModal } from '../components/MemberDetailModal';
import { FooterStatusBar } from '../components/FooterStatusBar';
import { ToastNotification } from '../../../components/common/ToastNotification';
import { memberApi } from '../api/member.api';
import { staffApi } from '../../staff/api/staff.api';
import type { Member, MemberFilterType } from '../types/member.types';
import type { StaffMember } from '../../staff/types/staff.types';
import { FiUsers } from 'react-icons/fi';

export const MembersPage: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<MemberFilterType>('ALL');
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [interactingMember, setInteractingMember] = useState<Member | null>(null);
  const [isTrashOpen, setIsTrashOpen] = useState(false);

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadMembers = async () => {
    try {
      const [memberData, staffData] = await Promise.all([
        memberApi.getMembers(),
        staffApi.getStaffs()
      ]);

      // Tạo bảng ánh xạ tra cứu tên nhân viên theo StaffId và UserId
      const staffMap = new Map<string, string>();
      staffData.forEach((s: StaffMember) => {
        if (s.id) staffMap.set(String(s.id).toLowerCase(), s.fullName);
        if (s.userId) staffMap.set(String(s.userId).toLowerCase(), s.fullName);
      });

      const enrichedMembers = memberData.map((m: any) => {
        let staffName = m.assignedStaff || m.staffName;
        if (!staffName && m.assignedStaffId) {
          staffName = staffMap.get(String(m.assignedStaffId).toLowerCase());
        }
        return {
          ...m,
          assignedStaff: staffName || m.assignedStaff || m.staffName || 'Chưa phân công'
        };
      });

      setMembers(enrichedMembers);
    } catch (error) {
      console.error("Lỗi khi tải danh sách hội viên:", error);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  // Lấy ngày hiện tại YYYY-MM-DD theo giờ thực tế của máy chủ/người dùng
  const todayStr = new Date().toISOString().split('T')[0];

  const [checkedMemberIds, setCheckedMemberIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(`smartgym_checked_members_${todayStr}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const metrics = {
    ...memberApi.calculateMetrics(members),
    checkInToday: checkedMemberIds.filter(id => members.some(m => m.id === id && !m.isDeleted)).length
  };
  const trashCount = members.filter((m) => m.isDeleted).length;
  const deletedMembersList = members.filter((m) => m.isDeleted);

  const filteredMembers = members.filter((member) => {
    if (member.isDeleted) return false;
    if (activeFilter === 'ACTIVE' && member.status !== 'ACTIVE') return false;
    if (activeFilter === 'EXPIRED' && member.status !== 'EXPIRED') return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      const matchName = member.fullName.toLowerCase().includes(q);
      const matchCode = member.memberCode?.toLowerCase().includes(q) || false;
      const matchPhone = member.phoneNumber.includes(q);
      const matchEmail = member.email.toLowerCase().includes(q);
      return matchName || matchCode || matchPhone || matchEmail;
    }
    return true;
  });

  const handleAddMember = async (newMemberData: Omit<Member, 'id' | 'memberCode' | 'isDeleted'>) => {
    try {
      const res = await memberApi.createMember(newMemberData);
      if (res && res.isSuccess === false) {
        showToast(`Lỗi: ${res.message || 'Không thể tạo hội viên'}`, 'error');
        return;
      }
      await loadMembers();
      setIsCreateOpen(false);
      showToast('✓ Đã tạo thành công hội viên!');
    } catch (error: any) {
      console.error("Lỗi thêm hội viên:", error);
      const serverMsg = error.response?.data?.message || error.response?.data || error.message;
      showToast(`Không thể thêm hội viên: ${typeof serverMsg === 'object' ? JSON.stringify(serverMsg) : serverMsg}`, 'error');
    }
  };

  const handleUpdateMember = async (updatedMember: Member, isRenewal: boolean = false) => {
    try {
      await memberApi.updateMember(updatedMember.id, updatedMember);
      await loadMembers();
      setEditingMember(null);
      if (isRenewal) {
        showToast('✓ Đã gia hạn gói tập thành công!');
      } else {
        showToast('✓ Đã cập nhật thông tin hội viên!');
      }
    } catch (error) {
      console.error("Lỗi cập nhật hội viên:", error);
      showToast("Không thể cập nhật hội viên. Vui lòng thử lại!", "error");
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (window.confirm("Bạn có chắc muốn chuyển hội viên vào thùng rác?")) {
      try {
        await memberApi.deleteMember(id);
        await loadMembers();
        showToast('✓ Đã chuyển hội viên vào thùng rác!');
      } catch (error) {
        console.error("Lỗi xóa hội viên:", error);
        showToast("Không thể xóa hội viên.", "error");
      }
    }
  };

  const handleRestoreMember = async (id: string) => {
    try {
      await memberApi.restoreMember(id);
      await loadMembers();
      showToast('✓ Đã khôi phục hội viên thành công!');
    } catch (error) {
      console.error("Lỗi khôi phục hội viên:", error);
    }
  };

  const handleCheckIn = (id: string) => {
    const target = members.find((m) => m.id === id);
    if (!target) return;
    if (target.status === 'EXPIRED') {
      showToast('Hội viên đã hết hạn, không thể check-in!', 'error');
      return;
    }
    
    const isCurrentlyChecked = checkedMemberIds.includes(id);
    const nextCheckedList = isCurrentlyChecked
      ? checkedMemberIds.filter((mId) => mId !== id)
      : [...checkedMemberIds, id];

    setCheckedMemberIds(nextCheckedList);
    try {
      localStorage.setItem(`smartgym_checked_members_${todayStr}`, JSON.stringify(nextCheckedList));

      const storedLogs = localStorage.getItem(`smartgym_checkin_logs_${todayStr}`);
      let logs = storedLogs ? JSON.parse(storedLogs) : [];
      if (!isCurrentlyChecked) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const dateStr = now.toLocaleDateString('vi-VN');
        const newLog = {
          memberId: id,
          memberName: target.fullName,
          memberCode: target.memberCode,
          packageName: target.packageName,
          time: timeStr,
          dateTime: `${timeStr} ${dateStr}`,
          status: 'SUCCESS'
        };
        logs.unshift(newLog);
        localStorage.setItem(`smartgym_checkin_logs_${todayStr}`, JSON.stringify(logs));
        showToast(`✓ Check-in thành công: ${target.fullName}`);
      } else {
        logs = logs.filter((l: any) => l.memberId !== id);
        localStorage.setItem(`smartgym_checkin_logs_${todayStr}`, JSON.stringify(logs));
        showToast(`✓ Đã hủy check-in: ${target.fullName}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditMember = (member: Member) => {
    setEditingMember(member);
  };

  const handleInteract = (member: Member) => {
    setInteractingMember(member);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#050505] text-white">
      {/* Toast Notification */}
      <ToastNotification message={toastMessage} type={toastType} />

      {/* Header Bar */}
      <div className="relative z-30 px-8 py-5 border-b border-[#141414] bg-[#070707] flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="text-xl font-black italic tracking-wider uppercase text-white m-0 flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-gym-neon animate-pulse shadow-[0_0_10px_#ccff00]"></span>
            QUẢN LÝ HỘI VIÊN
          </h1>
          <p className="text-[11px] font-mono text-gray-500 uppercase tracking-widest mt-1">
            DANH SÁCH & TRẠNG THÁI HỘI VIÊN TOÀN HỆ THỐNG
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-6">
        {/* Metric Cards */}
        <MemberMetricCards metrics={metrics} />

        {/* Filter Bar */}
        <MemberFilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          metrics={metrics}
          trashCount={trashCount}
          onAddClick={() => setIsCreateOpen(true)}
        />

        {/* Danh sách Hội viên */}
        <div className="flex flex-col gap-3">
          {filteredMembers.length === 0 ? (
            <div className="bg-[#0b0b0e] border border-[#181820] rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3 text-gray-500">
              <FiUsers size={36} className="opacity-40 text-gym-neon" />
              <p className="text-sm font-mono uppercase tracking-wider text-gray-400 font-bold m-0">
                KHÔNG TÌM THẤY HỘI VIÊN NÀO PHÙ HỢP
              </p>
            </div>
          ) : (
            filteredMembers.map((member) => {
              const isChecked = checkedMemberIds.includes(member.id);
              const memberWithChecked = { ...member, isCheckedToday: isChecked };

              return (
                <MemberCardRow
                  key={member.id}
                  member={memberWithChecked}
                  onEdit={handleEditMember}
                  onDelete={handleDeleteMember}
                  onRestore={handleRestoreMember}
                  onCheckIn={handleCheckIn}
                  onInteract={handleInteract}
                />
              );
            })
          )}
        </div>
      </div>
      <FooterStatusBar />

      <CreateMemberModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleAddMember}
      />
      {editingMember && (
        <EditMemberModal
          isOpen={!!editingMember}
          member={editingMember}
          onClose={() => setEditingMember(null)}
          onSubmit={(updated) => handleUpdateMember(updated, false)}
        />
      )}
      <TrashModal
        isOpen={isTrashOpen}
        onClose={() => setIsTrashOpen(false)}
        deletedMembers={deletedMembersList}
        onRestore={handleRestoreMember}
      />
      <MemberDetailModal
        isOpen={!!interactingMember}
        member={interactingMember}
        onClose={() => setInteractingMember(null)}
        onUpdateMember={(updated) => handleUpdateMember(updated, true)}
      />
    </div>
  );
};