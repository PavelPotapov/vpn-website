import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { SUPPORTED_LANGUAGE_CODES, extractLanguageFromPath } from '@/shared/lib/i18n';

import enCommon from './locales/en/common.json';
import ruCommon from './locales/ru/common.json';

const getInitialLanguage = (): string => {
  if (typeof window !== 'undefined') {
    const urlLang = extractLanguageFromPath(window.location.pathname);
    return urlLang && SUPPORTED_LANGUAGE_CODES.includes(urlLang) ? urlLang : 'en';
  }
  return 'en';
};

i18n.use(initReactI18next).init({
  resources: {
    en: { common: enCommon },
    ru: { common: ruCommon },
  },
  lng: getInitialLanguage(),
  fallbackLng: 'en',
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
