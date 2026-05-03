# Motion (Animations)

## Package

```bash
pnpm add motion
```

Импорт: `import { motion, AnimatePresence } from "motion/react"`

Vite + React + TypeScript — работает из коробки, никакой конфигурации не нужно.

## Когда использовать Motion

**Используй:**

- Жесты (drag-and-drop, hover scale/rotation, tap)
- Scroll-анимации (parallax, viewport reveals, progress bars)
- Layout-переходы (shared elements, expand/collapse, tab navigation)
- Модальные окна с backdrop и exit-анимациями
- SVG-анимации (path morphing, line drawing)

**НЕ используй:**

- Простые анимации добавления/удаления из списка — используй `auto-animate` (3 KB vs 34 KB)
- Статический контент без взаимодействия
- 3D-анимации — используй Three.js / React Three Fiber

## Core: motion component

```tsx
import { motion } from 'motion/react';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>;
```

## AnimatePresence (exit-анимации)

AnimatePresence **должен оставаться смонтированным**. Условие — внутри.

```tsx
import { AnimatePresence, motion } from 'motion/react';

// ПРАВИЛЬНО — AnimatePresence всегда смонтирован
<AnimatePresence>
  {isVisible && (
    <motion.div key="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      Modal content
    </motion.div>
  )}
</AnimatePresence>;

// НЕПРАВИЛЬНО — exit-анимация не сработает
{
  isVisible && (
    <AnimatePresence>
      <motion.div>Content</motion.div>
    </AnimatePresence>
  );
}
```

**Правила:**

- AnimatePresence оборачивает условие, не наоборот
- Все дочерние элементы **должны иметь уникальный `key`**
- `mode="wait"` — для последовательных переходов (предыдущий уходит → новый появляется)

## Layout Animations

```tsx
// Автоматическая FLIP-анимация при изменении layout
<motion.div layout>
  {isExpanded ? <FullContent /> : <Summary />}
</motion.div>

// Shared element transitions — элементы с одинаковым layoutId анимируются между собой
<motion.div layoutId="card-1">...</motion.div>
```

**Специальные пропсы:**

- `layout` — включает FLIP layout-анимацию
- `layoutId` — связывает элементы для shared transitions
- `layoutScroll` — для элементов в scrollable контейнерах
- `layoutRoot` — для элементов в fixed-position контейнерах

## Scroll Animations

```tsx
import { motion, useScroll, useTransform } from 'motion/react';

// Viewport-triggered
<motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-100px' }}
>
  Appears when 100px from viewport
</motion.div>;

// Scroll-linked
function ParallaxHero() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -300]);

  return <motion.div style={{ y }}>Parallax content</motion.div>;
}
```

## Gestures

```tsx
// Используй while* пропсы, НЕ event handlers
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  whileFocus={{ boxShadow: "0 0 0 2px rgba(66,153,225,0.6)" }}
>
  Button
</motion.button>

// Drag
<motion.div
  drag="x"
  dragConstraints={{ left: -200, right: 200 }}
  dragElastic={0.2}
/>
```

## Transitions (Spring & Tween)

```tsx
// Spring (по умолчанию для transform) — физически естественные, прерываемые
<motion.div
  animate={{ x: 100 }}
  transition={{ type: "spring", stiffness: 300, damping: 20 }}
/>

// Tween — для duration-based анимаций
<motion.div
  animate={{ opacity: 1 }}
  transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
/>
```

**Правило:** для интерактивных анимаций (жесты, drag) используй spring — они прерываемы. Tween с duration для простых появлений/исчезновений.

## Tailwind + Motion

Tailwind для стилей, Motion для анимаций. **Убирай Tailwind transitions!**

```tsx
// НЕПРАВИЛЬНО — Tailwind transition конфликтует с Motion
<motion.div className="transition-all duration-300" animate={{ x: 100 }} />

// ПРАВИЛЬНО — убери Tailwind transition
<motion.div className="bg-blue-600 rounded-lg px-4 py-2" animate={{ x: 100 }} />
```

## Performance

### LazyMotion (уменьшение бандла: 34 KB → 4.6 KB)

```tsx
import { LazyMotion, domAnimation, m } from 'motion/react';

// В app/providers или layout
<LazyMotion features={domAnimation}>
  {/* Используй 'm' вместо 'motion' */}
  <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    Lightweight animation
  </m.div>
</LazyMotion>;
```

### Предотвращение ре-рендеров

```tsx
import { useMotionValue, useTransform } from 'motion/react';

// ПРАВИЛЬНО — useMotionValue не вызывает ре-рендер
const x = useMotionValue(0);
const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0]);

<motion.div style={{ x, opacity }} drag="x" />;

// НЕПРАВИЛЬНО — useState вызывает ре-рендер на каждый кадр
const [x, setX] = useState(0);
```

**Правила:**

- `useMotionValue` вместо `useState` для анимируемых значений
- `useTransform` для производных значений (не пересчитывай в useEffect)
- Определяй `variants` вне компонента (стабильная ссылка)
- Hardware acceleration: `style={{ willChange: "transform" }}` для тяжёлых анимаций
- 50+ анимируемых элементов → используй виртуализацию (`@tanstack/react-virtual`)

### Variants (вынеси за пределы компонента)

```tsx
// ПРАВИЛЬНО — стабильная ссылка, без ре-рендеров
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function Card() {
  return <motion.div variants={cardVariants} initial="hidden" animate="visible" />;
}
```

## Accessibility

```tsx
import { MotionConfig } from 'motion/react';

// В app/providers — уважай настройку пользователя
<MotionConfig reducedMotion="user">
  <App />
</MotionConfig>;
```

- `"user"` — уважает OS `prefers-reduced-motion` (рекомендуется)
- `"always"` — отключает анимации полностью
- `"never"` — игнорирует настройку

## Known Issues

1. **AnimatePresence exit не работает** — AnimatePresence обёрнут в условие или отсутствует `key` → AnimatePresence снаружи, key на каждом child
2. **Tailwind transitions конфликт** — `transition-*` классы → убери их при использовании Motion
3. **Layout-анимации в scroll-контейнерах** — неполные переходы → добавь `layoutScroll` на scroll-контейнер
4. **Layout-анимации в fixed-элементах** — неверное позиционирование → добавь `layoutRoot` на fixed-элемент
5. **layoutId + AnimatePresence** — элементы не размонтируются → оберни в `LayoutGroup`
6. **50+ анимируемых элементов** — тормоза → виртуализация (`react-window`, `@tanstack/react-virtual`)
7. **Процентные значения ломают layout-анимации** — переведи в пиксели
8. **React 19 StrictMode + Drag** — жесты ломаются (Ant Design) → временно отключи StrictMode или используй React 18

## Anti-Patterns

- НЕ смешивай Tailwind `transition-*` и Motion-анимации
- НЕ используй `useState` для анимируемых значений — используй `useMotionValue`
- НЕ определяй `variants` внутри компонента — выноси наружу
- НЕ оборачивай AnimatePresence в условие — условие внутри
- НЕ анимируй `width`/`height` напрямую — используй `layout` prop для FLIP
- НЕ используй Motion для простых list add/remove — используй `auto-animate`
