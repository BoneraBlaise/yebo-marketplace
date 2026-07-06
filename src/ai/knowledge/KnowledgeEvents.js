/** Knowledge platform pub/sub */
export const KNOWLEDGE_EVENT = {
  REGISTERED: "knowledge:registered",
  SEARCH: "knowledge:search",
  RESULT: "knowledge:result",
  CACHE_HIT: "knowledge:cache_hit",
  CACHE_MISS: "knowledge:cache_miss",
  SNAPSHOT: "knowledge:snapshot",
};

export class KnowledgeEvents {
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

export const knowledgeEvents = new KnowledgeEvents();

export default knowledgeEvents;
