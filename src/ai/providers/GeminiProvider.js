import { BaseProvider } from "./BaseProvider";
import { mockResponse } from "./ProviderHelpers";
import { GeminiClient } from "./GeminiClient";
import { isGeminiConfigured, logGeminiDebug } from "./GeminiConfig";
import { PROVIDER_STATUS } from "./ProviderTypes";
import { sdkProviderEvents, SDK_PROVIDER_EVENT } from "./ProviderEvents";

export class GeminiProvider extends BaseProvider {
  constructor(config = {}) {
    super("gemini", config);
    this.geminiClient = new GeminiClient(config);
    this._useMock = !isGeminiConfigured();
    if (this._useMock) {
      logGeminiDebug("Gemini API key not configured — using mock provider", config.debugMode);
    }
  }

  async initialize() {
    if (this._useMock) {
      return super.initialize();
    }
    const init = await this.geminiClient.initialize();
    this._initialized = true;
    sdkProviderEvents.emit(SDK_PROVIDER_EVENT.INITIALIZED, { providerId: this.id, live: true });
    return { ...init, initialized: true };
  }

  async chat(input, options = {}) {
    if (this._useMock || !this.geminiClient.isLive()) {
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
      const payload = {
        ...live,
        latencyMs: Date.now() - start,
      };
      sdkProviderEvents.emit(SDK_PROVIDER_EVENT.CHAT, payload);
      return payload;
    } catch (err) {
      logGeminiDebug(`Live request failed — falling back to mock: ${err.message}`, this.config.debugMode);
      const res = await super.chat(input, options);
      return { ...res, mock: true, fallback: true };
    }
  }

  async stream(input, options = {}) {
    if (this._useMock || !this.geminiClient.isLive()) {
      return super.stream(input, options);
    }
    return super.stream(input, options);
  }

  async health() {
    if (this._useMock) {
      return {
        providerId: this.id,
        status: PROVIDER_STATUS.DEGRADED,
        mock: true,
        reason: "Gemini API key not configured",
        checkedAt: new Date().toISOString(),
      };
    }
    return super.health();
  }
}

export default GeminiProvider;
