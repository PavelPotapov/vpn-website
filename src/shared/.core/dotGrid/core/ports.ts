import type { DotGridConfigOverrides } from './types';

/** Abstract dot grid engine — framework-agnostic */
export interface IDotGridEngine {
  start(): void;
  stop(): void;
  destroy(): void;
  updateConfig(overrides: DotGridConfigOverrides): void;
  resize(): void;
}
