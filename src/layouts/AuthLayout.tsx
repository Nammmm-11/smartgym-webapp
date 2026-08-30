import React from 'react';
import { useSlider } from '../hooks/useSlider';

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { currentIndex, setCurrentIndex, currentImage } = useSlider(3, 6000);

  const bannerTags = ["SQUAT RACK", "WE GO GYM", "FITNESS ELITE"];
  const bannerTitles = ["DEEP FOCUS", "IRON WILL", "ELITE DISCIPLINE"];
  const bannerDescs = [
    "CHINH PHỤC TRỌNG LƯỢNG CAO TRƯỚC TỪNG VÒNG ĐẤU NẶNG.",
    "KỶ LUẬT THÉP VÀ TẬP TRUNG TUYỆT ĐỐI CHO HIỆU SUẤT TỐI ĐA.",
    "NÂNG TẦM QUẢN LÝ PHÒNG TẬP LÊN ĐẲNG CẤP MỚI."
  ];

  return (
    <div className="flex w-screen h-screen bg-[#050505] text-white font-sans overflow-hidden">
      {/* CỘT TRÁI: SLIDER ẢNH & TEXT CHUYỂN ĐỘNG */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden h-full">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 opacity-40 scale-105 transition-all duration-1000 ease-in-out"
          style={{ backgroundImage: `url('${currentImage}')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-[#050505] z-0"></div>
        
        <div className="relative z-10 transition-opacity duration-500">
          <p className="text-gym-neon text-xs font-black tracking-[0.2em] mb-2 uppercase">
            {bannerTags[currentIndex]}
          </p>
          <h1 className="text-5xl font-black italic tracking-tighter uppercase m-0">
            {bannerTitles[currentIndex]}
          </h1>
        </div>

        <div className="relative z-10 flex-grow flex items-center justify-center">
          <h2 className="text-6xl font-serif tracking-[0.4em] text-gray-300/80 font-normal">
            G E T  U P .
          </h2>
        </div>

        {/* Thanh phân trang tương tác (Pagination Dots) */}
        <div className="relative z-10">
          <div className="flex gap-2 mb-6 cursor-pointer">
            {[0, 1, 2].map((idx) => (
              <div 
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx 
                    ? 'w-8 bg-gym-neon shadow-[0_0_10px_rgba(204,255,0,0.5)]' 
                    : 'w-2 bg-gray-700 hover:bg-gray-500'
                }`}
              ></div>
            ))}
          </div>
          
          <h3 className="text-gym-neon text-sm font-black italic uppercase mb-2">
            NEXT-GEN FITNESS CLUB MANAGEMENT
          </h3>
          <p className="text-[10px] text-gray-400 tracking-[0.2em] font-mono uppercase m-0">
            {bannerDescs[currentIndex]}
          </p>
        </div>
      </div>

      {/* CỘT PHẢI: FORM */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative bg-[#050505] h-full overflow-y-auto">
        {children}
      </div>
    </div>
  );
};