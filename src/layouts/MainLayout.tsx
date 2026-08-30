import React, { useState } from 'react';
import { 
  FiGrid, 
  FiActivity, 
  FiUsers, 
  FiBox, 
  FiFileText, 
  FiAward, 
  FiCalendar, 
  FiStar, 
  FiLogOut, 
  FiChevronDown, 
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

export type NavTab = 
  | 'dashboard' 
  | 'members-list' 
  | 'members-accounts' 
  | 'products' 
  | 'packages' 
  | 'staff-receptionist' 
  | 'staff-trainer' 
  | 'ai-analytics' 
  | 'invoices' 
  | 'schedules' 
  | 'reviews';

interface MainLayoutProps {
  children?: React.ReactNode;
  activeTab?: NavTab;
  onTabChange?: (tab: NavTab) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  activeTab = 'members-list',
  onTabChange,
}) => {
  const { logout, user } = useAuth();
  
  const [membersMenuOpen, setMembersMenuOpen] = useState(true);
  const [invoicesMenuOpen, setInvoicesMenuOpen] = useState(false);
  const [staffMenuOpen, setStaffMenuOpen] = useState(true);

  const handleNavClick = (tab: NavTab) => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <div className="flex w-screen h-screen bg-[#050505] text-white font-sans overflow-hidden">
      {/* SIDEBAR BÊN TRÁI */}
      <div className="w-[260px] bg-[#080808] border-r border-[#161616] flex flex-col justify-between p-6 select-none flex-shrink-0 z-20">
        <div className="overflow-y-auto pr-1">
          {/* Logo */}
          <div className="mb-6">
            <h1 className="text-2xl font-black italic tracking-tight m-0 text-white">
              FIT <span className="text-gym-neon">GYM</span>
            </h1>
            <p className="text-[9px] text-gray-500 font-mono mt-1 tracking-[0.2em] uppercase m-0">
              HỆ THỐNG QUẢN LÝ V4.2
            </p>
          </div>

          {/* Section 01: Access */}
          <div className="bg-[#0f0f0f] border border-[#1f1f1f] p-3.5 rounded-2xl mb-6">
            <p className="text-[9px] text-gray-500 font-mono tracking-widest uppercase mb-1">
              01. TRUY CẬP
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-gym-neon animate-pulse"></div>
              <span className="text-xs font-black tracking-wider text-white uppercase truncate">
                {user?.fullName || 'QUẢN TRỊ VIÊN'}
              </span>
            </div>
            <p className="text-[9px] text-gray-500 font-mono mt-1 m-0">QUẢN TRỊ VIÊN // LIVE_</p>
          </div>

          {/* Section 02: Functions */}
          <div className="space-y-1">
            <p className="text-[9px] text-gray-500 font-mono tracking-widest uppercase mb-2">
              02. CHỨC NĂNG
            </p>

            {/* 1. TỔNG QUAN */}
            <button
              type="button"
              onClick={() => handleNavClick('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-black italic tracking-wider transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-gym-neon text-black shadow-[0_0_12px_rgba(204,255,0,0.25)]'
                  : 'text-gray-400 hover:text-white hover:bg-[#121212]'
              }`}
            >
              <FiGrid size={16} /> TỔNG QUAN
            </button>

            {/* 2. PHÂN TÍCH AI */}
            <button
              type="button"
              onClick={() => handleNavClick('ai-analytics')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all cursor-pointer ${
                activeTab === 'ai-analytics'
                  ? 'bg-gym-neon text-black'
                  : 'text-gray-400 hover:text-white hover:bg-[#121212]'
              }`}
            >
              <FiActivity size={16} className="text-gym-neon" /> PHÂN TÍCH AI
            </button>

            {/* 3. QUẢN LÝ HỘI VIÊN */}
            <div>
              <button
                type="button"
                onClick={() => setMembersMenuOpen(!membersMenuOpen)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all cursor-pointer ${
                  activeTab === 'members-list' || activeTab === 'members-accounts'
                    ? 'text-gym-neon bg-[#101509]'
                    : 'text-gray-400 hover:text-white hover:bg-[#121212]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FiUsers size={16} /> QUẢN LÝ HỘI VIÊN
                </div>
                <span className={`transform transition-transform duration-300 ${membersMenuOpen ? 'rotate-180' : 'rotate-0'}`}>
                  <FiChevronDown size={14} />
                </span>
              </button>
              <div className={`grid transition-all duration-300 ease-in-out overflow-hidden ${membersMenuOpen ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
                <div className="overflow-hidden pl-4 space-y-1">
                  <button
                    type="button"
                    onClick={() => handleNavClick('members-list')}
                    className={`w-full flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black tracking-wider transition-all cursor-pointer ${
                      activeTab === 'members-list' ? 'bg-[#14180d] border border-gym-neon/30 text-gym-neon shadow-[0_0_10px_rgba(204,255,0,0.15)]' : 'text-gray-400 hover:text-white hover:bg-[#121212]'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${activeTab === 'members-list' ? 'bg-gym-neon animate-pulse' : 'bg-gray-600'}`}></span>
                    DANH SÁCH HỘI VIÊN
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavClick('members-accounts')}
                    className={`w-full flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold tracking-wider transition-all cursor-pointer ${
                      activeTab === 'members-accounts' ? 'bg-[#14180d] border border-gym-neon/30 text-gym-neon' : 'text-gray-400 hover:text-white hover:bg-[#121212]'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                    TÀI KHOẢN HỘI VIÊN
                  </button>
                </div>
              </div>
            </div>

            {/* 4. QUẢN LÝ SẢN PHẨM */}
            <button
              type="button"
              onClick={() => handleNavClick('products')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all cursor-pointer ${
                activeTab === 'products' ? 'bg-gym-neon text-black shadow-[0_0_12px_rgba(204,255,0,0.25)] font-black' : 'text-gray-400 hover:text-white hover:bg-[#121212]'
              }`}
            >
              <FiBox size={16} /> QUẢN LÝ SẢN PHẨM
            </button>

            {/* 5. HÓA ĐƠN */}
            <div>
              <button
                type="button"
                onClick={() => setInvoicesMenuOpen(!invoicesMenuOpen)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-[#121212] text-xs font-bold tracking-wider transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <FiFileText size={16} /> HÓA ĐƠN
                </div>
                <span className={`transform transition-transform duration-300 ${invoicesMenuOpen ? 'rotate-180' : 'rotate-0'}`}>
                  <FiChevronDown size={14} />
                </span>
              </button>
            </div>

            {/* 6. GÓI TẬP */}
            <button
              type="button"
              onClick={() => handleNavClick('packages')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all cursor-pointer ${
                activeTab === 'packages' ? 'bg-gym-neon text-black shadow-[0_0_12px_rgba(204,255,0,0.25)] font-black' : 'text-gray-400 hover:text-white hover:bg-[#121212]'
              }`}
            >
              <FiAward size={16} /> GÓI TẬP
            </button>

            {/* 7. QUẢN LÝ NHÂN SỰ */}
            <div>
              <button
                type="button"
                onClick={() => setStaffMenuOpen(!staffMenuOpen)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all cursor-pointer ${
                  activeTab === 'staff-receptionist' || activeTab === 'staff-trainer'
                    ? 'text-gym-neon bg-[#101509]'
                    : 'text-gray-400 hover:text-white hover:bg-[#121212]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FiUsers size={16} /> QUẢN LÝ NHÂN SỰ
                </div>
                <span className={`transform transition-transform duration-300 ${staffMenuOpen ? 'rotate-180' : 'rotate-0'}`}>
                  <FiChevronDown size={14} />
                </span>
              </button>
              <div className={`grid transition-all duration-300 ease-in-out overflow-hidden ${staffMenuOpen ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
                <div className="overflow-hidden pl-4 space-y-1">
                  <button
                    type="button"
                    onClick={() => handleNavClick('staff-receptionist')}
                    className={`w-full flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black tracking-wider transition-all cursor-pointer ${
                      activeTab === 'staff-receptionist' ? 'bg-[#14180d] border border-gym-neon/30 text-gym-neon shadow-[0_0_10px_rgba(204,255,0,0.15)]' : 'text-gray-400 hover:text-white hover:bg-[#121212]'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${activeTab === 'staff-receptionist' ? 'bg-gym-neon animate-pulse' : 'bg-gray-600'}`}></span>
                    NHÂN VIÊN QUẦY
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavClick('staff-trainer')}
                    className={`w-full flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold tracking-wider transition-all cursor-pointer ${
                      activeTab === 'staff-trainer' ? 'bg-[#14180d] border border-gym-neon/30 text-gym-neon shadow-[0_0_10px_rgba(204,255,0,0.15)]' : 'text-gray-400 hover:text-white hover:bg-[#121212]'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${activeTab === 'staff-trainer' ? 'bg-gym-neon animate-pulse' : 'bg-gray-600'}`}></span>
                    HUẤN LUYỆN VIÊN
                  </button>
                </div>
              </div>
            </div>

            {/* 8. LỊCH TẬP */}
            <button
              type="button"
              onClick={() => handleNavClick('schedules')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all cursor-pointer ${
                activeTab === 'schedules' ? 'bg-gym-neon text-black shadow-[0_0_12px_rgba(204,255,0,0.25)] font-black' : 'text-gray-400 hover:text-white hover:bg-[#121212]'
              }`}
            >
              <FiCalendar size={16} /> LỊCH TẬP & HUẤN LUYỆN
            </button>

            {/* 9. ĐÁNH GIÁ */}
            <button
              type="button"
              onClick={() => handleNavClick('reviews')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all cursor-pointer ${
                activeTab === 'reviews' ? 'bg-gym-neon text-black shadow-[0_0_12px_rgba(204,255,0,0.25)] font-black' : 'text-gray-400 hover:text-white hover:bg-[#121212]'
              }`}
            >
              <FiStar size={16} /> ĐÁNH GIÁ DỊCH VỤ
            </button>
          </div>
        </div>

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 w-full bg-[#121212] border border-[#222] hover:border-red-500/50 text-red-400 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer mt-4"
        >
          <FiLogOut size={14} /> ĐĂNG XUẤT
        </button>
      </div>

      {/* MAIN VIEWPORT BÊN PHẢI */}
      <div className="flex-grow flex flex-col h-full overflow-hidden bg-[#050505] relative">
        {/* NỘI DUNG CHÍNH (CHILDREN) CỦA CÁC TRANG */}
        <div className="flex-grow overflow-y-auto w-full">
          {children}
        </div>
      </div>
    </div>
  );
};