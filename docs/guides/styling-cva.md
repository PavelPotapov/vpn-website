# Styling Rules (CVA) & Theme Tokens

## Scope

Эти правила **НЕ** применяются к shadcn/ui компонентам в `shared/ui/`.
shadcn-компоненты остаются в оригинальном виде.
CVA-правила — только для кастомных компонентов в app/, pages/, widgets/, features/, entities/.

## File Structure

Если у компонента есть файл стилей `.styles.ts`, компонент оборачивается в **папку**:

```
layer/
  sliceName/
    ui/
      ComponentName/
        ComponentName.tsx
        ComponentName.styles.ts
        index.ts            ← barrel: export { ComponentName } from './ComponentName'
```

Компоненты **без** `.styles.ts` остаются плоскими файлами:

```
layer/
  sliceName/
    ui/
      SimpleComponent.tsx
```

- Имя файла стилей: **PascalCase** с суффиксом `.styles.ts` — `ErrorBoundary.styles.ts`, `ChatMessage.styles.ts`
- Файл стилей импортируется из того же каталога: `import { cvaRoot } from './ComponentName.styles'`
- Barrel-файл в родительском слайсе (`entities/chat/index.ts`) указывает на `./ui/ComponentName` — Node резолвит папку через `index.ts`

## Basic CVA (без вариантов)

```typescript
// ComponentName.styles.ts
import { cva } from 'class-variance-authority';

export const cvaRoot = cva([
  'component-name-cvaRoot', // уникальный идентификатор для дебага
  'flex flex-col min-w-36',
  'bg-general_background_MIII_450_dark',
]);
```

## CVA with Variants

```typescript
export const cvaCardsContainer = cva(
  ['component-name-cvaCardsContainer', 'flex flex-col mx-auto z-[100]'],
  {
    variants: {
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);
```

## Naming

- CVA-имена начинаются с `cva`: `cvaRoot`, `cvaButtonContent`, `cvaCardsContainer`
- Первый класс — уникальный идентификатор: `component-name-cvaRoot`
- kebab-case для идентификатора компонента: `authenticated-layout-cvaRoot`

## Colors & Theme Tokens

### Приоритет: CSS-переменные → хардкод

Всегда **стараемся использовать CSS-переменные** из темы (`shadcn.css`). Хардкод hex/rgb допустим только когда подходящего токена нет или нужен уникальный цвет, не зависящий от темы.

```tsx
// ПРАВИЛЬНО — токен темы
'bg-primary'   'text-muted-foreground'   'border-border'
style={{ color: 'var(--foreground)' }}

// ДОПУСТИМО — хардкод с фоллбэком или уникальный цвет
style={{ background: 'var(--card, #12161f)' }}
style={{ background: 'rgba(0,0,0,0.3)' }}

// ПЛОХО — хардкод вместо существующего токена
'shadow-[0_0_48px_rgba(0,178,98,0.06)]'  // = --primary, используй токен!
```

### Доступные токены

Основные: `--background`, `--foreground`, `--card`, `--muted`, `--muted-foreground`, `--primary`, `--border`, `--destructive`, `--warning`, `--success`, `--info`. Tailwind-классы: `bg-{token}`, `text-{token}`, `border-{token}`. Полный список — в `src/app/theme/shadcn.css`.

### Computed-токены (color-mix) — замена opacity-модификаторам

**Не используй opacity-модификаторы** (`/40`, `/50`) на семантических цветах темы.
Opacity-модификаторы дают полупрозрачность — результат зависит от фона под элементом и непредсказуем при смене темы.

Вместо них — **computed-токены** на основе `color-mix()`. Они вычисляются автоматически из базовых токенов и дают **непрозрачный** цвет, предсказуемый в любой теме.

| Токен                  | Tailwind-класс          | Заменяет                                  | Формула                 |
| ---------------------- | ----------------------- | ----------------------------------------- | ----------------------- |
| `--card-hover`         | `bg-card-hover`         | `hover:bg-muted/50`, `hover:bg-accent/40` | 4% foreground на card   |
| `--card-active`        | `bg-card-active`        | `bg-muted/60`, `bg-accent`                | 8% foreground на card   |
| `--primary-subtle`     | `bg-primary-subtle`     | `bg-primary/5..15`                        | 12% primary на card     |
| `--destructive-subtle` | `bg-destructive-subtle` | `bg-destructive/10..15`                   | 12% destructive на card |
| `--border-subtle`      | `border-border-subtle`  | `border-border/40..50`                    | 50% border на card      |
| `--dim-foreground`     | `text-dim-foreground`   | `text-muted-foreground/50..60`            | 60% muted-foreground    |
| `--faint-foreground`   | `text-faint-foreground` | `text-muted-foreground/20..35`            | 35% muted-foreground    |

```tsx
// ПРАВИЛЬНО — computed-токен
'hover:bg-card-hover'; // вместо hover:bg-muted/50
'bg-primary-subtle'; // вместо bg-primary/10
'text-dim-foreground'; // вместо text-muted-foreground/50
'border-border-subtle'; // вместо border-border/40

// ПЛОХО — opacity-модификатор на токене темы
'hover:bg-muted/50'; // непредсказуем при смене темы
'bg-primary/10'; // результат зависит от фона
'text-muted-foreground/40'; // контраст плавает
```

**Исключения** — opacity-модификаторы допустимы:

- `bg-background/80` с `backdrop-blur-sm` — нужна реальная полупрозрачность для blur
- `bg-black/80` — overlay-затемнение (не зависит от темы)
- Хардкод-цвета (`bg-purple-500/10`) — не из темы, предсказуемы

### Прозрачность для box-shadow и glow

Для box-shadow, glow и overlay с прозрачностью от токена используй `color-mix`:

```css
color-mix(in srgb, var(--primary) 6%, transparent)
```

В Tailwind — через arbitrary value: `shadow-[0_0_48px_color-mix(in_srgb,var(--primary)_6%,transparent)]`
