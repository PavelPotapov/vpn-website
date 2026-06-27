# AGENTS.md — website

> **Канон правил для ЛЮБОГО ИИ-агента** (Claude Code, Cursor, Codex, GLM, …).
> Этот файл — источник истины. `CLAUDE.md` ссылается сюда. Читать целиком перед изменением кода.
>
> **Кросс-агентность:** роли пайплайна (§2) описаны полным текстом, поэтому любой агент, читающий
> этот файл, может исполнять «рой» сам — оркестратор проходит роли последовательно через файлы
> `.agents/<task>/`. Папка `.claude/agents/` — это лишь Claude-нативная надстройка (изолированные
> субагенты с ограничением инструментов); у Codex/GLM её нет, но пайплайн работает через этот файл.

---

## 1. Рабочий процесс задач (READ FIRST)

### 1.1. Опрос в начале задачи

В начале **любой нетривиальной** задачи задай пользователю вопрос:

> «Сделать через **рой агентов** (research → design → plan → implement → review) или в **обычном режиме**?»

Не задавай вопрос, если пользователь уже указал явно («через рой», «обычный режим», «trivial», «без агентов»). Тривиальные задачи (1–2 файла, механика) делай сразу, без опроса.

### 1.2. Обычный режим (по умолчанию, одно-агентный, spec-first)

1. Ветку на задачу от актуальной базы (`feat/<slug>`, `fix/<slug>`, `chore/<slug>`).
2. Перед реализацией — временный спек `.agents/<task-slug>.prd.md`: цель, scope, шаги, критерии приёмки.
3. По ходу держи чеклист спека актуальным.
4. Перед финишем — проверь работу против критериев приёмки, затем **удали временный спек** (он не коммитится).
5. Обнови переводы/доки при необходимости.
6. Финиш: `npx task check` → коммит → push → merge (или PR, если просили).

### 1.3. Режим роя (opt-in, многоэтапный)

Оркестратор (главный агент) **не пишет код сам** — он гоняет роли и передаёт контекст через файлы `.agents/<task>/`. Артефакты переживают сжатие контекста.

```
research-lead → designer → [показать дизайн, подтверждение]
            → planner → [показать план, подтверждение]
            → для каждой фазы: implementer → reviewer → оркестратор(typecheck+test) → commit
            → предложить удалить .agents/<task>/
```

Передача контекста: каждой роли в промпте даём `task-slug` + краткую сводку/указание прочитать нужный файл + важные ограничения из обсуждения с пользователем.

### 1.4. Категории задач (для роя)

| Категория | Критерий                     | Пайплайн                        |
| --------- | ---------------------------- | ------------------------------- |
| Trivial   | 1–2 файла, механика          | без агентов, делает оркестратор |
| Small     | 3–5 файлов, один слой FSD    | research → implement → review   |
| Medium    | 5–15 файлов, несколько слоёв | полный пайплайн                 |
| Large     | 15+ файлов, новый модуль     | полный пайплайн                 |

При сомнении — выбирай бóльшую категорию.

### 1.5. Артефакты `.agents/`

- Обычный режим: `.agents/<task-slug>.prd.md` (временный, удаляется перед коммитом).
- Режим роя: `.agents/<task-slug>/` → `research.md`, `design.md`, `plan/README.md`, `plan/phase-N.md` (удаляются после успешного завершения по согласованию).
- `.agents/` **не коммитится** (см. `.gitignore`).

---

## 2. Роли (для любого агента)

> На Claude каждая роль — отдельный субагент из `.claude/agents/`. На Codex/GLM оркестратор играет роли сам, последовательно, читая/записывая файлы `.agents/<task>/`.

- **research-lead** — собирает факты (as-is, без рекомендаций): какие модули/слайсы/компоненты затронуты, аналогичные паттерны в коде, файлы к изменению. Может декомпозировать на 2–4 параллельных под-исследования. Пишет `.agents/<task>/research.md`. Только чтение + запись research.
- **designer** — архитектор. Читает `AGENTS.md`, `research.md`, ARCHITECTURE/README затронутых слайсов, гайды `docs/guides/`. Проектирует дерево компонентов (ASCII), state-flow, тест-план, проходит FSD decision tree (§4.2). Код не пишет. Пишет `.agents/<task>/design.md`. Оркестратор проверяет FSD-корректность до показа пользователю.
- **planner** — бьёт на фазы (Small 1–2, Medium 2–4, Large 4–6). Порядок: типы/API → стейт/логика → UI снизу вверх по FSD → интеграция/доки. Последняя фаза — документация. Пишет `.agents/<task>/plan/`.
- **implementer** — пишет код строго по `plan/phase-N.md`. Обновляет barrel `index.ts`, доки слайса. Запускает `npx task typecheck` и `npx task test`. При невыполнимом шаге/падении не по своей вине — СТОП, эскалация оркестратору. Возвращает HANDOFF.
- **reviewer** — только чтение. Читает изменённые файлы целиком + план + дизайн. Приоритеты: КРИТИЧНО (SSR-ломающее, FSD-нарушения, XSS) → ВЫСОКИЙ (баги, нейминг, barrel) → СРЕДНИЙ (конвенции) → НИЗКИЙ (стиль). Вердикт ОДОБРЕНО / ТРЕБУЮТСЯ ПРАВКИ. Макс. 3 итерации implementer↔reviewer, потом эскалация пользователю.

