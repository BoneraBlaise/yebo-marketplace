import { MESSAGE_ROLE, CONVERSATION_STATUS } from "./ConversationTypes";
import { conversationEvents, CONVERSATION_EVENT } from "./ConversationEvents";
import { createConversationState } from "./ConversationState";

let conversationCounter = 0;
let messageCounter = 0;

/** In-memory conversation store — stable IDs, no persistence yet */
export class ConversationManager {
  constructor() {
    this.conversations = new Map();
  }

  createConversation(id) {
    const conversationId = id || `conv-${Date.now()}-${++conversationCounter}`;
    if (this.conversations.has(conversationId)) {
      return this.conversations.get(conversationId);
    }
    const conversation = createConversationState(conversationId);
    this.conversations.set(conversationId, conversation);
    conversationEvents.emit(CONVERSATION_EVENT.CONVERSATION_CREATED, {
      conversationId,
    });
    return conversation;
  }

  getConversation(id) {
    return this.conversations.get(id) || null;
  }

  appendUserMessage(conversationId, content, extra = {}) {
    return this._appendMessage(conversationId, MESSAGE_ROLE.USER, content, extra);
  }

  appendAssistantMessage(conversationId, content, extra = {}) {
    return this._appendMessage(conversationId, MESSAGE_ROLE.ASSISTANT, content, extra);
  }

  _appendMessage(conversationId, role, content, extra = {}) {
    let conversation = this.getConversation(conversationId);
    if (!conversation) {
      conversation = this.createConversation(conversationId);
    }
    const message = {
      id: `cmsg-${Date.now()}-${++messageCounter}`,
      role,
      content,
      timestamp: new Date().toISOString(),
      ...extra,
    };
    conversation.messages.push(message);
    conversation.updatedAt = message.timestamp;
    conversationEvents.emit(CONVERSATION_EVENT.MESSAGE_APPENDED, {
      conversationId,
      messageId: message.id,
      role,
    });
    return message;
  }

  clearConversation(conversationId) {
    const conversation = this.getConversation(conversationId);
    if (!conversation) return null;
    conversation.messages = [];
    conversation.status = CONVERSATION_STATUS.CLEARED;
    conversation.updatedAt = new Date().toISOString();
    conversationEvents.emit(CONVERSATION_EVENT.CONVERSATION_CLEARED, { conversationId });
    return conversation;
  }

  getHistory(conversationId) {
    const conversation = this.getConversation(conversationId);
    return conversation ? [...conversation.messages] : [];
  }
}

export const createConversationManager = () => new ConversationManager();

export default ConversationManager;
