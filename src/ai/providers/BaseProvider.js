import { PROVIDER_STATUS } from "./ProviderTypes";
import { getSDKCapabilities } from "./ProviderCapabilities";
import { MockProviderClient } from "./MockProviderClient";
import { createStream } from "./ProviderStreaming";
import { delay, mockResponse, estimateTokens } from "./ProviderHelpers";
import { sdkProviderEvents, SDK_PROVIDER_EVENT } from "./ProviderEvents";

/** Abstract provider interface — all adapters extend this */
export class BaseProvider {
  constructor(id, config = {}) {
    this.id = id;
    this.config = config;
    this.capabilities = getSDKCapabilities(id);
    this.client = new MockProviderClient(id);
    this._initialized = false;
    this._activeStream = null;
  }

  get name() {
    return this.capabilities.label || this.id;
  }

  async initialize() {
    await delay(20);
    this._initialized = true;
    sdkProviderEvents.emit(SDK_PROVIDER_EVENT.INITIALIZED, { providerId: this.id });
    return { providerId: this.id, initialized: true, mock: true };
  }

  async chat(input, options = {}) {
    const start = Date.now();
    const res = await this.client.request("chat", {
      messages: [{ role: "user", content: input }],
      ...options,
    });
    const latencyMs = Date.now() - start;
    const payload = {
      providerId: this.id,
      content: res.content,
      tokens: res.tokens,
      latencyMs,
      mock: true,
    };
    sdkProviderEvents.emit(SDK_PROVIDER_EVENT.CHAT, payload);
    return payload;
  }

  async stream(input, options = {}) {
    const chatRes = await this.chat(input, options);
    this._activeStream = createStream(this.id, chatRes.content);
    this._activeStream.start();
    return this._activeStream;
  }

  async embeddings(input, options = {}) {
    await delay(30);
    const tokens = estimateTokens(input);
    return {
      providerId: this.id,
      model: this.capabilities.models?.embedding || "mock-embed",
      vector: Array.from({ length: 8 }, (_, i) => (tokens + i) * 0.01),
      dimensions: 8,
      tokens,
      mock: true,
    };
  }

  async vision(input, options = {}) {
    await delay(40);
    return {
      providerId: this.id,
      description: `[${this.name}] Mock vision analysis for image input.`,
      input: typeof input === "string" ? input.slice(0, 40) : "image-buffer",
      mock: true,
      ...options,
    };
  }

  async generateImage(prompt, options = {}) {
    await delay(50);
    return {
      providerId: this.id,
      prompt,
      url: `mock://image/${this.id}/${Date.now()}.png`,
      mock: true,
      ...options,
    };
  }

  async health() {
    const status = this._initialized ? PROVIDER_STATUS.HEALTHY : PROVIDER_STATUS.OFFLINE;
    const entry = { providerId: this.id, status, mock: true, checkedAt: new Date().toISOString() };
    sdkProviderEvents.emit(SDK_PROVIDER_EVENT.HEALTH, entry);
    return entry;
  }

  async usage() {
    return {
      providerId: this.id,
      requestCount: this.client.getRequestCount(),
      mock: true,
    };
  }

  async shutdown() {
    if (this._activeStream) this._activeStream.cancel();
    this._initialized = false;
    sdkProviderEvents.emit(SDK_PROVIDER_EVENT.SHUTDOWN, { providerId: this.id });
    return { providerId: this.id, shutdown: true };
  }
}

export default BaseProvider;
