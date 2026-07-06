import { BaseProvider } from "./BaseProvider";
import { mockResponse } from "./ProviderHelpers";
import { GeminiClient } from "./GeminiClient";
import { createGeminiLiveStream } from "./GeminiLiveStream";
import { isGeminiConfigured, logGeminiDebug } from "./GeminiConfig";
import { PROVIDER_STATUS } from "./ProviderTypes";
import { sdkProviderEvents, SDK_PROVIDER_EVENT } from "./ProviderEvents";

export class GeminiProvider extends BaseProvider {
  constructor(config = {}) {
    super("gemini", config);
    this.geminiClient = new GeminiClient(config);
    this._useMock = !isGeminiConfigured();
    this._forceMock = false;
    this._liveHealthy = false;
    if (this._useMock) {
      logGeminiDebug("Gemini API key not configured — using mock provider", config.debugMode);
    }
  }

  _shouldUseMock() {
    return this._useMock || this._forceMock || !this.geminiClient.isLive();
  }

  _activateMockFallback(reason) {
    logGeminiDebug(`${reason} — falling back to mock provider`, this.config.debugMode);
    this._forceMock = true;
    this._liveHealthy = false;
  }

  async initialize() {
    if (this._shouldUseMock()) {
      return super.initialize();
    }

    try {
      const init = await this.geminiClient.initialize();
      const health = await this.geminiClient.healthCheck();
      this._initialized = true;
      this._liveHealthy = health.healthy;
      sdkProviderEvents.emit(SDK_PROVIDER_EVENT.INITIALIZED, {
        providerId: this.id,
        live: true,
        model: init.model,
      });
      return { ...init, initialized: true, live: true };
    } catch (err) {
      this._activateMockFallback(`Gemini init failed (${err.message})`);
      return super.initialize();
    }
  }

  async chat(input, options = {}) {
    if (this._shouldUseMock()) {
      const res = await super.chat(input, options);
      return {
        ...res,
        model: this.capabilities.models?.text || "gemini-2.0-flash-mock",
        content: mockResponse("Gemini", input),
        mock: true,
      };
    }

    const start = Date.now();
    try {
      const live = await this.geminiClient.chat(input, options);
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
        model: this.capabilities.models?.text || "gemini-2.0-flash-mock",
        content: mockResponse("Gemini", input),
        mock: true,
        fallback: true,
      };
    }
  }

  async stream(input, options = {}) {
    if (this._shouldUseMock()) {
      const res = await super.stream(input, options);
      return res;
    }

    try {
      const liveStream = createGeminiLiveStream(this.id, () =>
        this.geminiClient.createStreamGenerator(input, options)
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
        status: this._forceMock ? PROVIDER_STATUS.DEGRADED : PROVIDER_STATUS.DEGRADED,
        mock: true,
        fallback: Boolean(this._forceMock),
        reason: this._useMock
          ? "Gemini API key not configured"
          : "Gemini live path unavailable — mock fallback active",
        checkedAt: new Date().toISOString(),
      };
    }

    try {
      const health = await this.geminiClient.healthCheck();
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

  async shutdown() {
    this.geminiClient.abortActive();
    return super.shutdown();
  }
}

export default GeminiProvider;
