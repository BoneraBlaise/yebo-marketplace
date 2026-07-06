import { BaseProvider } from "./BaseProvider";
import { mockResponse } from "./ProviderHelpers";
import { OpenRouterClient } from "./openrouter/OpenRouterClient";
import { createOpenRouterLiveStream } from "./OpenRouterLiveStream";
import { isOpenRouterConfigured, logOpenRouterDebug } from "./openrouter/OpenRouterConfig";
import { PROVIDER_STATUS } from "./ProviderTypes";
import { sdkProviderEvents, SDK_PROVIDER_EVENT } from "./ProviderEvents";

export class OpenRouterProvider extends BaseProvider {
  constructor(config = {}) {
    super("openrouter", config);
    this.openRouterClient = new OpenRouterClient(config);
    this._useMock = !isOpenRouterConfigured();
    this._forceMock = false;
    this._liveHealthy = false;
    if (this._useMock) {
      logOpenRouterDebug("OpenRouter API key not configured — using mock provider");
    }
  }

  _shouldUseMock() {
    return this._useMock || this._forceMock || !this.openRouterClient.isLive();
  }

  _activateMockFallback(reason) {
    logOpenRouterDebug("fallback", { reason });
    this._forceMock = true;
    this._liveHealthy = false;
  }

  async initialize() {
    if (this._shouldUseMock()) {
      return super.initialize();
    }

    try {
      const init = await this.openRouterClient.initialize();
      const health = await this.openRouterClient.health();
      this._initialized = true;
      this._liveHealthy = health.healthy;
      sdkProviderEvents.emit(SDK_PROVIDER_EVENT.INITIALIZED, {
        providerId: this.id,
        live: true,
        model: init.model,
      });
      return { ...init, initialized: true, live: true };
    } catch (err) {
      this._activateMockFallback(`OpenRouter init failed (${err.message})`);
      return super.initialize();
    }
  }

  async chat(input, options = {}) {
    if (this._shouldUseMock()) {
      const res = await super.chat(input, options);
      return {
        ...res,
        model: this.capabilities.models?.text || "openrouter-mock",
        content: mockResponse("OpenRouter", input),
        mock: true,
      };
    }

    const start = Date.now();
    try {
      const live = await this.openRouterClient.chat(input, options);
      if (!live) {
        return super.chat(input, options);
      }
      this._liveHealthy = true;
      const payload = {
        ...live,
        latencyMs: Date.now() - start,
        mock: false,
      };
      sdkProviderEvents.emit(SDK_PROVIDER_EVENT.CHAT, payload);
      return payload;
    } catch (err) {
      this._activateMockFallback(`Live chat failed (${err.message})`);
      const res = await super.chat(input, options);
      return {
        ...res,
        model: this.capabilities.models?.text || "openrouter-mock",
        content: mockResponse("OpenRouter", input),
        mock: true,
        fallback: true,
      };
    }
  }

  async stream(input, options = {}) {
    if (this._shouldUseMock()) {
      return super.stream(input, options);
    }

    try {
      const liveStream = createOpenRouterLiveStream(this.id, () =>
        this.openRouterClient.createStreamGenerator(input, options)
      );
      this._activeStream = liveStream;
      liveStream.start();
      this._liveHealthy = true;
      return liveStream;
    } catch (err) {
      this._activateMockFallback(`Live stream failed (${err.message})`);
      return super.stream(input, options);
    }
  }

  async health() {
    if (this._shouldUseMock()) {
      return {
        providerId: this.id,
        status: PROVIDER_STATUS.DEGRADED,
        mock: true,
        fallback: Boolean(this._forceMock),
        reason: this._useMock
          ? "OpenRouter API key not configured"
          : "OpenRouter live path unavailable — mock fallback active",
        checkedAt: new Date().toISOString(),
      };
    }

    try {
      const health = await this.openRouterClient.health();
      this._liveHealthy = health.healthy;
      const entry = {
        providerId: this.id,
        status: PROVIDER_STATUS.HEALTHY,
        mock: false,
        live: true,
        model: health.model,
        checkedAt: new Date().toISOString(),
      };
      sdkProviderEvents.emit(SDK_PROVIDER_EVENT.HEALTH, entry);
      return entry;
    } catch (err) {
      this._liveHealthy = false;
      const entry = {
        providerId: this.id,
        status: PROVIDER_STATUS.DEGRADED,
        mock: false,
        live: false,
        fallbackAvailable: true,
        reason: err.message,
        checkedAt: new Date().toISOString(),
      };
      sdkProviderEvents.emit(SDK_PROVIDER_EVENT.HEALTH, entry);
      return entry;
    }
  }

  cancel() {
    this.openRouterClient.abort();
    if (this._activeStream) this._activeStream.cancel();
    return { providerId: this.id, cancelled: true };
  }

  async shutdown() {
    this.openRouterClient.abortActive();
    return super.shutdown();
  }
}

export default OpenRouterProvider;
