import { PIPELINE_STAGE } from "./ConversationTypes";
import { conversationEvents, CONVERSATION_EVENT } from "./ConversationEvents";
import { createPipelineState } from "./ConversationState";
import { createContextBuilder } from "./ContextBuilder";
import { createMemoryInjector } from "./MemoryInjector";
import { createKnowledgeInjector } from "./KnowledgeInjector";
import { createPromptComposer } from "./PromptComposer";
import { createSystemPromptManager } from "./SystemPromptManager";
import { logConversationDiagnostics } from "./ConversationDiagnostics";
import { createActionManager } from "../actions";
import { createActionContext } from "../actions/ActionContext";
import { createActionDecisionEngine } from "../actions/ActionDecisionEngine";
import { logActionDiagnostics } from "../actions/ActionDiagnostics";
import { createReasoningInjector } from "./ReasoningInjector";
import { createContextOptimizationInjector } from "./ContextOptimizationInjector";
import { createConversationRecoveryManager } from "./ConversationRecoveryManager";
import { createConversationCancellationManager } from "./ConversationCancellationManager";
import { createConversationTimeoutManager } from "./ConversationTimeoutManager";
import { createConversationMetrics } from "./ConversationMetrics";
import { logConversationRecoveryDiagnostics } from "./ConversationRecoveryDiagnostics";

