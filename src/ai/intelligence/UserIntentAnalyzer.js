/** Mock user intent from memory conversation state */
export class UserIntentAnalyzer {
  static analyze(memory = {}) {
    const conv = memory.conversation || {};
    const lastIntent = conv.lastIntent || memory.session?.conversationState?.lastIntent;
    const lastTopic = memory.session?.conversationState?.lastTopic;
    const recentSearch = memory.search?.recent?.[0];

    return {
      primary: lastIntent || "browse",
      topic: lastTopic || recentSearch || "general shopping",
      urgency: memory.cart?.items?.length ? "high" : "medium",
      stage: memory.cart?.items?.length ? "consideration" : "discovery",
      signals: [lastIntent, lastTopic, recentSearch].filter(Boolean),
    };
  }
}

export default UserIntentAnalyzer;
