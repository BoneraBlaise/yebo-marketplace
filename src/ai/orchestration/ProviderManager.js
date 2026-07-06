import { MOCK_PROVIDER_ADAPTERS } from "./MockProviders";
import { createProviderHealth } from "./ProviderHealth";
import { createProviderRegistry } from "./ProviderRegistry";
import { createProviderFallback } from "./ProviderFallback";
import { createProviderSelector } from "./ProviderSelector";
import { ProviderRouter } from "./ProviderRouter";
import { mergeOrchestrationConfig } from "./ProviderConfig";
import { providerEvents, PROVIDER_EVENT } from "./ProviderEvents";
import { PROVIDER_STATUS } from "./ProviderTypes";

/** Manages provider adapter lifecycle */
export class ProviderManager {
  constructor(config = {}) {
    this.config = mergeOrchestrationConfig(config);
    this.registry = createProviderRegistry();
    this.health = createProviderHealth();
    this.adapters = new Map();
    this.currentProviderId = this.config.preferredProvider;
    this._initAdapters();
  }

  _initAdapters() {
    Object.entries(MOCK_PROVIDER_ADAPTERS).forEach(([id, adapter]) => {
      this.adapters.set(id, adapter);
      const health = adapter.health();
      this.health.register(id, health.status);
      this.registry.updateStatus(id, health.status);
    });
  }

  async initializeAll() {
    const results = [];
    for (const [id, adapter] of this.adapters.entries()) {
      const result = await adapter.initialize(this.config);
      const health = adapter.health();
      this.health.register(id, health.status);
      this.registry.updateStatus(id, health.status);
      results.push({ id, ...result });
      providerEvents.emit(PROVIDER_EVENT.INITIALIZED, { providerId: id });
    }
    return results;
  }

  getAdapter(id) {
    return this.adapters.get(id) || this.adapters.get("mock");
  }

  getCurrentAdapter() {
    return this.getAdapter(this.currentProviderId);
  }

  getCurrentProvider() {
    const entry = this.registry.get(this.currentProviderId);
    return entry ? { ...entry, health: this.health.get(this.currentProviderId) } : null;
  }

  switchProvider(id) {
    if (!this.adapters.has(id)) return this.getCurrentProvider();
    this.currentProviderId = id;
    this.config.preferredProvider = id;
    providerEvents.emit(PROVIDER_EVENT.SWITCHED, { providerId: id });
    return this.getCurrentProvider();
  }

  getAvailableProviders() {
    return this.registry.list().map((entry) => ({
      ...entry,
      health: this.health.get(entry.id),
      active: entry.id === this.currentProviderId,
    }));
  }

  getProviderHealth(providerId) {
    if (providerId) {
      const adapter = this.getAdapter(providerId);
      return adapter?.health() ?? { status: PROVIDER_STATUS.OFFLINE, provider: providerId };
    }
    return this.health.snapshot();
  }

  getRouter() {
    const fallback = createProviderFallback({ health: this.health });
    const selector = createProviderSelector({
      registry: this.registry,
      health: this.health,
      config: this.config,
    });
    return new ProviderRouter({
      manager: this,
      fallback,
      selector,
      config: this.config,
    });
  }

  updateConfig(partial) {
    this.config = mergeOrchestrationConfig({ ...this.config, ...partial });
    return this.config;
  }
}

export const createProviderManager = (config) => {
  const manager = new ProviderManager(config);
  manager.initializeAll();
  return manager;
};

export default ProviderManager;
