/** Conversation Core — Phase 8B.1 + 8B.2 + 8B.3 + 8B.5 */

export { ConversationManager, createConversationManager } from "./ConversationManager";
export { SessionManager, createSessionManager } from "./SessionManager";
export { ConversationPipeline, createConversationPipeline } from "./ConversationPipeline";
export { ContextBuilder, createContextBuilder } from "./ContextBuilder";
export { MemoryInjector, createMemoryInjector } from "./MemoryInjector";
export { KnowledgeInjector, createKnowledgeInjector } from "./KnowledgeInjector";
export { PromptComposer, createPromptComposer } from "./PromptComposer";
export { SystemPromptManager, createSystemPromptManager } from "./SystemPromptManager";
export { createPromptContext } from "./PromptContext";
export { createConversationContext } from "./ConversationContext";
export { logConversationDiagnostics } from "./ConversationDiagnostics";
export { logPromptDiagnostics } from "./PromptDiagnostics";
export {
  ConversationRecoveryManager,
  createConversationRecoveryManager,
} from "./ConversationRecoveryManager";
export {
  ConversationCancellationManager,
  createConversationCancellationManager,
} from "./ConversationCancellationManager";
export {
  ConversationTimeoutManager,
  createConversationTimeoutManager,
} from "./ConversationTimeoutManager";
export { ConversationMetrics, createConversationMetrics } from "./ConversationMetrics";
export { logConversationRecoveryDiagnostics } from "./ConversationRecoveryDiagnostics";
export { ReasoningInjector, createReasoningInjector } from "./ReasoningInjector";
export {
  ContextOptimizationInjector,
  createContextOptimizationInjector,
} from "./ContextOptimizationInjector";
export {
  MESSAGE_ROLE,
  CONVERSATION_STATUS,
  SESSION_STATUS,
  PIPELINE_STAGE,
} from "./ConversationTypes";
export { conversationEvents, CONVERSATION_EVENT } from "./ConversationEvents";
export {
  createConversationState,
  createSessionState,
  createPipelineState,
} from "./ConversationState";
