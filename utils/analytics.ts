/**
 * Capa de analytics (stub).
 * Integrar con Expo Analytics, Firebase o Segment en producción.
 */
export const analytics = {
  track(event: string, properties: Record<string, unknown> = {}): void {
    if (__DEV__) {
      console.log("[Analytics]", event, properties);
    }
  },
  identify(userId: string, traits: Record<string, unknown> = {}): void {
    if (__DEV__) {
      console.log("[Analytics] identify", userId, traits);
    }
  },
};
