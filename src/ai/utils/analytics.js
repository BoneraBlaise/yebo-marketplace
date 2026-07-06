import { YIPEvents, YIP_EVENT } from "../core/YIPEvents";

/** In-memory analytics buffer — future export to backend. */
const events = [];

export const YIPAnalytics = {
  track(type, payload = {}) {
    const event = { type, payload, timestamp: Date.now() };
    events.push(event);
    YIPEvents.emit(YIP_EVENT.ANALYTICS, event);
    return event;
  },

  trackSearch(query) {
    return YIPAnalytics.track("search", { query });
  },

  trackRecommendation(featureId, payload) {
    return YIPAnalytics.track("recommendation", { featureId, ...payload });
  },

  trackAssistant(action) {
    return YIPAnalytics.track("assistant", { action });
  },

  trackTryOn(action) {
    return YIPAnalytics.track("try-on", { action });
  },

  trackVendorInsight(type) {
    return YIPAnalytics.track("vendor-insight", { type });
  },

  trackAdminInsight(type) {
    return YIPAnalytics.track("admin-insight", { type });
  },

  getEvents() {
    return [...events];
  },

  clear() {
    events.length = 0;
  },
};

export default YIPAnalytics;
