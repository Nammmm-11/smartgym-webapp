import React from 'react';
import { FiMaximize, FiCheckCircle } from 'react-icons/fi';

export interface ScannedMember {
  phone: string;
  time: string;
  name: string;
  service: string;
  isPaid: boolean;
  remainingDays: number;
  startDate: string;
  endDate: string;
}

interface AttendanceScannerProps {
  member: ScannedMember | null;
  onScanSuccess?: () => void;
}

export const AttendanceScanner: React.FC<AttendanceScannerProps> = ({ member, onScanSuccess }) => {
  const handleSimulate = () => {
    if (onScanSuccess) onScanSuccess();
  };

  if (!member) {
    return (
      <div 
        onClick={handleSimulate}
        className="bg-[#0a0a0a] border border-[#161616] rounded-2xl flex flex-col lg:flex-row h-full shadow-lg relative overflow-hidden group hover:border-gym-neon/30 transition-colors"
      >
        {/* PHẦN TRÁI: Biểu tượng máy quét sẵn sàng */}
        <div className="lg:w-[38%] bg-[#080808] border-b lg:border-b-0 lg:border-r border-[#161616] flex flex-col items-center justify-center relative p-8">
          <div className="w-20 h-20 rounded-2xl bg-[#111] border border-[#222] flex items-center justify-center text-gym-neon shadow-[0_0_20px_rgba(204,255,0,0.1)] group-hover:scale-105 transition-transform">
            <FiMaximize size={36} className="animate-pulse" />
          </div>
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-3">
            QUÉT THẺ
          </span>
        </div>

        {/* PHẦN PHẢI: Trạng thái chờ */}
        <div className="lg:w-[62%] p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 tracking-widest mb-3">
            <span>STATION // SẴN SÀNG</span>
            <span>--:--:--</span>
          </div>

          <div className="flex flex-col my-auto">
            <h2 className="text-lg lg:text-xl font-black italic tracking-wide uppercase text-gray-400 m-0">
              CHƯA CÓ LƯỢT QUÉT THẺ
            </h2>
            <p className="text-[10px] font-mono text-gray-600 tracking-wider uppercase mt-1">
              ĐANG CHỜ HỘI VIÊN QUẸT THẺ TẬP HÔM NAY
            </p>
          </div>

          <div className="my-3 bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-3 flex flex-col items-center justify-center">
            <span className="text-[9px] text-gray-600 font-mono tracking-widest uppercase mb-0.5">
              CÒN LẠI
            </span>
            <span className="text-2xl font-black italic text-gray-600 m-0">
              --
            </span>
            <span className="text-[9px] text-gray-600 font-mono tracking-widest uppercase">
              NGÀY
            </span>
          </div>

          <div className="text-center">
            <span className="text-[9px] text-gray-600 font-mono tracking-widest">
              Trạng thái: <strong className="text-gray-500">Chờ tín hiệu từ máy quét</strong>
            </span>
          </div>
        </div>
      </div>
    );
  }

  const initial = member.name.trim().charAt(0).toUpperCase() || 'M';

  return (
    <div 
      onClick={handleSimulate}
      className="bg-[#0a0a0a] border border-[#161616] rounded-2xl flex flex-col lg:flex-row h-full shadow-lg relative overflow-hidden group hover:border-gym-neon/40 transition-colors"
    >
      {/* PHẦN TRÁI: Khối chữ cái viết tắt (Avatar lớn) */}
      <div className="lg:w-[38%] bg-[#080808] border-b lg:border-b-0 lg:border-r border-[#161616] flex items-center justify-center relative p-8">
        <span className="text-gym-neon font-bold text-8xl lg:text-9xl leading-none italic font-serif opacity-90 select-none">
          {initial}
        </span>
      </div>

      {/* PHẦN PHẢI: Thông tin hội viên chi tiết thật */}
      <div className="lg:w-[62%] p-6 flex flex-col justify-between">
        {/* Số điện thoại & Thời gian quẹt thẻ */}
        <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 tracking-widest mb-3">
          <span>{member.phone}</span>
          <span>{member.time}</span>
        </div>

        {/* Tên hội viên & Tên dịch vụ */}
        <div className="flex flex-col">
          <h2 className="text-xl lg:text-2xl font-black italic tracking-wide uppercase text-white m-0 group-hover:text-gym-neon transition-colors">
            {member.name}
          </h2>
          <p className="text-[10px] font-black text-gym-neon tracking-widest uppercase mt-1 mb-3">
            DỊCH VỤ: {member.service}
          </p>

          {/* Trạng thái Đã thanh toán */}
          {member.isPaid ? (
            <div className="self-start bg-green-950/40 border border-green-800/60 text-[#22c55e] text-[9px] font-black px-3.5 py-1 rounded-full flex items-center gap-1.5 tracking-widest uppercase shadow-sm">
              <FiCheckCircle size={11} className="text-[#22c55e]" />
              ĐÃ THANH TOÁN
            </div>
          ) : (
            <div className="self-start bg-yellow-950/40 border border-yellow-800/60 text-yellow-500 text-[9px] font-black px-3.5 py-1 rounded-full flex items-center gap-1.5 tracking-widest uppercase shadow-sm">
              CHƯA KÍCH HOẠT
            </div>
          )}
        </div>

        {/* Ô hiển thị số ngày còn lại */}
        <div className="my-4 bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4 flex flex-col items-center justify-center">
          <span className="text-[9px] text-gray-500 font-mono tracking-widest uppercase mb-1">
            CÒN LẠI
          </span>
          <span className="text-3xl lg:text-4xl font-black italic text-gym-neon m-0">
            {member.remainingDays}
          </span>
          <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mt-1">
            NGÀY
          </span>
        </div>

        {/* Thời gian hiệu lực của gói */}
        <div className="text-center">
          <span className="text-[9px] text-gray-600 font-mono tracking-widest">
            Thời gian: <strong className="text-gray-400">{member.startDate || '--'} - {member.endDate || '--'}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};