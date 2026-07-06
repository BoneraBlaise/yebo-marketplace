import { getCapabilityProfile } from "./ProviderCapabilities";
import { PROVIDER_STATUS } from "./ProviderTypes";
import { delay, pickMockResponse } from "./ProviderHelpers";

/** Base mock orchestration adapter — common interface, no real API calls */
export class MockOrchestrationAdapter {
  constructor(def) {
    this.id = def.id;
    this.name = def.name;
    this.version = def.version || "1.0.0-mock";
    this.priority = def.priority ?? 50;
    this._health = def.healthStatus ?? PROVIDER_STATUS.HEALTHY;
    this._initialized = false;
    this._capabilityProfile = getCapabilityProfile(def.id);
  }

  async initialize(_config = {}) {
    await delay(120);
    this._initialized = true;
    return { ok: true, provider: this.id, mock: true };
  }

  async chat(input, _options = {}) {
    await delay(500 + Math.random() * 300);
    return {
      content: pickMockResponse(input, this.name),
      provider: this.id,
      mock: true,
      placeholder: true,
    };
  }

  async *stream(input, _options = {}) {
    const { content } = await this.chat(input);
    const words = content.split(" ");
    for (const word of words) {
      await delay(60);
      yield `${word} `;
    }
  }

  async embeddings(texts = []) {
    await delay(200);
    return {
      vectors: texts.map((t, i) => ({
        index: i,
        dimensions: 8,
        values: Array.from({ length: 8 }, (_, j) => ((t.length + j) % 10) / 10),
      })),
      provider: this.id,
      mock: true,
    };
  }

  async vision(_input) {
    await delay(300);
    return {
      description: `[${this.name}] Mock vision analysis — product attributes would be extracted.`,
      provider: this.id,
      mock: true,
    };
  }

  async moderation(text = "") {
    await delay(100);
    return {
      flagged: false,
      categories: {},
      text: text.slice(0, 80),
      provider: this.id,
      mock: true,
    };
  }

  health() {
    return {
      status: this._health,
      provider: this.id,
      initialized: this._initialized,
      latencyMs: this._health === PROVIDER_STATUS.HEALTHY ? 120 : null,
      mock: true,
    };
  }

  capabilities() {
    return {
      id: this.id,
      name: this.name,
      version: this.version,
      ...this._capabilityProfile,
      mock: true,
    };
  }

  async shutdown() {
    this._initialized = false;
    return { ok: true, provider: this.id };
  }

  setHealth(status) {
    this._health = status;
  }
}

const createMockAdapter = (def) => new MockOrchestrationAdapter(def);

/** Mock provider adapters — OpenAI, Gemini, Claude, Local, Custom */
export const MOCK_PROVIDER_ADAPTERS = {
  openai: createMockAdapter({
    id: "openai",
    name: "OpenAI",
    version: "gpt-4o-mock",
    priority: 90,
    healthStatus: PROVIDER_STATUS.UNAVAILABLE,
  }),
  gemini: createMockAdapter({
    id: "gemini",
    name: "Google Gemini",
    version: "gemini-2.0-mock",
    priority: 80,
    healthStatus: PROVIDER_STATUS.DEGRADED,
  }),
  claude: createMockAdapter({
    id: "claude",
    name: "Anthropic Claude",
    version: "claude-3.5-mock",
    priority: 85,
    healthStatus: PROVIDER_STATUS.HEALTHY,
  }),
  local: createMockAdapter({
    id: "local",
    name: "Local Model",
    version: "llama-local-mock",
    priority: 60,
    healthStatus: PROVIDER_STATUS.HEALTHY,
  }),
  custom: createMockAdapter({
    id: "custom",
    name: "Custom Provider",
    version: "custom-v1-mock",
    priority: 40,
    healthStatus: PROVIDER_STATUS.OFFLINE,
  }),
  mock: createMockAdapter({
    id: "mock",
    name: "Mock Provider",
    version: "mock-v1",
    priority: 10,
    healthStatus: PROVIDER_STATUS.HEALTHY,
  }),
};

export const createMockProvider = (id) => {
  const factory = MOCK_PROVIDER_ADAPTERS[id];
  if (!factory) return MOCK_PROVIDER_ADAPTERS.mock;
  return new MockOrchestrationAdapter({
    id: factory.id,
    name: factory.name,
    version: factory.version,
    priority: factory.priority,
    healthStatus: factory._health,
  });
};

export default MOCK_PROVIDER_ADAPTERS;
