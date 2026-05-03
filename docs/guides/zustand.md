# Zustand State Management

## Когда использовать

- Клиентское состояние, НЕ связанное с сервером (серверное состояние → TanStack Query)
- UI-состояние, которое шарится между несвязанными компонентами
- Состояние форм/фильтров, которое нужно персистить
- Любое глобальное клиентское состояние

## Структура store-модуля

```
entities/{entityName}/model/   или   shared/stores/{storeName}/
├── types.ts            # Типы state и actions (отдельно!)
├── {storeName}Store.ts # Создание стора
├── selectors.ts        # Селекторы (чистые функции)
├── hooks.ts            # React-хуки (публичный API для компонентов)
└── index.ts            # Реэкспорт public API
```

## Types — разделение state и actions

```typescript
// types.ts
interface CartState {
  items: CartItem[];
  wishlist: Book[];
}

interface CartActions {
  addToCart: (book: Book) => void;
  removeFromCart: (bookId: number) => void;
  clearCart: () => void;
}

export interface CartStore extends CartState {
  actions: CartActions; // Actions ВСЕГДА вложены в объект `actions`
}
```

**Ключевое правило:** actions группируются в объект `actions`, а не лежат рядом со state. Это даёт стабильную ссылку — компоненты, использующие только actions, не ре-рендерятся при изменении state.

## Store — создание с middleware

Порядок middleware: `devtools(persist(immer(...)))`.

```typescript
// cartStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { CartStore } from './types';

const devToolsOptions = {
  store: 'cart-storage',
  name: 'CartStore',
  enabled: import.meta.env.DEV,
};

const persistOptions = {
  name: 'cart-storage',
  partialize: (state: CartStore) => {
    const { actions: _, ...rest } = state;
    return rest; // Никогда не персистим actions
  },
};

export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        items: [],
        wishlist: [],

        actions: {
          addToCart: (book) => {
            set(
              (state) => {
                state.items.push({ book, quantity: 1 });
              },
              false,
              'addToCart',
            );
          },

          removeFromCart: (bookId) => {
            set(
              (state) => {
                const index = state.items.findIndex((item) => item.book.id === bookId);
                if (index !== -1) state.items.splice(index, 1);
              },
              false,
              'removeFromCart',
            );
          },

          clearCart: () => {
            set(
              (state) => {
                state.items = [];
              },
              false,
              'clearCart',
            );
          },
        },
      })),
      persistOptions,
    ),
    devToolsOptions,
  ),
);
```

## Immer — правила мутаций

```typescript
// ПРАВИЛЬНО: мутируем draft напрямую
set((state) => {
  state.count += 1;
  state.items.push(newItem);
  state.nested.property = 'value';
});

// НЕПРАВИЛЬНО: не возвращай новый объект при использовании immer
set((state) => ({ ...state, count: state.count + 1 }));
```

## Selectors — чистые функции

```typescript
// selectors.ts
import type { CartStore } from './types';

export const cartActionsSelector = (state: CartStore) => state.actions;
export const cartItemsSelector = (state: CartStore) => state.items;

// Вычисляемые селекторы
export const cartTotalPriceSelector = (state: CartStore) =>
  state.items.reduce((total, item) => total + item.book.price * item.quantity, 0);

// Параметризованные селекторы (каррирование)
export const isInCartSelector = (bookId: number) => (state: CartStore) =>
  state.items.some((item) => item.book.id === bookId);
```

## Hooks — публичный API для компонентов

```typescript
// hooks.ts
import { useCartStore } from './cartStore';
import {
  cartActionsSelector,
  cartItemsSelector,
  cartTotalPriceSelector,
  isInCartSelector,
} from './selectors';
import type { CartStore } from './types';

export const useCartActions = (): CartStore['actions'] => useCartStore(cartActionsSelector);
export const useCartItems = (): CartStore['items'] => useCartStore(cartItemsSelector);
export const useCartTotalPrice = (): number => useCartStore(cartTotalPriceSelector);
export const useIsInCart = (bookId: number): boolean => useCartStore(isInCartSelector(bookId));
```

