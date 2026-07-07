/** Development-only commerce diagnostics — Phase 8D */

const ALLOWED_CATEGORIES = new Set([
  "subscription",
  "wallet",
  "billing",
  "usage",
  "roi",
  "analytics",
  "recommendations",
  "providerSelection",
  "previewCache",
  "creditPolicy",
  "previewOrchestrator",
  "capability",
  "commerce",
]);

export const logCommerceDiagnostics = (category, payload = {}) => {
  if (process.env.NODE_ENV !== "development") return;
  if (!ALLOWED_CATEGORIES.has(category)) return;

  const sanitized = { ...payload };
  delete sanitized.apiKey;
  delete sanitized.token;
  delete sanitized.secret;

  // eslint-disable-next-line no-console
  console.info(`[AI Commerce ${category}]`, sanitized);
};

export default logCommerceDiagnostics;
