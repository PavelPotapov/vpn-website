import { AnalyticsService } from './analyticsService';

export { AnalyticsService };
export { PlatformName } from './types';
export type { AnalyticsPlatform } from './types';
export { GTMPlatform } from './platforms';

export const analytics = AnalyticsService.getInstance();
