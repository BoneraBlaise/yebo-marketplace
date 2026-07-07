import { createShortTermMemory } from "./ShortTermMemory";
import { createLongTermMemory } from "./LongTermMemory";
import { createMemoryProviderRegistry } from "./MemoryProvider";
import { rankMemoryItems } from "./MemoryScoring";
import { applyExpiration } from "./MemoryExpiration";
import { logMemoryDiagnostics } from "./MemoryDiagnostics";

/** Unified memory retrieval API — Phase 8C */
export class MemoryRetrieval {
  constructor({ engine = null, ttlMs = null } = {}) {
    this.engine = engine;
    this.shortTerm = createShortTermMemory(engine);
    this.longTerm = createLongTermMemory(engine);
    this.providers = createMemoryProviderRegistry();
    this.ttlMs = ttlMs;
    this._registerDefaults();
  }

  _registerDefaults() {
    this.providers.register({
      id: "short_term",
      label: "Short-term Memory",
      priority: 10,
      retrieve: (query, options) => this.shortTerm.retrieve(query, options).items,
    });
    this.providers.register({
      id: "long_term",
      label: "Long-term Memory",
      priority: 5,
      retrieve: (query, options) => this.longTerm.retrieve(query, options).items,
    });
  }

  registerProvider(provider) {
    return this.providers.register(provider);
  }

  retrieve(query = "", options = {}) {
    const startedAt = Date.now();
    const limit = options.limit ?? 10;

    const shortResult = this.shortTerm.retrieve(query, options);
    const longResult = this.longTerm.retrieve(query, options);
    const providerItems = this.providers.list().flatMap((provider) => {
      try {
        const items = provider.retrieve?.(query, options) || [];
        return (Array.isArray(items) ? items : []).map((item) => ({
          ...item,
          providerId: provider.id,
        }));
      } catch {
        return [];
      }
    });

    let items = [...shortResult.items, ...longResult.items, ...providerItems];
    items = applyExpiration(items, options.ttlMs ?? this.ttlMs);
    items = rankMemoryItems(items, query).slice(0, limit);

    const snapshot = this.engine?.getSnapshot?.() || null;

    const result = {
      query: String(query || ""),
      items,
      count: items.length,
      snapshot,
      scopes: ["short_term", "long_term"],
    };

    logMemoryDiagnostics({
      query: result.query,
      itemCount: result.count,
      shortTermCount: shortResult.items.length,
      longTermCount: longResult.items.length,
      elapsedMs: Date.now() - startedAt,
    });

    return result;
  }
}

export const createMemoryRetrieval = (options) => new MemoryRetrieval(options);

export default MemoryRetrieval;
