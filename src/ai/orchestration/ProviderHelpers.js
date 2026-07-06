import { PROVIDER_STATUS } from "./ProviderTypes";

export const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export const normalizeHealth = (status) => {
  const valid = Object.values(PROVIDER_STATUS);
  return valid.includes(status) ? status : PROVIDER_STATUS.OFFLINE;
};

export const isProviderUsable = (health) =>
  health === PROVIDER_STATUS.HEALTHY || health === PROVIDER_STATUS.DEGRADED;

export const sortProvidersByPriority = (providers) =>
  [...providers].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

export const pickMockResponse = (input, providerName) => {
  const text = (input || "").toLowerCase();
  if (text.includes("search") || text.includes("find")) {
    return `[${providerName}] Mock search intelligence — matching products would appear here.`;
  }
  if (text.includes("style") || text.includes("outfit")) {
    return `[${providerName}] Mock styling guidance — complementary picks would be suggested.`;
  }
  return `[${providerName}] Mock response via YEBO AI Orchestrator. No live API call was made.`;
};

export default { delay, normalizeHealth, isProviderUsable, sortProvidersByPriority, pickMockResponse };
