import { BaseAdapter } from "./BaseAdapter";
import { MockAdapter } from "./MockAdapter";
import { OpenAIAdapter } from "./OpenAIAdapter";
import { GeminiAdapter } from "./GeminiAdapter";
import { ClaudeAdapter } from "./ClaudeAdapter";
import { LocalAdapter } from "./LocalAdapter";
import { isGeminiConfigured } from "./GeminiConfig";
import { PROVIDER_STATUS } from "./ProviderTypes";

const LEGACY_ADAPTERS = {
  mock: MockAdapter,
  openai: OpenAIAdapter,
  gemini: GeminiAdapter,
  claude: ClaudeAdapter,
  local: LocalAdapter,
};

const createLegacyAdapter = (providerId = "mock") => {
  const Adapter = LEGACY_ADAPTERS[providerId] || MockAdapter;
  return new Adapter();
};

/** Assistant panel provider indicator — presentation only */
export const ASSISTANT_PROVIDER_INDICATOR = {
  GEMINI_LIVE: { label: "Gemini Live", emoji: "🟢", key: "gemini_live" },
  MOCK_FALLBACK: { label: "Mock Fallback", emoji: "🟡", key: "mock_fallback" },
  OFFLINE: { label: "Offline", emoji: "🔴", key: "offline" },
};

/**
 * Bridges the legacy assistant adapter interface to the Provider SDK.
 * Resolves Gemini through ProviderFactory; MockAdapter is fallback only.
 */
export class SDKAssistantAdapter extends BaseAdapter {
  constructor(factory, preferredId = "gemini") {
    super(preferredId, "YEBO Assistant SDK");
    this.factory = factory;
    this.preferredId = preferredId;
    this.mockAdapter = new MockAdapter();
    this.providerState = ASSISTANT_PROVIDER_INDICATOR.OFFLINE;
    this._lastHealth = null;
  }

  _resolveSdkProvider() {
    // eslint-disable-next-line no-console
    console.info("[YEBO ProviderFactory] getProvider()", this.preferredId);
    return this.factory.getProvider(this.preferredId);
  }

  _prepareProviderForMessage(provider) {
    if (!isGeminiConfigured()) return;
    provider._forceMock = false;
    provider._useMock = false;
    if (provider.geminiClient) {
      provider.geminiClient._ready = true;
    }
  }

  _setProviderState(health, responseMeta = {}) {
    if (responseMeta.fallback || responseMeta.mock) {
      this.providerState = ASSISTANT_PROVIDER_INDICATOR.MOCK_FALLBACK;
      return;
    }
    if (
      health?.status === PROVIDER_STATUS.OFFLINE ||
      health?.status === PROVIDER_STATUS.UNAVAILABLE
    ) {
      this.providerState = ASSISTANT_PROVIDER_INDICATOR.OFFLINE;
      return;
    }
    if (health?.live || (health?.status === PROVIDER_STATUS.HEALTHY && !health?.mock)) {
      this.providerState = ASSISTANT_PROVIDER_INDICATOR.GEMINI_LIVE;
      return;
    }
    if (isGeminiConfigured()) {
      this.providerState = ASSISTANT_PROVIDER_INDICATOR.GEMINI_LIVE;
      return;
    }
    this.providerState = ASSISTANT_PROVIDER_INDICATOR.MOCK_FALLBACK;
  }

  async connect(config) {
    await this.factory.initialize();
    try {
      this.factory.switchProvider(this.preferredId);
    } catch {
      /* registry may already be on preferred provider */
    }

    const provider = this._resolveSdkProvider();
    this._lastHealth = await provider.health();
    if (isGeminiConfigured()) {
      this.providerState = ASSISTANT_PROVIDER_INDICATOR.GEMINI_LIVE;
    } else {
      this._setProviderState(this._lastHealth);
    }
    await this.mockAdapter.connect(config);
    this.connected = true;
    // eslint-disable-next-line no-console
    console.info("[YEBO Assistant] connect()", {
      provider: this.preferredId,
      geminiConfigured: isGeminiConfigured(),
      indicator: this.providerState.key,
    });
    return this.connected;
  }

  isAvailable() {
    return this.mockAdapter.isAvailable() || this.connected;
  }

  async complete(input, options = {}) {
    // eslint-disable-next-line no-console
    console.info("[YEBO Assistant] sendMessage → complete()", {
      preview: String(input || "").slice(0, 40),
    });
    try {
      const provider = this._resolveSdkProvider();
      this._prepareProviderForMessage(provider);
      // eslint-disable-next-line no-console
      console.info("[YEBO GeminiProvider] chat() (generate)", {
        configured: isGeminiConfigured(),
        useMock: provider._useMock,
        forceMock: provider._forceMock,
      });
      const res = await provider.chat(input, options);
      // eslint-disable-next-line no-console
      console.info("[YEBO GeminiProvider] chat() result", {
        mock: res.mock,
        fallback: res.fallback,
        providerId: res.providerId,
      });
      this._setProviderState(this._lastHealth, res);
      return {
        content: res.content,
        placeholder: Boolean(res.mock || res.fallback),
        metadata: {
          provider: res.providerId,
          mock: res.mock,
          fallback: res.fallback,
        },
      };
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("[YEBO GeminiProvider] chat() failed → MockAdapter fallback", err.message);
      this.providerState = ASSISTANT_PROVIDER_INDICATOR.MOCK_FALLBACK;
      return this.mockAdapter.complete(input, options);
    }
  }

  async *stream(input, options = {}) {
    // eslint-disable-next-line no-console
    console.info("[YEBO Assistant] sendMessage → stream()", {
      preview: String(input || "").slice(0, 40),
    });
    try {
      const provider = this._resolveSdkProvider();
      this._prepareProviderForMessage(provider);
      // eslint-disable-next-line no-console
      console.info("[YEBO GeminiProvider] stream()", {
        configured: isGeminiConfigured(),
        useMock: provider._useMock,
        forceMock: provider._forceMock,
      });
      const streamController = await provider.stream(input, options);
      streamController.start();
      for await (const { chunk, done } of streamController.next()) {
        if (done) break;
        if (chunk) yield chunk;
      }
      const result = streamController.complete();
      // eslint-disable-next-line no-console
      console.info("[YEBO GeminiProvider] stream() complete", { live: result.live });
      this._setProviderState(this._lastHealth, {
        mock: !result.live,
        fallback: !result.live,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("[YEBO GeminiProvider] stream() failed → MockAdapter fallback", err.message);
      this.providerState = ASSISTANT_PROVIDER_INDICATOR.MOCK_FALLBACK;
      yield* this.mockAdapter.stream(input, options);
    }
  }

  getSuggestedPrompts() {
    return this.mockAdapter.getSuggestedPrompts();
  }

  getQuickActions() {
    return this.mockAdapter.getQuickActions();
  }

  getConversationHistory() {
    return this.mockAdapter.getConversationHistory();
  }

  getProviderIndicator() {
    return this.providerState;
  }

  getLastHealth() {
    return this._lastHealth;
  }
}

export const createAssistantAdapter = (providerId = "gemini", factory) => {
  if (providerId === "gemini" && factory) {
    return new SDKAssistantAdapter(factory, providerId);
  }
  return createLegacyAdapter(providerId);
};

export default { SDKAssistantAdapter, createAssistantAdapter, ASSISTANT_PROVIDER_INDICATOR };
