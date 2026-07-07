/** Development-only reasoning diagnostics — Phase 8C */

export const logReasoningDiagnostics = ({
  query = "",
  stepCount = 0,
  conclusions = 0,
  confidence = 0,
  elapsedMs = 0,
} = {}) => {
  if (process.env.NODE_ENV !== "development") return;

  // eslint-disable-next-line no-console
  console.info("[Reasoning]", {
    query,
    stepCount,
    conclusions,
    confidence,
    elapsedMs,
  });
};

export default logReasoningDiagnostics;