/**
 * Conversation pipeline — orchestrates existing systems without changing them.
 * Stages: User Input → Conversation → Context → Memory → Knowledge → Reasoning →
 * Context Optimization → Prompt → Action Decision → Provider → Streaming → Recovery → Conversation Update
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
    defaultTimeoutMs = 60000,
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
    this.actionManager = createActionManager();
    this.actionDecisionEngine = createActionDecisionEngine({ actionManager: this.actionManager });
    this.lastActionDecision = null;

    this.reasoningInjector = createReasoningInjector();
    this.contextOptimizationInjector = createContextOptimizationInjector();
    this.lastReasoning = null;
    this.lastOptimizedContext = null;

    this.recoveryManager = createConversationRecoveryManager();
    this.cancellationManager = createConversationCancellationManager();
    this.timeoutManager = createConversationTimeoutManager({ defaultTimeoutMs });
    this.metrics = createConversationMetrics();
  }

  cancel(reason = "cancelled") {
    return this.cancellationManager.cancel(reason);
  }

  _emitStage(stage, payload = {}) {
    conversationEvents.emit(CONVERSATION_EVENT.PIPELINE_STAGE, { stage, ...payload });
  }

  _ensureSession() {
    return this.sessionManager.getCurrentSession() || this.sessionManager.createSession();
  }

  _logRecovery(pipelineState, error = null) {
    this.recoveryManager.captureState(pipelineState);
    const recovery = this.recoveryManager.recover(error, pipelineState);
    const metrics = this.metrics.getSnapshot();
    logConversationRecoveryDiagnostics({
      retryCount: recovery.retryCount,
      timeout: this.timeoutManager.timedOut,
      cancelled: this.cancellationManager.isCancelled(),
      pipelineDuration: metrics.total,
      providerDuration: metrics.provider,
    });
    return recovery;
  }

  async _assembleContext(input, session) {
    const startedAt = Date.now();
    this._emitStage(PIPELINE_STAGE.CONTEXT_BUILD);
    this.cancellationManager.check();

    const contextStart = Date.now();
    let context = this.contextBuilder.buildContext({
      input,
      session,
      conversationId: session.conversationId,
    });
    context = {
      ...context,
      metadata: { ...context.metadata, query: String(input || "") },
    };
    this.metrics.record("context", Date.now() - contextStart);

    this._emitStage(PIPELINE_STAGE.MEMORY);
    const memoryStart = Date.now();
    context = this.memoryInjector.inject(context);
    this.metrics.record("memory", Date.now() - memoryStart);

    this._emitStage(PIPELINE_STAGE.KNOWLEDGE);
    const knowledgeStart = Date.now();
    context = await this.knowledgeInjector.inject(context, input);
    this.metrics.record("knowledge", Date.now() - knowledgeStart);

    this._emitStage(PIPELINE_STAGE.REASONING);
    const reasoningStart = Date.now();
    context = this.reasoningInjector.inject(context, input);
    this.metrics.record("reasoning", Date.now() - reasoningStart);
    this.lastReasoning = context.reasoning || null;

    this._emitStage(PIPELINE_STAGE.CONTEXT_OPTIMIZATION);
    const optimizationStart = Date.now();
    context = this.contextOptimizationInjector.inject(context);
    this.metrics.record("contextOptimization", Date.now() - optimizationStart);
    this.lastOptimizedContext = context;

    const elapsedMs = Date.now() - startedAt;
    logConversationDiagnostics(context, elapsedMs);
    this.lastContext = context;
    return context;
  }

  _runPromptStage(input, context) {
    const startedAt = Date.now();
    this._emitStage(PIPELINE_STAGE.PROMPT);
    this.cancellationManager.check();
    const composed = this.promptComposer.compose({ input, context });
    this.metrics.record("prompt", Date.now() - startedAt);
    this.lastPrompt = composed;
    return composed;
  }

  async _runActionDecisionStage(input, context, prompt) {
    const startedAt = Date.now();
    this._emitStage(PIPELINE_STAGE.ACTION_DECISION);
    this.cancellationManager.check();

    const actionContext = createActionContext({
      conversation: context.conversation,
      session: context.session,
      provider: context.provider,
      user: String(input || ""),
      organization: context.metadata || {},
      permissions: {},
      metadata: {
        promptSize: prompt?.assembledText?.length || 0,
        historyCount: context.history?.length || 0,
      },
    });

    const toolDecision = this.actionDecisionEngine.decide({
      input,
      context,
      reasoning: context.reasoning,
    });

    let decision = {
      ...toolDecision,
      input: prompt?.input ?? String(input || ""),
      actionContext,
    };

    if (toolDecision.shouldExecute) {
      decision = await this.actionDecisionEngine.executeIfNeeded(
        decision,
        actionContext,
        { query: input }
      );
    }

    this.metrics.record("action", Date.now() - startedAt);
    logActionDiagnostics({
      registeredActions: this.actionManager.listActions().length,
      selectedAction: decision.selectedAction,
      elapsedMs: Date.now() - startedAt,
    });

    this.lastActionDecision = decision;
    return decision;
  }

  _runRecoveryStage(pipelineState, error = null) {
    const startedAt = Date.now();
    this._emitStage(PIPELINE_STAGE.RECOVERY);
    const recovery = this._logRecovery(pipelineState, error);
    this.metrics.record("recovery", Date.now() - startedAt);
    return recovery;
  }

  async _invokeProvider(input, options, streaming = false) {
    const startedAt = Date.now();
    this._emitStage(streaming ? PIPELINE_STAGE.STREAMING : PIPELINE_STAGE.PROVIDER);
    this.cancellationManager.check();

    const provider = this.resolveProvider?.() || this.factory?.getActiveProvider?.();
    if (!provider) {
      throw new Error("ConversationPipeline: no provider available");
    }
    this.prepareProvider?.(provider);

    let result;
    if (streaming) {
      result = await provider.stream(input, options);
    } else {
      result = await provider.chat(input, options);
    }

    this.metrics.record("provider", Date.now() - startedAt);
    return result;
  }

  async _executeCompleteBody(input, options, pipelineState) {
    this._emitStage(PIPELINE_STAGE.USER_INPUT, { preview: String(input || "").slice(0, 40) });
    this.cancellationManager.check();

    const session = this._ensureSession();
    pipelineState.sessionId = session.id;
    pipelineState.conversationId = session.conversationId;
    this.recoveryManager.captureState(pipelineState);

    this.conversationManager.appendUserMessage(session.conversationId, input);

    this._emitStage(PIPELINE_STAGE.CONVERSATION_HISTORY);
    pipelineState.stagesCompleted.push(PIPELINE_STAGE.CONVERSATION_HISTORY);

    const context = await this._assembleContext(input, session);
    pipelineState.stagesCompleted.push(
      PIPELINE_STAGE.CONTEXT_BUILD,
      PIPELINE_STAGE.MEMORY,
      PIPELINE_STAGE.KNOWLEDGE,
      PIPELINE_STAGE.REASONING,
      PIPELINE_STAGE.CONTEXT_OPTIMIZATION
    );

    const prompt = this._runPromptStage(input, context);
    pipelineState.stagesCompleted.push(PIPELINE_STAGE.PROMPT);

    const actionDecision = await this._runActionDecisionStage(input, context, prompt);
    pipelineState.stagesCompleted.push(PIPELINE_STAGE.ACTION_DECISION);

    const providerInput = actionDecision.input;
    const response = await this._invokeProvider(providerInput, options, false);
    pipelineState.stagesCompleted.push(PIPELINE_STAGE.RESPONSE);

    this._runRecoveryStage(pipelineState);
    pipelineState.stagesCompleted.push(PIPELINE_STAGE.RECOVERY);

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
  }

  async executeComplete(input, options = {}) {
    const pipelineState = createPipelineState();
    pipelineState.startedAt = new Date().toISOString();
    const executionId = `exec-${Date.now()}`;
    const timeoutMs = options.timeoutMs ?? this.timeoutManager.defaultTimeoutMs;

    this.cancellationManager.begin(executionId);
    this.recoveryManager.reset();
    this.metrics.startPipeline();

    const run = () => this._executeCompleteBody(input, options, pipelineState);

    try {
      const response = await Promise.race([run(), this.timeoutManager.monitor(timeoutMs)]);
      this.metrics.finish();
      this._logRecovery(pipelineState);
      return response;
    } catch (err) {
      this._runRecoveryStage(pipelineState, err);
      this.metrics.finish();
      conversationEvents.emit(CONVERSATION_EVENT.PIPELINE_ERROR, {
        mode: "complete",
        error: err.message,
        timeout: this.timeoutManager.timedOut,
        cancelled: this.cancellationManager.isCancelled(),
      });
      throw err;
    } finally {
      this.timeoutManager.clear();
      this.cancellationManager.cleanup();
    }
  }

  async *executeStream(input, options = {}) {
    const pipelineState = createPipelineState();
    pipelineState.startedAt = new Date().toISOString();
    const executionId = `exec-stream-${Date.now()}`;
    const timeoutMs = options.timeoutMs ?? this.timeoutManager.defaultTimeoutMs;

    this.cancellationManager.begin(executionId);
    this.recoveryManager.reset();
    this.metrics.startPipeline();

    const timeoutPromise = this.timeoutManager.monitor(timeoutMs);
    timeoutPromise.catch(() => {
      /* handled via timedOut check */
    });

    try {
      this._emitStage(PIPELINE_STAGE.USER_INPUT, { preview: String(input || "").slice(0, 40) });
      this.cancellationManager.check();

      const session = this._ensureSession();
      pipelineState.sessionId = session.id;
      pipelineState.conversationId = session.conversationId;
      this.recoveryManager.captureState(pipelineState);

      this.conversationManager.appendUserMessage(session.conversationId, input);

      this._emitStage(PIPELINE_STAGE.CONVERSATION_HISTORY);
      pipelineState.stagesCompleted.push(PIPELINE_STAGE.CONVERSATION_HISTORY);

      const context = await this._assembleContext(input, session);
      pipelineState.stagesCompleted.push(
        PIPELINE_STAGE.CONTEXT_BUILD,
        PIPELINE_STAGE.MEMORY,
        PIPELINE_STAGE.KNOWLEDGE,
        PIPELINE_STAGE.REASONING,
        PIPELINE_STAGE.CONTEXT_OPTIMIZATION
      );

      const prompt = this._runPromptStage(input, context);
      pipelineState.stagesCompleted.push(PIPELINE_STAGE.PROMPT);

      const actionDecision = await this._runActionDecisionStage(input, context, prompt);
      pipelineState.stagesCompleted.push(PIPELINE_STAGE.ACTION_DECISION);

      const providerInput = actionDecision.input;
      const streamController = await this._invokeProvider(providerInput, options, true);
      streamController.start();

      let accumulated = "";
      for await (const { chunk, done } of streamController.next()) {
        if (this.timeoutManager.timedOut) {
          throw new Error("Conversation execution timed out");
        }
        this.cancellationManager.check();
        if (done) break;
        if (chunk) {
          accumulated += chunk;
          yield chunk;
        }
      }

      const result = streamController.complete();
      this.lastStreamResult = result;
      pipelineState.stagesCompleted.push(PIPELINE_STAGE.RESPONSE);

      this._runRecoveryStage(pipelineState);
      pipelineState.stagesCompleted.push(PIPELINE_STAGE.RECOVERY);

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

      this.metrics.finish();
      this._logRecovery(pipelineState);
      return result;
    } catch (err) {
      this._runRecoveryStage(pipelineState, err);
      this.metrics.finish();
      conversationEvents.emit(CONVERSATION_EVENT.PIPELINE_ERROR, {
        mode: "stream",
        error: err.message,
        timeout: this.timeoutManager.timedOut,
        cancelled: this.cancellationManager.isCancelled(),
      });
      throw err;
    } finally {
      this.timeoutManager.clear();
      this.cancellationManager.cleanup();
    }
  }
}

export const createConversationPipeline = (deps) => new ConversationPipeline(deps);

export default ConversationPipeline;
