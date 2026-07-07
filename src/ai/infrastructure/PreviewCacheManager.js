import { logInfrastructureDiagnostics } from "./InfrastructureDiagnostics";

/** Simple deterministic hash for cache keys — Phase 8E */
export const hashInputs = (inputs = {}) => {
  const str = JSON.stringify(inputs);
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return `h${Math.abs(hash).toString(36)}`;
};

/**
 * AI Preview Cache Manager — extends preview cache capabilities.
 * Works standalone; optionally wraps commerce PreviewCache without modifying it.
 * Phase 8E
 */
export class PreviewCacheManager {
  constructor({ ttlMs = 24 * 60 * 60 * 1000, commerceCache = null } = {}) {
    this.ttlMs = ttlMs;
    this.entries = new Map();
    this.hashIndex = new Map();
    this.commerceCache = commerceCache;
  }

  buildKey({ ai_preview_type, productId, inputs = {} } = {}) {
    const hash = hashInputs({ ai_preview_type, productId, inputs });
    return `preview:${ai_preview_type}:${productId || "none"}:${hash}`;
  }

  lookup(params = {}) {
    const key = this.buildKey(params);

    if (this.commerceCache?.get) {
      const commerceHit = this.commerceCache.get(key);
      if (commerceHit) {
        logInfrastructureDiagnostics("cache", { action: "lookup", hit: true, source: "commerce" });
        return { hit: true, key, value: commerceHit, source: "commerce" };
      }
    }

    const entry = this.entries.get(key);
    if (!entry || Date.now() > entry.expiresAt) {
      if (entry) this.entries.delete(key);
      logInfrastructureDiagnostics("cache", { action: "lookup", hit: false, key });
      return { hit: false, key, value: null };
    }

    logInfrastructureDiagnostics("cache", { action: "lookup", hit: true, key });
    return { hit: true, key, value: entry.value, source: "infrastructure" };
  }

  store(params = {}, value) {
    const key = this.buildKey(params);
    const hash = hashInputs(params);

    const record = {
      value,
      cachedAt: new Date().toISOString(),
      expiresAt: Date.now() + this.ttlMs,
      hash,
      params,
    };

    this.entries.set(key, record);
    this.hashIndex.set(hash, key);

    if (this.commerceCache?.set) {
      this.commerceCache.set(key, value);
    }

    logInfrastructureDiagnostics("cache", { action: "store", key, hash });
    return { key, hash, value };
  }

  invalidate(keyOrParams) {
    const key =
      typeof keyOrParams === "string" ? keyOrParams : this.buildKey(keyOrParams || {});
    const entry = this.entries.get(key);
    if (entry) {
      this.hashIndex.delete(entry.hash);
      this.entries.delete(key);
    }
    logInfrastructureDiagnostics("cache", { action: "invalidate", key });
    return { invalidated: Boolean(entry), key };
  }

  findDuplicate(params = {}) {
    const hash = hashInputs(params);
    const key = this.hashIndex.get(hash);
    if (!key) return { duplicate: false };
    const result = this.lookup(params);
    return { duplicate: result.hit, key, value: result.value };
  }

  listExpired() {
    const now = Date.now();
    return [...this.entries.entries()]
      .filter(([, entry]) => now > entry.expiresAt)
      .map(([key, entry]) => ({ key, hash: entry.hash, expiredAt: new Date(entry.expiresAt).toISOString() }));
  }

  snapshot() {
    return {
      size: this.entries.size,
      ttlMs: this.ttlMs,
      hashIndexSize: this.hashIndex.size,
      commerceWrapped: Boolean(this.commerceCache),
    };
  }
}

export const createPreviewCacheManager = (options) => new PreviewCacheManager(options);

export default PreviewCacheManager;
