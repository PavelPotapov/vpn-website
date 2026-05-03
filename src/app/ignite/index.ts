import { initAnalytics } from '@/app/.infra/analytics';
import { initSentry } from '@/app/.infra/sentry';

export const igniteApp = () => {
  initSentry();
  initAnalytics();
};
