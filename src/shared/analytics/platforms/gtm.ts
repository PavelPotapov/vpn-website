import type { AnalyticsPlatform } from '../types';

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

export class GTMPlatform implements AnalyticsPlatform {
  private static instance: GTMPlatform | null = null;

  constructor() {
    if (GTMPlatform.instance) {
      return GTMPlatform.instance;
    }
    GTMPlatform.instance = this;
  }

  isGtmLoaded() {
    window.dataLayer = window.dataLayer || [];
    const gtmStartedEvent = window.dataLayer.find((element) => element['gtm.start']);
    if (!gtmStartedEvent) return false;
    if (!gtmStartedEvent['gtm.uniqueEventId']) return false;
    return true;
  }

  public async sendEvent<T>(eventName: string, eventPayload: T, onEventSent?: () => void) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...(eventPayload as Record<string, unknown>),
    });
    onEventSent?.();
  }
}
