import { SESSION_STATUS } from "./ConversationTypes";
import { conversationEvents, CONVERSATION_EVENT } from "./ConversationEvents";
import { createSessionState } from "./ConversationState";

let sessionCounter = 0;

/** Single active session — prepared for future persistence */
export class SessionManager {
  constructor(conversationManager) {
    this.conversationManager = conversationManager;
    this.sessions = new Map();
    this.activeSessionId = null;
  }

  createSession(metadata = {}) {
    const conversation = this.conversationManager.createConversation();
    const sessionId = `session-${Date.now()}-${++sessionCounter}`;
    const session = {
      ...createSessionState(sessionId, conversation.id),
      metadata: { ...metadata },
    };
    this.sessions.set(sessionId, session);
    this.activeSessionId = sessionId;
    conversationEvents.emit(CONVERSATION_EVENT.SESSION_CREATED, {
      sessionId,
      conversationId: conversation.id,
    });
    return session;
  }

  getCurrentSession() {
    if (!this.activeSessionId) return null;
    return this.sessions.get(this.activeSessionId) || null;
  }

  switchSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session || session.status === SESSION_STATUS.DESTROYED) {
      return null;
    }
    this.activeSessionId = sessionId;
    session.updatedAt = new Date().toISOString();
    conversationEvents.emit(CONVERSATION_EVENT.SESSION_SWITCHED, { sessionId });
    return session;
  }

  destroySession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) return null;
    session.status = SESSION_STATUS.DESTROYED;
    session.updatedAt = new Date().toISOString();
    this.sessions.delete(sessionId);
    if (this.activeSessionId === sessionId) {
      this.activeSessionId = null;
    }
    conversationEvents.emit(CONVERSATION_EVENT.SESSION_DESTROYED, { sessionId });
    return session;
  }
}

export const createSessionManager = (conversationManager) =>
  new SessionManager(conversationManager);

export default SessionManager;
