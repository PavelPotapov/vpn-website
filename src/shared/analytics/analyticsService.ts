import type { AnalyticsPlatform } from './types';

type EventsNameMap = Record<string, Record<string, string>>;
type Mode = 'development' | 'production';

export class AnalyticsService<
  TEventsPayload extends Record<string, Record<string, unknown>> = Record<
    string,
    Record<string, unknown>
  >,
> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static instance: AnalyticsService<any>;

  private readonly platforms: Partial<Record<string, AnalyticsPlatform>> = {};
  private eventsNameMap: EventsNameMap = {};
  private mode: Mode = 'production';

  private constructor() {}

  public static getInstance<
    T extends Record<string, Record<string, unknown>> = Record<string, Record<string, unknown>>,
  >(): AnalyticsService<T> {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService<T>();
    }
    return AnalyticsService.instance as AnalyticsService<T>;
  }

  public setEventsNameMap(map: EventsNameMap) {
    this.eventsNameMap = map;
  }

  public registerPlatform(platformName: string, platform: AnalyticsPlatform) {
    this.platforms[platformName] = platform;
  }

  public switchMode = (mode: Mode) => {
    this.mode = mode;
  };

  public emitEvent<T extends keyof TEventsPayload & string>(
    eventTriggerName: T,
    eventPayload: TEventsPayload[T],
    onEventSent?: () => void,
  ) {
    for (const [platformKey, payloadToPlatform] of Object.entries(
      eventPayload as Record<string, unknown>,
    )) {
      const platform = this.platforms[platformKey];

      if (!platform) {
        if (this.mode === 'development') {
          console.warn(`Platform ${platformKey} is not registered.`);
        }
        return;
      }

      const eventName = this.eventsNameMap[platformKey]?.[eventTriggerName] ?? eventTriggerName;

      if (this.mode === 'development') {
        console.info(`[Analytics] ${platformKey}: "${eventName}"`, payloadToPlatform);
      }

      platform.sendEvent(eventName, payloadToPlatform, onEventSent);
    }
  }
}
