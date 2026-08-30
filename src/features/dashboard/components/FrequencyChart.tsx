import React, { useState, useRef } from 'react';
import { FiActivity } from 'react-icons/fi';

interface HourlyData {
  time: string;
  count: number;
}

export const FrequencyChart: React.FC = () => {
  const chartData: HourlyData[] = [
    { time: '06:00', count: 0 },
    { time: '08:00', count: 0 },
    { time: '10:00', count: 0 },
    { time: '12:00', count: 0 },
    { time: '14:00', count: 0 },
    { time: '16:00', count: 2 },
    { time: '18:00', count: 2 },
    { time: '20:00', count: 1 },
    { time: '22:00', count: 0 },
  ];

  const [hoverInfo, setHoverInfo] = useState<{ xPx: number; data: HourlyData } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const paddingLeft = 32; // Khớp với khoảng cách pl-8 (32px) của trục Y
    const paddingRight = 16;
    const chartWidth = rect.width - paddingLeft - paddingRight;

    // Tính vị trí X của chuột bên trong vùng vẽ biểu đồ
    let mouseX = e.clientX - rect.left - paddingLeft;
    if (mouseX < 0) mouseX = 0;
    if (mouseX > chartWidth) mouseX = chartWidth;

    // Tìm index mốc giờ gần nhất dựa trên vị trí chuột cực kỳ mượt mà
    const index = Math.round((mouseX / chartWidth) * (chartData.length - 1));
    const clampedIndex = Math.max(0, Math.min(index, chartData.length - 1));

    // Tính toán tọa độ pixel chính xác cho mốc giờ đó
    const exactXPx = paddingLeft + (clampedIndex / (chartData.length - 1)) * chartWidth;

    setHoverInfo({
      xPx: exactXPx,
      data: chartData[clampedIndex]
    });
  };

  const handleMouseLeave = () => {
    setHoverInfo(null);
  };

  return (
    <div className="bg-[#0a0a0a] border border-[#161616] rounded-2xl p-6 flex flex-col h-full shadow-lg relative">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center gap-2">
            <FiActivity className="text-gym-neon" size={16} />
            <h3 className="text-xs font-black italic tracking-widest uppercase text-white m-0">
              TẦN SUẤT CHECK-IN
            </h3>
          </div>
          <p className="text-[10px] text-gray-500 font-mono m-0 mt-1">
            Mật độ quét thẻ theo từng khung giờ trong ngày
          </p>
        </div>
        <span className="text-[9px] border border-gym-neon/30 text-gym-neon px-3 py-1 rounded-full font-mono uppercase tracking-widest bg-gym-neon/5 animate-pulse">
          TRỰC TIẾP
        </span>
      </div>

      {/* Khu vực biểu đồ */}
      <div 
        ref={containerRef}
        className="flex-grow relative mt-4 flex items-end pl-8 pb-6 border-b border-l border-[#1f1f1f] cursor-crosshair select-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Trục Y */}
        <div className="absolute left-[-20px] top-0 bottom-6 flex flex-col justify-between text-[9px] font-mono text-gray-600 h-full py-2">
          <span>2</span>
          <span>1.5</span>
          <span>1</span>
          <span>0.5</span>
          <span>0</span>
        </div>
        
        {/* Trục X */}
        <div className="absolute bottom-[-24px] left-8 right-4 flex justify-between text-[9px] font-mono text-gray-600">
          <span>06:00</span>
          <span>08:00</span>
          <span>10:00</span>
          <span>12:00</span>
          <span>14:00</span>
          <span>16:00</span>
          <span>18:00</span>
          <span>20:00</span>
          <span>22:00</span>
        </div>

        {/* Đường chỉ dọc bám theo chuột cực mượt */}
        {hoverInfo && (
          <div 
            className="absolute top-0 bottom-6 w-[1px] bg-white/80 z-20 pointer-events-none transition-all duration-75 ease-out"
            style={{ left: `${hoverInfo.xPx}px` }}
          >
            <div className="w-2.5 h-2.5 bg-white rounded-full absolute -top-1.5 -translate-x-1/2 shadow-[0_0_12px_#fff]"></div>
          </div>
        )}

        {/* Tooltip nổi theo vị trí chuột */}
        {hoverInfo && (
          <div 
            className="absolute z-30 bg-[#121212]/95 border border-[#2a2a2a] rounded-xl p-3 shadow-2xl pointer-events-none transform -translate-x-1/2 mb-3 backdrop-blur-sm transition-all duration-75 ease-out"
            style={{ left: `${hoverInfo.xPx}px`, top: '35%' }}
          >
            <p className="text-[11px] font-black font-mono text-white m-0 mb-1">{hoverInfo.data.time}</p>
            <p className="text-[10px] font-mono text-gym-neon m-0 uppercase tracking-widest whitespace-nowrap">
              Lượt quét : <strong className="text-white">{hoverInfo.data.count}</strong>
            </p>
          </div>
        )}

        {/* Đồ thị SVG */}
        <div className="absolute inset-0 left-8 right-4 bottom-6 pointer-events-none">
          <svg preserveAspectRatio="none" viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="neonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ccff00" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ccff00" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,100 C30,100 45,100 50,100 C60,100 65,0 75,0 C85,0 90,50 100,100 L100,100 L0,100 Z" fill="url(#neonGradient)" />
            <path d="M0,100 C30,100 45,100 50,100 C60,100 65,0 75,0 C85,0 90,50 100,100" fill="none" stroke="#ccff00" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
      </div>
    </div>
  );
};