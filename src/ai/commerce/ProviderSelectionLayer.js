import { logCommerceDiagnostics } from "./CommerceDiagnostics";

/**
 * AI Provider Selection Layer — routes through Provider SDK only.
 * NEVER calls Gemini, OpenRouter, or any provider directly.
 * Phase 8D
 */
export class ProviderSelectionLayer {
  constructor({ factory = null, config = {} } = {}) {
    this.factory = factory;
    this.config = config;
    this.lastSelection = null;
  }

  setFactory(factory) {
    this.factory = factory;
    return this;
  }

  selectProvider({ service = null, preferredId = null } = {}) {
    if (!this.factory) {
      return { ok: false, error: "provider_factory_unavailable" };
    }

    const serviceMap = this.config.serviceProviderMap || {};
    const configuredId =
      preferredId ||
      (service && serviceMap[service]) ||
      this.config.defaultProviderId ||
      this.factory.registry?.activeId ||
      null;

    try {
      const provider = this.factory.getProvider(configuredId);
      const selection = {
        ok: true,
        providerId: provider?.id || configuredId,
        service,
        routedVia: "ProviderFactory",
        directProviderCall: false,
        selectedAt: new Date().toISOString(),
      };
      this.lastSelection = selection;
      logCommerceDiagnostics("providerSelection", {
        providerId: selection.providerId,
        service,
      });
      return { ...selection, provider };
    } catch (err) {
      return { ok: false, error: err.message, service };
    }
  }

  getLastSelection() {
    return this.lastSelection;
  }
}

export const createProviderSelectionLayer = (options) => new ProviderSelectionLayer(options);

export default ProviderSelectionLayer;
