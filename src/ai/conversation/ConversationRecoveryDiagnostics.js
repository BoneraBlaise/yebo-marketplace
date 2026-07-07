/** Development-only conversation recovery diagnostics — Phase 8B.5 */

export const logConversationRecoveryDiagnostics = ({
  retryCount = 0,
  timeout = false,
  cancelled = false,
  pipelineDuration = 0,
  providerDuration = 0,
} = {}) => {
  if (process.env.NODE_ENV !== "development") return;

  // eslint-disable-next-line no-console
  console.info("[Conversation Recovery]", {
    retryCount,
    timeout,
    cancelled,
    pipelineDuration,
    providerDuration,
  });
};

export default logConversationRecoveryDiagnostics;
