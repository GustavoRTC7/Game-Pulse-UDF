import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enUS from './locales/en-US.json';
import ptBR from './locales/pt-BR.json';

// Configure i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'en-US': {
        translation: enUS
      },
      'pt-BR': {
        translation: ptBR
      }
    },
    fallbackLng: 'en-US',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'language',
      caches: ['localStorage']
    }
  });

// Format dates according to locale
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat(i18n.language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

// Format numbers according to locale
export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat(i18n.language).format(number);
};

export default i18n;