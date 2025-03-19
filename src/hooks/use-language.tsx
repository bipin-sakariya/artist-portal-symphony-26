
import { create } from 'zustand';
import { useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
  isRTL: boolean;
}

const getDefaultLanguage = (): Language => {
  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage === 'en' || savedLanguage === 'ar') {
    return savedLanguage;
  }
  
  // Check browser language preferences
  const browserLanguages = navigator.languages || [navigator.language];
  for (const lang of browserLanguages) {
    if (lang.startsWith('ar')) {
      return 'ar';
    }
  }
  
  return 'en';
};

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'en', // Default initial value, will be updated in useEffect
  isRTL: false,
  setLanguage: (language: Language) => {
    localStorage.setItem('language', language);
    set({ 
      language,
      isRTL: language === 'ar'
    });
  },
}));

export const useLanguage = () => {
  const { language, setLanguage, isRTL } = useLanguageStore();
  
  useEffect(() => {
    // Initialize language on first load
    const defaultLanguage = getDefaultLanguage();
    setLanguage(defaultLanguage);
    
    // Set the dir attribute on the body element
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
  }, [language, isRTL, setLanguage]);
  
  const t = (en: string, ar: string) => (language === 'ar' ? ar : en);
  
  return { 
    language,
    setLanguage,
    isRTL,
    t
  };
};
