import React from 'react';
import { FiUsers, FiUserCheck, FiLock, FiClock } from 'react-icons/fi';
import type { MemberAccountMetrics } from '../types/member-account.types';

interface MemberAccountMetricCardsProps {
  metrics: MemberAccountMetrics;
}

export const MemberAccountMetricCards: React.FC<MemberAccountMetricCardsProps> = ({ metrics }) => {
  const cards = [
    {
      title: 'TỔNG TÀI KHOẢN',
      value: metrics.totalAccounts,
      subtitle: 'Đã tạo tài khoản app',
      icon: <FiUsers size={20} className="text-[#38bdf8]" />,
      accentColor: 'border-t-[#38bdf8]',
    },
    {
      title: 'ĐANG HOẠT ĐỘNG',
      value: metrics.activeAccounts,
      subtitle: 'Truy cập bình thường',
      icon: <FiUserCheck size={20} className="text-[#22c55e]" />,
      accentColor: 'border-t-[#22c55e]',
    },
    {
      title: 'ĐÃ KHÓA',
      value: metrics.lockedAccounts,
      subtitle: 'Bị tạm ngưng quyền',
      icon: <FiLock size={20} className="text-[#ef4444]" />,
      accentColor: 'border-t-[#ef4444]',
    },
    {
      title: 'CHỜ DUYỆT',
      value: metrics.pendingAccounts,
      subtitle: 'Đang thiết lập',
      icon: <FiClock size={20} className="text-[#a855f7]" />,
      accentColor: 'border-t-[#a855f7]',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`bg-[#0a0a0a] border border-[#161616] ${card.accentColor} border-t-2 rounded-2xl p-5 flex flex-col justify-between shadow-lg`}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">
              {card.title}
            </span>
            <div className="p-2 rounded-xl bg-[#121212] border border-[#1f1f1f]">
              {card.icon}
            </div>
          </div>
          <div className="my-1">
            <span className="text-3xl font-black italic tracking-tight text-white font-mono">
              {card.value}
            </span>
          </div>
          <div className="mt-2">
            <p className="text-[10px] text-gray-500 font-mono tracking-wider m-0">
              {card.subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};