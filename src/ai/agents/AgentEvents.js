/** Agent platform pub/sub */
export const AGENT_EVENT = {
  REGISTERED: "agent:registered",
  ROUTED: "agent:routed",
  EXECUTING: "agent:executing",
  COMPLETED: "agent:completed",
  COLLABORATION: "agent:collaboration",
  ERROR: "agent:error",
};

export class AgentEvents {
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

export const agentEvents = new AgentEvents();

export default agentEvents;
