import React from 'react';
import { FiX, FiTrash2, FiRotateCcw } from 'react-icons/fi';
import type { Member } from '../types/member.types';

interface TrashModalProps {
  isOpen: boolean;
  onClose: () => void;
  deletedMembers: Member[];
  onRestore: (id: string) => void;
}

export const TrashModal: React.FC<TrashModalProps> = ({
  isOpen,
  onClose,
  deletedMembers,
  onRestore,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-[#0c0c0c] border border-[#1c1c1c] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        
        {/* Header của Modal */}
        <div className="px-8 py-6 border-b border-[#181818] flex justify-between items-start relative">
          <div>
            <h2 className="text-xl font-black italic tracking-wide text-white uppercase m-0">
              HỘI VIÊN ĐÃ XÓA
            </h2>
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-1 m-0">
              DANH SÁCH CÁC HỘI VIÊN ĐÃ ĐƯỢC ĐƯA VÀO LƯU TRỮ XÓA MỀM
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#141414] border border-[#222] text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Nội dung danh sách bên trong */}
        <div className="p-6 overflow-y-auto flex-grow flex flex-col gap-3 min-h-[280px]">
          {deletedMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center my-auto">
              <div className="w-14 h-14 rounded-2xl bg-[#121212] border border-[#1a1a1a] flex items-center justify-center text-gray-600 mb-3">
                <FiTrash2 size={26} />
              </div>
              <span className="text-[11px] font-mono text-gray-500 tracking-widest uppercase">
                NODELETEDMEMBERS
              </span>
            </div>
          ) : (
            deletedMembers.map((member) => (
              <div
                key={member.id}
                className="bg-[#101010] border border-[#1a1a1a] rounded-2xl p-4 flex items-center justify-between gap-4"
              >
                <div>
                  <h4 className="text-xs font-black italic tracking-wide text-white uppercase m-0">
                    {member.fullName}
                  </h4>
                  <span className="text-[9px] font-mono text-gray-500 uppercase">
                    Mã: {member.memberCode} | SĐT: {member.phoneNumber}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onRestore(member.id)}
                  className="flex items-center gap-1.5 bg-[#15232d] border border-[#223d52] hover:border-[#38bdf8] text-[#38bdf8] text-[10px] font-black uppercase px-3.5 py-2 rounded-xl transition-all cursor-pointer"
                >
                  <FiRotateCcw size={13} /> KHÔI PHỤC
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer với nút Xác nhận / Đóng */}
        <div className="p-5 border-t border-[#181818] bg-[#090909] flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full max-w-md bg-white hover:bg-gray-200 text-black font-black py-3 rounded-2xl transition-all cursor-pointer uppercase text-xs tracking-wider shadow-lg"
          >
            XÁC NHẬN
          </button>
        </div>

      </div>
    </div>
  );
};