export const PlatformName = {
  GTM: 'GTM',
} as const;

export type PlatformName = (typeof PlatformName)[keyof typeof PlatformName];

export interface AnalyticsPlatform {
  sendEvent: <T>(eventName: string, eventPayload: T, onEventSent?: () => void) => void;
}
