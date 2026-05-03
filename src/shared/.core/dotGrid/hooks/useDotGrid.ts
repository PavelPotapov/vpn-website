import { useEffect, useRef } from 'react';

import type { DotGridConfig, DotGridConfigOverrides, IDotGridEngine } from '../core';
import { CanvasDotGridEngine } from '../adapters/canvas';
import { DEFAULT_DOT_GRID_CONFIG } from '../config/defaults';

function mergeConfig(overrides: DotGridConfigOverrides): DotGridConfig {
  return {
    grid: { ...DEFAULT_DOT_GRID_CONFIG.grid, ...overrides.grid },
    sparks: { ...DEFAULT_DOT_GRID_CONFIG.sparks, ...overrides.sparks },
    physics: { ...DEFAULT_DOT_GRID_CONFIG.physics, ...overrides.physics },
    glow: { ...DEFAULT_DOT_GRID_CONFIG.glow, ...overrides.glow },
  };
}

export function useDotGrid(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  overrides: DotGridConfigOverrides = {},
): void {
  const engineRef = useRef<IDotGridEngine | null>(null);
  const configKey = JSON.stringify(overrides);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const config = mergeConfig(overrides);
    const engine = new CanvasDotGridEngine(canvas, config);
    engineRef.current = engine;
    engine.start();

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef, configKey]);
}
