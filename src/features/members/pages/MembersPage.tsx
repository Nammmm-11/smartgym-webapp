import React, { useState, useEffect } from 'react';
import { MemberMetricCards } from '../components/MemberMetricCards';
import { MemberFilterBar } from '../components/MemberFilterBar';
import { MemberCardRow } from '../components/MemberCardRow';
import { CreateMemberModal } from '../components/CreateMemberModal';
import { EditMemberModal } from '../components/EditMemberModal';
import { TrashModal } from '../components/TrashModal';
import { FooterStatusBar } from '../components/FooterStatusBar';
import { memberApi } from '../api/member.api';
import { staffApi } from '../../staff/api/staff.api';
import type { Member, MemberFilterType } from '../types/member.types';
import type { StaffMember } from '../../staff/types/staff.types';
import { FiUsers } from 'react-icons/fi';

export const MembersPage: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [staffs, setStaffs] = useState<StaffMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<MemberFilterType>('ALL');
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [isTrashOpen, setIsTrashOpen] = useState(false);

  const loadMembers = async () => {
    try {
      const [memberData, staffData] = await Promise.all([
        memberApi.getMembers(),
        staffApi.getStaffs()
      ]);
      setMembers(memberData);
      setStaffs(staffData);
    } catch (error) {
      console.error("Lỗi khi tải danh sách hội viên:", error);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const metrics = memberApi.calculateMetrics(members);
  const trashCount = members.filter((m) => m.isDeleted).length;
  const deletedMembersList = members.filter((m) => m.isDeleted);

  // Lấy ngày hiện tại YYYY-MM-DD theo giờ thực tế của máy chủ/người dùng
  const todayStr = new Date().toISOString().split('T')[0];

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
        alert(`Lỗi tạo hội viên: ${res.message || 'Mã hoặc thông tin hội viên không hợp lệ'}`);
        return;
      }
      await loadMembers();
      setIsCreateOpen(false);
    } catch (error: any) {
      console.error("Lỗi thêm hội viên:", error);
      const serverMsg = error.response?.data?.message || error.response?.data || error.message;
      alert(`Không thể thêm hội viên. Chi tiết từ Server: ${typeof serverMsg === 'object' ? JSON.stringify(serverMsg) : serverMsg}`);
    }
  };

  const handleUpdateMember = async (updatedMember: Member) => {
    try {
      await memberApi.updateMember(updatedMember.id, updatedMember);
      await loadMembers();
      setEditingMember(null);
    } catch (error) {
      console.error("Lỗi cập nhật hội viên:", error);
      alert("Không thể cập nhật hội viên. Vui lòng thử lại!");
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (window.confirm("Bạn có chắc muốn chuyển hội viên vào thùng rác?")) {
      try {
        await memberApi.deleteMember(id);
        await loadMembers();
      } catch (error) {
        console.error("Lỗi xóa hội viên:", error);
        alert("Không thể xóa hội viên.");
      }
    }
  };

  const handleRestoreMember = async (id: string) => {
    try {
      await memberApi.restoreMember(id);
      await loadMembers();
    } catch (error) {
      console.error("Lỗi khôi phục hội viên:", error);
    }
  };

  const handleCheckIn = async (id: string) => {
    const target = members.find((m) => m.id === id);
    if (!target) return;
    if (target.status === 'EXPIRED') {
      alert('Hội viên đã hết hạn, không thể check-in!');
      return;
    }
    const currentTime = new Date().toLocaleTimeString('en-GB');
    const currentDate = new Date().toLocaleDateString('en-GB');
    
    // Lưu ngày check-in thực tế dưới dạng YYYY-MM-DD
    const newCheckState = !(target.isCheckedToday && target.lastCheckInDate === todayStr);

    try {
      await memberApi.updateMember(id, {
        ...target,
        isCheckedToday: newCheckState,
        lastCheckInDate: todayStr,
        lastCheckInTime: `${currentTime} ${currentDate}`
      });
      await loadMembers();
      if (newCheckState) {
        alert(`CHECK-IN THÀNH CÔNG CHO ${target.fullName}`);
      }
    } catch (error) {
      console.error("Lỗi khi check-in:", error);
    }
  };

  const handleInteract = (member: Member) => {
    alert(`Tương tác với hội viên: ${member.fullName} (${member.phoneNumber})`);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#050505] text-white">
      {/* TOP HEADER */}
      <div className="relative z-30 px-8 py-5 border-b border-[#141414] bg-[#070707] flex justify-between items-center flex-shrink-0">
        <div className="relative z-10">
          <span className="text-[10px] text-gray-500 font-mono tracking-[0.25em] uppercase">
            FIT.GYM // SYSTEM_V4
          </span>
          <h1 className="text-2xl lg:text-3xl font-black italic tracking-wide uppercase m-0 mt-1 text-white flex items-center gap-2">
            DANH SÁCH HỘI VIÊN
          </h1>
        </div>
      </div>

      {/* MAIN SCROLLABLE CONTENT */}
      <div className="p-8 flex flex-col gap-5 flex-grow overflow-y-auto">
        <MemberMetricCards metrics={metrics} />
        <MemberFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          activeFilter={activeFilter}
          onFilterChange={(filter) => {
            if (filter === 'TRASH') {
              setIsTrashOpen(true);
            } else {
              setActiveFilter(filter);
            }
          }}
          metrics={metrics}
          trashCount={trashCount}
          onAddClick={() => setIsCreateOpen(true)}
        />
        <div className="flex flex-col gap-3 pb-4">
          {filteredMembers.length === 0 ? (
            <div className="bg-[#080808] border border-dashed border-[#1c1c1c] rounded-2xl p-12 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-[#121212] flex items-center justify-center text-gray-600 mb-3">
                <FiUsers size={24} />
              </div>
              <p className="text-xs font-mono text-gray-500 tracking-widest uppercase m-0">
                KHÔNG TÌM THẤY HỘI VIÊN
              </p>
            </div>
          ) : (
            filteredMembers.map((member) => {
              const assignedStaffObj = staffs.find(s => 
                s.id === member.assignedStaffId || 
                (s.id && member.assignedStaffId && s.id.toLowerCase() === member.assignedStaffId.toLowerCase())
              );
              const staffName = assignedStaffObj ? assignedStaffObj.fullName : (member.assignedStaff && member.assignedStaff !== 'Chưa phân công' ? member.assignedStaff : 'Chưa phân công');
              
              // Kiểm tra xem đã Check-in trong ngày hôm nay hay chưa (dựa theo ngày thực)
              const isCheckedTodayReal = Boolean(member.isCheckedToday && member.lastCheckInDate === todayStr);

              return (
                <MemberCardRow
                  key={member.id}
                  member={{
                    ...member,
                    assignedStaff: staffName,
                    isCheckedToday: isCheckedTodayReal
                  }}
                  onEdit={(m) => setEditingMember(m)}
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
          onSubmit={handleUpdateMember}
        />
      )}
      <TrashModal
        isOpen={isTrashOpen}
        onClose={() => setIsTrashOpen(false)}
        deletedMembers={deletedMembersList}
        onRestore={handleRestoreMember}
      />
    </div>
  );
};