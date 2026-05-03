/**
 * ESLint Flat Config — Restricted Imports
 *
 * Проект предоставляет обёртки поверх ряда библиотек.
 * Прямые импорты оригиналов запрещены.
 */

const restrictedImports = [
  {
    name: 'react-router',
    importNames: ['useNavigate'],
    message:
      'Используй useNavigate из @/shared/lib — он добавляет locale-prefix и View Transition автоматически.',
  },
  {
    name: 'react-i18next',
    importNames: ['useTranslation'],
    message: 'Используй useTranslation из @/shared/lib/i18n — проектная обёртка.',
  },
  {
    name: 'axios',
    message: 'Используй apiClient из @/shared/api — настроенный Axios-инстанс с interceptors.',
  },
];

const wrapperFiles = [
  'src/shared/lib/navigation/useNavigate.ts',
  'src/shared/lib/i18n/hooks.ts',
  'src/shared/api/**',
];

/** @type {import('eslint').Linter.Config[]} */
const restrictedConfig = [
  {
    files: ['**/*.{ts,tsx}'],
    ignores: wrapperFiles,
    rules: {
      'no-restricted-imports': ['error', { paths: restrictedImports }],
    },
  },
];

export default restrictedConfig;
