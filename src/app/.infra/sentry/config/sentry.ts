import type { BrowserOptions } from '@sentry/react';

export const sentryConfig: BrowserOptions = {
  dsn: import.meta.env.VITE_SENTRY_DSN || '',
  environment: import.meta.env.VITE_ENV_VERSION || import.meta.env.MODE,
  release: import.meta.env.VITE_SENTRY_RELEASE || undefined,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,
};
