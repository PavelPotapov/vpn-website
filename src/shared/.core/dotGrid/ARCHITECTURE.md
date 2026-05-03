<!-- @core -->

# dotGrid — Hexagonal Core Module

## Назначение

Анимированная точечная сетка с эффектом «одеяла» при наведении мыши и электрическими
импульсами (sparks). Framework-agnostic ядро + React-адаптер.

## Архитектура: Ports & Adapters

```
┌─────────────────────────────────────────┐
│  Потребители (pages, widgets)           │
│  <DotGrid grid={...} sparks={...} />    │
│  useDotGrid(canvasRef, config)          │
└───────────────┬─────────────────────────┘
                │ public API (index.ts)
┌───────────────▼─────────────────────────┐
│  core/                                  │
│  ├── types.ts    — DotGridConfig,       │
│  │                 GridConfig,          │
│  │                 SparkConfig, ...     │
│  └── ports.ts    — IDotGridEngine       │
└───────────────┬─────────────────────────┘
                │ implements
┌───────────────▼─────────────────────────┐
│  adapters/canvas/                       │
│  └── CanvasDotGridEngine (IDotGridEngine)│
│      Canvas 2D рендер: сетка, физика,   │
│      искры, glow                        │
└─────────────────────────────────────────┘
```

## Порты

- **IDotGridEngine** — start, stop, destroy, updateConfig, resize

## Адаптер: Canvas 2D

- `CanvasDotGridEngine` — полная реализация через Canvas 2D API
- DPR-aware рендер, requestAnimationFrame loop
- Smoothstep физика мыши, линейные искры с trail

## Конфигурация

Вся конфигурация через `DotGridConfig`:
- `grid` — gap, dotSize, dotColor, perspective
- `sparks` — speed, pathLength, count, color, trailLength, diagonalChance, decay
- `physics` — mouseRadius, mouseForce, maxShiftFactor, returnSpeed
- `glow` — color, pulseSpeed

Дефолты: `config/defaults.ts`

## Структура файлов

```
dotGrid/
  core/
    types.ts              — DotGridConfig и вложенные типы
    ports.ts              — IDotGridEngine
    index.ts
  adapters/canvas/
    canvasDotGridEngine.ts — реализация IDotGridEngine
    index.ts
  config/
    defaults.ts           — DEFAULT_DOT_GRID_CONFIG
  hooks/
    useDotGrid.ts         — React-хук создания/lifecycle engine
    index.ts
  ui/
    DotGrid.tsx           — React-компонент
    index.ts
  index.ts                — Public API
  ARCHITECTURE.md
```

## Замена рендер-движка

Для WebGL/Three.js/PixiJS:

1. Создать `adapters/webgl/WebGLDotGridEngine.ts` с реализацией IDotGridEngine
2. Обновить `hooks/useDotGrid.ts` или создать `useWebGLDotGrid`
3. `core/` и публичный API остаются без изменений
