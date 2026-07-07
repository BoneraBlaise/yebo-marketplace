/** Development-only admin UI diagnostics — Phase 8H.4 */

export const logAdminUIDiagnostics = (category, payload = {}) => {
  if (process.env.NODE_ENV !== "development") return;

  const allowed = new Set(["console", "navigation", "component", "viewModel", "performance"]);
  if (!allowed.has(category)) return;

  const sanitized = { ...payload };
  delete sanitized.apiKey;
  delete sanitized.token;
  delete sanitized.secret;
  delete sanitized.password;

  // eslint-disable-next-line no-console
  console.info(`[Admin UI ${category}]`, sanitized);
};

export default logAdminUIDiagnostics;
