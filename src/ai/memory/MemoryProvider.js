/** Pluggable memory provider abstraction — Phase 8C */

export class MemoryProvider {
  constructor({ id, label, retrieve = null, priority = 0 } = {}) {
    this.id = id || "default";
    this.label = label || this.id;
    this.retrieve = retrieve;
    this.priority = priority;
  }

  async get(query, options = {}) {
    if (typeof this.retrieve !== "function") return [];
    const result = await this.retrieve(query, options);
    return Array.isArray(result) ? result : result ? [result] : [];
  }
}

export class MemoryProviderRegistry {
  constructor() {
    this.providers = new Map();
  }

  register(provider) {
    if (!provider?.id) throw new Error("MemoryProviderRegistry: provider requires id");
    this.providers.set(provider.id, provider);
    return provider;
  }

  unregister(id) {
    return this.providers.delete(id);
  }

  list() {
    return [...this.providers.values()].sort((a, b) => b.priority - a.priority);
  }

  async retrieveAll(query, options = {}) {
    const merged = [];
    for (const provider of this.list()) {
      try {
        const items = await provider.get(query, options);
        merged.push(...items.map((item) => ({ ...item, providerId: provider.id })));
      } catch {
        /* fail-safe */
      }
    }
    return merged;
  }
}

export const createMemoryProvider = (options) => new MemoryProvider(options);
export const createMemoryProviderRegistry = () => new MemoryProviderRegistry();

export default MemoryProvider;
