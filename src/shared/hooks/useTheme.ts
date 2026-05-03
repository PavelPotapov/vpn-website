import { useCallback, useEffect, useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'vpn-theme';

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system';
  return (localStorage.getItem(STORAGE_KEY) as Theme) ?? 'dark';
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
  return theme === 'system' ? getSystemTheme() : theme;
}

function applyTheme(theme: Theme) {
  const resolved = resolveTheme(theme);
  document.documentElement.classList.toggle('dark', resolved === 'dark');
}

let listeners: Array<() => void> = [];
let currentTheme: Theme = 'dark';

function subscribe(listener: () => void) {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot() {
  return currentTheme;
}

function getServerSnapshot(): Theme {
  return 'dark';
}

function setTheme(theme: Theme) {
  currentTheme = theme;
  localStorage.setItem(STORAGE_KEY, theme);
  applyTheme(theme);
  listeners.forEach((l) => l());
}

let initialized = false;

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (initialized) return;
    initialized = true;
    currentTheme = getStoredTheme();
    applyTheme(currentTheme);
    listeners.forEach((l) => l());

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (currentTheme === 'system') {
        applyTheme('system');
        listeners.forEach((l) => l());
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const set = useCallback((t: Theme) => setTheme(t), []);

  return {
    theme,
    resolvedTheme: resolveTheme(theme),
    setTheme: set,
  };
}
