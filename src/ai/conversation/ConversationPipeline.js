import { PIPELINE_STAGE } from "./ConversationTypes";
import { conversationEvents, CONVERSATION_EVENT } from "./ConversationEvents";
import { createPipelineState } from "./ConversationState";
import { createContextBuilder } from "./ContextBuilder";
import { createMemoryInjector } from "./MemoryInjector";
import { createKnowledgeInjector } from "./KnowledgeInjector";
import { createPromptComposer } from "./PromptComposer";
import { createSystemPromptManager } from "./SystemPromptManager";
import { logConversationDiagnostics } from "./ConversationDiagnostics";

/**
 * Conversation pipeline — orchestrates existing systems without changing them.
 * Stages: User Input → ConversationManager → ContextBuilder → MemoryInjector →
 * KnowledgeInjector → PromptComposer → ProviderFactory → Streaming/Response → Update
 */
export class ConversationPipeline {
  constructor({
    sessionManager,
    conversationManager,
    memoryEngine = null,
    knowledgeEngine = null,
    promptLibrary = null,
    factory = null,
    resolveProvider = null,
    prepareProvider = null,
    preferredProviderId = null,
  } = {}) {
    this.sessionManager = sessionManager;
    this.conversationManager = conversationManager;
    this.memoryEngine = memoryEngine;
    this.knowledgeEngine = knowledgeEngine;
    this.promptLibrary = promptLibrary;
    this.factory = factory;
    this.resolveProvider = resolveProvider;
    this.prepareProvider = prepareProvider;
    this.preferredProviderId = preferredProviderId;
    this.lastStreamResult = null;
    this.lastContext = null;

    this.contextBuilder = createContextBuilder({
      conversationManager,
      sessionManager,
      factory,
      resolveProvider,
      preferredProviderId,
    });
    this.memoryInjector = createMemoryInjector(memoryEngine);
    this.knowledgeInjector = createKnowledgeInjector(knowledgeEngine);
    this.promptComposer = createPromptComposer({
      systemPromptManager: createSystemPromptManager({
        promptLibrary: this.promptLibrary || undefined,
      }),
    });
    this.lastPrompt = null;
  }

  _emitStage(stage, payload = {}) {
    conversationEvents.emit(CONVERSATION_EVENT.PIPELINE_STAGE, { stage, ...payload });
  }

  _ensureSession() {
    return this.sessionManager.getCurrentSession() || this.sessionManager.createSession();
  }

  async _assembleContext(input, session) {
    const startedAt = Date.now();
    this._emitStage(PIPELINE_STAGE.CONTEXT_BUILD);

    let context = this.contextBuilder.buildContext({
      input,
      session,
      conversationId: session.conversationId,
    });

    this._emitStage(PIPELINE_STAGE.MEMORY);
    context = this.memoryInjector.inject(context);

    this._emitStage(PIPELINE_STAGE.KNOWLEDGE);
    context = await this.knowledgeInjector.inject(context, input);

    const elapsedMs = Date.now() - startedAt;
    logConversationDiagnostics(context, elapsedMs);
    this.lastContext = context;
    return context;
  }

  _runPromptStage(input, context) {
    this._emitStage(PIPELINE_STAGE.PROMPT);
    const composed = this.promptComposer.compose({ input, context });
    this.lastPrompt = composed;
    return composed;
  }

  async _invokeProvider(input, options, streaming = false) {
    this._emitStage(streaming ? PIPELINE_STAGE.STREAMING : PIPELINE_STAGE.PROVIDER);
    const provider = this.resolveProvider?.() || this.factory?.getActiveProvider?.();
    if (!provider) {
      throw new Error("ConversationPipeline: no provider available");
    }
    this.prepareProvider?.(provider);
    if (streaming) {
      return provider.stream(input, options);
    }
    return provider.chat(input, options);
  }

