import { createProviderRegistry } from "./ProviderRegistry";
import { mergeProviderConfig } from "./ProviderConfig";
import { UnknownProviderError } from "./ProviderErrors";
import { sdkProviderEvents, SDK_PROVIDER_EVENT } from "./ProviderEvents";
import { MockAdapter } from "./MockAdapter";
import { OpenAIAdapter } from "./OpenAIAdapter";
import { GeminiAdapter } from "./GeminiAdapter";
import { ClaudeAdapter } from "./ClaudeAdapter";
import { LocalAdapter } from "./LocalAdapter";

/** Legacy chat-panel adapters — unchanged Phase 7A contract */
const LEGACY_ADAPTERS = {
  mock: MockAdapter,
  openai: OpenAIAdapter,
  gemini: GeminiAdapter,
  claude: ClaudeAdapter,
  local: LocalAdapter,
};

export const createProviderAdapter = (providerId = "mock") => {
  const Adapter = LEGACY_ADAPTERS[providerId] || MockAdapter;
  return new Adapter();
};

export const listProviders = () =>
  Object.entries(LEGACY_ADAPTERS).map(([id, Adapter]) => ({
    id,
    label: new Adapter().label,
    available: new Adapter().isAvailable(),
  }));

/** SDK factory — returns provider instances by id */
export class ProviderFactory {
  constructor(config = {}) {
    this.config = mergeProviderConfig(config);
    this.registry = createProviderRegistry(this.config);
    this._initialized = false;
  }

  async initialize() {
    if (this._initialized) return this.getSnapshot();
    await this.registry.initializeAll();
    this._initialized = true;
    return this.getSnapshot();
  }

  getProvider(id) {
    const providerId = id || this.registry.activeId;
    try {
      return this.registry.get(providerId);
    } catch (err) {
      if (err instanceof UnknownProviderError) throw err;
      throw new UnknownProviderError(providerId);
    }
  }

  switchProvider(id) {
    const provider = this.registry.setActive(id);
    sdkProviderEvents.emit(SDK_PROVIDER_EVENT.INITIALIZED, {
      providerId: id,
      switched: true,
    });
    return provider;
  }

  getActiveProvider() {
    return this.registry.getActive();
  }

  listProviders() {
    return this.registry.list();
  }

  getHealthMonitor() {
    return this.registry.getHealthMonitor();
  }

  getUsageTracker() {
    return this.registry.getUsageTracker();
  }

  getConfiguration() {
    return { ...this.config, activeProvider: this.registry.activeId };
  }

  getSnapshot() {
    const active = this.registry.getActive();
    return {
      activeProvider: this.registry.activeId,
      providers: this.registry.list(),
      config: this.getConfiguration(),
      health: this.registry.getHealthMonitor().getAll(),
      usage: this.registry.getUsageTracker().getAllUsage(),
      initialized: this._initialized,
      mock: true,
    };
  }

  async shutdown() {
    for (const id of this.registry.instances.keys()) {
      await this.registry.get(id).shutdown();
    }
    this._initialized = false;
  }
}

let _singleton = null;

export const createProviderFactory = (config) => {
  _singleton = new ProviderFactory(config);
  return _singleton;
};

export const getProviderFactory = () => {
  if (!_singleton) _singleton = new ProviderFactory();
  return _singleton;
};

export const getProvider = (id) => getProviderFactory().getProvider(id);

export const switchProviderSDK = (id) => getProviderFactory().switchProvider(id);

export default ProviderFactory;
