import { useCallback, useEffect, useRef } from 'react';

interface DebouncedFn<T extends (...args: never[]) => void> {
  (...args: Parameters<T>): void;
  flush: () => void;
  cancel: () => void;
}

export function useDebouncedCallback<T extends (...args: never[]) => void>(
  fn: T,
  delay: number,
): DebouncedFn<T> {
  const fnRef = useRef(fn);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const pendingArgsRef = useRef<Parameters<T> | null>(null);

  useEffect(() => {
    fnRef.current = fn;
  });

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const trigger = useCallback(
    (...args: Parameters<T>) => {
      clearTimeout(timerRef.current);
      pendingArgsRef.current = args;
      timerRef.current = setTimeout(() => {
        pendingArgsRef.current = null;
        fnRef.current(...args);
      }, delay);
    },
    [delay],
  );

  const flush = useCallback(() => {
    clearTimeout(timerRef.current);
    if (pendingArgsRef.current !== null) {
      const args = pendingArgsRef.current;
      pendingArgsRef.current = null;
      fnRef.current(...args);
    }
  }, []);

  const cancel = useCallback(() => {
    clearTimeout(timerRef.current);
    pendingArgsRef.current = null;
  }, []);

  return Object.assign(trigger, { flush, cancel }) as DebouncedFn<T>;
}
