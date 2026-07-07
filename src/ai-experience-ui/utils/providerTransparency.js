/** Never expose provider implementation to customers — Phase 8H.5 */

const HIDDEN_PROVIDERS = /gemini|openrouter|openai|anthropic|replicate|google|gpt|claude/i;

export const YEBO_AI_BRAND = "Powered by YEBO AI";

export const sanitizeForCustomer = (value) => {
  if (value == null) return value;
  if (typeof value === "string" && HIDDEN_PROVIDERS.test(value)) return YEBO_AI_BRAND;
  return value;
};

export const sanitizeAsset = (asset = {}) => ({
  ...asset,
  provider: undefined,
  feature: asset.feature || "preview",
  displayBrand: YEBO_AI_BRAND,
});

export const sanitizeJob = (job = {}) => ({
  ...job,
  provider: undefined,
  displayBrand: YEBO_AI_BRAND,
});

export default { YEBO_AI_BRAND, sanitizeForCustomer, sanitizeAsset, sanitizeJob };
