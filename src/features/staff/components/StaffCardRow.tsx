import React from 'react';
import { FiCheckCircle, FiClock, FiPhone, FiMail, FiRotateCcw, FiEye } from 'react-icons/fi';
import type { StaffMember } from '../types/staff.types';

export interface StaffCardRowProps {
  staff: StaffMember;
  onCheckInToggle: (id: string) => void;
  onEdit: (staff: StaffMember) => void;
  onDelete: (id: string) => void;
  onRestore?: (id: string) => void;
  onOpenSalaryDetail?: (staff: StaffMember) => void;
}

export const StaffCardRow: React.FC<StaffCardRowProps> = ({ 
  staff, 
  onCheckInToggle, 
  onEdit, 
  onDelete, 
  onRestore,
  onOpenSalaryDetail
}) => {
  return (
    <div className="bg-[#09090b] border border-[#1f1f23] hover:border-[#2f2f35] rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#141418] border border-[#222228] flex items-center justify-center font-black italic text-gym-neon text-base flex-shrink-0">
          {staff.fullName.charAt(0)}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-black tracking-wider text-white uppercase m-0 group-hover:text-gym-neon transition-colors">
              {staff.fullName}
            </h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#16161b] text-gray-400 border border-[#222228]">
              {staff.staffCode}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 font-mono mt-1.5">
            <span className="flex items-center gap-1.5"><FiPhone size={12} className="text-gym-neon" /> {staff.phoneNumber}</span>
            <span className="flex items-center gap-1.5"><FiMail size={12} className="text-blue-400" /> {staff.email}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-[#1a1a1f]">
        {/* Khối LƯƠNG / DOANH THU có thể bấm vào được */}
        <div 
          onClick={() => onOpenSalaryDetail && onOpenSalaryDetail(staff)}
          className="text-left md:text-right cursor-pointer group/salary p-2 rounded-xl border border-transparent hover:border-gym-neon/30 hover:bg-[#121218] transition-all"
          title="Bấm để xem chi tiết lương & doanh thu tích lũy"
        >
          <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase m-0 group-hover/salary:text-gym-neon transition-colors flex items-center gap-1 justify-start md:justify-end">
            LƯƠNG / DOANH THU <FiEye size={11} className="opacity-0 group-hover/salary:opacity-100 transition-opacity" />
          </p>
          <p className="text-sm font-black text-gym-neon m-0 mt-0.5">
            {(staff.role === 'TRAINER' ? (staff.ptRevenue || 0) : staff.salary)?.toLocaleString('vi-VN')} đ
          </p>
        </div>

        <div className="flex items-center gap-2">
          {staff.isDeleted ? (
            <button
              type="button"
              onClick={() => onRestore && onRestore(staff.id)}
              className="flex items-center gap-1.5 bg-[#15232d] border border-[#223d52] hover:border-[#38bdf8] text-[#38bdf8] text-[10px] font-black uppercase px-3.5 py-2 rounded-xl transition-all cursor-pointer"
            >
              <FiRotateCcw size={13} /> KHÔI PHỤC
            </button>
          ) : (
            <div className="flex items-center gap-2">
              {/* Nút Check-in */}
              <button
                onClick={() => onCheckInToggle(staff.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold tracking-wider cursor-pointer transition-colors ${
                  staff.isCheckedInToday
                    ? 'bg-green-950/40 text-green-400 border border-green-800/50'
                    : 'bg-[#121216] text-gray-400 border border-[#222228] hover:text-white'
                }`}
              >
                {staff.isCheckedInToday ? <FiCheckCircle size={14} /> : <FiClock size={14} />}
                {staff.isCheckedInToday ? 'ĐÃ VÀO CA' : 'CHƯA TRỰC'}
              </button>

              {/* Nút Chỉnh sửa (Edit) */}
              <button 
                onClick={() => onEdit(staff)}
                className="p-2 text-gray-400 hover:text-white bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg transition-colors"
                title="Chỉnh sửa thông tin"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>

              {/* Nút Xóa / Thùng rác */}
              <button 
                onClick={() => onDelete(staff.id)}
                className="p-2 text-gray-400 hover:text-red-500 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg transition-colors"
                title="Xóa nhân sự"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};