/** Development-only knowledge diagnostics — Phase 8C */

export const logKnowledgeDiagnostics = ({
  query = "",
  resultCount = 0,
  productHits = 0,
  organizationHits = 0,
  faqHits = 0,
  elapsedMs = 0,
} = {}) => {
  if (process.env.NODE_ENV !== "development") return;

  // eslint-disable-next-line no-console
  console.info("[Knowledge]", {
    query,
    resultCount,
    productHits,
    organizationHits,
    faqHits,
    elapsedMs,
  });
};

export default logKnowledgeDiagnostics;
