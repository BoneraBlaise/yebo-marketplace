/** In-memory mock cache — no persistence */
export class KnowledgeCache {
  constructor(config = {}) {
    this.enabled = config.cacheEnabled !== false;
    this.ttlMs = config.cacheTtlMs ?? 300000;
    this.store = new Map();
  }

  _key(namespace, query) {
    return `${namespace}:${(query || "").toLowerCase().trim()}`;
  }

  get(namespace, query) {
    if (!this.enabled) return null;
    const entry = this.store.get(this._key(namespace, query));
    if (!entry) return null;
    if (Date.now() - entry.ts > this.ttlMs) {
      this.store.delete(this._key(namespace, query));
      return null;
    }
    return entry.value;
  }

  set(namespace, query, value) {
    if (!this.enabled) return;
    this.store.set(this._key(namespace, query), { value, ts: Date.now() });
  }

  clear() {
    this.store.clear();
  }

  snapshot() {
    return { size: this.store.size, enabled: this.enabled, mock: true };
  }
}

export const createKnowledgeCache = (config) => new KnowledgeCache(config);

export default KnowledgeCache;
