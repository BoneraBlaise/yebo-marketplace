/** Conversation Core — Phase 8B.1 + 8B.2 */

export { ConversationManager, createConversationManager } from "./ConversationManager";
export { SessionManager, createSessionManager } from "./SessionManager";
export { ConversationPipeline, createConversationPipeline } from "./ConversationPipeline";
export { ContextBuilder, createContextBuilder } from "./ContextBuilder";
export { MemoryInjector, createMemoryInjector } from "./MemoryInjector";
export { KnowledgeInjector, createKnowledgeInjector } from "./KnowledgeInjector";
export { createConversationContext } from "./ConversationContext";
export { logConversationDiagnostics } from "./ConversationDiagnostics";
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
