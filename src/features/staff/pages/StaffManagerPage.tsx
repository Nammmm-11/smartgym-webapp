import React, { useState, useEffect } from 'react';
import { StaffMetricCards } from '../components/StaffMetricCards';
import { StaffFilterBar } from '../components/StaffFilterBar';
import { StaffCardRow } from '../components/StaffCardRow';
import { StaffModal } from '../components/StaffModal';
import { StaffTrashModal } from '../components/StaffTrashModal';
import { SalaryDetailModal } from '../components/SalaryDetailModal';
import { staffApi } from '../api/staff.api';
import type { StaffMember, StaffRole, StaffFilterType } from '../types/staff.types';

interface StaffManagerPageProps {
  initialRole?: StaffRole;
}

export const StaffManagerPage: React.FC<StaffManagerPageProps> = ({ initialRole = 'RECEPTIONIST' }) => {
  const [staffs, setStaffs] = useState<StaffMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<StaffFilterType>('ALL');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTrashModalOpen, setIsTrashModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  // State quản lý mở Modal chi tiết Lương & Doanh thu
  const [salaryDetailStaff, setSalaryDetailStaff] = useState<StaffMember | null>(null);

  const loadData = async () => {
    const data = await staffApi.getStaffs();
    setStaffs(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredStaffs = staffs.filter((s) => {
    if (s.role !== initialRole) return false;
    if (s.isDeleted) return false; 
    if (activeFilter === 'ACTIVE' && s.status !== 'ACTIVE') return false;
    if (activeFilter === 'ON_LEAVE' && s.status !== 'ON_LEAVE') return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      return s.fullName.toLowerCase().includes(q) || s.staffCode.toLowerCase().includes(q) || s.phoneNumber.includes(q);
    }
    return true;
  });

  const deletedStaffs = staffs.filter(s => s.isDeleted && s.role === initialRole);
  const trashCount = deletedStaffs.length;

  const metrics = staffApi.calculateMetrics(staffs, initialRole);

  const handleCheckInToggle = async (id: string) => {
    const target = staffs.find(s => s.id === id);
    if (!target) return;

    const newCheckedState = !target.isCheckedInToday;

    setStaffs(prev => prev.map(s => s.id === id ? { ...s, isCheckedInToday: newCheckedState } : s));

    try {
      await staffApi.updateStaff(id, { 
        ...target, 
        isCheckedInToday: newCheckedState 
      });
      await loadData();
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái điểm danh:", error);
      await loadData();
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn chuyển nhân sự này vào thùng rác?")) {
      await staffApi.deleteStaff(id);
      loadData();
    }
  };

  const handleRestore = async (id: string) => {
    await staffApi.restoreStaff(id);
    loadData();
  };

  const handleSaveStaff = async (staffData: any) => {
    if (editingStaff) {
      await staffApi.updateStaff(editingStaff.id, staffData);
    } else {
      await staffApi.createStaff(staffData);
    }
    setIsModalOpen(false);
    setEditingStaff(null);
    loadData();
  };

  const pageTitle = initialRole === 'RECEPTIONIST' ? 'QUẢN LÝ NHÂN VIÊN QUẦY' : 'QUẢN LÝ HUẤN LUYỆN VIÊN (PT)';

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#050505] text-white">
      <div className="relative z-30 px-8 py-5 border-b border-[#141414] bg-[#070707] flex justify-between items-center flex-shrink-0">
        <div>
          <span className="text-[10px] text-gray-500 font-mono tracking-[0.25em] uppercase">FIT.GYM // SYSTEM_V4</span>
          <h1 className="text-2xl lg:text-3xl font-black italic tracking-wide uppercase m-0 mt-1 text-white">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* VÙNG DANH SÁCH CHÍNH */}
      <div className="p-8 flex flex-col gap-6 flex-grow overflow-y-auto">
        <StaffMetricCards metrics={metrics} type={initialRole === 'RECEPTIONIST' ? 'receptionist' : 'trainer'} />

        <StaffFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          trashCount={trashCount}
          onAddClick={() => {
            setEditingStaff(null);
            setIsModalOpen(true);
          }}
          onOpenTrashModal={() => setIsTrashModalOpen(true)}
        />

        <div className="flex flex-col gap-3 pb-4">
          {filteredStaffs.length === 0 ? (
            <div className="bg-[#080808] border border-dashed border-[#1c1c1c] rounded-2xl p-12 text-center flex flex-col items-center justify-center">
              <p className="text-xs font-mono text-gray-500 tracking-widest uppercase m-0">KHÔNG TÌM THẤY NHÂN SỰ NÀO</p>
            </div>
          ) : (
            filteredStaffs.map((staff) => (
              <StaffCardRow
                key={staff.id}
                staff={staff}
                onCheckInToggle={handleCheckInToggle}
                onEdit={(staffToEdit) => {
                  setEditingStaff(staffToEdit);
                  setIsModalOpen(true);
                }}
                onDelete={handleDelete}
                onOpenSalaryDetail={(targetStaff: StaffMember) => setSalaryDetailStaff(targetStaff)}
              />
            ))
          )}
        </div>
      </div>

      {/* Modal Thêm mới / Cập nhật */}
      <StaffModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStaff(null);
        }}
        onSubmit={handleSaveStaff}
        staffToEdit={editingStaff}
        defaultRole={initialRole}
      />

      {/* Modal Thùng rác nhân sự */}
      <StaffTrashModal
        isOpen={isTrashModalOpen}
        onClose={() => setIsTrashModalOpen(false)}
        deletedStaffs={deletedStaffs}
        onRestore={handleRestore}
      />

      {/* Modal Chi tiết Lương & Doanh thu tích lũy khi click vào cột LƯƠNG / DOANH THU */}
      <SalaryDetailModal
        isOpen={!!salaryDetailStaff}
        staff={salaryDetailStaff}
        onClose={() => setSalaryDetailStaff(null)}
      />
    </div>
  );
};