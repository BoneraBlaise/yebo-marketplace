/** Development-only prompt composition diagnostics — Phase 8B.3 */

export const logPromptDiagnostics = ({
  promptSize = 0,
  historyCount = 0,
  memoryBlocks = 0,
  knowledgeBlocks = 0,
  provider = null,
  elapsedMs = 0,
} = {}) => {
  if (process.env.NODE_ENV !== "development") return;

  // eslint-disable-next-line no-console
  console.info("[Prompt]", {
    promptSize,
    historyCount,
    memoryBlocks,
    knowledgeBlocks,
    provider,
    elapsedMs,
  });
};

export default logPromptDiagnostics;
