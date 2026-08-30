import React from 'react';

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

  // Mặc định hiển thị đúng thông số mẫu trong ảnh của bạn nếu chưa có dữ liệu check-in mới
  const displayMember = member || {
    phone: "0956345678",
    time: "20:21:15",
    name: "LÂM MINH BẢO",
    service: "GÓI CAO CẤP 12T",
    isPaid: true,
    remainingDays: 365,
    startDate: "23/08/2026",
    endDate: "23/08/2027"
  };

  const initial = displayMember.name.trim().charAt(0).toUpperCase() || 'L';

  return (
    <div 
      onClick={handleSimulate}
      className="bg-[#0a0a0a] border border-[#161616] rounded-2xl flex flex-col lg:flex-row h-full shadow-lg relative overflow-hidden cursor-pointer hover:border-gym-neon/40 transition-colors group"
    >
      {/* PHẦN TRÁI: Khối chữ cái viết tắt (Avatar lớn) */}
      <div className="lg:w-[38%] bg-[#080808] border-b lg:border-b-0 lg:border-r border-[#161616] flex items-center justify-center relative p-8">
        <span className="text-gym-neon font-bold text-8xl lg:text-9xl leading-none italic font-serif opacity-90 select-none">
          {initial}
        </span>
      </div>

      {/* PHẦN PHẢI: Thông tin hội viên chi tiết */}
      <div className="lg:w-[62%] p-6 flex flex-col justify-between">
        {/* Số điện thoại & Thời gian quẹt thẻ */}
        <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 tracking-widest mb-3">
          <span>{displayMember.phone}</span>
          <span>{displayMember.time}</span>
        </div>

        {/* Tên hội viên & Tên dịch vụ */}
        <div className="flex flex-col">
          <h2 className="text-xl lg:text-2xl font-black italic tracking-wide uppercase text-white m-0 group-hover:text-gym-neon transition-colors">
            {displayMember.name}
          </h2>
          <p className="text-[10px] font-black text-gym-neon tracking-widest uppercase mt-1 mb-3">
            DỊCH VỤ: {displayMember.service}
          </p>

          {/* Trạng thái Đã thanh toán */}
          {displayMember.isPaid && (
            <div className="self-start bg-green-950/40 border border-green-800/60 text-[#22c55e] text-[9px] font-black px-3.5 py-1 rounded-full flex items-center gap-1.5 tracking-widest uppercase shadow-sm">
              <span className="w-1.5 h-1.5 bg-[#22c55e] rounded-full animate-pulse"></span>
              ĐÃ THANH TOÁN
            </div>
          )}
        </div>

        {/* Ô hiển thị số ngày còn lại */}
        <div className="my-4 bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl p-4 flex flex-col items-center justify-center">
          <span className="text-[9px] text-gray-500 font-mono tracking-widest uppercase mb-1">
            CÒN LẠI
          </span>
          <span className="text-3xl lg:text-4xl font-black italic text-gym-neon m-0">
            {displayMember.remainingDays}
          </span>
          <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mt-1">
            NGÀY
          </span>
        </div>

        {/* Thời gian hiệu lực của gói */}
        <div className="text-center">
          <span className="text-[9px] text-gray-600 font-mono tracking-widest">
            Thời gian: <strong className="text-gray-400">{displayMember.startDate} - {displayMember.endDate}</strong>
          </span>
        </div>
      </div>
    </div>
  );
};