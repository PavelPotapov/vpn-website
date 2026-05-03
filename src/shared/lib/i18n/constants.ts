export type Language = {
  code: string;
  flag: string;
  translationKey: string;
  nativeName: string;
};

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', flag: '', translationKey: 'language.english', nativeName: 'English' },
  { code: 'ru', flag: '', translationKey: 'language.russian', nativeName: 'Русский' },
];

export const SUPPORTED_LANGUAGE_CODES = SUPPORTED_LANGUAGES.map((lang) => lang.code);
