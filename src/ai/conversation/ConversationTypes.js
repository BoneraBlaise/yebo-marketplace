/** Conversation Core type constants — Phase 8B.1 */

export const MESSAGE_ROLE = {
  USER: "user",
  ASSISTANT: "assistant",
  SYSTEM: "system",
};

export const CONVERSATION_STATUS = {
  ACTIVE: "active",
  CLEARED: "cleared",
  ARCHIVED: "archived",
};

export const SESSION_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  DESTROYED: "destroyed",
};

export const PIPELINE_STAGE = {
  USER_INPUT: "user_input",
  CONVERSATION_HISTORY: "conversation_history",
  CONTEXT_BUILD: "context_build",
  MEMORY: "memory",
  KNOWLEDGE: "knowledge",
  PROMPT: "prompt",
  PROVIDER: "provider",
  STREAMING: "streaming",
  RESPONSE: "response",
  CONVERSATION_UPDATE: "conversation_update",
};

export default {
  MESSAGE_ROLE,
  CONVERSATION_STATUS,
  SESSION_STATUS,
  PIPELINE_STAGE,
};
