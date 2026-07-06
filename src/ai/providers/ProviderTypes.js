/** Provider SDK type constants — Phase 8A.1 */

export const PROVIDER_ID = {
  GEMINI: "gemini",
  OPENAI: "openai",
  CLAUDE: "claude",
  FASHION: "fashion",
  LOCAL: "local",
  MOCK: "mock",
};

export const MODEL_CATEGORY = {
  TEXT: "text",
  IMAGE: "image",
  EMBEDDING: "embedding",
  VISION: "vision",
  AUDIO: "audio",
};

export const PROVIDER_STATUS = {
  HEALTHY: "healthy",
  DEGRADED: "degraded",
  UNAVAILABLE: "unavailable",
  OFFLINE: "offline",
};

export const STREAM_STATE = {
  IDLE: "idle",
  STARTING: "starting",
  STREAMING: "streaming",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  ERROR: "error",
};

export default { PROVIDER_ID, MODEL_CATEGORY, PROVIDER_STATUS, STREAM_STATE };
