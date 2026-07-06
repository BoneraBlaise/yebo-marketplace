/** Decision engine pub/sub — architecture only. */

export const DECISION_EVENT = {
  GENERATED: "decision:generated",
  CONTEXT_UPDATE: "decision:context_update",
  RULE_APPLIED: "decision:rule_applied",
  CLEAR: "decision:clear",
};

class DecisionEventsBus {
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
}

export const DecisionEvents = new DecisionEventsBus();

export default DecisionEvents;
