import * as Sentry from '@sentry/react';

import { sentryConfig } from '../config/sentry';

export const initSentry = () => {
  if (!sentryConfig.dsn) {
    console.info('[Sentry] disabled (VITE_SENTRY_DSN not set)');
    return;
  }

  Sentry.init(sentryConfig);

  console.info(
    '[Sentry] enabled: env=%s release=%s',
    sentryConfig.environment,
    sentryConfig.release ?? '<unset>',
  );
};
