/** Development-only memory diagnostics — Phase 8C */

export const logMemoryDiagnostics = ({
  query = "",
  itemCount = 0,
  shortTermCount = 0,
  longTermCount = 0,
  elapsedMs = 0,
} = {}) => {
  if (process.env.NODE_ENV !== "development") return;

  // eslint-disable-next-line no-console
  console.info("[Memory]", {
    query: query.slice(0, 40),
    itemCount,
    shortTermCount,
    longTermCount,
    elapsedMs,
  });
};

export default logMemoryDiagnostics;
