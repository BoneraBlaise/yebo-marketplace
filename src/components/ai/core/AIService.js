/**
 * @deprecated Use YIP MockAdapter via src/ai/providers — kept for backward compatibility.
 */
import { MockAdapter } from "../../../ai/providers/MockAdapter";

const adapter = new MockAdapter();

export const AIService = {
  sendMessage: async (message) => {
    const response = await adapter.complete(message);
    return {
      id: `msg-${Date.now()}`,
      role: "assistant",
      content: response.content,
      timestamp: new Date().toISOString(),
      placeholder: response.placeholder,
    };
  },
  getSuggestedPrompts: () => adapter.getSuggestedPrompts(),
  getQuickActions: () => adapter.getQuickActions(),
  getConversationHistory: () => adapter.getConversationHistory(),
  getTrendingSearches: () => [],
  isConnected: () => adapter.isAvailable(),
};

export default AIService;