Оркестратор (не роли) запускает `npx task typecheck`/`npx task test` после reviewer и делает commit.

---

## 3. Стек и команды

**Стек:** React 19 · React Router v7 (Framework Mode: SSR + SSG) · Tailwind CSS v4 · shadcn/ui (Radix + CVA) · Zustand · i18next (en/ru) · Motion · Sentry · GTM · Vite 7 · pnpm.

```bash
pnpm install            # зависимости
pnpm run dev            # dev (Express + Vite SSR), порт 5391
pnpm run build          # production build
npx task lint           # ESLint        (lint:fix — автофикс)
npx task typecheck      # TypeScript
npx task check          # lint + typecheck + format (параллельно) — запускать перед коммитом
npx task test           # unit-тесты
npx task format         # Prettier
```

---

## 4. Архитектура: Feature-Sliced Design (FSD)

```
src/
  app/        — инициализация, роутинг, провайдеры (.infra: i18n/analytics/sentry; ignite; routes; theme)
  pages/      — страницы (могут импортировать widgets/features/entities/shared)
  widgets/    — самостоятельные блоки (features/entities/shared)
  features/   — пользовательские сценарии (entities/shared)
  entities/   — бизнес-сущности (shared)
  shared/     — переиспользуемое (ui, api, lib, hooks, config) — без бизнес-логики
```

### 4.1. Правила зависимостей

- Слой импортирует только нижележащие. Импорт только через barrel `index.ts`.
- Проверка: ESLint `eslint-plugin-boundaries` + `eslint-plugin-perfectionist`.

### 4.2. FSD decision tree (куда класть новый код)

1. Переиспользуемый UI/утилита без бизнес-смысла → `shared/`.
2. Бизнес-сущность (модель + её API/UI) → `entities/`.
3. Действие пользователя над сущностью → `features/`.
4. Композиция фич/сущностей в блок страницы → `widgets/`.
5. Сборка блоков в маршрут → `pages/`.
6. Глобальная инициализация → `app/`.

### 4.3. Restricted imports (обёртки вместо «голых»)

- `useNavigate`/locale-path → `@/shared/lib/navigation` (авто locale-prefix)
- `useTranslation` → `@/shared/lib/i18n`
- `axios` → `@/shared/api`

---

## 5. Связь с бэкендом (BFF)

Авторизация — через **BFF** (Express `server/`), токены в **httpOnly-куках** (`vpn_at`/`vpn_rt`) + JS-флаг `vpn_auth=1`. Браузер НЕ хранит токены в JS.

- BFF-роуты входа: `/bff/auth/{email,telegram,link-code}/verify`, `/bff/auth/refresh`, `/bff/auth/logout`.
- Прокси `/api/*` → бэкенд с инъекцией `Authorization: Bearer` из куки.
- `apiClient` (axios) на 401 → `/bff/auth/refresh` + retry.
- Сервер также работает **почтовым релеем** бэкенда: `POST /internal/send-email` → nodemailer/SMTP.
- ⚠️ Куки пока без `secure` (сайт на http; включить при домене+TLS).

Ключевые файлы: `server/app.ts` (BFF+релей+прокси), `src/shared/api/lib/apiClient.ts`, `src/features/auth/`, `src/pages/account-dashboard/ui/DashboardPage.tsx`.

---

## 6. i18n

- Всё через `t('namespace.key')`; локаль из URL-префикса (`/` = en, `/ru/` = ru).
- Переводы: `app/.infra/i18n/locales/{en,ru}/common.json` (держать паритет ключей).
- Новый язык: `shared/lib/i18n/constants.ts` → locales/{code}/common.json → `config.ts` → prerender в `react-router.config.ts`.

## 7. SSR-safety

- Auth-зависимый UI гейтить `useHydrated()` (иначе hydration mismatch).
- Доступ к `document`/`window`/кукам — только за `typeof window !== 'undefined'`.

## 8. Конвенции

- **Язык кода/комментов** — английский. **Коммиты** — conventional, тело можно по-русски (commitlint, кириллица OK).
- **Naming:** PascalCase (компоненты), camelCase (файлы/переменные). Page-компоненты — named export, route-обёртки — default.
- **Boolean props:** `is/has/can/should`. **Handlers:** `on*` (props) / `handle*` (impl).
- **Стили:** Tailwind v4 + CVA, утилита `cn()` из `@/shared/lib`; токены темы — CSS-переменные в `app/theme/globals.css`.
- **Git hooks (Husky):** pre-commit (lint-staged + typecheck), commit-msg (commitlint).

## 9. shadcn/ui

`npx shadcn@latest add <component>` → кладётся в `src/shared/ui/`. Конфиг `components.json`.

---

## 10. MCP

В репо есть `.mcp.json`: serena (семантический поиск/правки кода), context7 (доки библиотек), shadcn, playwright. Требуется `uv`/`uvx` в PATH для serena. После клона — перезапустить агента/IDE и подтвердить серверы.
