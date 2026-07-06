import { createProviderManager } from "./ProviderManager";
import { mergeOrchestrationConfig } from "./ProviderConfig";
import { ProviderContext } from "./ProviderContext";
import { providerEvents, PROVIDER_EVENT } from "./ProviderEvents";

/** Main AI orchestrator — Memory → Decision → Intelligence → Provider */
export class AIOrchestrator {
  constructor(deps = {}) {
    this.context = new ProviderContext(deps);
    this.providerManager = createProviderManager(deps.config);
    this.providerRegistry = this.providerManager.registry;
    this.router = this.providerManager.getRouter();
    this._initialized = false;
  }

  async initialize() {
    await this.providerManager.initializeAll();
    this._initialized = true;
    return this.getSnapshot();
  }

  get currentProvider() {
    return this.providerManager.getCurrentProvider();
  }

  switchProvider(id) {
    return this.providerManager.switchProvider(id);
  }

  getAvailableProviders() {
    return this.providerManager.getAvailableProviders();
  }

  getProviderHealth(providerId) {
    return this.providerManager.getProviderHealth(providerId);
  }

  /** Full pipeline: context → selection → adapter → mock response */
  async processRequest(input, options = {}) {
    const pipelineContext = this.context.buildPipelineContext();
    providerEvents.emit(PROVIDER_EVENT.REQUEST, { input, pipelineContext });

    const response = await this.router.route(input, {
      ...options,
      pipelineContext,
    });

    return {
      ...response,
      pipelineContext,
      mock: true,
    };
  }

  async processStream(input, options = {}) {
    const pipelineContext = this.context.buildPipelineContext();
    const { stream, resolvedProvider } = await this.router.routeStream(input, {
      ...options,
      pipelineContext,
    });
    return { stream, resolvedProvider, pipelineContext, mock: true };
  }

  updateConfig(partial) {
    this.context.config = mergeOrchestrationConfig({ ...this.context.config, ...partial });
    return this.providerManager.updateConfig(partial);
  }

  getSnapshot() {
    return {
      initialized: this._initialized,
      currentProvider: this.currentProvider,
      providers: this.getAvailableProviders(),
      health: this.getProviderHealth(),
      config: this.context.config,
      mock: true,
    };
  }
}

export const createAIOrchestrator = (deps) => {
  const orchestrator = new AIOrchestrator(deps);
  orchestrator.initialize();
  return orchestrator;
};

export default AIOrchestrator;
