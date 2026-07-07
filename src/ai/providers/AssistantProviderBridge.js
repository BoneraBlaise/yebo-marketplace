import { BaseAdapter } from "./BaseAdapter";
import { MockAdapter } from "./MockAdapter";
import { OpenAIAdapter } from "./OpenAIAdapter";
import { GeminiAdapter } from "./GeminiAdapter";
import { ClaudeAdapter } from "./ClaudeAdapter";
import { LocalAdapter } from "./LocalAdapter";
import { isGeminiConfigured } from "./GeminiConfig";
import { isOpenRouterConfigured } from "./openrouter/OpenRouterConfig";
import { PROVIDER_STATUS } from "./ProviderTypes";
import {
  createConversationManager,
  createSessionManager,
  createConversationPipeline,
} from "../conversation";

const SDK_PROVIDER_IDS = new Set(["gemini", "openrouter"]);

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

const isSdkProviderConfigured = (providerId) => {
  if (providerId === "gemini") return isGeminiConfigured();
  if (providerId === "openrouter") return isOpenRouterConfigured();
  return false;
};

const getLiveIndicator = (providerId) => {
  if (providerId === "openrouter") {
    return { label: "OpenRouter Live", emoji: "🟢", key: "openrouter_live" };
  }
  return { label: "Gemini Live", emoji: "🟢", key: "gemini_live" };
};

/** Assistant panel provider indicator — presentation only */
export const ASSISTANT_PROVIDER_INDICATOR = {
  GEMINI_LIVE: { label: "Gemini Live", emoji: "🟢", key: "gemini_live" },
  OPENROUTER_LIVE: { label: "OpenRouter Live", emoji: "🟢", key: "openrouter_live" },
  MOCK_FALLBACK: { label: "Mock Fallback", emoji: "🟡", key: "mock_fallback" },
  OFFLINE: { label: "Offline", emoji: "🔴", key: "offline" },
};

/**
 * Bridges the legacy assistant adapter interface to the Provider SDK.
 * Resolves providers through ProviderFactory; MockAdapter is fallback only.
 */
export class SDKAssistantAdapter extends BaseAdapter {
  constructor(factory, preferredId = "openrouter") {
    super(preferredId, "YEBO Assistant SDK");
    this.factory = factory;
    this.preferredId = preferredId;
    this.mockAdapter = new MockAdapter();
    this.providerState = ASSISTANT_PROVIDER_INDICATOR.OFFLINE;
    this._lastHealth = null;
    this.conversationManager = createConversationManager();
    this.sessionManager = createSessionManager(this.conversationManager);
    this.sessionManager.createSession();
    this.conversationPipeline = createConversationPipeline({
      sessionManager: this.sessionManager,
      conversationManager: this.conversationManager,
      factory,
      resolveProvider: () => this._resolveSdkProvider(),
      prepareProvider: (provider) => this._prepareProviderForMessage(provider),
    });
  }

  _resolveSdkProvider() {
    // eslint-disable-next-line no-console
    console.info("[YEBO ProviderFactory] getProvider()", this.preferredId);
    return this.factory.getProvider(this.preferredId);
  }

  _prepareProviderForMessage(provider) {
    if (!isSdkProviderConfigured(this.preferredId)) return;
    provider._forceMock = false;
    provider._useMock = false;
    if (provider.geminiClient) {
      provider.geminiClient._ready = true;
    }
    if (provider.openRouterClient) {
      provider.openRouterClient._ready = true;
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
      this.providerState = getLiveIndicator(this.preferredId);
      return;
    }
    if (isSdkProviderConfigured(this.preferredId)) {
      this.providerState = getLiveIndicator(this.preferredId);
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
    if (isSdkProviderConfigured(this.preferredId)) {
      this.providerState = getLiveIndicator(this.preferredId);
    } else {
      this._setProviderState(this._lastHealth);
    }
    await this.mockAdapter.connect(config);
    this.connected = true;
    // eslint-disable-next-line no-console
    console.info("[YEBO Assistant] connect()", {
      provider: this.preferredId,
      configured: isSdkProviderConfigured(this.preferredId),
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
      provider: this.preferredId,
      preview: String(input || "").slice(0, 40),
    });
    try {
      // eslint-disable-next-line no-console
      console.info(`[YEBO ${this.preferredId}Provider] chat()`, {
        configured: isSdkProviderConfigured(this.preferredId),
      });
      const res = await this.conversationPipeline.executeComplete(input, options);
      // eslint-disable-next-line no-console
      console.info(`[YEBO ${this.preferredId}Provider] chat() result`, {
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
      console.warn(`[YEBO ${this.preferredId}Provider] chat() failed → MockAdapter fallback`, err.message);
      this.providerState = ASSISTANT_PROVIDER_INDICATOR.MOCK_FALLBACK;
      return this.mockAdapter.complete(input, options);
    }
  }

  async *stream(input, options = {}) {
    // eslint-disable-next-line no-console
    console.info("[YEBO Assistant] sendMessage → stream()", {
      provider: this.preferredId,
      preview: String(input || "").slice(0, 40),
    });
    try {
      // eslint-disable-next-line no-console
      console.info(`[YEBO ${this.preferredId}Provider] stream()`, {
        configured: isSdkProviderConfigured(this.preferredId),
      });
      for await (const chunk of this.conversationPipeline.executeStream(input, options)) {
        if (chunk) yield chunk;
      }
      const result = this.conversationPipeline.lastStreamResult || {};
      // eslint-disable-next-line no-console
      console.info(`[YEBO ${this.preferredId}Provider] stream() complete`, { live: result.live });
      this._setProviderState(this._lastHealth, {
        mock: !result.live,
        fallback: !result.live,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(`[YEBO ${this.preferredId}Provider] stream() failed → MockAdapter fallback`, err.message);
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

export const createAssistantAdapter = (providerId = "openrouter", factory) => {
  if (SDK_PROVIDER_IDS.has(providerId) && factory) {
    return new SDKAssistantAdapter(factory, providerId);
  }
  return createLegacyAdapter(providerId);
};

export default { SDKAssistantAdapter, createAssistantAdapter, ASSISTANT_PROVIDER_INDICATOR };
