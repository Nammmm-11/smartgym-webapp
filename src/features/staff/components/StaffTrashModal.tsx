import React from 'react';
import { FiX, FiTrash2, FiRotateCcw } from 'react-icons/fi';
import type { StaffMember } from '../types/staff.types';

interface StaffTrashModalProps {
  isOpen: boolean;
  onClose: () => void;
  deletedStaffs: StaffMember[];
  onRestore: (id: string) => void;
}

export const StaffTrashModal: React.FC<StaffTrashModalProps> = ({
  isOpen,
  onClose,
  deletedStaffs,
  onRestore,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0b0b0e] border border-[#1f1f26] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header Modal */}
        <div className="px-6 py-5 border-b border-[#18181f] flex items-center justify-between">
          <div>
            <h3 className="text-base font-black uppercase tracking-wider text-white m-0">
              NHÂN SỰ ĐÃ XÓA
            </h3>
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest m-0 mt-0.5">
              DANH SÁCH CÁC NHÂN SỰ ĐÃ ĐƯỢC ĐƯA VÀO LƯU TRỮ XÓA MỀM
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#14141a] border border-[#22222d] flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Body List */}
        <div className="p-6 overflow-y-auto flex-grow flex flex-col gap-3">
          {deletedStaffs.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#14141a] border border-[#22222d] flex items-center justify-center text-gray-600">
                <FiTrash2 size={22} />
              </div>
              <p className="text-xs font-mono text-gray-500 uppercase tracking-widest m-0">
                NODELETEDSTAFFS
              </p>
            </div>
          ) : (
            deletedStaffs.map((staff) => (
              <div
                key={staff.id}
                className="bg-[#121217] border border-[#1f1f26] rounded-2xl p-4 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black text-white uppercase m-0">
                      {staff.fullName}
                    </h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#181820] text-gray-400 border border-[#262633]">
                      {staff.staffCode}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-mono m-0 mt-1">
                    {staff.phoneNumber} • {staff.email}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onRestore(staff.id)}
                  className="flex items-center gap-1.5 bg-[#16232d] border border-[#22394d] text-[#38bdf8] hover:bg-[#1a2d3d] text-xs font-black uppercase px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  <FiRotateCcw size={14} /> KHÔI PHỤC
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#18181f] bg-[#08080a] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-white text-black hover:bg-gray-200 text-xs font-black uppercase tracking-wider px-8 py-3 rounded-2xl transition-all cursor-pointer shadow-lg"
          >
            XÁC NHẬN
          </button>
        </div>
      </div>
    </div>
  );
};