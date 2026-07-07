import { PIPELINE_STAGE } from "./ConversationTypes";
import { conversationEvents, CONVERSATION_EVENT } from "./ConversationEvents";
import { createPipelineState } from "./ConversationState";

/**
 * Conversation pipeline — orchestrates existing systems without changing them.
 * Stages: User Input → History → Memory → Knowledge → Prompt → Provider → Response → Update
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
  } = {}) {
    this.sessionManager = sessionManager;
    this.conversationManager = conversationManager;
    this.memoryEngine = memoryEngine;
    this.knowledgeEngine = knowledgeEngine;
    this.promptLibrary = promptLibrary;
    this.factory = factory;
    this.resolveProvider = resolveProvider;
    this.prepareProvider = prepareProvider;
    this.lastStreamResult = null;
  }

  _emitStage(stage, payload = {}) {
    conversationEvents.emit(CONVERSATION_EVENT.PIPELINE_STAGE, { stage, ...payload });
  }

  _ensureSession() {
    return this.sessionManager.getCurrentSession() || this.sessionManager.createSession();
  }

  _runMemoryStage(input) {
    this._emitStage(PIPELINE_STAGE.MEMORY);
    if (!this.memoryEngine) return null;
    try {
      if (typeof this.memoryEngine.getSnapshot === "function") {
        return this.memoryEngine.getSnapshot();
      }
      if (typeof this.memoryEngine.export === "function") {
        return this.memoryEngine.export();
      }
    } catch {
      /* optional stage — do not alter flow */
    }
    return null;
  }

  async _runKnowledgeStage(input) {
    this._emitStage(PIPELINE_STAGE.KNOWLEDGE);
    if (!this.knowledgeEngine) return null;
    try {
      if (typeof this.knowledgeEngine.search === "function") {
        return await this.knowledgeEngine.search(String(input || ""), { limit: 3 });
      }
    } catch {
      /* optional stage — do not alter flow */
    }
    return null;
  }

  _runPromptStage(input, _history, _memoryContext, _knowledgeContext) {
    this._emitStage(PIPELINE_STAGE.PROMPT);
    /** Backwards-compatible: pass user input through unchanged */
    if (this.promptLibrary?.render) {
      return { input, enriched: false, libraryAvailable: true };
    }
    return { input, enriched: false };
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
      const history = this.conversationManager.getHistory(session.conversationId);
      pipelineState.stagesCompleted.push(PIPELINE_STAGE.CONVERSATION_HISTORY);

      const memoryContext = this._runMemoryStage(input);
      pipelineState.stagesCompleted.push(PIPELINE_STAGE.MEMORY);

      const knowledgeContext = await this._runKnowledgeStage(input);
      pipelineState.stagesCompleted.push(PIPELINE_STAGE.KNOWLEDGE);

      const prompt = this._runPromptStage(input, history, memoryContext, knowledgeContext);
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
      const history = this.conversationManager.getHistory(session.conversationId);
      pipelineState.stagesCompleted.push(PIPELINE_STAGE.CONVERSATION_HISTORY);

      const memoryContext = this._runMemoryStage(input);
      pipelineState.stagesCompleted.push(PIPELINE_STAGE.MEMORY);

      const knowledgeContext = await this._runKnowledgeStage(input);
      pipelineState.stagesCompleted.push(PIPELINE_STAGE.KNOWLEDGE);

      const prompt = this._runPromptStage(input, history, memoryContext, knowledgeContext);
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
