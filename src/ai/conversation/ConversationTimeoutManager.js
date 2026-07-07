import { conversationEvents, CONVERSATION_EVENT } from "./ConversationEvents";

/** Execution timeout monitoring — optional and non-breaking */
export class ConversationTimeoutManager {
  constructor({ defaultTimeoutMs = 60000 } = {}) {
    this.defaultTimeoutMs = defaultTimeoutMs;
    this._timer = null;
    this.timedOut = false;
  }

  monitor(timeoutMs = this.defaultTimeoutMs) {
    this.timedOut = false;
    this.clear();
    return new Promise((_, reject) => {
      this._timer = setTimeout(() => {
        this.timedOut = true;
        conversationEvents.emit(CONVERSATION_EVENT.PIPELINE_TIMEOUT, { timeoutMs });
        reject(new Error("Conversation execution timed out"));
      }, timeoutMs);
    });
  }

  clear() {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }
}

export const createConversationTimeoutManager = (options) =>
  new ConversationTimeoutManager(options);

export default ConversationTimeoutManager;
