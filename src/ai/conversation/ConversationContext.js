/** Standard Conversation Core context object — Phase 8B.2 */

export const createConversationContext = (partial = {}) => ({
  conversation: partial.conversation ?? null,
  history: partial.history ?? [],
  memory: partial.memory ?? null,
  knowledge: partial.knowledge ?? null,
  provider: partial.provider ?? null,
  session: partial.session ?? null,
  metadata: partial.metadata ?? {},
  timestamps: {
    builtAt: new Date().toISOString(),
    ...(partial.timestamps || {}),
  },
});

export default createConversationContext;
