import { conversationEvents, CONVERSATION_EVENT } from "./ConversationEvents";

/** Active execution cancellation — optional and non-breaking */
export class ConversationCancellationManager {
  constructor() {
    this.activeExecutionId = null;
    this._cancelled = false;
    this._abortController = null;
  }

  begin(executionId) {
    this.activeExecutionId = executionId;
    this._cancelled = false;
    this._abortController = typeof AbortController !== "undefined" ? new AbortController() : null;
    return this._abortController?.signal || null;
  }

  cancel(reason = "cancelled") {
    this._cancelled = true;
    this._abortController?.abort();
    conversationEvents.emit(CONVERSATION_EVENT.PIPELINE_CANCELLED, {
      executionId: this.activeExecutionId,
      reason,
    });
    return { cancelled: true, reason, executionId: this.activeExecutionId };
  }

  isCancelled() {
    return this._cancelled;
  }

  check() {
    if (this._cancelled) {
      throw new Error("Conversation execution cancelled");
    }
  }

  cleanup() {
    this.activeExecutionId = null;
    this._abortController = null;
  }
}

export const createConversationCancellationManager = () => new ConversationCancellationManager();

export default ConversationCancellationManager;
