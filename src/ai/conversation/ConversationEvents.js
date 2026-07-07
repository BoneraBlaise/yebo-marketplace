/** Conversation Core pub/sub — in-memory, architecture only */

export const CONVERSATION_EVENT = {
  CONVERSATION_CREATED: "conversation:created",
  MESSAGE_APPENDED: "conversation:message_appended",
  CONVERSATION_CLEARED: "conversation:cleared",
  SESSION_CREATED: "conversation:session_created",
  SESSION_SWITCHED: "conversation:session_switched",
  SESSION_DESTROYED: "conversation:session_destroyed",
  PIPELINE_STAGE: "conversation:pipeline_stage",
  PIPELINE_COMPLETE: "conversation:pipeline_complete",
  PIPELINE_ERROR: "conversation:pipeline_error",
  PIPELINE_CANCELLED: "conversation:pipeline_cancelled",
  PIPELINE_TIMEOUT: "conversation:pipeline_timeout",
};

class ConversationEventsBus {
  constructor() {
    this.listeners = new Map();
  }

  on(event, handler) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event).add(handler);
    return () => this.off(event, handler);
  }

  off(event, handler) {
    this.listeners.get(event)?.delete(handler);
  }

  emit(event, payload) {
    this.listeners.get(event)?.forEach((fn) => {
      try {
        fn(payload);
      } catch {
        /* presentation-only */
      }
    });
  }
}

export const conversationEvents = new ConversationEventsBus();

export default conversationEvents;
