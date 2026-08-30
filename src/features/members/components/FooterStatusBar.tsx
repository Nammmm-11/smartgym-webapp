import React from 'react';
import { useLanguage } from '../../../contexts/i18n/LanguageContext';

export const FooterStatusBar: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-8 py-3 bg-[#060606] border-t border-[#141414] text-[9px] font-mono tracking-widest text-gray-500 uppercase select-none mt-auto">
      <div className="flex items-center gap-2">
        <span className="text-gym-neon font-bold">{t.footer.station}</span>
        <span>//</span>
        <span>{t.footer.internalSystem}</span>
        <span>//</span>
        <span>FIT.GYM</span>
        <span>//</span>
        <span className="text-gray-400">USER: ADMIN@FIT.COM</span>
      </div>

      <div className="flex items-center gap-2 mt-1 sm:mt-0">
        <span className="w-2 h-2 rounded-full bg-gym-neon animate-ping inline-block"></span>
        <span className="text-gray-400">{t.footer.session}</span>
        <span className="text-gym-neon font-bold">ID: 48055</span>
      </div>
    </div>
  );
};
