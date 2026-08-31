import React from 'react';
import {   
  FiPhone,   
  FiMail,   
  FiTag,   
  FiCalendar,   
  FiEdit2,   
  FiTrash2,   
  FiMessageSquare,   
  FiCheckCircle,   
  FiRotateCcw, 
  FiUserCheck,
} from 'react-icons/fi';
import { IoIosArrowDown } from 'react-icons/io';
import type { Member } from '../types/member.types';

interface MemberCardRowProps {   
  member: Member & { assignedStaff?: string; staffName?: string };   
  onEdit: (member: Member) => void;   
  onDelete: (id: string) => void;   
  onRestore?: (id: string) => void;   
  onCheckIn: (id: string) => void;   
  onInteract: (member: Member) => void;
}

export const MemberCardRow: React.FC<MemberCardRowProps> = ({   
  member,   
  onEdit,   
  onDelete,   
  onRestore,   
  onCheckIn,   
  onInteract, 
}) => {   
  // Hiển thị Họ trước, Tên sau chuẩn tiếng Việt
  const formattedFullName = (member.lastName && member.firstName) 
    ? `${member.lastName} ${member.firstName}`.trim() 
    : (member.fullName || '');

  const initial = formattedFullName.trim().charAt(0).toUpperCase() || 'M';   
  const isExpired = member.status === 'EXPIRED';
  
  // Trạng thái quản lý Check / Checked theo ngày thực tế
  const isChecked = Boolean(member.isCheckedToday);

  const handleCheckClick = () => {
    if (onCheckIn) {
      onCheckIn(member.id);
    }
  };

  const getInitialStyle = (char: string) => {     
    switch (char) {       
      case 'N': return 'bg-[#0f2415] text-[#22c55e] border-[#1b4325]';       
      case 'L': return 'bg-[#1e2912] text-gym-neon border-[#394d1a]';       
      case 'P': return 'bg-[#15232d] text-[#38bdf8] border-[#223d52]';       
      case 'H': return 'bg-[#29172e] text-[#c084fc] border-[#4c2459]';       
      case 'D': return 'bg-[#2b1818] text-[#f87171] border-[#522525]';       
      default: return 'bg-[#1a1a1a] text-gray-300 border-[#2a2a2a]';     
    }   
  };   

  // Lấy tên nhân viên phụ trách và gói phí hiện tại
  const staffName = member.assignedStaff || member.staffName || 'Chưa phân công';
  const displayPackageName = member.packageName || 'Gói Tập 1 Tháng';

  const formatDateOnly = (dateStr?: string) => {
    if (!dateStr) return '';
    return dateStr.split('T')[0];
  };

  return (     
    <div className="bg-[#090909] border border-[#161616] hover:border-[#2a2a2a] rounded-2xl p-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4 transition-all duration-200 shadow-md">       
      {/* 1. INITIAL & FULL NAME */}       
      <div className="flex items-center gap-3 w-full xl:w-[280px] flex-shrink-0">         
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-black text-sm flex-shrink-0 ${getInitialStyle(initial)}`}>           
          {initial}         
        </div>         
        <div className="min-w-0 flex-1">           
          <div className="flex items-center gap-2">             
            <h4 className="text-xs font-black italic tracking-wide text-white uppercase m-0 truncate" title={formattedFullName}>{formattedFullName}</h4>             
            <span className="text-[9px] font-mono font-bold text-gray-500 bg-[#141414] px-1.5 py-0.5 rounded border border-[#222] flex-shrink-0">               
              {member.memberCode}             
            </span>           
          </div>           
          <p className="text-[9px] text-gray-500 font-mono tracking-widest uppercase m-0 mt-0.5 truncate">             
            {member.gender} &nbsp;&nbsp; NS: {formatDateOnly(member.dateOfBirth)}           
          </p>         
        </div>       
      </div>       

      {/* 2. LIÊN HỆ */}       
      <div className="w-full xl:w-[170px] flex-shrink-0">         
        <span className="text-[8px] font-mono tracking-widest text-gray-500 uppercase block mb-1">LIÊN HỆ</span>         
        <div className="flex items-center gap-1.5 text-xs text-gray-300 font-mono">           
          <FiPhone size={11} className="text-gray-500 flex-shrink-0" />           
          <span className="truncate">{member.phoneNumber}</span>         
        </div>         
        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-mono mt-0.5 truncate max-w-[160px]">           
          <FiMail size={11} className="text-gray-500 flex-shrink-0" />           
          <span className="truncate">{member.email}</span>         
        </div>       
      </div>       

      {/* 3. GÓI PHÍ */}       
      <div className="w-full xl:w-[160px] flex-shrink-0">         
        <span className="text-[8px] font-mono tracking-widest text-gray-500 uppercase block mb-1">GÓI PHÍ</span>         
        <div className="flex items-center gap-1 text-[11px] font-black text-gym-neon uppercase tracking-wider truncate">           
          <FiTag size={11} className="flex-shrink-0" />           
          <span className="truncate">{displayPackageName}</span>         
        </div>         
        <span className="text-[9px] text-gray-500 font-mono uppercase block mt-0.5 truncate">{member.packageDiscount || 'Không giảm giá'}</span>       
      </div>       

      {/* 4. NV PHỤ TRÁCH */}       
      <div className="w-full xl:w-[190px] flex-shrink-0">         
        <span className="text-[8px] font-mono tracking-widest text-gray-500 uppercase block mb-1">NV PHỤ TRÁCH</span>         
        <div className="inline-flex items-center justify-between w-full bg-[#121212] border border-[#1f1f1f] px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-gray-200">           
          <div className="flex items-center gap-1.5 truncate">
            <FiUserCheck size={12} className="text-gym-neon flex-shrink-0" />
            <span className="truncate">{staffName}</span>           
          </div>
          <IoIosArrowDown size={11} className="text-gray-500 flex-shrink-0 ml-1" />         
        </div>       
      </div>       

      {/* 5. HẠN & TRẠNG THÁI */}       
      <div className="w-full xl:w-[170px] flex-shrink-0">         
        <span className="text-[8px] font-mono tracking-widest text-gray-500 uppercase block mb-1">HẠN DÙNG</span>         
        <div className="flex items-center gap-2">           
          <div className="flex items-center gap-1 text-[10px] font-mono text-gray-300 flex-shrink-0">             
            <FiCalendar size={11} className="text-gray-500" />             
            <span>{formatDateOnly(member.expiryDate)}</span>           
          </div>           
          <span className={`text-[8px] font-black px-2 py-0.5 rounded tracking-wider uppercase border flex-shrink-0 ${isExpired ? 'bg-red-950/40 text-red-400 border-red-900/50' : 'bg-green-950/40 text-[#22c55e] border-green-900/50'}`}>             
            {isExpired ? 'HẾT HẠN' : 'HOẠT ĐỘNG'}           
          </span>         
        </div>       
      </div>       

      {/* 6. ACTIONS */}       
      <div className="flex items-center gap-2 self-end xl:self-auto xl:ml-auto flex-shrink-0">         
        {member.isDeleted ? (           
          <button             
            type="button"             
            onClick={() => onRestore && onRestore(member.id)}             
            className="flex items-center gap-1 bg-[#15232d] border border-[#223d52] hover:border-[#38bdf8] text-[#38bdf8] text-[10px] font-black uppercase px-3 py-1.5 rounded-lg transition-colors cursor-pointer"           >             
            <FiRotateCcw size={12} /> KHÔI PHỤC           
          </button>         
        ) : (           
          <>             
            {/* Nút Check / Checked thay đổi linh hoạt theo state */}             
            <button               
              type="button"               
              onClick={handleCheckClick}               
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer border ${
                isChecked
                  ? 'bg-[#22c55e] text-black border-[#22c55e] shadow-[0_0_12px_rgba(34,197,94,0.4)] font-black'
                  : 'bg-[#121212] border-[#1f1f1f] hover:border-[#22c55e] text-white'
              }`}
            >
              <FiCheckCircle size={12} className={isChecked ? 'text-black' : 'text-gray-400'} />
              {isChecked ? 'Checked' : 'Check'}
            </button>             
            
            <button               
              type="button"               
              onClick={() => onInteract(member)}               
              className="flex items-center gap-1 bg-[#121212] border border-gym-neon/40 hover:bg-gym-neon/10 text-gym-neon text-[10px] font-black uppercase px-3 py-1.5 rounded-lg transition-colors cursor-pointer"           >             
              <FiMessageSquare size={12} /> TƯƠNG TÁC           
            </button>             

            <button               
              type="button"               
              onClick={() => onEdit(member)}               
              className="p-2 rounded-lg bg-[#121212] border border-[#1f1f1f] hover:border-gray-500 text-gray-300 hover:text-white transition-colors cursor-pointer"           >             
              <FiEdit2 size={13} />           
            </button>             

            <button               
              type="button"               
              onClick={() => onDelete(member.id)}               
              className="p-2 rounded-lg bg-[#170808] border border-[#381515] hover:border-red-500 text-red-400 transition-colors cursor-pointer"           >             
              <FiTrash2 size={13} />           
            </button>           
          </>         
        )}       
      </div>     
    </div>   
); 
};