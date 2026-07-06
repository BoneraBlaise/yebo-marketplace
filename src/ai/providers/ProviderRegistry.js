import { BaseProvider } from "./BaseProvider";
import { UnknownProviderError } from "./ProviderErrors";
import { GeminiProvider } from "./GeminiProvider";
import { OpenRouterProvider } from "./OpenRouterProvider";
import { OpenAIProvider } from "./OpenAIProvider";
import { ClaudeProvider } from "./ClaudeProvider";
import { FashionProvider } from "./FashionProvider";
import { LocalProvider } from "./LocalProvider";
import { createHealthMonitor } from "./ProviderHealth";
import { createUsageTracker } from "./ProviderUsage";
import { mergeProviderConfig } from "./ProviderConfig";
import { getSDKCapabilities } from "./ProviderCapabilities";
import { PROVIDER_STATUS } from "./ProviderTypes";

const PROVIDER_CLASSES = {
  gemini: GeminiProvider,
  openrouter: OpenRouterProvider,
  openai: OpenAIProvider,
  claude: ClaudeProvider,
  fashion: FashionProvider,
  local: LocalProvider,
  mock: BaseProvider,
};

/** SDK provider registry */
export class ProviderRegistry {
  constructor(config = {}) {
    this.config = mergeProviderConfig(config);
    this.instances = new Map();
    this.activeId = this.config.preferredProvider || "mock";
    this.health = createHealthMonitor();
    this.usage = createUsageTracker();
  }

  register(id, instance) {
    this.instances.set(id, instance);
    return instance;
  }

  create(id) {
    const Cls = PROVIDER_CLASSES[id];
    if (!Cls) throw new UnknownProviderError(id);
    const instance = id === "mock" ? new BaseProvider("mock", this.config) : new Cls(this.config);
    this.register(id, instance);
    return instance;
  }

  get(id) {
    if (!this.instances.has(id)) this.create(id);
    return this.instances.get(id);
  }

  list() {
    return Object.keys(PROVIDER_CLASSES).map((id) => ({
      id,
      name: getSDKCapabilities(id).label,
      active: id === this.activeId,
    }));
  }

  async initializeAll() {
    const results = [];
    for (const id of Object.keys(PROVIDER_CLASSES)) {
      const p = this.get(id);
      const init = await p.initialize();
      const health = await p.health();
      this.health.setStatus(id, health.status || PROVIDER_STATUS.HEALTHY);
      results.push({ id, ...init });
    }
    return results;
  }

  setActive(id) {
    if (!PROVIDER_CLASSES[id]) throw new UnknownProviderError(id);
    this.activeId = id;
    return this.get(id);
  }

  getActive() {
    return this.get(this.activeId);
  }

  getHealthMonitor() {
    return this.health;
  }

  getUsageTracker() {
    return this.usage;
  }
}

export const createProviderRegistry = (config) => new ProviderRegistry(config);

export default ProviderRegistry;
