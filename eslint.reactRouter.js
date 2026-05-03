/**
 * ESLint Flat Config — React Router v7 Rules
 *
 * Route-файлы экспортируют loader/meta/action вместе с компонентом —
 * это контракт фреймворка, а не нарушение архитектуры.
 */

const ROUTE_FILES = ['src/app/routes/**/*.{ts,tsx}'];

/** @type {import('eslint').Linter.Config[]} */
const reactRouterConfig = [
  {
    files: ROUTE_FILES,
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
];

export default reactRouterConfig;
