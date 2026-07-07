/** Development-only vendor UI diagnostics — Phase 8H.3 */

export const logVendorUIDiagnostics = (category, payload = {}) => {
  if (process.env.NODE_ENV !== "development") return;

  const allowed = new Set(["workspace", "dashboard", "navigation", "component", "viewModel"]);
  if (!allowed.has(category)) return;

  const sanitized = { ...payload };
  delete sanitized.apiKey;
  delete sanitized.token;
  delete sanitized.secret;
  delete sanitized.password;

  // eslint-disable-next-line no-console
  console.info(`[Vendor UI ${category}]`, sanitized);
};

export default logVendorUIDiagnostics;
