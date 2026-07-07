/** Conversation Core — Phase 8B.1 */

export { ConversationManager, createConversationManager } from "./ConversationManager";
export { SessionManager, createSessionManager } from "./SessionManager";
export { ConversationPipeline, createConversationPipeline } from "./ConversationPipeline";
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
