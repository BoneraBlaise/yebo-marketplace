/**
 * Session storage adapter — architecture only.
 * Uses in-memory store by default; optionally mirrors to sessionStorage.
 * No backend persistence.
 */

const SESSION_KEY = "yebone_yebo_memory_v1";

export class MemoryStorage {
  constructor({ persistSession = false } = {}) {
    this.persistSession = persistSession;
    this.store = {};
    if (persistSession) this._hydrate();
  }

  get(key, fallback = null) {
    return this.store[key] ?? fallback;
  }

  set(key, value) {
    this.store[key] = value;
    if (this.persistSession) this._persist();
    return value;
  }

  update(key, updater) {
    const current = this.get(key);
    const next = typeof updater === "function" ? updater(current) : updater;
    return this.set(key, next);
  }

  remove(key) {
    delete this.store[key];
    if (this.persistSession) this._persist();
  }

  clear() {
    this.store = {};
    if (this.persistSession) {
      try {
        sessionStorage.removeItem(SESSION_KEY);
      } catch {
        /* ignore */
      }
    }
  }

  getAll() {
    return { ...this.store };
  }

  _hydrate() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) this.store = JSON.parse(raw);
    } catch {
      this.store = {};
    }
  }

  _persist() {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(this.store));
    } catch {
      /* quota / private mode */
    }
  }
}

export const createMemoryStorage = (options) => new MemoryStorage(options);

export default MemoryStorage;
