/**
 * ESLint Flat Config — Feature-Sliced Design (FSD) Rules
 *
 * @see https://feature-sliced.design/
 */

import boundaries from 'eslint-plugin-boundaries';
import perfectionist from 'eslint-plugin-perfectionist';

const boundaryElements = [
  { type: 'app-infra', pattern: ['src/app/.infra/*'], mode: 'folder' },
  { type: 'app', pattern: ['src/app/*'], mode: 'folder' },
  { type: 'pages', pattern: ['src/pages/*'], mode: 'folder' },
  { type: 'widgets', pattern: ['src/widgets/*'], mode: 'folder' },
  { type: 'features', pattern: ['src/features/*'], mode: 'folder' },
  { type: 'entities', pattern: ['src/entities/*'], mode: 'folder' },
  { type: 'shared', pattern: ['src/shared/*'], mode: 'folder' },
];

const layerDependencyRules = [
  {
    from: ['app'],
    allow: ['app', 'app-infra', 'pages', 'widgets', 'features', 'entities', 'shared'],
  },
  { from: ['app-infra'], allow: ['shared'] },
  { from: ['pages'], allow: ['widgets', 'features', 'entities', 'shared'] },
  { from: ['widgets'], allow: ['features', 'entities', 'shared'] },
  { from: ['features'], allow: ['entities', 'shared'] },
  { from: ['entities'], allow: ['entities', 'shared'] },
  { from: ['shared'], allow: ['shared'] },
];

const entryPointRules = [
  { target: ['pages', 'widgets', 'features'], allow: 'index.{ts,tsx}' },
  { target: ['entities'], allow: ['index.{ts,tsx}', '@x/*.ts'] },
  { target: ['shared'], allow: '**' },
  { target: ['app-infra'], allow: 'index.ts' },
  { target: ['app'], allow: '**' },
];

const importOrderConfig = {
  type: 'natural',
  order: 'asc',
  groups: [
    'builtin',
    'external',
    'app',
    'pages',
    'widgets',
    'features',
    'entities',
    'shared',
    ['parent', 'sibling', 'index'],
    'side-effect',
    'side-effect-style',
    'style',
  ],
  customGroups: [
    { groupName: 'app', elementNamePattern: '^@/app/' },
    { groupName: 'pages', elementNamePattern: '^@/pages/' },
    { groupName: 'widgets', elementNamePattern: '^@/widgets/' },
    { groupName: 'features', elementNamePattern: '^@/features/' },
    { groupName: 'entities', elementNamePattern: '^@/entities/' },
    { groupName: 'shared', elementNamePattern: '^@/shared/' },
  ],
  newlinesBetween: 1,
};

/** @type {import('eslint').Linter.Config[]} */
const fsdConfig = [
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      boundaries,
      perfectionist,
    },
    settings: {
      'boundaries/elements': boundaryElements,
      'import/resolver': {
        typescript: { alwaysTryTypes: true },
      },
    },
    rules: {
      'boundaries/element-types': ['error', { default: 'disallow', rules: layerDependencyRules }],
      'boundaries/entry-point': ['error', { default: 'disallow', rules: entryPointRules }],
      'perfectionist/sort-imports': ['error', importOrderConfig],
    },
  },
];

export default fsdConfig;
