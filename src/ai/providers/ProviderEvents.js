/** Provider SDK pub/sub */
export const SDK_PROVIDER_EVENT = {
  INITIALIZED: "sdk:initialized",
  CHAT: "sdk:chat",
  STREAM_START: "sdk:stream_start",
  STREAM_CHUNK: "sdk:stream_chunk",
  STREAM_COMPLETE: "sdk:stream_complete",
  STREAM_CANCEL: "sdk:stream_cancel",
  HEALTH: "sdk:health",
  USAGE: "sdk:usage",
  SHUTDOWN: "sdk:shutdown",
  ERROR: "sdk:error",
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

export const sdkProviderEvents = new ProviderEvents();

export default sdkProviderEvents;
