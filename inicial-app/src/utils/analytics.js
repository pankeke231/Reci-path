/**
 * Capa de analytics (stub).
 * Integrar con Expo Analytics, Firebase o Segment en producción.
 */
export const analytics = {
  track(event, properties = {}) {
    if (__DEV__) {
      console.log('[Analytics]', event, properties);
    }
  },
  identify(userId, traits = {}) {
    if (__DEV__) {
      console.log('[Analytics] identify', userId, traits);
    }
  },
};
