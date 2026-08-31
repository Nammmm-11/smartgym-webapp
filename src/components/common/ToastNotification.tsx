import React from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';

interface ToastNotificationProps {
  message: string | null;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  message,
  type = 'success',
}) => {
  if (!message) return null;

  const isSuccess = type === 'success';
  const isError = type === 'error';

  return (
    <div className={`fixed top-6 right-6 z-[9999] flex items-center gap-3.5 px-5 py-3.5 rounded-2xl bg-[#0c0c14]/95 border shadow-[0_12px_40px_rgba(0,0,0,0.9)] backdrop-blur-xl animate-in slide-in-from-top-4 fade-in duration-200 text-xs font-mono font-bold tracking-wide transition-all ${
      isSuccess 
        ? 'border-gym-neon/50 text-white shadow-[0_0_25px_rgba(204,255,0,0.18)]' 
        : isError 
        ? 'border-red-600/50 text-red-300 shadow-[0_0_25px_rgba(239,68,68,0.18)]' 
        : 'border-blue-600/50 text-blue-300'
    }`}>
      <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${
        isSuccess 
          ? 'bg-gym-neon/15 text-gym-neon border border-gym-neon/30' 
          : isError 
          ? 'bg-red-950/40 text-red-400 border border-red-800/40' 
          : 'bg-blue-950/40 text-blue-400 border border-blue-800/40'
      }`}>
        {isSuccess && <FiCheckCircle size={16} />}
        {isError && <FiAlertCircle size={16} />}
        {!isSuccess && !isError && <FiInfo size={16} />}
      </div>
      <span className="text-white font-bold">{message}</span>
    </div>
  );
};
