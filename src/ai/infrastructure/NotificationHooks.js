import { NOTIFICATION_CHANNEL } from "./InfrastructureTypes";
import { logInfrastructureDiagnostics } from "./InfrastructureDiagnostics";

/** AI Notification Hooks — infrastructure only, no delivery — Phase 8E */
export class NotificationHooks {
  constructor() {
    this.hooks = new Map();
    this._registerDefaults();
  }

  _registerDefaults() {
    Object.values(NOTIFICATION_CHANNEL).forEach((channel) => {
      this.hooks.set(channel, []);
    });
  }

  register(channel, handler) {
    if (!this.hooks.has(channel)) this.hooks.set(channel, []);
    this.hooks.get(channel).push(handler);
    return () => this.unregister(channel, handler);
  }

  unregister(channel, handler) {
    const list = this.hooks.get(channel);
    if (!list) return;
    const idx = list.indexOf(handler);
    if (idx >= 0) list.splice(idx, 1);
  }

  emit(channel, event) {
    const handlers = this.hooks.get(channel) || [];
    logInfrastructureDiagnostics("notifications", {
      channel,
      event: event?.type || "unknown",
      handlerCount: handlers.length,
    });

    return handlers.map((handler) => {
      try {
        return { ok: true, result: handler(event) };
      } catch (err) {
        return { ok: false, error: err.message };
      }
    });
  }

  emitAll(event) {
    const results = {};
    for (const channel of this.hooks.keys()) {
      results[channel] = this.emit(channel, event);
    }
    return results;
  }

  listChannels() {
    return [...this.hooks.keys()];
  }
}

export const createNotificationHooks = () => new NotificationHooks();

export default NotificationHooks;
