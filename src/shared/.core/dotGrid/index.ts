// Core types and interfaces
export type {
  RGBColor,
  GridConfig,
  SparkConfig,
  PhysicsConfig,
  GlowConfig,
  DotGridConfig,
  DotGridConfigOverrides,
  IDotGridEngine,
} from './core';

// Config
export { DEFAULT_DOT_GRID_CONFIG } from './config/defaults';

// Adapters
export { CanvasDotGridEngine } from './adapters/canvas';

// Hooks
export { useDotGrid } from './hooks';

// UI
export { DotGrid } from './ui';
