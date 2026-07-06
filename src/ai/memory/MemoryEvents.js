/** Memory-specific pub/sub — architecture only, in-memory. */

export const MEMORY_EVENT = {
  SESSION_UPDATE: "memory:session_update",
  PREFERENCE_UPDATE: "memory:preference_update",
  PRODUCT_VIEW: "memory:product_view",
  SEARCH: "memory:search",
  COMPARE: "memory:compare",
  CART_SYNC: "memory:cart_sync",
  WISHLIST_SYNC: "memory:wishlist_sync",
  CONVERSATION: "memory:conversation",
  CONTEXT_CHANGE: "memory:context_change",
  REMINDER: "memory:reminder",
  CLEAR: "memory:clear",
};

class MemoryEventsBus {
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
    this.listeners.get(event)?.forEach((fn) => {
      try {
        fn(payload);
      } catch {
        /* presentation-only */
      }
    });
  }

  clear() {
    this.listeners.clear();
  }
}

export const MemoryEvents = new MemoryEventsBus();

export default MemoryEvents;