  async executeComplete(input, options = {}) {
    const pipelineState = createPipelineState();
    pipelineState.startedAt = new Date().toISOString();

    try {
      this._emitStage(PIPELINE_STAGE.USER_INPUT, { preview: String(input || "").slice(0, 40) });

      const session = this._ensureSession();
      pipelineState.sessionId = session.id;
      pipelineState.conversationId = session.conversationId;

      this.conversationManager.appendUserMessage(session.conversationId, input);

      this._emitStage(PIPELINE_STAGE.CONVERSATION_HISTORY);
      pipelineState.stagesCompleted.push(PIPELINE_STAGE.CONVERSATION_HISTORY);

      const context = await this._assembleContext(input, session);
      pipelineState.stagesCompleted.push(
        PIPELINE_STAGE.CONTEXT_BUILD,
        PIPELINE_STAGE.MEMORY,
        PIPELINE_STAGE.KNOWLEDGE
      );

      const prompt = this._runPromptStage(input, context);
      pipelineState.stagesCompleted.push(PIPELINE_STAGE.PROMPT);

      const providerInput = prompt.input;
      const response = await this._invokeProvider(providerInput, options, false);
      pipelineState.stagesCompleted.push(PIPELINE_STAGE.RESPONSE);

      this._emitStage(PIPELINE_STAGE.CONVERSATION_UPDATE);
      this.conversationManager.appendAssistantMessage(session.conversationId, response.content || "", {
        providerId: response.providerId,
        mock: response.mock,
        fallback: response.fallback,
      });
      pipelineState.stagesCompleted.push(PIPELINE_STAGE.CONVERSATION_UPDATE);

      pipelineState.completedAt = new Date().toISOString();
      conversationEvents.emit(CONVERSATION_EVENT.PIPELINE_COMPLETE, {
        sessionId: session.id,
        conversationId: session.conversationId,
        mode: "complete",
        stages: pipelineState.stagesCompleted,
      });

      return response;
    } catch (err) {
      conversationEvents.emit(CONVERSATION_EVENT.PIPELINE_ERROR, {
        mode: "complete",
        error: err.message,
      });
      throw err;
    }
  }

  async *executeStream(input, options = {}) {
    const pipelineState = createPipelineState();
    pipelineState.startedAt = new Date().toISOString();

    try {
      this._emitStage(PIPELINE_STAGE.USER_INPUT, { preview: String(input || "").slice(0, 40) });

      const session = this._ensureSession();
      pipelineState.sessionId = session.id;
      pipelineState.conversationId = session.conversationId;

      this.conversationManager.appendUserMessage(session.conversationId, input);

      this._emitStage(PIPELINE_STAGE.CONVERSATION_HISTORY);
      pipelineState.stagesCompleted.push(PIPELINE_STAGE.CONVERSATION_HISTORY);

      const context = await this._assembleContext(input, session);
      pipelineState.stagesCompleted.push(
        PIPELINE_STAGE.CONTEXT_BUILD,
        PIPELINE_STAGE.MEMORY,
        PIPELINE_STAGE.KNOWLEDGE
      );

      const prompt = this._runPromptStage(input, context);
      pipelineState.stagesCompleted.push(PIPELINE_STAGE.PROMPT);

      const providerInput = prompt.input;
      const streamController = await this._invokeProvider(providerInput, options, true);
      streamController.start();

      let accumulated = "";
      for await (const { chunk, done } of streamController.next()) {
        if (done) break;
        if (chunk) {
          accumulated += chunk;
          yield chunk;
        }
      }

      const result = streamController.complete();
      this.lastStreamResult = result;
      pipelineState.stagesCompleted.push(PIPELINE_STAGE.RESPONSE);

      this._emitStage(PIPELINE_STAGE.CONVERSATION_UPDATE);
      this.conversationManager.appendAssistantMessage(
        session.conversationId,
        accumulated || result.content || "",
        { live: result.live, streaming: true }
      );
      pipelineState.stagesCompleted.push(PIPELINE_STAGE.CONVERSATION_UPDATE);

      pipelineState.completedAt = new Date().toISOString();
      conversationEvents.emit(CONVERSATION_EVENT.PIPELINE_COMPLETE, {
        sessionId: session.id,
        conversationId: session.conversationId,
        mode: "stream",
        stages: pipelineState.stagesCompleted,
      });

      return result;
    } catch (err) {
      conversationEvents.emit(CONVERSATION_EVENT.PIPELINE_ERROR, {
        mode: "stream",
        error: err.message,
      });
      throw err;
    }
  }
}

export const createConversationPipeline = (deps) => new ConversationPipeline(deps);

export default ConversationPipeline;
