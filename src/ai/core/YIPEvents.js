/** Lightweight pub/sub for YIP lifecycle events. */

const listeners = new Map();

export const YIPEvents = {
  on(event, handler) {
    if (!listeners.has(event)) listeners.set(event, new Set());
    listeners.get(event).add(handler);
    return () => YIPEvents.off(event, handler);
  },

  off(event, handler) {
    listeners.get(event)?.delete(handler);
  },

  emit(event, payload) {
    listeners.get(event)?.forEach((handler) => {
      try {
        handler(payload);
      } catch {
        /* swallow in presentation layer */
      }
    });
  },
};

export const YIP_EVENT = {
  SESSION_START: "yip:session:start",
  SESSION_END: "yip:session:end",
  MESSAGE_SENT: "yip:message:sent",
  MESSAGE_RECEIVED: "yip:message:received",
  STREAM_START: "yip:stream:start",
  STREAM_CHUNK: "yip:stream:chunk",
  STREAM_END: "yip:stream:end",
  ERROR: "yip:error",
  PROVIDER_CHANGE: "yip:provider:change",
  CONTEXT_UPDATE: "yip:context:update",
  ANALYTICS: "yip:analytics",
};

export default YIPEvents;
