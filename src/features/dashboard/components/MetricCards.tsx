import React from 'react';

export interface DashboardMetrics {
  expiringInvoicesTotal: number;
  expiredInvoicesTotal: number;
  newInvoicesTotal: number;
  membersTodayTotal: number;
}

interface MetricCardsProps {
  metrics?: DashboardMetrics;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ metrics }) => {
  const stats = [
    { title: "HÓA ĐƠN SẮP HẾT HẠN", count: metrics?.expiringInvoicesTotal || 7, color: "text-[#38bdf8]" },
    { title: "HÓA ĐƠN HẾT HẠN", count: metrics?.expiredInvoicesTotal || 7, color: "text-[#38bdf8]" },
    { title: "HÓA ĐƠN MỚI", count: metrics?.newInvoicesTotal || 0, color: "text-[#ef4444]" },
    { title: "HỘI VIÊN HÔM NAY", count: metrics?.membersTodayTotal || 4, color: "text-gym-neon" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-[#0a0a0a] border border-[#161616] rounded-xl p-5 flex flex-col items-center justify-center text-center shadow-md">
          <p className={`text-[10px] font-black tracking-widest uppercase mb-3 ${stat.color}`}>
            {stat.title}
          </p>
          <p className="text-3xl font-black italic text-white m-0 tracking-wider">
            {stat.count}
          </p>
          <span className="text-[9px] text-gray-600 font-mono uppercase mt-2 font-bold tracking-widest">
            TỔNG SỐ
          </span>
        </div>
      ))}
    </div>
  );
};