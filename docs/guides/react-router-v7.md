# React Router v7

Используется в **Framework Mode** (SSR + SSG + SPA). Текущая версия: `^7.13.1`.

## Специальные файлы

```
app/
  root.tsx              — корневой маршрут, рендерит HTML-документ
  routes.ts             — конфигурация маршрутов (URL → файл)
  react-router.config.ts — настройки сборки (prerender, ssr и др.)
  entry.client.tsx      — точка входа клиента (hydration)
  entry.server.tsx      — точка входа сервера (SSR rendering)
  routes/               — route-файлы
```

## Route-файлы: структура и экспорты

Route-файлы в `app/routes/` — это **контракт фреймворка**. Из одного файла экспортируется несколько вещей одновременно. Это намеренный дизайн RRv7, не нарушение архитектуры.

Полный список поддерживаемых экспортов:

| Экспорт                               | Что делает                                     |
| ------------------------------------- | ---------------------------------------------- |
| `export async function loader()`      | Серверная загрузка данных (build time при SSG) |
| `export async function action()`      | Обработка форм и мутаций                       |
| `export function meta()`              | SEO-теги (`<title>`, `<meta>`)                 |
| `export function links()`             | `<link>` теги в `<head>`                       |
| `export function headers()`           | HTTP-заголовки ответа (SSR)                    |
| `export const handle`                 | Произвольные метаданные маршрута               |
| `export default function Component()` | React-компонент страницы                       |
| `export function ErrorBoundary()`     | UI для ошибок маршрута                         |
| `export function HydrateFallback()`   | UI во время гидрации                           |

## Типизация: автогенерированные типы

React Router v7 генерирует типы автоматически в `.react-router/types/` при `dev` и `typegen`.
Импортируй типы из `./+types/<route-name>` — TypeScript подхватывает их через `rootDirs`.

```tsx
// app/routes/product.tsx
import type { Route } from './+types/product';

export async function loader({ params }: Route.LoaderArgs) {
  return { name: 'some product' };
}

// Route.ComponentProps типизирует loaderData автоматически из loader
export default function Component({ loaderData }: Route.ComponentProps) {
  return <h1>{loaderData.name}</h1>;
}
```

Доступные сгенерированные типы для каждого маршрута:

- `Route.LoaderArgs` / `Route.ClientLoaderArgs`
- `Route.ActionArgs` / `Route.ClientActionArgs`
- `Route.ComponentProps` — включает типизированный `loaderData`
- `Route.ErrorBoundaryProps`
- `Route.HydrateFallbackProps`
- `Route.MetaArgs`

## Паттерн: route-файл + FSD-страница

Route-файл живёт в `app/routes/` (слой `app`), страница — в `pages/` (слой `pages`).
Страница **не может** импортировать из `app/` (нарушение FSD). Данные передаются через пропсы.

```tsx
// app/routes/product.tsx — route-файл
import type { Route } from './+types/product';
import { ProductPage } from '@/pages/product'; // ← app импортирует pages ✓

export async function loader({ params }: Route.LoaderArgs) {
  return { id: params.id };
}

export default function Component({ loaderData }: Route.ComponentProps) {
  return <ProductPage loaderData={loaderData} />; // ← передаём данные пропсом
}
```

```tsx
// pages/product/ui/ProductPage.tsx — FSD-страница
interface ProductPageProps {
  loaderData: { id: string }; // ← тип объявляется локально, не импортируется из app/
}

export default function ProductPage({ loaderData }: ProductPageProps) {
  return <div>{loaderData.id}</div>;
}
```

```ts
// pages/product/index.ts — barrel
export { default as ProductPage } from './ui/ProductPage';
```

## Паттерн: barrel → route (без отдельного компонента)

Для простых страниц без loaderData route-файл может просто реэкспортировать компонент:

```ts
// app/routes/about.tsx
export { AboutPage as default } from '@/pages/about';
```

## Pre-rendering (SSG)

Настраивается в `react-router.config.ts`:

```ts
export default {
  // Пререндеринг конкретных путей
  prerender: ['/', '/about', '/blog'],

  // Или все статические маршруты
  prerender: true,

  // Или async с динамическими маршрутами
  async prerender({ getStaticPaths }) {
    const slugs = await getPostSlugs();
    return [...getStaticPaths(), ...slugs.map((s) => `/blog/${s}`)];
  },
} satisfies Config;
```

- При SSG `loader` вызывается **один раз в build time**
- Данные сериализуются в HTML — клиент читает их без повторного запроса
- `ssr: false` — только статика, без сервера (SPA mode)

## Anti-Patterns

- НЕ импортируй `loader` или типы из `app/routes/` в `pages/` — нарушение FSD
- НЕ используй `useLoaderData<typeof loader>()` — в v7 дженерик убран, используй `Route.ComponentProps`
- НЕ размещай бизнес-логику в route-файлах — только клей между роутером и FSD-слоями

---

# SSR / Гидрация

## Запрещено в теле компонента (строго!)

Всё, что даёт **разный результат** на сервере и клиенте, нельзя вызывать в теле компонента (вне `useEffect`):

| Запрещено в рендере                     | Решение                                                  |
| --------------------------------------- | -------------------------------------------------------- |
| `Math.random()`, `crypto.randomUUID()`  | Фиксированное значение, `useId()`, или `useHydrated()`   |
| `Date.now()`, `new Date()`              | Передавать из loader или рендерить после `useHydrated()` |
| `window.*`, `document.*`, `navigator.*` | `useEffect()` или `useHydrated()`                        |
| `localStorage`, `sessionStorage`        | `useEffect()` или `typeof window === 'undefined'` guard  |
| `<Navigate to="..." />`                 | `throw redirect()` в loader (см. ниже)                   |

**Безопасные зоны** (browser API можно свободно):

- `useEffect()` / `useLayoutEffect()`
- Event handlers (`onClick`, `onChange` и т.д.)
- Код после `if (!useHydrated()) return`

## useHydrated

```tsx
import { useHydrated } from '@/shared/hooks';

const hydrated = useHydrated();
// hydrated === false на сервере и до гидрации, true — после
```

Файл: `src/shared/hooks/useHydrated.ts`

## Guard'ы — `throw redirect()` в loader, не `<Navigate>` (строго!)

Валидация параметров и редиректы — **только в `loader`** route-файла:

```tsx
// ✗ НЕПРАВИЛЬНО — <Navigate> в компоненте
export default function Component() {
  const { userId } = useParams();
  if (isNaN(Number(userId))) return <Navigate to="/" replace />;
  return <Page />;
}

// ✓ ПРАВИЛЬНО — redirect в loader route-файла
export function loader({ params }: Route.LoaderArgs) {
  if (isNaN(Number(params.userId))) throw redirect('/');
  return null;
}

export default function Component() {
  // Сюда попадаем только с валидными параметрами
  return <Page />;
}
```

## `useSyncExternalStore` — подписки на browser API

Для `window.matchMedia`, `window.innerWidth` и т.д. — `useSyncExternalStore` с третьим аргументом `getServerSnapshot`:

```tsx
const isMobile = useSyncExternalStore(subscribe, getSnapshot, () => false);
//                                                             ^^^^^^^^^^
//                                                   серверный fallback (обязателен)
```

Пример: `useIsMobile()` в `shared/hooks/useMobile.ts`
