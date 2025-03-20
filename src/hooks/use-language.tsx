
import { create } from 'zustand';
import { useEffect } from 'react';

type Language = 'en' | 'ar'; // Updated to allow both 'en' and 'ar' types

interface LanguageState {
  language: Language;
  isRTL: boolean;
}

export const useLanguageStore = create<LanguageState>(() => ({
  language: 'en',
  isRTL: false,
}));

export const useLanguage = () => {
  const { language, isRTL } = useLanguageStore();
  
  useEffect(() => {
    // Set the dir attribute on the body element
    document.documentElement.setAttribute('dir', 'ltr');
    document.documentElement.setAttribute('lang', 'en');
  }, []);
  
  // For backward compatibility, we'll keep the t function but it will always return the English text
  const t = (en: string, _ar: string) => en;
  
  return { 
    language,
    isRTL,
    t
  };
};
