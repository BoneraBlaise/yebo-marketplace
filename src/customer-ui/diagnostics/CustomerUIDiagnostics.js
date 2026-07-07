/** Development-only customer UI diagnostics — Phase 8H.2 */

export const logCustomerUIDiagnostics = (category, payload = {}) => {
  if (process.env.NODE_ENV !== "development") return;

  const allowed = new Set(["page", "navigation", "component"]);
  if (!allowed.has(category)) return;

  const sanitized = { ...payload };
  delete sanitized.apiKey;
  delete sanitized.token;
  delete sanitized.secret;
  delete sanitized.password;

  // eslint-disable-next-line no-console
  console.info(`[Customer UI ${category}]`, sanitized);
};

export default logCustomerUIDiagnostics;
