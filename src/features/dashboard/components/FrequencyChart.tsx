import React, { useState, useRef, useMemo } from 'react';
import { FiActivity } from 'react-icons/fi';
import type { AttendanceRecord } from './AttendanceList';

interface HourlyData {
  time: string;
  count: number;
}

interface FrequencyChartProps {
  records?: AttendanceRecord[];
}

export const FrequencyChart: React.FC<FrequencyChartProps> = ({ records = [] }) => {
  const chartData: HourlyData[] = useMemo(() => {
    const slots = [
      { time: '06:00', startH: 6, endH: 7, count: 0 },
      { time: '08:00', startH: 8, endH: 9, count: 0 },
      { time: '10:00', startH: 10, endH: 11, count: 0 },
      { time: '12:00', startH: 12, endH: 13, count: 0 },
      { time: '14:00', startH: 14, endH: 15, count: 0 },
      { time: '16:00', startH: 16, endH: 17, count: 0 },
      { time: '18:00', startH: 18, endH: 19, count: 0 },
      { time: '20:00', startH: 20, endH: 21, count: 0 },
      { time: '22:00', startH: 22, endH: 23, count: 0 },
    ];

    records.forEach((record) => {
      if (!record.time) return;
      // Ví dụ record.time = "18:30:15" hoặc "18:30"
      const timeClean = record.time.includes(' ') ? record.time.split(' ')[0] : record.time;
      const hourPart = parseInt(timeClean.split(':')[0], 10);
      if (!isNaN(hourPart)) {
        const slot = slots.find((s) => hourPart >= s.startH && hourPart <= s.endH);
        if (slot) {
          slot.count += 1;
        }
      }
    });

    return slots.map((s) => ({ time: s.time, count: s.count }));
  }, [records]);

  const maxCount = useMemo(() => {
    const max = Math.max(...chartData.map((d) => d.count), 0);
    return max > 0 ? Math.max(max, 2) : 2;
  }, [chartData]);

  // Sinh đường dẫn SVG động chuẩn xác theo dữ liệu thật
  const svgPaths = useMemo(() => {
    const totalPoints = chartData.length;
    if (totalPoints === 0) return { areaPath: '', linePath: '' };

    const points = chartData.map((item, index) => {
      const x = (index / (totalPoints - 1)) * 100;
      // y = 100 (đáy) khi count = 0, y = 10 khi count = maxCount
      const y = maxCount > 0 && item.count > 0 
        ? Math.max(10, 100 - (item.count / maxCount) * 85)
        : 100;
      return { x, y };
    });

    let linePath = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cp1x = curr.x + (next.x - curr.x) / 2;
      const cp1y = curr.y;
      const cp2x = curr.x + (next.x - curr.x) / 2;
      const cp2y = next.y;
      linePath += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${next.x},${next.y}`;
    }

    const areaPath = `${linePath} L 100,100 L 0,100 Z`;
    return { areaPath, linePath };
  }, [chartData, maxCount]);

  const [hoverInfo, setHoverInfo] = useState<{ xPx: number; data: HourlyData } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const paddingLeft = 32;
    const paddingRight = 16;
    const chartWidth = rect.width - paddingLeft - paddingRight;

    let mouseX = e.clientX - rect.left - paddingLeft;
    if (mouseX < 0) mouseX = 0;
    if (mouseX > chartWidth) mouseX = chartWidth;

    const index = Math.round((mouseX / chartWidth) * (chartData.length - 1));
    const clampedIndex = Math.max(0, Math.min(index, chartData.length - 1));

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
          <span>{maxCount}</span>
          <span>{(maxCount * 0.75).toFixed(1)}</span>
          <span>{(maxCount * 0.5).toFixed(1)}</span>
          <span>{(maxCount * 0.25).toFixed(1)}</span>
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

        {/* Đường chỉ dọc bám theo chuột */}
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
            {svgPaths.areaPath && (
              <path d={svgPaths.areaPath} fill="url(#neonGradient)" />
            )}
            {svgPaths.linePath && (
              <path d={svgPaths.linePath} fill="none" stroke="#ccff00" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            )}
          </svg>
        </div>
      </div>
    </div>
  );
};