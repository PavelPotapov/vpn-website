import { useRef, useMemo } from 'react';

import { cn } from '@/shared/lib';

import type { DotGridConfigOverrides } from '../core';
import { useDotGrid } from '../hooks';

interface DotGridProps extends DotGridConfigOverrides {
  className?: string;
}

export function DotGrid({ className, grid, sparks, physics, glow }: DotGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const overrides = useMemo<DotGridConfigOverrides>(
    () => ({ grid, sparks, physics, glow }),
    [grid, sparks, physics, glow],
  );

  useDotGrid(canvasRef, overrides);

  return (
    <canvas
      ref={canvasRef}
      className={cn('pointer-events-auto absolute inset-0 h-full w-full', className)}
    />
  );
}
