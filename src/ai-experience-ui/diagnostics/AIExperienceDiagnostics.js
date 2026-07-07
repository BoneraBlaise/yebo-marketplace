/** Development-only AI experience diagnostics — Phase 8H.5 */

export const logAIExperienceDiagnostics = (category, payload = {}) => {
  if (process.env.NODE_ENV !== "development") return;

  const allowed = new Set(["preview", "lifecycle", "jobs", "history", "assets", "credits", "render", "performance"]);
  if (!allowed.has(category)) return;

  const sanitized = { ...payload };
  delete sanitized.apiKey;
  delete sanitized.token;
  delete sanitized.secret;
  delete sanitized.password;
  delete sanitized.provider;

  // eslint-disable-next-line no-console
  console.info(`[AI Experience ${category}]`, sanitized);
};

export default logAIExperienceDiagnostics;
