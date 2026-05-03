import { SUPPORTED_LANGUAGE_CODES } from './constants';

export const urlLangToLocale = (urlLang: string): string => {
  return urlLang.toLowerCase();
};

export const localeToUrlLang = (locale: string): string => {
  return locale.toLowerCase();
};

export const extractLanguageFromPath = (path: string): string | null => {
  const langMatch = path.match(/^\/([a-z]{2}(-[a-zA-Z]{2})?)(\/|$)/);
  if (langMatch) {
    const langCode = urlLangToLocale(langMatch[1]);
    if (SUPPORTED_LANGUAGE_CODES.includes(langCode)) return langCode;
  }
  return null;
};

export const removeLanguagePrefix = (path: string): string => {
  const langCode = extractLanguageFromPath(path);
  if (langCode) {
    const urlLang = localeToUrlLang(langCode);
    return path.replace(`/${urlLang}`, '') || '/';
  }
  return path;
};

export const addLanguagePrefix = (path: string, langCode: string): string => {
  if (langCode === 'en') return path;
  const cleanPath = removeLanguagePrefix(path);
  const urlLang = localeToUrlLang(langCode);
  return `/${urlLang}${cleanPath}`;
};

export const replaceLanguagePrefix = (path: string, newLangCode: string): string => {
  const cleanPath = removeLanguagePrefix(path);
  return addLanguagePrefix(cleanPath, newLangCode);
};
