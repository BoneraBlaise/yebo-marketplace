/** Long-term memory abstraction — Phase 8C */

export class LongTermMemory {
  constructor(engine) {
    this.engine = engine;
    this._store = new Map();
  }

  store(key, value, metadata = {}) {
    this._store.set(key, {
      key,
      value,
      metadata,
      storedAt: new Date().toISOString(),
    });
    return this._store.get(key);
  }

  get(key) {
    return this._store.get(key) || null;
  }

  list() {
    return [...this._store.values()];
  }

  retrieve(query = "", options = {}) {
    const q = String(query || "").toLowerCase();
    const limit = options.limit ?? 10;
    const items = [];

    if (this.engine?.getSnapshot) {
      const snap = this.engine.getSnapshot();
      const push = (type, data, score = 0.7) => {
        if (!data) return;
        const text = JSON.stringify(data).toLowerCase();
        if (!q || text.includes(q)) {
          items.push({ type, data, score, scope: "long_term" });
        }
      };
      push("preferences", snap.preferences, 0.85);
      push("recommendations", snap.recommendations, 0.8);
      push("dashboards", snap.dashboards, 0.75);
      push("visualization", snap.visualization, 0.6);
    }

    this.list().forEach((entry) => {
      const text = JSON.stringify(entry).toLowerCase();
      if (!q || text.includes(q)) {
        items.push({ type: "stored", data: entry, score: 0.9, scope: "long_term" });
      }
    });

    return { items: items.slice(0, limit), scope: "long_term", count: items.length };
  }
}

export const createLongTermMemory = (engine) => new LongTermMemory(engine);

export default LongTermMemory;
