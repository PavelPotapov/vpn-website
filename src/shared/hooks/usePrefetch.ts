import type React from 'react';
import { useEffect, useLayoutEffect, useRef, useCallback } from 'react';

export function usePrefetchOnHover(
  prefetchFn: () => void,
  originalOnMouseEnter?: React.MouseEventHandler,
): { onMouseEnter: React.MouseEventHandler } {
  const called = useRef(false);

  const handleMouseEnter: React.MouseEventHandler = useCallback(
    (e) => {
      originalOnMouseEnter?.(e);
      if (called.current) return;
      called.current = true;
      prefetchFn();
    },
    [prefetchFn, originalOnMouseEnter],
  );

  return { onMouseEnter: handleMouseEnter };
}

export function usePrefetchOnIdle(prefetchFn: () => void): void {
  const prefetchRef = useRef(prefetchFn);
  useLayoutEffect(() => {
    prefetchRef.current = prefetchFn;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => prefetchRef.current());
      return () => window.cancelIdleCallback(id);
    } else {
      const id = setTimeout(() => prefetchRef.current(), 2000);
      return () => clearTimeout(id);
    }
  }, []);
}
