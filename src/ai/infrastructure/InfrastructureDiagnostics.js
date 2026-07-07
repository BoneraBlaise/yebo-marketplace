/** Development-only infrastructure diagnostics — Phase 8E */

const ALLOWED_CATEGORIES = new Set([
  "jobs",
  "assets",
  "cache",
  "storage",
  "history",
  "notifications",
  "cleanup",
  "lifecycle",
  "access",
  "infrastructure",
]);

export const logInfrastructureDiagnostics = (category, payload = {}) => {
  if (process.env.NODE_ENV !== "development") return;
  if (!ALLOWED_CATEGORIES.has(category)) return;

  const sanitized = { ...payload };
  delete sanitized.apiKey;
  delete sanitized.token;
  delete sanitized.secret;
  delete sanitized.password;

  // eslint-disable-next-line no-console
  console.info(`[AI Infrastructure ${category}]`, sanitized);
};

export default logInfrastructureDiagnostics;
