import { CONVERSATION_STATUS, SESSION_STATUS } from "./ConversationTypes";

/** Default Conversation Core state shapes */

export const createConversationState = (id) => ({
  id,
  status: CONVERSATION_STATUS.ACTIVE,
  messages: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  metadata: {},
});

export const createSessionState = (id, conversationId) => ({
  id,
  conversationId,
  status: SESSION_STATUS.ACTIVE,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  metadata: {},
  /** Reserved for future persistence */
  persistence: { enabled: false, store: null },
});

export const createPipelineState = () => ({
  stage: null,
  startedAt: null,
  completedAt: null,
  sessionId: null,
  conversationId: null,
  stagesCompleted: [],
});

export default {
  createConversationState,
  createSessionState,
  createPipelineState,
};
