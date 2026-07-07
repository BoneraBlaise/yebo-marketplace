import { createConversationContext } from "./ConversationContext";

/** Assembles base conversation context — no provider calls */
export class ContextBuilder {
  constructor({
    conversationManager,
    sessionManager,
    factory = null,
    resolveProvider = null,
    preferredProviderId = null,
  } = {}) {
    this.conversationManager = conversationManager;
    this.sessionManager = sessionManager;
    this.factory = factory;
    this.resolveProvider = resolveProvider;
    this.preferredProviderId = preferredProviderId;
  }

  buildContext({ input = "", session = null, conversationId = null } = {}) {
    const activeSession = session || this.sessionManager?.getCurrentSession?.() || null;
    const convId = conversationId || activeSession?.conversationId || null;
    const conversation = convId ? this.conversationManager.getConversation(convId) : null;
    const history = convId ? this.conversationManager.getHistory(convId) : [];

    let providerInstance = null;
    try {
      providerInstance = this.resolveProvider?.() || this.factory?.getActiveProvider?.() || null;
    } catch {
      providerInstance = null;
    }

    const factoryConfig = this.factory?.getConfiguration?.() || null;
    const provider = {
      id: providerInstance?.id || factoryConfig?.activeProvider || this.preferredProviderId || null,
      name: providerInstance?.name || null,
      configuration: factoryConfig,
    };

    return createConversationContext({
      conversation,
      history,
      session: activeSession,
      provider,
      metadata: {
        inputPreview: String(input || "").slice(0, 40),
        historyLength: history.length,
        sessionId: activeSession?.id || null,
        conversationId: convId,
        ...(activeSession?.metadata || {}),
      },
      timestamps: {
        builtAt: new Date().toISOString(),
        sessionCreatedAt: activeSession?.createdAt || null,
        conversationUpdatedAt: conversation?.updatedAt || null,
      },
    });
  }
}

export const createContextBuilder = (deps) => new ContextBuilder(deps);

export default ContextBuilder;
