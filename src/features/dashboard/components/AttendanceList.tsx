import React from 'react';
import { FiUsers } from 'react-icons/fi';

export interface AttendanceRecord {
  no: number;
  initial: string;
  name: string;
  phone: string;
  service: string;
  time: string;
  color: string;
}

interface AttendanceListProps {
  members: AttendanceRecord[];
}

export const AttendanceList: React.FC<AttendanceListProps> = ({ members = [] }) => {
  return (
    <div className="bg-[#0a0a0a] border border-[#161616] rounded-2xl p-6 flex flex-col h-full shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <FiUsers className="text-gym-neon" size={16} />
        <h3 className="text-xs font-black italic tracking-widest uppercase text-white m-0">
          HỘI VIÊN TẬP HÔM NAY
        </h3>
      </div>

      <div className="grid grid-cols-[40px_60px_2fr_1.5fr_2fr_1.5fr] gap-4 pb-3 border-b border-[#1f1f1f] text-[9px] font-mono tracking-widest text-gray-500 uppercase">
        <div>STT</div>
        <div className="text-center">HÌNH ẢNH</div>
        <div>KHÁCH HÀNG</div>
        <div>ĐIỆN THOẠI</div>
        <div>DỊCH VỤ</div>
        <div className="text-right">NGÀY GIỜ</div>
      </div>

      <div className="flex-grow overflow-y-auto mt-2 space-y-1 pr-2">
        {members.map((member, idx) => (
          <div key={idx} className="grid grid-cols-[40px_60px_2fr_1.5fr_2fr_1.5fr] gap-4 items-center py-2.5 hover:bg-[#121212] rounded-xl transition-colors border-b border-[#141414] last:border-0">
            <div className="text-[10px] font-mono text-gray-500">{member.no}</div>
            <div className="flex justify-center">
              <div className={`w-7 h-7 rounded-lg bg-[#141414] border border-[#222] flex items-center justify-center font-black text-[11px] ${member.color}`}>
                {member.initial}
              </div>
            </div>
            <div className="text-[11px] font-black italic tracking-wider uppercase text-gray-200 truncate">{member.name}</div>
            <div className="text-[10px] font-mono text-gray-400">{member.phone}</div>
            <div className="text-[10px] font-bold text-gray-300 truncate">{member.service}</div>
            <div className="text-[10px] font-mono text-gray-400 text-right">{member.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};