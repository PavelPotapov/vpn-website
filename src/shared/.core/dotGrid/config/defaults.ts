import type { DotGridConfig } from '../core';

export const DEFAULT_DOT_GRID_CONFIG: DotGridConfig = {
  grid: {
    gap: 32,
    dotSize: 1.5,
    dotColor: '59, 155, 245',
    perspective: true,
  },
  sparks: {
    enabled: true,
    color: '59, 155, 245',
    targetCount: 2,
    stepInterval: [70, 120],
    pathLength: [30, 60],
    trailLength: 6,
    diagonalChance: 0.35,
    decay: 0.92,
    glowIntensity: 0.85,
  },
  physics: {
    enabled: true,
    mouseRadius: 200,
    mouseForce: 0.15,
    maxShiftFactor: 0.25,
    returnSpeed: 0.08,
  },
  glow: {
    color: '90, 200, 216',
    pulseSpeed: 0.3,
  },
};
