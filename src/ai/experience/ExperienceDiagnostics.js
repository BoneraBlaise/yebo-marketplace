/** Development-only experience diagnostics — Phase 8F */

export const logExperienceDiagnostics = (category, payload = {}) => {
  if (process.env.NODE_ENV !== "development") return;

  const allowed = new Set(["request", "dto", "permission", "viewModel", "service", "orchestrator"]);
  if (!allowed.has(category)) return;

  const sanitized = { ...payload };
  delete sanitized.apiKey;
  delete sanitized.token;
  delete sanitized.secret;
  delete sanitized.password;

  // eslint-disable-next-line no-console
  console.info(`[Experience ${category}]`, sanitized);
};

export default logExperienceDiagnostics;