**Компоненты импортируют ТОЛЬКО хуки из `hooks.ts`, никогда напрямую store.**

## useShallow — для объектных селекторов

```typescript
import { useShallow } from 'zustand/shallow';

// Если селектор возвращает новый объект — оберни в useShallow
export const useAllFilters = () => useFiltersStore(useShallow(allFiltersSelector));
```

## Persist — конфигурация

```typescript
const persistOptions = {
  name: 'storage-key', // Ключ в localStorage
  version: 1, // Для миграций
  storage: sessionStorage, // По умолчанию localStorage
  partialize: (state: MyStore) => {
    const { actions: _, ...rest } = state;
    return rest; // Всегда исключай actions
  },
};
```

## DevTools — именование actions

Каждый `set()` вызов должен иметь label для Redux DevTools:

```typescript
// Строка
set(
  (state) => {
    state.value = 1;
  },
  false,
  'setValue',
);

// Объект с payload
set(
  (state) => {
    state.items.push(item);
  },
  false,
  { type: 'addItem', payload: item },
);
```

## Context-based Store (для сторов с начальными пропсами)

Используй `createStore()` + React Context, когда нужны разные инстансы с разными начальными данными:

```typescript
import { createStore } from 'zustand';
import { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';

const SettingsContext = createContext<ReturnType<typeof createSettingsStore> | null>(null);

export const SettingsProvider = ({ children, ...initialState }) => {
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = createSettingsStore(initialState);
  }
  return <SettingsContext value={storeRef.current}>{children}</SettingsContext>;
};

export function useSettingsStore<T>(selector: (state: SettingsStore) => T): T {
  const store = useContext(SettingsContext);
  if (!store) throw new Error('useSettingsStore must be used within SettingsProvider');
  return useStore(store, selector);
}
```

## Known Issues (из zustand@5+)

1. **TypeScript double parentheses** — `create<MyStore>()(...)` — двойные скобки обязательны для вывода типов с middleware
2. **Infinite render loop** — если селектор возвращает новый объект каждый рендер → оберни в `useShallow`
3. **Persist race condition** — `onRehydrateStorage` может сработать до рендера → используй `_hasHydrated` флаг при SSR
4. **Persist middleware import** — в zustand@5 импорт `immer` из `zustand/middleware/immer` (отдельный путь!)
5. **StrictMode double init** — НЕ инициализируй store через `useEffect` (вызовется дважды) → инициализируй при создании store или на уровне модуля

## Slices Pattern (для больших сторов)

```typescript
// Разделение стора на слайсы
interface SliceA {
  count: number;
  actions: { increment: () => void };
}
interface SliceB {
  name: string;
  actions: { setName: (n: string) => void };
}

const createSliceA: StateCreator<SliceA & SliceB, [], [], SliceA> = (set) => ({
  count: 0,
  actions: {
    increment: () =>
      set(
        (s) => {
          s.count += 1;
        },
        false,
        'increment',
      ),
  },
});

// Объединение
const useStore = create<SliceA & SliceB>()(
  devtools(
    immer((...a) => ({
      ...createSliceA(...a),
      ...createSliceB(...a),
    })),
  ),
);
```

Используй slices когда стор становится больше ~200 строк.

## Чеклист при создании стора

1. Типы state и actions разделены; actions вложены в объект `actions`
2. Middleware: `devtools(persist(immer(...)))` (persist опционален)
3. Actions определены внутри `actions`, не рядом со state
4. Мутации через immer (мутируем draft, не возвращаем новый объект)
5. `partialize` исключает `actions` из persist
6. DevTools label на каждый `set()`
7. Селекторы — отдельный файл, чистые функции
8. Хуки — отдельный файл, единственный способ доступа из компонентов
9. `useShallow` для селекторов, возвращающих объекты
10. TypeScript: `create<T>()(...)` — двойные скобки
