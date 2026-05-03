import { useSyncExternalStore } from 'react';

import { BREAKPOINTS } from '@/shared/config';

const subscribe = (callback: () => void) => {
  const mql = window.matchMedia(`(max-width: ${BREAKPOINTS.md - 1}px)`);
  mql.addEventListener('change', callback);
  return () => mql.removeEventListener('change', callback);
};

const getSnapshot = () => window.innerWidth < BREAKPOINTS.md;
const getServerSnapshot = () => false;

export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
