import { useTranslation as useI18nTranslation } from 'react-i18next';

import { SUPPORTED_LANGUAGES } from './constants';
import type { Language } from './constants';

export const useTranslation = (namespace?: string) => {
  const { t, i18n } = useI18nTranslation(namespace);

  return {
    t,
    i18n,
    currentLanguage: i18n.language,
    changeLanguage: i18n.changeLanguage,
  };
};

export const useLanguages = (namespace: string = 'common'): Array<Language & { label: string }> => {
  const { t } = useI18nTranslation(namespace);

  return SUPPORTED_LANGUAGES.map((lang) => ({
    ...lang,
    label: t(lang.translationKey),
  }));
};
