/** Central YIP configuration — no provider SDKs, mock mode by default. */

export const YIP_PUBLIC_NAME = "YEBO";
export const YIP_PLATFORM_NAME = "YIP";

export const defaultFeatureFlags = {
  "ai-search": false,
  "ai-recs": true,
  "ai-tryon": false,
  "ai-assistant": true,
  "ai-vendor": false,
  "ai-admin": true,
  "ai-streaming": false,
  "ai-voice": false,
  "ai-image-search": false,
  "ai-fraud": false,
};

export const defaultYIPConfig = {
  publicName: YIP_PUBLIC_NAME,
  platformName: YIP_PLATFORM_NAME,
  provider: "openrouter",
  model: "google/gemma-4-31b-it:free",
  temperature: 0.7,
  streaming: true,
  language: "en",
  region: "RW",
  mockMode: false,
  environment: typeof process !== "undefined" ? process.env.NODE_ENV : "development",
  featureFlags: { ...defaultFeatureFlags },
};

/** @type {import('../types').YIPConfigShape} */
let activeConfig = { ...defaultYIPConfig };

export const YIPConfig = {
  get: () => ({ ...activeConfig, featureFlags: { ...activeConfig.featureFlags } }),

  set: (partial) => {
    activeConfig = {
      ...activeConfig,
      ...partial,
      featureFlags: {
        ...activeConfig.featureFlags,
        ...(partial.featureFlags || {}),
      },
    };
    return YIPConfig.get();
  },

  reset: () => {
    activeConfig = { ...defaultYIPConfig, featureFlags: { ...defaultFeatureFlags } };
    return YIPConfig.get();
  },

  isFeatureEnabled: (flagId) => Boolean(activeConfig.featureFlags[flagId]),

  isMockMode: () => activeConfig.mockMode || activeConfig.provider === "mock",
};

export default YIPConfig;
