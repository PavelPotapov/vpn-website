import { analytics, GTMPlatform, PlatformName } from '@/shared/analytics';

import { loadGTM } from './lib/loadGTM';

export const initAnalytics = () => {
  loadGTM();
  const gtmInstance = new GTMPlatform();
  analytics.registerPlatform(PlatformName.GTM, gtmInstance);
};
