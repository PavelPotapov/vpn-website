# VPN Website

## Обзор
Продающий лендинг + будущий личный кабинет для VPN-сервиса. React Router v7 (SSR + SSG), Tailwind CSS v4, i18n (en/ru).

## Стек
- **React 19** + **React Router v7** (Framework Mode: SSR + SSG)
- **Tailwind CSS v4** — стили
- **shadcn/ui** — UI-компоненты (Radix + CVA + Tailwind)
- **Zustand** — клиентское состояние
- **i18next** — локализация (en, ru)
- **Motion** — анимации
- **Sentry** — мониторинг ошибок
- **Google Tag Manager** — аналитика
- **Vite 7** — сборка
- **pnpm** — менеджер пакетов

## Архитектура: Feature-Sliced Design (FSD)

```
src/
  app/           → всё (инициализация, роутинг, провайдеры)
    .infra/      → инфраструктурные модули (i18n, analytics, sentry, errorHandling)
    ignite/      → инициализация приложения (порядок: Sentry → Analytics)
    routes/      → React Router route files
    theme/       → Tailwind + shadcn CSS variables
  pages/         → widgets, features, entities, shared
  widgets/       → features, entities, shared
  features/      → entities, shared
  entities/      → entities (@x), shared
  shared/        → только внешние библиотеки
    analytics/   → engine аналитики (платформо-агностичный)
    api/         → HTTP transport (axios), ApiError
    config/      → breakpoints
    hooks/       → useHydrated, useIsMobile, useDebouncedCallback, usePrefetch
    lib/         → cn, retryAsync, i18n (hooks, languageUrl), navigation (useNavigate)
    types/       → общие типы
    ui/          → shadcn/ui компоненты (button, card, input, dialog, ...)
```

### Правила зависимостей
- Каждый слой может импортировать только нижележащие
- Импорт только через `index.ts` (barrel)
- ESLint `eslint-plugin-boundaries` + `eslint-plugin-perfectionist` — автоматическая проверка

### Restricted imports (ESLint)
- `useNavigate` → `@/shared/lib/navigation` (автоматический locale prefix)
- `useTranslation` → `@/shared/lib/i18n` (проектная обёртка)
- `axios` → `@/shared/api` (настроенный инстанс)

## Команды

```bash
pnpm install                  # зависимости
pnpm run dev                  # dev-сервер (Express + Vite SSR)
pnpm run build                # production build
npx task lint                 # ESLint
npx task lint:fix             # ESLint автофикс
npx task typecheck            # TypeScript
npx task check                # lint + typecheck + format параллельно
npx task test                 # unit-тесты
npx task format               # Prettier
pnpm release:patch            # релиз (patch)
```

## shadcn/ui

Компоненты устанавливаются через CLI:
```bash
npx shadcn@latest add <component>    # ложится в src/shared/ui/
```

Конфиг: `components.json`. Утилита `cn()`: `@/shared/lib`.

Установленные: button, card, input, dialog, separator, skeleton, tooltip, badge, dropdown-menu, sheet, tabs, scroll-area, avatar.

## i18n (Локализация)

### Структура
- Движок: `shared/lib/i18n/` — утилиты, константы, хуки (useTranslation, useLanguages)
- Конфиг: `app/.infra/i18n/` — инициализация i18next
- Переводы: `app/.infra/i18n/locales/{en,ru}/common.json`

### URL
- Английский: `/`, `/pricing/`
- Русский: `/ru/`, `/ru/pricing/`
- Определение языка: URL prefix → 'en'

### Добавление нового языка
1. Добавить в `shared/lib/i18n/constants.ts`
2. Создать `app/.infra/i18n/locales/{code}/common.json`
3. Зарегистрировать в `app/.infra/i18n/config.ts`
4. Добавить prerender routes в `react-router.config.ts`

## SSR + SSG

- **Node-сервер** (`server/`): Express + React Router SSR для динамических страниц (личный кабинет)
- **SSG**: `prerender` в `react-router.config.ts` — статические страницы генерятся в build time
- Оба режима работают вместе: SSG для лендинга, SSR для динамики

## Analytics

### Паттерн: Engine/Config
- **Engine** (shared): `AnalyticsService<T>` — generic, platform-agnostic
- **Config** (app): `initAnalytics()` — регистрация платформ, типизация событий

## Sentry
- DSN: `VITE_SENTRY_DSN` (пустой → отключён)
- Release: `VITE_SENTRY_RELEASE` (git tag из CI)
- Инициализация: `app/.infra/sentry/`

## Git Hooks (Husky)
- **pre-commit**: lint-staged (prettier + eslint) + typecheck
- **commit-msg**: commitlint (conventional commits, кириллица OK)

## Коммиты
```
feat: добавил страницу тарифов
fix: исправил отображение на мобильных
docs: обновил README
refactor: вынес навигацию в shared/lib
```

## Соглашения
- **Язык кода**: английский (переменные, компоненты, комменты)
- **Язык коммитов**: русский
- **Документация**: русский
- **Naming**: PascalCase (компоненты), camelCase (файлы, переменные)
- **Boolean props**: `is`, `has`, `can`, `should`
- **Event handlers**: `on` (props), `handle` (implementation)

## Структура папок

```
website/
  .husky/          — git hooks
  docs/guides/     — руководства (zustand, motion, cva, react-router, naming, ...)
  public/          — статические файлы
  server/          — Express SSR сервер
  src/             — исходный код (FSD)
  components.json  — shadcn/ui конфиг
  Taskfile.yml     — go-task задачи
  vite.config.ts   — Vite конфиг
  react-router.config.ts — React Router v7
```
