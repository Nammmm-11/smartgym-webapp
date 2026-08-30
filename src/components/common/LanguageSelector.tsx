import React, { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { useLanguage } from '../../contexts/i18n/LanguageContext';

// SVG FLAGS (Full cross-platform support including Windows)
export const VietnamFlag: React.FC<{ className?: string }> = ({ className = 'w-5 h-3.5' }) => (
  <svg
    viewBox="0 0 900 600"
    className={`inline-block rounded-[3px] border border-white/10 shadow-sm flex-shrink-0 ${className}`}
  >
    <rect width="900" height="600" fill="#DA251D" />
    <polygon
      points="450,150 488,266 610,266 511,338 549,454 450,382 351,454 389,338 290,266 412,266"
      fill="#FFFF00"
    />
  </svg>
);

export const UKFlag: React.FC<{ className?: string }> = ({ className = 'w-5 h-3.5' }) => (
  <svg
    viewBox="0 0 60 30"
    className={`inline-block rounded-[3px] border border-white/10 shadow-sm flex-shrink-0 ${className}`}
  >
    <clipPath id="uk-clip-nav">
      <path d="M0,0 v30 h60 v-30 z" />
    </clipPath>
    <clipPath id="uk-diag-nav">
      <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
    </clipPath>
    <g clipPath="url(#uk-clip-nav)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#uk-diag-nav)" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </g>
  </svg>
);

export const ChinaFlag: React.FC<{ className?: string }> = ({ className = 'w-5 h-3.5' }) => (
  <svg
    viewBox="0 0 900 600"
    className={`inline-block rounded-[3px] border border-white/10 shadow-sm flex-shrink-0 ${className}`}
  >
    <rect width="900" height="600" fill="#DE2910" />
    <g fill="#FFDE00">
      <polygon points="150,60 178,145 268,145 195,198 223,283 150,230 77,283 105,198 32,145 122,145" />
      <polygon points="300,60 306,78 325,78 310,89 315,107 300,96 285,107 290,89 275,78 294,78" transform="rotate(-35 300 80)" />
      <polygon points="360,120 366,138 385,138 370,149 375,167 360,156 345,167 350,149 335,138 354,138" transform="rotate(-15 360 140)" />
      <polygon points="360,200 366,218 385,218 370,229 375,247 360,236 345,247 350,229 335,218 354,218" transform="rotate(10 360 220)" />
      <polygon points="300,260 306,278 325,278 310,289 315,307 300,296 285,307 290,289 275,278 294,278" transform="rotate(35 300 280)" />
    </g>
  </svg>
);

export interface LanguageOption {
  code: 'VI' | 'EN' | 'ZH';
  label: string;
  FlagComponent: React.FC<{ className?: string }>;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'VI', label: 'Tiếng Việt', FlagComponent: VietnamFlag },
  { code: 'EN', label: 'English', FlagComponent: UKFlag },
  { code: 'ZH', label: '中文', FlagComponent: ChinaFlag },
];

export const LanguageSelector: React.FC = () => {
  const { lang, setLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];
  const CurrentFlag = current.FlagComponent;

  return (
    <div className="relative z-50">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-[#0f0f0f] border border-[#1f1f1f] hover:border-gym-neon px-3.5 py-1.5 rounded-xl text-xs font-bold text-white transition-all cursor-pointer shadow-sm"
      >
        <CurrentFlag className="w-4 h-3" />
        <span className="font-mono text-xs tracking-wider">{current.code}</span>
        <IoIosArrowDown
          className={`text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-gym-neon' : ''
          }`}
          size={12}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop for click outside */}
          <div
            className="fixed inset-0 z-40 bg-transparent"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu items */}
          <div className="absolute right-0 mt-2 w-44 bg-[#0f0f0f] border border-[#262626] rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] py-1.5 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            {LANGUAGES.map((item) => {
              const isSelected = lang === item.code;
              const Flag = item.FlagComponent;

              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    setLang(item.code);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 text-xs font-bold transition-all cursor-pointer flex items-center justify-between group ${
                    isSelected
                      ? 'bg-[#181818] text-gym-neon font-black'
                      : 'text-gray-300 hover:bg-[#141414] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Flag className="w-5 h-3.5" />
                    <span className="text-xs">{item.label}</span>
                  </div>

                  <span
                    className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border transition-colors ${
                      isSelected
                        ? 'border-gym-neon/40 text-gym-neon bg-gym-neon/10'
                        : 'border-[#222] text-gray-500 group-hover:text-gray-400'
                    }`}
                  >
                    {item.code}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
