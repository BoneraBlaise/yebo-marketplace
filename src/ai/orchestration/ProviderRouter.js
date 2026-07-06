import { MOCK_PROVIDER_ADAPTERS } from "./MockProviders";
import { createProviderFallback } from "./ProviderFallback";
import { createProviderSelector } from "./ProviderSelector";
import { providerEvents, PROVIDER_EVENT } from "./ProviderEvents";

/** Routes AI requests to selected provider with fallback */
export class ProviderRouter {
  constructor({ manager, fallback, selector, config }) {
    this.manager = manager;
    this.fallback = fallback;
    this.selector = selector;
    this.config = config;
  }

  async route(input, options = {}) {
    const preferred = options.providerId || this.selector.select();
    const resolvedId = this.config.fallbackEnabled
      ? this.fallback.resolve(preferred, true)
      : preferred;

    const adapter = this.manager.getAdapter(resolvedId);
    providerEvents.emit(PROVIDER_EVENT.REQUEST, { providerId: resolvedId, input });

    const response = await adapter.chat(input, options);
    providerEvents.emit(PROVIDER_EVENT.RESPONSE, { providerId: resolvedId, response });
    return { ...response, resolvedProvider: resolvedId };
  }

  async routeStream(input, options = {}) {
    const preferred = options.providerId || this.selector.select();
    const resolvedId = this.config.fallbackEnabled
      ? this.fallback.resolve(preferred, true)
      : preferred;
    const adapter = this.manager.getAdapter(resolvedId);
    return { stream: adapter.stream(input, options), resolvedProvider: resolvedId };
  }
}

export default ProviderRouter;
