import { pushUnique } from "./MemoryHelpers";
import { MemoryEvents, MEMORY_EVENT } from "./MemoryEvents";

/** Conversation memory — questions, intent, recommendations. */
export class ConversationMemory {
  constructor(storage) {
    this.storage = storage;
    if (!this.storage.get("conversation")) {
      this.storage.set("conversation", { turns: [], intents: [], recommendations: [] });
    }
  }

  get() {
    return this.storage.get("conversation", { turns: [], intents: [], recommendations: [] });
  }

  seed(mockTurns = []) {
    this.storage.set("conversation", {
      turns: mockTurns,
      intents: mockTurns.filter((t) => t.role === "user").map((t) => t.intent).filter(Boolean),
      recommendations: mockTurns.filter((t) => t.intent === "recommendation"),
    });
    MemoryEvents.emit(MEMORY_EVENT.CONVERSATION, this.get());
    return this.get();
  }

  addTurn(turn) {
    const conv = this.get();
    conv.turns = [{ ...turn, at: Date.now() }, ...(conv.turns || [])].slice(0, 50);
    if (turn.intent) {
      conv.intents = pushUnique(conv.intents || [], turn.intent, null, 20);
    }
    if (turn.recommendation) {
      conv.recommendations = pushUnique(conv.recommendations || [], turn.recommendation, "id", 20);
    }
    this.storage.set("conversation", conv);
    MemoryEvents.emit(MEMORY_EVENT.CONVERSATION, conv);
    return conv;
  }

  getLastIntent() {
    const conv = this.get();
    const lastUser = (conv.turns || []).find((t) => t.role === "user");
    return lastUser?.intent || conv.intents?.[0] || null;
  }

  getSnapshot() {
    const c = this.get();
    return {
      turns: [...(c.turns || [])],
      intents: [...(c.intents || [])],
      recommendations: [...(c.recommendations || [])],
      lastIntent: this.getLastIntent(),
    };
  }

  clear() {
    this.storage.set("conversation", { turns: [], intents: [], recommendations: [] });
  }
}

export const createConversationMemory = (storage) => new ConversationMemory(storage);

export default ConversationMemory;
