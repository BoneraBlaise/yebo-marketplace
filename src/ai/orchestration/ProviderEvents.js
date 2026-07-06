/** Orchestration pub/sub — provider lifecycle events */

export const PROVIDER_EVENT = {
  INITIALIZED: "provider:initialized",
  SWITCHED: "provider:switched",
  FALLBACK: "provider:fallback",
  HEALTH_CHANGE: "provider:health_change",
  REQUEST: "provider:request",
  RESPONSE: "provider:response",
  SHUTDOWN: "provider:shutdown",
};

export class ProviderEvents {
  constructor() {
    this.listeners = new Map();
  }

  on(event, handler) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event).add(handler);
    return () => this.off(event, handler);
  }

  off(event, handler) {
    this.listeners.get(event)?.delete(handler);
  }

  emit(event, payload) {
    this.listeners.get(event)?.forEach((fn) => fn(payload));
  }
}

export const providerEvents = new ProviderEvents();

export default providerEvents;
