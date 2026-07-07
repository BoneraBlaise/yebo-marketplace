import { logCommerceDiagnostics } from "./CommerceDiagnostics";

/** AI Preview Cache — Phase 8D */
export class PreviewCache {
  constructor({ ttlMs = 24 * 60 * 60 * 1000 } = {}) {
    this.ttlMs = ttlMs;
    this.entries = new Map();
  }

  buildKey({ ai_preview_type, productId, inputs = {} } = {}) {
    const normalized = JSON.stringify({ ai_preview_type, productId, inputs });
    return `preview:${normalized}`;
  }

  get(key) {
    const entry = this.entries.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.entries.delete(key);
      return null;
    }
    return { ...entry.value, cachedAt: entry.cachedAt };
  }

  set(key, value) {
    this.entries.set(key, {
      value,
      cachedAt: new Date().toISOString(),
      expiresAt: Date.now() + this.ttlMs,
    });
    return value;
  }

  has(key) {
    return Boolean(this.get(key));
  }

  clear() {
    this.entries.clear();
  }

  snapshot() {
    return {
      size: this.entries.size,
      ttlMs: this.ttlMs,
    };
  }
}

export const createPreviewCache = (options) => new PreviewCache(options);

export default PreviewCache;
