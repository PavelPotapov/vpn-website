import { useCallback, useEffect, useState } from 'react';
import i18n from 'i18next';

import { addLanguagePrefix } from '@/shared/lib/i18n';

export function useLocalePath() {
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  useEffect(() => {
    const handler = (lng: string) => setCurrentLanguage(lng);
    i18n.on('languageChanged', handler);
    return () => {
      i18n.off('languageChanged', handler);
    };
  }, []);

  return useCallback(
    (path: string) => {
      if (path.startsWith('http') || path.startsWith('mailto:') || path.startsWith('tel:')) {
        return path;
      }
      return addLanguagePrefix(path, currentLanguage);
    },
    [currentLanguage],
  );
}
