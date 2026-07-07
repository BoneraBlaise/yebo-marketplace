import { STORAGE_PROVIDER } from "./InfrastructureTypes";
import { logInfrastructureDiagnostics } from "./InfrastructureDiagnostics";

/** Storage provider adapter */
class StorageProviderAdapter {
  constructor({ id, label, store = null, retrieve = null, remove = null } = {}) {
    this.id = id;
    this.label = label;
    this.store = store;
    this.retrieve = retrieve;
    this.remove = remove;
  }
}

/** AI Storage Manager — Phase 8E */
export class StorageManager {
  constructor({ config = null, activeProvider = STORAGE_PROVIDER.LOCAL } = {}) {
    this.config = config;
    this.providers = new Map();
    this.activeProviderId = activeProvider;
    this._localStore = new Map();
    this._registerDefaults();
  }

  _registerDefaults() {
    const local = new StorageProviderAdapter({
      id: STORAGE_PROVIDER.LOCAL,
      label: "Local Storage",
      store: async (key, data) => {
        this._localStore.set(key, data);
        return { key, provider: STORAGE_PROVIDER.LOCAL };
      },
      retrieve: async (key) => this._localStore.get(key) || null,
      remove: async (key) => this._localStore.delete(key),
    });

    this.providers.set(STORAGE_PROVIDER.LOCAL, local);

    [STORAGE_PROVIDER.SUPABASE, STORAGE_PROVIDER.S3, STORAGE_PROVIDER.R2, STORAGE_PROVIDER.GCS, STORAGE_PROVIDER.AZURE].forEach(
      (id) => {
        this.providers.set(
          id,
          new StorageProviderAdapter({
            id,
            label: id.toUpperCase(),
            store: async (key) => ({ key, provider: id, stub: true }),
            retrieve: async () => null,
            remove: async () => false,
          })
        );
      }
    );
  }

  registerProvider(provider) {
    if (!provider?.id) throw new Error("StorageManager: provider requires id");
    this.providers.set(provider.id, provider);
    return provider;
  }

  setActiveProvider(providerId) {
    if (!this.providers.has(providerId)) {
      throw new Error(`StorageManager: unknown provider "${providerId}"`);
    }
    this.activeProviderId = providerId;
    logInfrastructureDiagnostics("storage", { action: "setProvider", providerId });
    return providerId;
  }

  getActiveProvider() {
    return this.providers.get(this.activeProviderId) || null;
  }

  listProviders() {
    return [...this.providers.values()].map((p) => ({
      id: p.id,
      label: p.label,
      active: p.id === this.activeProviderId,
      enabled: this.config?.storageProviders?.[p.id]?.enabled ?? p.id === STORAGE_PROVIDER.LOCAL,
    }));
  }

  async store(key, data) {
    const provider = this.getActiveProvider();
    if (!provider?.store) throw new Error("StorageManager: no active store handler");
    const result = await provider.store(key, data);
    logInfrastructureDiagnostics("storage", { action: "store", key, provider: provider.id });
    return result;
  }

  async retrieve(key) {
    const provider = this.getActiveProvider();
    if (!provider?.retrieve) return null;
    return provider.retrieve(key);
  }

  async remove(key) {
    const provider = this.getActiveProvider();
    if (!provider?.remove) return false;
    return provider.remove(key);
  }
}

export const createStorageManager = (options) => new StorageManager(options);

export default StorageManager;
