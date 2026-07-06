/** Provider orchestration type constants — mock only, no live APIs */

export const PROVIDER_ID = {
  OPENAI: "openai",
  GEMINI: "gemini",
  CLAUDE: "claude",
  LOCAL: "local",
  CUSTOM: "custom",
  MOCK: "mock",
};

export const PROVIDER_STATUS = {
  HEALTHY: "healthy",
  UNAVAILABLE: "unavailable",
  DEGRADED: "degraded",
  OFFLINE: "offline",
};

export const SELECTION_STRATEGY = {
  AUTO: "auto",
  MANUAL: "manual",
  FASTEST: "fastest",
  CHEAPEST: "cheapest",
  HIGHEST_QUALITY: "highest_quality",
  LOCAL_ONLY: "local_only",
  PREFERRED: "preferred",
};

export default { PROVIDER_ID, PROVIDER_STATUS, SELECTION_STRATEGY };
