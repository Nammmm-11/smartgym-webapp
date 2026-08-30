import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, type Language, type TranslationSchema } from '../../constants/translations';
import { userSettingsApi } from '../../api/user-settings.api'; // Import api vừa tạo
import { useAuth } from '../AuthContext'; // Để kiểm tra xem user đã đăng nhập chưa

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => Promise<void>; // Đổi thành Promise vì có gọi API
  t: TranslationSchema;
}

const LanguageContext = createContext<LanguageContextType>({} as LanguageContextType);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth(); // Lấy user hiện tại
  const [lang, setLangState] = useState<Language>('VI'); // Mặc định ban đầu

  // Load ngôn ngữ từ API khi user đăng nhập thành công
  useEffect(() => {
    if (user) {
      const fetchLang = async () => {
        try {
          const res = await userSettingsApi.getLanguage();
          if (res.data && (res.data === 'VI' || res.data === 'EN' || res.data === 'ZH')) {
            setLangState(res.data);
            localStorage.setItem('gym_selected_language', res.data);
          }
        } catch (error) {
          console.error("Lỗi khi lấy ngôn ngữ từ server:", error);
        }
      };
      fetchLang();
    }
  }, [user]);

  // Hàm setLang mới sẽ gọi API lưu lên DB trước, sau đó mới đổi ở UI
  const setLang = async (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('gym_selected_language', newLang);
    try {
        if (user) {
            await userSettingsApi.changeLanguage(newLang);
        }
    } catch (error) {
        console.error("Lỗi khi lưu ngôn ngữ lên server:", error);
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);