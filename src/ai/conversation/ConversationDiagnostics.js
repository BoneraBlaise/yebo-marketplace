/** Development-only conversation pipeline diagnostics — Phase 8B.2 */

export const logConversationDiagnostics = (context, elapsedMs = 0) => {
  if (process.env.NODE_ENV !== "development") return;

  const contextSize = (() => {
    try {
      return JSON.stringify(context).length;
    } catch {
      return 0;
    }
  })();

  // eslint-disable-next-line no-console
  console.info("[Conversation]", {
    contextSize,
    memoryInjected: Boolean(context?.memoryInjected ?? context?.memory),
    knowledgeInjected: Boolean(context?.knowledgeInjected ?? context?.knowledge),
    provider: context?.provider?.id || null,
    elapsedMs,
  });
};

export default logConversationDiagnostics;
